import io
import unittest
import zipfile

from app.security import collect_safe_pdf_members


class ZipGuardTest(unittest.TestCase):
    def test_collect_safe_pdf_members_filters_unsafe_entries(self):
        buffer = io.BytesIO()
        with zipfile.ZipFile(buffer, "w") as zf:
            zf.writestr("0502.pdf", b"%PDF demo")
            zf.writestr("../steal.pdf", b"bad")
            zf.writestr("notes.txt", b"skip")
            zf.writestr("__MACOSX/._0502.pdf", b"skip")

        members = collect_safe_pdf_members(buffer.getvalue())

        self.assertEqual(list(members.keys()), ["0502.pdf"])
        self.assertEqual(members["0502.pdf"], b"%PDF demo")


if __name__ == "__main__":
    unittest.main()
