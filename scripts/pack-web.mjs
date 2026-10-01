#!/usr/bin/env node
/**
 * Build a sendable offline zip. No Rust, no Electron.
 * Output: dist/THE-MODEL-keynote.zip
 */
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const keynote = join(root, "apps/keynote");
const staged = join(root, "dist/THE-MODEL-keynote");
const zipPath = join(root, "dist/THE-MODEL-keynote.zip");

const run = spawnSync("npm", ["run", "build:pack"], {
  cwd: keynote,
  stdio: "inherit",
  env: process.env,
});
if (run.status !== 0) process.exit(run.status ?? 1);

const built = join(keynote, "dist-pack/index.html");
const html = readFileSync(built, "utf8");
if (!html.includes("<div id=\"root\">")) {
  console.error("pack:web — index.html missing root");
  process.exit(1);
}

rmSync(staged, { recursive: true, force: true });
mkdirSync(staged, { recursive: true });
copyFileSync(built, join(staged, "index.html"));
copyFileSync(built, join(staged, "audience.html"));
copyFileSync(built, join(staged, "presenter.html"));
writeFileSync(join(staged, "RUN.txt"), readFileSync(join(root, "scripts/RUN.txt"), "utf8"));

rmSync(zipPath, { force: true });
const zip = spawnSync("zip", ["-r", "-q", zipPath, "THE-MODEL-keynote"], {
  cwd: join(root, "dist"),
  stdio: "inherit",
});
if (zip.status !== 0) {
  console.error("pack:web — zip failed. Is `zip` on PATH?");
  process.exit(zip.status ?? 1);
}

const kb = Math.round(readFileSync(zipPath).byteLength / 1024);
console.log(`pack:web — ${zipPath} (${kb} KB)`);
console.log("Open dist/THE-MODEL-keynote/audience.html in Chrome.");
