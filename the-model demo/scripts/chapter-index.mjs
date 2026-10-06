import { execFileSync } from "node:child_process"
import { readFileSync, statSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const SCRIPT_REL = "the-model demo/src/the-model/beats/script.ts"

/**
 * Per-chapter last-modified times for the PowerPoint films.
 *
 * Each chapter is a contiguous run of `beat()` calls in script.ts. The time
 * is the newest committer time among those lines. Lines edited since the
 * last commit are not in history yet, so a chapter that contains any of
 * them uses the script file's save time instead — that is the only
 * timestamp git can give an uncommitted line.
 */
export function loadChapters(demoRoot) {
  const repoRoot = path.resolve(demoRoot, "..")
  const scriptPath = path.join(demoRoot, "src/the-model/beats/script.ts")
  const segmentsPath = path.join(demoRoot, "src/the-model/beats/segments.ts")
  const script = readFileSync(scriptPath, "utf8")
  const segments = readFileSync(segmentsPath, "utf8")
  const beats = parseBeats(script)
  const chapters = parseChapters(segments)
  const blamed = blameLines(repoRoot)
  const savedAt = statSync(scriptPath).mtimeMs

  return chapters.map((chapter) => {
    const from = beats.findIndex((beat) => beat.id === chapter.from)
    const to = beats.findIndex((beat) => beat.id === chapter.to)
    if (from < 0 || to < 0 || to < from) {
      throw new Error(
        `Chapter ${chapter.slug} spans unknown beats ${chapter.from} → ${chapter.to}.`
      )
    }
    let committedAt = 0
    let uncommitted = false
    for (const beat of beats.slice(from, to + 1)) {
      for (let line = beat.start; line <= beat.end; line++) {
        const info = blamed.get(line)
        if (!info) continue
        if (info.uncommitted) uncommitted = true
        else if (info.timeMs > committedAt) committedAt = info.timeMs
      }
    }
    const at = uncommitted ? Math.max(committedAt, savedAt) : committedAt
    if (!at) {
      throw new Error(`Chapter ${chapter.slug} has no blame timestamps.`)
    }
    const stamp = formatStamp(at)
    return {
      slug: chapter.slug,
      title: chapter.title,
      href: `the-model.html?segment=${encodeURIComponent(chapter.slug)}`,
      uncommitted,
      text: stamp.text,
      iso: stamp.iso,
    }
  })
}

export function renderChapterRows(chapters) {
  return chapters
    .map((chapter) => {
      const local = chapter.uncommitted
        ? `<span class="local">uncommitted</span>`
        : ""
      return `<li>
      <a href="${escapeHtml(chapter.href)}">
        <span class="name">${escapeHtml(chapter.title)}</span>
        <span class="slug">${escapeHtml(chapter.slug)}</span>
        <time datetime="${escapeHtml(chapter.iso)}">${escapeHtml(chapter.text)}${local}</time>
      </a>
    </li>`
    })
    .join("\n")
}

export function renderChaptersPage(templatePath, demoRoot) {
  const template = readFileSync(templatePath, "utf8")
  const marker = "<!--CHAPTER_ROWS-->"
  if (!template.includes(marker)) {
    throw new Error(`chapters.html is missing ${marker}.`)
  }
  const rows = renderChapterRows(loadChapters(demoRoot))
  return template.replace(marker, rows)
}

export function chaptersIndexPlugin(demoRoot) {
  const templatePath = path.join(demoRoot, "chapters.html")
  return {
    name: "chapters-index",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = req.url?.split("?")[0]
        if (pathname !== "/chapters.html") return next()
        try {
          const html = renderChaptersPage(templatePath, demoRoot)
          res.statusCode = 200
          res.setHeader("Content-Type", "text/html; charset=utf-8")
          res.setHeader("Cache-Control", "no-store")
          res.end(html)
        } catch (error) {
          res.statusCode = 500
          res.setHeader("Content-Type", "text/plain; charset=utf-8")
          res.end(error instanceof Error ? (error.stack ?? error.message) : String(error))
        }
      })
    },
  }
}

function parseChapters(source) {
  const chapters = []
  const re =
    /\{\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*from:\s*"([^"]+)",\s*to:\s*"([^"]+)",/g
  for (const match of source.matchAll(re)) {
    chapters.push({
      slug: match[1],
      title: match[2],
      from: match[3],
      to: match[4],
    })
  }
  if (chapters.length === 0) {
    throw new Error("No chapters found in segments.ts.")
  }
  return chapters
}

function parseBeats(source) {
  const lines = source.split("\n")
  const beats = []
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s+beat\(\s*(?:"[^"]*")?\s*$/.test(lines[i])) continue
    const inline = lines[i].match(/beat\(\s*"([^"]+)"/)
    let id = inline?.[1] ?? null
    if (!id) {
      for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
        const match = lines[j].match(/^\s*"([^"]+)"\s*,?\s*$/)
        if (match) {
          id = match[1]
          break
        }
        if (lines[j].trim()) break
      }
    }
    if (!id) {
      throw new Error(`beat() at script.ts:${i + 1} has no id.`)
    }
    const end = closeCall(lines, i)
    beats.push({ id, start: i + 1, end: end + 1 })
    i = end
  }
  if (beats.length === 0) {
    throw new Error("No beat() calls found in script.ts.")
  }
  return beats
}

/** Line index (0-based) of the closing paren of the call that starts here. */
function closeCall(lines, start) {
  let depth = 0
  let started = false
  let quote = null
  let block = false
  for (let j = start; j < lines.length; j++) {
    const line = lines[j]
    for (let k = 0; k < line.length; k++) {
      const ch = line[k]
      const next = line[k + 1]
      if (block) {
        if (ch === "*" && next === "/") {
          block = false
          k++
        }
        continue
      }
      if (quote) {
        if (ch === "\\") {
          k++
          continue
        }
        if (ch === quote) quote = null
        continue
      }
      if (ch === "/" && next === "/") break
      if (ch === "/" && next === "*") {
        block = true
        k++
        continue
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        quote = ch
        continue
      }
      if (ch === "(") {
        depth++
        started = true
      } else if (ch === ")") {
        depth--
        if (started && depth === 0) return j
      }
    }
  }
  throw new Error(`Unclosed beat() starting at script.ts:${start + 1}.`)
}

function blameLines(repoRoot) {
  const porcelain = execFileSync(
    "git",
    ["blame", "--porcelain", "--", SCRIPT_REL],
    {
      cwd: repoRoot,
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
    }
  )
  const rows = porcelain.split("\n")
  const commits = new Map()
  const byLine = new Map()
  let i = 0
  while (i < rows.length) {
    const header = rows[i].match(/^([0-9a-f]{40}) \d+ (\d+)/)
    if (!header) {
      i++
      continue
    }
    const sha = header[1]
    const lineNo = Number(header[2])
    i++
    if (!commits.has(sha)) {
      let timeMs = 0
      while (i < rows.length && !rows[i].startsWith("\t")) {
        const time = rows[i].match(/^committer-time (\d+)/)
        if (time) timeMs = Number(time[1]) * 1000
        i++
      }
      commits.set(sha, {
        uncommitted: /^0+$/.test(sha),
        timeMs,
      })
    } else {
      while (i < rows.length && !rows[i].startsWith("\t")) i++
    }
    if (i < rows.length && rows[i].startsWith("\t")) i++
    byLine.set(lineNo, commits.get(sha))
  }
  return byLine
}

function formatStamp(ms) {
  const date = new Date(ms)
  const text = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date)
  return { text, iso: localIso(date) }
}

function localIso(date) {
  const pad = (n) => String(n).padStart(2, "0")
  const offset = -date.getTimezoneOffset()
  const sign = offset >= 0 ? "+" : "-"
  const abs = Math.abs(offset)
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
    `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
  )
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case "&":
        return "&amp;"
      case "<":
        return "&lt;"
      case ">":
        return "&gt;"
      case '"':
        return "&quot;"
      default:
        return "&#39;"
    }
  })
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
if (isMain) {
  const demoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
  for (const chapter of loadChapters(demoRoot)) {
    const flag = chapter.uncommitted ? "  uncommitted" : ""
    console.log(`${chapter.slug}\t${chapter.title}\t${chapter.text}${flag}`)
  }
}
