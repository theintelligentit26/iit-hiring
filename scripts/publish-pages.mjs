import { cp, readdir, rm, mkdir, rename, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const assets = path.join(root, "assets");

await rm(assets, { recursive: true, force: true });
await mkdir(assets, { recursive: true });
await cp(path.join(dist, "assets"), assets, { recursive: true });
await cp(path.join(dist, "portal.html"), path.join(root, "index.html"));
await cp(path.join(dist, "ava-page.html"), path.join(root, "ava-script.html"));

const built = await readdir(assets);
if (!built.some((name) => name.endsWith(".js"))) {
  throw new Error("Pages build did not emit a JavaScript bundle.");
}

for (const name of built) {
  if (!/\s/.test(name)) continue;
  const safe = name.replace(/\s+/g, "");
  await rename(path.join(assets, name), path.join(assets, safe));
}
for (const file of ["index.html", "ava-script.html"]) {
  const target = path.join(root, file);
  const html = await readFile(target, "utf8");
  const cleaned = html.replace(/assets\/[^"']+/g, (ref) => ref.replace(/\s+/g, ""));
  if (cleaned !== html) await writeFile(target, cleaned);
}
