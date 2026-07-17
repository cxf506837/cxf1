export type MetricMap = {
  line_count: number;
  auto_pass_count: number;
  auto_pass_rate: number;
  manual_review_count: number;
  field_issue_count: number;
  rule_hit_count: number;
};

export type OrderLine = {
  order_id: string;
  sku: string;
  product_name: string;
  variant_1: string;
  variant_2: string;
  quantity: number;
  engraving: string;
  bag_color: string;
  delivery_name: string;
  source_page: number;
  status: "auto_passed" | "manual_review";
  confidence: number;
};

export type ProcessingIssue = {
  order_id?: string;
  sku?: string;
  field: string;
  code: string;
  severity: "manual_review" | "quality_guard" | "master_data_review";
  current_value?: string;
  evidence?: string;
  message: string;
};

export type CandidateRule = {
  rule_type: "master_data_patch" | "message_parse_rule" | "quality_guard_rule";
  field: string;
  status: "pending" | "confirmed" | "rejected";
  source: string;
  description: string;
  impact: string;
};

export type TraceRecord = {
  order_id: string;
  field: string;
  value: string;
  source: "PDF" | "SKU_RULE" | "CONFIRMED_RULE" | "QUALITY_GUARD" | "MODEL_REVIEW";
  evidence: string;
  decision: string;
};

export type JobSummary = {
  job_id: string;
  job_name: string;
  created_at: string;
  output_name: string;
  mode: "online_demo" | "local_full";
  source_files: string[];
  metrics: MetricMap;
  lines: OrderLine[];
  issues: ProcessingIssue[];
  candidate_rules: CandidateRule[];
  traces: TraceRecord[];
};
