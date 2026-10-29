"""English-only response header middleware."""


class I18nMiddleware:
    """Mark JSON responses as English while passing bodies through unchanged."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        async def english_headers(message):
            if message["type"] == "http.response.start":
                headers = list(message.get("headers", []))
                content_type = next(
                    (value for name, value in headers if name.lower() == b"content-type"),
                    b"",
                )
                if b"application/json" in content_type:
                    headers = [
                        (name, value)
                        for name, value in headers
                        if name.lower() != b"content-language"
                    ]
                    headers.append((b"content-language", b"en"))
                    message = {**message, "headers": headers}
            await send(message)

        await self.app(scope, receive, english_headers)
