import Link from "next/link";
import { AppShell } from "../../components/AppShell";
import { MetricCard } from "../../components/MetricCard";
import { DEMO_MODES, EVIDENCE_METRICS, SAFETY_BOUNDARIES, VERIFICATION_EVIDENCE } from "../../lib/evidence";

export default function EvidencePage() {
  return (
    <AppShell>
      <div className="grid gap-5">
        <section className="glass-panel rounded-[28px] p-6">
          <div className="text-sm font-bold text-muted">数据证据</div>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-ink">
            给招聘方看的可信度说明
          </h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-muted">
            这个页面把作品集 Demo 的数据规模、测试证据、演示模式和安全边界放在一起。它不声称真实客户准确率，
            而是证明项目有可运行流程、有质量控制、有下载产物、有安全边界。
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {EVIDENCE_METRICS.map((metric) => (
            <MetricCard key={metric.label} label={metric.label} value={metric.value} hint={metric.hint} />
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          {DEMO_MODES.map((mode) => (
            <div className="soft-card rounded-3xl p-5" key={mode.name}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-muted">{mode.badge}</span>
                <span className="badge badge-green">{mode.name}</span>
              </div>
              <h2 className="mt-4 text-xl font-black tracking-tight text-ink">{mode.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{mode.description}</p>
              <p className="mt-3 text-sm leading-6 text-ink">{mode.proof}</p>
              <Link className="button mt-4" href={mode.href}>
                {mode.name === "安全公开版" ? "访问安全公开版" : "查看真实可操作版"}
              </Link>
            </div>
          ))}
        </section>

        <section className="soft-card rounded-3xl p-5">
          <div className="text-sm font-bold text-muted">验证记录</div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-ink">
            端到端代理测试和工程检查都可复跑
          </h2>
          <div className="mt-5 grid gap-3">
            {VERIFICATION_EVIDENCE.map((item) => (
              <div className="rounded-2xl border border-line bg-white/80 p-4" key={item.name}>
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                  <div className="font-bold text-ink">{item.name}</div>
                  <code className="rounded-xl bg-slate-100 px-3 py-1 text-xs text-muted">{item.command}</code>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{item.result}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="soft-card rounded-3xl p-5">
          <div className="text-sm font-bold text-muted">安全边界</div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-ink">
            作品集展示和真实客户交付明确分离
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {SAFETY_BOUNDARIES.map((item) => (
              <div className="rounded-2xl border border-line bg-white/80 p-4 text-sm leading-6 text-muted" key={item}>
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
