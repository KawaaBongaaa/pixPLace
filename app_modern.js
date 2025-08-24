// 🚀 Modern AI Image Generator WebApp (patched)
// Configuration
const CONFIG = {
    WEBHOOK_URL: 'https://hook.us2.make.com/x2hgl6ocask8hearbpwo3ch7pdwpdlrk', // ⚠️ ЗАМЕНИТЕ НА ВАШ WEBHOOK!
    TIMEOUT: 120000, // 120 секунд
    LANGUAGES: ['en', 'ru', 'es', 'fr', 'de', 'zh', 'pt-br', 'ar', 'hi', 'ja', 'it', 'ko', 'tr', 'pl'],
    DEFAULT_LANGUAGE: 'en',
    DEFAULT_THEME: 'dark', // 'light', 'dark', 'auto'
};
// Translations (kept as in your file)
const TRANSLATIONS = { /* ... (оставляем без изменений, как в вашем файле) ... */ };

// For brevity in this paste, we assume TRANSLATIONS content is unchanged
// If you paste this file, keep TRANSLATIONS content from your original file here.

class AppState {
    constructor() {
        this.tg = null;
        this.currentLanguage = CONFIG.DEFAULT_LANGUAGE;
        this.currentTheme = 'dark';
        this.selectedStyle = 'realistic';
        this.isGenerating = false;
        this.userId = null;
        this.userName = null;
        this.generationHistory = [];
        this.currentGeneration = null;
        this.startTime = null;
        this.timerInterval = null;
    }
    setLanguage(lang) {
        if (CONFIG.LANGUAGES.includes(lang)) {
            this.currentLanguage = lang;
            document.body.setAttribute('data-lang', lang);
            this.updateTranslations();
            this.saveSettings();
        }
    }
    toggleLanguage() {
        const currentIndex = CONFIG.LANGUAGES.indexOf(this.currentLanguage);
        const nextIndex = (currentIndex + 1) % CONFIG.LANGUAGES.length;
        this.setLanguage(CONFIG.LANGUAGES[nextIndex]);
    }
    translate(key) {
        return (TRANSLATIONS[this.currentLanguage] && TRANSLATIONS[this.currentLanguage][key]) ||
               (TRANSLATIONS[CONFIG.DEFAULT_LANGUAGE] && TRANSLATIONS[CONFIG.DEFAULT_LANGUAGE][key]) ||
               key;
    }
    updateTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.translate(key);
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.translate(key);
        });
    }
    setTheme(theme) {
        this.currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        this.saveSettings();
    }
    toggleTheme() {
        const themes = ['light', 'dark', 'auto'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.setTheme(themes[nextIndex]);
    }
    saveSettings() {
        try {
            localStorage.setItem('appSettings', JSON.stringify({
                language: this.currentLanguage,
                theme: this.currentTheme
            }));
        } catch (error) { console.error('Failed to save settings:', error); }
    }
    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
            if (settings.language) this.setLanguage(settings.language);
            if (settings.theme) this.setTheme(settings.theme);
        } catch (error) { console.error('Failed to load settings:', error); }
    }
    saveHistory() {
        try {
            localStorage.setItem('generationHistory', JSON.stringify(this.generationHistory));
        } catch (error) { console.error('Failed to save history:', error); }
    }
    loadHistory() {
        try {
            const history = localStorage.getItem('generationHistory');
            if (history) this.generationHistory = JSON.parse(history);
        } catch (error) {
            console.error('Failed to load history:', error);
            this.generationHistory = [];
        }
    }
}

const appState = new AppState();

// Utility functions
function showStatus(type, message) {
    const statusBar = document.getElementById('statusBar');
    const statusText = document.querySelector('.status-text');
    if (statusBar && statusText) {
        statusText.textContent = message;
        statusBar.className = `status-bar ${type} show`;
        setTimeout(() => statusBar.classList.remove('show'), 3000);
    }
}

function showToast(type, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => container.removeChild(toast), 300);
    }, 3000);
}

function triggerHaptic(type) {
    if (appState.tg?.HapticFeedback) {
        try {
            switch (type) {
                case 'light': appState.tg.HapticFeedback.impactOccurred('light'); break;
                case 'medium': appState.tg.HapticFeedback.impactOccurred('medium'); break;
                case 'heavy': appState.tg.HapticFeedback.impactOccurred('heavy'); break;
                case 'success': appState.tg.HapticFeedback.notificationOccurred('success'); break;
                case 'error': appState.tg.HapticFeedback.notificationOccurred('error'); break;
                default: break;
            }
        } catch (e) { /* ignore */ }
    } else if ('vibrate' in navigator) {
        if (type === 'light') navigator.vibrate(15);
        else if (type === 'medium') navigator.vibrate([30, 10, 30]);
        else if (type === 'heavy') navigator.vibrate(60);
    }
}

// Processing animation helpers
function updateProcessingSteps(activeStep) {
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index + 1 <= activeStep) step.classList.add('active'); else step.classList.remove('active');
    });
    const progressCircle = document.querySelector('.progress-circle');
    if (progressCircle) {
        const progress = (activeStep / 3) * 283;
        progressCircle.style.strokeDashoffset = 283 - progress;
    }
}
function updateProgressBar(elapsed) {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const maxTime = 60;
        const progress = Math.min((elapsed / maxTime) * 100, 100);
        progressFill.style.width = progress + '%';
    }
    const progressCircle = document.querySelector('.progress-circle');
    if (progressCircle) {
        const circumference = 283;
        const progress = Math.min((elapsed / 60) * 100, 100);
        const offset = circumference - (progress / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
    }
}
function startTimer() {
    const elapsedTimeElement = document.getElementById('elapsedTime');
    appState.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - appState.startTime) / 1000);
        if (elapsedTimeElement) elapsedTimeElement.textContent = elapsed + 's';
        updateProgressBar(elapsed);
    }, 1000);
}
function stopTimer() {
    if (appState.timerInterval) { clearInterval(appState.timerInterval); appState.timerInterval = null; }
}

// History UI
function showBackButton(show) {
    if (show) document.body.classList.add('show-back'); else document.body.classList.remove('show-back');
}
function getStatusText(status) {
    switch (status) {
        case 'processing': return '⏳';
        case 'success': return '✅';
        case 'error': return '❌';
        case 'limit': return '⚡';
        default: return status;
    }
}
function updateHistoryDisplay() {
    const historyContent = document.getElementById('historyContent');
    if (!historyContent) return;
    if (appState.generationHistory.length === 0) {
        historyContent.innerHTML = `
            <div class="empty-history">
                <div class="empty-icon">📋</div>
                <h3 data-i18n="empty_history_title">${appState.translate('empty_history_title')}</h3>
                <p data-i18n="empty_history_subtitle">${appState.translate('empty_history_subtitle')}</p>
            </div>`;
        return;
    }
    historyContent.innerHTML = appState.generationHistory.map(item => `
        <div class="history-item" onclick="viewHistoryItem('${item.id}')">
            <div class="history-header">
                <span class="history-date">${new Date(item.timestamp).toLocaleString()}</span>
                <span class="history-status ${item.status}">${getStatusText(item.status)}</span>
            </div>
            <div class="history-prompt">${item.prompt}</div>
            <div class="history-details">
                <span class="info-pair">${appState.translate('style_' + (item.style || 'realistic'))}</span>
                <span class="info-pair">${appState.translate('mode_' + (item.mode || 'fast_generation'))}</span>
                ${item.duration ? `<span> ⏱ ${Math.round(item.duration / 1000)}s</span>` : ''}
            </div>
            ${item.result ? `<img src="${item.result}" alt="Generated" class="history-image" loading="lazy" />` : ''}
            ${item.error ? `<p style="color: var(--error-500); font-size: 0.9rem; margin-top: .5rem;">❌ ${item.error}</p>` : ''}
        </div>
    `).join('');
    showBackButton(true);
}
function viewHistoryItem(id) {
    const item = appState.generationHistory.find(h => String(h.id) === String(id));
    if (item && item.result) {
        appState.currentGeneration = item;
        showResult({ image_url: item.result });
    }
}
function clearHistory() {
    if (confirm('Clear all generation history?')) {
        appState.generationHistory = [];
        appState.saveHistory();
        updateHistoryDisplay();
        triggerHaptic('medium');
    }
}
function showHistory() {
    showScreen('historyScreen');
    updateHistoryDisplay();
}

// Screen management
function showLoadingScreen() { document.getElementById('loadingScreen').classList.add('active'); }
function hideLoadingScreen() { document.getElementById('loadingScreen').classList.remove('active'); }
function showApp() { document.getElementById('app').classList.add('loaded'); }
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active'); else console.error('Screen not found:', screenId);
}
function showProcessing() {
    showScreen('processingScreen');
    updateProcessingSteps(1);
}
function showResult(result) {
    showScreen('resultScreen');
    const resultImage = document.getElementById('resultImage');
    const resultPrompt = document.getElementById('resultPrompt');
    const resultStyle = document.getElementById('resultStyle');
    const resultMode = document.getElementById('resultMode');
    const resultTime = document.getElementById('resultTime');
    const imgSrc = result?.image_url || appState.currentGeneration?.result || '';
    if (resultImage) resultImage.src = imgSrc;
    if (resultPrompt) resultPrompt.textContent = appState.currentGeneration?.prompt || '';
    if (resultStyle) resultStyle.textContent = appState.translate('style_' + (appState.currentGeneration?.style || 'realistic'));
    if (resultMode) resultMode.textContent = appState.translate('mode_' + (appState.currentGeneration?.mode || 'fast_generation'));
    if (resultTime) {
        const duration = Math.round((appState.currentGeneration?.duration || 0) / 1000);
        resultTime.textContent = duration + 's';
    }
}

function showSubscriptionNotice(result) {
    console.log('🔗 Full result object:', result);
    const paymentUrl = result?.payment_url || 'https://t.me/tribute/app?startapp=syDv';
    const modal = document.getElementById('limitModal');
    if (!modal) { console.error('Modal not found'); return; }
    modal.classList.add('show');
    const upgradeBtn = document.getElementById('upgradeBtn');
    if (upgradeBtn) {
        upgradeBtn.onclick = () => {
            modal.classList.remove('show');
            showGeneration();
            setTimeout(() => {
                try { window.location.href = paymentUrl; } catch (e) { alert('Error opening payment link.'); }
            }, 100);
        };
    }
    const closeBtn = document.getElementById('closeLimitModal');
    if (closeBtn) closeBtn.onclick = () => { modal.classList.remove('show'); showGeneration(); };
}

function showGeneration() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const gen = document.getElementById('generationScreen');
    if (gen) gen.classList.add('active');
    showBackButton(false);
}

// UI init
function initializeUI() {
    const promptInput = document.getElementById('promptInput');
    const charCounter = document.getElementById('charCounter');
    if (promptInput && charCounter) {
        promptInput.addEventListener('input', function () {
            charCounter.textContent = this.value.length;
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
    const form = document.querySelector('.generation-form');
    if (form) form.addEventListener('submit', generateImage);
    appState.updateTranslations();
    console.log('✅ UI initialized');
}

// Telegram init (robust)
async function initTelegramApp() {
    console.log('🔍 Initializing Telegram WebApp...');
    let attempts = 0;
    while (typeof window.Telegram === 'undefined' && attempts < 100) {
        await new Promise(r => setTimeout(r, 50)); attempts++;
    }
    if (typeof window.Telegram === 'undefined' || !window.Telegram.WebApp) {
        appState.userId = 'fallback_' + Date.now();
        appState.userName = 'Fallback User';
        showStatus('info', 'Running in fallback mode');
        return;
    }
    try {
        appState.tg = window.Telegram.WebApp;
        appState.tg.ready();
        appState.tg.expand();
        if (appState.tg.initDataUnsafe?.user) {
            const user = appState.tg.initDataUnsafe.user;
            appState.userId = String(user.id);
            appState.userName = user.first_name + (user.last_name ? ' ' + user.last_name : '');
            appState.userUsername = user.username || null;
            appState.userLanguage = user.language_code || 'en';
            appState.userIsPremium = user.is_premium || false;
            appState.userPhotoUrl = user.photo_url || null;
            appState.chatInstance = appState.tg.initDataUnsafe.chat_instance || null;
            appState.chatType = appState.tg.initDataUnsafe.chat_type || null;
            appState.authDate = appState.tg.initDataUnsafe.auth_date || null;
            appState.telegramPlatform = appState.tg.platform || 'unknown';
            appState.telegramVersion = appState.tg.version || 'unknown';
            if (appState.userLanguage && CONFIG.LANGUAGES.includes(appState.userLanguage)) {
                appState.setLanguage(appState.userLanguage);
            }
            showStatus('success', appState.translate('connected'));
        } else {
            // fallback when no user
            appState.userId = 'fallback_no_user_' + Date.now();
            appState.userName = 'No User Data';
            showStatus('warning', 'No user data in initDataUnsafe');
        }
    } catch (error) {
        console.error('Telegram initialization error:', error);
        showStatus('error', 'Telegram connection error');
    }
}

// App boot
document.addEventListener('DOMContentLoaded', async function () {
    console.log('🚀 pixPLace Creator starting...');
    showLoadingScreen();
    appState.loadSettings();
    appState.loadHistory();
    try {
        // try to load Telegram SDK (index.html already attempts to load)
        await initTelegramApp();
    } catch (e) {
        console.error('SDK load error:', e);
        showStatus('error', 'Telegram SDK load failed');
    }
    initializeUI();
    // initialize carousel selection after DOM is ready
    setTimeout(() => {
        // trigger carousel init if available
        if (window.setCarouselStyle) {
            window.setCarouselStyle(appState.selectedStyle);
        }
        hideLoadingScreen();
        showApp();
    }, 800);
});

// Image generation
async function generateImage(event) {
    if (event) event.preventDefault();
    if (appState.isGenerating) return;
    const prompt = (document.getElementById('promptInput')?.value || '').trim();
    const mode = document.getElementById('modeSelect')?.value || 'fast_generation';
    const size = document.getElementById('sizeSelect')?.value || 'square';
    if (!prompt) { showToast('error', appState.translate('error_prompt_required')); triggerHaptic('error'); return; }
    if (prompt.length < 5) { showToast('error', appState.translate('error_prompt_too_short')); triggerHaptic('error'); return; }
    if (!CONFIG.WEBHOOK_URL || CONFIG.WEBHOOK_URL.includes('YOUR_MAKE_WEBHOOK_URL_HERE')) {
        showToast('error', appState.translate('error_webhook_not_configured')); return;
    }
    appState.isGenerating = true;
    appState.startTime = Date.now();
    const generationId = Date.now();
    appState.currentGeneration = {
        id: generationId,
        prompt: prompt,
        style: appState.selectedStyle,
        mode: mode,
        size: size,
        timestamp: new Date().toISOString(),
        status: 'processing',
        startTime: appState.startTime
    };
    appState.generationHistory.unshift(appState.currentGeneration);
    appState.saveHistory();
    showProcessing();
    startTimer();
    try {
        const result = await sendToWebhook({
            action: 'Image Generation',
            prompt: prompt,
            style: appState.selectedStyle,
            mode: mode,
            size: size,
            user_id: appState.userId,
            user_name: appState.userName,
            user_username: appState.userUsername,
            user_language: appState.userLanguage,
            user_is_premium: appState.userIsPremium,
            telegram_platform: appState.telegramPlatform,
            telegram_version: appState.telegramVersion,
            timestamp: new Date().toISOString(),
            generation_id: generationId
        });
        appState.currentGeneration.endTime = Date.now();
        appState.currentGeneration.duration = appState.currentGeneration.endTime - appState.currentGeneration.startTime;
        if (!result || typeof result !== 'object') throw new Error('Invalid response from webhook');
        if (result.status === 'error' || result.error) throw new Error(result.error || result.message || 'Unknown error from webhook');
        const limitReached = result.limit_reached === true || result.limit_reached === 'true' || result.limit_reached === 1 || result.limit_reached === '1';
        if (limitReached) {
            appState.currentGeneration.status = 'limit';
            appState.currentGeneration.result = result.image_url || null;
            appState.saveHistory();
            showSubscriptionNotice(result);
            showToast('warning', result.message || 'Generation limit reached');
            triggerHaptic('medium');
            return;
        }
        if (result.status === 'success' && result.image_url) {
            appState.currentGeneration.status = 'success';
            appState.currentGeneration.result = result.image_url;
            appState.saveHistory();
            showResult(result);
            showToast('success', appState.translate('success_generated'));
            triggerHaptic('success');
            return;
        }
        throw new Error('Unexpected response format: ' + JSON.stringify(result));
    } catch (error) {
        console.error('Generation error:', error);
        appState.currentGeneration.status = 'error';
        appState.currentGeneration.error = error.message;
        appState.currentGeneration.endTime = Date.now();
        appState.currentGeneration.duration = appState.currentGeneration.endTime - appState.currentGeneration.startTime;
        appState.saveHistory();
        showToast('error', appState.translate('error_generation_failed') + ': ' + error.message);
        triggerHaptic('error');
        showGeneration();
    } finally {
        appState.isGenerating = false;
        stopTimer();
    }
}

// Webhook communication
async function sendToWebhook(data) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);
    try {
        const response = await fetch(CONFIG.WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(data),
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const contentType = response.headers.get('content-type') || '';
        let result;
        if (contentType.includes('application/json')) result = await response.json();
        else {
            const text = await response.text();
            try { result = JSON.parse(text); } catch (e) { throw new Error('Response is not valid JSON: ' + text); }
        }
        return result;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') throw new Error(appState.translate('error_timeout'));
        throw error;
    }
}

// Carousel 2D (improvements: update appState.selectedStyle)
(function() {
    const track = document.getElementById('carousel2d');
    const wrapper = track?.closest('.carousel-2d-wrapper');
    if (!track || !wrapper) return;
    const cards = Array.from(track.querySelectorAll('.carousel-2d-item'));
    if (!cards.length) return;
    let isPointerDown = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    function highlight(card) {
        cards.forEach(c => c.classList.remove('active'));
        if (!card) return;
        card.classList.add('active');
        const styleVal = (card.dataset.style || '').toLowerCase();
        appState.selectedStyle = styleVal || appState.selectedStyle;
        card.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
    }

    function nearestCard() {
        const trackRect = track.getBoundingClientRect();
        let best = null, bestDist = Infinity;
        for (const c of cards) {
            const r = c.getBoundingClientRect();
            const dist = Math.abs(r.left - trackRect.left);
            if (dist < bestDist) { bestDist = dist; best = c; }
        }
        return best;
    }

    function snapToNearest() {
        const card = nearestCard();
        if (card) highlight(card);
    }

    function onCardClick(e) {
        if (moved) return;
        const card = e.currentTarget;
        highlight(card);
    }
    cards.forEach(c => c.addEventListener('click', onCardClick));

    track.addEventListener('pointerdown', (e) => {
        isPointerDown = true; moved = false;
        startX = e.clientX; startScroll = track.scrollLeft;
        track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', (e) => {
        if (!isPointerDown) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 5) moved = true;
        track.scrollLeft = startScroll - dx;
    });
    function endPointer(e) {
        if (!isPointerDown) return;
        isPointerDown = false;
        requestAnimationFrame(snapToNearest);
    }
    track.addEventListener('pointerup', endPointer);
    track.addEventListener('pointercancel', endPointer);
    track.addEventListener('pointerleave', endPointer);

    window.getSelectedStyle = function() { return appState.selectedStyle; };
    window.setCarouselStyle = function(style) {
        const target = String(style || '').toLowerCase();
        const card = cards.find(c => (c.dataset.style || '').toLowerCase() === target);
        if (card) highlight(card);
        else highlight(cards[0]);
    };

    // Initialize highlight: prefer appState.selectedStyle if present
    const initial = cards.find(c => (c.dataset.style || '').toLowerCase() === (appState.selectedStyle || '').toLowerCase()) || cards[0];
    highlight(initial);

    window.addEventListener('resize', () => {
        const active = track.querySelector('.carousel-2d-item.active');
        if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
    });
})();

// Actions and utilities
function newGeneration() { showGeneration(); }
function cancelGeneration() {
    if (appState.currentGeneration) {
        appState.currentGeneration.status = 'cancelled';
        appState.currentGeneration.error = 'Cancelled by user';
        appState.saveHistory();
    }
    appState.isGenerating = false;
    stopTimer();
    showGeneration();
    triggerHaptic('medium');
}
async function downloadImage() {
    const url = appState.currentGeneration?.result;
    if (!url) return;
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const linkUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = linkUrl;
        link.download = `ai-generated-${appState.currentGeneration.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(linkUrl);
        showToast('info', appState.translate('download_started'));
        triggerHaptic('light');
    } catch (err) {
        console.error("Ошибка при скачивании:", err);
        showToast('error', 'Download failed');
    }
}
function shareImage() {
    const url = appState.currentGeneration?.result;
    if (!url) return;
    if (navigator.share) {
        navigator.share({ title: 'Image generated by pixPLace App', text: appState.currentGeneration?.prompt, url: url });
    } else {
        navigator.clipboard.writeText(url).then(() => showToast('info', appState.translate('copied_to_clipboard')));
    }
    triggerHaptic('light');
}

window.toggleLanguage = () => appState.toggleLanguage();
window.toggleTheme = () => appState.toggleTheme();
window.showHistory = showHistory;
window.showGeneration = showGeneration;
window.selectStyle = (s) => window.setCarouselStyle(s);
window.generateImage = generateImage;
window.newGeneration = newGeneration;
window.cancelGeneration = cancelGeneration;
window.clearHistory = clearHistory;
window.downloadImage = downloadImage;
window.shareImage = shareImage;
window.showSubscriptionNotice = showSubscriptionNotice;

window.getAppState = () => appState;
window.setWebhookUrl = (url) => { CONFIG.WEBHOOK_URL = url; console.log('✅ Webhook URL updated'); };
window.closeLimitModal = () => { const modal = document.getElementById('limitModal'); if (modal) { modal.classList.remove('show'); showGeneration(); } };

console.log('🎯 pixPLace App loaded!');
