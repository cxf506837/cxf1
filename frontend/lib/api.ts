import type { JobSummary } from "./types";
import { DEMO_JOBS, getDemoJob } from "./demo-data";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const USE_REMOTE_API = process.env.NEXT_PUBLIC_USE_REMOTE_API === "true";

export async function fetchJobs(): Promise<JobSummary[]> {
  if (!USE_REMOTE_API) {
    return DEMO_JOBS;
  }
  try {
    const response = await fetch(`${API_BASE}/api/jobs`, { next: { revalidate: 5 } });
    if (!response.ok) return DEMO_JOBS;
    const data = await response.json();
    return data.jobs?.length ? data.jobs : DEMO_JOBS;
  } catch {
    return DEMO_JOBS;
  }
}

export async function fetchJob(id: string): Promise<JobSummary | null> {
  if (!USE_REMOTE_API) {
    return getDemoJob(id) ?? DEMO_JOBS[0] ?? null;
  }
  try {
    const response = await fetch(`${API_BASE}/api/jobs/${id}`, { next: { revalidate: 2 } });
    if (!response.ok) return getDemoJob(id);
    return response.json();
  } catch {
    return getDemoJob(id);
  }
}

export function buildSampleCsv(job: JobSummary): string {
  const headers = [
    "Order",
    "sku",
    "产品名称",
    "产品变量1",
    "产品变量2",
    "数量",
    "刻字内容",
    "袋子颜色",
    "Delivery Name",
    "来源页码",
    "处理状态"
  ];
  const rows = job.lines.map((line) => [
    line.order_id,
    line.sku,
    line.product_name,
    line.variant_1,
    line.variant_2,
    String(line.quantity),
    line.engraving,
    line.bag_color,
    line.delivery_name,
    String(line.source_page),
    line.status === "auto_passed" ? "自动放行" : "人工审核"
  ]);
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  return [headers, ...rows].map((row) => row.map(escape).join(",")).join("\r\n");
}
