export type MetricMap = {
  line_count: number;
  auto_pass_count: number;
  auto_pass_rate: number;
  manual_review_count: number;
  field_issue_count: number;
  rule_hit_count: number;
};

export type JobSummary = {
  job_id: string;
  job_name: string;
  metrics: MetricMap;
  issues: Array<{ field: string; code: string; severity: string; message: string }>;
  candidate_rules: Array<{ rule_type: string; field: string; status: string }>;
};

