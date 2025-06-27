// 🚀 Modern AI Image Generator WebApp
// Configuration
const CONFIG = {
    WEBHOOK_URL: 'https://hook.us2.make.com/x2hgl6ocask8hearbpwo3ch7pdwpdlrk', // ⚠️ ЗАМЕНИТЕ НА ВАШ WEBHOOK!
    TIMEOUT: 60000, // 60 секунд
    LANGUAGES: ['en', 'ru', 'es', 'fr', 'de', 'zh'],
    DEFAULT_LANGUAGE: 'en'
};

// 🌍 Translations
const TRANSLATIONS = {
    en: {
        loading: 'Loading...',
        app_title: 'pixPLace',
        connecting: 'Connecting...',
        connected: 'Connected to Telegram',
        welcome_title: 'Create Amazing Images',
        welcome_subtitle: 'Describe your vision and watch AI bring it to life',
        prompt_label: 'Describe your image',
        prompt_placeholder: 'A beautiful sunset over the ocean...',
        style_label: 'Art Style',
        style_realistic: 'Realistic',
        style_artistic: 'Artistic',
        style_cartoon: 'Cartoon',
        style_fantasy: 'Fantasy',
        style_anime: 'Anime',
        style_cyberpunk: 'Cyberpunk',
        quality_label: 'Quality',
        quality_standard: 'Standard',
        quality_hd: 'HD',
        quality_ultra: 'Ultra HD',
        size_label: 'Size',
        size_square: 'Square',
        size_portrait: 'Portrait',
        size_landscape: 'Landscape',
        generate_btn: 'Generate Image',
        processing_title: 'Creating Your Masterpiece',
        processing_subtitle: 'This may take up to 60 seconds',
        step_analyzing: 'Analyzing prompt',
        step_generating: 'Generating image',
        step_finalizing: 'Finalizing result',
        elapsed_time: 'Elapsed time:',
        cancel_btn: 'Cancel',
        create_new: 'Create New',
        view_history: 'View History',
        history_title: 'Generation History',
        empty_history_title: 'No generations yet',
        empty_history_subtitle: 'Create your first AI image to see it here',
        generation_time: 'Generation time',
        error_prompt_required: 'Please describe your image',
        error_prompt_too_short: 'Description too short (minimum 5 characters)',
        error_webhook_not_configured: 'Webhook URL not configured',
        error_generation_failed: 'Generation failed',
        error_timeout: 'Generation timeout. Please try again.',
        success_generated: 'Image generated successfully!',
        copied_to_clipboard: 'Copied to clipboard',
        download_started: 'Download started'
    },
    ru: {
        loading: 'Загрузка...',
        app_title: 'pixPLace',
        connecting: 'Подключение...',
        connected: 'Подключено к Telegram',
        welcome_title: 'Создавайте Потрясающие Изображения',
        welcome_subtitle: 'Опишите свое видение и наблюдайте, как pixPLace воплощает его в жизнь',
        prompt_label: 'Опишите изображение',
        prompt_placeholder: 'Красивый закат над океаном...',
        style_label: 'Стиль',
        style_realistic: 'Реалистичный',
        style_artistic: 'Художественный',
        style_cartoon: 'Мультяшный',
        style_fantasy: 'Фэнтези',
        style_anime: 'Аниме',
        style_cyberpunk: 'Киберпанк',
        quality_label: 'Качество',
        quality_standard: 'Стандартное',
        quality_hd: 'HD',
        quality_ultra: 'Ultra HD',
        size_label: 'Размер',
        size_square: 'Квадрат',
        size_portrait: 'Портрет',
        size_landscape: 'Пейзаж',
        generate_btn: 'Создать Изображение',
        processing_title: 'Создаем Ваш Шедевр',
        processing_subtitle: 'Это может занять до 60 секунд',
        step_analyzing: 'Анализируем промпт',
        step_generating: 'Генерируем изображение',
        step_finalizing: 'Завершаем результат',
        elapsed_time: 'Прошло времени:',
        cancel_btn: 'Отменить',
        create_new: 'Создать Новое',
        view_history: 'Посмотреть Историю',
        history_title: 'История Генераций',
        empty_history_title: 'Пока нет генераций',
        empty_history_subtitle: 'Создайте первое ИИ изображение, чтобы увидеть его здесь',
        generation_time: 'Время генерации',
        error_prompt_required: 'Пожалуйста, опишите изображение',
        error_prompt_too_short: 'Описание слишком короткое (минимум 5 символов)',
        error_webhook_not_configured: 'Webhook URL не настроен',
        error_generation_failed: 'Генерация не удалась',
        error_timeout: 'Превышено время ожидания. Попробуйте еще раз.',
        success_generated: 'Изображение успешно создано!',
        copied_to_clipboard: 'Скопировано в буфер обмена',
        download_started: 'Загрузка началась'
    },
    es: {
        loading: 'Cargando...',
        app_title: 'pixPLace',
        connecting: 'Conectando...',
        connected: 'Conectado a Telegram',
        welcome_title: 'Crea Imágenes Increíbles',
        welcome_subtitle: 'Describe tu visión y observa cómo la IA la hace realidad',
        prompt_label: 'Describe tu imagen',
        prompt_placeholder: 'Una hermosa puesta de sol sobre el océano...',
        style_label: 'Estilo',
        style_realistic: 'Realista',
        style_artistic: 'Artístico',
        style_cartoon: 'Caricatura',
        style_fantasy: 'Fantasía',
        style_anime: 'Anime',
        style_cyberpunk: 'Cyberpunk',
        quality_label: 'Calidad',
        quality_standard: 'Estándar',
        quality_hd: 'HD',
        quality_ultra: 'Ultra HD',
        size_label: 'Tamaño',
        size_square: 'Cuadrado',
        size_portrait: 'Retrato',
        size_landscape: 'Paisaje',
        generate_btn: 'Generar Imagen',
        processing_title: 'Creando Tu Obra Maestra',
        processing_subtitle: 'Esto puede tomar hasta 60 segundos',
        step_analyzing: 'Analizando prompt',
        step_generating: 'Generando imagen',
        step_finalizing: 'Finalizando resultado',
        elapsed_time: 'Tiempo transcurrido:',
        cancel_btn: 'Cancelar',
        create_new: 'Crear Nueva',
        view_history: 'Ver Historial',
        history_title: 'Historial de Generaciones',
        empty_history_title: 'Aún no hay generaciones',
        empty_history_subtitle: 'Crea tu primera imagen IA para verla aquí',
        generation_time: 'Tiempo de generación',
        error_prompt_required: 'Por favor describe tu imagen',
        error_prompt_too_short: 'Descripción muy corta (mínimo 5 caracteres)',
        error_webhook_not_configured: 'URL de webhook no configurada',
        error_generation_failed: 'Generación fallida',
        error_timeout: 'Tiempo de espera agotado. Inténtalo de nuevo.',
        success_generated: '¡Imagen generada exitosamente!',
        copied_to_clipboard: 'Copiado al portapapeles',
        download_started: 'Descarga iniciada'
    }
};

// 🎯 App State
class AppState {
    constructor() {
        this.tg = null;
        this.currentLanguage = CONFIG.DEFAULT_LANGUAGE;
        this.currentTheme = 'auto';
        this.selectedStyle = 'realistic';
        this.isGenerating = false;
        this.userId = null;
        this.userName = null;
        this.generationHistory = [];
        this.currentGeneration = null;
        this.startTime = null;
        this.timerInterval = null;
    }

    // Language methods
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
        return TRANSLATIONS[this.currentLanguage]?.[key] || TRANSLATIONS[CONFIG.DEFAULT_LANGUAGE]?.[key] || key;
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

    // Theme methods
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

    // Storage methods
    saveSettings() {
        try {
            localStorage.setItem('appSettings', JSON.stringify({
                language: this.currentLanguage,
                theme: this.currentTheme
            }));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }

    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
            if (settings.language) this.setLanguage(settings.language);
            if (settings.theme) this.setTheme(settings.theme);
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    saveHistory() {
        try {
            localStorage.setItem('generationHistory', JSON.stringify(this.generationHistory));
        } catch (error) {
            console.error('Failed to save history:', error);
        }
    }

    loadHistory() {
        try {
            const history = localStorage.getItem('generationHistory');
            if (history) {
                this.generationHistory = JSON.parse(history);
            }
        } catch (error) {
            console.error('Failed to load history:', error);
            this.generationHistory = [];
        }
    }
}

// 🎯 Global state
const appState = new AppState();

// 🚀 App Initialization
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 pixPLace Creator starting...');

    // Show loading screen
    showLoadingScreen();

    // Load settings and history
    appState.loadSettings();
    appState.loadHistory();

    // Initialize Telegram WebApp
    await initTelegramApp();

    // Initialize UI
    initializeUI();

    // Hide loading screen and show app
    setTimeout(() => {
        hideLoadingScreen();
        showApp();
    }, 1500);
});

// 📱 Telegram WebApp Integration
async function initTelegramApp() {
    console.log('🔍 Initializing Telegram WebApp...');

    if (typeof window.Telegram === 'undefined' || !window.Telegram.WebApp) {
        console.log('⚠️ Telegram WebApp not available');
        showStatus('info', appState.translate('connecting'));
        return;
    }

    try {
        appState.tg = window.Telegram.WebApp;
        appState.tg.ready();
        appState.tg.expand();

        // Get user data
       // Get user data
if (appState.tg.initDataUnsafe && appState.tg.initDataUnsafe.user) {
    appState.userId = appState.tg.initDataUnsafe.user.id.toString();
    appState.userName = appState.tg.initDataUnsafe.user.first_name + 
        (appState.tg.initDataUnsafe.user.last_name ? ' ' + appState.tg.initDataUnsafe.user.last_name : '');
    console.log('👤 User:', appState.userName, 'ID:', appState.userId);
    console.log('🔍 Telegram Debug:', {
    telegramExists: !!window.Telegram,
    webAppExists: !!window.Telegram?.WebApp,
    initDataUnsafe: window.Telegram?.WebApp?.initDataUnsafe,
    userFromTelegram: window.Telegram?.WebApp?.initDataUnsafe?.user
});
} else {
    // Fallback для тестирования
    appState.userId = 'test_' + Date.now();
    appState.userName = 'Test User';
    console.log('⚠️ Using fallback user data');
}
        // Setup main button
        if (appState.tg.MainButton) {
            appState.tg.MainButton.setText(appState.translate('generate_btn'));
            appState.tg.MainButton.onClick(() => {
                if (getCurrentScreen() === 'generationScreen') {
                    generateImage();
                } else if (getCurrentScreen() === 'resultScreen') {
                    showGeneration();
                } else if (getCurrentScreen() === 'historyScreen') {
                    showGeneration();
                }
            });
            appState.tg.MainButton.show();
        }

        // Auto-detect language
        const tgLang = appState.tg.initDataUnsafe?.user?.language_code;
        if (tgLang && CONFIG.LANGUAGES.includes(tgLang)) {
            appState.setLanguage(tgLang);
        }

        showStatus('success', appState.translate('connected'));

    } catch (error) {
        console.error('❌ Telegram initialization error:', error);
        showStatus('error', 'Telegram connection error');
    }
}

// 🎨 UI Initialization
function initializeUI() {
    // Character counter
    const promptInput = document.getElementById('promptInput');
    const charCounter = document.getElementById('charCounter');

    if (promptInput && charCounter) {
        promptInput.addEventListener('input', function() {
            charCounter.textContent = this.value.length;

            // Auto-resize
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }

    // Form submission
    const form = document.querySelector('.generation-form');
    if (form) {
        form.addEventListener('submit', generateImage);
    }

    // Update translations
    appState.updateTranslations();

    console.log('✅ UI initialized');
}

// 🖼️ Image Generation
async function generateImage(event) {
    if (event) {
        event.preventDefault();
    }

    if (appState.isGenerating) return;

    const prompt = document.getElementById('promptInput').value.trim();
    const quality = document.getElementById('qualitySelect').value;
    const size = document.getElementById('sizeSelect').value;

    console.log('🚀 Starting generation:', { prompt, style: appState.selectedStyle, quality, size });

    // Validation
    if (!prompt) {
        showToast('error', appState.translate('error_prompt_required'));
        triggerHaptic('error');
        return;
    }

    if (prompt.length < 5) {
        showToast('error', appState.translate('error_prompt_too_short'));
        triggerHaptic('error');
        return;
    }

    if (CONFIG.WEBHOOK_URL === 'YOUR_MAKE_WEBHOOK_URL_HERE') {
        showToast('error', appState.translate('error_webhook_not_configured'));
        return;
    }

    appState.isGenerating = true;
    appState.startTime = Date.now();

    // Create generation record
    appState.currentGeneration = {
        id: Date.now(),
        prompt: prompt,
        style: appState.selectedStyle,
        quality: quality,
        size: size,
        timestamp: new Date().toISOString(),
        status: 'processing',
        startTime: appState.startTime
    };

    // Add to history
    appState.generationHistory.unshift(appState.currentGeneration);
    appState.saveHistory();

    // Show processing screen
    showProcessing();
    startTimer();

    try {
        // Send request to Make webhook
        // Добавьте ЭТИ СТРОКИ перед sendToWebhook:
console.log('🔍 Sending data to webhook:', {
    userId: appState.userId,
    userName: appState.userName,
    telegramAvailable: !!window.Telegram?.WebApp,
    initData: window.Telegram?.WebApp?.initDataUnsafe
});

// Send request to Make webhook
const result = await sendToWebhook({
action: 'generate_image',
            prompt: prompt,
            style: appState.selectedStyle,
            quality: quality,
            size: size,
            user_id: appState.userId,
            user_name: appState.userName,
            timestamp: new Date().toISOString(),
            generation_id: appState.currentGeneration.id
        });});

        // Handle successful response
        if (result.status === 'success' && result.image_url) {
            appState.currentGeneration.status = 'success';
            appState.currentGeneration.result = result.image_url;
            appState.currentGeneration.endTime = Date.now();
            appState.currentGeneration.duration = appState.currentGeneration.endTime - appState.currentGeneration.startTime;

            appState.saveHistory();
            showResult(result);
            showToast('success', appState.translate('success_generated'));
            triggerHaptic('success');

        } else {
            throw new Error(result.error || 'Unknown error');
        }

    } catch (error) {
        console.error('❌ Generation error:', error);

        appState.currentGeneration.status = 'error';
        appState.currentGeneration.error = error.message;
        appState.saveHistory();

        showToast('error', appState.translate('error_generation_failed') + ': ' + error.message);
        triggerHaptic('error');
        showGeneration();
    } finally {
        appState.isGenerating = false;
        stopTimer();
    }
}

// 🌐 Webhook Communication
async function sendToWebhook(data) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);

    try {
        const response = await fetch(CONFIG.WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ Webhook response:', result);
        return result;

    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            throw new Error(appState.translate('error_timeout'));
        }

        throw error;
    }
}

// 🎬 Screen Management
function getCurrentScreen() {
    const activeScreen = document.querySelector('.screen.active');
    return activeScreen ? activeScreen.id : null;
}

function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }

    // Update main button
    updateMainButton(screenId);
}

function updateMainButton(screenId) {
    if (!appState.tg?.MainButton) return;

    switch (screenId) {
        case 'generationScreen':
            appState.tg.MainButton.setText(appState.translate('generate_btn'));
            appState.tg.MainButton.show();
            break;
        case 'processingScreen':
            appState.tg.MainButton.hide();
            break;
        case 'resultScreen':
            appState.tg.MainButton.setText(appState.translate('create_new'));
            appState.tg.MainButton.show();
            break;
        case 'historyScreen':
            appState.tg.MainButton.setText('← ' + appState.translate('create_new'));
            appState.tg.MainButton.show();
            break;
    }
}

function showLoadingScreen() {
    document.getElementById('loadingScreen').classList.add('active');
}

function hideLoadingScreen() {
    document.getElementById('loadingScreen').classList.remove('active');
}

function showApp() {
    document.getElementById('app').classList.add('loaded');
}

function showGeneration() {
    showScreen('generationScreen');
}

function showProcessing() {
    showScreen('processingScreen');
    updateProcessingSteps(1);
}

function showResult(result) {
    showScreen('resultScreen');

    // Update result display
    const resultImage = document.getElementById('resultImage');
    const resultPrompt = document.getElementById('resultPrompt');
    const resultStyle = document.getElementById('resultStyle');
    const resultQuality = document.getElementById('resultQuality');
    const resultTime = document.getElementById('resultTime');

    if (resultImage) resultImage.src = result.image_url;
    if (resultPrompt) resultPrompt.textContent = appState.currentGeneration.prompt;
    if (resultStyle) resultStyle.textContent = appState.translate('style_' + appState.currentGeneration.style);
    if (resultQuality) resultQuality.textContent = appState.translate('quality_' + appState.currentGeneration.quality);
    if (resultTime) {
        const duration = Math.round((appState.currentGeneration.duration || 0) / 1000);
        resultTime.textContent = duration + 's';
    }
}

function showHistory() {
    showScreen('historyScreen');
    updateHistoryDisplay();
}

// 📊 Processing Animation
function updateProcessingSteps(activeStep) {
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index + 1 <= activeStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    // Update progress circle
    const progressCircle = document.querySelector('.progress-circle');
    if (progressCircle) {
        const progress = (activeStep / 3) * 283; // 283 is circumference
        progressCircle.style.strokeDashoffset = 283 - progress;
    }
}

function startTimer() {
    const elapsedTimeElement = document.getElementById('elapsedTime');
    let step = 1;

    appState.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - appState.startTime) / 1000);
        if (elapsedTimeElement) {
            elapsedTimeElement.textContent = elapsed + 's';
        }

        // Update steps based on time
        if (elapsed > 10 && step === 1) {
            updateProcessingSteps(2);
            step = 2;
        } else if (elapsed > 30 && step === 2) {
            updateProcessingSteps(3);
            step = 3;
        }
    }, 1000);
}

function stopTimer() {
    if (appState.timerInterval) {
        clearInterval(appState.timerInterval);
        appState.timerInterval = null;
    }
}

// 📋 History Management
function updateHistoryDisplay() {
    const historyContent = document.getElementById('historyContent');
    if (!historyContent) return;

    if (appState.generationHistory.length === 0) {
        historyContent.innerHTML = `
            <div class="empty-history">
                <div class="empty-icon">📋</div>
                <h3 data-i18n="empty_history_title">${appState.translate('empty_history_title')}</h3>
                <p data-i18n="empty_history_subtitle">${appState.translate('empty_history_subtitle')}</p>
            </div>
        `;
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
                <span>🎨 ${appState.translate('style_' + item.style)}</span>
                <span>⚙️ ${appState.translate('quality_' + item.quality)}</span>
                ${item.duration ? `<span>⏱️ ${Math.round(item.duration / 1000)}s</span>` : ''}
            </div>
            ${item.result ? `<img src="${item.result}" alt="Generated" class="history-image" loading="lazy" />` : ''}
            ${item.error ? `<p style="color: var(--error-500); font-size: var(--font-size-sm); margin-top: var(--space-2);">❌ ${item.error}</p>` : ''}
        </div>
    `).join('');
}

function getStatusText(status) {
    switch (status) {
        case 'processing': return '⏳';
        case 'success': return '✅';
        case 'error': return '❌';
        default: return status;
    }
}

function viewHistoryItem(id) {
    const item = appState.generationHistory.find(h => h.id == id);
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

// 🎨 Style Selection
function selectStyle(button) {
    // Remove active class from all style buttons
    document.querySelectorAll('.style-card').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active class to clicked button
    button.classList.add('active');

    // Update selected style
    appState.selectedStyle = button.dataset.style;

    triggerHaptic('light');
    console.log('🎨 Style selected:', appState.selectedStyle);
}

// 🔄 Action Functions
function newGeneration() {
    showGeneration();
    // Clear form
    document.getElementById('promptInput').value = '';
    document.getElementById('charCounter').textContent = '0';
}

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

// 📱 Device Integration
function downloadImage() {
    if (!appState.currentGeneration?.result) return;

    const link = document.createElement('a');
    link.href = appState.currentGeneration.result;
    link.download = `ai-generated-${appState.currentGeneration.id}.jpg`;
    link.click();

    showToast('info', appState.translate('download_started'));
    triggerHaptic('light');
}

function shareImage() {
    if (!appState.currentGeneration?.result) return;

    if (navigator.share) {
        navigator.share({
            title: 'Image generated by pixPLace App',
            text: appState.currentGeneration.prompt,
            url: appState.currentGeneration.result
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(appState.currentGeneration.result).then(() => {
            showToast('info', appState.translate('copied_to_clipboard'));
        });
    }

    triggerHaptic('light');
}

// 🎯 Utility Functions
function showStatus(type, message) {
    const statusBar = document.getElementById('statusBar');
    const statusText = document.querySelector('.status-text');

    if (statusBar && statusText) {
        statusText.textContent = message;
        statusBar.className = `status-bar ${type} show`;

        setTimeout(() => {
            statusBar.classList.remove('show');
        }, 3000);
    }
}

function showToast(type, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);

    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => container.removeChild(toast), 300);
    }, 3000);
}

function triggerHaptic(type) {
    if (appState.tg?.HapticFeedback) {
        switch (type) {
            case 'light':
                appState.tg.HapticFeedback.impactOccurred('light');
                break;
            case 'medium':
                appState.tg.HapticFeedback.impactOccurred('medium');
                break;
            case 'heavy':
                appState.tg.HapticFeedback.impactOccurred('heavy');
                break;
            case 'success':
                appState.tg.HapticFeedback.notificationOccurred('success');
                break;
            case 'error':
                appState.tg.HapticFeedback.notificationOccurred('error');
                break;
        }
    }
}

// 🌍 Global Functions
window.toggleLanguage = () => appState.toggleLanguage();
window.toggleTheme = () => appState.toggleTheme();
window.showHistory = showHistory;
window.showGeneration = showGeneration;
window.selectStyle = selectStyle;
window.generateImage = generateImage;
window.newGeneration = newGeneration;
window.cancelGeneration = cancelGeneration;
window.clearHistory = clearHistory;
window.downloadImage = downloadImage;
window.shareImage = shareImage;

// 🧪 Debug Functions
window.getAppState = () => appState;
window.setWebhookUrl = (url) => {
    CONFIG.WEBHOOK_URL = url;
    console.log('✅ Webhook URL updated');
};

console.log('🎯 pixPLace App loaded!');
console.log('🔧 Debug commands:');
console.log('- getAppState() - get current app state');
console.log('- setWebhookUrl("url") - set webhook URL');
console.log('⚠️ Don\'t forget to set your webhook URL!');
