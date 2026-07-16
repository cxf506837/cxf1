import { AppShell } from "../../components/AppShell";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="glass-panel rounded-[28px] p-6">
        <div className="text-sm font-bold text-muted">系统设置</div>
        <h1 className="mt-2 text-3xl font-black tracking-tight">脱敏演示环境</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white p-4">
            <div className="text-sm font-bold">OpenAI</div>
            <p className="mt-2 text-sm leading-6 text-muted">默认使用模拟模型响应；真实密钥只应放在本地 .env，不提交 GitHub。</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-4">
            <div className="text-sm font-bold">数据边界</div>
            <p className="mt-2 text-sm leading-6 text-muted">仓库只允许合成订单、合成规则和脱敏截图。</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

