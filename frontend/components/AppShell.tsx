import Link from "next/link";

const nav = [
  ["工作台", "/"],
  ["数据证据", "/evidence"],
  ["质量看板", "/quality"],
  ["人工审核", "/review"],
  ["规则沉淀", "/rules"],
  ["系统说明", "/settings"]
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell px-5 py-5 lg:px-8">
      <div className="mx-auto grid max-w-[1680px] grid-cols-1 gap-5 lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="glass-panel rounded-[24px] p-4 lg:sticky lg:top-5 lg:h-[calc(100vh-40px)]">
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">Portfolio Demo</div>
            <div className="mt-3 text-xl font-black tracking-tight">AI OrderOps</div>
            <p className="mt-2 text-sm leading-6 text-muted">
              面向招聘方的脱敏在线演示：展示订单解析、质量审核、规则沉淀和结果导出，不包含真实客户数据。
            </p>
          </div>
          <nav className="grid gap-2">
            {nav.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-2xl px-3 py-2.5 text-sm font-semibold text-ink transition hover:bg-white"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 rounded-2xl border border-line bg-white/70 p-3 text-xs leading-5 text-muted">
            公开 Demo 默认使用模拟模型与合成订单。本地完整版保留 FastAPI、Docker、PDF/ZIP 上传和 Excel 导出能力。
          </div>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
