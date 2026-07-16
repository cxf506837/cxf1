import Link from "next/link";

const nav = [
  ["工作台", "/"],
  ["质量看板", "/quality"],
  ["人工审核", "/review"],
  ["规则中心", "/rules"],
  ["系统设置", "/settings"]
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell px-5 py-5 lg:px-8">
      <div className="mx-auto grid max-w-[1680px] grid-cols-1 gap-5 lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="glass-panel rounded-[24px] p-4 lg:sticky lg:top-5 lg:h-[calc(100vh-40px)]">
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">Portfolio Demo</div>
            <div className="mt-3 text-xl font-black tracking-tight">AI OrderOps</div>
            <p className="mt-2 text-sm leading-6 text-muted">脱敏订单处理工作台，展示解析、审核、规则沉淀和质量闭环。</p>
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
            默认使用模拟模型，不保存密钥，不包含客户真实数据。
          </div>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}

