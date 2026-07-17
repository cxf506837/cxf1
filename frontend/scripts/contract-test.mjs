import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceDirs = ["app", "components", "lib"].map((dir) => join(root, dir));
const sourceFiles = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (/\.(tsx|ts|css)$/.test(entry)) {
      sourceFiles.push(full);
    }
  }
}

for (const dir of sourceDirs) {
  walk(dir);
}

const combined = sourceFiles.map((file) => readFileSync(file, "utf8")).join("\n");
const forbidden = [
  "锟",
  "�",
  "浠",
  "璐",
  "浜哄",
  "瑙勫",
  "鐢熸",
  "涓嶇",
  "绯荤",
  "娌夋",
  "鏍蜂",
  "鏆傛"
];
const required = [
  "AI OrderOps Workbench",
  "生成脱敏演示任务",
  "真实后端演示",
  "运行真实脱敏任务",
  "访问密码",
  "PDF 或 ZIP",
  "ORDEROPS_BACKEND_URL",
  "/api/live",
  "下载真实 Excel",
  "人工审核",
  "规则沉淀",
  "样例 Excel"
];

const findings = [];
for (const marker of forbidden) {
  if (combined.includes(marker)) {
    findings.push(`found mojibake marker: ${marker}`);
  }
}
for (const marker of required) {
  if (!combined.includes(marker)) {
    findings.push(`missing required text: ${marker}`);
  }
}

if (findings.length > 0) {
  console.error(findings.join("\n"));
  process.exit(1);
}

console.log("frontend contract checks passed");
