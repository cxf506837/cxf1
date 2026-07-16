import unittest

from app.demo_data import build_synthetic_pdf_text, synthetic_sku_master
from app.pipeline import process_order_text


class PipelineTest(unittest.TestCase):
    def test_processes_synthetic_orders_with_traceable_quality_metrics(self):
        result = process_order_text(
            build_synthetic_pdf_text(),
            sku_master=synthetic_sku_master(),
            job_name="demo-regression",
        )

        self.assertEqual(result.job_name, "demo-regression")
        self.assertEqual(len(result.lines), 4)
        self.assertGreaterEqual(result.metrics["auto_pass_rate"], 0.5)
        self.assertEqual(result.metrics["manual_review_count"], 1)
        self.assertEqual(result.metrics["field_issue_count"], 0)
        self.assertGreaterEqual(result.metrics["rule_hit_count"], 3)
        self.assertGreaterEqual(len(result.traces), len(result.lines))

    def test_keeps_question_mark_content_for_review_without_guessing(self):
        result = process_order_text(
            build_synthetic_pdf_text(),
            sku_master=synthetic_sku_master(),
            job_name="demo-regression",
        )

        flagged = [
            issue
            for issue in result.issues
            if issue.code == "question_mark_requires_review"
        ]
        self.assertEqual(len(flagged), 1)
        self.assertEqual(flagged[0].field, "delivery_name")
        self.assertEqual(flagged[0].severity, "manual_review")

    def test_candidate_rules_are_created_but_not_confirmed(self):
        result = process_order_text(
            build_synthetic_pdf_text(),
            sku_master=synthetic_sku_master(),
            job_name="demo-regression",
        )

        candidate_types = {rule.rule_type for rule in result.candidate_rules}
        self.assertIn("message_parse_rule", candidate_types)
        self.assertTrue(all(rule.status == "pending" for rule in result.candidate_rules))

    def test_inline_numbered_bag_color_does_not_leave_marker_in_engraving(self):
        result = process_order_text(
            build_synthetic_pdf_text(),
            sku_master=synthetic_sku_master(),
            job_name="demo-regression",
        )

        ring_box = next(line for line in result.lines if line.order_id == "ODW-1003")

        self.assertEqual(ring_box.bag_color, "Grey")
        self.assertEqual(ring_box.engraving, "Mr. & Mrs. Kitt, 06.06.26")


if __name__ == "__main__":
    unittest.main()
