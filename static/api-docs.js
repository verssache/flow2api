/* API Docs page: fills in runnable snippets and handles the language tabs. */
(() => {
    'use strict';

    const $ = id => document.getElementById(id);
    const BASE = window.location.origin;
    const KEY = '<your_api_key>';

    const quickstart = {
        curl: `curl -X POST "${BASE}/v1/chat/completions" \\
  -H "Authorization: Bearer ${KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gemini-3.1-flash-image-landscape",
    "messages": [
      { "role": "user", "content": "A red apple on a wooden table, studio lighting" }
    ],
    "stream": true
  }'`,
        python: `# pip install openai
from openai import OpenAI

client = OpenAI(base_url="${BASE}/v1", api_key="${KEY}")

stream = client.chat.completions.create(
    model="gemini-3.1-flash-image-landscape",
    messages=[{"role": "user", "content": "A red apple on a wooden table, studio lighting"}],
    stream=True,
    timeout=600,
)

content = ""
for chunk in stream:
    delta = chunk.choices[0].delta
    # Progress updates arrive as reasoning_content; the final result as content.
    if getattr(delta, "reasoning_content", None):
        print(delta.reasoning_content, end="", flush=True)
    if delta.content:
        content += delta.content

import re
match = re.search(r"!\\[.*?\\]\\((.*?)\\)", content)
print("\\nImage URL:", match.group(1) if match else content)`,
        node: `// npm install openai
import OpenAI from "openai";

const client = new OpenAI({ baseURL: "${BASE}/v1", apiKey: "${KEY}", timeout: 600_000 });

const stream = await client.chat.completions.create({
  model: "gemini-3.1-flash-image-landscape",
  messages: [{ role: "user", content: "A red apple on a wooden table, studio lighting" }],
  stream: true,
});

let content = "";
for await (const chunk of stream) {
  const delta = chunk.choices[0]?.delta ?? {};
  // Progress updates arrive as reasoning_content; the final result as content.
  if (delta.reasoning_content) process.stdout.write(delta.reasoning_content);
  if (delta.content) content += delta.content;
}

const match = content.match(/!\\[.*?\\]\\((.*?)\\)/);
console.log("\\nImage URL:", match ? match[1] : content);`,
    };

    const snippets = {
        imgCode: `# Text to image
curl -X POST "${BASE}/v1/chat/completions" \\
  -H "Authorization: Bearer ${KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gemini-3.1-flash-image-landscape",
    "messages": [{ "role": "user", "content": "A cute cat playing in a garden" }],
    "stream": true
  }'

# Image to image (up to 5 reference images)
curl -X POST "${BASE}/v1/chat/completions" \\
  -H "Authorization: Bearer ${KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gemini-3.1-flash-image-landscape",
    "messages": [{
      "role": "user",
      "content": [
        { "type": "text", "text": "Turn this into a watercolor painting" },
        { "type": "image_url", "image_url": { "url": "data:image/jpeg;base64,<base64>" } }
      ]
    }],
    "stream": true
  }'

# Alias + generationConfig: the server resolves the concrete model id
curl -X POST "${BASE}/v1beta/models/gemini-3.1-flash-image:generateContent" \\
  -H "x-goog-api-key: ${KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "contents": [{ "role": "user", "parts": [{ "text": "A red apple on a wooden table" }] }],
    "generationConfig": {
      "responseModalities": ["IMAGE"],
      "imageConfig": { "aspectRatio": "1:1", "imageSize": "2k" }
    }
  }'`,
        vidCode: `# Text to video (t2v)
curl -X POST "${BASE}/v1/chat/completions" \\
  -H "Authorization: Bearer ${KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "veo-3.1-fast-8s-landscape",
    "messages": [{ "role": "user", "content": "A kitten chasing butterflies on a grassy field" }],
    "stream": true
  }'

# First and last frame to video (i2v, 1-2 images)
curl -X POST "${BASE}/v1/chat/completions" \\
  -H "Authorization: Bearer ${KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "veo-3.1-fast-i2v-6s-landscape",
    "messages": [{
      "role": "user",
      "content": [
        { "type": "text", "text": "Transition from the first image to the second" },
        { "type": "image_url", "image_url": { "url": "data:image/jpeg;base64,<first_frame>" } },
        { "type": "image_url", "image_url": { "url": "data:image/jpeg;base64,<last_frame>" } }
      ]
    }],
    "stream": true
  }'

# Multi-reference video (r2v, 1-3 images)
curl -X POST "${BASE}/v1/chat/completions" \\
  -H "Authorization: Bearer ${KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "veo-3.1-fast-r2v-8s-landscape",
    "messages": [{
      "role": "user",
      "content": [
        { "type": "text", "text": "Keep these characters, slow forward camera move" },
        { "type": "image_url", "image_url": { "url": "data:image/jpeg;base64,<ref_1>" } },
        { "type": "image_url", "image_url": { "url": "data:image/jpeg;base64,<ref_2>" } }
      ]
    }],
    "stream": true
  }'`,
        streamCode: `data: {"choices":[{"delta":{"reasoning_content":"Selecting account..."}}]}

data: {"choices":[{"delta":{"reasoning_content":"Submitting generation request..."}}]}

data: {"choices":[{"index":0,"delta":{"content":"![Generated Image](${BASE}/tmp/abc.png)"},"finish_reason":"stop"}]}

data: [DONE]`,
        jsonCode: `{
  "id": "chatcmpl-1730000000",
  "object": "chat.completion",
  "created": 1730000000,
  "model": "flow2api",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "![Generated Image](${BASE}/tmp/abc.png)"
      },
      "finish_reason": "stop"
    }
  ]
}`,
    };

    function renderQuickstart(language) {
        $('qsCode').textContent = quickstart[language];
        document.querySelectorAll('.qs-tab').forEach(tab => {
            const active = tab.dataset.lang === language;
            tab.classList.toggle('border-primary', active);
            tab.classList.toggle('border-transparent', !active);
            tab.classList.toggle('text-muted-foreground', !active);
        });
    }

    window.copyCode = async elementId => {
        const text = $(elementId).textContent;
        try {
            await navigator.clipboard.writeText(text);
        } catch (_) {
            const area = document.createElement('textarea');
            area.value = text;
            document.body.appendChild(area);
            area.select();
            document.execCommand('copy');
            area.remove();
        }
    };

    I18n.ready.then(() => {
        Object.entries(snippets).forEach(([id, text]) => { $(id).textContent = text; });
        document.querySelectorAll('.qs-tab').forEach(tab => {
            tab.onclick = () => renderQuickstart(tab.dataset.lang);
        });
        renderQuickstart('curl');
    });
})();
