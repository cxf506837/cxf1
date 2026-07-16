import unittest

from app.security import (
    find_forbidden_repository_content,
    is_safe_zip_member,
    sanitize_output_name,
)


class SecurityTest(unittest.TestCase):
    def test_zip_member_guard_rejects_path_traversal_and_non_pdf(self):
        self.assertTrue(is_safe_zip_member("orders/0502.pdf"))
        self.assertTrue(is_safe_zip_member("Barry5.12.PDF"))
        self.assertFalse(is_safe_zip_member("../secret.pdf"))
        self.assertFalse(is_safe_zip_member("C:/Users/Admin/secret.pdf"))
        self.assertFalse(is_safe_zip_member("__MACOSX/._0502.pdf"))
        self.assertFalse(is_safe_zip_member("orders/readme.txt"))

    def test_output_name_is_stable_and_safe(self):
        self.assertEqual(sanitize_output_name("Barry 5.12.pdf"), "Barry_5.12")
        unsafe_name = "../" + "客户" + "真实" + "地址.pdf"
        self.assertEqual(sanitize_output_name(unsafe_name), "file")
        self.assertEqual(sanitize_output_name("safe-name_01"), "safe-name_01")

    def test_repository_guard_catches_secrets_and_real_customer_markers(self):
        findings = find_forbidden_repository_content(
            {
                "README.md": "demo only",
                ".env": "OPENAI_API_KEY=" + "sk-" + "proj-should-not-exist",
                "samples/order.txt": "Ship to: real " + "customer address",
            }
        )

        self.assertIn(".env:possible_openai_key", findings)
        self.assertIn("samples/order.txt:customer_data_marker", findings)


if __name__ == "__main__":
    unittest.main()
