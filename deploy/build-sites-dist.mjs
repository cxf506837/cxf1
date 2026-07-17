import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const frontendRoot = join(repoRoot, "frontend");
const distRoot = join(repoRoot, "dist");
const staticRoot = join(distRoot, "static");
const appRoot = join(frontendRoot, ".next", "server", "app");

function copyDir(source, target) {
  mkdirSync(target, { recursive: true });
  for (const entry of readdirSync(source)) {
    const from = join(source, entry);
    const to = join(target, entry);
    const info = statSync(from);
    if (info.isDirectory()) {
      copyDir(from, to);
    } else if (info.isFile()) {
      copyFileSync(from, to);
    }
  }
}

rmSync(distRoot, { recursive: true, force: true });
mkdirSync(join(distRoot, "server"), { recursive: true });
mkdirSync(join(staticRoot, "_next"), { recursive: true });

copyFileSync(join(repoRoot, "deploy", "sites-static-server.mjs"), join(distRoot, "server", "index.js"));
copyDir(join(frontendRoot, ".next", "static"), join(staticRoot, "_next", "static"));

if (existsSync(join(frontendRoot, "public"))) {
  copyDir(join(frontendRoot, "public"), staticRoot);
}

copyFileSync(join(appRoot, "index.html"), join(staticRoot, "index.html"));

for (const page of ["quality", "review", "rules", "settings", "_not-found"]) {
  copyFileSync(join(appRoot, `${page}.html`), join(staticRoot, `${page}.html`));
}

mkdirSync(join(staticRoot, "jobs"), { recursive: true });
for (const id of ["demo-orderops-202607", "demo-orderops-202606"]) {
  copyFileSync(join(appRoot, "jobs", `${id}.html`), join(staticRoot, "jobs", `${id}.html`));
}
