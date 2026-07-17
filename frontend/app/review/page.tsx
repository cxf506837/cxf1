import { AppShell } from "../../components/AppShell";
import { fetchJobs } from "../../lib/api";

export default async function ReviewPage() {
  const jobs = await fetchJobs();
  const issues = jobs.flatMap((job) => job.issues.map((issue) => ({ job, issue })));

  return (
    <AppShell>
      <div className="glass-panel rounded-[28px] p-6">
        <div className="text-sm font-bold text-muted">人工审核</div>
        <h1 className="mt-2 text-3xl font-black tracking-tight">只把不确定项交给人工</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          Demo 中的问号、证据不足、稍后发送等情况会进入审核；系统不会为了降低异常数而瞎填。
        </p>
        <div className="mt-6 grid gap-3">
          {issues.length === 0 ? (
            <div className="text-sm text-muted">暂无待审核项。</div>
          ) : (
            issues.map(({ job, issue }, index) => (
              <div className="rounded-2xl border border-line bg-white p-4" key={`${job.job_id}-${index}`}>
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                  <div>
                    <div className="text-sm font-bold">{job.job_name} / {issue.order_id ?? "-"} / {issue.field}</div>
                    <div className="mt-1 text-xs leading-5 text-muted">{issue.message}</div>
                    {issue.evidence && <div className="mt-2 text-xs text-ink">证据：{issue.evidence}</div>}
                  </div>
                  <span className="badge badge-amber">待人工确认</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
