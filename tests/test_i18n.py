"""The API is English-only and must not rewrite application data."""

import asyncio
from unittest.mock import AsyncMock, patch

import httpx
import pytest
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse

from src.api import admin, routes
from src.core.auth import verify_api_key_flexible
from src.core.i18n import I18nMiddleware


@pytest.mark.parametrize("path", ["/v1/models", "/v1beta/models", "/models"])
@pytest.mark.parametrize("language", ["en", "zh-CN", "fr-FR"])
def test_model_list_always_returns_english_auth_error(path, language):
    app = FastAPI()
    app.add_middleware(I18nMiddleware)
    app.include_router(routes.router)

    def unauthorized():
        raise HTTPException(status_code=401, detail="Invalid API key")

    app.dependency_overrides[verify_api_key_flexible] = unauthorized

    async def check():
        async with httpx.AsyncClient(
            transport=httpx.ASGITransport(app=app), base_url="http://localhost"
        ) as client:
            response = await client.get(path, headers={"Accept-Language": language})
            assert response.status_code == 401
            assert response.json() == {"detail": "Invalid API key"}
            assert response.headers["content-language"] == "en"
            assert "accept-language" not in response.headers.get("vary", "").lower()

    asyncio.run(check())


def test_api_messages_are_not_rewritten_and_streams_pass_through():
    app = FastAPI()
    app.add_middleware(I18nMiddleware)

    @app.get("/api/message")
    async def message():
        await asyncio.sleep(0)
        return JSONResponse(
            {
                "message": "Token enabled",
                "remark": "Saved note",
                "data": {"message": "Token enabled", "prompt": "Saved note"},
            },
            headers={"Vary": "Origin"},
        )

    @app.get("/api/logs/1")
    async def log():
        return {"message": "Token enabled", "request_body": "Saved note"}

    @app.get("/v1/error")
    async def error():
        return JSONResponse(
            {"error": {"message": "Prompt cannot be empty", "code": "invalid_request"}},
            status_code=400,
        )

    @app.get("/api/validation")
    async def validation():
        return JSONResponse(
            {"detail": [{"msg": "Field required", "input": "Field required"}]},
            status_code=422,
        )

    @app.get("/v1/stream")
    async def stream():
        async def chunks():
            yield 'data: {"content":"Saved note"}\n\n'
            yield "data: [DONE]\n\n"

        return StreamingResponse(chunks(), media_type="text/event-stream")

    async def check():
        async with httpx.AsyncClient(
            transport=httpx.ASGITransport(app=app), base_url="http://localhost"
        ) as client:
            english = await client.get("/api/message", headers={"Accept-Language": "en"})
            other = await client.get("/api/message", headers={"Accept-Language": "zh-CN"})
            assert english.json()["message"] == "Token enabled"
            assert other.json()["message"] == "Token enabled"
            assert english.json()["remark"] == "Saved note"
            assert english.json()["data"] == {"message": "Token enabled", "prompt": "Saved note"}
            assert english.headers["content-language"] == "en"
            assert other.headers["content-language"] == "en"
            assert english.headers["vary"] == "Origin"
            assert int(english.headers["content-length"]) == len(english.content)
            raw_log = await client.get("/api/logs/1", headers={"Accept-Language": "en"})
            assert raw_log.json()["message"] == "Token enabled"
            result = await client.get("/v1/error", headers={"Accept-Language": "zh-CN"})
            assert result.status_code == 400
            assert result.json()["error"]["message"] == "Prompt cannot be empty"
            result = await client.get("/api/validation", headers={"Accept-Language": "zh-CN"})
            assert result.json()["detail"][0] == {
                "msg": "Field required",
                "input": "Field required",
            }
            result = await client.get("/v1/stream", headers={"Accept-Language": "en"})
            assert result.text == 'data: {"content":"Saved note"}\n\ndata: [DONE]\n\n'
            assert "content-language" not in result.headers

    asyncio.run(check())


def test_existing_admin_endpoint_returns_english():
    app = FastAPI()
    app.add_middleware(I18nMiddleware)
    app.include_router(admin.router)
    app.dependency_overrides[admin.verify_admin_token] = lambda: "i18n-test-session"

    async def check():
        async with httpx.AsyncClient(
            transport=httpx.ASGITransport(app=app), base_url="http://localhost"
        ) as client:
            with patch.object(admin, "token_manager", AsyncMock()):
                response = await client.post(
                    "/api/tokens/1/enable", headers={"Accept-Language": "zh-CN"}
                )
            assert response.status_code == 200
            assert response.json() == {"success": True, "message": "Token enabled"}
            assert response.headers["content-language"] == "en"

    asyncio.run(check())


def test_translation_assets_are_english_only_and_pages_stay_protected():
    from src.main import app

    async def check():
        async with httpx.AsyncClient(
            transport=httpx.ASGITransport(app=app), base_url="http://localhost"
        ) as client:
            assert (await client.get("/static/i18n.js")).status_code == 200
            script = await client.get("/static/model-tester.js")
            assert script.status_code == 200
            assert "application/javascript" in script.headers["content-type"]
            assert "no-store" in script.headers["cache-control"]
            assert (await client.get("/static/locales/login.json")).status_code == 404
            for path in ("/static/manage.html", "/static/test.html"):
                assert (await client.get(path)).status_code == 404
            assert (await client.get("/test")).status_code == 404
            result = await client.get("/manage")
            assert result.status_code == 302
            assert result.headers["location"] == "/login"

    asyncio.run(check())
