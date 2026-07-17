const jobs = [
  {
    id: "demo-orderops-202607",
    name: "脱敏订单演示批次 2026-07",
    createdAt: "2026-07-17 10:30",
    rows: [
      ["ODW-1001", "PEN-MULTI-5", "定制触控圆珠笔", "Multiple Color / 5 Pens", "Sam Studio", "Blue bag", "自动放行"],
      ["ODW-1002", "KEY-LEATHER-B", "皮革钥匙扣 B 款", "Coffee / Font 5", "Narelle", "Grey bag", "人工审核"],
      ["ODW-1003", "BOX-RING-WOOD", "木质戒指盒", "Walnut / 2 Slots", "Mr. & Mrs. Kitt, 06.06.26", "Grey bag", "自动放行"],
      ["ODW-1004", "MUG-CERAMIC-01", "定制陶瓷杯", "White / Font 2", "Meet you at the bar", "Pink bag", "自动放行"]
    ],
    issues: [
      "ODW-1002 / Delivery Name：收件人 Daddy K?? 包含问号，系统保留原文并进入人工审核。"
    ],
    rules: [
      "袋子颜色：编号 3) Grey bag 被识别为袋色，编号被清理，不写入刻字列。",
      "刻字内容：价格尾巴、数量表达、1) / 3. 编号不能残留。",
      "默认袋色：具体 SKU 的默认袋色需人工确认后长期复用。"
    ],
    traces: [
      "ODW-1001 / sku：PDF 证据 SKU: PEN-MULTI-5，自动放行。",
      "ODW-1003 / bag_color：3) Grey bag 被质量规则裁决为袋色。",
      "ODW-1004 / engraving：Meet you at the bar 是用户原始刻字短句，保留英文原文。"
    ]
  },
  {
    id: "demo-orderops-202606",
    name: "脱敏回归演示批次 2026-06",
    createdAt: "2026-06-28 16:20",
    rows: [
      ["ODW-0901", "BAG-MAKEUP-S", "化妆袋", "Cream / S", "Ria", "Pink bag", "自动放行"]
    ],
    issues: ["ODW-0902 / Personalization：客户表示稍后发送 logo，系统不硬填。"],
    rules: ["稍后发送留言：send later / will send later 不写入刻字字段。"],
    traces: ["ODW-0901 / product_name：SKU 规则命中化妆袋。"]
  }
];

const latest = jobs[0];

const css = `
  :root{color-scheme:light}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 18% 12%,rgba(72,111,255,.14),transparent 30rem),radial-gradient(circle at 82% 10%,rgba(23,181,166,.12),transparent 28rem),linear-gradient(135deg,#f8fbff,#eef4fb 52%,#f9fbff);color:#172033;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}body:before{content:"";position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(46,64,98,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(46,64,98,.055) 1px,transparent 1px);background-size:34px 34px;mask-image:linear-gradient(to bottom,black,transparent 82%)}a{color:inherit;text-decoration:none}.shell{min-height:100vh;padding:24px}.frame{position:relative;z-index:1;display:grid;grid-template-columns:248px minmax(0,1fr);gap:20px;max-width:1680px;margin:0 auto}.panel{border:1px solid rgba(167,180,204,.55);background:rgba(255,255,255,.78);box-shadow:0 18px 60px rgba(42,57,89,.12);backdrop-filter:blur(18px);border-radius:24px}.side{position:sticky;top:20px;height:calc(100vh - 48px);padding:18px}.muted{color:#68758a}.brand{font-size:22px;font-weight:900;margin-top:10px}.nav{display:grid;gap:8px;margin-top:26px}.nav a{border-radius:16px;padding:11px 12px;font-size:14px;font-weight:700}.nav a:hover{background:#fff}.grid{display:grid;gap:18px}.hero{padding:26px}.hero h1{margin:8px 0 8px;font-size:36px;letter-spacing:-.03em}.hero p{max-width:860px;line-height:1.8}.actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}.button{display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(141,155,182,.72);border-radius:12px;padding:12px 16px;background:rgba(255,255,255,.9);font-weight:750;cursor:pointer}.button.primary{background:#1f2a44;color:#fff;border-color:#1f2a44}.cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.card{border:1px solid rgba(194,205,223,.72);background:rgba(255,255,255,.88);box-shadow:0 10px 34px rgba(42,57,89,.08);border-radius:22px;padding:18px}.metric{font-size:30px;font-weight:900;margin:8px 0}.split{display:grid;grid-template-columns:1.35fr .8fr;gap:18px}.table-wrap{overflow:auto}.table{width:100%;border-collapse:collapse;min-width:840px;font-size:14px}.table th{background:#f6f8fb;color:#68758a;text-align:left;font-size:12px;letter-spacing:.12em;text-transform:uppercase}.table th,.table td{padding:13px 16px;border-top:1px solid #dde5f0}.badge{display:inline-flex;border-radius:999px;padding:5px 10px;font-size:12px;font-weight:800}.green{background:rgba(34,151,104,.12);color:#116247}.amber{background:rgba(245,179,55,.16);color:#7a4a04}.list{display:grid;gap:10px}.item{border:1px solid #dde5f0;background:#fff;border-radius:16px;padding:14px;line-height:1.7}.status{margin-top:8px;font-size:12px;color:#68758a}@media(max-width:980px){.frame{grid-template-columns:1fr}.side{position:relative;height:auto}.cards,.split{grid-template-columns:1fr}.hero h1{font-size:28px}}`;

function escapeCell(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function csvPayload() {
  const header = ["Order", "sku", "产品名称", "产品变量", "刻字内容", "袋子颜色", "状态"];
  return [header, ...latest.rows].map((row) => row.map(escapeCell).join(",")).join("\\r\\n");
}

function layout(title, body) {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${title}</title><style>${css}</style></head><body><div class="shell"><div class="frame"><aside class="panel side"><div class="muted" style="font-size:12px;font-weight:800;letter-spacing:.28em;text-transform:uppercase">Portfolio Demo</div><div class="brand">AI OrderOps</div><p class="muted" style="line-height:1.7">面向招聘方的脱敏在线演示：展示订单解析、质量审核、规则沉淀和结果导出，不包含真实客户数据。</p><nav class="nav"><a href="/">工作台</a><a href="/quality">质量看板</a><a href="/review">人工审核</a><a href="/rules">规则沉淀</a><a href="/settings">系统说明</a></nav><div class="item muted" style="margin-top:24px;font-size:12px">公开 Demo 使用合成订单。本地完整版保留 FastAPI、Docker、PDF/ZIP 上传和 Excel 导出能力。</div></aside><main class="grid">${body}</main></div></div><script>const csv=${JSON.stringify(csvPayload())};function openDemo(){location.href="/jobs/demo-orderops-202607"}function downloadCsv(){const blob=new Blob(["\\ufeff"+csv],{type:"text/csv;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="demo-orders_订单整理输出.csv";a.click();URL.revokeObjectURL(url);const el=document.querySelector("[data-download-status]");if(el)el.textContent="已生成 demo-orders_订单整理输出.csv"}</script></body></html>`;
}

function metrics() {
  return `<section class="cards"><div class="card"><div class="muted">演示任务</div><div class="metric">${jobs.length}</div><div class="muted">可直接点击体验</div></div><div class="card"><div class="muted">自动放行率</div><div class="metric">75%</div><div class="muted">有证据才放行</div></div><div class="card"><div class="muted">人工审核</div><div class="metric">1</div><div class="muted">不确定不硬填</div></div><div class="card"><div class="muted">规则命中</div><div class="metric">8</div><div class="muted">展示规则闭环</div></div></section>`;
}

function taskTable() {
  return `<section class="card table-wrap"><h2>最近演示任务</h2><table class="table"><thead><tr><th>任务</th><th>行数</th><th>自动放行</th><th>人工审核</th><th>规则命中</th><th>操作</th></tr></thead><tbody>${jobs.map((job) => `<tr><td><b>${job.name}</b><div class="muted">${job.createdAt}</div></td><td>${job.rows.length}</td><td>${job.id === latest.id ? "75%" : "83%"}</td><td>${job.issues.length}</td><td>${job.rules.length}</td><td><a class="button" href="/jobs/${job.id}">查看详情</a></td></tr>`).join("")}</tbody></table></section>`;
}

function home() {
  return layout("AI OrderOps Workbench", `<section class="panel hero"><div class="muted" style="font-weight:800">在线演示</div><h1>招聘方可直接体验的 AI 订单处理工作台</h1><p class="muted">生成脱敏演示任务，查看质量看板、人工审核、规则沉淀、字段溯源和样例 Excel 导出。公开版不需要上传真实文件，也不需要 OpenAI 密钥。</p><div class="actions"><button class="button primary" onclick="openDemo()">生成脱敏演示任务</button><button class="button" onclick="downloadCsv()">下载样例 Excel（CSV）</button><a class="button" href="/quality">查看质量看板</a><a class="button" href="/review">查看人工审核</a><a class="button" href="/rules">查看规则沉淀</a></div><div class="status" data-download-status></div></section>${metrics()}<section class="split">${taskTable()}<div class="card"><h2>质量趋势</h2><div class="item">脱敏回归演示批次：83% 自动放行</div><div class="item">脱敏订单演示批次：75% 自动放行</div><p class="muted">这里展示质量指标，不伪造真实准确率；真实准确率需要人工真值表。</p></div></section>`);
}

function detail(job = latest) {
  return layout(`${job.name} - AI OrderOps Workbench`, `<section class="panel hero"><div class="muted" style="font-weight:800">任务详情</div><h1>${job.name}</h1><p class="muted">${job.id} · ${job.createdAt} · demo-orders.pdf / demo-sku-rules.xlsx</p><div class="actions"><button class="button primary" onclick="downloadCsv()">下载样例 Excel（CSV）</button><a class="button" href="/">返回工作台</a></div><div class="status" data-download-status></div></section>${metrics()}<section class="card table-wrap"><h2>Excel 主表预览</h2><table class="table"><thead><tr><th>Order</th><th>SKU</th><th>产品名称</th><th>变量</th><th>刻字内容</th><th>袋子颜色</th><th>状态</th></tr></thead><tbody>${job.rows.map((row) => `<tr>${row.map((cell, index) => `<td>${index === 6 ? `<span class="badge ${cell === "自动放行" ? "green" : "amber"}">${cell}</span>` : cell}</td>`).join("")}</tr>`).join("")}</tbody></table></section><section class="split"><div class="card"><h2>待人工审核</h2><div class="list">${job.issues.map((issue) => `<div class="item">${issue}</div>`).join("")}</div></div><div class="card"><h2>规则沉淀</h2><div class="list">${job.rules.map((rule) => `<div class="item">${rule}</div>`).join("")}</div></div></section><section class="card"><h2>字段溯源</h2><div class="list">${job.traces.map((trace) => `<div class="item">${trace}</div>`).join("")}</div></section>`);
}

function simplePage(name, description, items) {
  return layout(`${name} - AI OrderOps Workbench`, `<section class="panel hero"><div class="muted" style="font-weight:800">${name}</div><h1>${description}</h1></section><section class="card"><div class="list">${items.map((item) => `<div class="item">${item}</div>`).join("")}</div></section>`);
}

function respond(html) {
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}

export default {
  async fetch(request) {
    const { pathname } = new URL(request.url);
    if (pathname === "/") return respond(home());
    if (pathname === "/quality") return respond(simplePage("质量看板", "自动放行、人工审核与规则命中趋势", ["最新主表行数：4", "自动放行率：75%", "人工审核项：1", "字段质检问题：0"]));
    if (pathname === "/review") return respond(simplePage("人工审核", "只把不确定项交给人工", latest.issues));
    if (pathname === "/rules") return respond(simplePage("规则沉淀", "候选规则先确认，再长期复用", latest.rules));
    if (pathname === "/settings") return respond(simplePage("系统说明", "公开 Demo 与本地完整版边界", ["在线演示：使用合成订单，不需要上传文件或密钥。", "本地完整版：保留 FastAPI、Docker、PDF/ZIP 上传、Excel 导出。", "数据安全：GitHub 不包含真实 PDF、真实 Excel、客户规则表、.env 或 API 密钥。"]));
    const job = jobs.find((item) => pathname === `/jobs/${item.id}`);
    if (job) return respond(detail(job));
    return new Response("Not found", { status: 404 });
  }
};
