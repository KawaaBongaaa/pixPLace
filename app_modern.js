
// 🚀 Modern AI Image Generator WebApp - FIXED VERSION

// Configuration
const CONFIG = {
    WEBHOOK_URL: 'https://hook.us2.make.com/x2hgl6ocask8hearbpwo3ch7pdwpdlrk',
    TIMEOUT: 120000, // 120 секунд
    LANGUAGES: ['en', 'ru', 'es', 'fr', 'de', 'zh', 'pt-br', 'ar', 'hi', 'ja', 'it', 'ko', 'tr', 'pl'],
    DEFAULT_LANGUAGE: 'en',
    DEFAULT_THEME: 'dark',
};

// 🌍 Translations
const TRANSLATIONS = {
    en: {
        loading: 'Please, Have a Fun',
        app_title: 'pixPLace',
        connecting: 'Connecting...',
        connected: 'Connected to Telegram',
        welcome_title: 'Create Amazing Images',
        welcome_subtitle: 'Describe your vision and watch AI bring it to life',
        prompt_label: 'Prompt',
        prompt_placeholder: 'A beautiful sunset over the ocean...',
        style_label: 'Style',
        style_realistic: 'Realistic',
        style_artistic: 'Artistic',
        style_cartoon: 'Cartoon',
        style_fantasy: 'Fantasy',
        style_anime: 'Anime',
        style_cyberpunk: 'Cyberpunk',
        style_popart: 'Pop Art',
        style_abstract: 'Abstract',
        style_sketch: 'Sketch',
        style_3d: '3d',
        style_sticker: 'Sticker',
        style_vector: 'Vector',
        style_interior: 'Interior',
        style_architecture: 'Architecture',
        style_fashion: 'Fashion',
        style_tattoo: 'Tattoo',
        style_print: 'Print',
        style_logo: 'Logo',
        style_icon: 'Icon',
        style_banner: 'Banner',
        mode_label: 'Mode',
        mode_print_maker: 'Print/Stickers',
        mode_fast_generation: 'Fast Generation',
        mode_pixplace_pro: 'pixPLace Pro (Logo/Text/Photo Supported)',
        mode_pixplace_ultra_pro: 'pixPLace Ultra Pro',
        mode_gpt_image: 'GPT Image',
        mode_flux_kontext: 'Flux Kontext',
        size_label: 'Size',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
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
        error_prompt_too_short: 'Prompt too short (minimum 5 characters)',
        error_webhook_not_configured: 'Webhook URL not configured',
        error_generation_failed: 'Generation failed',
        error_timeout: 'Generation timeout. Please try again.',
        success_generated: 'Image generated successfully!',
        copied_to_clipboard: 'Copied to clipboard',
        download_started: 'Download started',
        limit_title: 'Generation Limit Reached',
        limit_message: 'You\'ve reached your free generation limit. Upgrade to continue creating amazing images!',
        check_subsciption: 'Check Subsciption',
        closeLimitModal: 'Maybe Later',
        upgradeBtn: 'Upgrade Now'
    },
    ru: {
        loading: 'Творите с Удовольствием!',
        app_title: 'pixPLace',
        connecting: 'Подключение...',
        connected: 'Подключено к Telegram',
        welcome_title: 'Создавайте Потрясающие Изображения',
        welcome_subtitle: 'Опишите свое видение и наблюдайте, как pixPLace воплощает его в жизнь',
        prompt_label: 'Prompt',
        prompt_placeholder: 'Красивый закат над океаном...',
        style_label: 'Стиль',
        style_realistic: 'Реализм',
        style_artistic: 'Арт',
        style_cartoon: 'Мульт',
        style_fantasy: 'Фэнтэзи',
        style_anime: 'Анимэ',
        style_cyberpunk: 'CyberPunk',
        mode_label: 'Режим генерации',
        mode_print_maker: 'Принты/Стикеры',
        mode_fast_generation: 'Быстрая генерация',
        mode_pixplace_pro: 'pixPLace Pro (Logo/Text/Photo)',
        mode_pixplace_ultra_pro: 'pixPLace Ultra Pro',
        mode_gpt_image: 'GPT Image',
        mode_flux_kontext: 'Flux Kontext',
        size_label: 'Размер',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
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
        download_started: 'Загрузка началась',
        limit_title: 'Лимит Генераций Исчерпан',
        limit_message: 'Токены для генерации Закончились! Вы можете получить Больше Токенов, оплатив подписку на канал pixPLace',
        check_subsciption: 'проверить Подписку',
        closeLimitModal: 'Может Позже',
        upgradeBtn: 'Оплатить Сейчас'
    }
};

// 🌐 Global State
let currentLanguage = CONFIG.DEFAULT_LANGUAGE;
let currentTheme = CONFIG.DEFAULT_THEME;
let currentScreen = 'generation';
let screenHistory = [];
let generationHistory = JSON.parse(localStorage.getItem('generationHistory') || '[]');
let isGenerating = false;
let generationStartTime = null;
let processingTimer = null;
let currentGeneration = null;

// 🚀 App Initialization
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 pixPLace App Starting...');
    
    // Initialize app
    await initializeApp();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load saved preferences
    loadPreferences();
    
    // Apply translations
    applyTranslations();
    
    // Show app
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.remove('active');
        document.getElementById('app').classList.add('loaded');
    }, 2000);
    
    console.log('✅ pixPLace App Ready!');
});

// 🔧 App Initialization
async function initializeApp() {
    try {
        // Initialize Telegram WebApp if available
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            Telegram.WebApp.ready();
            Telegram.WebApp.expand();
            showStatus('connected');
        } else {
            console.log('📱 Running in standalone mode');
        }
    } catch (error) {
        console.warn('⚠️ Telegram WebApp initialization failed:', error);
    }
}

// 🎛️ Event Listeners Setup
function setupEventListeners() {
    // Prompt counter
    const promptInput = document.getElementById('promptInput');
    const promptCounter = document.getElementById('promptCounter');
    
    promptInput.addEventListener('input', () => {
        promptCounter.textContent = promptInput.value.length;
    });
    
    // Style selection
    document.querySelectorAll('.style-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.style-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
    
    // Prevent form submission on Enter in textarea
    promptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            document.getElementById('generateBtn').click();
        }
    });
}

// 💾 Load Preferences
function loadPreferences() {
    const savedLang = localStorage.getItem('pixplace_language');
    const savedTheme = localStorage.getItem('pixplace_theme');
    
    if (savedLang && CONFIG.LANGUAGES.includes(savedLang)) {
        currentLanguage = savedLang;
        document.body.setAttribute('data-lang', currentLanguage);
    }
    
    if (savedTheme) {
        currentTheme = savedTheme;
        document.body.setAttribute('data-theme', currentTheme);
    }
}

// 🌍 Translation System
function applyTranslations() {
    const translations = TRANSLATIONS[currentLanguage] || TRANSLATIONS[CONFIG.DEFAULT_LANGUAGE];
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[key]) {
            element.placeholder = translations[key];
        }
    });
}

// 🎨 Theme Management
function toggleTheme() {
    const themes = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(currentTheme);
    currentTheme = themes[(currentIndex + 1) % themes.length];
    
    document.body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('pixplace_theme', currentTheme);
}

// 🌐 Language Management
function toggleLanguage() {
    const currentIndex = CONFIG.LANGUAGES.indexOf(currentLanguage);
    currentLanguage = CONFIG.LANGUAGES[(currentIndex + 1) % CONFIG.LANGUAGES.length];
    
    document.body.setAttribute('data-lang', currentLanguage);
    localStorage.setItem('pixplace_language', currentLanguage);
    applyTranslations();
}

// 📱 Screen Management - ИСПРАВЛЕНО
function showScreen(screenName) {
    console.log(`🔄 Switching to screen: ${screenName}`);
    
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenName + 'Screen');
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenName;
        
        // Update back button visibility - ИСПРАВЛЕНО
        updateBackButtonVisibility();
        
        // Add to history if not the same screen
        if (screenHistory[screenHistory.length - 1] !== screenName) {
            screenHistory.push(screenName);
        }
    } else {
        console.error(`❌ Screen not found: ${screenName}Screen`);
    }
}

// 🔙 Back Button Management - ИСПРАВЛЕНО
function updateBackButtonVisibility() {
    const backButtons = document.querySelectorAll('.back-btn');
    const shouldShowBack = currentScreen === 'history' || currentScreen === 'result';
    
    backButtons.forEach(btn => {
        if (shouldShowBack) {
            btn.style.display = 'flex';
        } else {
            btn.style.display = 'none';
        }
    });
}

function goBack() {
    if (screenHistory.length > 1) {
        screenHistory.pop(); // Remove current screen
        const previousScreen = screenHistory[screenHistory.length - 1];
        showScreen(previousScreen);
    } else {
        showGeneration();
    }
}

// 🎯 Screen Navigation Functions
function showGeneration() {
    showScreen('generation');
}

function showProcessing() {
    showScreen('processing');
}

function showResult() {
    showScreen('result');
}

function showHistory() {
    showScreen('history');
    renderHistory();
}

// 📊 Status Management
function showStatus(type, message) {
    const statusBar = document.getElementById('statusBar');
    const statusContent = statusBar.querySelector('.status-content span');
    
    const messages = {
        connecting: TRANSLATIONS[currentLanguage]?.connecting || 'Connecting...',
        connected: TRANSLATIONS[currentLanguage]?.connected || 'Connected to Telegram'
    };
    
    statusContent.textContent = message || messages[type] || type;
    statusBar.classList.add('show');
    
    if (type === 'connected') {
        setTimeout(() => {
            statusBar.classList.remove('show');
        }, 3000);
    }
}

// 🎨 Image Generation - ИСПРАВЛЕНО
async function generateImage(event) {
    event.preventDefault();
    
    if (isGenerating) return;
    
    const prompt = document.getElementById('promptInput').value.trim();
    const style = document.querySelector('.style-card.active')?.dataset.style || 'realistic';
    const mode = document.getElementById('modeSelect').value;
    const size = document.getElementById('sizeSelect').value;
    
    // Validation
    if (!prompt) {
        showToast(TRANSLATIONS[currentLanguage]?.error_prompt_required || 'Please describe your image', 'error');
        return;
    }
    
    if (prompt.length < 5) {
        showToast(TRANSLATIONS[currentLanguage]?.error_prompt_too_short || 'Prompt too short (minimum 5 characters)', 'error');
        return;
    }
    
    if (!CONFIG.WEBHOOK_URL) {
        showToast(TRANSLATIONS[currentLanguage]?.error_webhook_not_configured || 'Webhook URL not configured', 'error');
        return;
    }
    
    // Start generation
    isGenerating = true;
    generationStartTime = Date.now();
    currentGeneration = { prompt, style, mode, size };
    
    // Show processing screen - ИСПРАВЛЕНО
    showProcessing();
    startProcessingAnimation();
    
    try {
        const result = await callWebhook({ prompt, style, mode, size });
        
        if (result.success && result.imageUrl) {
            // Success
            const generationTime = Math.round((Date.now() - generationStartTime) / 1000);
            
            // Save to history
            const historyItem = {
                id: Date.now(),
                prompt,
                style,
                mode,
                size,
                imageUrl: result.imageUrl,
                timestamp: new Date().toISOString(),
                generationTime
            };
            
            generationHistory.unshift(historyItem);
            localStorage.setItem('generationHistory', JSON.stringify(generationHistory));
            
            // Show result - ИСПРАВЛЕНО
            displayResult(historyItem);
            showResult();
            
            showToast(TRANSLATIONS[currentLanguage]?.success_generated || 'Image generated successfully!', 'success');
        } else {
            throw new Error(result.error || 'Generation failed');
        }
    } catch (error) {
        console.error('❌ Generation error:', error);
        showToast(TRANSLATIONS[currentLanguage]?.error_generation_failed || 'Generation failed', 'error');
        showGeneration();
    } finally {
        isGenerating = false;
        stopProcessingAnimation();
    }
}

// 🔄 Processing Animation - ИСПРАВЛЕНО
function startProcessingAnimation() {
    const steps = ['step1', 'step2', 'step3'];
    const progressCircle = document.querySelector('.progress-circle');
    const elapsedTimeElement = document.getElementById('elapsedTime');
    
    let currentStep = 0;
    let progress = 0;
    let elapsedSeconds = 0;
    
    // Reset steps
    steps.forEach(stepId => {
        document.getElementById(stepId).classList.remove('active');
    });
    document.getElementById('step1').classList.add('active');
    
    processingTimer = setInterval(() => {
        elapsedSeconds++;
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;
        elapsedTimeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update progress
        progress = Math.min(95, (elapsedSeconds / 60) * 100);
        const circumference = 2 * Math.PI * 54;
        const offset = circumference - (progress / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
        
        // Update steps
        if (elapsedSeconds === 10 && currentStep === 0) {
            document.getElementById('step1').classList.remove('active');
            document.getElementById('step2').classList.add('active');
            currentStep = 1;
        } else if (elapsedSeconds === 30 && currentStep === 1) {
            document.getElementById('step2').classList.remove('active');
            document.getElementById('step3').classList.add('active');
            currentStep = 2;
        }
    }, 1000);
}

function stopProcessingAnimation() {
    if (processingTimer) {
        clearInterval(processingTimer);
        processingTimer = null;
    }
}

// 🌐 Webhook Call
async function callWebhook(data) {
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
        
        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new Error(TRANSLATIONS[currentLanguage]?.error_timeout || 'Generation timeout. Please try again.');
        }
        
        throw error;
    }
}

// 🖼️ Result Display
function displayResult(historyItem) {
    document.getElementById('resultImage').src = historyItem.imageUrl;
    document.getElementById('resultPrompt').textContent = historyItem.prompt;
    document.getElementById('resultTime').textContent = `${historyItem.generationTime}s`;
}

// 📜 History Management
function renderHistory() {
    const container = document.getElementById('historyContainer');
    
    if (generationHistory.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎨</div>
                <h3 data-i18n="empty_history_title">No generations yet</h3>
                <p data-i18n="empty_history_subtitle">Create your first AI image to see it here</p>
            </div>
        `;
        applyTranslations();
        return;
    }
    
    container.innerHTML = generationHistory.map(item => `
        <div class="history-item" onclick="viewHistoryItem('${item.id}')">
            <div class="history-image">
                <img src="${item.imageUrl}" alt="Generated image" loading="lazy" />
            </div>
            <div class="history-content">
                <div class="history-prompt">${item.prompt}</div>
                <div class="history-meta">
                    <span class="meta-item">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        ${item.generationTime}s
                    </span>
                    <span class="meta-item">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 13h10l-2-13"></path>
                        </svg>
                        ${item.style}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

function viewHistoryItem(id) {
    const item = generationHistory.find(h => h.id == id);
    if (item) {
        displayResult(item);
        showResult();
    }
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
        generationHistory = [];
        localStorage.removeItem('generationHistory');
        renderHistory();
        showToast('History cleared', 'success');
    }
}

// 🚫 Cancel Generation
function cancelGeneration() {
    if (isGenerating) {
        isGenerating = false;
        stopProcessingAnimation();
        showGeneration();
        showToast('Generation cancelled', 'info');
    }
}

// 📥 Download & Copy Functions
function downloadImage() {
    const img = document.getElementById('resultImage');
    if (img.src) {
        const link = document.createElement('a');
        link.href = img.src;
        link.download = `pixplace-${Date.now()}.jpg`;
        link.click();
        showToast(TRANSLATIONS[currentLanguage]?.download_started || 'Download started', 'success');
    }
}

async function copyImageUrl() {
    const img = document.getElementById('resultImage');
    if (img.src) {
        try {
            await navigator.clipboard.writeText(img.src);
            showToast(TRANSLATIONS[currentLanguage]?.copied_to_clipboard || 'Copied to clipboard', 'success');
        } catch (error) {
            console.error('Copy failed:', error);
        }
    }
}

// 💳 Subscription Functions
function closeLimitModal() {
    document.getElementById('limitModal').style.display = 'none';
}

function checkSubscription() {
    // Implement subscription check logic
    console.log('Checking subscription...');
    closeLimitModal();
}

function upgradeNow() {
    // Implement upgrade logic
    console.log('Upgrading...');
    closeLimitModal();
}

// 🍞 Toast Notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => container.removeChild(toast), 300);
    }, 3000);
}

// 🔧 Utility Functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 🎯 Error Handling
window.addEventListener('error', (event) => {
    console.error('🚨 Global error:', event.error);
    showToast('An unexpected error occurred', 'error');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled promise rejection:', event.reason);
    showToast('An unexpected error occurred', 'error');
});

// 📱 PWA Support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('✅ SW registered:', registration))
            .catch(error => console.log('❌ SW registration failed:', error));
    });
}

console.log('🚀 pixPLace App Script Loaded');
