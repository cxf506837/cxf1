import type { CandidateRule, JobSummary, OrderLine, ProcessingIssue, TraceRecord } from "./types";
import { DEMO_JOBS, getDemoJob } from "./demo-data";

export const USE_REMOTE_API = process.env.NEXT_PUBLIC_USE_REMOTE_API === "true";
export const SERVER_API_BASE_URL = process.env.ORDEROPS_BACKEND_URL || "http://127.0.0.1:8000";
export const CLIENT_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/live";

type RawJob = Record<string, any>;

export async function fetchJobs(): Promise<JobSummary[]> {
  if (!USE_REMOTE_API) {
    return DEMO_JOBS;
  }
  try {
    const response = await fetch(`${SERVER_API_BASE_URL}/api/jobs`, { next: { revalidate: 2 } });
    if (!response.ok) return DEMO_JOBS;
    const data = await response.json();
    const jobs = Array.isArray(data.jobs) ? data.jobs.map(normalizeJob) : [];
    return jobs.length ? jobs : DEMO_JOBS;
  } catch {
    return DEMO_JOBS;
  }
}

export async function fetchJob(id: string): Promise<JobSummary | null> {
  if (!USE_REMOTE_API) {
    return getDemoJob(id) ?? DEMO_JOBS[0] ?? null;
  }
  try {
    const response = await fetch(`${SERVER_API_BASE_URL}/api/jobs/${id}`, { next: { revalidate: 1 } });
    if (!response.ok) return getDemoJob(id);
    return normalizeJob(await response.json());
  } catch {
    return getDemoJob(id);
  }
}

export function backendDownloadUrl(jobId: string): string {
  return `${CLIENT_API_BASE_URL}/jobs/${encodeURIComponent(jobId)}/download`;
}

export function normalizeJob(raw: RawJob): JobSummary {
  const issues = Array.isArray(raw.issues) ? raw.issues.map(normalizeIssue) : [];
  const lineHasManualReview = new Set(
    issues.filter((issue) => issue.severity === "manual_review").map((issue) => issue.order_id)
  );
  const lines = Array.isArray(raw.lines)
    ? raw.lines.map((line: RawJob) => normalizeLine(line, lineHasManualReview))
    : [];
  const jobName = String(raw.job_name || raw.job_id || "orderops-demo");
  return {
    job_id: String(raw.job_id || "unknown-job"),
    job_name: jobName,
    created_at: String(raw.created_at || new Date().toLocaleString("zh-CN", { hour12: false })),
    output_name: String(raw.output_name || `${jobName}_order_output.xlsx`),
    mode: raw.mode === "online_demo" ? "online_demo" : "local_full",
    source_files: Array.isArray(raw.source_files) ? raw.source_files : [jobName],
    metrics: {
      line_count: Number(raw.metrics?.line_count ?? lines.length),
      auto_pass_count: Number(raw.metrics?.auto_pass_count ?? 0),
      auto_pass_rate: Number(raw.metrics?.auto_pass_rate ?? 0),
      manual_review_count: Number(raw.metrics?.manual_review_count ?? 0),
      field_issue_count: Number(raw.metrics?.field_issue_count ?? 0),
      rule_hit_count: Number(raw.metrics?.rule_hit_count ?? raw.candidate_rules?.length ?? 0)
    },
    lines,
    issues,
    candidate_rules: Array.isArray(raw.candidate_rules)
      ? raw.candidate_rules.map(normalizeRule)
      : [],
    traces: Array.isArray(raw.traces) ? raw.traces.map(normalizeTrace) : []
  };
}

function normalizeLine(raw: RawJob, manualReviewOrders: Set<string | undefined>): OrderLine {
  const orderId = String(raw.order_id || "");
  const hasManualReview = manualReviewOrders.has(orderId);
  return {
    order_id: orderId,
    sku: String(raw.sku || ""),
    product_name: String(raw.product_name || ""),
    variant_1: String(raw.variant_1 ?? raw.product_variant_1 ?? ""),
    variant_2: String(raw.variant_2 ?? raw.product_variant_2 ?? ""),
    quantity: Number(raw.quantity || 1),
    engraving: String(raw.engraving || ""),
    bag_color: String(raw.bag_color || ""),
    delivery_name: String(raw.delivery_name || ""),
    source_page: Number(raw.source_page || 1),
    status: hasManualReview ? "manual_review" : "auto_passed",
    confidence: hasManualReview ? 0.68 : 0.96
  };
}

function normalizeIssue(raw: RawJob): ProcessingIssue {
  const severity = raw.severity === "manual_review" ? "manual_review" : "quality_guard";
  return {
    order_id: raw.order_id ? String(raw.order_id) : undefined,
    sku: raw.sku ? String(raw.sku) : undefined,
    field: String(raw.field || "unknown"),
    code: String(raw.code || "quality_notice"),
    severity,
    current_value: raw.current_value ? String(raw.current_value) : undefined,
    evidence: raw.evidence ? String(raw.evidence) : undefined,
    message: String(raw.message || "需要人工确认")
  };
}

function normalizeRule(raw: RawJob): CandidateRule {
  const type = String(raw.rule_type || "message_parse_rule") as CandidateRule["rule_type"];
  return {
    rule_type: type,
    field: String(raw.field || "customer_message"),
    status: raw.status === "confirmed" || raw.status === "rejected" ? raw.status : "pending",
    source: String(raw.scope || raw.source || "backend"),
    description: String(raw.description || raw.suggested_value || raw.evidence || "候选规则待确认"),
    impact: String(raw.impact || "确认后可用于后续同类任务")
  };
}

function normalizeTrace(raw: RawJob): TraceRecord {
  return {
    order_id: String(raw.order_id || ""),
    field: String(raw.field || ""),
    value: String(raw.value || ""),
    source: String(raw.source || "PDF") as TraceRecord["source"],
    evidence: String(raw.evidence || ""),
    decision: String(raw.decision || "后端真实处理记录")
  };
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
