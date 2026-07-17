import { AppShell } from "../../../components/AppShell";
import { MetricCard } from "../../../components/MetricCard";
import { SampleDownloadButton } from "../../../components/SampleDownloadButton";
import { fetchJob } from "../../../lib/api";
import { DEMO_JOBS } from "../../../lib/demo-data";

export function generateStaticParams() {
  return DEMO_JOBS.map((job) => ({ id: job.job_id }));
}

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await fetchJob(id);

  return (
    <AppShell>
      {!job ? (
        <div className="glass-panel rounded-[28px] p-6">任务不存在。</div>
      ) : (
        <div className="grid gap-5">
          <div className="glass-panel rounded-[28px] p-6">
            <div className="text-sm font-bold text-muted">任务详情</div>
            <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h1 className="text-3xl font-black tracking-tight">{job.job_name}</h1>
                <p className="mt-2 text-sm text-muted">
                  {job.job_id} · {job.created_at} · {job.source_files.join(" / ")}
                </p>
              </div>
              <SampleDownloadButton job={job} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard label="主表行数" value={job.metrics.line_count} hint="生成的订单明细行" />
            <MetricCard
              label="自动放行"
              value={`${Math.round(job.metrics.auto_pass_rate * 100)}%`}
              hint="证据充分字段"
            />
            <MetricCard label="人工审核" value={job.metrics.manual_review_count} hint="问号或证据不足" />
            <MetricCard label="字段质检" value={job.metrics.field_issue_count} hint="残留/错列风险" />
          </div>

          <section className="soft-card overflow-hidden rounded-3xl">
            <div className="border-b border-line px-5 py-4">
              <h2 className="text-base font-bold">Excel 主表预览</h2>
              <p className="mt-1 text-xs text-muted">公开 Demo 使用 CSV 模拟 Excel 预览；本地完整版会导出 .xlsx。</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-muted">
                  <tr>
                    <th className="px-5 py-3">Order</th>
                    <th className="px-5 py-3">SKU</th>
                    <th className="px-5 py-3">产品名称</th>
                    <th className="px-5 py-3">变量</th>
                    <th className="px-5 py-3">刻字内容</th>
                    <th className="px-5 py-3">袋子颜色</th>
                    <th className="px-5 py-3">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {job.lines.map((line) => (
                    <tr className="border-t border-line/70 hover:bg-white" key={`${line.order_id}-${line.sku}`}>
                      <td className="px-5 py-4 font-semibold">{line.order_id}</td>
                      <td className="px-5 py-4">{line.sku}</td>
                      <td className="px-5 py-4">{line.product_name}</td>
                      <td className="px-5 py-4">{line.variant_1} / {line.variant_2}</td>
                      <td className="px-5 py-4">{line.engraving}</td>
                      <td className="px-5 py-4">{line.bag_color}</td>
                      <td className="px-5 py-4">
                        <span className={`badge ${line.status === "auto_passed" ? "badge-green" : "badge-amber"}`}>
                          {line.status === "auto_passed" ? "自动放行" : "人工审核"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid gap-5 lg:grid-cols-2">
            <section className="soft-card rounded-3xl p-5">
              <h2 className="text-base font-bold">待人工审核</h2>
              <div className="mt-4 grid gap-3">
                {job.issues.length === 0 ? (
                  <div className="text-sm text-muted">暂无待审核项。</div>
                ) : (
                  job.issues.map((issue, index) => (
                    <div className="rounded-2xl border border-line bg-white p-3" key={`${issue.code}-${index}`}>
                      <div className="text-sm font-bold">
                        {issue.order_id} / {issue.field} / {issue.code}
                      </div>
                      <div className="mt-1 text-xs leading-5 text-muted">{issue.message}</div>
                      {issue.evidence && <div className="mt-2 text-xs text-ink">证据：{issue.evidence}</div>}
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="soft-card rounded-3xl p-5">
              <h2 className="text-base font-bold">规则沉淀</h2>
              <div className="mt-4 grid gap-3">
                {job.candidate_rules.map((rule, index) => (
                  <div className="rounded-2xl border border-line bg-white p-3" key={`${rule.rule_type}-${index}`}>
                    <div className="text-sm font-bold">{rule.rule_type} · {rule.field}</div>
                    <div className="mt-1 text-xs leading-5 text-muted">{rule.description}</div>
                    <div className="mt-2 text-xs text-ink">{rule.status} · {rule.impact}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="soft-card rounded-3xl p-5">
            <h2 className="text-base font-bold">字段溯源</h2>
            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {job.traces.map((trace, index) => (
                <div className="rounded-2xl border border-line bg-white p-3" key={`${trace.order_id}-${trace.field}-${index}`}>
                  <div className="text-xs font-semibold text-muted">{trace.order_id} / {trace.field}</div>
                  <div className="mt-1 text-sm font-bold">{trace.value}</div>
                  <div className="mt-2 text-xs leading-5 text-muted">{trace.source} · {trace.evidence}</div>
                  <div className="mt-2 text-xs text-ink">{trace.decision}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}
