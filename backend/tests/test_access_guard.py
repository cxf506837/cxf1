import importlib
import os
import tempfile
import unittest

from fastapi import HTTPException


class AccessGuardTest(unittest.TestCase):
    def setUp(self):
        self._old_storage = os.environ.get("ORDEROPS_STORAGE_ROOT")
        self._old_password = os.environ.get("ORDEROPS_DEMO_PASSWORD")
        self.temp_dir = tempfile.TemporaryDirectory()
        os.environ["ORDEROPS_STORAGE_ROOT"] = self.temp_dir.name
        os.environ["ORDEROPS_DEMO_PASSWORD"] = "demo-pass"

        import app.config as config
        import app.auth as auth

        importlib.reload(config)
        self.auth = importlib.reload(auth)

    def tearDown(self):
        self.temp_dir.cleanup()
        if self._old_storage is None:
            os.environ.pop("ORDEROPS_STORAGE_ROOT", None)
        else:
            os.environ["ORDEROPS_STORAGE_ROOT"] = self._old_storage
        if self._old_password is None:
            os.environ.pop("ORDEROPS_DEMO_PASSWORD", None)
        else:
            os.environ["ORDEROPS_DEMO_PASSWORD"] = self._old_password

    def test_access_guard_rejects_missing_password_when_enabled(self):
        with self.assertRaises(HTTPException) as context:
            self.auth.require_demo_access(None)

        self.assertEqual(context.exception.status_code, 401)
        self.assertEqual(context.exception.detail, "访问密码不正确")

    def test_access_guard_accepts_correct_password(self):
        self.assertIsNone(self.auth.require_demo_access("demo-pass"))

    def test_access_guard_is_disabled_when_password_is_not_configured(self):
        os.environ.pop("ORDEROPS_DEMO_PASSWORD", None)

        import app.config as config
        import app.auth as auth

        importlib.reload(config)
        auth = importlib.reload(auth)
        self.assertIsNone(auth.require_demo_access(None))


if __name__ == "__main__":
    unittest.main()
