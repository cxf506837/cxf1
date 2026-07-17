import type { JobSummary } from "./types";

export const DEMO_JOBS: JobSummary[] = [
  {
    job_id: "demo-orderops-202607",
    job_name: "脱敏订单演示批次 2026-07",
    created_at: "2026-07-17 10:30",
    output_name: "demo-orders_订单整理输出.csv",
    mode: "online_demo",
    source_files: ["demo-orders.pdf", "demo-sku-rules.xlsx"],
    metrics: {
      line_count: 4,
      auto_pass_count: 3,
      auto_pass_rate: 0.75,
      manual_review_count: 1,
      field_issue_count: 0,
      rule_hit_count: 8
    },
    lines: [
      {
        order_id: "ODW-1001",
        sku: "PEN-MULTI-5",
        product_name: "定制触控圆珠笔",
        variant_1: "Multiple Color",
        variant_2: "5 Pens",
        quantity: 1,
        engraving: "Sam Studio",
        bag_color: "Blue bag",
        delivery_name: "Alex Carter",
        source_page: 1,
        status: "auto_passed",
        confidence: 0.98
      },
      {
        order_id: "ODW-1002",
        sku: "KEY-LEATHER-B",
        product_name: "皮革钥匙扣 B 款",
        variant_1: "Coffee",
        variant_2: "Font 5",
        quantity: 1,
        engraving: "Narelle",
        bag_color: "Grey bag",
        delivery_name: "Daddy K??",
        source_page: 2,
        status: "manual_review",
        confidence: 0.66
      },
      {
        order_id: "ODW-1003",
        sku: "BOX-RING-WOOD",
        product_name: "木质戒指盒",
        variant_1: "Walnut",
        variant_2: "2 Slots",
        quantity: 1,
        engraving: "Mr. & Mrs. Kitt, 06.06.26",
        bag_color: "Grey bag",
        delivery_name: "Mia Kitt",
        source_page: 3,
        status: "auto_passed",
        confidence: 0.95
      },
      {
        order_id: "ODW-1004",
        sku: "MUG-CERAMIC-01",
        product_name: "定制陶瓷杯",
        variant_1: "White",
        variant_2: "Font 2",
        quantity: 2,
        engraving: "Meet you at the bar",
        bag_color: "Pink bag",
        delivery_name: "Jordan Lee",
        source_page: 4,
        status: "auto_passed",
        confidence: 0.93
      }
    ],
    issues: [
      {
        order_id: "ODW-1002",
        sku: "KEY-LEATHER-B",
        field: "Delivery Name",
        code: "question_mark_requires_review",
        severity: "manual_review",
        current_value: "Daddy K??",
        evidence: "Ship to: Daddy K??",
        message: "收件人包含问号，系统保留原文并进入人工审核，不擅自猜测真实姓名。"
      }
    ],
    candidate_rules: [
      {
        rule_type: "message_parse_rule",
        field: "袋子颜色",
        status: "pending",
        source: "ODW-1003 客户留言",
        description: "编号 3) Grey bag 被识别为袋色，编号被清理，不写入刻字列。",
        impact: "后续同类留言可减少袋色错列和编号残留。"
      },
      {
        rule_type: "quality_guard_rule",
        field: "刻字内容",
        status: "pending",
        source: "历史质检归纳",
        description: "价格尾巴、数量表达和字段编号不能残留在刻字内容中。",
        impact: "阻止 NZD、1 x、1) / 3. 这类噪声进入主表。"
      },
      {
        rule_type: "master_data_patch",
        field: "默认袋色",
        status: "pending",
        source: "人工审核闭环",
        description: "具体 SKU 的默认袋色需要业务确认后长期复用。",
        impact: "确认后可减少重复人工判断。"
      }
    ],
    traces: [
      {
        order_id: "ODW-1001",
        field: "sku",
        value: "PEN-MULTI-5",
        source: "PDF",
        evidence: "SKU: PEN-MULTI-5",
        decision: "PDF 字段明确，自动放行。"
      },
      {
        order_id: "ODW-1003",
        field: "bag_color",
        value: "Grey bag",
        source: "QUALITY_GUARD",
        evidence: "3) Grey bag",
        decision: "识别为袋色并清理编号，不进入刻字列。"
      },
      {
        order_id: "ODW-1004",
        field: "engraving",
        value: "Meet you at the bar",
        source: "PDF",
        evidence: "Personalization: Meet you at the bar",
        decision: "这是用户原始刻字短句，保留英文原文，不翻译、不标红。"
      }
    ]
  },
  {
    job_id: "demo-orderops-202606",
    job_name: "脱敏回归演示批次 2026-06",
    created_at: "2026-06-28 16:20",
    output_name: "demo-regression_订单整理输出.csv",
    mode: "online_demo",
    source_files: ["demo-regression.pdf", "demo-sku-rules.xlsx"],
    metrics: {
      line_count: 6,
      auto_pass_count: 5,
      auto_pass_rate: 0.83,
      manual_review_count: 1,
      field_issue_count: 1,
      rule_hit_count: 11
    },
    lines: [
      {
        order_id: "ODW-0901",
        sku: "BAG-MAKEUP-S",
        product_name: "化妆袋",
        variant_1: "Cream",
        variant_2: "S",
        quantity: 1,
        engraving: "Ria",
        bag_color: "Pink bag",
        delivery_name: "Ria Patel",
        source_page: 1,
        status: "auto_passed",
        confidence: 0.94
      }
    ],
    issues: [
      {
        order_id: "ODW-0902",
        field: "Personalization",
        code: "evidence_incomplete",
        severity: "manual_review",
        current_value: "send later",
        evidence: "Buyer note: I will send logo later",
        message: "客户表示稍后发送，公开 Demo 中展示为人工确认事项。"
      }
    ],
    candidate_rules: [
      {
        rule_type: "message_parse_rule",
        field: "稍后发送留言",
        status: "confirmed",
        source: "人工审核示例",
        description: "包含 send later / will send later 的订单不硬填刻字。",
        impact: "减少无证据刻字内容。"
      }
    ],
    traces: [
      {
        order_id: "ODW-0901",
        field: "product_name",
        value: "化妆袋",
        source: "SKU_RULE",
        evidence: "SKU BAG-MAKEUP-S 命中脱敏规则表",
        decision: "主数据命中，自动放行。"
      }
    ]
  }
];

export function getDemoJob(id: string): JobSummary | null {
  return DEMO_JOBS.find((job) => job.job_id === id) ?? null;
}
