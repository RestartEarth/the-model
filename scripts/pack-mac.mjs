#!/usr/bin/env node
/**
 * Build a native Mac app via Tauri.
 * Output: dist/THE-MODEL.app (+ .dmg when bundling succeeds)
 * Does not change pack:web / the HTML zip.
 */
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const desktop = join(root, "apps/desktop");
const tauriTarget = join(desktop, "src-tauri/target/release/bundle");
const outDir = join(root, "dist");

const run = spawnSync("npm", ["run", "build", "-w", "desktop"], {
  cwd: root,
  stdio: "inherit",
  env: {
    ...process.env,
    PATH: `${join(process.env.HOME ?? "", ".cargo/bin")}:${process.env.PATH ?? ""}`,
  },
});
if (run.status !== 0) process.exit(run.status ?? 1);

mkdirSync(outDir, { recursive: true });

const macosDir = join(tauriTarget, "macos");
const dmgDir = join(tauriTarget, "dmg");
const appSrc = join(macosDir, "THE MODEL.app");
const appDst = join(outDir, "THE MODEL.app");

if (!existsSync(appSrc)) {
  console.error(`pack:mac — expected app missing: ${appSrc}`);
  process.exit(1);
}

rmSync(appDst, { recursive: true, force: true });
cpSync(appSrc, appDst, { recursive: true });

let dmgCopied = null;
if (existsSync(dmgDir)) {
  const dmgs = spawnSync("ls", [dmgDir], { encoding: "utf8" });
  const name = (dmgs.stdout ?? "")
    .split("\n")
    .map((s) => s.trim())
    .find((s) => s.endsWith(".dmg"));
  if (name) {
    const dst = join(outDir, name.replace(/\s+/g, "-"));
    cpSync(join(dmgDir, name), dst);
    dmgCopied = dst;
  }
}

const mb = (statSync(appDst).isDirectory()
  ? Number(
      spawnSync("du", ["-sm", appDst], { encoding: "utf8" }).stdout.split(
        "\t",
      )[0],
    )
  : Math.round(readFileSync(appDst).byteLength / (1024 * 1024)));

console.log(`pack:mac — ${appDst} (~${mb} MB)`);
if (dmgCopied) console.log(`pack:mac — ${dmgCopied}`);
console.log("Open dist/THE MODEL.app (ad-hoc / unsigned; Gatekeeper may prompt).");
console.log("House laptops: keep using npm run pack:web (HTML zip).");
