import { AppShell } from "../../../components/AppShell";
import { MetricCard } from "../../../components/MetricCard";
import { downloadUrl, fetchJob } from "../../../lib/api";

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await fetchJob(id);
  return (
    <AppShell>
      {!job ? (
        <div className="glass-panel rounded-[28px] p-6">任务不存在或后端未启动。</div>
      ) : (
        <div className="grid gap-5">
          <div className="glass-panel rounded-[28px] p-6">
            <div className="text-sm font-bold text-muted">任务详情</div>
            <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h1 className="text-3xl font-black tracking-tight">{job.job_name}</h1>
                <p className="mt-2 text-sm text-muted">{job.job_id}</p>
              </div>
              <a className="button button-primary" href={downloadUrl(job.job_id)}>
                下载 Excel
              </a>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard label="主表行数" value={job.metrics.line_count} hint="生成的订单行" />
            <MetricCard label="自动放行" value={`${Math.round(job.metrics.auto_pass_rate * 100)}%`} hint="证据充足字段" />
            <MetricCard label="人工审核" value={job.metrics.manual_review_count} hint="问号或证据不足" />
            <MetricCard label="字段质检" value={job.metrics.field_issue_count} hint="残留/错列风险" />
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <section className="soft-card rounded-3xl p-5">
              <h2 className="text-base font-bold">异常与审核</h2>
              <div className="mt-4 grid gap-3">
                {job.issues.length === 0 ? (
                  <div className="text-sm text-muted">暂无异常。</div>
                ) : (
                  job.issues.map((issue, index) => (
                    <div className="rounded-2xl border border-line bg-white p-3" key={`${issue.code}-${index}`}>
                      <div className="text-sm font-bold">{issue.field} / {issue.code}</div>
                      <div className="mt-1 text-xs leading-5 text-muted">{issue.message}</div>
                    </div>
                  ))
                )}
              </div>
            </section>
            <section className="soft-card rounded-3xl p-5">
              <h2 className="text-base font-bold">候选规则</h2>
              <div className="mt-4 grid gap-3">
                {job.candidate_rules.map((rule, index) => (
                  <div className="rounded-2xl border border-line bg-white p-3" key={`${rule.rule_type}-${index}`}>
                    <div className="text-sm font-bold">{rule.rule_type}</div>
                    <div className="mt-1 text-xs text-muted">{rule.field} / {rule.status}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </AppShell>
  );
}

