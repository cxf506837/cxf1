import Link from "next/link";
import type { JobSummary } from "../lib/types";

export function TaskTable({ jobs }: { jobs: JobSummary[] }) {
  return (
    <div className="soft-card overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div>
          <div className="text-sm font-bold text-ink">最近演示任务</div>
          <div className="mt-1 text-xs text-muted">点击详情即可看到完整处理链路。</div>
        </div>
        <Link className="button px-3 py-2" href="/quality">
          质量看板
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-muted">
            <tr>
              <th className="px-5 py-3">任务</th>
              <th className="px-5 py-3">行数</th>
              <th className="px-5 py-3">自动放行</th>
              <th className="px-5 py-3">人工审核</th>
              <th className="px-5 py-3">规则命中</th>
              <th className="px-5 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td className="px-5 py-8 text-muted" colSpan={6}>
                  暂无任务。可先点击“生成脱敏演示任务”。
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr className="border-t border-line/70 hover:bg-white" key={job.job_id}>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-ink">{job.job_name}</div>
                    <div className="mt-1 text-xs text-muted">{job.created_at}</div>
                  </td>
                  <td className="px-5 py-4">{job.metrics.line_count}</td>
                  <td className="px-5 py-4">{Math.round(job.metrics.auto_pass_rate * 100)}%</td>
                  <td className="px-5 py-4">{job.metrics.manual_review_count}</td>
                  <td className="px-5 py-4">{job.metrics.rule_hit_count}</td>
                  <td className="px-5 py-4">
                    <Link className="button px-3 py-2" href={`/jobs/${job.job_id}`}>
                      查看详情
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
