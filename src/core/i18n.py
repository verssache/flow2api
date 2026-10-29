"""English-only response helpers for public API messages."""


SUPPORTED_LANGUAGES = ("en",)



def negotiate_language(header: str = "") -> str:
    """Return the only supported response language."""
    return "en"


def translate_message(message: str, language: str = "en", *, _depth: int = 0) -> str:
    """Return the message unchanged because the API only emits English."""
    return message


class I18nMiddleware:
    """Advertise English on JSON responses while passing bodies through unchanged."""

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
                    vary = next(
                        (value for name, value in headers if name.lower() == b"vary"),
                        b"",
                    )
                    items = {item.strip().lower() for item in vary.split(b",")}
                    if b"accept-language" not in items and vary != b"*":
                        headers = [
                            (name, value)
                            for name, value in headers
                            if name.lower() != b"vary"
                        ]
                        headers.append(
                            (b"vary", vary + (b", " if vary else b"") + b"Accept-Language")
                        )
                    message = {**message, "headers": headers}
            await send(message)

        await self.app(scope, receive, english_headers)
