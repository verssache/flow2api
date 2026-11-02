import json
import unittest
from unittest.mock import AsyncMock, MagicMock

from src.services.generation_handler import MODEL_CONFIG, GenerationHandler
from src.services.load_balancer import LoadBalancer


VIDEO_URL = "https://flow-content.google/video/a1607a19-a932-4c31-bb39-b5f6283f1eee"


class DirectMediaVideoTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        handler = GenerationHandler.__new__(GenerationHandler)
        handler.token_manager = MagicMock()
        handler.token_manager.record_usage = AsyncMock()
        handler.token_manager.record_success = AsyncMock()
        handler.flow_client = MagicMock()
        handler.flow_client.generate_video_text = AsyncMock(
            return_value={"direct_media": True, "video_url": VIDEO_URL}
        )
        handler.proxy_manager = None
        handler.load_balancer = LoadBalancer.__new__(LoadBalancer)
        handler._update_request_log_progress = AsyncMock()
        handler._log_request = AsyncMock()
        self.handler = handler
        self.token = MagicMock(
            id=7, at="at", user_paygate_tier="PAYGATE_TIER_ONE", video_concurrency=-1
        )
        self.token.google_cookies = "cookies"

    async def _run(self, stream: bool):
        generation_result = {}
        chunks = [
            chunk
            async for chunk in self.handler._handle_video_generation(
                self.token,
                "project-1",
                MODEL_CONFIG["veo-3.1-fast-8s-landscape"],
                "a kitten chasing butterflies",
                None,
                stream,
                generation_result=generation_result,
                request_log_state={"id": 1},
            )
        ]
        return chunks, generation_result

    async def test_direct_media_returns_video_without_polling(self):
        chunks, generation_result = await self._run(stream=False)

        self.assertTrue(generation_result.get("success"))
        payload = json.loads(chunks[-1])
        self.assertIn(VIDEO_URL, payload["choices"][0]["message"]["content"])
        self.handler.token_manager.record_usage.assert_awaited_once_with(7, is_video=True)
        self.handler.token_manager.record_success.assert_awaited_once_with(7)

    async def test_direct_media_stream_ends_with_video_tag(self):
        chunks, generation_result = await self._run(stream=True)

        self.assertTrue(generation_result.get("success"))
        self.assertIn(f"<video src='{VIDEO_URL}'", chunks[-1])


if __name__ == "__main__":
    unittest.main()
