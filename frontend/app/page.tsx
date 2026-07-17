import { AppShell } from "../components/AppShell";
import { MetricCard } from "../components/MetricCard";
import { QualityChart } from "../components/QualityChart";
import { TaskTable } from "../components/TaskTable";
import { Timeline } from "../components/Timeline";
import { UploadPanel } from "../components/UploadPanel";
import { fetchJobs } from "../lib/api";

export default async function HomePage() {
  const jobs = await fetchJobs();
  const latest = jobs[0];

  return (
    <AppShell>
      <div className="grid gap-5">
        <UploadPanel />
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
        <Timeline />
        <div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
          <TaskTable jobs={jobs} />
          <QualityChart jobs={jobs} />
        </div>
      </div>
    </AppShell>
  );
}
