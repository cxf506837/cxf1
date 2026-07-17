import { AppShell } from "../../components/AppShell";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="glass-panel rounded-[28px] p-6">
        <div className="text-sm font-bold text-muted">系统说明</div>
        <h1 className="mt-2 text-3xl font-black tracking-tight">公开 Demo 与本地完整版边界</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white p-4">
            <div className="text-sm font-bold">在线演示</div>
            <p className="mt-2 text-sm leading-6 text-muted">
              使用合成订单、模拟模型响应和前端内置数据。招聘方打开网址即可体验，不需要上传文件、不需要 OpenAI 密钥。
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-4">
            <div className="text-sm font-bold">本地完整版</div>
            <p className="mt-2 text-sm leading-6 text-muted">
              仓库保留 FastAPI 后端、Docker Compose、PDF/ZIP 上传、Excel 导出和 SQLite 任务记录，适合 clone 后运行完整流程。
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-4">
            <div className="text-sm font-bold">数据安全</div>
            <p className="mt-2 text-sm leading-6 text-muted">
              GitHub 不包含真实 PDF、真实 Excel、客户规则表、.env 或 API 密钥。公开页面只展示脱敏数据。
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-4">
            <div className="text-sm font-bold">OpenAI</div>
            <p className="mt-2 text-sm leading-6 text-muted">
              默认不真实调用模型。本地需要模型辅助时，将密钥放在 .env，前端和日志不会保存密钥。
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
