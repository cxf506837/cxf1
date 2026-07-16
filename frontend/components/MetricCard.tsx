export function MetricCard({ label, value, hint }: { label: string; value: string | number; hint: string }) {
  return (
    <div className="soft-card rounded-3xl p-5">
      <div className="text-sm font-semibold text-muted">{label}</div>
      <div className="mt-3 text-3xl font-black tracking-tight text-ink">{value}</div>
      <div className="mt-2 text-xs leading-5 text-muted">{hint}</div>
    </div>
  );
}

