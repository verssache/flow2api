"""Cookie snapshot compatibility: must not raise AttributeError when get_updated_flow_cookies is missing.

Historical failure: a custom/legacy flow_frontend overrode the newly added upstream Cookie scope method,
causing direct failure when adding Google Cookie:

    Add failed: Google Cookie validation failed:
    'FlowClient' object has no attribute 'get_updated_flow_cookies'

Fix strategy: change the call site to safe access (getattr + fallback returning the original Cookie string),
preserving upstream Cookie rotation snapshot support while tolerating incomplete mixin overrides.
"""

import unittest

from src.services.flow_client import _safe_updated_flow_cookies as client_helper
from src.services.flow_current import _safe_updated_flow_cookies as current_helper

HELPERS = (client_helper, current_helper)


class _NoSuchMethod:
    """Simulate a legacy mixin lacking get_updated_flow_cookies."""


class _WithMethod:
    def get_updated_flow_cookies(self, original):
        return f"{original};ROTATED=1"


class _RaisingMethod:
    def get_updated_flow_cookies(self, original):
        raise RuntimeError("boom")


class SafeUpdatedFlowCookiesTest(unittest.TestCase):
    def test_missing_method_falls_back_to_original(self):
        for helper in HELPERS:
            with self.subTest(helper=helper.__module__):
                self.assertEqual(helper(_NoSuchMethod(), "SID=abc"), "SID=abc")

    def test_missing_method_normalizes_none(self):
        for helper in HELPERS:
            with self.subTest(helper=helper.__module__):
                self.assertEqual(helper(_NoSuchMethod(), None), "")

    def test_uses_method_when_present(self):
        for helper in HELPERS:
            with self.subTest(helper=helper.__module__):
                self.assertEqual(
                    helper(_WithMethod(), "SID=abc"), "SID=abc;ROTATED=1"
                )

    def test_method_error_falls_back_to_original(self):
        for helper in HELPERS:
            with self.subTest(helper=helper.__module__):
                self.assertEqual(helper(_RaisingMethod(), " SID=abc "), "SID=abc")


if __name__ == "__main__":
    unittest.main()
