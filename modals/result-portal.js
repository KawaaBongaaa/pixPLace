/**
 * 🎨 Result Portal — manages the generation-result-modal.html iframe
 * Communicates with the iframe via postMessage.
 */

import './generation-result-modal.js';

let _iframe = null;
let _ready = false;
let _pendingItem = null;

function _getOrCreateIframe() {
    if (_iframe) return _iframe;

    _iframe = document.createElement('iframe');
    _iframe.id = 'resultModalFrame';
    _iframe.src = './modals/generation-result-modal.html';
    _iframe.setAttribute('allow', 'clipboard-write');
    Object.assign(_iframe.style, {
        position: 'fixed',
        inset: '0',
        width: '100%',
        height: '100%',
        border: 'none',
        background: 'transparent',
        zIndex: '10001',
        display: 'none',
        pointerEvents: 'none'
    });

    document.body.appendChild(_iframe);

    window.addEventListener('message', _handleFrameMessage);
    return _iframe;
}

function _handleFrameMessage(e) {
    if (!e.data || typeof e.data !== 'object') return;
    const { type } = e.data;

    switch (type) {
        case 'result-modal-ready':
            _ready = true;
            if (_pendingItem) {
                _showInFrame(_pendingItem);
                _pendingItem = null;
            }
            break;

        case 'close':
            _hideFrame();
            break;

        case 'use-image':
            _hideFrame();
            if (typeof window.useImageForGeneration === 'function')
                window.useImageForGeneration(e.data.imageUrl, e.data.itemId);
            break;

        case 'reuse-prompt':
            _hideFrame();
            if (typeof window.reusePrompt === 'function')
                window.reusePrompt(e.data.prompt, e.data.mode);
            break;

        case 'reuse-prompt-and-image':
            _hideFrame();
            if (typeof window.reusePromptAndImage === 'function')
                window.reusePromptAndImage(e.data.prompt, e.data.mode, e.data.imageUrl, e.data.itemId);
            break;

        case 'toast':
            if (window.showToast) window.showToast(e.data.type || 'info', e.data.msg || '');
            break;
    }
}

function _showInFrame(item) {
    const frame = _getOrCreateIframe();
    frame.style.display = 'block';
    frame.style.pointerEvents = 'auto';
    // Sync dark mode
    const dark = document.documentElement.classList.contains('dark');
    frame.contentWindow?.postMessage({ type: 'theme', dark }, '*');
    frame.contentWindow?.postMessage({ type: 'show-result', item }, '*');
}

function _hideFrame() {
    if (!_iframe) return;
    _iframe.style.pointerEvents = 'none';
    // wait for iframe close animation then hide
    setTimeout(() => {
        if (_iframe) _iframe.style.display = 'none';
    }, 350);
}

// ── Public API ──────────────────────────────────────────────────────────────

export function showResultModal(item) {
    const frame = _getOrCreateIframe();

    if (!_ready) {
        _pendingItem = item;
        return;
    }

    if (frame.style.display === 'none') {
        frame.style.display = 'block';
        frame.style.pointerEvents = 'auto';
    }
    _showInFrame(item);
}

export function closeResultModal() {
    if (_iframe?.contentWindow) {
        _iframe.contentWindow.postMessage({ type: 'close-result' }, '*');
    }
    _hideFrame();
}

// Install as global functions (called by app_modern.js / user-account.js)
window.showGenerationResultModal  = showResultModal;
window.closeGenerationResultModal = closeResultModal;

// Drain any items queued by the inline stub in index.html before this module loaded
if (Array.isArray(window._grmQueue) && window._grmQueue.length > 0) {
    const q = window._grmQueue.splice(0);
    // Show only the last queued item (most recent click)
    showResultModal(q[q.length - 1]);
}
window._grmQueue = null; // disable the stub queue

// Pre-warm the iframe so it's ready by the time user clicks a history card
export function prewarmResultModal() {
    _getOrCreateIframe();
}

console.log('✅ Result Portal loaded');
