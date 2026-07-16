import { AppShell } from "../../components/AppShell";
import { QualityChart } from "../../components/QualityChart";
import { fetchJobs } from "../../lib/api";

export default async function QualityPage() {
  const jobs = await fetchJobs();
  return (
    <AppShell>
      <div className="grid gap-5">
        <div className="glass-panel rounded-[28px] p-6">
          <div className="text-sm font-bold text-muted">质量看板</div>
          <h1 className="mt-2 text-3xl font-black tracking-tight">自动放行、人工审核与规则命中趋势</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            没有人工真值时，这里展示系统质量指标；上传人工真值后才可计算真实准确率。
          </p>
        </div>
        <QualityChart jobs={jobs} />
      </div>
    </AppShell>
  );
}

