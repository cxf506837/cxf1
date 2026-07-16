import { AppShell } from "../../components/AppShell";
import { fetchJobs } from "../../lib/api";

export default async function ReviewPage() {
  const jobs = await fetchJobs();
  const issues = jobs.flatMap((job) => job.issues.map((issue) => ({ job, issue })));
  return (
    <AppShell>
      <div className="glass-panel rounded-[28px] p-6">
        <div className="text-sm font-bold text-muted">人工审核</div>
        <h1 className="mt-2 text-3xl font-black tracking-tight">只审不确定项</h1>
        <div className="mt-6 grid gap-3">
          {issues.length === 0 ? (
            <div className="text-sm text-muted">暂无待审核项。</div>
          ) : (
            issues.map(({ job, issue }, index) => (
              <div className="rounded-2xl border border-line bg-white p-4" key={`${job.job_id}-${index}`}>
                <div className="text-sm font-bold">{job.job_name} / {issue.field}</div>
                <div className="mt-1 text-xs leading-5 text-muted">{issue.message}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}

