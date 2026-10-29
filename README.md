# Flow2API

<div align="center">

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/fastapi-0.119.0-green.svg)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/docker-supported-blue.svg)](https://www.docker.com/)

**A complete OpenAI-compatible API service that gives Flow a single unified interface**

</div>

## ❤️ Sponsors

<table>
<tr>
<td width="180" align="center" valign="middle">
  <a href="https://useapi.net/docs/articles/google-flow-api-zh?utm_source=flow2api&utm_medium=referral&utm_campaign=flow2api-sponsor">
    <img src="https://useapi.net/assets/images/sponsor/useapi-banner.png" alt="useapi.net" width="150">
  </a>
</td>
<td valign="top">
  Thanks to <strong>useapi.net</strong> for sponsoring this project! <strong>One subscription, every API</strong>: useapi.net runs hosted APIs on your own Google account: <strong>Google Flow</strong> (Veo 3.1, audio-native Omni 1.1 Flash, Nano Banana Pro), <strong>Google Vids</strong> (Gemini Omni 1.1 Flash with voiced avatars, <strong>no captcha</strong>, an allowance separate from Flow, so using both on one account roughly doubles your Omni capacity), <strong>Google Flow Music</strong> (full songs with Lyria 3.5) and <strong>Gemini Notebook</strong> (NotebookLM). New: <strong>Meta Muse</strong> (muse.ai): images and about 10-second videos with spoken dialogue on your own Muse account, free plan included. Nothing to self-host. The same flat $15/month also covers Dreamina, Kling, PixVerse, MiniMax, Mureka, Runway and more. <a href="https://useapi.net/docs/articles/google-flow-api-zh?utm_source=flow2api&utm_medium=referral&utm_campaign=flow2api-sponsor">Flow tutorial (Chinese)</a> · <a href="https://useapi.net/docs/articles/google-vids-api-zh?utm_source=flow2api&utm_medium=referral&utm_campaign=flow2api-sponsor">Vids tutorial (Chinese)</a> · <a href="https://useapi.net/docs/articles/muse-api-zh?utm_source=flow2api&utm_medium=referral&utm_campaign=flow2api-sponsor">Muse tutorial (Chinese)</a> · <a href="https://useapi.net/docs/api-google-flow-v1?utm_source=flow2api&utm_medium=referral&utm_campaign=flow2api-sponsor">Flow docs</a> · <a href="https://useapi.net/docs/api-google-vids-v1?utm_source=flow2api&utm_medium=referral&utm_campaign=flow2api-sponsor">Vids docs</a> · <a href="https://useapi.net/docs/api-muse-v1?utm_source=flow2api&utm_medium=referral&utm_campaign=flow2api-sponsor">Muse docs</a> · <a href="https://buy.stripe.com/8x2aEX4Bd8Vh9PMg4qeUU03?client_reference_id=flow2api">Subscribe</a>
</td>
</tr>
</table>

<table>
<tr>
<td width="180" align="center" valign="middle">
  <a href="https://proxylane.dev/?utm_source=flow2api&utm_medium=partnership&utm_campaign=flow2api_sponsor_202610&utm_content=github_readme">
    <img src="static/sponsors/proxylane-flow2api.png" alt="ProxyLane" width="150">
  </a>
</td>
<td valign="top">
  Thanks to <strong>ProxyLane</strong> for sponsoring this project! ProxyLane is a residential proxy service in 195 countries, with 95%+ of IPs rated low risk by Scamalytics and HTTP / SOCKS5 with username and password. Put the proxy into a Token's protocol or captcha proxy, or into the global request proxy, with a city and a session name in the username: each Token keeps one residential IP for up to 72 hours, and a replacement IP stays in the same city. The console is in Chinese and USDT payment is supported. New customers get 30% off the first purchase with code <strong>FLOW2API30</strong>. <a href="https://proxylane.dev/?utm_source=flow2api&utm_medium=partnership&utm_campaign=flow2api_sponsor_202610&utm_content=github_readme">Sign up here</a> · <a href="https://proxylane.dev/?utm_source=flow2api&utm_medium=partnership&utm_campaign=flow2api_sponsor_202610&utm_content=github_readme_en">English landing page</a>
</td>
</tr>
</table>

## ✨ Core features

- 🎨 **Text to image** / **Image to image**
- 🎬 **Text to video** / **Image to video**
- 🎞️ **First and last frame video**
- 🔄 **Automatic cookie refresh** - Periodically refreshes the full Google/Flow cookie and verifies the session, with `browser`/`personal` browser fallback; after a session expires you need to sync the cookie again
- 📊 **Balance display** - Queries and shows VideoFX Credits in real time
- 🚀 **Load balancing** - Multi-token round robin with concurrency control
- 🌐 **Proxy support** - HTTP/SOCKS5 proxies
- 📱 **Web admin console** - Straightforward token and configuration management
- 🎨 **Continuous image generation conversations**
- 🧩 **Gemini native request body support** - `generateContent` / `streamGenerateContent`, `systemInstruction`, `contents.parts.text/inlineData/fileData`
- ✅ **Gemini native format verified end to end** - `/models/{model}:generateContent` has been tested with a real token and returns the official `candidates[].content.parts[].inlineData`

## 🚀 Quick start

### Prerequisites

- Docker and Docker Compose (recommended)
- Or Python 3.8+

- Flow now requires an extra captcha, so you can use either a browser solver or a third-party solver:
  - Sign up for [YesCaptcha](https://yescaptcha.com/i/13Xd8K) and get an API key, then enter it in the `YesCaptcha API key` field on the system settings page.
  - Sign up for [CapSolver](https://dashboard.capsolver.com/passport/register?inviteCode=z95yVf1HvixI) and get an API key, then enter it in the `CapSolver API key` field on the system settings page.
  - Sign up for [Captcha.run](https://captcha.run/sso?inviter=36179602-dbd1-4227-8ec8-98f8c0170c59) and get an API key, then enter it in the `Captcha.run API key` field on the system settings page.
  - Sign up for [2Captcha](https://2captcha.com/auth/register/?from=24953866) and get an API key, then enter it in the `2Captcha API key` field on the system settings page.
- YesCaptcha lets you switch `type` in the admin console: `RecaptchaV3TaskProxyless`, `RecaptchaV3TaskProxylessM1`, `RecaptchaV3TaskProxylessM1S7`, `RecaptchaV3TaskProxylessM1S9`. `M1S9` is the current recommendation; S7/S9 force a `minScore` of 0.7/0.9.
- The default `docker-compose.yml` is meant to be paired with a third-party solver (yescaptcha/captcharun/twocaptcha/capmonster/ezcaptcha/capsolver).
If you need headed captcha solving inside Docker (browser/personal), use `docker-compose.headed.yml` below.

- Browser extension that pushes new Flow sessions automatically: [Flow2API-Token-Updater](https://github.com/TheSmallHanCat/Flow2API-Token-Updater).

### Option 1: Docker deployment (recommended)

#### Standard mode (no proxy)

```bash
# Clone the project
git clone https://github.com/TheSmallHanCat/flow2api.git
cd flow2api

# Start the service
docker-compose up -d

# Follow the logs
docker-compose logs -f
```

> Note: Compose already mounts `./tmp:/app/tmp`. Setting the cache timeout to `0` means "never expire automatically"; keep this `tmp` mount if you want cached files to survive a container rebuild.

#### WARP mode (with proxy)

```bash
# Start with the WARP proxy
docker-compose -f docker-compose.proxy.yml up -d

# Follow the logs
docker-compose -f docker-compose.proxy.yml logs -f
```

#### Docker headed captcha mode (browser / personal)

> Use this when you need a virtualized desktop and want headed browser captcha solving inside the container.
> This mode starts `Xvfb + Fluxbox` to provide a display inside the container and sets `ALLOW_DOCKER_HEADED_CAPTCHA=true`.
> Only the application port is exposed; no remote desktop port is provided.
> The built-in `personal` browser now starts in headed mode by default; to temporarily switch back to headless, set the additional environment variable `PERSONAL_BROWSER_HEADLESS=true`.

```bash
# Start headed mode (add --build on the first run)
docker compose -f docker-compose.headed.yml up -d --build

# Follow the logs
docker compose -f docker-compose.headed.yml logs -f
```

- API port: `8000`
- After opening the admin console, set the captcha method to `browser` or `personal`

### Option 2: Local deployment

```bash
# Clone the project
git clone https://github.com/TheSmallHanCat/flow2api.git
cd flow2api

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# Windows
venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the service
python main.py
```

### First access

Once the service is running, open the admin console at **http://localhost:8000** and change the password immediately after your first login.

- **Username**: `admin`
- **Password**: `admin`

## 📈 Monitoring endpoints

- `GET /health`: public health check. Returns whether the service is up, plus counts of active tokens, tokens about to expire, expired tokens, tokens disabled by 429, and similar summary data.
- `GET /metrics`: Prometheus metrics endpoint.
- `GET /api/tokens`: admin endpoint. Returns token state such as `at_expires`, `at_expired`, `at_expiring_within_1h`, `ban_reason`, and `consecutive_error_count`.

Prometheus can scrape `/metrics` directly. On Kubernetes, prefer scraping it from inside the cluster only and restrict external access to `/metrics` separately at the Ingress/Gateway layer.

### Model test page

Open **http://localhost:8000/test** for the built-in model test page. It supports:

- Browsing all available models by category (image generation, text and image to video, multi-image video, video upscale, and more)
- One-click testing by entering a prompt, with generation progress streamed live
- Image upload for image-to-image and image-to-video requests
- Previewing the generated image or video as soon as it is ready

## 🌐 Interface language

The sign-in page, admin console, and model test page all support **Simplified Chinese and English**. Use the language selector in the top-right corner. The initial language follows your browser, and your manual selection is saved in the current browser, so it carries across pages and later visits. Switching languages does not reload the page and does not clear forms, uploaded images, or interrupt running generation tasks.

The captcha browser extension's settings page is also available in both languages. Its preference is stored in the extension's local storage and switching preserves unsaved settings.

API messages and errors honor `Accept-Language: zh-CN` or `Accept-Language: en` and return `Content-Language`. Unsupported languages fall back to Simplified Chinese. Account data, prompts, generated content, raw logs, and unknown upstream diagnostics remain unchanged. Generation results and SSE streams are passed through untranslated.

Translation catalogs live in `static/locales/`: `common.json` holds shared strings, `login.json` / `manage.json` / `test.json` cover the three pages, and `backend.json` covers API messages. Each catalog contains `zh-CN` and `en` entries keyed by the source message; keep interpolation placeholders such as `{0}` unchanged when adding translations.

The extension catalog is `extension/locales.json`.

## 📋 Supported models

### Image generation

`/v1/models` and Gemini `/models` currently expose two image families, Nano Banana 2.1 and Nano Banana 2 Lite, with 30 aspect-ratio and resolution variants in total. The existing `gemini-3.1-flash-image-*` names are kept and call the new Nano Banana 2.1 (`BELUGA`). The legacy Pro names `gemini-3.0-pro-image-*` still call Nano Banana Pro (`GEM_PIX_2`) but are not listed in the model list. Legacy Imagen models are no longer supported; unknown models never fall back to the old upstream fields.

| Public name | Resolution | Aspect ratio |
|---|---:|---:|
| `gemini-3.1-flash-image-landscape` | Default | Landscape |
| `gemini-3.1-flash-image-portrait` | Default | Portrait |
| `gemini-3.1-flash-image-square` | Default | Square |
| `gemini-3.1-flash-image-four-three` | Default | Landscape 4:3 |
| `gemini-3.1-flash-image-three-four` | Default | Portrait 3:4 |
| `gemini-3.1-flash-image-landscape-2k` | 2K | Landscape |
| `gemini-3.1-flash-image-portrait-2k` | 2K | Portrait |
| `gemini-3.1-flash-image-square-2k` | 2K | Square |
| `gemini-3.1-flash-image-four-three-2k` | 2K | Landscape 4:3 |
| `gemini-3.1-flash-image-three-four-2k` | 2K | Portrait 3:4 |
| `gemini-3.1-flash-image-landscape-4k` | 4K | Landscape |
| `gemini-3.1-flash-image-portrait-4k` | 4K | Portrait |
| `gemini-3.1-flash-image-square-4k` | 4K | Square |
| `gemini-3.1-flash-image-four-three-4k` | 4K | Landscape 4:3 |
| `gemini-3.1-flash-image-three-four-4k` | 4K | Portrait 3:4 |

Nano Banana 2 Lite uses `gemini-3.1-flash-lite-image-*` with the same aspect-ratio and resolution suffixes as the table above, for example `gemini-3.1-flash-lite-image-landscape`, `gemini-3.1-flash-lite-image-portrait-2k`, and `gemini-3.1-flash-lite-image-square-4k`. The shortened name `gemini-3.1-flash-lite-image` is also supported together with the `aspectRatio` / `imageSize` parameters.

2K/4K variants are produced by upscaling after generation and do not mean Lite natively outputs those resolutions. The main service submits model, aspect ratio, and reference images explicitly through the image RPC; both browser and third-party captcha solving only supply the captcha. `browser` / `personal` modes need no third-party captcha key, and image, upload, upscale, and video requests each fetch a captcha for the action they need. Lite never falls back to another image model automatically.

### Video generation

`/v1/models` and Gemini `/models` currently expose only the current Flow model families. Legacy underscore model names remain compatible but are no longer listed in the model list.

| Public name | Upstream family | Capability |
|---|---|---|
| `veo-3.1-lite` / `veo-3.1-fast` / `veo-3.1-quality` / `omni-1.1-flash` | Current default models | 8-second landscape text to video |
| `veo-3.1-lite-{4,6,8}s-{landscape,portrait}` | Veo 3.1 - Lite | Text to video |
| `veo-3.1-fast-{4,6,8}s-{landscape,portrait}` | Veo 3.1 - Fast | Text to video |
| `veo-3.1-quality-{4,6,8}s-{landscape,portrait}` | Veo 3.1 - Quality | Text to video |
| `omni-1.1-flash-{4,6,8,10}s-{landscape,portrait}` | Omni 1.1 Flash (`abra`) | Text to video / reference image video |
| `veo-3.1-{lite,fast,quality}-i2v-{4,6}s-{landscape,portrait}` | Veo 3.1 | First frame / first and last frame video |
| `veo-3.1-{lite,fast}-r2v-8s-{landscape,portrait}` | Veo 3.1 | Multi-reference image video |
| `veo-3.1-{lite,fast,quality}-extend-8s-{landscape,portrait}` | Veo 3.1 | Video extension |

Braces in the table mean "pick one of these values". For example, `veo-3.1-fast-{4,6,8}s-{landscape,portrait}` covers the 4/6/8-second and landscape/portrait combinations.

#### Omni 1.1 Flash

`Omni 1.1 Flash` supports both text to video and reference image video. Callers use the same set of model names, and the service picks the generation mode based on whether the request contains images:

- `omni-1.1-flash` is the default alias for `omni-1.1-flash-8s-landscape`.
- Full model names are `omni-1.1-flash-{4,6,8,10}s-{landscape,portrait}`, offering 4, 6, 8, or 10 seconds in landscape or portrait.
- Text only uses text-to-video mode; 1 to 3 `image_url` images switch to reference image video mode.
- Duration and orientation come from the model name, so no extra parameters with the same names are needed.

Reference image video request example:

```json
{
  "model": "omni-1.1-flash-8s-landscape",
  "messages": [
    {
      "role": "user",
      "content": [
        { "type": "text", "text": "Have the person in the frame turn naturally and look at the camera" },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/jpeg;base64,<reference_image_base64>"
          }
        }
      ]
    }
  ],
  "stream": true
}
```

#### Legacy names: Text to video (T2V)
⚠️ **Image upload is not supported**

| Model name | Description | Orientation |
|---------|---------|--------|
| `veo_3_1_t2v_fast_portrait` | Text to video | Portrait |
| `veo_3_1_t2v_fast_landscape` | Text to video | Landscape |
| `veo_3_1_t2v_fast_portrait_ultra` | Text to video | Portrait |
| `veo_3_1_t2v_fast_ultra` | Text to video | Landscape |
| `veo_3_1_t2v_fast_portrait_ultra_relaxed` | Text to video | Portrait |
| `veo_3_1_t2v_fast_ultra_relaxed` | Text to video | Landscape |
| `veo_3_1_t2v_portrait` | Text to video | Portrait |
| `veo_3_1_t2v_landscape` | Text to video | Landscape |
| `veo_3_1_t2v_landscape_4s` | Text to video, 4s | Landscape |
| `veo_3_1_t2v_portrait_4s` | Text to video, 4s | Portrait |
| `veo_3_1_t2v_landscape_6s` | Text to video, 6s | Landscape |
| `veo_3_1_t2v_portrait_6s` | Text to video, 6s | Portrait |
| `veo_3_1_t2v_fast_landscape_4s` | Text to video Fast, 4s | Landscape |
| `veo_3_1_t2v_fast_portrait_4s` | Text to video Fast, 4s | Portrait |
| `veo_3_1_t2v_fast_landscape_6s` | Text to video Fast, 6s | Landscape |
| `veo_3_1_t2v_fast_portrait_6s` | Text to video Fast, 6s | Portrait |
| `veo_3_1_t2v_lite_portrait` | Text to video Lite | Portrait |
| `veo_3_1_t2v_lite_landscape` | Text to video Lite | Landscape |
| `veo_3_1_t2v_lite_4s_portrait` | Text to video Lite, 4s | Portrait |
| `veo_3_1_t2v_lite_4s_landscape` | Text to video Lite, 4s | Landscape |
| `veo_3_1_t2v_lite_6s_portrait` | Text to video Lite, 6s | Portrait |
| `veo_3_1_t2v_lite_6s_landscape` | Text to video Lite, 6s | Landscape |

#### Legacy names: Image to video (I2V)
📸 **Supports 1 to 2 images: one as the first frame, two as the first and last frames**

> 💡 **Automatic selection**: the system picks the matching `model_key` based on the number of images
> - **Single frame mode** (1 image): generates a video from the first frame
> - **Two frame mode** (2 images): generates a transition video from the first frame to the last frame
> - `veo_3_1_i2v_lite_*` supports **1** first-frame image only
> - `veo_3_1_interpolation_lite_*` supports **2** first-and-last-frame images only

| Model name | Description | Orientation |
|---------|---------|--------|
| `veo_3_1_i2v_s_fast_portrait_fl` | Image to video | Portrait |
| `veo_3_1_i2v_s_fast_fl` | Image to video | Landscape |
| `veo_3_1_i2v_s_fast_portrait_ultra_fl` | Image to video | Portrait |
| `veo_3_1_i2v_s_fast_ultra_fl` | Image to video | Landscape |
| `veo_3_1_i2v_s_fast_portrait_ultra_relaxed` | Image to video | Portrait |
| `veo_3_1_i2v_s_fast_ultra_relaxed` | Image to video | Landscape |
| `veo_3_1_i2v_s_portrait` | Image to video | Portrait |
| `veo_3_1_i2v_s_landscape` | Image to video | Landscape |
| `veo_3_1_i2v_s_landscape_4s` | Image to video, 4s | Landscape |
| `veo_3_1_i2v_s_portrait_4s` | Image to video, 4s | Portrait |
| `veo_3_1_i2v_s_landscape_6s` | Image to video, 6s | Landscape |
| `veo_3_1_i2v_s_portrait_6s` | Image to video, 6s | Portrait |
| `veo_3_1_i2v_s_fast_landscape_4s_fl` | Image to video Fast, 4s | Landscape |
| `veo_3_1_i2v_s_fast_portrait_4s_fl` | Image to video Fast, 4s | Portrait |
| `veo_3_1_i2v_s_fast_landscape_6s_fl` | Image to video Fast, 6s | Landscape |
| `veo_3_1_i2v_s_fast_portrait_6s_fl` | Image to video Fast, 6s | Portrait |
| `veo_3_1_i2v_lite_portrait` | Image to video Lite (first frame only) | Portrait |
| `veo_3_1_i2v_lite_landscape` | Image to video Lite (first frame only) | Landscape |
| `veo_3_1_i2v_lite_4s_portrait` | Image to video Lite, 4s (first frame only) | Portrait |
| `veo_3_1_i2v_lite_4s_landscape` | Image to video Lite, 4s (first frame only) | Landscape |
| `veo_3_1_i2v_lite_6s_portrait` | Image to video Lite, 6s (first frame only) | Portrait |
| `veo_3_1_i2v_lite_6s_landscape` | Image to video Lite, 6s (first frame only) | Landscape |
| `veo_3_1_interpolation_lite_portrait` | Image to video Lite (first to last frame transition) | Portrait |
| `veo_3_1_interpolation_lite_landscape` | Image to video Lite (first to last frame transition) | Landscape |
| `veo_3_1_interpolation_lite_4s_portrait` | Image to video Lite, 4s (first to last frame transition) | Portrait |
| `veo_3_1_interpolation_lite_4s_landscape` | Image to video Lite, 4s (first to last frame transition) | Landscape |
| `veo_3_1_interpolation_lite_6s_portrait` | Image to video Lite, 6s (first to last frame transition) | Portrait |
| `veo_3_1_interpolation_lite_6s_landscape` | Image to video Lite, 6s (first to last frame transition) | Landscape |

#### Legacy names: Reference images to video (R2V)
🖼️ **Supports multiple images**

> **2026-03-06 update**
>
> - Synced with the new upstream `R2V` video request body
> - `textInput` has moved to `structuredPrompt.parts`
> - Added top-level `mediaGenerationContext.batchId`
> - Added top-level `useV2ModelConfig: true`
> - Landscape and portrait `R2V` models share the same new request body
> - The upstream `videoModelKey` for landscape `R2V` now uses the `*_landscape` form
> - Under the current upstream protocol, `referenceImages` accepts at most **3** images

| Model name | Description | Orientation |
|---------|---------|--------|
| `veo_3_1_r2v_fast_portrait` | Image to video | Portrait |
| `veo_3_1_r2v_fast_landscape` | Image to video | Landscape |
| `veo_3_1_r2v_fast_portrait_ultra` | Image to video | Portrait |
| `veo_3_1_r2v_fast_landscape_ultra` | Image to video | Landscape |
| `veo_3_1_r2v_fast_portrait_ultra_relaxed` | Image to video | Portrait |
| `veo_3_1_r2v_fast_landscape_ultra_relaxed` | Image to video | Landscape |

#### Legacy names: Video upscale

These models do not call an upstream upsampler key directly. They first generate a video with the matching regular Veo 3.1 model, then submit a 1080P/4K upscale request.

| Model name | Description | Output |
|---------|---------|--------|
| `veo_3_1_t2v_landscape_4k` | Text to video upscale | 4K |
| `veo_3_1_t2v_portrait_4k` | Text to video upscale | 4K |
| `veo_3_1_t2v_landscape_1080p` | Text to video upscale | 1080P |
| `veo_3_1_t2v_portrait_1080p` | Text to video upscale | 1080P |
| `veo_3_1_t2v_landscape_4s_4k` | Text to video, 4s, upscale | 4K |
| `veo_3_1_t2v_portrait_4s_4k` | Text to video, 4s, upscale | 4K |
| `veo_3_1_t2v_landscape_4s_1080p` | Text to video, 4s, upscale | 1080P |
| `veo_3_1_t2v_portrait_4s_1080p` | Text to video, 4s, upscale | 1080P |
| `veo_3_1_t2v_landscape_6s_4k` | Text to video, 6s, upscale | 4K |
| `veo_3_1_t2v_portrait_6s_4k` | Text to video, 6s, upscale | 4K |
| `veo_3_1_t2v_landscape_6s_1080p` | Text to video, 6s, upscale | 1080P |
| `veo_3_1_t2v_portrait_6s_1080p` | Text to video, 6s, upscale | 1080P |
| `veo_3_1_t2v_fast_portrait_4k` | Text to video upscale | 4K |
| `veo_3_1_t2v_fast_4k` | Text to video upscale | 4K |
| `veo_3_1_t2v_fast_portrait_ultra_4k` | Text to video upscale | 4K |
| `veo_3_1_t2v_fast_ultra_4k` | Text to video upscale | 4K |
| `veo_3_1_t2v_fast_portrait_1080p` | Text to video upscale | 1080P |
| `veo_3_1_t2v_fast_1080p` | Text to video upscale | 1080P |
| `veo_3_1_t2v_fast_portrait_ultra_1080p` | Text to video upscale | 1080P |
| `veo_3_1_t2v_fast_ultra_1080p` | Text to video upscale | 1080P |
| `veo_3_1_i2v_s_fast_portrait_ultra_fl_4k` | Image to video upscale | 4K |
| `veo_3_1_i2v_s_fast_ultra_fl_4k` | Image to video upscale | 4K |
| `veo_3_1_i2v_s_fast_portrait_ultra_fl_1080p` | Image to video upscale | 1080P |
| `veo_3_1_i2v_s_fast_ultra_fl_1080p` | Image to video upscale | 1080P |
| `veo_3_1_i2v_s_landscape_4k` | Image to video upscale | 4K |
| `veo_3_1_i2v_s_portrait_4k` | Image to video upscale | 4K |
| `veo_3_1_i2v_s_landscape_1080p` | Image to video upscale | 1080P |
| `veo_3_1_i2v_s_portrait_1080p` | Image to video upscale | 1080P |
| `veo_3_1_i2v_s_landscape_4s_4k` | Image to video, 4s, upscale | 4K |
| `veo_3_1_i2v_s_portrait_4s_4k` | Image to video, 4s, upscale | 4K |
| `veo_3_1_i2v_s_landscape_4s_1080p` | Image to video, 4s, upscale | 1080P |
| `veo_3_1_i2v_s_portrait_4s_1080p` | Image to video, 4s, upscale | 1080P |
| `veo_3_1_i2v_s_landscape_6s_4k` | Image to video, 6s, upscale | 4K |
| `veo_3_1_i2v_s_portrait_6s_4k` | Image to video, 6s, upscale | 4K |
| `veo_3_1_i2v_s_landscape_6s_1080p` | Image to video, 6s, upscale | 1080P |
| `veo_3_1_i2v_s_portrait_6s_1080p` | Image to video, 6s, upscale | 1080P |
| `veo_3_1_r2v_fast_portrait_ultra_4k` | Multi-image video upscale | 4K |
| `veo_3_1_r2v_fast_landscape_ultra_4k` | Multi-image video upscale | 4K |
| `veo_3_1_r2v_fast_portrait_ultra_1080p` | Multi-image video upscale | 1080P |
| `veo_3_1_r2v_fast_landscape_ultra_1080p` | Multi-image video upscale | 1080P |

## 📡 API usage examples (streaming required)

> Besides the `OpenAI-compatible` examples below, the service also supports the native Gemini format:
> - `POST /v1beta/models/{model}:generateContent`
> - `POST /models/{model}:generateContent`
> - `POST /v1beta/models/{model}:streamGenerateContent`
> - `POST /models/{model}:streamGenerateContent`
>
> The native Gemini format accepts these authentication methods:
> - `Authorization: Bearer <api_key>`
> - `x-goog-api-key: <api_key>`
> - `?key=<api_key>`
>
> The native Gemini image request body supports:
> - `systemInstruction`
> - `contents[].parts[].text`
> - `contents[].parts[].inlineData`
> - `contents[].parts[].fileData.fileUri`
> - `generationConfig.responseModalities`
> - `generationConfig.imageConfig.aspectRatio`
> - `generationConfig.imageConfig.imageSize`

### Native Gemini generateContent (text to image)

> Verified with a real token.
> For a streamed response, replace the path with `:streamGenerateContent?alt=sse`.

```bash
curl -X POST "http://localhost:8000/models/gemini-3.1-flash-image:generateContent" \
  -H "x-goog-api-key: han1234" \
  -H "Content-Type: application/json" \
  -d '{
    "systemInstruction": {
      "parts": [
        {
          "text": "Return an image only."
        }
      ]
    },
    "contents": [
      {
        "role": "user",
        "parts": [
          {
            "text": "A red apple on a wooden table, studio lighting, minimalist background"
          }
        ]
      }
    ],
    "generationConfig": {
      "responseModalities": ["IMAGE"],
      "imageConfig": {
        "aspectRatio": "1:1",
        "imageSize": "1K"
      }
    }
  }'
```

### Text to image

```bash
curl -X POST "http://localhost:8000/v1/chat/completions" \
  -H "Authorization: Bearer han1234" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3.1-flash-image-landscape",
    "messages": [
      {
        "role": "user",
        "content": "A cute cat playing in a garden"
      }
    ],
    "stream": true
  }'
```

### Image to image

```bash
curl -X POST "http://localhost:8000/v1/chat/completions" \
  -H "Authorization: Bearer han1234" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3.1-flash-image-landscape",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Turn this image into a watercolor painting"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "data:image/jpeg;base64,<base64_encoded_image>"
            }
          }
        ]
      }
    ],
    "stream": true
  }'
```

### Text to video

```bash
curl -X POST "http://localhost:8000/v1/chat/completions" \
  -H "Authorization: Bearer han1234" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "veo-3.1-fast-8s-landscape",
    "messages": [
      {
        "role": "user",
        "content": "A kitten chasing butterflies on a grassy field"
      }
    ],
    "stream": true
  }'
```

### First and last frame to video

```bash
curl -X POST "http://localhost:8000/v1/chat/completions" \
  -H "Authorization: Bearer han1234" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "veo-3.1-fast-i2v-4s-landscape",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Transition from the first image to the second image"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "data:image/jpeg;base64,<first_frame_base64>"
            }
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "data:image/jpeg;base64,<last_frame_base64>"
            }
          }
        ]
      }
    ],
    "stream": true
  }'
```

### Multi-image to video

> The server assembles the new video request body for `R2V` automatically; callers keep using OpenAI-compatible input.
> The server maps landscape `R2V` models to the latest `*_landscape` upstream model keys.
> At most **3 reference images** are accepted.

```bash
curl -X POST "http://localhost:8000/v1/chat/completions" \
  -H "Authorization: Bearer han1234" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "veo-3.1-fast-r2v-8s-portrait",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Based on the characters and scenes in the three reference images, generate a portrait video with a smooth forward camera move"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "data:image/jpeg;base64/<reference_image_1_base64>"
            }
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "data:image/jpeg;base64/<reference_image_2_base64>"
            }
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "data:image/jpeg;base64/<reference_image_3_base64>"
            }
          }
        ]
      }
    ],
    "stream": true
  }'
```

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [PearNoDec](https://github.com/PearNoDec) for the YesCaptcha solving approach
- [raomaiping](https://github.com/raomaiping) for the headless captcha solving approach

Thanks to everyone who contributes to and uses this project.

---

## 📞 Contact

- Report an issue: [GitHub Issues](https://github.com/TheSmallHanCat/flow2api/issues)

---

**⭐ If this project helps you, please give it a Star!**

## Star History

[![Star History Chart](https://star-history.dera.page/svg?repos=TheSmallHanCat/flow2api&type=date&legend=top-left)](https://star-history.dera.page/#TheSmallHanCat/flow2api&type=date&legend=top-left)
