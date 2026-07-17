import { AppShell } from "../../components/AppShell";
import { MetricCard } from "../../components/MetricCard";
import { QualityChart } from "../../components/QualityChart";
import { fetchJobs } from "../../lib/api";

export default async function QualityPage() {
  const jobs = await fetchJobs();
  const latest = jobs[0];

  return (
    <AppShell>
      <div className="grid gap-5">
        <div className="glass-panel rounded-[28px] p-6">
          <div className="text-sm font-bold text-muted">质量看板</div>
          <h1 className="mt-2 text-3xl font-black tracking-tight">
            自动放行、人工审核与规则命中趋势
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            这里展示的是系统质量指标：能自动放行多少、还有多少需要人工确认、规则是否命中。真实准确率需要人工真值表参与评估。
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="最新主表行数" value={latest?.metrics.line_count ?? "--"} hint="脱敏演示数据" />
          <MetricCard
            label="自动放行率"
            value={latest ? `${Math.round(latest.metrics.auto_pass_rate * 100)}%` : "--"}
            hint="有明确证据的字段"
          />
          <MetricCard label="人工审核项" value={latest?.metrics.manual_review_count ?? "--"} hint="不确定不硬填" />
          <MetricCard label="字段质检" value={latest?.metrics.field_issue_count ?? "--"} hint="残留和错列风险" />
        </div>
        <QualityChart jobs={jobs} />
      </div>
    </AppShell>
  );
}
