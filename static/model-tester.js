/* Model Tester tab for the Flow2API admin console. */
(() => {
    'use strict';

    const STATE = { selectedModel: null, modelConfig: null, images: [], generating: false, booted: false, models: {} };
    const $ = id => document.getElementById(id);
    const esc = value => I18n.escapeHtml(value);

    // Normalize legacy underscore ids so both catalog styles classify identically.
    const normalizeModelId = modelId => String(modelId).toLowerCase().replace(/_/g, '-');

    // Model family classification, shared by the sidebar, the tags, and the image upload.
    function classifyModel(modelId) {
        const norm = normalizeModelId(modelId);
        if (norm.includes('image')) return 'image';
        if (norm.includes('4k') || norm.includes('1080p')) return 'upsample';
        if (norm.includes('i2v') || norm.includes('interpolation')) return 'i2v';
        if (norm.includes('r2v')) return 'r2v';
        if (norm.includes('omni') || norm.includes('abra')) return 'omni';
        if (norm.includes('extend')) return 'extend';
        return 't2v';
    }

    const MODEL_CATEGORIES = {
        'Gemini 3.1 Flash Images': m => normalizeModelId(m).startsWith('gemini-3.1-flash-image'),
        'Nano Banana 2 Lite Images': m => normalizeModelId(m).startsWith('gemini-3.1-flash-lite-image'),
        'Gemini 3.0 Pro Images': m => normalizeModelId(m).startsWith('gemini-3.0-pro-image'),
        'Veo 3.1 Text-to-Video (T2V)': m => classifyModel(m) === 't2v',
        'Veo 3.1 Image-to-Video (I2V)': m => classifyModel(m) === 'i2v',
        'Veo 3.1 Multi-reference video (R2V)': m => classifyModel(m) === 'r2v',
        'Omni 1.1 Flash Videos': m => classifyModel(m) === 'omni',
        'Video extension (Extend)': m => classifyModel(m) === 'extend',
        'Video upscale (Upsample)': m => classifyModel(m) === 'upsample',
    };

    const FALLBACK_MODELS = {
        'gemini-3.1-flash-image': 'Image generation (alias) - aspects: landscape, portrait, square, four-three, three-four; sizes: 2k, 4k',
        'gemini-3.1-flash-lite-image': 'Nano Banana 2 Lite - aspects: landscape, portrait, square, four-three, three-four; sizes: 2k, 4k',
        'gemini-3.0-pro-image': 'Image generation (alias) - aspects: landscape, portrait, square, four-three, three-four; sizes: 2k, 4k',
        'veo_3_1_t2v_fast': 'Video generation (alias) - supports landscape/portrait via generationConfig',
        'veo_3_1_t2v_fast_4s': 'Video generation (alias) - 4s, supports landscape/portrait via generationConfig',
        'veo_3_1_t2v_fast_landscape_4s': 'Video generation - fast 4s landscape',
        'veo_3_1_t2v_fast_6s': 'Video generation (alias) - 6s, supports landscape/portrait via generationConfig',
        'veo_3_1_t2v_fast_landscape_6s': 'Video generation - fast 6s landscape',
        'veo_3_1_t2v_fast_8s': 'Video generation (alias) - 8s, supports landscape/portrait via generationConfig',
        'veo_3_1_t2v_fast_landscape_8s': 'Video generation - fast 8s landscape',
        'veo_3_1_t2v_fast_ultra': 'Video generation (alias) - supports landscape/portrait via generationConfig',
        'veo_3_1_t2v_fast_ultra_relaxed': 'Video generation (alias) - supports landscape/portrait via generationConfig',
        'veo_3_1_t2v': 'Video generation (alias) - supports landscape/portrait via generationConfig',
        'veo_3_1_t2v_4s': 'Video generation (alias) - 4s, supports landscape/portrait via generationConfig',
        'veo_3_1_t2v_landscape_4s': 'Video generation - quality 4s landscape',
        'veo_3_1_t2v_6s': 'Video generation (alias) - 6s, supports landscape/portrait via generationConfig',
        'veo_3_1_t2v_landscape_6s': 'Video generation - quality 6s landscape',
        'veo_3_1_t2v_8s': 'Video generation (alias) - 8s, supports landscape/portrait via generationConfig',
        'veo_3_1_t2v_landscape_8s': 'Video generation - quality 8s landscape',
        'veo_3_1_t2v_4k': 'Video upsample alias - generate then upscale to 4K',
        'veo_3_1_t2v_landscape_4k': 'Video upsample alias - generate landscape then upscale to 4K',
        'veo_3_1_t2v_1080p': 'Video upsample alias - generate then upscale to 1080P',
        'veo_3_1_t2v_landscape_1080p': 'Video upsample alias - generate landscape then upscale to 1080P',
        'veo_3_1_t2v_4s_4k': 'Video upsample alias - generate 4s then upscale to 4K',
        'veo_3_1_t2v_landscape_4s_4k': 'Video upsample alias - generate 4s landscape then upscale to 4K',
        'veo_3_1_t2v_4s_1080p': 'Video upsample alias - generate 4s then upscale to 1080P',
        'veo_3_1_t2v_landscape_4s_1080p': 'Video upsample alias - generate 4s landscape then upscale to 1080P',
        'veo_3_1_t2v_6s_4k': 'Video upsample alias - generate 6s then upscale to 4K',
        'veo_3_1_t2v_landscape_6s_4k': 'Video upsample alias - generate 6s landscape then upscale to 4K',
        'veo_3_1_t2v_6s_1080p': 'Video upsample alias - generate 6s then upscale to 1080P',
        'veo_3_1_t2v_landscape_6s_1080p': 'Video upsample alias - generate 6s landscape then upscale to 1080P',
        'veo_3_1_t2v_8s_4k': 'Video upsample alias - generate 8s then upscale to 4K',
        'veo_3_1_t2v_landscape_8s_4k': 'Video upsample alias - generate 8s landscape then upscale to 4K',
        'veo_3_1_t2v_8s_1080p': 'Video upsample alias - generate 8s then upscale to 1080P',
        'veo_3_1_t2v_landscape_8s_1080p': 'Video upsample alias - generate 8s landscape then upscale to 1080P',
        'veo_3_1_t2v_lite_8s': 'Video generation (alias) - lite 8s, supports landscape/portrait via generationConfig',
        'veo_3_1_i2v_s_fast_fl': 'Video generation (alias) - supports landscape/portrait via generationConfig',
        'veo_3_1_i2v_s_fast_4s_fl': 'Video generation (alias) - 4s, supports landscape/portrait via generationConfig',
        'veo_3_1_i2v_s_fast_landscape_4s_fl': 'Video generation - fast 4s landscape',
        'veo_3_1_i2v_s_fast_6s_fl': 'Video generation (alias) - 6s, supports landscape/portrait via generationConfig',
        'veo_3_1_i2v_s_fast_landscape_6s_fl': 'Video generation - fast 6s landscape',
        'veo_3_1_i2v_s_fast_8s_fl': 'Video generation (alias) - 8s, supports landscape/portrait via generationConfig',
        'veo_3_1_i2v_s_fast_landscape_8s_fl': 'Video generation - fast 8s landscape',
        'veo_3_1_i2v_s_fast_ultra_fl': 'Video generation (alias) - supports landscape/portrait via generationConfig',
        'veo_3_1_i2v_s_fast_ultra_relaxed': 'Video generation (alias) - supports landscape/portrait via generationConfig',
        'veo_3_1_i2v_s': 'Video generation (alias) - supports landscape/portrait via generationConfig',
        'veo_3_1_i2v_s_4s': 'Video generation (alias) - 4s, supports landscape/portrait via generationConfig',
        'veo_3_1_i2v_s_landscape_4s': 'Video generation - quality 4s landscape',
        'veo_3_1_i2v_s_6s': 'Video generation (alias) - 6s, supports landscape/portrait via generationConfig',
        'veo_3_1_i2v_s_landscape_6s': 'Video generation - quality 6s landscape',
        'veo_3_1_i2v_s_8s': 'Video generation (alias) - 8s, supports landscape/portrait via generationConfig',
        'veo_3_1_i2v_s_landscape_8s': 'Video generation - quality 8s landscape',
        'veo_3_1_i2v_s_4k': 'Video upsample alias - generate then upscale to 4K',
        'veo_3_1_i2v_s_landscape_4k': 'Video upsample alias - generate landscape then upscale to 4K',
        'veo_3_1_i2v_s_1080p': 'Video upsample alias - generate then upscale to 1080P',
        'veo_3_1_i2v_s_landscape_1080p': 'Video upsample alias - generate landscape then upscale to 1080P',
        'veo_3_1_i2v_s_4s_4k': 'Video upsample alias - generate 4s then upscale to 4K',
        'veo_3_1_i2v_s_landscape_4s_4k': 'Video upsample alias - generate 4s landscape then upscale to 4K',
        'veo_3_1_i2v_s_4s_1080p': 'Video upsample alias - generate 4s then upscale to 1080P',
        'veo_3_1_i2v_s_landscape_4s_1080p': 'Video upsample alias - generate 4s landscape then upscale to 1080P',
        'veo_3_1_i2v_s_6s_4k': 'Video upsample alias - generate 6s then upscale to 4K',
        'veo_3_1_i2v_s_landscape_6s_4k': 'Video upsample alias - generate 6s landscape then upscale to 4K',
        'veo_3_1_i2v_s_6s_1080p': 'Video upsample alias - generate 6s then upscale to 1080P',
        'veo_3_1_i2v_s_landscape_6s_1080p': 'Video upsample alias - generate 6s landscape then upscale to 1080P',
        'veo_3_1_i2v_s_8s_4k': 'Video upsample alias - generate 8s then upscale to 4K',
        'veo_3_1_i2v_s_landscape_8s_4k': 'Video upsample alias - generate 8s landscape then upscale to 4K',
        'veo_3_1_i2v_s_8s_1080p': 'Video upsample alias - generate 8s then upscale to 1080P',
        'veo_3_1_i2v_s_landscape_8s_1080p': 'Video upsample alias - generate 8s landscape then upscale to 1080P',
        'veo_3_1_i2v_lite_8s': 'Video generation (alias) - lite 8s, supports landscape/portrait via generationConfig',
        'veo_3_1_interpolation_lite_8s': 'Video generation (alias) - interpolation lite 8s, supports landscape/portrait via generationConfig',
        'veo_3_1_r2v_fast': 'Video generation (alias) - supports landscape/portrait via generationConfig',
        'veo_3_1_r2v_fast_landscape': 'Video generation - R2V fast landscape',
        'veo_3_1_r2v_fast_8s': 'Video generation (alias) - R2V fast 8s, supports landscape/portrait via generationConfig',
        'veo_3_1_r2v_fast_landscape_8s': 'Video generation - R2V fast 8s landscape',
        'veo_3_1_r2v_fast_ultra': 'Video generation (alias) - supports landscape/portrait via generationConfig',
        'veo_3_1_r2v_fast_landscape_ultra': 'Video generation - R2V fast ultra landscape',
        'veo_3_1_r2v_fast_ultra_8s': 'Video generation (alias) - R2V fast ultra 8s, supports landscape/portrait via generationConfig',
        'veo_3_1_r2v_fast_landscape_ultra_8s': 'Video generation - R2V fast ultra 8s landscape',
        'veo_3_1_r2v_fast_ultra_relaxed': 'Video generation (alias) - supports landscape/portrait via generationConfig',
        'veo_3_1_r2v_fast_landscape_ultra_relaxed': 'Video generation - R2V fast ultra relaxed landscape',
        'veo_3_1_r2v_fast_ultra_relaxed_8s': 'Video generation (alias) - R2V fast ultra relaxed 8s, supports landscape/portrait via generationConfig',
        'veo_3_1_r2v_fast_landscape_ultra_relaxed_8s': 'Video generation - R2V fast ultra relaxed 8s landscape',
        'veo_3_1_r2v_fast_landscape_ultra_4k': 'Video upsample alias - generate R2V landscape then upscale to 4K',
        'omni-1.1-flash': 'Video generation - Omni 1.1 Flash 8s landscape, optional reference images',
        'omni-1.1-flash-4s-landscape': 'Video generation - Omni 1.1 Flash 4s landscape',
        'omni-1.1-flash-4s-portrait': 'Video generation - Omni 1.1 Flash 4s portrait',
        'omni-1.1-flash-8s-landscape': 'Video generation - Omni 1.1 Flash 8s landscape',
        'omni-1.1-flash-8s-portrait': 'Video generation - Omni 1.1 Flash 8s portrait',
    };

    function getModelMeta(modelId) {
        const family = classifyModel(modelId);
        if (family === 'image') return { type: 'image', supportsImages: true, minImages: 0, maxImages: 5 };
        if (family === 'i2v') return { type: 'video', supportsImages: true, minImages: 1, maxImages: 2 };
        if (family === 'r2v' || family === 'omni') return { type: 'video', supportsImages: true, minImages: 0, maxImages: 3 };
        return { type: 'video', supportsImages: false, minImages: 0, maxImages: 0 };
    }

    const getModelType = modelId => (classifyModel(modelId) === 'image' ? 'image' : 'video');

    function applyFallbackModels(reason) {
        console.warn('[ModelTester] Using built-in model suggestions:', reason);
        STATE.models = { ...FALLBACK_MODELS };
        renderSidebar();
    }

    async function loadModels() {
        const baseUrl = ($('mtBaseUrl').value || '').trim();
        const apiKey = ($('mtApiKey').value || '').trim();
        if (!baseUrl || !apiKey) {
            applyFallbackModels('missing_base_url_or_api_key');
            return;
        }
        try {
            const response = await fetch(`${baseUrl}/v1/models`, {
                headers: { ...I18n.headers(), Authorization: `Bearer ${apiKey}` },
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            const items = Array.isArray(data.data) ? data.data : [];
            if (!items.length) {
                applyFallbackModels('empty_model_catalog');
                return;
            }
            STATE.models = {};
            items.forEach(item => { STATE.models[item.id] = item.description; });
            renderSidebar();
        } catch (error) {
            console.error('[ModelTester] Failed to load models:', error);
            applyFallbackModels(error.message || 'load_failed');
        }
    }

    function renderSidebar() {
        const sidebar = $('mtSidebar');
        sidebar.innerHTML = '';
        const modelIds = Object.keys(STATE.models).sort();
        if (!modelIds.length) {
            sidebar.innerHTML = '<div class="rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground"><span data-i18n="No available models were returned. Check the API key or try again later.">No available models were returned. Check the API key or try again later.</span></div>';
            I18n.apply(sidebar);
            return;
        }

        for (const [category, filter] of Object.entries(MODEL_CATEGORIES)) {
            const models = modelIds.filter(filter);
            if (!models.length) continue;

            const section = document.createElement('div');
            section.className = 'rounded-lg border border-border bg-background overflow-hidden';

            const title = document.createElement('button');
            title.type = 'button';
            title.className = 'flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-semibold transition-colors hover:bg-muted';
            title.innerHTML = `<span>${esc(category)} (${models.length})</span><span class="text-muted-foreground transition-transform">▼</span>`;

            const list = document.createElement('div');
            list.className = 'max-h-72 overflow-y-auto border-t border-border divide-y divide-border';

            models.forEach(modelId => {
                const type = getModelType(modelId);
                const shortName = modelId
                    .replace('gemini-3.1-flash-image-', '')
                    .replace('gemini-3.1-flash-lite-image-', '')
                    .replace('gemini-3.0-pro-image-', '');
                const item = document.createElement('button');
                item.type = 'button';
                item.dataset.model = modelId;
                item.className = 'mt-model-item flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-muted';
                item.innerHTML = `<span class="truncate">${esc(shortName)}</span><span class="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${type === 'image' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}">${type === 'image' ? 'Image' : 'Video'}</span>`;
                item.onclick = () => selectModel(modelId);
                list.appendChild(item);
            });

            title.onclick = () => {
                const collapsed = list.classList.toggle('hidden');
                title.lastElementChild.classList.toggle('-rotate-90', collapsed);
            };

            section.append(title, list);
            sidebar.appendChild(section);
        }
        markActiveModel();
    }

    function markActiveModel() {
        document.querySelectorAll('.mt-model-item').forEach(element => {
            const active = element.dataset.model === STATE.selectedModel;
            element.classList.toggle('bg-secondary', active);
            element.classList.toggle('font-medium', active);
        });
    }

    function selectModel(modelId) {
        STATE.selectedModel = modelId;
        STATE.modelConfig = getModelMeta(modelId);
        STATE.images = [];
        markActiveModel();

        I18n.setRawText($('mtSelectedName'), modelId);
        I18n.setMessage($('mtSelectedInfo'), STATE.models[modelId] || '');

        const meta = STATE.modelConfig;
        const uploadGroup = $('mtUploadGroup');
        uploadGroup.classList.toggle('hidden', !meta.supportsImages);
        if (meta.supportsImages) {
            const limitText = meta.type === 'image'
                ? I18n.t('Optional, for image-to-image')
                : I18n.t('{min}-{max} images', { min: meta.minImages, max: meta.maxImages });
            I18n.setRawText($('mtImageLimit'), `(${limitText})`);
        }

        $('mtPreviewList').innerHTML = '';
        $('mtHint').classList.remove('hidden');

        const button = $('mtBtnGenerate');
        button.disabled = false;
        I18n.setMessage(button, meta.type === 'image' ? I18n.t('Generate image') : I18n.t('Generate video'));
    }

    function handleFiles(files) {
        const maxImages = STATE.modelConfig ? STATE.modelConfig.maxImages : 5;
        for (const file of files) {
            if (STATE.images.length >= maxImages) break;
            if (!file.type.startsWith('image/')) continue;
            const reader = new FileReader();
            reader.onload = event => {
                STATE.images.push(event.target.result);
                renderImagePreviews();
            };
            reader.readAsDataURL(file);
        }
    }

    function renderImagePreviews() {
        const list = $('mtPreviewList');
        list.innerHTML = '';
        $('mtHint').classList.toggle('hidden', STATE.images.length > 0);
        STATE.images.forEach((dataUrl, index) => {
            const item = document.createElement('div');
            item.className = 'relative h-20 w-20 overflow-hidden rounded-md border border-border';
            item.innerHTML = `<img src="${esc(dataUrl)}" alt="preview" class="h-full w-full object-cover"><button type="button" class="mt-remove-image absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs text-white">×</button>`;
            item.querySelector('.mt-remove-image').onclick = event => {
                event.stopPropagation();
                STATE.images.splice(index, 1);
                renderImagePreviews();
            };
            list.appendChild(item);
        });
    }

    function setStatus(variant, text) {
        const dot = $('mtStatusDot');
        dot.className = `inline-block h-2 w-2 rounded-full ${{
            idle: 'bg-muted-foreground',
            running: 'bg-amber-500 animate-pulse',
            done: 'bg-green-600',
            error: 'bg-destructive',
        }[variant]}`;
        I18n.setMessage($('mtStatusText'), text);
    }

    async function generate() {
        if (!STATE.selectedModel || STATE.generating) return;

        const baseUrl = ($('mtBaseUrl').value || '').trim();
        const apiKey = ($('mtApiKey').value || '').trim();
        const prompt = $('mtPrompt').value.trim();
        const toast = window.showToast || ((message, type) => console.log(type, message));
        if (!prompt) return toast(I18n.t('Please enter a prompt'), 'error');
        if (!apiKey) return toast(I18n.t('Please enter an API key'), 'error');
        if (!baseUrl) return toast(I18n.t('Please enter the server URL'), 'error');

        STATE.generating = true;
        const button = $('mtBtnGenerate');
        button.disabled = true;
        I18n.setMessage(button, I18n.t('Generating...'));
        setStatus('running', I18n.t('Generating...'));

        const log = $('mtLog');
        I18n.setRawText(log, '');
        $('mtResult').innerHTML = '';
        const appendLog = text => { log.textContent += text; log.scrollTop = log.scrollHeight; };
        const now = () => new Date().toLocaleTimeString(I18n.locale);

        const content = [{ type: 'text', text: prompt }];
        STATE.images.forEach(dataUrl => content.push({ type: 'image_url', image_url: { url: dataUrl } }));
        const body = {
            model: STATE.selectedModel,
            messages: [{ role: 'user', content: content.length === 1 ? prompt : content }],
            stream: true,
        };

        const startTime = Date.now();
        appendLog(`[${now()}] Model: ${STATE.selectedModel}\n`);
        appendLog(`[${now()}] Prompt: ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}\n`);
        appendLog(`[${now()}] Sending request...\n`);

        try {
            const response = await fetch(`${baseUrl}/v1/chat/completions`, {
                method: 'POST',
                headers: { ...I18n.headers(), Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';
            let buffer = '';

            for (;;) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    const data = line.slice(6).trim();
                    if (data === '[DONE]') continue;
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.error) {
                            appendLog(`\n❌ Error: ${JSON.stringify(parsed.error)}\n`);
                            continue;
                        }
                        const delta = (parsed.choices || [])[0]?.delta || {};
                        if (delta.reasoning_content) appendLog(delta.reasoning_content);
                        if (delta.content) {
                            fullContent += delta.content;
                            appendLog(delta.content);
                        }
                    } catch (_) {
                        // skip unparseable chunks
                    }
                }
            }

            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            appendLog(`\n\n[${now()}] Completed in ${elapsed}s\n`);
            renderResult(fullContent);
            setStatus('done', I18n.t('Completed ({seconds}s)', { seconds: elapsed }));
        } catch (error) {
            appendLog(`\n❌ Request failed: ${error.message}\n`);
            setStatus('error', I18n.t('Failed'));
        } finally {
            STATE.generating = false;
            button.disabled = false;
            const meta = STATE.modelConfig;
            I18n.setMessage(button, meta && meta.type === 'image' ? I18n.t('Generate image') : I18n.t('Generate video'));
        }
    }

    function renderResult(content) {
        const result = $('mtResult');
        result.innerHTML = '';

        const imageRegex = /!\[.*?\]\((.*?)\)/g;
        let match;
        while ((match = imageRegex.exec(content)) !== null) {
            const image = document.createElement('img');
            image.src = match[1];
            image.alt = I18n.t('Generation results');
            image.loading = 'lazy';
            image.className = 'mt-2 max-w-full rounded-md border border-border';
            result.appendChild(image);
        }

        const videoRegex = /<video[^>]+src=['"]([^'"]+)['"]/gi;
        while ((match = videoRegex.exec(content)) !== null) {
            const video = document.createElement('video');
            video.src = match[1];
            video.controls = true;
            video.autoplay = true;
            video.loop = true;
            video.className = 'mt-2 max-w-full rounded-md border border-border';
            result.appendChild(video);
        }

        if (!result.children.length && content.trim()) {
            const pre = document.createElement('pre');
            pre.className = 'mt-2 whitespace-pre-wrap break-words text-xs text-muted-foreground';
            I18n.setRawText(pre, content);
            result.appendChild(pre);
        }
    }

    async function prefillApiKey() {
        const input = $('mtApiKey');
        if (input.value.trim() || !window.apiRequest) return;
        try {
            const response = await window.apiRequest('/api/admin/config');
            if (!response) return;
            const data = await response.json();
            if (data.api_key) input.value = data.api_key;
        } catch (error) {
            console.error('[ModelTester] Failed to prefill the API key:', error);
        }
    }

    async function initModelTester() {
        if (STATE.booted) return;
        STATE.booted = true;

        $('mtBaseUrl').value = window.location.origin;
        $('mtBaseUrl').addEventListener('change', loadModels);
        $('mtApiKey').addEventListener('change', loadModels);
        $('mtBtnGenerate').onclick = generate;

        const uploadArea = $('mtUploadArea');
        const fileInput = $('mtFileInput');
        uploadArea.onclick = event => {
            if (event.target.closest('.mt-remove-image')) return;
            fileInput.click();
        };
        uploadArea.ondragover = event => { event.preventDefault(); uploadArea.classList.add('border-primary'); };
        uploadArea.ondragleave = () => uploadArea.classList.remove('border-primary');
        uploadArea.ondrop = event => {
            event.preventDefault();
            uploadArea.classList.remove('border-primary');
            handleFiles(event.dataTransfer.files);
        };
        fileInput.onchange = () => { handleFiles(fileInput.files); fileInput.value = ''; };

        setStatus('idle', I18n.t('Waiting'));
        await prefillApiKey();
        await loadModels();
    }

    window.initModelTester = initModelTester;
})();
