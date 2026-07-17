const steps = ["输入", "解析", "规则命中", "证据裁决", "质量审核", "导出"];

export function Timeline() {
  return (
    <div className="soft-card rounded-3xl p-5">
      <div className="mb-4 text-sm font-bold text-ink">任务流程</div>
      <div className="grid gap-3 md:grid-cols-6">
        {steps.map((step, index) => (
          <div key={step} className="rounded-2xl border border-line bg-white/80 p-3">
            <div className="text-xs font-semibold text-muted">0{index + 1}</div>
            <div className="mt-1 text-sm font-bold text-ink">{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
