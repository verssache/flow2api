/* English-only UI helper for the Flow2API console. */
(() => {
    'use strict';

    document.documentElement.lang = 'en';

    function interpolate(message, params = {}) {
        return String(message ?? '').replace(/\{(\w+)\}/g, (match, key) =>
            Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : match);
    }

    function t(source, params = {}) {
        return interpolate(source, params);
    }

    function resolveElement(element) {
        return typeof element === 'string' ? document.getElementById(element) : element;
    }

    function setText(element, source, params = {}) {
        const target = resolveElement(element);
        if (!target) return;
        target.dataset.i18n = source;
        target.textContent = t(source, params);
    }

    function setRawText(element, value) {
        const target = resolveElement(element);
        if (!target) return value;
        delete target.dataset.i18n;
        target.textContent = value;
        return value;
    }

    function setMessage(element, message) {
        const target = resolveElement(element);
        if (!target) return message;
        delete target.dataset.i18n;
        target.textContent = String(message ?? '');
        return message;
    }

    const attributes = ['placeholder', 'title', 'aria-label'];

    function apply(root = document) {
        const elements = [];
        if (root.nodeType === Node.ELEMENT_NODE && root.matches('[data-i18n]')) elements.push(root);
        if (root.querySelectorAll) elements.push(...root.querySelectorAll('[data-i18n]'));
        for (const element of elements) {
            const text = t(element.dataset.i18n);
            if (element.textContent !== text) element.textContent = text;
        }
        if (!root.querySelectorAll) return;
        for (const attribute of attributes) {
            for (const element of root.querySelectorAll(`[data-i18n-${attribute}]`)) {
                const source = element.getAttribute(`data-i18n-${attribute}`);
                element.setAttribute(attribute, t(source));
            }
        }
    }

    const domReady = new Promise(resolve => {
        if (document.readyState !== 'loading') resolve();
        else document.addEventListener('DOMContentLoaded', resolve, { once: true });
    });

    const ready = domReady.then(() => apply());

    window.I18n = {
        t, setText, setRawText, setMessage, apply, ready,
        escapeHtml: value => String(value ?? '').replace(/[&<>"']/g, character => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
        }[character])),
        get locale() { return 'en'; },
        headers: () => ({ 'Accept-Language': 'en' }),
    };
})();
