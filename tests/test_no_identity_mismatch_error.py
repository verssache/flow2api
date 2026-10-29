"""Guard test: no place may ever produce hard-failure identity-mismatch messages.

The real account is authoritative from the Flow page and the local email is auto-corrected
on refresh; only an account already occupied by another Token may raise.
"""

import pathlib
import unittest

FORBIDDEN_SNIPPETS = (
    "\u4e0e\u5f53\u524d Token \u4e0d\u4e00\u81f4",
    "\u8bf7\u540c\u6b65\u5bf9\u5e94\u8d26\u53f7\u7684 Google Cookies",
)

SRC_ROOT = pathlib.Path(__file__).resolve().parent.parent / "src"


class NoIdentityMismatchErrorTests(unittest.TestCase):
    def test_source_tree_never_contains_identity_mismatch_error(self):
        offenders = []
        for path in sorted(SRC_ROOT.rglob("*")):
            if not path.is_file() or path.suffix not in {".py", ".js", ".html"}:
                continue
            try:
                text = path.read_text(encoding="utf-8")
            except (UnicodeDecodeError, OSError):
                continue
            for snippet in FORBIDDEN_SNIPPETS:
                if snippet in text:
                    offenders.append(f"{path}: {snippet}")
        self.assertEqual(
            offenders,
            [],
            "Forbidden identity-mismatch messages found: " + "; ".join(offenders),
        )


class LegacyRefreshResultSanitizerTests(unittest.TestCase):
    """Legacy errors left in old databases must not be echoed back to the frontend."""

    def setUp(self):
        from src.api import admin as admin_mod

        self.admin = admin_mod

    def legacy_text(self):
        return (
            "RuntimeError: Flow \u767b\u5f55\u8d26\u53f7"
            + "\u4e0e\u5f53\u524d Token \u4e0d\u4e00\u81f4，"
            + "\u8bf7\u540c\u6b65\u5bf9\u5e94\u8d26\u53f7\u7684 Google Cookies"
        )

    def test_legacy_identity_error_is_dropped(self):
        self.assertEqual(self.admin._sanitize_refresh_result(self.legacy_text()), "")

    def test_other_errors_are_kept(self):
        self.assertEqual(
            self.admin._sanitize_refresh_result("RuntimeError: connection timed out"),
            "RuntimeError: connection timed out",
        )
        self.assertEqual(self.admin._sanitize_refresh_result("success"), "success")
        self.assertEqual(self.admin._sanitize_refresh_result(None), "")


if __name__ == "__main__":
    unittest.main()
