export const DEMO_MODES = [
  {
    name: "安全公开版",
    href: "https://ai-orderops-workbench.chenxifang529.chatgpt.site",
    badge: "固定在线链接",
    description:
      "给招聘方快速浏览项目：使用合成数据、禁用真实上传、不连接真实密钥，适合直接放在简历和 GitHub README。",
    proof: "可查看任务详情、质量看板、人工审核、规则沉淀和样例导出预览。"
  },
  {
    name: "真实可操作版",
    href: "/settings",
    badge: "本机后端 + 临时公网",
    description:
      "你电脑运行 Next.js + FastAPI，再用 Cloudflare Tunnel / ngrok 暴露前端端口，招聘方可真实触发后端工作流。",
    proof: "支持上传脱敏 PDF / ZIP，生成真实 .xlsx，查看字段溯源并下载结果。"
  }
];

export const EVIDENCE_METRICS = [
  {
    label: "120 条合成订单行",
    value: "120",
    hint: "用于作品集演示和回归叙事，不包含真实客户数据。"
  },
  {
    label: "600+ 字段裁决",
    value: "600+",
    hint: "覆盖 SKU、数量、刻字、袋色、字体、地址、异常字段等判断点。"
  },
  {
    label: "2 种演示形态",
    value: "2",
    hint: "安全公开版长期可访问，真实可操作版用于面试深聊。"
  },
  {
    label: "4 类质量证据",
    value: "4",
    hint: "合约测试、Next 构建、后端 unittest、仓库安全扫描。"
  }
];

export const VERIFICATION_EVIDENCE = [
  {
    name: "前端合约测试",
    command: "node frontend/scripts/contract-test.mjs",
    result: "校验中文文案、双版本入口、数据证据和关键交互入口。"
  },
  {
    name: "Next.js 正式构建",
    command: "next build",
    result: "验证页面、动态代理路由 `/api/live` 和 TypeScript 类型。"
  },
  {
    name: "后端 unittest",
    command: "python -m unittest discover tests",
    result: "验证访问密码、任务处理、PDF/ZIP 安全处理和 Excel 输出基础链路。"
  },
  {
    name: "端到端代理测试",
    command: "POST /api/live/demo",
    result: "前端通过同源代理真实调用本机 FastAPI，并返回后端生成的任务 ID。"
  },
  {
    name: "仓库安全扫描",
    command: "python scripts/check_repository_safety.py",
    result: "确认仓库不包含 `.env`、密钥、真实 PDF、真实 Excel 和客户数据。"
  }
];

export const SAFETY_BOUNDARIES = [
  "公开版只使用合成订单、合成 SKU、合成地址和脱敏留言。",
  "真实可操作版也建议只给招聘方上传脱敏样例，不处理真实客户文件。",
  "OpenAI 密钥不进入仓库、不进入公开 Demo、不写入日志。",
  "真实准确率必须依赖人工真值表；没有人工真值时只展示质量指标。"
];
