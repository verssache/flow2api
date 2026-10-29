"""Guard test: no place may ever produce hard-failure messages like "Flow login account does not match the current Token".

The real account is authoritative from the Flow page and the local email is auto-corrected on refresh;
only "this account is already occupied by another Token" may raise.
"""

import pathlib
import unittest

FORBIDDEN_SNIPPETS = (
    "与当前 Token 不一致",
    "请同步对应账号的 Google Cookies",
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
        self.assertEqual(offenders, [], "发现禁止出现的身份不一致提示：" + "; ".join(offenders))


class LegacyRefreshResultSanitizerTests(unittest.TestCase):
    """Legacy errors left in old databases must not be echoed back to the frontend."""

    def setUp(self):
        from src.api import admin as admin_mod

        self.admin = admin_mod

    def legacy_text(self):
        # Constructed by concatenation to keep the forbidden full message out of the source
        return (
            "RuntimeError: Flow 登录账号"
            + "与当前 Token 不一致，请同步对应账号的 Google Cookies"
        )

    def test_legacy_identity_error_is_dropped(self):
        # Such legacy errors are no longer shown: normalized to an empty string
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
