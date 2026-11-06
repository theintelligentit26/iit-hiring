import { cp, readdir, rm, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const assets = path.join(root, "assets");

await rm(assets, { recursive: true, force: true });
await mkdir(assets, { recursive: true });
await cp(path.join(dist, "assets"), assets, { recursive: true });
await cp(path.join(dist, "portal.html"), path.join(root, "index.html"));
await cp(path.join(dist, "ava-script.html"), path.join(root, "ava-script.html"));

const built = await readdir(assets);
if (!built.some((name) => name.endsWith(".js"))) {
  throw new Error("Pages build did not emit a JavaScript bundle.");
}
