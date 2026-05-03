console.log('🚀 APP MODERN MODULE IMPORTED');

// 🔥 LAZY LOADING словарей - только текущий язык загружается по требованию
// 🚀 OPTIMIZATION: Removed static imports for heavy modules

// ✅ НОВЫЕ: Импорт сервисов вместо прямых зависимостей
import { initializeGlobalServices } from './core/services.js';
import { AppStateManager } from './store/app-state.js';
import { showScreen, showApp, showResult, displayFullResult, showResultToast, showProcessing, showAuth } from './screen-manager.js';
import { dictionaryManager } from './dictionary-manager.js';

// Импорт ScreenManager для работы с авторизацией
import { updateUserNameDisplay, updateUserBalanceDisplay, showWarningAboutNoImage, toggleModeDetails, showHistory, initStyleCarousel, initLazyLanguageDropdown } from './navigation-manager.js?v=portal-1';
import { readFileAsDataURL, maybeCompressImage, sanitizeJsonString, generateUUIDv4, isIOS, downloadOrShareImage, triggerHapticFeedback, extractBase64FromDataUrl, readFileAsArrayBuffer, arrayBufferToBlob, blobToDataURL, maybeCompressImageBlob } from './utils.js';
// 🚀 LAZY LOAD: AI Coach loaded on demand
// import { createCoachButton, initAICoach, createChatButton } from './ai-coach.js';
import { updateHistoryItemWithImage, createLoadingHistoryItem, viewHistoryItem, updateHistoryDisplay, updateHistoryCount } from './history-manager.js';
// 🚀 LAZY LOAD: These modules are now imported dynamically when needed
// import { generationManager } from './parallel-generation.js';
import { initUserAccount } from './user-account.js';
// Import mode management functions with lazy loading support
let modeCardsExports = null;
let costBadgeModule = null;

async function getSelectedModeFromComponent() {
    // console.log('🔍 getSelectedModeFromComponent() called at:', new Date().toISOString());

    if (modeCardsExports) {
        // console.log('✅ Using cached modeCardsExports');
        const mode = modeCardsExports.getSelectedMode();
        // console.log('📋 Returned mode from cached exports:', mode);
        return mode;
    }

    try {
        // console.log('📦 Importing mode-cards.js module...');
        modeCardsExports = await import('./mode-cards.js');
        const mode = modeCardsExports.getSelectedMode();
        // console.log('📋 Returned mode from fresh import:', mode);
        return mode;
    } catch (error) {
        console.error('❌ Failed to load mode-cards to get selected mode:', error);
        // Fallback only to default mode since old select is gone
        console.log('🔄 Using fallback mode: nano_banana_pro');
        return 'nano_banana_pro';
    }
}

// ===== Функция для получения текущего выбранного режима =====
async function getCurrentSelectedMode() {
    try {
        return await getSelectedModeFromComponent();
    } catch (error) {
        console.error('❌ Failed to get current selected mode:', error);
        // Fallback - check DOM element as backup
        return document.getElementById('modeSelect')?.value || 'nano_banana';
    }
}


// 🚀 Modern AI Image Generator WebApp

/**
 * BYPASS AUTH FLAG
 *
 * 🚧 TEMPORARY WORKAROUND FOR TESTING 🚧
 *
 * Set to true to skip authentication for development/testing.
 * Set back to false before production deployment.
 */
const BYPASS_AUTH = true; // CHANGE TO FALSE BEFORE DEPLOYMENT!

// 🔥 PERFORMANCE: Debug mode for development only
window.DEBUG_MODE = (window.location.hostname === 'localhost') ? 'full' : 'minimal';

// Configuration - GitHub Pages compatible: variables replaced during deploy
const CONFIG = {


    // Webhook URLs — injected by GitHub Actions (deploy.yml) via repository secrets
    // ⚠️ Do NOT put real URLs here — they are replaced at deploy time
    WEBHOOK_URL: 'PLACEHOLDER_WEBHOOK_URL',
    CHAT_WEBHOOK_URL: 'PLACEHOLDER_CHAT_WEBHOOK_URL',
    NANO_BANANA_WEBHOOK: 'PLACEHOLDER_NANO_BANANA_WEBHOOK',
    NANO_BANANA_2_WEBHOOK: 'PLACEHOLDER_NANO_BANANA_2_WEBHOOK',
    NANO_BANANA_PRO_WEBHOOK: 'PLACEHOLDER_NANO_BANANA_PRO_WEBHOOK',
    N8N_ENHANCE_OR_REMBG_WEBHOOK_URL: 'PLACEHOLDER_N8N_ENHANCE_WEBHOOK_URL',
    HISTORY_WEBHOOK_URL: 'PLACEHOLDER_HISTORY_WEBHOOK_URL',
    Z_IMAGE_WEBHOOK_URL: 'PLACEHOLDER_Z_IMAGE_WEBHOOK_URL',
    QWEN_IMAGE_WEBHOOK_URL: 'PLACEHOLDER_QWEN_IMAGE_WEBHOOK_URL',
    SUNO_AUDIO_FROM_TEXT_WEBHOOK_URL: 'PLACEHOLDER_SUNO_AUDIO_FROM_TEXT_WEBHOOK_URL',
    SUNO_AUDIO_FROM_IMAGE_WEBHOOK_URL: 'PLACEHOLDER_SUNO_AUDIO_FROM_IMAGE_WEBHOOK_URL',


    // App Settings
    TIMEOUT: 120000,
    LANGUAGES: ['en', 'ru', 'es', 'fr', 'de', 'zh', 'pt', 'ar', 'hi', 'ja', 'it', 'ko', 'tr', 'pl', 'vi', 'th'],
    DEFAULT_LANGUAGE: 'en',
    DEFAULT_THEME: 'dark',
    MAX_IMAGE_MB: 10,
    DEV_MODE: false,

    // Technical Settings
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    PREVIEW_MAX_W: 1024,
    PREVIEW_MAX_H: 1024,
    PREVIEW_JPEG_QUALITY: 0.9,

    // UI/UX Settings

    MAINTENANCE_MODE: false // Keep hardcoded for safety
};
// 🚀 Экспорт CONFIG для доступа из других модулей (ai-coach.js)
window.CONFIG = CONFIG;

// 🔥 АВТОМАТИЧЕСКОЕ СОХРАНЕНИЕ MAINTENANCE_MODE В LOCALSTORAGE ДЛЯ ДОСТУПА ИЗ ДРУГИХ СТРАНИЦ
try {
    localStorage.setItem('pixplace_maintenance_mode', CONFIG.MAINTENANCE_MODE ? 'true' : 'false');
    if (window.DEBUG_MODE === 'full') console.log('💾 Maintenance mode saved to localStorage:', CONFIG.MAINTENANCE_MODE);
} catch (error) {
    console.warn('❌ Could not save maintenance mode to localStorage:', error);
}

// 🎯 Global state - теперь используем AppStateManager из модуля store/app-state.js
const appState = new AppStateManager();

// Экспортируем appState в window для доступа из параллельной генерации
window.appState = appState;

// 🔥 ДОБАВЛЕНИЕ: Инициализация дефолтных значений в localStorage при первом запуске
appState.initializeDefaults();

// 🔥 ПЕРЕНОСИМ loadSettings ПОЗЖЕ: загружаем настройки ПЕРЕД ПОКАЗОМ UI
appState.loadSettings();



// 🔥 ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ ЯЗЫКА И ПЕРЕВОДОВ (будет вызвана синхронно до показа UI)
async function initBaseLanguageAndTranslations() {
    try {
        if (window.DEBUG_MODE === 'full') console.log('🚀 Starting app initialization with centralized language detection...');

        // 🔥 ЦЕНТРАЛИЗОВАННЫЙ МЕТОД: ОПРЕДЕЛЯЕМ И УСТАНАВЛИВАЕМ БАЗОВЫЙ ЯЗЫК ОДИН РАЗ
        const baseLanguage = await dictionaryManager.determineAndSetBaseLanguage();

        if (window.DEBUG_MODE === 'full') console.log('✅ Base translations initialized centrally for language:', baseLanguage);

        // 🔥 ОБНОВИТЬ ПЕРЕВОДЫ НЕМЕДЛЕННО после установки языка
        dictionaryManager.updateTranslations();

        // 🔥 ОПТИМИЗАЦИЯ: Показываем контент ТОЛЬКО после применения переводов
        requestAnimationFrame(() => {
            document.body.classList.add('ready');
            // 🎬 ONBOARDING: Signal that app UI is fully ready
            document.dispatchEvent(new CustomEvent('app:ready'));
            console.log('✨ UI Revealed (FOUC prevented)');
        });

    } catch (error) {
        console.error('❌ Failed to initialize base translations centrally:', error);
        // В крайнем случае - хотя бы English и показываем UI
        try {
            await dictionaryManager.setLanguage('en');
            dictionaryManager.updateTranslations();
            document.body.classList.add('ready');
            document.dispatchEvent(new CustomEvent('app:ready'));
        } catch (fallbackError) {
            console.error('❌ Even fallback language failed:', fallbackError);
            document.body.classList.add('ready');
            document.dispatchEvent(new CustomEvent('app:ready'));
        }
    }
}

// ⚡ Ultra-Fast Global Image Loading Manager - Max Performance
class GlobalHistoryLoader {
    constructor() {
        // Singleton pattern - only one Observer per app
        if (GlobalHistoryLoader.instance) {
            return GlobalHistoryLoader.instance;
        }

        this.observedImages = new Map(); // key: element, value: true (if observing)
        this.loadingQueue = new Set();
        this.pendingQueue = [];
        this.logout = false;

        // 🚀 OPTIMIZATION: Increased concurrency for modern browsers
        // Was 2, now 4-6 depending on connection (simplified to 6 for speed)
        this.maxConcurrent = 6;

        // Новое: конфигурация для eager loading маленьких списков
        this.eagerLoadingLimit = 50; // для списков до 50 изображений - eager loading

        // 🚀 OPTIMIZATION: Much larger rootMargin to preload earlier
        // Was '50px', now '250px' (about 1-2 viewport heights ahead)
        const options = {
            root: null,
            rootMargin: '250px 0px',
            threshold: 0.01 // Trigger as soon as 1% is visible (or close to)
        };

        this.imageObserver = new IntersectionObserver(this.handleIntersection.bind(this), options);

        GlobalHistoryLoader.instance = this;
        console.log('🚀 GlobalHistoryLoader initialized with logic for eager loading (concurrent: 6, margin: 250px)');
    }

    handleIntersection(entries) {
        if (this.logout) return;

        // Sort entries by visibility to prioritize what user is actually looking at
        entries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const visibleEntries = [];

        for (const entry of entries) {
            if (entry.isIntersecting) {
                visibleEntries.push(entry);
            }
        }

        if (visibleEntries.length > 0) {
            // 🚀 OPTIMIZATION: No delay for visible images!
            this.processVisibleImages(visibleEntries);
        }

        // Cleanup invisible entries after a delay
        setTimeout(() => {
            const invisible = entries.filter(e => !e.isIntersecting);
            if (invisible.length > 0) this.cleanupInvisibleImages(invisible);
        }, 1000);
    }

    processVisibleImages(entries) {
        // console.log(`👁️ Processing ${entries.length} visible images`);

        for (const entry of entries) {
            const img = entry.target;

            // Fast check
            if (!this.observedImages.has(img)) continue;

            // Skip if already loaded (safety check)
            if (img.classList.contains('loaded') || (img.src && !img.dataset.src)) {
                this.safeUnobserve(img);
                continue;
            }

            // Load immediately if slot available
            if (img.dataset.src && !this.loadingQueue.has(img)) {
                this.startLoading(img);
            }
        }
    }

    startLoading(img, priority = false) {
        const container = img.closest('.history-mini');

        // Skip if container is broken or already loading
        if (!container || container.classList.contains('history-loading')) {
            return;
        }

        // 🚀 OPTIMIZATION: If priority (eager) load, bypass concurrency limit
        if (!priority && this.loadingQueue.size >= this.maxConcurrent) {
            this.pendingQueue.push(img);
            return;
        }

        this.loadingQueue.add(img);

        // Set src with error handling
        const loadPromise = new Promise((resolve, reject) => {
            img.onload = () => {
                img.classList.add('loaded');
                delete img.dataset.src; // clear data-src
                // console.log('✅ Image loaded successfully');
                resolve();
            };

            img.onerror = () => {
                console.warn('❌ Image load failed - showing placeholder');
                const placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMvb3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+LmV4cGlyZWQtdGV4dHtiYTpnZW5lcmFsIFNhbnMsQXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWY7Zm9udC1zaXplOiAxNHB4O2ZpbGw6ICM5OTk5OTk7fTwvc3R5bGU+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y0ZjRmNCIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZHk9Ii4zNWVtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBjbGFzcz0iZXhwaXJlZC10ZXh0IiBzdHlsZT0iYXVjLWFncmlkLXJvd3M6IHNwYW4gMS8yOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlOyBvcGFjaXR5OiAwLjg7Ij5FeHBpcmVkPC90ZXh0PiAKPC9zdmc+';
                img.src = placeholder;
                resolve();
            };

            // Start loading
            img.src = img.dataset.src;
        });

        loadPromise.finally(() => {
            this.loadingQueue.delete(img);
            this.safeUnobserve(img);

            // Process next in queue if slot available
            if (this.pendingQueue.length > 0 && this.loadingQueue.size < this.maxConcurrent) {
                const nextImg = this.pendingQueue.shift();
                this.startLoading(nextImg);
            }
        });
    }

    cleanupInvisibleImages(entries) {
        for (const entry of entries) {
            const img = entry.target;

            // Оставляем наблюдаемыми если изображение еще не загрузилось
            if (img.dataset.src && !img.src) {
                continue;
            }

            // Оставляем наблюдаемыми если они в очереди загрузки
            if (this.loadingQueue.has(img)) {
                continue;
            }

            // Безопасное отключение наблюдения
            this.safeUnobserve(img);
        }
    }

    // 🔧 ДОБАВЛЕНИЕ: Метод для eager загрузки изображений на первой странице
    loadEagerForElement(element) {
        if (!element) return;

        const img = element.querySelector('img[data-src]');
        if (!img || !img.dataset.src) return;

        // Немедленная загрузка без IntersectionObserver
        this.startLoading(img);

        console.log(`⚡ Eager loaded image: ${img.dataset.src}`);
    }

    // 🆕 ADDITION: Force load all visible history previews
    forceLoadVisibleHistoryPreviews() {
        const historyList = document.getElementById('historyList');
        if (!historyList || historyList.classList.contains('hidden')) {
            // console.log('📋 History hidden, skipping force load');
            return;
        }

        // Find all img[data-src] in visible history items
        const visibleImages = historyList.querySelectorAll('.history-mini img[data-src]');
        if (visibleImages.length === 0) {
            return;
        }

        console.log(`🎯 Force loading ${visibleImages.length} history previews (EAGER)`);

        // Load all iteratively with priority
        visibleImages.forEach(img => {
            if (img.dataset.src && !img.src) {
                // 🚀 OPTIMIZATION: Pass 'true' for priority to bypass concurrency limits
                this.startLoading(img, true);
            }
        });
    }

    observe(img) {
        if (!img || img.nodeType !== 1) return; // проверка что элемент существует

        // Быстрая проверка через Map
        if (this.observedImages.has(img)) return;

        this.imageObserver.observe(img);
        this.observedImages.set(img, true);

        console.log(`👁️ Started observing image: ${img.src || img.dataset.src}`);
    }

    safeUnobserve(img) {
        if (!img || !this.observedImages.has(img)) return;

        try {
            this.imageObserver.unobserve(img);
            this.observedImages.delete(img);
        } catch (error) {
            console.warn('Failed to unobserve image:', error);
        }
    }

    // 🔧 ДОБАВЛЕНИЕ: Оптимизированная массовая очистка с улучшенной проверкой
    massCleanup() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;

        const currentImages = historyList.querySelectorAll('.history-mini img');
        const validImageSet = new WeakSet(Array.from(currentImages));

        let cleanupCount = 0;
        let maxObserversExceeded = 0;

        // 🔧 ИСПРАВЛЕНИЕ: Ограничение количества активных наблюдателей для производительности
        const MAX_ACTIVE_OBSERVERS = 40; // увеличено до 40 для больших страниц

        // Проходим по всем наблюдаемым элементам
        for (const [img] of this.observedImages) {
            // Удаляем если элемент больше не существует или не в истории
            if (!img || !img.isConnected || !validImageSet.has(img)) {
                this.safeUnobserve(img);
                cleanupCount++;
            } else if (this.observedImages.size > MAX_ACTIVE_OBSERVERS && !img.dataset.src) {
                // 🔧 ИСПРАВЛЕНИЕ: Уменьшаем количество активных наблюдателей для производительности (только загруженные)
                this.safeUnobserve(img);
                maxObserversExceeded++;
            }
        }

        // Очищаем очередь загрузки от несуществующих элементов
        for (const img of this.loadingQueue) {
            if (!img || !img.isConnected) {
                this.loadingQueue.delete(img);
                cleanupCount++;
            }
        }

        if (cleanupCount > 0 || maxObserversExceeded > 0) {
            console.log(`🧹 Enhanced Mass cleanup: ${cleanupCount} elements removed, ${maxObserversExceeded} observers trimmed (max: ${MAX_ACTIVE_OBSERVERS})`);
        }
    }

    // 🔧 ДОБАВЛЕНИЕ: Метод для полного уничтожения и очистки всех ресурсов
    destroy() {
        // Отключаем IntersectionObserver
        if (this.imageObserver) {
            this.imageObserver.disconnect();
            console.log('🎯 IntersectionObserver disconnected');
        }

        // Очищаем все наблюдаемые изображения
        for (const [img] of this.observedImages) {
            this.safeUnobserve(img);
        }

        this.observedImages.clear();
        this.loadingQueue.clear();
        this.pendingQueue = [];
        this.logout = true;

        console.log('🧹 GlobalHistoryLoader fully destroyed');
    }
}

// Global instance
const globalHistoryLoader = new GlobalHistoryLoader();

// ⚡ Smart History Management with Virtualization
class HistoryManager {
    static PAGE_SIZE = 20; // количество элементов на страницу
    static CACHE_SIZE = 100; // размер кэша DOM элементов

    // Кэш DOM элементов для переиспользования
    static elementCache = new Map();
    static currentPage = 0;
    static maxLoadedPage = 0;
    static isLoadingPage = false;

    static getVisibleItems(limit = 15) {
        // Фильтруем только элементы с валидными результатами (исключаем undefined/null)
        const historyData = appState?.externalHistory || appState?.generationHistory || [];
        const validItems = historyData.filter(item =>
            item.result &&
            typeof item.result === 'string' &&
            item.result.trim() !== '' &&
            item.result !== 'undefined'
        );

        return validItems.slice(0, limit);
    }

    static getValidItemsOnly() {
        const historyData = appState?.externalHistory || appState?.generationHistory || [];
        return historyData.filter(item =>
            item.result &&
            typeof item.result === 'string' &&
            item.result.trim() !== '' &&
            item.result !== 'undefined'
        );
    }

    static getItemsForPage(page) {
        const validItems = this.getValidItemsOnly();
        const start = page * this.PAGE_SIZE;
        const end = start + this.PAGE_SIZE;
        return validItems.slice(start, end);
    }

    static getTotalPages() {
        const validCount = this.getValidItemsOnly().length;
        return Math.ceil(validCount / this.PAGE_SIZE);
    }

    static hasMorePages(page) {
        return page < this.getTotalPages() - 1;
    }

    // 🔧 ДОБАВЛЕНИЕ: функция для проверки, есть ли еще элементы после текущей страницы для показа кнопки
    static hasMoreItemsAfter(page, itemsPerPage, validItems) {
        const currentEndIndex = (page + 1) * itemsPerPage; // индекс конца текущей страницы (например page=0, itemsPerPage=6 -> индекс 6)
        return currentEndIndex < validItems.length; // проверяем есть ли элементы дальше
    }

    static getTotalCount() {
        const historyData = appState?.externalHistory || appState?.generationHistory || [];
        return historyData.length;
    }

    static needsShowMore(limit = 15) {
        const validCount = this.getValidItemsOnly().length;
        return validCount > limit;
    }

    static getValidTotalCount() {
        return this.getValidItemsOnly().length;
    }

    // Метод для создания/получения кэшированного DOM элемента с защитой от утечек
    static createHistoryItemElement(item, forceNoCache = false) {
        // 🔧 ИСПРАВЛЕНИЕ: Упрощенная генерация cacheKey для избежания лишних промахов кеша
        // Используем только основные данные: ID и результат (без лишних параметров)
        const cacheKey = `hist_${item.id}_${item.result || 'no-result'}`;

        // Убираем спам логирования - логируем только в 1% случаев для отладки
        if (Math.random() < 0.01) {
            console.log(`🔑 Generated cacheKey: ${cacheKey} for item ${item.id}`);
        }

        // Сначала проверяем кэш (если кэширование не отключено)
        if (!forceNoCache && this.elementCache.has(cacheKey)) {
            // Убираем спам в консоль - логируем только в 1% случаев
            if (Math.random() < 0.01) {
                console.log(`✅ Cache hit for item ${item.id}`);
            }
            // 🔥 FIX: cloneNode(true) does NOT copy onclick/addEventListener handlers.
            // Re-attach the click handler on every cache hit to prevent "stale-state" bug
            // where history cards stop being clickable after new images are generated.
            const cloned = this.elementCache.get(cacheKey).cloneNode(true);
            cloned.onclick = () => viewHistoryItem(item.id);
            return cloned;
        }

        // Убираем спам логирования - только в 5% случаев для отслеживания промахов
        if (Math.random() < 0.05) {
            console.log(`📦 Cache miss for item ${item.id}, creating new element`);
        }

        // Создаем новый элемент
        const element = this.createHistoryItemElementFromScratch(item);

        // Добавляем в кэш если статус финальный (success/error) и кэширование не отключено
        if (!forceNoCache && (item.status === 'success' || item.status === 'error')) {
            // 🔧 ИСПРАВЛЕНИЕ: Автоматическая очистка при 80% заполнения (раньше было > CACHE_SIZE)
            if (this.elementCache.size >= Math.floor(this.CACHE_SIZE * 0.8)) {
                this.autoCleanupCache();
            }

            this.elementCache.set(cacheKey, element.cloneNode(true));

            // 🔧 ИСПРАВЛЕНИЕ: Очищаем уже существующие кэшированные элементы чтобы избежать переполнения
            if (this.elementCache.size > this.CACHE_SIZE) {
                this.forceCleanupOldElements(5); // очищаем 5 самых старых элементов
            }

            console.log(`💾 Cached element for ${cacheKey}, cache size: ${this.elementCache.size}/${this.CACHE_SIZE}`);
        }

        return element;
    }

    // 🔧 ДОБАВЛЕНИЕ: Автоматическая очистка кэша элементов по LRU принципу
    static autoCleanupCache() {
        const currentSize = this.elementCache.size;
        if (currentSize < Math.floor(this.CACHE_SIZE * 0.7)) return; // не очищаем если меньше 70%

        const keysToRemove = Math.floor(currentSize * 0.2); // очищаем 20% самых старых
        this.forceCleanupOldElements(keysToRemove);

        console.log(`🧹 Auto-cleaned history cache: ${currentSize} → ${this.elementCache.size}`);
    }

    // 🔧 ДОБАВЛЕНИЕ: Принудительная очистка старых элементов кэша
    static forceCleanupOldElements(count = 1) {
        const keys = Array.from(this.elementCache.keys());
        for (let i = 0; i < Math.min(count, keys.length); i++) {
            this.elementCache.delete(keys[i]);
        }
    }

    static createHistoryItemElementFromScratch(item) {
        const element = document.createElement('div');
        element.className = 'history-mini';
        element.id = `history-${item.id}`;
        element.onclick = () => viewHistoryItem(item.id);

        element.innerHTML = `
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIj48L3JlY3Q+PC9zdmc+"
                 data-src="${item.result || ''}"
                 alt="Generated"
                 class="lazy-loading"
                 loading="lazy"
                 decoding="async"
                 ${item.result ? '' : 'style="opacity: 0.7;"'}
                 />
            <p class="history-caption">${new Date(item.timestamp).toLocaleDateString()} | ${appState.translate('style_' + item.style)} | ${appState.translate('mode_' + item.mode)}</p>
        `;

        return element;
    }

    // Метод для очистки кэша
    static clearCache() {
        this.elementCache.clear();
        this.currentPage = 0;
        this.maxLoadedPage = 0;
        this.isLoadingPage = false;
        console.log('🧹 History cache cleared');
    }
}



// 🎯 Utility Functions
// showToast функция теперь импортируется из screen-manager.js

// Экспортируем другие функции для параллельной генерации
// window.showResult убираем - теперь используем только showResultToast и displayFullResult
window.showResultToast = showResultToast;
window.sendToWebhook = sendToWebhook;

// Показ результатов через ScreenManager

// Удаляем дубликаты функций, которые теперь в history-manager.js

// Проверяем импортированные функции на доступность
console.log('🔧 Checking imported functions availability:');
console.log('- showWarningAboutNoImage:', typeof showWarningAboutNoImage);
console.log('- showScreen, showApp, showResult, displayFullResult:', typeof showScreen, typeof showApp, typeof showResult, typeof displayFullResult);
console.log('- updateUserNameDisplay, updateUserBalanceDisplay:', typeof updateUserNameDisplay, typeof updateUserBalanceDisplay);
console.log('- readFileAsDataURL, maybeCompressImage:', typeof readFileAsDataURL, typeof maybeCompressImage);
console.log('- updateHistoryItemWithImage:', typeof updateHistoryItemWithImage);
console.log('- createLoadingHistoryItem:', typeof createLoadingHistoryItem);
console.log('- viewHistoryItem:', typeof viewHistoryItem);

// 🔥 ИНИЦИАЛИЗАЦИЯ ТЕКСТА КНОПКИ ИСТОРИИ
setTimeout(() => {
    const historyBtn = document.getElementById('historyToggleBtn');
    if (historyBtn && appState && appState.translate) {
        // 🔥 FIX: Update only the text span, preserving icons!
        const textSpan = historyBtn.querySelector('[data-i18n="history_toggle"]');
        if (textSpan) {
            textSpan.textContent = appState.translate('history_toggle');
            console.log('✅ History button text updated safely:', textSpan.textContent);
        }
    }
}, 100);

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


// 📊 Processing Animation
function updateProgressBar(elapsed) {
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');

    if (progressBar && progressFill) {
        // Примерный прогресс на основе времени (0-100%)
        const maxTime = 60; // максимальное ожидаемое время в секундах
        const progress = Math.min((elapsed / maxTime) * 100, 100);
        progressFill.style.width = progress + '%';
    }

    // Обновить круговой прогресс, если есть
    const progressCircle = document.querySelector('.progress-circle');
    if (progressCircle) {
        const circumference = 283; // окружность круга
        const progress = Math.min((elapsed / 60) * 100, 100);
        const offset = circumference - (progress / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
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
        updateProgressBar(elapsed);
        // Update steps based on time

    }, 1000);
}

function stopTimer() {
    if (appState.timerInterval) {
        clearInterval(appState.timerInterval);
        appState.timerInterval = null;
    }
}

// 📋 History Management moved to history-manager.js

// And all history-related functions moved to history-manager.js module

// 🖼️ UI Initialization
// 🎬 Screen Management with cleanup
let carouselCleanup = null;

// Cleanup function for memory leaks
function cleanupMemoryLeaks() {
    // Disconnect Global History Loader
    if (globalHistoryLoader) {
        globalHistoryLoader.destroy();
    }

    // Clear any pending timers
    if (appState.timerInterval) {
        clearInterval(appState.timerInterval);
        appState.timerInterval = null;
    }

    // Remove carousel event listeners
    if (carouselCleanup) {
        carouselCleanup();
        carouselCleanup = null;
    }

    console.log('🧹 Memory leaks cleaned up successfully - including global history loader');
}

// Call cleanup on page unload
window.addEventListener('beforeunload', cleanupMemoryLeaks);

/* Фунция showApp была вынесена в screen-manager.js */





// ⚡ ТОСТ-НОТИФИКАЦИИ ДЛЯ НОВЫХ РЕЗУЛЬТАТОВ (БЕЗ ПРЕРЫВАНИЯ ПОЛНОГО ПРОСМОТРА)
let pendingResults = []; // Ожидающие результаты для показа в тостах

// 🔥 ЭКСПОРТ КРИТИЧЕСКОЙ ФУНКЦИИ onUserImageChange ДЛЯ ДОСТУПА ИЗ ДРУГИХ МОДУЛЕЙ
window.onUserImageChange = onUserImageChange;

console.log('✅ onUserImageChange exported to global window scope');

// Импорт функции загрузки strength slider из модуля


// 🔥 ЭКСПОРТ createPreviewItem ДЛЯ ДОСТУПА ИЗ user-account.js
window.createPreviewItem = createPreviewItem;

console.log('✅ createPreviewItem exported to global window scope');

// 🔥 LAZY LOAD AI COACH
// Initialize AI Coach features
async function loadAndInitAICoach() {
    try {
        console.log('🤖 Lazy loading AI Coach...');
        const aiCoachModule = await import('./gpt-chat.js');

        // Initialize buttons
        aiCoachModule.createCoachButton();
        aiCoachModule.createChatButton();

        // Init logic
        setTimeout(() => {
            aiCoachModule.initAICoach();
        }, 1000); // Small delay to prioritize main UI

        console.log('✅ AI Coach loaded dynamically');
    } catch (e) {
        console.error('❌ Failed to lazy load AI Coach:', e);
    }
}

// Delayed init for AI Coach to prioritize main UI
if (document.readyState === 'complete') {
    setTimeout(loadAndInitAICoach, 2000);
} else {
    window.addEventListener('load', () => setTimeout(loadAndInitAICoach, 2000));
}


function showGeneration() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });

    const gen = document.getElementById('generationScreen');
    if (!gen) {
        console.warn('generationScreen не найден');
        return;
    }

    gen.classList.remove('hidden');
    gen.classList.add('active');

    showBackButton(false);

    // 🔥 LAZY LOAD: Ensure generationManager is loaded before use
    // We don't block the UI showing, but we prepare the module
    import('./parallel-generation.js').catch(err => console.error('Failed to preload generation module:', err));
}


// 🎨 UI Initialization with Lazy Loading
async function initializeUI() {
    // Character counter for prompt
    const promptInput = document.getElementById('promptInput');
    const charCounter = document.getElementById('charCounter');

    if (promptInput && charCounter) {
        promptInput.addEventListener('input', function () {
            charCounter.textContent = this.value.length;

            // Auto-resize
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }

    // Character counter for negative prompt
    const negativePromptInput = document.getElementById('negativePromptInput');
    const negativeCharCounter = document.getElementById('negativeCharCounter');

    if (negativePromptInput && negativeCharCounter) {
        negativePromptInput.addEventListener('input', function () {
            negativeCharCounter.textContent = this.value.length;

            // Auto-resize (smaller maximum for negative prompt)
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px'; // Max 120px height
        });
    }

    // Form submission — guard against duplicate listeners on re-init
    const form = document.querySelector('.generation-form');
    if (form && !form.dataset.submitListenerAttached) {
        form.dataset.submitListenerAttached = 'true';
        form.addEventListener('submit', generateImage);
        console.log('✅ Generation form submit listener attached');
    } else if (form) {
        console.warn('⚠️ Generation form submit listener already attached — skipping duplicate registration');
    }

    // 🎯 LAZY LOAD: Initialize Mode Cards Component and Cost Badge
    try {
        console.log('🎯 Lazy loading Mode Cards component...');
        const modeCardsModule = await import('./mode-cards.js');
        modeCardsExports = modeCardsModule; // Сохраняем ссылку на модуль
        const { initOnDemand } = modeCardsModule;
        initOnDemand();
        console.log('✅ Mode Cards component loaded and initialized');

        // 🎯 LAZY LOAD: Initialize Cost Badge Module
        console.log('💰 Lazy loading Cost Badge module...');
        const costBadgeModule = await import('./cost-badge.js');
        await costBadgeModule.initCostBadge({
            modeCardsModule: { getSelectedMode: modeCardsExports.getSelectedMode },
            userImageState: userImageState
        });
        console.log('✅ Cost Badge module loaded and initialized');

        // Removed legacy style management (now using style chips in index.html)


        // 🎯 LAZY LOAD: Initialize Style Manager (NEW MODULAR APPROACH)
        console.log('🎨 Style Manager will initialize lazily on style checkbox interaction');
        // initStyleCarousel(); // REMOVED - handled by style-manager.js now

    } catch (error) {
        console.error('❌ Failed to load Mode Cards or Cost Badge components:', error);
    }

    // 🚀 Initialize user account and update mode selection
    if (initUserAccount) {
        initUserAccount();
        console.log('✅ User account initialized via direct import');
    } else if (window.initUserAccount) {
        window.initUserAccount();
    }

    // 🔐 Сессия уже восстановлена синхронно ДО вызова initializeUI (см. после services init).
    // Обновляем UI после готовности DOM
    setTimeout(() => {
        if (window.updateUserMenuInfo) {
            window.updateUserMenuInfo();
        }
    }, 150);

    // 🚀 Initialize language dropdown
    if (initLazyLanguageDropdown) {
        initLazyLanguageDropdown();
        console.log('✅ Language dropdown initialized via direct import');
    }

    // 🚀 Initialize tabs from navigation-manager.js
    import('./navigation-manager.js').then(module => {
        if (module.initTabs) {
            module.initTabs();
            console.log('✅ Tabs initialized from navigation-manager.js');
        }
    });

    // 🔧 Обновление функции updateModeSelection из navigation-manager после инициализации UI
    if (modeCardsExports && modeCardsExports.getSelectedMode) {
        try {
            const currentMode = modeCardsExports.getSelectedMode();
            if (currentMode && window.updateModeSelection) {
                window.updateModeSelection(currentMode);
                console.log('✅ updateModeSelection called with current mode:', currentMode);
            }
        } catch (error) {
            console.error('❌ Failed to get current mode for updateModeSelection:', error);
        }
    }

    // Update style visibility and prompt when images change
    document.addEventListener('images:updated', async () => {
        const currentMode = await getCurrentSelectedMode();
        if (window.updateStyleVisibilityForMode) {
            window.updateStyleVisibilityForMode(currentMode);
        }
        await updatePromptVisibility();
    });

    console.log('✅ UI initialized with lazy loading');
}



// ===== Пользовательское изображение: состояние =====
const userImageState = {
    images: [] // массив объектов {id, file, dataUrl, uploadedUrl} - до 4 изображений
};

// 🔥 ЭКСПОРТ СОСТОЯНИЯ ДЛЯ ДОСТУПА ИЗ ДРУГИХ МОДУЛЕЙ
window.userImageState = userImageState;
console.log('✅ userImageState exported to window scope');

// ===== Функции проверки лимитов изображений =====
function getImageLimitForMode(mode) {
    switch (mode) {
        case 'nano_banana':
        case 'nano_banana_2':
        case 'nano_banana_pro':
            return 4; // Nano Banana models allow up to 4 images
        case 'fast_generation':
        case 'qwen_image':
            return 0; // No image uploads allowed
        case 'z_image':
        case 'qwen_image_edit':
        case 'background_removal':
        case 'upscale_image':
        case 'pixplace_pro':
        case 'print_maker':
        case 'dreamshaper_xl':
            return 1; // Exactly 1 image
        default:
            return 1; // All other modes — max 1 image
    }
}

function canUploadMoreImages(mode, currentCount) {
    const limit = getImageLimitForMode(mode);
    return currentCount < limit;
}

/**
 * Trimming excess images when switching to a mode with a smaller limit.
 * @param {string} newMode
 */
function trimImagesForMode(newMode) {
    const limit = getImageLimitForMode(newMode);
    const excess = userImageState.images.length - limit;
    if (excess <= 0) return;

    // Remove excess images from the end
    const idsToRemove = userImageState.images.slice(limit).map(img => img.id);
    idsToRemove.forEach(id => {
        // Remove from state
        const idx = userImageState.images.findIndex(img => img.id === id);
        if (idx !== -1) userImageState.images.splice(idx, 1);
        // Remove preview element
        const el = document.querySelector(`[data-image-id="${id}"]`);
        if (el) el.remove();
    });

    if (idsToRemove.length > 0) {
        console.log(`✂️ Trimmed ${idsToRemove.length} images for mode: ${newMode} (limit: ${limit})`);
        document.dispatchEvent(new CustomEvent('images:updated', {
            detail: { imageCount: userImageState.images.length }
        }));
    }
}


// 🔥 FIX: Missing clearUserImage function — critical for Edit mode delete-image-restore-upload
function clearUserImage() {
    console.log('🗑️ clearUserImage: Removing all user images');

    // Clear state
    userImageState.images = [];

    // Clear file input
    const input = document.getElementById('userImage');
    if (input) input.value = '';

    // Clear preview
    const preview = document.getElementById('userImagePreview');
    if (preview) {
        preview.innerHTML = '';
        preview.classList.add('hidden');
    }

    // Clear previews container
    const previewContainer = document.getElementById('previewContainer');
    if (previewContainer) {
        previewContainer.innerHTML = '';
        previewContainer.classList.add('hidden');
    }

    // Show upload container again
    const urlContainer = document.getElementById('urlInputContainer');
    if (urlContainer) {
        urlContainer.classList.remove('hidden');
        urlContainer.style.display = '';
    }

    // Clear batch filename preview
    const fileName = document.querySelector('.file-name-preview');
    if (fileName) fileName.remove();

    // Update visibility
    updateImageUploadVisibility();

    // Notify other modules
    document.dispatchEvent(new CustomEvent('images:updated', {
        detail: { imageCount: 0 }
    }));

    // Ensure edit mode properly reverts to its own local dropzone
    const currentTab = window._currentGenerationTab || (window.appState && window.appState.activeMode) || 'image';
    if (currentTab === 'edit') {
        if (typeof window.clearEditImage === 'function') {
            window.clearEditImage(true);
        }
    }

    console.log('✅ clearUserImage: Upload field restored');
}

// Expose globally for edit mode
window.clearUserImage = clearUserImage;

// ===== Глобальная функция для обновления видимости UI загрузки изображений =====
// 🔥 EXPORT TO WINDOW FOR MODALS
window.updateImageUploadVisibility = function () {
    return updateImageUploadVisibility();
};

function updateImageUploadVisibility() {
    const urlContainer = document.getElementById('urlInputContainer');
    const preview = document.getElementById('userImagePreview');
    const previewContainer = document.getElementById('previewContainer');
    const imageCount = userImageState.images.length;
    const hasImages = imageCount > 0;

    // Removed early return for edit mode, we still want inline button logic to work

    const modeSelect = document.getElementById('modeSelect');
    let shouldShowUploadButton, shouldShowPreview;

    if (modeSelect) {
        const currentMode = modeSelect.value;
        const isProcessMode = ['background_removal', 'upscale_image'].includes(currentMode);
        let limit = 1;
        if (typeof getImageLimitForMode === 'function') {
            limit = getImageLimitForMode(currentMode);
        }

        // Batch Upload Button Logic
        const batchBtn = document.getElementById('batchUploadBtn');
        if (batchBtn) {
            // 🔥 Only show batch button in 'image' tab, not in 'edit' or others
            if (isProcessMode && window._currentGenerationTab === 'image') {
                batchBtn.classList.remove('hidden');
                batchBtn.style.setProperty('display', 'inline-flex', 'important');
            } else {
                batchBtn.classList.add('hidden');
                batchBtn.style.setProperty('display', 'none', 'important');
            }
        }

        // Logic for Main Upload Button
        let canUploadMore = imageCount < limit;
        shouldShowUploadButton = canUploadMore && (currentMode !== 'fast_generation');

        if (currentMode === 'fast_generation') {
            shouldShowPreview = false;
            if (hasImages) {
                console.log(`🗑️ Removing images in ${currentMode}`);
                clearAllImages();
            }
        } else {
            // Show preview if we have images
            shouldShowPreview = hasImages;

            // Inline Add Button Logic
            let addBtn = document.getElementById('inlineAddImageBtn');

            // If we serve multiple images (nano_banana), we want the inline button
            // Logic: Show if we have at least 1 image AND count < limit
            if (hasImages && canUploadMore) {
                if (!addBtn) {
                    // Create the button
                    const btn = document.createElement('div');
                    btn.id = 'inlineAddImageBtn';
                    // Tailwind styles to match preview item but with dashed border and distinct look
                    btn.className = 'preview-item relative inline-flex items-center justify-center m-1 border-2 border-dashed border-gray-400 dark:border-gray-500 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-15 h-15';
                    btn.title = 'Add another image';
                    btn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                     `;
                    btn.onclick = () => {
                        const input = document.getElementById('userImage');
                        if (input) input.click();
                    };

                    // Append to container
                    if (previewContainer) {
                        previewContainer.appendChild(btn);
                    }
                } else {
                    // Ensure it's visible and at the end
                    // If it's not the last child, move it to the end
                    if (previewContainer.lastElementChild !== addBtn) {
                        previewContainer.appendChild(addBtn);
                    }
                    addBtn.style.setProperty('display', 'inline-flex', 'important');
                    addBtn.classList.remove('hidden');
                }
            } else {
                // Hide if limit reached or no images (main button handles 0 case)
                if (addBtn) {
                    addBtn.style.setProperty('display', 'none', 'important');
                    addBtn.classList.add('hidden');
                }
            }
        }
    } else {
        // Fallback if no modeSelect
        shouldShowUploadButton = !hasImages;
        shouldShowPreview = hasImages;
    }

    if (urlContainer) {
        if (window._currentGenerationTab === 'edit') {
            urlContainer.style.setProperty('display', 'none', 'important');
            urlContainer.classList.add('flux-shnel-hidden', 'hidden');
        } else if (shouldShowUploadButton) {
            urlContainer.style.setProperty('display', 'block', 'important');
            urlContainer.classList.remove('flux-shnel-hidden', 'hidden');
        } else {
            urlContainer.style.setProperty('display', 'none', 'important');
            urlContainer.classList.add('flux-shnel-hidden', 'hidden');
        }
    }

    if (preview) {
        if (shouldShowPreview) {
            preview.classList.remove('flux-shnel-hidden', 'hidden');
            preview.style.setProperty('display', 'block', 'important');
            previewContainer.classList.remove('hidden');
            document.getElementById('userImageWrapper')?.classList.add('has-image');
        } else {
            preview.classList.add('hidden');
            preview.style.setProperty('display', 'none', 'important');
            document.getElementById('userImageWrapper')?.classList.remove('has-image');
        }
    }

    // Hide the small inner buttons if we have a main add button? 
    // Actually user might still want to swap an image?
    // The "inner-upload-btn" inside `createPreviewItem` was for swapping/uploading?
    // It seems it was "simple plus icon for upload" - maybe redundant now?
    // Let's keep existing logic for them or hide them if we have the big plus.
    updateInnerUploadButtonVisibility();
}

window.updateImageUploadVisibility = updateImageUploadVisibility;
window.updatePromptVisibility = updatePromptVisibility;
window.updateSizeSelectVisibility = updateSizeSelectVisibility;

// ===== Функция для обновления видимости поля промпта =====
async function updatePromptVisibility() {
    const promptFormGroup = document.getElementById('promptFormGroup');
    const promptInputWrapper = document.getElementById('promptTextareaWrapper');
    const promptDivider = document.getElementById('promptDivider');
    const negativePromptSection = document.getElementById('negativePromptSection');
    const chooseStyleSection = document.getElementById('chooseStyleSection');

    if (!promptFormGroup) {
        console.warn('❌ Элемент promptFormGroup не найден');
        return;
    }

    const currentMode = await getCurrentSelectedMode();

    // 🔧 ЛОГИКА: Скрываем все лишние поля для режимов обработки
    const isProcessMode = ['background_removal', 'upscale_image'].includes(currentMode);

    // Note: tabs are switched via style.display — use window._currentGenerationTab, not .tab-pane.active
    const activeTab = window._currentGenerationTab || 'image';
    const isSoundOrVideoTab = ['sound', 'video'].includes(activeTab);

    // ─── EDIT TAB: полностью пропускаем — UI управляется _showEditStep2 / clearEditImage в index.html ───
    if (activeTab === 'edit') {
        console.log('📝 Edit tab: prompt visibility managed by index.html, skipping');
        return;
    }

    // ─── SOUND TAB: скрываем size / resolution / negativePrompt / styleChips — они не нужны для звука ───
    if (activeTab === 'sound') {
        const sizeGroup = document.getElementById('sizeGroup');
        const resolutionGroup = document.getElementById('resolutionGroup');
        const negPromptSec = document.getElementById('negativePromptSection');
        const imageStylesSection = document.getElementById('imageStylesSection');
        const videoStylesSection = document.getElementById('videoStylesSection');
        if (sizeGroup) sizeGroup.style.setProperty('display', 'none', 'important');
        if (resolutionGroup) resolutionGroup.style.setProperty('display', 'none', 'important');
        if (negPromptSec) negPromptSec.style.setProperty('display', 'none', 'important');
        if (imageStylesSection) { imageStylesSection.style.setProperty('display', 'none', 'important'); imageStylesSection.classList.add('hidden'); }
        if (videoStylesSection) { videoStylesSection.style.setProperty('display', 'none', 'important'); videoStylesSection.classList.add('hidden'); }
        // Also hide image upload bar — not needed in sound tab
        const urlContainer = document.getElementById('urlInputContainer');
        if (urlContainer) urlContainer.style.setProperty('display', 'none', 'important');
        const preview = document.getElementById('userImagePreview');
        if (preview) { preview.style.setProperty('display', 'none', 'important'); preview.classList.add('hidden'); }
        console.log('📝 Sound tab: hiding size/resolution/negativePrompt/styleChips/upload');
        return;
    }

    if (isProcessMode) {
        // Скрываем текстовые поля, выбор стиля и разделитель
        if (promptInputWrapper) promptInputWrapper.classList.add('hidden');
        if (promptDivider) promptDivider.classList.add('hidden');
        if (negativePromptSection) negativePromptSection.classList.add('hidden');
        const imageStylesSection = document.getElementById('imageStylesSection');
        const videoStylesSection = document.getElementById('videoStylesSection');
        if (imageStylesSection) { imageStylesSection.style.setProperty('display', 'none', 'important'); imageStylesSection.classList.add('hidden'); }
        if (videoStylesSection) { videoStylesSection.style.setProperty('display', 'none', 'important'); videoStylesSection.classList.add('hidden'); }

        promptFormGroup.style.display = 'block';
        promptFormGroup.classList.remove('hidden');
        console.log(`📝 Processing mode: Prompt HIDDEN, card visible`);

    } else {
        // Обычный режим (image / video)
        if (promptInputWrapper) promptInputWrapper.classList.remove('hidden');
        if (promptDivider) promptDivider.classList.remove('hidden');
        if (negativePromptSection) negativePromptSection.classList.remove('hidden');

        const imageStylesSection = document.getElementById('imageStylesSection');
        const videoStylesSection = document.getElementById('videoStylesSection');

        if (imageStylesSection) {
            if (activeTab === 'image') {
                imageStylesSection.style.setProperty('display', 'block', 'important');
                imageStylesSection.classList.remove('hidden');
            } else {
                imageStylesSection.style.setProperty('display', 'none', 'important');
                imageStylesSection.classList.add('hidden');
            }
        }

        if (videoStylesSection) {
            if (activeTab === 'video') {
                videoStylesSection.style.setProperty('display', 'block', 'important');
                videoStylesSection.classList.remove('hidden');
            } else {
                videoStylesSection.style.setProperty('display', 'none', 'important');
                videoStylesSection.classList.add('hidden');
            }
        }

        // NOTE: For the Edit tab, imageStylesSection show/hide is handled directly
        // by _showEditStep2() and clearEditImage() in index.html

        promptFormGroup.style.display = 'block';
        promptFormGroup.classList.remove('hidden');
        console.log(`📝 Normal mode: all prompt UI VISIBLE`);
    }

    // Обновляем видимость negative prompt (если не в режиме обработки)
    if (!isProcessMode) {
        await updateNegativePromptVisibility();
    }
}

// Обновляем видимость интерфейса при переключении таба
document.addEventListener('tab:changed', (e) => {
    const newTab = e?.detail?.tab || window._currentGenerationTab || 'image';

    // 🔥 Sync with appState
    if (window.appState && !window._isRestoring) {
        window.appState.activeMode = newTab;
    }

    // При переходе на Edit — скрываем системные секции, если изображение еще не загружено
    if (newTab === 'edit') {
        const promptSection = document.getElementById('promptFormGroup');
        const imageStylesSection = document.getElementById('imageStylesSection');
        const videoStylesSection = document.getElementById('videoStylesSection');

        const hasEditImage = window._editImageBlob || window._editImageUrl;

        // Скрываем промпт и стили изображений только если НЕТ загруженного изображения
        if (!hasEditImage) {
            if (promptSection) promptSection.style.display = 'none';
            if (imageStylesSection) {
                imageStylesSection.style.setProperty('display', 'none', 'important');
                imageStylesSection.classList.add('hidden');
            }
        }

        // Секцию видео-стилей в режиме Edit скрываем всегда
        if (videoStylesSection) {
            videoStylesSection.style.setProperty('display', 'none', 'important');
            videoStylesSection.classList.add('hidden');
        }
    }
    updatePromptVisibility();
    updateSizeSelectVisibility();
});

// ===== Функция для обновления видимости поля negative prompt =====
async function updateNegativePromptVisibility() {
    const negativePromptSection = document.getElementById('negativePromptSection');
    const negativePromptFormGroup = document.getElementById('negativePromptFormGroup');
    const negativePromptCheckbox = document.getElementById('negativePromptCheckbox');
    const negativePromptToggle = document.getElementById('negativePromptToggle');

    const currentMode = await getCurrentSelectedMode();

    // 🔧 ОБНОВЛЕННАЯ ЛОГИКА: Показываем секцию с чекбоксом для ВСЕХ режимов, где есть поле промпта
    // Скрываем только для режимов без промпта: background_removal и upscale_image
    // 🔥 НОВОЕ: Скрываем также для z_image по требованию
    const shouldShowNegativePromptSection = !['background_removal', 'upscale_image', 'z_image'].includes(currentMode);

    if (shouldShowNegativePromptSection) {
        // 🔥 Refined UI: Toggle Container
        const negativePromptExternalRow = document.querySelector('.negative-prompt-external-row');

        if (negativePromptExternalRow) {
            negativePromptExternalRow.style.display = 'flex';
            negativePromptExternalRow.classList.remove('hidden');
        } else if (negativePromptSection) {
            // Legacy Fallback
            negativePromptSection.style.display = 'block';
            negativePromptSection.classList.remove('hidden');
        }

        console.log(`📝 Negative prompt toggle VISIBLE for mode: ${currentMode}`);

        // Сбрасываем чекбокс в дефолтное состояние при изменении режима
        if (negativePromptCheckbox) {
            negativePromptCheckbox.checked = false;
            // Запускаем обработчик изменения для скрытия поля
            negativePromptCheckbox.dispatchEvent(new Event('change'));

            // Также обновляем состояние кнопки-переключателя
            if (negativePromptToggle) {
                negativePromptToggle.classList.remove('active');
            }
        }
    } else {
        const negativePromptExternalRow = document.querySelector('.negative-prompt-external-row');

        if (negativePromptExternalRow) {
            negativePromptExternalRow.style.setProperty('display', 'none', 'important');
            negativePromptExternalRow.classList.add('hidden');
        }
        if (negativePromptSection) {
            negativePromptSection.style.setProperty('display', 'none', 'important');
            negativePromptSection.classList.add('hidden');
        }
        if (negativePromptToggle) {
            negativePromptToggle.style.setProperty('display', 'none', 'important');
            negativePromptToggle.classList.add('hidden');
        }
        // Hide input
        if (negativePromptFormGroup) {
            negativePromptFormGroup.style.setProperty('display', 'none', 'important');
            negativePromptFormGroup.classList.add('hidden');
        }
        // Uncheck to be safe
        if (negativePromptCheckbox) negativePromptCheckbox.checked = false;

        console.log(`🚫 Negative prompt system HIDDEN for mode: ${currentMode}`);
    }
}

// ===== Функция для обновления видимости селектора размеров =====
async function updateSizeSelectVisibility() {
    const sizeSelect = document.getElementById('sizeSelect');
    const sizeGroup = document.getElementById('sizeGroup');

    if (!sizeGroup) {
        console.warn('❌ Элемент sizeGroup не найден');
        return;
    }

    const currentMode = await getCurrentSelectedMode();

    // Скрываем размеры для Sound и Edit вкладок
    const activeTabForSize = window._currentGenerationTab || 'image';
    if (activeTabForSize === 'sound') {
        sizeGroup.style.setProperty('display', 'none', 'important');
        sizeGroup.classList.add('hidden');
        const resGroupShared = document.getElementById('resolutionGroup');
        if (resGroupShared) resGroupShared.style.setProperty('display', 'none', 'important');
        return;
    }
    if (activeTabForSize === 'edit') {
        // In edit mode: show size for nano_banana family and qwen_image_edit
        const editModelsWithSizes = ['nano_banana', 'nano_banana_2', 'nano_banana_pro', 'qwen_image_edit'];
        if (editModelsWithSizes.includes(currentMode)) {
            sizeGroup.style.removeProperty('display');
            sizeGroup.style.display = 'block';
            sizeGroup.classList.remove('hidden');
            updateSizeOptionsForMode(currentMode);
        } else {
            sizeGroup.style.setProperty('display', 'none', 'important');
            sizeGroup.classList.add('hidden');
        }
        // resolutionGroup visibility handled by updateResolutionSelectVisibility()
        return;
    }

    // Скрываем в режимах background_removal и upscale_image
    const shouldHideSizeSelect = ['background_removal', 'upscale_image'].includes(currentMode) && currentMode !== 'dreamshaper_xl';

    if (!shouldHideSizeSelect) {
        sizeGroup.style.display = 'block';
        sizeGroup.classList.remove('hidden');

        // ДИНАМИЧЕСКОЕ ОБНОВЛЕНИЕ РАЗМЕРОВ для DreamShaper XL
        updateSizeOptionsForMode(currentMode);

        console.log(`📏 Size selector VISIBLE for mode: ${currentMode}`);
    } else {
        sizeGroup.style.setProperty('display', 'none', 'important');
        sizeGroup.classList.add('hidden');
        console.log(`🚫 Size selector HIDDEN for mode: ${currentMode} (no size selection needed)`);
    }
}

// ===== Функция для получения конкретных размеров по значению =====
function getSizeDimensions(sizeValue) {
    const sizeMap = {
        'square': { width: 1024, height: 1024 },
        'ultra_wide_landscape': { width: 1536, height: 640 },
        'wide_landscape': { width: 1344, height: 768 },
        'standard_landscape': { width: 1152, height: 896 },
        'classic_landscape': { width: 1280, height: 832 },
        'classic_portrait': { width: 832, height: 1280 },
        'standard_portrait': { width: 896, height: 1152 },
        'tall_portrait': { width: 768, height: 1344 },
        'ultra_tall_portrait': { width: 640, height: 1536 }
    };

    return sizeMap[sizeValue] || { width: 1024, height: 1024 }; // fallback to square
}

// ===== Функция для обновления опций размеров в зависимости от режима =====
function updateSizeOptionsForMode(mode) {
    const sizeSelect = document.getElementById('sizeSelect');
    if (!sizeSelect) return;

    // Очищаем текущие опции
    sizeSelect.innerHTML = '';

    // Доступные размеры для всех режимов
    const availableSizes = [
        { value: 'square', label: 'Square 1:1 (1024×1024)' },
        { value: 'ultra_wide_landscape', label: 'Ultra-Wide Landscape 21:9 (1536×640)' },
        { value: 'wide_landscape', label: 'Wide Landscape 16:9 (1344×768)' },
        { value: 'standard_landscape', label: 'Standard Landscape 4:3 (1152×896)' },
        { value: 'classic_landscape', label: 'Classic Landscape 3:2 (1280×832)' },
        { value: 'classic_portrait', label: 'Classic Portrait 2:3 (832×1280)' },
        { value: 'standard_portrait', label: 'Standard Portrait 3:4 (896×1152)' },
        { value: 'tall_portrait', label: 'Tall Portrait 9:16 (768×1344)' },
        { value: 'ultra_tall_portrait', label: 'Ultra-Tall Portrait 9:21 (640×1536)' }
    ];

    availableSizes.forEach(size => {
        // Пропускаем Ultra-Tall Portrait для режимов Nano Banana
        if (size.value === 'ultra_tall_portrait' && mode && mode.startsWith('nano_banana')) {
            return;
        }

        let displayLabel = size.label;
        // Для режимов Nano Banana убираем точные значения пикселей в скобках
        if (mode && mode.startsWith('nano_banana')) {
            displayLabel = displayLabel.replace(/\s*\([^)]+\)/, '');
        }

        const option = document.createElement('option');
        option.value = size.value;
        option.className = 'size-text';
        option.textContent = displayLabel;
        sizeSelect.appendChild(option);
    });

    console.log(`🎨 Available size options loaded for mode: ${mode}`);
}

// ===== Функция для обновления селектора разрешений (Nano Banana) =====
async function updateResolutionSelectVisibility() {
    const resolutionGroup = document.getElementById('resolutionGroup');
    const resolutionSelect = document.getElementById('resolutionSelect');
    if (!resolutionGroup || !resolutionSelect) return;

    // 🔥 FIX: In Edit mode, use window._editModel instead of the Image-tab mode
    const activeTabNow = window._currentGenerationTab || 'image';
    if (activeTabNow === 'edit') {
        const editModel = window._editModel || document.getElementById('modeSelect')?.value || 'nano_banana';
        const showRes = ['nano_banana_2', 'nano_banana_pro'].includes(editModel);
        if (showRes) {
            resolutionGroup.style.removeProperty('display');
            resolutionGroup.style.display = 'flex';
            resolutionGroup.classList.remove('hidden');
        } else {
            resolutionGroup.style.setProperty('display', 'none', 'important');
            resolutionGroup.classList.add('hidden');
        }
        return;
    }

    const currentMode = await getCurrentSelectedMode();

    if (currentMode === 'nano_banana_2' || currentMode === 'nano_banana_pro') {
        resolutionGroup.style.removeProperty('display');
        resolutionGroup.style.display = 'block';
        resolutionGroup.classList.remove('hidden');

        // Update options based on mode
        const previousValue = resolutionSelect.value;
        resolutionSelect.innerHTML = '';

        if (currentMode === 'nano_banana_2') {
            const options = [
                { value: '1K', label: 'Res 1K' },
                { value: '2K', label: 'Res 2K' },
                { value: '4K', label: 'Res 4K' }
            ];
            options.forEach(opt => {
                const el = document.createElement('option');
                el.value = opt.value;
                el.textContent = opt.label;
                resolutionSelect.appendChild(el);
            });
        } else if (currentMode === 'nano_banana_pro') {
            const options = [
                { value: '1K', label: 'Res 1K' },
                { value: '2K', label: 'Res 2K' },
                { value: '4K', label: 'Res 4K' }
            ];
            options.forEach(opt => {
                const el = document.createElement('option');
                el.value = opt.value;
                el.textContent = opt.label;
                resolutionSelect.appendChild(el);
            });
        }

        // Restore previous value if it still exists
        if (Array.from(resolutionSelect.options).some(opt => opt.value === previousValue)) {
            resolutionSelect.value = previousValue;
        }
    } else {
        resolutionGroup.style.setProperty('display', 'none', 'important');
        resolutionGroup.classList.add('hidden');
    }
}

// ===== Expose key visibility functions to window for cross-script access =====
// Needed by selectEditModel (index.html) to update resolution selector on model change
window.updateResolutionSelectVisibility = updateResolutionSelectVisibility;
// Needed by navigation-manager.js and other modules
window.updatePromptVisibility = updatePromptVisibility;

// ===== Инициализация UI загрузки =====


function initUserImageUpload() {
    const input = document.getElementById('userImage');
    const removeBtn = document.getElementById('removeUserImage');

    input?.addEventListener('change', onUserImageChange);
    removeBtn?.addEventListener('click', clearUserImage);

    // Setup Drag & Drop
    setupDragAndDrop();

    // Setup Add URL Button
    const urlInput = document.getElementById('imageUrlInput');
    const addUrlSubmitBtn = document.getElementById('addUrlSubmitBtn');

    if (urlInput && addUrlSubmitBtn) {
        addUrlSubmitBtn.addEventListener('click', () => handleUrlAdd(urlInput.value));
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleUrlAdd(urlInput.value);
            }
        });
    }

    // Проверить режим при изменении
    const modeSelect = document.getElementById('modeSelect');
    if (modeSelect) {
        // Инициализация видимости при загрузке
        updateImageUploadVisibility();
        updatePromptVisibility();
        updateNegativePromptVisibility(); // 🔥 ДОБАВЛЕНО: инициализация видимости negative prompt
        updateSizeSelectVisibility();
        updateResolutionSelectVisibility(); // 🔥 ДОБАВЛЕНО: инициализация видимости разрешений

        // 🔥 ИСПРАВЛЕНО: Инициализируем UI для реально выбранного режима (z_image по умолчанию в HTML)
        // Не хардкодим nano_banana_pro — читаем реальное значение из modeSelect
        const defaultMode = modeSelect.value || 'z_image';
        updateSizeOptionsForMode(defaultMode);
        // Запускаем полный цикл синхронизации UI для дефолтного режима
        // (обновит видимость size/resolution/prompt/upload под реальную модель)
        modeSelect.dispatchEvent(new Event('change', { bubbles: true }));

        // Слушать изменения режима через DOM select (для совместимости)
        modeSelect.addEventListener('change', () => {
            const newMode = modeSelect.value;
            trimImagesForMode(newMode);
            updateImageUploadVisibility();
            updatePromptVisibility();
            updateNegativePromptVisibility()
            updateSizeSelectVisibility();
            updateResolutionSelectVisibility();
        });

        // 🔥 ДОБАВЛЕНО: Слушатель кастомного события изменения режима от mode-cards компонента
        document.addEventListener('mode:changed', (event) => {
            const { mode } = event.detail;
            console.log('📡 Mode changed event received:', mode);

            if (modeSelect) modeSelect.value = mode;

            trimImagesForMode(mode);
            updateImageUploadVisibility();
            updatePromptVisibility();
            updateNegativePromptVisibility(); // 🔥 ДОБАВЛЕНО: обновление видимости negative prompt
            updateSizeSelectVisibility();
            updateResolutionSelectVisibility();
        });
    }
}

// ===== Drag & Drop Logic =====
function setupDragAndDrop() {
    const promptContainer = document.getElementById('promptFormGroup');
    const dropzoneOverlay = document.getElementById('dropzoneOverlay');
    const promptInput = document.getElementById('promptInput');

    if (!promptContainer || !dropzoneOverlay) return;

    let dragCounter = 0;

    promptContainer.addEventListener('dragenter', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter++;
        dropzoneOverlay.classList.remove('hidden');
        // small delay to allow display block to apply before transition
        setTimeout(() => dropzoneOverlay.classList.remove('opacity-0'), 10);
    });

    promptContainer.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter--;
        if (dragCounter <= 0) {
            dropzoneOverlay.classList.add('opacity-0');
            setTimeout(() => {
                if (dragCounter <= 0) dropzoneOverlay.classList.add('hidden');
            }, 200);
            dragCounter = 0;
        }
    });

    promptContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    promptContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter = 0;
        dropzoneOverlay.classList.add('opacity-0');
        setTimeout(() => dropzoneOverlay.classList.add('hidden'), 200);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    });

    // Handle Paste on prompt input
    if (promptInput) {
        promptInput.addEventListener('paste', (e) => {
            if (e.clipboardData.files && e.clipboardData.files.length > 0) {
                handleFiles(Array.from(e.clipboardData.files));
            }
        });
    }
}

async function handleFiles(files) {
    // Mimic the logic of onUserImageChange
    const syntheticEvent = {
        target: { files: files }
    };
    await onUserImageChange(syntheticEvent);
}

// ===== Handle Adding via URL =====
async function handleUrlAdd(url) {
    const container = document.getElementById('urlInputContainer');
    const errorEl = document.getElementById('urlInputError');
    const inputEl = document.getElementById('imageUrlInput');

    if (!url || !url.trim()) return;

    try {
        new URL(url); // very basic validation
        if (errorEl) errorEl.classList.add('hidden');

        // Check limits
        const modeSelect = document.getElementById('modeSelect');
        const currentMode = modeSelect ? modeSelect.value : 'nano_banana';
        const limit = getImageLimitForMode(currentMode);

        if (userImageState.images.length >= limit) {
            if (window.showToast) window.showToast('error', `Maximum limit reached.`);
            return;
        }

        // We add the URL directly without fetching the file, we will let backend fetch it.
        // If we want it to display in UI, we just use the URL directly.
        const imageId = Date.now() + Math.random().toString(36).substr(2, 9);
        const imageObj = {
            id: imageId,
            file: null,
            blob: null,
            dataUrl: url,        // For UI preview
            uploadedUrl: url     // For formData appending
        };

        userImageState.images.push(imageObj);
        createPreviewItem(imageId, url, 'URL Image');

        // Hide container and reset
        if (inputEl) inputEl.value = '';
        if (container) container.classList.add('hidden');

        // Update UI using identical sequence to onUserImageChange ending
        const preview = document.getElementById('userImagePreview');
        if (preview) {
            preview.classList.remove('hidden', 'flux-shnel-hidden');
            preview.style.setProperty('display', 'block', 'important');
        }
        const wrapper = document.getElementById('userImageWrapper');
        if (wrapper) {
            wrapper.classList.add('has-image');
            wrapper.classList.remove('need-image');
        }

        updateSizeSelectVisibility();
        updateImageUploadVisibility();

        // 🔥 Sync with appState
        if (window.appState) {
            window.appState.setImageState(userImageState);
        }

        document.dispatchEvent(new CustomEvent('images:updated', {
            detail: { imageCount: userImageState.images.length }
        }));

    } catch (e) {
        if (errorEl) {
            errorEl.classList.remove('hidden');
            errorEl.textContent = "Invalid URL format.";
        }
    }
}

// ===== Обработчик выбора файла =====
async function onUserImageChange(e) {
    try {
        console.log('📁 onUserImageChange called with files:', e.target.files?.length || 0);

        const files = Array.from(e.target.files || []);
        const errorEl = document.getElementById('userImageError');
        const preview = document.getElementById('userImagePreview');
        const previewContainer = document.getElementById('previewContainer');
        const chooseBtn = document.getElementById('chooseUserImage');
        const optionalLabel = document.querySelector('.under-user-image-label');

        // Очищаем ошибки и проверяем наличие файлов
        if (errorEl) errorEl.textContent = '';
        if (!files.length) {
            console.log('⚠️ No files selected');
            return;
        }

        console.log('📁 Processing', files.length, 'files for upload:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));

        // Проверка лимита (до 4 изображений)
        // Проверка лимита (динамический)
        const modeSelect = document.getElementById('modeSelect');
        const currentMode = modeSelect ? modeSelect.value : 'nano_banana';
        const limit = getImageLimitForMode(currentMode);

        const currentCount = userImageState.images.length;
        // Check total attempted upload count against limit
        const totalNew = currentCount + files.length;
        console.log(`🎯 Current images: ${currentCount}, new total: ${totalNew}, limit: ${limit}`);

        if (totalNew > limit) {
            const remaining = Math.max(0, limit - currentCount);
            let errorMsg = `Maximum ${limit} images allowed. You can add ${remaining} more.`;

            if (appState && appState.translate) {
                // Keep existing translation logic if key exists, but standardizing message is better for clarify
                // defaulting to English construction for now as requested by user ("Maximum 8 images")
                // We can try to use the key but it might not be specific enough.
                // For now, let's trust the translation system for basic error, but maybe Toast should be more specific?
                // User audio: "So that he is shown a message that the maximum for this mode is 8 images"
                errorMsg = appState.translate('image_limit_error').replace('{{count}}', remaining).replace('{{limit}}', limit);
            }

            if (errorEl) {
                errorEl.textContent = errorMsg;
            }

            // 🔥 SHOW TOAST NOTIFICATION
            if (window.showToast) {
                window.showToast('error', errorMsg);
            } else {
                console.warn(`toast error: ${errorMsg}`);
            }

            console.warn(`🚫 Too many images, limit: ${limit}, remaining: ${limit - currentCount}`);
            return;
        }

        // Валидация каждого файла
        const validFiles = [];
        let validationErrors = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            console.log(`🔍 Validating file ${i + 1}: ${file.name} (${file.size} bytes, ${file.type})`);

            // Duplicate detection — skip if same name+size already loaded
            const isDuplicate = userImageState.images.some(img =>
                img.file && img.file.name === file.name && img.file.size === file.size
            );
            if (isDuplicate) {
                console.warn(`⚠️ Duplicate image skipped: ${file.name}`);
                if (window.showToast) window.showToast('warning', `Image "${file.name}" is already added.`);
                continue;
            }

            if (!CONFIG.ALLOWED_TYPES.includes(file.type)) {
                const errorMsg = `Файл ${file.name}: недопустимый формат. Разрешено: ${CONFIG.ALLOWED_TYPES.join(', ')}`;
                console.error('❌ Invalid file type:', file.type);
                validationErrors.push(errorMsg);
                continue;
            }

            const maxBytes = CONFIG.MAX_IMAGE_MB * 1024 * 1024; // МБ в байты
            if (file.size > maxBytes) {
                const errorMsg = `Файл ${file.name}: слишком большой (макс ${CONFIG.MAX_IMAGE_MB} MB).`;
                console.error('❌ File too large:', file.size, '>', maxBytes);
                validationErrors.push(errorMsg);
                continue;
            }

            validFiles.push(file);
            console.log(`✅ File ${file.name} is valid`);
        }

        if (!validFiles.length) {
            console.log('❌ No valid files after validation');
            if (errorEl && validationErrors.length) {
                errorEl.textContent = validationErrors[0]; // Показываем первую ошибку
            }
            return;
        }

        console.log('✅ Valid files found:', validFiles.length, '/', files.length);
        if (validationErrors.length > 0) {
            console.warn('⚠️ Some files were rejected:', validationErrors.length);
        }

        // Обработка каждого файла
        let processedCount = 0;
        let failedCount = 0;

        for (let i = 0; i < validFiles.length; i++) {
            const file = validFiles[i];

            try {
                console.log(`📸 Processing file ${i + 1}/${validFiles.length}: ${file.name}`);

                // 🔥 НОВЫЙ ПОДХОД: Читаем файл как ArrayBuffer для бинарной обработки
                const arrayBuffer = await readFileAsArrayBuffer(file);
                console.log(`✅ File ${file.name} read as ArrayBuffer, size: ${arrayBuffer.byteLength} bytes`);

                // Конвертируем ArrayBuffer в Blob с правильным MIME-типом
                const blob = arrayBufferToBlob(arrayBuffer, file.type);
                console.log(`🔄 File ${file.name} converted to Blob, size: ${blob.size} bytes, type: ${blob.type}`);

                // 🔥 НОВОЕ: Сжимаем изображение как Blob (возвращает новый Blob)
                const compressedBlob = await maybeCompressImageBlob(
                    blob,
                    CONFIG.PREVIEW_MAX_W,
                    CONFIG.PREVIEW_MAX_H,
                    CONFIG.PREVIEW_JPEG_QUALITY
                );
                console.log(`✨ File ${file.name} compressed, new size: ${compressedBlob.size} bytes`);

                // 🔥 НОВОЕ: Конвертируем сжатый Blob в DataURL только для UI превью
                const dataUrl = await blobToDataURL(compressedBlob);
                console.log(`🔄 Compressed blob converted to DataURL for UI, length: ${dataUrl.length}`);

                // Создаем уникальный ID для изображения
                const imageId = Date.now() + Math.random().toString(36).substr(2, 9);
                console.log(`🆔 Created imageId: ${imageId} for ${file.name}`);

                // 🔥 НОВОЕ: Добавляем в состояние Blob объект вместо base64 строки
                const imageObj = {
                    id: imageId,
                    file: file,
                    blob: compressedBlob,        // 🔥 НОВОЕ: Сохраняем Blob для бинарной передачи
                    dataUrl: dataUrl,            // Сохраняем DataURL для совместимости с UI
                    uploadedUrl: null
                };

                userImageState.images.push(imageObj);
                console.log(`📦 Added to userImageState with Blob, total images: ${userImageState.images.length}`);

                // Создаем превью элемент (перенесено в renderPreviews)
                console.log(`🖼️ Added to state for ${file.name}, will render later`);

                processedCount++;
                console.log(`✅ Successfully processed file ${i + 1}: ${file.name}`);

            } catch (error) {
                console.error(`❌ Failed to process file ${i + 1} (${file.name}):`, error);
                failedCount++;

                if (errorEl) {
                    errorEl.textContent = `Ошибка обработки ${file.name}: ${error.message || 'неизвестная ошибка'}`;
                }
            }
        }

        console.log(`📊 Processing summary: ${processedCount} succeeded, ${failedCount} failed`);

        // Обновляем UI если есть успешные обработки
        if (processedCount > 0) {
            console.log('🎨 Updating UI for successful uploads');

            // 🔥 Вызываем новый идемпотентный рендер
            renderPreviews();

            // Обновяем видимость элементов
            updateSizeSelectVisibility();
            updateImageUploadVisibility();

            console.log(`🎯 Final state: ${userImageState.images.length} images uploaded successfully`);

            // Принудительная загрузка превью истории
            setTimeout(() => {
                const historyList = document.getElementById('historyList');
                if (historyList && !historyList.classList.contains('hidden')) {
                    console.log('🎯 Starting history preview force load');
                    globalHistoryLoader.forceLoadVisibleHistoryPreviews();
                }
            }, 100);

            // Диспатчим событие изменения изображений для обновления UI (strength slider и др.)
            document.dispatchEvent(new CustomEvent('images:updated', {
                detail: { imageCount: userImageState.images.length }
            }));

        } else {
            console.warn('⚠️ No files were processed successfully');
            if (errorEl && !errorEl.textContent) {
                errorEl.textContent = 'Не удалось обработать выбранные файлы.';
            }
        }

    } catch (globalError) {
        console.error('💥 Global error in onUserImageChange:', globalError);

        // Показываем ошибку пользователю
        const errorEl = document.getElementById('userImageError');
        if (errorEl) {
            errorEl.textContent = 'Произошла ошибка при загрузке изображений. Попробуйте снова.';
        }

        // Не даем ошибке распространиться выше
    }
}

// ===== Рендер всех превью на основе состояния =====
function renderPreviews() {
    const previewContainer = document.getElementById('previewContainer');
    if (!previewContainer) return;
    
    // Очищаем контейнер
    previewContainer.innerHTML = '';
    
    // Рендерим каждое изображение из состояния
    userImageState.images.forEach(img => {
        createPreviewItem(img.id, img.dataUrl, img.file?.name || 'History Image');
    });
    
    // Обновляем видимость контейнера
    const preview = document.getElementById('userImagePreview');
    const wrapper = document.getElementById('userImageWrapper');
    if (userImageState.images.length > 0) {
        if (preview) {
            preview.classList.remove('hidden', 'flux-shnel-hidden');
            preview.style.setProperty('display', 'block', 'important');
        }
        if (wrapper) wrapper.classList.add('has-image');
    } else {
        if (preview) preview.classList.add('hidden');
        if (wrapper) wrapper.classList.remove('has-image');
    }
}
window.renderPreviews = renderPreviews;

// ===== Создание превью элемента =====
function createPreviewItem(imageId, dataUrl, fileName) {
    const previewContainer = document.getElementById('previewContainer');
    if (!previewContainer) return;

    // 👉 imageUUID добавится после загрузки на Runware в generateImage()

    // МИГРАЦИЯ: применяем Tailwind классы вместо inline стилей
    const itemDiv = document.createElement('div');
    itemDiv.classList.add(
        'preview-item', 'relative', 'inline-block', 'm-1',
        'border-2', 'border-gray-300', 'dark:border-gray-600',
        'rounded-lg', 'overflow-hidden',
        'bg-gray-100', 'dark:bg-gray-700'
    );
    itemDiv.setAttribute('data-id', imageId);

    // МИГРАЦИЯ: применяем Tailwind классы вместо inline стилей
    const img = document.createElement('img');
    img.classList.add('w-15', 'h-15', 'object-cover', 'block');
    img.src = dataUrl;
    img.alt = fileName;

    // МИГРАЦИЯ: применяем Tailwind классы вместо inline стилей
    const removeBtn = document.createElement('button');
    removeBtn.classList.add(
        'remove-preview-btn', 'absolute', 'top-0', 'right-0',
        'w-4', 'h-4', 'bg-black/70', 'border-none', 'rounded-full',
        'text-white', 'text-xs', 'font-bold', 'cursor-pointer',
        'flex', 'items-center', 'justify-center'
    );
    removeBtn.textContent = '×';
    removeBtn.onclick = () => removeImage(imageId);

    // Создаем маленькую кнопку "Загрузить" внутри превью
    const innerUploadBtn = document.createElement('button');
    innerUploadBtn.className = 'inner-upload-btn';
    innerUploadBtn.onclick = (e) => {
        e.preventDefault();  // предотвращаем submit формы
        e.stopPropagation(); // предотвращаем всплытие события
        const input = document.getElementById('userImage');
        if (input) input.click();
    };

    const uploadIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    uploadIcon.setAttribute('viewBox', '0 0 24 24');
    uploadIcon.setAttribute('fill', 'none');
    uploadIcon.setAttribute('stroke', 'currentColor');
    uploadIcon.setAttribute('stroke-width', '2');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M7 16a4 4 0 01-.88-7.903A4.999 4.999 0 0111 11h1V9a4 4 0 118 4.001c0-.73-.303-1.406-.88-1.923A5.002 5.002 0 0117 7a5 5 0 11-10 0v2.097A4.001 4.001 0 017 16z');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');

    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('d', 'M15 19l-3-3-3 3M12 19V13');

    // Simple plus icon for upload
    const plusPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    plusPath.setAttribute('d', 'M19 11H13V17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17V11H5C4.44772 11 4 10.5523 4 10C4 9.44772 4.44772 9 5 9H11V3C11 2.44772 11.4477 2 12 2C12.5523 2 13 2.44772 13 3V9H19C19.5523 9 20 9.44772 20 10C20 10.5523 19.5523 11 19 11Z');
    uploadIcon.appendChild(plusPath);
    innerUploadBtn.appendChild(uploadIcon);

    itemDiv.appendChild(img);
    itemDiv.appendChild(removeBtn);
    itemDiv.appendChild(innerUploadBtn);
    previewContainer.appendChild(itemDiv);

    // Обновляем видимость маленькой кнопки после создания
    setTimeout(() => updateInnerUploadButtonVisibility(), 50);
}

// 🔥 EXPORT TO WINDOW FOR MODALS
window.createPreviewItem = createPreviewItem;

// ===== Удаление изображения =====
function removeImage(imageId) {
    // Удаляем из состояния
    userImageState.images = userImageState.images.filter(img => img.id !== imageId);

    // Clear the file input to allow re-selecting the same file
    const input = document.getElementById('userImage');
    if (input) input.value = '';

    // 🔥 Идемпотентный рендер
    renderPreviews();

    // Показать кнопку загрузки если меньше лимита
    const chooseBtn = document.getElementById('chooseUserImage');
    if (chooseBtn) {
        // Получаем текущий режим для правильной проверки лимита
        const modeSelect = document.getElementById('modeSelect');
        const currentMode = modeSelect ? modeSelect.value : 'nano_banana';
        const limit = getImageLimitForMode(currentMode);

        if (userImageState.images.length < limit) {
            // Let updateImageUploadVisibility handle the display logic to avoid conflicts
            // chooseBtn.style.display = ''; 
        }
    }

    // Обновление видимости выбора размеров
    updateSizeSelectVisibility();
    updateResolutionSelectVisibility();

    // Обновление видимости кнопки и превью согласно логике режима
    updateImageUploadVisibility();

    // 🔥 ИСПРАВЛЕНИЕ: Если удалили последнее изображение — сбрасываем edit image state
    // независимо от текущего таба, чтобы при переходе в Edit показывался шаг 1 (дропзона)
    if (!userImageState.images.length) {
        if (window._editImageUrl || window._editImageBlob) {
            window._editImageUrl = null;
            window._editImageBlob = null;
            console.log('🔄 Last image removed — _editImageUrl cleared (tab:', window._currentGenerationTab, ')');
        }
        // Если мы на Edit табе — дополнительно сбрасываем UI к шагу 1
        if (window._currentGenerationTab === 'edit' && typeof window.clearEditImage === 'function') {
            console.log('🔄 Last image removed in Edit tab — resetting to Step 1');
            window.clearEditImage(true); // true = не вызывать clearAllImages повторно
        }
    }

    // 🔥 ДОБАВЛЕНИЕ: Диспатчим событие изменения изображений для обновления UI (strength slider и др.)
    document.dispatchEvent(new CustomEvent('images:updated', {
        detail: { imageCount: userImageState.images.length }
    }));
}

// ===== Удаление ВСЕХ изображений (для режима fast_generation) =====
function clearAllImages() {
    console.log('🗑️ Clearing ALL images for mode switch');

    // Очищаем состояние
    userImageState.images = [];

    // 🔥 Идемпотентный рендер
    renderPreviews();

    console.log('✅ All images cleared successfully');

    // 🔥 ИСПРАВЛЕНИЕ БАГ: Также сбрасываем edit image state,
    // чтобы при переходе в Edit после очистки показывался шаг 1 (дропзона)
    if (window._editImageUrl || window._editImageBlob) {
        window._editImageUrl = null;
        window._editImageBlob = null;
        console.log('🔄 Edit image state cleared alongside Images tab cleanup');
    }

    // 🔥 ДОБАВЛЕНИЕ: Обновляем видимость после очистки
    setTimeout(() => updateImageUploadVisibility(), 50);
}

// 🔥 EXPORT TO WINDOW FOR MODALS
window.clearAllImages = clearAllImages;

// ===== Новое функция: Обновление видимости маленькой кнопки внутри превью =====
function updateInnerUploadButtonVisibility() {
    const currentMode = document.getElementById('modeSelect').value;
    const imageCount = userImageState.images.length;
    const previewItems = document.querySelectorAll('.preview-item');

    previewItems.forEach(item => {
        const innerBtn = item.querySelector('.inner-upload-btn');
        if (!innerBtn) return;

        let shouldShowInnerBtn = false;

        if (currentMode === 'nano_banana' || currentMode === 'nano_banana_2' || currentMode === 'nano_banana_pro') {
            // Для Photo Session и Nano Banana Pro: показываем кнопку пока не достигнут лимит в 4 изображения
            shouldShowInnerBtn = imageCount < 4;
        } else if (['upscale_image', 'background_removal'].includes(currentMode)) {
            // Для других режимов, требующих изображения: показываем кнопку пока не достигнут лимит в 1 изображение
            shouldShowInnerBtn = imageCount < 1;
        }
        // Для fast_generation: горем никогда не показываем внутреннюю кнопку (нет в списке режимов)

        // Применяем видимость
        if (shouldShowInnerBtn) {
            innerBtn.style.display = 'flex';
            innerBtn.classList.remove('hidden');
        } else {
            innerBtn.style.display = 'none';
            innerBtn.classList.add('hidden');
        }
    });

    console.log(`🔘 Inner upload button visibility updated for mode: ${currentMode}, images: ${imageCount}`);
}

// ===== Удаление лишних изображений до указанного лимита =====
function trimImagesToLimit(limit) {
    if (userImageState.images.length <= limit) return;

    console.log(`🗑️ Trimming images from ${userImageState.images.length} to ${limit}`);

    // Оставляем только первые N изображений
    const imagesToRemove = userImageState.images.slice(limit);
    userImageState.images = userImageState.images.slice(0, limit);

    // Удаляем превью элементов для удалённых изображений
    const previewContainer = document.getElementById('previewContainer');
    imagesToRemove.forEach(img => {
        const item = previewContainer?.querySelector(`[data-id="${img.id}"]`);
        if (item) item.remove();
    });

    console.log(`✅ Trimmed ${imagesToRemove.length} excess images`);
}

// ===== Обновление видимости кнопки загрузки =====


// ===== Обновление положения кнопки загрузки (СТАБИЛЬНАЯ ПОЗИЦИЯ) =====
function updateUploadButtonPosition() {
    const chooseBtn = document.getElementById('chooseUserImage');
    const preview = document.getElementById('userImagePreview');
    const container = document.getElementById('userImageWrapper');
    const hasImages = userImageState.images.length > 0;
    const hasLimitReached = userImageState.images.length >= getImageLimitForMode(document.getElementById('modeSelect')?.value || 'default');

    if (!chooseBtn || !container) return;

    // 🔥 НОВОЕ: Кнопка всегда остается в контейнере, меняем только визуальное состояние
    // Убираем перемещение кнопки между контейнерами - это вызывает дерганье

    // Всегда используем стиль "outside-upload" для стабильности
    chooseBtn.classList.add('outside-upload');
    chooseBtn.classList.remove('inside-preview');

    // Управляем видимостью через opacity вместо display для плавности
    if (hasLimitReached) {
        chooseBtn.style.opacity = '0';
        chooseBtn.style.pointerEvents = 'none';
        console.log('🚫 Кнопка СКРЫТА - достигнут лимит (opacity)');
    } else {
        chooseBtn.style.opacity = hasImages ? '0.7' : '1'; // Полупрозрачная когда есть изображения
        chooseBtn.style.pointerEvents = 'auto';
        console.log('✅ Кнопка ВИДИМА - стабильная позиция');
    }
}







// 🔥 НОВЫЙ МЕХАНИЗМ: Подготавливает изображения для генерации с бинарной передачей
async function uploadUserImages() {
    const images = userImageState.images;
    console.log('🚀 Starting uploadUserImages process - BINARY MODE:', {
        totalImages: images ? images.length : 0,
        hasImages: !!images && images.length > 0
    });

    if (!images || images.length === 0) {
        console.log('❌ No images to process, returning null');
        return null;
    }

    const formData = new FormData();
    const imageUUIDs = [];

    // Обрабатываем каждое изображение
    for (let index = 0; index < images.length; index++) {
        const image = images[index];
        console.log(`🎯 Processing image ${index + 1}/${images.length}:`, {
            hasBlob: !!image.blob,
            hasFile: !!image.file,
            fileName: image.file?.name || 'unknown',
            blobSize: image.blob?.size || 0
        });

        if (!image.blob && !image.uploadedUrl) {
            console.warn(`⚠️ Image ${index + 1} has no blob and no uploadedUrl, skipping`);
            continue;
        }

        // Генерируем уникальный UUID для изображения
        const imageUUID = generateUUIDv4();
        console.log(`🆔 Generated UUID for image ${index + 1}: ${imageUUID}`);

        // Добавляем UUID в массив
        imageUUIDs.push(imageUUID);

        if (image.blob) {
            // 🔥 НОВОЕ: Добавляем бинарный файл в FormData с именем image_N
            const fileName = `image_${index + 1}`;
            const file = new File([image.blob], `${imageUUID}.jpg`, { type: 'image/jpeg' });
            formData.append(fileName, file);

            console.log(`✅ Image ${index + 1} added to FormData: ${fileName}, size: ${file.size} bytes`);
        } else if (image.uploadedUrl) {
            // Если изображение добавлено по ссылке, а не как файл
            const fieldName = `image_url_${index + 1}`;
            formData.append(fieldName, image.uploadedUrl);
            console.log(`✅ Image URL ${index + 1} added to FormData: ${fieldName} -> ${image.uploadedUrl}`);
        } else {
            console.warn(`⚠️ Image ${index + 1} has neither blob nor uploadedUrl.`);
        }
    }

    console.log('🎯 Binary upload preparation results:', {
        total: images.length,
        processed: imageUUIDs.length,
        imageUUIDs: imageUUIDs,
        formDataFields: Array.from(formData.keys()),
        totalSize: Array.from(formData.values()).reduce((sum, file) => sum + file.size, 0)
    });

    return {
        formData: formData,          // 🔥 FormData только с бинарными файлами (без текстовых полей)
        imageUUIDs: imageUUIDs       // Массив UUID для imageUUID поля
    };
}

// 📱 Telegram WebApp Integration - УДАЛЕНА: дублирующая инициализация, теперь только в services.js

// ===== 🔗 URL PARAMS: Pre-fill prompt and/or pre-load image from deep link =====
// Called AFTER initializeUI() + initUserImageUpload() so state is fully ready.
//
// Supported params:
//   ?prompt=...       → fills #promptInput
//   ?image_url=...    → loads image into preview (Images tab)
//   pending_prompt    → localStorage fallback (from landing page)
//
// Example link with image:
//   https://app.pixplace.space/?image_url=https%3A%2F%2Fcdn.example.com%2Fphoto.jpg
// Example link with prompt + UTM:
//   https://app.pixplace.space/?prompt=A%20cat&utm_source=telegram&utm_campaign=group_post
//
async function applyUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);

    // Parse Telegram start_param into urlParams
    const startParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param;
    if (startParam) {
        // Support base64 encoded params or direct params (key=value&key2=value2)
        let decodedParam = startParam;
        try {
            if (!startParam.includes('=') && !startParam.includes('&')) {
                // Possible base64url
                let b64 = startParam.replace(/-/g, '+').replace(/_/g, '/');
                while (b64.length % 4) b64 += '=';
                const decoded = atob(b64);
                if (decoded.includes('=')) {
                    decodedParam = decoded;
                }
            }
        } catch (e) {
            console.log('start_param is not base64');
        }

        // Only split by & to avoid breaking URLs that contain underscores
        const pairs = decodedParam.split('&');
        pairs.forEach(pair => {
            const splitIndex = pair.indexOf('=');
            if (splitIndex > -1) {
                const key = pair.substring(0, splitIndex);
                const value = pair.substring(splitIndex + 1);
                if (key && value) {
                    urlParams.set(key, decodeURIComponent(value));
                }
            }
        });
    }

    const urlPrompt = urlParams.get('prompt');
    const urlMode = urlParams.get('mode');
    const urlModel = urlParams.get('model');
    let urlImageUrl = urlParams.get('image_url');
    const urlSource = urlParams.get('utm_source') || urlParams.get('source');

    let applied = false;

    // 0️⃣  Apply Mode and Model first so the correct UI is active
    if (urlMode || urlModel) {
        try {
            if (urlMode) {
                console.log(`🔀 [applyUrlParams] mode param found: ${urlMode}`);
                const navModule = await import('./navigation-manager.js');
                if (navModule.switchTab) navModule.switchTab(urlMode);
                applied = true;
            }
            if (urlModel) {
                console.log(`🎛️ [applyUrlParams] model param found: ${urlModel}`);
                const modeCardsModule = await import('./mode-cards.js');
                if (modeCardsModule.selectModeCard) modeCardsModule.selectModeCard(urlModel);
                applied = true;
            }
        } catch (e) {
            console.error('❌ Failed to apply mode/model from URL', e);
        }
    }

    // 1️⃣  Pre-fill prompt textarea
    if (urlPrompt) {
        console.log(`📝 [applyUrlParams] prompt param found (source: ${urlSource || 'unknown'})`);
        const promptInput = document.getElementById('promptInput');
        if (promptInput) {
            promptInput.value = urlPrompt;
            promptInput.dispatchEvent(new Event('input'));

            // Also push to appState to prevent overwrite
            const currentMode = urlMode || window._currentGenerationTab || 'image';
            if (window.appState) {
                window.appState.setModeState(currentMode, { prompt: urlPrompt });
            }
            applied = true;
        }
    }

    // 2️⃣  Pre-load image by URL → inject into state and show preview
    // URLSearchParams correctly parses both encoded and unencoded image_url,
    // including when UTM params follow: ?image_url=https://...webp&utm_source=telegram
    if (urlImageUrl) {
        console.log(`🖼️ [applyUrlParams] image_url → ${urlImageUrl}`);

        const imageId = 'url_param_' + Date.now();

        // Ensure useImageForGeneration is available
        if (!window.useImageForGeneration) {
            try {
                await import('./modals/generation-result-modal.js');
            } catch (e) {
                console.warn('⚠️ Could not load generation-result-modal for deep link:', e);
            }
        }

        // 🔥 ИСПРАВЛЕНИЕ: Используем useImageForGeneration, чтобы изображение 
        // скачалось как blob, создалось превью, и переключился режим при необходимости.
        if (window.useImageForGeneration) {
            await window.useImageForGeneration(urlImageUrl, imageId);

            // 🔥 КРИТИЧНО ДЛЯ РЕЖИМА EDIT: useImageForGeneration добавляет только в обычный userImageState
            // Если мы находимся в режиме edit, нужно прокинуть картинку в его собственный UI
            if (urlMode === 'edit' || window._currentGenerationTab === 'edit') {
                // useImageForGeneration создает свой собственный ID ('history_...'), поэтому берем последнюю добавленную картинку
                const img = userImageState.images[userImageState.images.length - 1];
                if (img) {
                    window._editImageUrl = img.dataUrl || urlImageUrl;
                    window._editImageBlob = img.blob || img.file;
                    if (window._showEditStep2) {
                        window._showEditStep2(window._editImageUrl);
                    }
                }
            }
        } else {
            console.warn('⚠️ window.useImageForGeneration not ready, using fallback');
            userImageState.images.push({
                id: imageId,
                file: null,
                blob: null,
                dataUrl: urlImageUrl,
                uploadedUrl: urlImageUrl
            });
            if (window.renderPreviews) {
                window.renderPreviews();
            } else if (window.createPreviewItem) {
                window.createPreviewItem(imageId, urlImageUrl, 'URL Image');
            }
            if (window.updateImageUploadVisibility) {
                window.updateImageUploadVisibility();
            }
        }

        applied = true;
    }

    // 3️⃣  Fallback: pending_prompt from localStorage (set by landing page)
    if (!urlPrompt) {
        const pendingPrompt = localStorage.getItem('pending_prompt');
        if (pendingPrompt) {
            console.log('📝 [applyUrlParams] pending_prompt from localStorage:', pendingPrompt);
            const promptInput = document.getElementById('promptInput');
            if (promptInput) {
                promptInput.value = pendingPrompt;
                promptInput.dispatchEvent(new Event('input'));
                applied = true;
            }
            localStorage.removeItem('pending_prompt');
        }
    }

    // 4️⃣  Clean URL: strip app params, keep utm_ for analytics
    if (applied) {
        const cleanParams = new URLSearchParams();
        for (const [k, v] of urlParams) {
            if (k.startsWith('utm_')) cleanParams.set(k, v);
        }
        const cleanSearch = cleanParams.toString() ? '?' + cleanParams.toString() : '';
        window.history.replaceState({}, document.title, window.location.pathname + cleanSearch);
    }
}

// 🚀 App Initialization
document.addEventListener('DOMContentLoaded', async function () {
    let services;
    // 🔥 Expand() теперь в index.html (ранний вызов сразу после загрузки SDK)

    if (window.DEBUG_MODE === 'full') console.log('🚀 pixPLace Creator starting...');

    // 🔥 AUTO-UPDATE MAINTENANCE.JS CONFIG FILE (ДЕМО СИНХРОНИЗАЦИЯ)
    try {
        // Обновляем maintenance.js с актуальным CONFIG.MAINTENANCE_MODE - простой формат
        const newConfig = `// Config for maintenance mode
const MAINTENANCE_MODE = ${CONFIG.MAINTENANCE_MODE}; // Auto-updated: ${new Date().toISOString()}`;

        if (window.DEBUG_MODE === 'full') console.log('🔧 Maintenance mode config updated:', CONFIG.MAINTENANCE_MODE, '- remember to sync maintenance.js');
        // NOTE: В проде эта строка должна быть закомментирована и обновление делаться через API
        // Для тестирования вручную вставьтеcontent выше в maintenance.js

        // Экспортируем в глобальную область для доступа из maintenance.html
        window.CONFIG_MAINTENANCE_MODE = CONFIG.MAINTENANCE_MODE;
        window.MAINTENANCE_MODE_LAST_UPDATE = new Date().toISOString();
    } catch (error) {
        console.warn('❌ Maintenance config update error:', error);
    }

    // 🚧 ПРОВЕРКА РЕЖИМА ОБСЛУЖИВАНИЯ - Если включен, перенаправляем на maintenance.html
    if (CONFIG.MAINTENANCE_MODE) {
        if (window.DEBUG_MODE === 'full') console.log('🚧 Maintenance Mode enabled - redirecting to maintenance page');
        window.location.href = 'maintenance.html';
        return; // Останавливаем дальнейшую инициализацию
    }

    // 🔥 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: инициализируем переводы ДО показа loading screen
    console.log('🌍 Initializing language and translations BEFORE loading screen...');

    // 1. СНАЧАЛА загружаем базовый язык и словарь
    await initBaseLanguageAndTranslations();

    // 2. ПРИМЕНИМ переводы к loading screen и всей странице
    try {
        dictionaryManager.updateTranslations();
        console.log('✅ Translations applied to loading screen');
    } catch (error) {
        console.error('❌ Failed to apply initial translations:', error);
    }

    // 3. ПОКАЗАТЬ LOADING SCREEN СРАЗУ (уже с переведенными текстами)
    // 🚀 ПОКАЗАТЬ LOADING SCREEN СРАЗУ (только logo, частицы - ничего не нужно переводить)
    // showLoadingScreen(); // REMOVED - loading screen removed for instant loading

    // ❄️ СНЕГОПАД: Теперь CSS-only снегопад автоматически включается через CSS :has() селекторы


    // 🔥 НЕТ ДУБЛИРОВАНИЯ - язык загружен выше

    // 🔥 НОВОЕ: Используем сервисы вместо прямого доступа к appState
    // Теперь передаем существующий appState в сервисы
    try {
        services = await initializeGlobalServices(appState); // ПЕРЕДАЕМ СУЩЕСТВУЮЩИЙ appState!

        // URL params are applied AFTER full UI init (see applyUrlParams() call below)
    } catch (error) {
        console.error('❌ Failed to initialize global services:', error);
        // Fallback - continue without services for basic functionality
        try {
            services = {
                appState: appState, // Используем существующий appState в fallback
                eventBus: null,
                telegram: null,
                storage: null,
                notifications: null,
                ui: null
            };
        } catch (fallbackError) {
            console.error('❌ Fallback services creation also failed:', fallbackError);
            services = {
                appState: appState, // По крайней мере правильный appState
                eventBus: null,
                telegram: null,
                storage: null,
                notifications: null,
                ui: null
            };
        }
    }

    // 🔥 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: СИНХРОНИЗИРУЕМ appState.language С dictionaryManager.currentLanguage
    if (services.appState) {
        services.appState.setLanguage(dictionaryManager.currentLanguage);
        console.log('✅ appState.language synchronized with dictionaryManager.currentLanguage:', dictionaryManager.currentLanguage);
    }

    // 🔥 ДОБАВЛЕНИЕ: ИНИЦИАЛИЗАЦИЯ NEGATIVE PROMPT ЧЕКБОКСА
    const negativePromptCheckbox = document.getElementById('negativePromptCheckbox');
    const negativePromptInput = document.getElementById('negativePromptInput');

    // Устанавливаем умолчательный текст для negative prompt
    const defaultNegativePrompt = 'blurry, low quality, deformed, ugly, mutated, extra limbs, poorly drawn face, poorly drawn hands';

    // Обработчик чекбокса для показывания/скрывания поля ввода
    if (negativePromptCheckbox && negativePromptInput) {
        negativePromptCheckbox.addEventListener('change', function () {
            const negativePromptFormGroup = document.getElementById('negativePromptFormGroup');

            if (this.checked) {
                // Показываем поле ввода и устанавливаем дефолтный текст
                negativePromptFormGroup.style.display = 'block';
                negativePromptFormGroup.classList.remove('hidden');

                if (!negativePromptInput.value.trim()) {
                    negativePromptInput.value = defaultNegativePrompt;
                    const negativeCharCounter = document.getElementById('negativeCharCounter');
                    if (negativeCharCounter) {
                        negativeCharCounter.textContent = defaultNegativePrompt.length;
                    }
                }

                console.log('📝 Negative prompt field shown and filled');
            } else {
                // Скрываем поле ввода
                negativePromptFormGroup.style.display = 'none';
                negativePromptFormGroup.classList.add('hidden');
                console.log('🚫 Negative prompt field hidden');
            }
        });

        // Инициализируем поле с плейсхолдером
        negativePromptInput.placeholder = defaultNegativePrompt;
        console.log('✅ Negative prompt checkbox handler initialized');


    }

    // 🔥 ПАРАЛЛЕЛЬНАЯ ИНИЦИАЛИЗАЦИЯ: Запускаем Telegram в фоне (не блокируем UI)
    services.telegram.initialize().then(result => {
        console.log('📱 Telegram initialization completed in background:', result);
    }).catch(error => {
        console.error('❌ Telegram initialization failed in background:', error);
    });

    console.log('🔄 Eureka Branch: Telegram initializing in background (non-blocking)');

    // 🔥 ДОБАВЛЕНО: ТОЛЬКО ЗДЕСЬ загружаем настройки! После инициализации всех сервисов
    console.log('🔄 READY TO LOAD SETTINGS - calling loadSettings()');
    console.log('🔄 Current localStorage:', {
        appSettings: localStorage.getItem('appSettings'),
        allKeys: Object.keys(localStorage)
    });
    appState.loadSettings();
    console.log('🎨 Settings loaded, current theme:', appState.theme);
    console.log('🎨 DOM theme attribute:', document.body.getAttribute('data-theme'));
    console.log('🎨 System detected theme:', appState.detectSystemTheme());
    console.log('🎨 Prefers color scheme matches:', {
        dark: window.matchMedia('(prefers-color-scheme: dark)').matches,
        light: window.matchMedia('(prefers-color-scheme: light)').matches
    });

    // 🔥 ИСПРАВЛЕНИЕ: ПО УМОЛЧАНИЮ ПОКАЗЫВАЕМ APP СРАЗУ!
    // Telegram авторизация должна работать через отдельный экран
    console.log('🚀 Showing app by default - auth will be handled separately');

    // Обновляем глобальные ссылки для совместимости (legacy support)
    window.appState = services.appState;
    console.log('✅ Services initialized, appState bridged for compatibility');

    // 🔐 ВОССТАНОВЛЕНИЕ СЕССИИ (F5 FIX) — синхронно, сразу после назначения window.appState
    // Делается ДО initializeUI(), чтобы гарантировать правильный порядок.
    try {
        const authCompleted = localStorage.getItem('telegram_auth_completed');
        const userDataStr = localStorage.getItem('telegram_user');
        if (authCompleted === 'true' && userDataStr) {
            const user = JSON.parse(userDataStr);
            if (user && (user.internalUserId || user.id)) {
                console.log('🔄 Restoring session for:', user.first_name || user.username || 'User');
                window.appState.userId = user.internalUserId ? String(user.internalUserId) : String(user.id);
                window.appState.userName = user.first_name || user.username || 'User';
                window.appState.userAvatar = user.photo_url || user.photoUrl || null;
            }
        }
    } catch (e) {
        console.error('❌ Session restore failed:', e);
    }

    // 🔐 Немедленно обновляем UI (аватарка, logout) — updateUserMenuInfo() уже будет
    // дополнительно вызван в initializeUI() через setTimeout(150)

    await initializeUI();
    initUserImageUpload();

    // 🔥 URL PARAMS: apply after full UI + image upload init
    await applyUrlParams();

});

console.log('🚀 App shown by default - auth screen hidden');

// 🔥 ПЕРЕНОС В navigation-manager.js: Lazy инициализация language dropdown
import('./navigation-manager.js').then(module => {
    if (module.initLazyLanguageDropdown) {
        // Добавляем небольшую задержку чтобы DOM точно был готов
        setTimeout(() => {
            module.initLazyLanguageDropdown();
            console.log('✅ Lazy language dropdown initialized from navigation-manager.js');
        }, 100);
    }
}).catch(error => {
    console.error('❌ Failed to import navigation-manager.js for lazy language dropdown:', error);
});




// ─── Access Guard ─────────────────────────────────────────────────────────────
// Checks credits before generation. Reads data synced by UserProfileService.
const GENERATION_COST_MAP = {
    'nano_banana': { withImages: 3, noImages: 3 },
    'nano_banana_2': { withImages: 10, noImages: 5 },
    'nano_banana_pro': { withImages: 15, noImages: 15 },
    'pixplace_pro': { withImages: 4, noImages: 4 },
    'print_maker': { withImages: 3, noImages: 3 },
    'upscale_image': { withImages: 10, noImages: 10 },
    'fast_generation': { withImages: 2, noImages: 2 },
    'z_image': { withImages: 20, noImages: 20 },
    'background_removal': { withImages: 0, noImages: 0 },
    'dreamshaper_xl': { withImages: 0, noImages: 0 }
};

// 🔒 Premium-only modes & tabs
const PREMIUM_ONLY_MODES = new Set(['nano_banana_pro']);
const PREMIUM_ONLY_TABS = new Set(['sound', 'video']);
// nano_banana_2 at 2K/4K is also premium - checked dynamically inside checkGenerationAccess

function checkGenerationAccess(mode, hasImages) {
    const user = window.appState?.user;
    if (!user || !user.id) return { ok: false, reason: 'unauthorized' };

    // ── Premium subscription check ──────────────────────────────────────────
    const hasPremiumSub = user.isPremium === true ||
        ['pro', 'studio'].includes((user.subscription || '').toLowerCase());

    const currentTab = window._currentGenerationTab || 'image';
    if (PREMIUM_ONLY_TABS.has(currentTab) && !hasPremiumSub) {
        const featureName = currentTab === 'sound' ? 'Music & Audio' : 'Video Generation';
        return { ok: false, reason: 'requires_subscription', featureName };
    }
    if (PREMIUM_ONLY_MODES.has(mode) && !hasPremiumSub) {
        return { ok: false, reason: 'requires_subscription', featureName: 'Nano Banana Pro' };
    }
    if (mode === 'nano_banana_2' && !hasPremiumSub) {
        const resolutionSelect = document.getElementById('resolutionSelect');
        const resolution = (resolutionSelect?.value || '1K').toUpperCase();
        if (resolution === '2K' || resolution === '4K') {
            return { ok: false, reason: 'requires_subscription', featureName: 'Nano Banana 2 (2K/4K)' };
        }
    }
    // ───────────────────────────────────────────────────────────────────────

    let cost = 5;
    const costs = GENERATION_COST_MAP[mode];

    // 🔥 ДОБАВЛЕНО: Динамический расчет стоимости по выбранному разрешению
    if (mode === 'nano_banana_2' || mode === 'nano_banana_pro') {
        const resolutionSelect = document.getElementById('resolutionSelect');
        const resolution = resolutionSelect ? resolutionSelect.value : '1k';

        if (mode === 'nano_banana_2') {
            if (resolution === '1k') cost = 5;
            else if (resolution === '2k') cost = 7;
            else if (resolution === '4k') cost = 11;
        } else if (mode === 'nano_banana_pro') {
            if (resolution === '1k' || resolution === '2k') cost = 12;
            else if (resolution === '4k') cost = 16;
        }
    } else {
        cost = costs ? (hasImages ? costs.withImages : costs.noImages) : 5;
    }

    const balance = parseFloat(user.credits) || 0;
    if (cost > 0 && balance < cost) return { ok: false, reason: 'insufficient_funds', cost, balance };
    return { ok: true, cost, balance };
}

async function handleAccessDenied(checkResult) {
    triggerHaptic('error');
    try {
        const { showCreditPurchaseModal, showSubscriptionUpgradeModal, showPricingModal } = await import('./js/modules/ui-utils.js');
        if (checkResult.reason === 'unauthorized') {
            if (window.openAuthModal) window.openAuthModal();
        } else if (checkResult.reason === 'insufficient_funds') {
            // Route top-up destination based on subscription:
            // Pro/Studio users → credit packs tab; others → plans tab
            const sub = (window.appState?.user?.subscription || '').toLowerCase();
            const hasSub = ['pro', 'studio'].includes(sub);
            showCreditPurchaseModal({
                cost: checkResult.cost,
                balance: checkResult.balance,
                onTopUp: () => showPricingModal({ initialTab: hasSub ? 'credits' : 'plans' })
            });
        } else if (checkResult.reason === 'requires_subscription') {
            showSubscriptionUpgradeModal({ featureName: checkResult.featureName || 'Pro Models' });
        }
    } catch (e) {
        console.error('❌ handleAccessDenied: ui-utils load failed', e);
        if (window.showToast) window.showToast('error', `Access denied: ${checkResult.reason}`);
    }
}

// 🖼️ Image Generation - ОБНОВЛЕНО ДЛЯ ПАРАЛЛЕЛЬНОЙ ГЕНЕРАЦИИ
async function generateImage(event) {
    if (event) {
        event.preventDefault();
    }

    // 🚀 LAZY LOAD: Dynamically import generationManager
    let generationManager;
    try {
        const module = await import('./parallel-generation.js');
        generationManager = module.generationManager;
    } catch (error) {
        console.error('❌ Failed to load generation module:', error);
        showToast('error', 'Failed to load generation module');
        return;
    }

    // 🍪 COOKIE CONSENT CHECK - BLOCK GENERATION
    // Force user to accept cookies before generating
    if (window.cookieManager && !window.cookieManager.hasConsent()) {
        console.log('🛑 Generation blocked: User has not accepted cookies.');
        try {
            window.cookieManager.showBanner(true); // force=true shows "You must choose..."
        } catch (e) {
            console.error('⚠️ Failed to show cookie banner:', e);
        }
        return;
    }

    // 🔒 USER RE-AUTHENTICATION CHECK
    // Проверка авторизации перед генерацией (СТРОГАЯ - только внутренний ID из БД)
    // Внутренний ID (от хука) является UUID/ObjectId (содержит буквы), 
    // в то время как Telegram ID - это только цифры
    let internalUserId = null;
    try {
        const tgUser = JSON.parse(localStorage.getItem('telegram_user') || '{}');
        internalUserId = tgUser.internalUserId || sessionStorage.getItem('auth_user_id') || window.appState?.userId || window.appState?.user?.id;
    } catch (e) {
        internalUserId = window.appState?.userId || window.appState?.user?.id;
    }

    // Если внутренний ID не найден или это число (значит это Telegram ID, а не ID из БД)
    if (!internalUserId || typeof internalUserId !== 'string' || !isNaN(Number(internalUserId))) {
        console.warn('🛑 Generation blocked: User lacks internal database ID (not fully authenticated with backend)', { internalUserId });

        // Открываем модалку входа автоматически
        if (window.openAuthModal) {
            window.openAuthModal();
        }
        return;
    }

    // ─── ACCESS GUARD: check credits before doing anything ────────────────────
    // mode is grabbed slightly later, but we read it early here for the guard.
    // We use a lightweight early read; the full mode logic runs below as normal.
    const _earlyMode = await getSelectedModeFromComponent().catch(() => 'unknown');
    const _hasImages = window.userImageState?.images?.length > 0;
    const _accessCheck = checkGenerationAccess(_earlyMode, _hasImages);
    if (!_accessCheck.ok) {
        console.warn('🛑 Generation blocked by Access Guard:', _accessCheck);
        handleAccessDenied(_accessCheck);
        return;
    }
    // ─────────────────────────────────────────────────────────────────────────

    // Добавляем taskUUID для всего задания генерации
    const taskUUID = generateUUIDv4();
    const generationIdForCleanup = Date.now(); // Keep a local reference for cleanup safety

    try {
        const prompt = document.getElementById('promptInput').value.trim();
        const negativePrompt = document.getElementById('negativePromptInput').value.trim();
        const mode = await getSelectedModeFromComponent();
        const size = document.getElementById('sizeSelect').value;

        if (window.DEBUG_MODE === 'full') {
            console.log('🚨 [GENERATION START]');
            console.log('🚨 getSelectedModeFromComponent():', mode);
            console.log('🚨 document.getElementById("modeSelect").value:', document.getElementById('modeSelect')?.value || 'NULL');

            // 🔥 ДОСТИЧНЫЙ ДИВОЛТИНГ РЕЖИМА изображениям
            console.log('🚨 mode-cards.js selectedMode:', await import('./mode-cards.js').then(m => m.getSelectedMode()));
        }

        // 🔥 ИСПРАВЛЕНИЕ: Убираем устаревшую логику приоритета DOM элемента
        // Теперь используем только режим из компонентной системы
        let finalMode = mode;

        if (window.DEBUG_MODE === 'full') {
            console.log('🚨 USING COMPONENT MODE:', finalMode);
        }

        if (window.DEBUG_MODE === 'full') {
            console.log('🚀 Starting generation:', { prompt, style: appState.selectedStyle, mode, size });
            console.log('🔍 FINAL MODE BEFORE GENERATION OBJECT:', mode, typeof mode);

            // 🔧 ДОБАВЛЕНИЕ: Проверим userImageState
            console.log('🔍 User image state:', {
                hasImages: userImageState?.images?.length || 0,
                hasDataUrl: !!(userImageState?.images?.[0]?.dataUrl),
                hasUploadedUrl: !!(userImageState?.images?.[0]?.uploadedUrl)
            });
        }

        // Validation
        // НЕ проверяем промпт для режимов background_removal (удаление фона) и upscale_image (улучшение качества)
        if (mode !== 'background_removal' && mode !== 'upscale_image') {
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

            // Валидация negative prompt (только для DreamShaper XL и если введён)
            if (mode === 'dreamshaper_xl' && negativePrompt.trim()) {
                const trimmedNegativePrompt = negativePrompt.trim();
                if (trimmedNegativePrompt.length < 2 || trimmedNegativePrompt.length > 3000) {
                    showToast('error', 'Negative prompt must be between 2 and 3000 characters');
                    triggerHaptic('error');
                    return;
                }
            }
        }

        if (!CONFIG.WEBHOOK_URL || CONFIG.WEBHOOK_URL.includes('WEBHOOK')) {
            showToast('error', appState.translate('error_webhook_not_configured'));
            return;
        }

        // === GUARD: upscale, background_removal требуют загруженного фото ===
        // photo_session теперь гибридный режим (работает с/без изображения)
        const requiresImage = ['upscale_image', 'background_removal'].includes(mode);
        if (requiresImage) {
            const wrapper = document.getElementById('userImageWrapper');
            const hasLocalImage = userImageState?.images && userImageState.images.length > 0;

            if (!hasLocalImage) {
                wrapper?.classList.add('need-image');
                const messageKey = mode === 'upscale_image'
                    ? 'please_upload_for_upscale'
                    : mode === 'background_removal'
                        ? 'please_upload_for_background_removal'
                        : 'please_upload_photo_session';
                showToast('error', appState.translate(messageKey));
                triggerHaptic('error');
                return; // не начинаем процесс и НЕ отправляем webhook
            }
        }

        appState.startTime = Date.now();

        // Create generation record
        // 👉 Берём активную карточку из карусели и обновляем стиль
        const activeCard = document.querySelector('.carousel-2d-item.active');
        const currentStyle = (activeCard?.dataset.style || '').toLowerCase();
        appState.selectedStyle = currentStyle || appState.selectedStyle;

        // Get current strength value from slider if available
        // 🆕 SAFE: Check slider visibility by DOM instead of unreliable method call
        const strengthGroup = document.getElementById('strengthSliderGroup');
        const strengthValue = (strengthGroup && strengthGroup.style.display !== 'none' && window.strengthSlider?.getValue)
            ? window.strengthSlider.getValue() : null;

        // 🔥 НОВОЕ: Получаем конкретные размеры вместо строкового значения
        const dimensions = getSizeDimensions(size);

        // 🔥 НОВОЕ: Получаем разрешение, если оно выбрано
        const resolutionGroup = document.getElementById('resolutionGroup');
        const resolutionSelect = document.getElementById('resolutionSelect');
        const resolution = (resolutionGroup && !resolutionGroup.classList.contains('hidden') && resolutionSelect)
            ? resolutionSelect.value
            : null;

        const generation = {
            id: generationIdForCleanup,
            taskUUID: taskUUID,
            imageUUIDs: userImageState.images.map(img => img.uploadedUUID).filter(uuid => uuid),
            prompt: prompt,
            negativePrompt: '',
            style: appState.selectedStyle,
            mode: finalMode,
            width: dimensions.width,
            height: dimensions.height,
            resolution: resolution, // 🔥 ДОБАВЛЕНО
            // size: size, // Оставляем для обратной совместимости если нужно
            strength: strengthValue, // Add strength if slider is visible
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        // 🔥 ОБНОВЛЕНИЕ: Negative prompt для всех режимов с промптами (кроме background_removal и upscale_image)
        const negativePromptCheckbox = document.getElementById('negativePromptCheckbox');
        const modesWithPrompts = !['background_removal', 'upscale_image'].includes(finalMode);

        if (modesWithPrompts && negativePromptCheckbox && negativePromptCheckbox.checked) {
            generation.negativePrompt = negativePrompt.trim();
            console.log('📝 Negative prompt included in generation for mode:', finalMode);
        } else {
            console.log('🚫 Negative prompt NOT included (checkbox not checked or mode without prompts)');
        }

        // 🔥 КРИТИЧЕСКОЕ: НЕ ДОБАВЛЯЕМ GENERATION В ИСТОРИЮ ЗДЕСЬ - ТОЛЬКО ПРЕВЬЮ CARDS
        // Теперь генерация добавляется в историю ТОЛЬКО после получения реального результата в parallel-generation.js
        console.log('🗂️ Generation object created, history will be added only on successful completion');

        // Функция создания превью карточки (доступна глобально для callback из модального окна)
        window.createPreviewForGeneration = (gen) => {
            console.log('🚀 Starting preview creation in createPreviewForGeneration - GEN:', gen.id);

            const historyList = document.getElementById('historyList');
            const historyBtn = document.getElementById('historyToggleBtn');

            console.log('✅ Elements found - historyList:', !!historyList, 'historyBtn:', !!historyBtn);

            // 📍 2. Создаем превью элемент
            console.log('🔧 Calling createLoadingHistoryItem...');
            const previewItem = createLoadingHistoryItem(gen);
            console.log('✅ Preview item created:', previewItem ? 'SUCCESS' : 'FAILED', previewItem);

            // 📍 ПРОВЕРКА: Есть ли элемент в DOM после создания?
            const checkElement = document.getElementById(`loading-${gen.id}`);
            console.log('🔍 Check - element exists in DOM:', !!checkElement);
            if (checkElement) {
                console.log('🎯 Element DOM details:', {
                    id: checkElement.id,
                    className: checkElement.className,
                    parent: checkElement.parentElement?.id,
                    childrenCount: checkElement.children?.length
                });
            }

            // 📍 3. Открываем историю если была закрыта С ПРОВЕРКОЙ НА ПОЗИЦИЮ
            let wasHidden = false;
            if (historyList && historyList.classList.contains('hidden')) {
                wasHidden = true;
                console.log('📂 History was hidden, opening it...');
                toggleHistoryList(); // Открываем историю
            } else {
                console.log('📂 History already open - keeping position and scroll!');
                // НЕ ОБНОВЛЯЕМ дисплей - чтобы позиция и скролл не сбросились!
            }

            setTimeout(() => {
                const finalElement = document.getElementById(`loading-${gen.id}`);
                console.log('🎯 Scrolling attempt - element exists:', !!finalElement);

                if (finalElement) {
                    console.log('🎯 Final scroll to preview:', finalElement.id);
                    finalElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                    });
                    console.log('📋 Scrolled to new preview successfully');
                } else {
                    console.log('ℹ️ Preview element already processed or removed, skipping scroll');
                }
            }, 300); // Ждем открытия истории

            console.log('📋 Generation preview flow completed for:', gen.id);
        };

        // Создаем превью СРАЗУ для ВСЕХ режимов КРОМЕ photo_session и nano_banana_pro без изображений
        // Sound/Edit вкладки всегда создают превью сразу, не показывая модалку
        const isSoundOrEditTab = window._currentGenerationTab === 'sound' || window._currentGenerationTab === 'edit';
        if (isSoundOrEditTab ||
            !(mode === 'nano_banana' && userImageState.images.length === 0) &&
            !(mode === 'nano_banana_2' && userImageState.images.length === 0) &&
            !(mode === 'nano_banana_pro' && userImageState.images.length === 0)) {
            console.log('🎯 Creating preview immediately for mode:', mode);
            window.createPreviewForGeneration(generation);
        } else {
            console.log('⚠️ Skipping preview creation for ', mode, ' without images - will create after modal choice');
        }

        // === ПРЕДПАРОДНАЯ ПРОВЕРКА для photo_session и nano_banana_pro без изображения ===
        // Пропускаем модалку для Sound/Edit вкладок — там нет смысла в изображении
        if (!isSoundOrEditTab && (mode === 'nano_banana' || mode === 'nano_banana_2' || mode === 'nano_banana_pro') && userImageState.images.length === 0) {
            // 🔥 ДОБАВЛЕНО: Проверяем sessionStorage, показываем ли модалку уже в этой сессии
            const modalShownKey = `modal_shown_${mode}`;
            const modalAlreadyShown = sessionStorage.getItem(modalShownKey) === 'true';

            if (!modalAlreadyShown) {
                // Показываем модалку только если еще не показывали в этой сессии
                console.log(`🎯 Showing modal for ${mode} mode (first time in session)`);

                // 🔥 Сохраняем generation в глобальную переменную для доступа из модального окна
                window.currentGeneration = generation;

                // Отмечаем, что модалка была показана для этого режима в этой сессии
                sessionStorage.setItem(modalShownKey, 'true');

                // Останавливаем немедленную генерацию и показываем предупреждение
                const shouldContinue = await showWarningAboutNoImage();

                if (!shouldContinue) {
                    // Пользователь решил добавить изображение - отменяем генерацию
                    // Фокусируемся на зоне загрузки
                    const dropzone = document.getElementById('imageDropzone');
                    if (dropzone) {
                        dropzone.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        // Добавим эффект подсветки
                        dropzone.classList.add('ring-4', 'ring-blue-500', 'ring-opacity-50');
                        setTimeout(() => dropzone.classList.remove('ring-4', 'ring-blue-500', 'ring-opacity-50'), 1500);
                    }
                    return; // НЕ отправляем webhook
                }

                // Продолжаем генерацию без изображения (text-to-image режим)
                console.log(`🎯 Modal accepted, proceeding with ${mode} mode without image (first time)`);
                // Так как превью не было создано выше, создаем его сейчас
                window.createPreviewForGeneration(generation);
            } else {
                console.log(`🎯 Skipping modal for ${mode} mode (already shown in this session)`);
                // Если модалка уже была показана, создаем превью сразу без модалки
                window.createPreviewForGeneration(generation);
            }
        }

        startTimer();

        // 🔥 КРИТИЧЕСКОЕ ОБНОВЛЕНИЕ ПОСЛЕДОВАТЕЛЬНОСТИ:
        // 1) Сначала загружаем изображения (если есть)
        // 2) Только ПРИ УСПЕХЕ изображения добавляем генерацию в менеджер

        const imageUploadSuccess = await (async () => {
            // 1) Если выбрано пользовательское изображение — загрузим все на Runware как PRIORITY
            if (userImageState.images.length > 0) {
                try {
                    console.log('🚀 Starting Runware image upload process with priority + fallback');

                    // Используем обновленную функцию uploadUserImages (теперь с UUID + base64)
                    const imageResult = await uploadUserImages(); // Возвращает { imageUUIDs: [...], imageData: {...} }

                    if (imageResult && (
                        (imageResult.imageUUIDs && imageResult.imageUUIDs.length > 0) ||
                        (imageResult.formData && Array.from(imageResult.formData.keys()).some(k => k.startsWith('image_')))
                    )) {
                        // 🔥 НОВЫЙ МЕХАНИЗМ: Сохраняем UUIDs в generation
                        generation.imageUUIDs = imageResult.imageUUIDs || [];

                        // 🔥 НОВЫЙ МЕХАНИЗМ: Сохраняем FormData для бинарной передачи
                        generation.formData = imageResult.formData;

                        console.log('✅ Image upload successful, UUIDs and FormData ready for webhook:', {
                            uuidsCount: imageResult.imageUUIDs?.length || 0,
                            formDataFields: Array.from(imageResult.formData.keys())
                        });

                        return true; // 🔒 УСПЕШНАЯ ЗАГРУЗКА
                    } else {
                        console.warn('⚠️ No images processed successfully (no blob and no URL found in any image)');
                        return false;
                    }
                } catch (err) {
                    console.warn('❌ User images upload completely failed:', err);
                    const errorEl = document.getElementById('userImageError');
                    if (errorEl && !errorEl.textContent) {
                        errorEl.textContent = 'Не удалось загрузить изображения. Продолжим без них.';
                    }
                    return false; // 🔒 НЕУДАЧНАЯ ЗАГРУЗКА
                }
            } else {
                console.log('📷 No user images selected, proceeding with text-to-image');
                return true; // 🔒 НЕТ ИЗОБРАЖЕНИЙ - ОК
            }
        })();

        // 2) Добавляем генерацию ТОЛЬКО если изображения загружены успешно (или если изображений нет вообще)
        if (imageUploadSuccess) {
            console.log('🚀 Proceeding with generation after successful image upload');

            // Добавляем в очередь процессора генерации
            const added = generationManager.addGeneration(generation);
            if (!added) {
                console.log('⏳ Generation added to queue');
                // НЕ показываем тост "в очереди" - пользователь может быть в сомнении
            } else {
                console.log('🚀 Generation started immediately');
                // НЕ показываем тост "начата" - будет показан только результат или ошибка
            }

            // 🔥 ОТМЕНЕНО: НЕ ДОБАВЛЯЕМ В ИСТОРИЮ ЗДЕСЬ
            // Теперь генерация добавляется в историю ТОЛЬКО после успешного завершения
            console.log('📦 Generation object ready, will be stored only on completion');
        } else {
            console.error('❌ Image upload failed - generation cancelled');
            // 🔥 CRITICAL: Remove the loading card if upload fails
            if (window.generationManager && window.generationManager.removeFailedLoadingCard) {
                window.generationManager.removeFailedLoadingCard(generationIdForCleanup);
            }
            showToast('error', 'Image upload failed. Generation cancelled.');
            stopTimer();
            showGeneration();
        }
    } catch (err) {
        console.error('❌ CRITICAL ERROR in generateImage:', err);
        // Cleanup on any unexpected error
        if (window.generationManager && window.generationManager.removeFailedLoadingCard) {
            window.generationManager.removeFailedLoadingCard(generationIdForCleanup);
        }
        showToast('error', 'Critical error during generation. Please try again.');
        stopTimer();
    }
}
// 🔥 НОВЫЙ МЕХАНИЗМ: Webhook Communication с поддержкой бинарных данных
async function sendToWebhook(data) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);

    // Выбор webhook URL на основе модели
    let webhookUrl;
    let webhookType;

    if (window._currentGenerationTab === 'sound') {
        // ── Sound AI режимы ──────────────────────────────────────
        const soundSubTab = document.querySelector('.sound-sub-tab.active')?.dataset?.soundTab || 'text';
        data.action = 'Sound Generation';
        if (soundSubTab === 'image') {
            // Audio from Image: Suno AI analyze image
            webhookUrl = CONFIG.SUNO_AUDIO_FROM_IMAGE_WEBHOOK_URL;
            webhookType = 'SUNO_AUDIO_FROM_IMAGE_WEBHOOK_URL';
            data.soundMode = 'audio_from_image';
            data.mode = 'sound_from_image';
            data.soundImageBlob = window._soundImageBlob || null;
            data.soundImageUrl = window._soundImageUrl || null;
        } else {
            // Audio from Text: Suno AI generate from prompt
            webhookUrl = CONFIG.SUNO_AUDIO_FROM_TEXT_WEBHOOK_URL;
            webhookType = 'SUNO_AUDIO_FROM_TEXT_WEBHOOK_URL';
            data.soundMode = 'audio_from_text';
            data.mode = 'sound_from_text';
        }
        data.soundModel = document.getElementById('soundModelLabel')?.textContent?.trim() || 'Suno AI';
    } else if (window._currentGenerationTab === 'edit') {
        // ── Edit Image режимы ─────────────────────────────────────
        const editModelMode = window._editModel || 'nano_banana_pro';
        data.editMode = true;
        data.type = 'edit';
        data.mode = editModelMode;
        data.action = 'Image Edit';
        data.editImageBlob = window._editImageBlob || null;
        data.editImageUrl = window._editImageUrl || null;
        data.editResolution = document.getElementById('resolutionSelect')?.value || '1K';
        if (editModelMode === 'nano_banana') {
            webhookUrl = CONFIG.NANO_BANANA_WEBHOOK;
            webhookType = 'NANO_BANANA_WEBHOOK';
        } else if (editModelMode === 'nano_banana_2') {
            webhookUrl = CONFIG.NANO_BANANA_2_WEBHOOK;
            webhookType = 'NANO_BANANA_2_WEBHOOK';
        } else if (editModelMode === 'nano_banana_pro') {
            webhookUrl = CONFIG.NANO_BANANA_PRO_WEBHOOK;
            webhookType = 'NANO_BANANA_PRO_WEBHOOK';
        } else if (editModelMode === 'qwen_image_edit') {
            webhookUrl = CONFIG.QWEN_IMAGE_WEBHOOK_URL;
            webhookType = 'QWEN_IMAGE_WEBHOOK_URL';
        } else {
            webhookUrl = CONFIG.NANO_BANANA_PRO_WEBHOOK;
            webhookType = 'NANO_BANANA_PRO_WEBHOOK';
        }
    } else if (['background_removal', 'upscale_image'].includes(data.mode)) {
        // Модели улучшения изображений используют отдельный N8N вебхук
        webhookUrl = CONFIG.N8N_ENHANCE_OR_REMBG_WEBHOOK_URL;
        webhookType = 'N8N_ENHANCE_OR_REMBG_WEBHOOK_URL';
    } else if (data.mode === 'z_image') {
        // Модель Z-Image использует свой выделенный вебхук
        webhookUrl = CONFIG.Z_IMAGE_WEBHOOK_URL;
        webhookType = 'Z_IMAGE_WEBHOOK_URL';
    } else if (data.mode === 'nano_banana') {
        webhookUrl = CONFIG.NANO_BANANA_WEBHOOK;
        webhookType = 'NANO_BANANA_WEBHOOK';
    } else if (data.mode === 'nano_banana_2') {
        webhookUrl = CONFIG.NANO_BANANA_2_WEBHOOK;
        webhookType = 'NANO_BANANA_2_WEBHOOK';
    } else if (data.mode === 'nano_banana_pro') {
        webhookUrl = CONFIG.NANO_BANANA_PRO_WEBHOOK;
        webhookType = 'NANO_BANANA_PRO_WEBHOOK';
    } else if (data.mode === 'video_gen' || data.mode === 'image_to_video' || data.mode === 'video_edit') {
        // Специальные видео режимы используют общий вебхук
        webhookUrl = CONFIG.WEBHOOK_URL;
        webhookType = 'WEBHOOK_URL';
    } else if (['qwen_image', 'qwen_image_edit'].includes(data.mode)) {
        // Модель Qwen использует свой выделенный вебхук
        webhookUrl = CONFIG.QWEN_IMAGE_WEBHOOK_URL;
        webhookType = 'QWEN_IMAGE_WEBHOOK_URL';
    } else {
        // Все остальные модели используют основной вебхук
        webhookUrl = CONFIG.WEBHOOK_URL;
        webhookType = 'WEBHOOK_URL';
    }

    console.log('🎯 Webhook selection:', {
        mode: data.mode,
        webhookType,
        webhookUrl
    });

    // 🔥 НОВОЕ: Определяем тип данных - JSON или FormData с бинарными файлами
    const isFormData = data.formData instanceof FormData;

    // 🔥 СИНХРОНИЗАЦИЯ: Если есть FormData, обновляем в ней поля mode и action
    if (isFormData) {
        if (data.mode) data.formData.set('mode', data.mode);
        if (data.action) data.formData.set('action', data.action);
        if (data.soundMode) data.formData.set('soundMode', data.soundMode);
        if (data.editMode) data.formData.set('editMode', String(data.editMode));
    }

    console.log('🔍 Data type detection:', {
        isFormData,
        hasFormData: !!data.formData,
        hasImageUUIDs: !!data.imageUUIDs
    });

    let requestBody, headers, contentType;

    if (isFormData) {
        // 🔥 БИНАРНЫЙ РЕЖИМ: Используем FormData с файлами
        console.log('📦 BINARY MODE: Preparing FormData request');

        requestBody = data.formData;

        // Текстовые поля уже добавлены в parallel-generation.js

        // Не устанавливаем Content-Type - браузер сам установит multipart/form-data с boundary
        headers = {
            'Accept': 'application/json'
        };

        contentType = 'multipart/form-data (auto)';
        console.log('📤 BINARY request prepared with FormData fields:', Array.from(requestBody.keys()));

    } else {
        // 🔥 СТАРЫЙ РЕЖИМ: JSON для обратной совместимости
        console.log('📄 JSON MODE: Preparing JSON request');

        const requestData = {
            ...data,
            prompt: sanitizeJsonString(data.prompt) // Restore sanitize for JSON safety
        };

        requestBody = JSON.stringify(requestData);
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        contentType = 'application/json';
        console.log('📤 RAW JSON webhook request body (first 500 chars):', requestBody.substring(0, 500));
    }

    try {
        console.log('📤 Sending webhook request:', {
            mode: data.mode,
            hasImages: isFormData,
            prompt: data.prompt?.substring(0, 100) + (data.prompt?.length > 100 ? '...' : '') // Логируем первые 100 символов промпта
        });

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: headers,
            body: requestBody,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log('📥 Webhook response status:', response.status, response.statusText);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Проверяем Content-Type
        const contentType = response.headers.get('content-type');
        console.log('📄 Response content-type:', contentType);

        let result;
        try {
            const responseText = await response.text();
            console.log('📄 FULL RAW response text (first 1000 chars):', responseText.substring(0, 1000));
            console.log('📄 Response length:', responseText.length);
            console.log('📄 HTTP Status Code:', response.status);
            console.log('📄 All Response Headers:', Object.fromEntries(response.headers.entries()));

            // 🔥 ДОПОЛНИТЕЛЬНОЕ ЛОГИРОВАНИЕ: Парсим как JSON и показываем структуру если возможно
            try {
                const possibleJson = JSON.parse(responseText);
                console.log('🔍 POSSIBLE PARSED JSON STRUCTURE:', possibleJson);
                console.log('🔍 JSON keys:', Object.keys(possibleJson));
            } catch (parseError) {
                console.log('🔍 NOT VALID JSON - possibly text/html response from Make.error');
            }

            // 🔥 ОБНОВЛЕНИЕ: Обработка "accepted" ответа как системного подтверждения
            if (responseText.trim().toLowerCase() === 'accepted') {
                console.log('📡 SERVER ACCEPTED: Request received and is being processed');
                return { status: 'accepted' };
            }

            // 🔥 ДОБАВИЛИ ПРОВЕРКУ НА ДРУГИЕ ТЕКСТОВЫЕ ОТВЕТЫ ПЕРЕГРУЗКИ
            if (responseText.trim().includes('overload') || responseText.trim().includes('busy') ||
                responseText.trim().includes('maintenance') || responseText.trim().includes('timeout')) {
                console.log('🚨 SERVER OVERLOADED: Detected overload keywords in response');
                result = { server_overloaded: true, message: appState.translate('error_server_overloaded') };
                return result;
            }

            if (contentType && contentType.includes('application/json')) {
                result = JSON.parse(responseText);
                console.log('✅ Parsed webhook response as JSON:', result);
            } else if (contentType && contentType.includes('text/')) {
                // Сервер вернул текст (не JSON и не "accepted")
                console.log('📄 Server returned text:', responseText);
                throw new Error('Server returned text instead of JSON: ' + responseText);
            } else {
                // Неопределённый content-type — пытаемся спарсить как JSON
                console.log('📄 Unexpected content-type, trying to parse as JSON:', responseText);
                try {
                    result = JSON.parse(responseText);
                    console.log('✅ Fallback: parsed as JSON despite content-type');
                } catch (parseError) {
                    console.error('❌ Failed to parse response as JSON:', responseText);
                    throw new Error('Server returned invalid format: ' + responseText.substring(0, 100));
                }
            }
        } catch (error) {
            console.error('❌ Response processing error:', error);
            if (error instanceof SyntaxError) {
                throw new Error('Server returned malformed JSON');
            }
            throw error;
        }

        console.log('✅ Final processed webhook response:', result);
        return result;

    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            throw new Error(appState.translate('error_timeout'));
        }

        // ДОБАВЛЕНИЕ: Детальная обработка сетевых ошибок
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Connection failed. Check your internet connection and try again.');
        }

        // ДОБАВЛЕНИЕ: Обработка ошибок сети и CORS
        if (error.name === 'NetworkError' || error.message.includes('network') || error.message.includes('CORS')) {
            throw new Error('Network error. Please check your connection and try again.');
        }

        console.error('❌ Webhook error:', error);
        throw error;
    }
}


// 🔄 Action Functions
function newGeneration() {
    showGeneration();
    // Clear form
    //  document.getElementById('promptInput').value = '';
    //  document.getElementById('charCounter').textContent = '0';
}

function cancelGeneration() {
    if (appState.currentGeneration) {
        appState.currentGeneration.status = 'cancelled';
        appState.currentGeneration.error = 'Cancelled by user';
    }

    appState.isGenerating = false;
    stopTimer();
    showGeneration();
    triggerHapticFeedback('medium');
}

/* УДАЛЕНА: СТАРАЯ ФУНКЦИЯ downloadImage - теперь используем новую из utils.js */

// 📱 Новая оптимизированная функция скачивания/шаринга с новым API
async function downloadImage() {
    if (!appState.currentGeneration?.result) return;

    // Используем новую универсальную функцию из utils.js
    const result = await downloadOrShareImage(appState.currentGeneration.result, {
        filename: `ai-generated-${appState.currentGeneration.id}.png`
    });

    // Обновляем текущую генерацию в интерфейсе если результат получен
    if (result.success && result.method !== 'failed') {
        // Кнопка уже заблокирована, но обновим статус если нужно
        console.log('✅ Download/share completed successfully with method:', result.method);
    }

    return result;
}
/*function downloadImage() {
    if (!appState.currentGeneration?.result) return;

    const link = document.createElement('a');
    link.href = appState.currentGeneration.result;
    link.download = `ai-generated-${appState.currentGeneration.id}.png`;
    link.click();

    showToast('info', appState.translate('download_started'));
    triggerHaptic('light');
}
*/

async function shareImage() {
    const gen = appState.currentGeneration;
    if (!gen?.result) return;

    const imageUrl = gen.result;
    const prompt = (gen.prompt || 'pixPLace Image').trim();
    const botUrl = CONFIG.TELEGRAM_BOT_URL || 'https://t.me/your_bot';
    const hashtags = CONFIG.SHARE_DEFAULT_HASHTAGS || '#pixPLace';

    // Заголовок + текст публикации
    const title = prompt.length > 100 ? (prompt.slice(0, 97) + '...') : prompt;
    const postText = `${prompt}\n\nCreated with pixPLace ✨\nTry it: ${botUrl}\n${hashtags}`;

    // Функция на случай фолбэка — открыть Pinterest composer и скопировать текст
    const openPinterestFallback = async () => {
        try {
            // Откроем Pinterest Pin Builder c медиа и ссылкой на бота
            const pinUrl = `https://www.pinterest.com/pin-builder/?` +
                `media=${encodeURIComponent(imageUrl)}` +
                `&url=${encodeURIComponent(botUrl)}` +
                `&description=${encodeURIComponent(postText)}`;
            window.open(pinUrl, '_blank', 'noopener,noreferrer');

            // Параллельно скопируем текст
            try {
                await navigator.clipboard.writeText(postText);
                showToast('info', appState.translate('copied_to_clipboard'));
            } catch { }
            triggerHaptic('light');
        } catch (e) {
            console.error('Pinterest fallback error:', e);
            // Крайний фолбэк — просто копируем ссылку на бота + текст
            try {
                await navigator.clipboard.writeText(`${postText}`);
                showToast('info', appState.translate('copied_to_clipboard'));
            } catch { }
        }
    };

    // Пытаемся зашарить файл (Web Share API Level 2)
    try {
        // Скачаем изображение как blob (может упасть из-за CORS — обработаем)
        const resp = await fetch(imageUrl, { mode: 'cors' });
        const blob = await resp.blob();

        const extByType = {
            'image/png': 'png',
            'image/jpeg': 'jpg',
            'image/webp': 'webp',
            'image/gif': 'gif'
        };
        const ext = extByType[blob.type] || 'png';

        // Имя файла из промпта
        const safeName = (prompt || 'pixplace-image')
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\-_. ]/gu, '') // оставить буквы/цифры/дефис/подчёркивание/точку/пробел
            .trim()
            .replace(/\s+/g, '-')
            .slice(0, 60) || 'pixplace-image';

        const file = new File([blob], `${safeName}.${ext}`, { type: blob.type || 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            const shareData = {
                title,
                text: postText,
                files: [file],
                // url можно добавить; некоторые шары игнорируют при наличии files
                url: botUrl
            };

            await navigator.share(shareData);
            triggerHaptic('light');
            return;
        }

        // Если canShare с файлами не поддерживается — Pinterest фолбэк
        await openPinterestFallback();
    } catch (err) {
        // Если не удалось скачать blob (часто из-за CORS) — уйдём в Pinterest фолбэк
        console.warn('Share with file failed (likely CORS). Fallback to Pinterest:', err);
        await openPinterestFallback();
    }
}



// 🌍 Global Functions
window.toggleLanguage = () => appState.toggleLanguage();
window.toggleTheme = () => appState.toggleTheme();
window.showHistory = showHistory;
window.showGeneration = showGeneration;
window.showProcessing = showProcessing;
//window.selectStyle = selectStyle;
window.selectStyle = (s) => window.setCarouselStyle(s);
window.generateImage = generateImage;
window.newGeneration = newGeneration;
window.cancelGeneration = cancelGeneration;
window.clearHistory = clearHistory;
window.downloadImage = downloadImage;
window.shareImage = shareImage;
// 🎵 Music Functions - REMOVED: music widget не существует в DOM
// Удалена дублирующая функция loadTelegramSDK - инициализация происходит только в index.html

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
// Добавьте в конец файла:
window.closeLimitModal = () => {
    const modal = document.getElementById('limitModal');
    if (modal) {
        modal.classList.remove('show');
        showGeneration();
    }
};

// Импортируем из модуля

// Теперь используем импортированные функции


// 🔥 КАРУСЕЛЬ ПЛАНОВ В ЛИМИТ МОДАЛ
// Глобальные переменные для управления каруселью планов
let planCarouselInterval = null;
let currentPlanSlide = 0;

function initPlansCarousel() {
    const carousel = document.querySelector('.plans-carousel');
    const indicators = document.querySelectorAll('.indicator');

    // Добавляем функцию highlight для работы с карточками планов
    function highlight(card, options = {}) {
        if (!card) return;

        // Убираем активный класс со всех карточек планов
        document.querySelectorAll('.plan-card').forEach(c => {
            c.classList.remove('active');
        });

        // Добавляем активный класс выбранной карточке
        if (card && typeof card.classList !== 'undefined') {
            card.classList.add('active');
        }

        console.log('Карточка плана выделена:', card ? 'OK' : 'null');
    }

    if (!carousel || !indicators.length) {
        // console.log('Plans carousel not found, skipping init'); // Removed spam log
        return;
    }

    const cards = document.querySelectorAll('.plan-card');
    const totalSlides = Math.ceil(cards.length / 3); // 3 карточки на слайд

    // Функция для обновления индикаторов
    function updateIndicators(activeIndex) {
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === activeIndex);
        });
    }

    // Функция для прокрутки к слайду
    function scrollToSlide(slideIndex) {
        currentPlanSlide = slideIndex;
        const cardWidth = cards[0].offsetWidth;
        const gap = 16; // Расстояние между карточками в px
        const scrollLeft = slideIndex * (cardWidth * 3 + gap * 2);
        carousel.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
        updateIndicators(slideIndex);
    }

    // Убираем автопрокрутку полностью, оставляем только пользовательское управление

    // Клик по индикаторам (остался функционал)
    indicators.forEach((indicator, index) => {
        let lastClickTime = 0;

        indicator.addEventListener('click', (e) => {
            e.preventDefault();
            const now = Date.now();
            if (now - lastClickTime < 800) return; // предотвращаем спам клики
            lastClickTime = now;

            scrollToSlide(index);
        });
    });

    // Свайпы - чистое пользовательское управление (без задержек)
    let touchStartX = 0;
    let touchStartTime = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartTime = Date.now();
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', (e) => {
        const touchDuration = Date.now() - touchStartTime;
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        // Определяем направление свайпа
        if (Math.abs(diff) > 50 && touchDuration < 500) {
            if (diff > 0) {
                // Свайп влево -> следующий слайд
                if (currentPlanSlide < totalSlides - 1) {
                    scrollToSlide(currentPlanSlide + 1);
                }
            } else {
                // Свайп вправо -> предыдущий слайд
                if (currentPlanSlide > 0) {
                    scrollToSlide(currentPlanSlide - 1);
                }
            }
        }
    });

    // ИНИЦИАЛИЗАЦИЯ - ПРОСТО ЦЕНТРИРУЕМ PRO КАРТУ (индекс 1)
    const centerCardIndex = 1; // Про = индекс 1 (самый популярный план)
    const centerCard = cards[centerCardIndex];

    if (centerCard) {
        setTimeout(() => {
            const containerWidth = carousel.offsetWidth;
            const cardWidth = centerCard.offsetWidth;
            const cardLeft = centerCard.offsetLeft;
            const scrollPosition = cardLeft - (containerWidth / 2) + (cardWidth / 2);
            carousel.scrollLeft = Math.max(0, scrollPosition);

            // Простое центрирование одной строкой
            setTimeout(() => {
                centerCard.scrollIntoView({
                    behavior: 'instant',
                    block: 'nearest',
                    inline: 'center'
                });
            }, 100);
        }, 50);
    }

    highlight(cards[centerCardIndex], { scroll: false });
    updateIndicators(centerCardIndex);
    console.log('🔥 Plans carousel initialized - centered on PRO plan, auto-scroll REMOVED');
}
// Make valid globally for when modal is loaded
window.initPlansCarousel = initPlansCarousel;

// 🎯 ОБРАБОТЧИКИ ДЛЯ КАРТОЧЕК ПЛАНОВ
function initPlanCards() {
    const cards = document.querySelectorAll('.plan-card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const planType = card.className.includes('lite') ? 'lite' :
                card.className.includes('pro') ? 'pro' : 'studio';

            // Анимация выбора
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            card.style.animation = 'pulse 0.6s ease-out';
            setTimeout(() => {
                card.style.animation = '';
            }, 600);

            console.log('Selected plan:', planType);
        });

        // Эффекты при наведении
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-12px) scale(1.03)';
        });

        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('selected')) {
                card.style.transform = '';
            }
        });
    });
}



// ИНИЦИАЛИЗАЦИЯ КАРУСЕЛИ ПРИ ПОКАЗЕ МОДАЛА
document.addEventListener('DOMContentLoaded', function () {
    // Наблюдатель за появлением модала лимита
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const modal = document.getElementById('limitModal');
                if (modal && modal.classList.contains('show')) {
                    // Модал появился - инициализируем карусель
                    setTimeout(() => {
                        initPlansCarousel();
                        initPlanCards();
                        // Use global services if available
                        if (window.appServices?.ui?.initGlassmorphismEffects) {
                            window.appServices.ui.initGlassmorphismEffects();
                        } else {
                            console.log('🔄 UI services not ready yet, skipping glassmorphism effects');
                        }
                    }, 100);
                }
            }
        });
    });

    const limitModal = document.getElementById('limitModal');
    if (limitModal) {
        observer.observe(limitModal, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    // 🔥 HISTORY INITIALIZATION
    // Explicitly update history display on startup
    initHistory();
});

// Helper to initialize history
async function initHistory() {
    // 🔍 DEBUG: Logger
    const log = (msg) => {
        console.log('[HistoryDebug]', msg);
    };

    log('🕰️ InitHistory START');

    // Check if appState and services are ready
    if (window.appState && window.appServices && window.appServices.history) {
        log('✅ Services Ready');
        try {
            // 1. Fetch latest from server
            try {
                log('📡 Fetch(0,30)...');
                const historyService = window.appServices.history;
                const userId = window.appState.user?.id || (historyService.testMode ? 'test_user' : null);
                log(`👤 User: ${userId}`);

                // 🔥 FORCE CLEAR CACHE to ensure we get data with IDs (after fix)
                if (historyService.clearCache) {
                    historyService.clearCache();
                    log('🧹 History Cache Cleared');
                }

                const data = await historyService.loadHistoryPage(userId, 0, 30, true);

                if (data && data.generations) {
                    log(`✅ Fetched: ${data.generations.length} items`);

                    if (window.appState.setExternalHistory) {
                        window.appState.setExternalHistory({ generations: data.generations });
                    } else if (window.appState.setGenerationHistory) {
                        window.appState.setGenerationHistory(data.generations);
                    }
                } else {
                    log('⚠️ Data/Gens missing');
                }
            } catch (fetchError) {
                log(`⚠️ Fetch Error: ${fetchError.message}`);
            }

            // 2. Update UI (Always run this!)
            log('🔄 Calling updateHistoryDisplay(0)...');
            try {
                if (typeof updateHistoryDisplay === 'function') {
                    updateHistoryDisplay(0);
                }
                if (typeof updateHistoryCount === 'function') {
                    updateHistoryCount();
                }
                log('✅ Display Updated');
            } catch (e) {
                log(`❌ Display Error: ${e.message}`);
            }

            // Check DOM
            setTimeout(() => {
                const list = document.getElementById('historyList');
                log(`🔍 DOM List Children: ${list ? list.children.length : 'NULL'}`);
                if (list) {
                    log(`📄 List text: ${list.innerText.substring(0, 50)}...`);
                    log(`👁️ List hidden? ${list.classList.contains('hidden')}`);
                }
            }, 1000);

        } catch (e) {
            log(`❌ Critical Error: ${e.message}`);
        }
    } else {
        log('⏳ Services NOT Ready (Retry)');
        setTimeout(initHistory, 500);
    }
}

// ============================================================
// IMAGE & VIDEO STYLE CHIPS
// ============================================================
const _selectedImageStyles = new Set();
window.addImageStyle = function (btn) {
    const style = btn.dataset.style;
    const allButtonsWithStyle = document.querySelectorAll('button.style-chip[data-style="' + style + '"]');

    if (_selectedImageStyles.has(style)) {
        _selectedImageStyles.delete(style);
        allButtonsWithStyle.forEach(b => b.classList.remove('active'));
    } else {
        _selectedImageStyles.add(style);
        allButtonsWithStyle.forEach(b => b.classList.add('active'));
    }
    const ta = document.getElementById('promptInput');
    if (ta && style) {
        const current = ta.value.trim();
        if (!current.includes(style)) {
            ta.value = current ? current + ', ' + style + ' style' : style + ' style';
            ta.dispatchEvent(new Event('input'));
        }
    }
};

window.toggleImageMoreStyles = function () {
    const container = document.getElementById('imageMoreStyles');
    const btn = document.getElementById('imageMoreBtn');
    if (!container) return;
    const isHidden = container.classList.contains('hidden');
    container.classList.toggle('hidden', !isHidden);
    if (btn) btn.textContent = isHidden ? 'Less ▴' : 'More ▾';
};

const _selectedVideoStyles = new Set();
window.addVideoStyle = function (btn) {
    const style = btn.dataset.style;
    const allButtonsWithStyle = document.querySelectorAll('button.style-chip[data-style="' + style + '"]');

    if (_selectedVideoStyles.has(style)) {
        _selectedVideoStyles.delete(style);
        allButtonsWithStyle.forEach(b => b.classList.remove('active'));
    } else {
        _selectedVideoStyles.add(style);
        allButtonsWithStyle.forEach(b => b.classList.add('active'));
    }
    const ta = document.getElementById('promptInput');
    if (ta && style) {
        const current = ta.value.trim();
        if (!current.includes(style)) {
            ta.value = current ? current + ', ' + style + ' style' : style + ' style';
            ta.dispatchEvent(new Event('input'));
        }
    }
};

window.toggleVideoMoreStyles = function () {
    const container = document.getElementById('videoMoreStyles');
    const btn = document.getElementById('videoMoreBtn');
    if (!container) return;
    const isHidden = container.classList.contains('hidden');
    container.classList.toggle('hidden', !isHidden);
    if (btn) btn.textContent = isHidden ? 'Less ▴' : 'More ▾';
};