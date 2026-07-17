import type { JobSummary } from "../lib/types";

export function QualityChart({ jobs }: { jobs: JobSummary[] }) {
  const recent = jobs.slice(0, 6).reverse();
  return (
    <div className="soft-card rounded-3xl p-5">
      <div className="mb-2 text-sm font-bold text-ink">质量趋势</div>
      <p className="mb-5 text-xs leading-5 text-muted">
        公开 Demo 展示的是质量指标，不伪造真实准确率；真实准确率需要人工真值表评估。
      </p>
      <div className="flex h-48 items-end gap-3">
        {recent.map((job) => (
          <div className="flex flex-1 flex-col items-center gap-2" key={job.job_id}>
            <div className="flex w-full items-end rounded-t-2xl bg-slate-100">
              <div
                className="w-full rounded-t-2xl bg-ink/80"
                style={{ height: `${Math.max(job.metrics.auto_pass_rate * 100, 12)}%` }}
              />
            </div>
            <div className="max-w-28 truncate text-xs text-muted">{job.job_name}</div>
          </div>
        ))}
        {recent.length === 0 && <div className="text-sm text-muted">暂无任务数据。</div>}
      </div>
    </div>
  );
}
