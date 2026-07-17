import Link from "next/link";
import { AppShell } from "../components/AppShell";
import { MetricCard } from "../components/MetricCard";
import { QualityChart } from "../components/QualityChart";
import { TaskTable } from "../components/TaskTable";
import { Timeline } from "../components/Timeline";
import { UploadPanel } from "../components/UploadPanel";
import { fetchJobs } from "../lib/api";
import { DEMO_MODES, EVIDENCE_METRICS } from "../lib/evidence";

export default async function HomePage() {
  const jobs = await fetchJobs();
  const latest = jobs[0];

  return (
    <AppShell>
      <div className="grid gap-5">
        <UploadPanel />
        <section className="grid gap-4 lg:grid-cols-2">
          {DEMO_MODES.map((mode) => (
            <div className="soft-card rounded-3xl p-5" key={mode.name}>
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-bold text-muted">{mode.badge}</div>
                <span className="badge badge-green">{mode.name}</span>
              </div>
              <h2 className="mt-4 text-xl font-black tracking-tight text-ink">{mode.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{mode.description}</p>
              <p className="mt-3 text-sm leading-6 text-ink">{mode.proof}</p>
              <Link className="button mt-4" href={mode.href}>
                {mode.name === "安全公开版" ? "打开公开演示" : "查看真实演示说明"}
              </Link>
            </div>
          ))}
        </section>
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="演示任务" value={jobs.length} hint="内置脱敏数据，可直接点击体验" />
          <MetricCard
            label="自动放行率"
            value={latest ? `${Math.round(latest.metrics.auto_pass_rate * 100)}%` : "--"}
            hint="仅代表 Demo 质量指标"
          />
          <MetricCard
            label="人工审核"
            value={latest?.metrics.manual_review_count ?? "--"}
            hint="不确定字段不硬猜"
          />
          <MetricCard
            label="规则命中"
            value={latest?.metrics.rule_hit_count ?? "--"}
            hint="展示规则沉淀闭环"
          />
        </div>
        <section className="soft-card rounded-3xl p-5">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <div className="text-sm font-bold text-muted">数据证据</div>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-ink">
                用合成数据和测试证据说明项目不是空壳
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                这些指标只代表作品集 Demo 的脱敏样例和工程验证，不冒充客户真实准确率；真正准确率需要人工真值表参与评估。
              </p>
            </div>
            <Link className="button" href="/evidence">
              查看完整证据
            </Link>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {EVIDENCE_METRICS.map((metric) => (
              <MetricCard key={metric.label} label={metric.label} value={metric.value} hint={metric.hint} />
            ))}
          </div>
        </section>
        <Timeline />
        <div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
          <TaskTable jobs={jobs} />
          <QualityChart jobs={jobs} />
        </div>
      </div>
    </AppShell>
  );
}
