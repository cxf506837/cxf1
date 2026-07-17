import { AppShell } from "../../components/AppShell";
import { fetchJobs } from "../../lib/api";

export default async function RulesPage() {
  const jobs = await fetchJobs();
  const rules = jobs.flatMap((job) => job.candidate_rules.map((rule) => ({ job, rule })));

  return (
    <AppShell>
      <div className="grid gap-5">
        <div className="glass-panel rounded-[28px] p-6">
          <div className="text-sm font-bold text-muted">规则沉淀</div>
          <h1 className="mt-2 text-3xl font-black tracking-tight">
            候选规则先确认，再长期复用
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            规则来自人工审核、质量检查和重复异常。公开 Demo 只展示闭环，不把候选规则自动写入生产规则，避免错误学习污染后续任务。
          </p>
        </div>
        <div className="grid gap-3">
          {rules.length === 0 ? (
            <div className="soft-card rounded-3xl p-5 text-sm text-muted">暂无候选规则。</div>
          ) : (
            rules.map(({ job, rule }, index) => (
              <div className="soft-card rounded-3xl p-5" key={`${job.job_id}-${index}`}>
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-start">
                  <div>
                    <div className="text-sm font-bold">{rule.rule_type} / {rule.field}</div>
                    <div className="mt-2 text-sm leading-6 text-muted">{rule.description}</div>
                    <div className="mt-2 text-xs text-ink">{job.job_name} · 来源：{rule.source}</div>
                  </div>
                  <span className={`badge ${rule.status === "confirmed" ? "badge-green" : "badge-amber"}`}>
                    {rule.status === "confirmed" ? "已确认" : "待确认"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
