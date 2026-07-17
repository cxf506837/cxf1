import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../static/", import.meta.url));
const port = Number(process.env.PORT || 3000);

const types = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "application/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".ico", "image/x-icon"],
  [".txt", "text/plain; charset=utf-8"]
]);

function safePath(requestPath) {
  const decoded = decodeURIComponent(requestPath.split("?")[0] || "/");
  const normalized = normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  return normalized === "/" ? "/index.html" : normalized;
}

function htmlFallbackPath(requestPath) {
  const clean = safePath(requestPath).replace(/^[/\\]/, "");
  if (clean.endsWith(".html") || clean.includes(".")) {
    return clean;
  }
  return `${clean}.html`;
}

async function resolveFile(requestPath) {
  const candidates = [
    safePath(requestPath).replace(/^[/\\]/, ""),
    htmlFallbackPath(requestPath),
    "_not-found.html"
  ];

  for (const candidate of candidates) {
    const full = join(root, candidate);
    if (!full.startsWith(root)) continue;
    try {
      const info = await stat(full);
      if (info.isFile()) return full;
    } catch {
      // Try the next candidate.
    }
  }
  return join(root, "_not-found.html");
}

createServer(async (request, response) => {
  const file = await resolveFile(request.url || "/");
  const ext = extname(file);
  response.setHeader("content-type", types.get(ext) || "application/octet-stream");
  createReadStream(file).pipe(response);
}).listen(port, "0.0.0.0");
