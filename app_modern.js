import { en } from './dictionaries/en.js';
import { ru } from './dictionaries/ru.js';
import { es } from './dictionaries/es.js';
import { fr } from './dictionaries/fr.js';
import { de } from './dictionaries/de.js';
import { zh } from './dictionaries/zh.js';
import { pt } from './dictionaries/pt.js';
import { ar } from './dictionaries/ar.js';
import { hi } from './dictionaries/hi.js';
import { ja } from './dictionaries/ja.js';
import { it } from './dictionaries/it.js';
import { ko } from './dictionaries/ko.js';
import { tr } from './dictionaries/tr.js';
import { pl } from './dictionaries/pl.js';

// 🚀 Modern AI Image Generator WebApp

// Configuration
const CONFIG = {
    WEBHOOK_URL: 'https://hook.us2.make.com/x2hgl6ocask8hearbpwo3ch7pdwpdlrk', // ⚠️ ЗАМЕНИТЕ НА ВАШ WEBHOOK!
    CHAT_WEBHOOK_URL: 'https://hook.us2.make.com/xsj1a14x1qaterd8fcxrs8e91xwhvjh6', // ⚠️ ЗАМЕНИТЕ НА WEBHOOK ДЛЯ ЧАТА!
    TIMEOUT: 120000, // 120 секунд
    LANGUAGES: ['en', 'ru', 'es', 'fr', 'de', 'zh', 'pt', 'ar', 'hi', 'ja', 'it', 'ko', 'tr', 'pl'],
    DEFAULT_LANGUAGE: 'en',
    DEFAULT_THEME: 'dark', // 'light', 'dark', 'auto'
    IMGBB_API_KEY: '34627904ae4633713e1fee94a243794e', // только для тестов/прототипа
    MAX_IMAGE_MB: 10,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    PREVIEW_MAX_W: 1024,
    PREVIEW_MAX_H: 1024,
    PREVIEW_JPEG_QUALITY: 0.9,
    TELEGRAM_BOT_URL: 'https://t.me/pixPLaceBot?start=user_shared', // Замените на ссылку вашего бота
    SHARE_DEFAULT_HASHTAGS: '#pixPLaceBot #Telegram #Ai'
};
// 🔧 Device detection helpers
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isAndroid() {
    return /Android/i.test(navigator.userAgent);
}

function isTablet() {
    return /iPad|Android(?=.*\bMobile\b)|Tablet/i.test(navigator.userAgent) || isAndroid();
}

function supportsShare() {
    return navigator.share && navigator.canShare;
}

// 🌍 Translations
const TRANSLATIONS = {
    en,
    ru,
    es,
    fr,
    de,
    zh,
    pt,
    ar,
    hi,
    ja,
    it,
    ko,
    tr,
    pl
};


class AppState {
    constructor() {
        this.tg = null;
        this.currentLanguage = CONFIG.DEFAULT_LANGUAGE;
        this.currentTheme = 'dark';
        this.selectedStyle = 'realistic';
        this.userId = null;
        this.userName = null;
        this.generationHistory = [];
        this.currentGeneration = null;
        this.startTime = null;
        this.timerInterval = null;
        // Добавлено отображение баланса пользователя
        this.userCredits = null; // текущий баланс кредитов
        this.lastBalanceUpdate = null; // время последнего обновления баланса
        this.balanceHistory = []; // история изменений баланса: [{balance, timestamp, reason}]
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
        // Обычные элементы с data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.translate(key);
        });

        // Элементы с placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.translate(key);
        });

        // Элементы с data-i18n-price для ценовых данных
        document.querySelectorAll('[data-i18n-price]').forEach(element => {
            const key = element.getAttribute('data-i18n-price');
            element.textContent = this.translate(key);
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

    saveBalanceHistory() {
        try {
            localStorage.setItem('balanceHistory', JSON.stringify(this.balanceHistory));
        } catch (error) {
            console.error('Failed to save balance history:', error);
        }
    }

    loadBalanceHistory() {
        try {
            const history = localStorage.getItem('balanceHistory');
            if (history) {
                this.balanceHistory = JSON.parse(history);
                // Инициализируем текущий баланс самым свежим значением из истории
                if (this.balanceHistory.length > 0) {
                    const latestEntry = this.balanceHistory[this.balanceHistory.length - 1];
                    this.userCredits = latestEntry.balance;
                    this.lastBalanceUpdate = latestEntry.timestamp;
                }
            } else {
                this.balanceHistory = [];
            }
        } catch (error) {
            console.error('Failed to load balance history:', error);
            this.balanceHistory = [];
        }
    }
}

// 🎯 Global state
const appState = new AppState();

// Экспортируем appState в window для доступа из параллельной генерации
window.appState = appState;

// ⚡ Ultra-Fast Global Image Loading Manager - Max Performance
class GlobalHistoryLoader {
    constructor() {
        // Singleton pattern - only one Observer per app
        if (GlobalHistoryLoader.instance) {
            return GlobalHistoryLoader.instance;
        }

        this.imageObserver = new IntersectionObserver(
            this.handleIntersection.bind(this),
            {
                rootMargin: '150px', // еще шире для гарантированного захвата видимых элементов
                threshold: [0.01, 0.005, 0.001], // ультра-агрессивные пороги для любого намека видимости
                root: null, // viewport
            }
        );

        // Оптимизированные registry с Map для O(1) доступа
        this.observedImages = new Map();
        this.loadingQueue = new Set();
        this.maxConcurrent = 12; // ограничиваем одновременные загрузки (увеличено для максимальной скорости)
        this.pendingQueue = []; // очередь ожидающих загрузки
        this.logout = false;

        // Новое: конфигурация для eager loading маленьких списков
        this.eagerLoadingLimit = 50; // для списков до 50 изображений - eager loading

        GlobalHistoryLoader.instance = this;
        console.log('🚀 Ultra-Fast Global History Loader initialized with aggressive loading');
    }

    handleIntersection(entries, observer) {
        if (this.logout) return;

        // Убираем спам - логируем только если много записей (предупреждение о перегрузке)
        if (entries.length > 10) {
            console.warn('⚡ IntersectionObserver triggered:', entries.length, 'entries - performance warning');
        }

        // Оптимизированная обработка с агрессивными порогами для максимальной скорости загрузки
        const highPriorityEntries = [];
        const normalPriorityEntries = [];
        const lowPriorityEntries = [];
        const invisibleEntries = [];

        for (const entry of entries) {
            // Убираем спам - логируем только в 2% случаев и только базовую информацию
            if (Math.random() < 0.02) {
                console.log('📊 Entry intersection:', entry.intersectionRatio.toFixed(3));
            }

            if (entry.isIntersecting) {
                // Высокий приоритет - изображения даже с минимальной видимостью (1%+ для скорости)
                if (entry.intersectionRatio >= 0.01) {
                    highPriorityEntries.push(entry);
                }
                // Нормальный приоритет - очень слабая видимость (0.5%+)
                else if (entry.intersectionRatio >= 0.005) {
                    normalPriorityEntries.push(entry);
                }
                // Низкий приоритет - минимальная видимость (0.1%+)
                else if (entry.intersectionRatio > 0.001) {
                    lowPriorityEntries.push(entry);
                }
            } else {
                invisibleEntries.push(entry);
            }
        }

        // Обрабатываем с высоким приоритетом вначале
        if (highPriorityEntries.length > 0 || normalPriorityEntries.length > 0) {
            console.log('🎯 Processing high/normal priority images:', highPriorityEntries.length + normalPriorityEntries.length);
            this.processVisibleImages([...highPriorityEntries, ...normalPriorityEntries]);
        }

        // Низкий приоритет обрабатываем с задержкой
        if (lowPriorityEntries.length > 0) {
            setTimeout(() => {
                console.log('🎯 Processing low priority images:', lowPriorityEntries.length);
                this.processVisibleImages(lowPriorityEntries);
            }, 200);
        }

        // Очищаем невидимые изображения (низкий приоритет)
        if (invisibleEntries.length > 0) {
            setTimeout(() => {
                this.cleanupInvisibleImages(invisibleEntries);
            }, 1000); // отложенная очистка
        }
    }

    processVisibleImages(entries) {
        console.log(`👁️ Processing ${entries.length} visible images`);

        for (const entry of entries) {
            const img = entry.target;

            // Быстрая проверка через Map
            if (!this.observedImages.has(img)) continue;

            // Уже загруженные пропускаем
            if (img.src && !img.dataset.src) {
                this.safeUnobserve(img);
                continue;
            }

            // Ленивая загрузка только если есть src для загрузки
            if (img.dataset.src && !this.loadingQueue.has(img)) {
                this.startLoading(img);
            }
        }
    }

    startLoading(img) {
        const container = img.closest('.history-mini');

        // Пропускаем загрузку если контейнер поврежден или еще загружается
        if (!container || container.classList.contains('history-loading')) {
            return;
        }

        // Если превышен лимит параллельных загрузок - добавляем в очередь
        if (this.loadingQueue.size >= this.maxConcurrent) {
            this.pendingQueue.push(img);
            return;
        }

        this.loadingQueue.add(img);

        // Установка src с обработкой ошибок
        const loadPromise = new Promise((resolve, reject) => {
            img.onload = () => {
                img.classList.add('loaded');
                delete img.dataset.src; // очищаем data-src
                console.log('✅ Image loaded successfully');
                resolve();
            };

            img.onerror = () => {
                console.warn('❌ Image load failed - showing placeholder');
                const placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMvb3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+LmV4cGlyZWQtdGV4dHtiYTpnZW5lcmFsIFNhbnMsQXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWY7Zm9udC1zaXplOiAxNHB4O2ZpbGw6ICM5OTk5OTk7fTwvc3R5bGU+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y0ZjRmNCIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZHk9Ii4zNWVtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBjbGFzcz0iZXhwaXJlZC10ZXh0IiBzdHlsZT0iYXVjLWFncmlkLXJvd3M6IHNwYW4gMS8yOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlOyBvcGFjaXR5OiAwLjg7Ij5FeHBpcmVkPC90ZXh0PiAKPC9zdmc+';
                img.src = placeholder;
                resolve();
            };

            // Запуск загрузки
            img.src = img.dataset.src;
        });

        loadPromise.finally(() => {
            this.loadingQueue.delete(img);
            this.safeUnobserve(img);

            // Обработать следующий из очереди, если есть место
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

    // 🆕 ДОБАВЛЕНИЕ: Принудительная загрузка всех видимых превью истории
    forceLoadVisibleHistoryPreviews() {
        const historyList = document.getElementById('historyList');
        if (!historyList || historyList.classList.contains('hidden')) {
            console.log('📋 История истории скрыта или не найдена, пропускаем force load');
            return;
        }

        // Найдём все img[data-src] в видимых элементах истории
        const visibleImages = historyList.querySelectorAll('.history-mini img[data-src]');
        if (visibleImages.length === 0) {
            console.log('📋 Нет превью для загрузки в истории');
            return;
        }

        console.log(`🎯 Force loading ${visibleImages.length} history previews`);

        // Загрузим все подряд, игнорируя лимит concurrent
        visibleImages.forEach(img => {
            if (img.dataset.src && !img.src) {
                this.startLoading(img);
            }
        });

        console.log('✅ Force load completed');
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
        const validItems = appState.generationHistory.filter(item =>
            item.result &&
            typeof item.result === 'string' &&
            item.result.trim() !== '' &&
            item.result !== 'undefined'
        );

        return validItems.slice(0, limit);
    }

    static getValidItemsOnly() {
        return appState.generationHistory.filter(item =>
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
        return appState.generationHistory.length;
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
            return this.elementCache.get(cacheKey).cloneNode(true);
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
    if (!container) {
        console.error('⚠️ Toast container not found - creating fallback toast');
        // Emergency fallback toast without container
        setTimeout(() => alert(message), 100);
        return;
    }

    // Определяем иконку в зависимости от типа
    const iconMap = {
        'error': '❌',
        'warning': '⚠️',
        'success': '✅',
        'info': 'ℹ️',
        'light': '💡'
    };

    const icon = iconMap[type] || '📝';

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Добавляем иконку и animarker для progress бара
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        </div>
        <div class="toast-progress">
            <div class="toast-progress-bar"></div>
        </div>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
        // Запускаем progress бар анимацию
        const progressBar = toast.querySelector('.toast-progress-bar');
        if (progressBar) {
            progressBar.style.animation = 'toast-progress 5s linear forwards';
        }
    }, 100);

    // Remove after delay (increased for longer error messages, but shorter for success)
    const displayTime = type === 'success' ? 2000 : 5000; // 2 секунды для успешных, 5 для ошибок
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => container.removeChild(toast), 300);
    }, displayTime);
}

// Экспортируем showToast в window для доступа из параллельной генерации
window.showToast = showToast;

// Экспортируем другие функции для параллельной генерации
window.showResult = showResult;
window.showResultToast = showResultToast;
window.sendToWebhook = sendToWebhook;
window.updateHistoryItemWithImage = updateHistoryItemWithImage;

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

// 📋 History Management

function showBackButton(show) {
    const body = document.body;
    if (show) {
        body.classList.add('show-back');
    } else {
        body.classList.remove('show-back');
    }
}

// Add to global scope for ai-coach.js
window.showBackButton = showBackButton;

function toggleHistoryList() {
    const list = document.getElementById('historyList');
    const btn = document.getElementById('historyToggleBtn');
    if (list.classList.contains('hidden')) {
        list.classList.remove('hidden');
        btn.classList.add('active');
        updateHistoryDisplay();

        // Дополнительная быстрая прокрутка к последнему (нижнему) изображению после открытия истории
        setTimeout(async () => {
            await scrollToBottomImage();
        }, 150);
    } else {
        list.classList.add('hidden');
        btn.classList.remove('active');
    }
}

function updateHistoryDisplay(page = 0) {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    const validItems = HistoryManager.getValidItemsOnly();
    if (validItems.length === 0) {
        historyList.innerHTML = `
    <div class="empty-history">
    <div class="empty-icon">📋</div>
    <h3 data-i18n="empty_history_title">${appState.translate('empty_history_title')}</h3>
    <p data-i18n="empty_history_subtitle">${appState.translate('empty_history_subtitle')}</p>
    </div>
    `;
        return;
    }

    // Если это первая страница - очищаем список
    if (page === 0) {
        historyList.innerHTML = '';
        HistoryManager.clearCache();
        console.log('📋 Cleared history list for fresh display');
    }

    // 🔥 НОВОЕ: Изменен лимит для показа только 6 изображений при первом заходе
    const itemsPerPage = page === 0 ? 6 : 15; // первый раз ТОЛЬКО 6 изображений, потом 15

    // Загружаем элементы страницы
    if (HistoryManager.isLoadingPage) {
        console.log('⚡ Page already loading, skipping...');
        return;
    }

    HistoryManager.isLoadingPage = true;

    // 🔥 НОВОЕ: Для первой страницы ограничиваем до 6 элементов (независимо от размера страницы)
    const pageItems = page === 0
        ? validItems.slice(0, 6)  // первые 6 элементов для первой страницы
        : HistoryManager.getItemsForPage(page);

    if (pageItems.length > 0) {
        console.log(`📄 Loading page ${page} with ${pageItems.length} items`);

        // Добавляем элементы страницы
        pageItems.forEach(item => {
            const element = HistoryManager.createHistoryItemElement(item);
            if (element) {
                historyList.appendChild(element);
                // 🔧 ДОБАВЛЕНИЕ: Используем eager loading для первых 6 изображений
                if (page === 0 && validItems.length <= globalHistoryLoader.eagerLoadingLimit) {
                    // Для маленьких списков (до 25 изображений) - eager loading всех изображений на первой странице
                    globalHistoryLoader.loadEagerForElement(element);
                } else {
                    // Для больших списков или последующих страниц - ленивая загрузка
                    const img = element.querySelector('img[data-src]');
                    if (img) globalHistoryLoader.observe(img);
                }
            }
        });

        HistoryManager.maxLoadedPage = page;
        HistoryManager.currentPage = page;

        // Управляем кнопкой загрузки следующей страницы
        const existingBtn = document.getElementById('loadMoreHistoryBtn');

        // Проверяем, есть ли еще элементы после текущей страницы
        const currentEndIndex = (page + 1) * itemsPerPage;
        const hasMoreItems = currentEndIndex < validItems.length;
        console.log('🧮 History pagination:', { page, itemsPerPage, currentEndIndex, validItemsLength: validItems.length, hasMoreItems });

        if (hasMoreItems) {
            if (existingBtn) {
                // Если кнопка уже существует - переносим её в конец списка
                historyList.appendChild(existingBtn);
            } else {
                // Создаём новую кнопку
                const loadMoreBtn = document.createElement('button');
                loadMoreBtn.className = 'load-more-btn';
                loadMoreBtn.id = 'loadMoreHistoryBtn';
                // Добавляем иконку стрелки вниз
                loadMoreBtn.innerHTML = `
                    <span>Загрузить ещё...</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="btn-icon">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                    <span class="btn-ripple"></span>
                `;

                // Исправляем обработчик: только загрузка истории, без генерации
                loadMoreBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    loadNextHistoryPage();
                };

                historyList.appendChild(loadMoreBtn);
            }
        } else {
            // Удаляем кнопку если достигли конца истории
            if (existingBtn) {
                existingBtn.remove();
            }
        }
    }

    HistoryManager.isLoadingPage = false;
    console.log(`📄 History display updated: showing ${pageItems.length} items from page ${page}`);
}

// Функция для загрузки следующей страницы истории
function loadNextHistoryPage() {
    const nextPage = HistoryManager.currentPage + 1;
    if (!HistoryManager.hasMorePages(HistoryManager.currentPage)) {
        console.log('📄 No more pages to load');
        return;
    }

    console.log(`📄 Loading next history page: ${nextPage}`);
    updateHistoryDisplay(nextPage);

    // Обновляем текст кнопки загрузки
    setTimeout(() => {
        const btn = document.getElementById('loadMoreHistoryBtn');
        if (btn) {
            if (!HistoryManager.hasMorePages(nextPage)) {
                btn.textContent = 'Все загружено! 🎉';
                btn.disabled = true;
                btn.style.opacity = '0.5';
            } else {
                btn.textContent = 'Загрузить ещё...';
                btn.disabled = false;
            }
            // Прокрутка к новой кнопке для активации загрузки изображений
            btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 300);
}

// Функция для показа всей истории без виртуализации (для совместимости)
function showAllHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    // Отключаем виртуализацию для полного показа
    HistoryManager.clearCache();

    // Показываем все элементы
    historyList.innerHTML = HistoryManager.getValidItemsOnly().map(item => {
        const element = HistoryManager.createHistoryItemElement(item);
        return element.outerHTML;
    }).join('');

    // Подключаем Observer ко всем новым картинкам
    const newImages = historyList.querySelectorAll('img[data-src]');
    newImages.forEach(img => globalHistoryLoader.observe(img));

    console.log('📄 All history loaded without virtualization');
}

function viewHistoryItem(id) {
    const item = appState.generationHistory.find(h => h.id == id);
    if (item && item.result) {
        appState.currentGeneration = item;
        showResult({ image_url: item.result });
    }
}

function showHistory() {
    toggleHistoryList();
}

window.toggleHistoryList = toggleHistoryList;

// Функция для полного экрана истории
function updateHistoryDisplayFullScreen() {
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
    <span class="info-pair">
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFF"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-220 40q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-518q0-121-92.5-201.5T488-800q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z"/></svg>
    ${appState.translate('style_' + item.style)}
    </span>
    <span class="info-pair">
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFF"><path d="M240-40v-329L110-580l185-300h370l185 300-130 211v329l-240-80-240 80Zm80-111 160-53 160 53v-129H320v129Zm20-649L204-580l136 220h280l136-220-136-220H340Zm98 383L296-558l57-57 85 85 169-170 57 56-226 227ZM320-280h320-320Z"/></svg>
    ${appState.translate('mode_' + item.mode)}
    </span>
    ${item.duration ? `<span> ⏱ ${Math.round(item.duration / 1000)}s</span>` : ''}
    </div>
    ${item.result ? `<img src="${item.result}" alt="Generated" class="history-image" loading="lazy" />` : ''}
    ${item.error ? `<p style="color: var(--error-500); font-size: var(--font-size-sm); margin-top: var(--space-2);">❌ ${item.error}</p>` : ''}
    </div>
    `).join('');
    showBackButton(true); // показать

}


function clearHistory() {
    if (confirm('Clear all generation history?')) {
        appState.generationHistory = [];
        appState.saveHistory();
        updateHistoryDisplay();
        triggerHaptic('medium');
    }
}

// Функция плавной прокрутки к истории и открытия списка
async function showHistoryWithScroll() {
    const historyBtn = document.getElementById('historyToggleBtn');
    const historyList = document.getElementById('historyList');

    if (historyBtn) {
        // Плавная прокрутка к кнопке истории - центрируем её
        historyBtn.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });
    }

    // Подождем завершения прокрутки
    await new Promise(resolve => setTimeout(resolve, 300));

    // Автоматически открываем список истории если он закрыт
    if (historyList && historyList.classList.contains('hidden')) {
        const btn = document.getElementById('historyToggleBtn');
        historyList.classList.remove('hidden');
        btn.classList.add('active');
        updateHistoryDisplay();

        // Ждем пока DOM обновится после открытия
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Дополнительная прокрутка к крайнему (новому) изображению после открытия истории
    await scrollToLatestImage();
}

// Функция быстрой прокрутки к крайнему (новому) изображению в истории
async function scrollToLatestImage() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    // Убираем излишнюю задержку - она только замедляет
    await new Promise(resolve => setTimeout(resolve, 50));

    // Ищем первый элемент истории (это будет крайнее/новое изображение)
    const firstHistoryItem = historyList.querySelector('.history-mini');
    if (firstHistoryItem) {
        // Убираем спам логирования - логируем только в 5% случаев
        if (Math.random() < 0.05) {
            console.log('🚀 Быстрая прокрутка к крайнему изображению');
        }

        // Быстрая прокрутка без плавности для мгновенного показа
        firstHistoryItem.scrollIntoView({
            behavior: 'instant', // 'instant' для быстрой прокрутки
            block: 'start', // scroll to top of the element instead of center
            inline: 'nearest'
        });

        // Убираем анимацию и подсветку - они бесполезны и замедляют
        if (Math.random() < 0.05) {
            console.log('✅ Прокрутка к крайнему изображению завершена');
        }
    } else {
        // Убираем спам логирования
        if (Math.random() < 0.01) {
            console.warn('⚠️ Не найдено крайнее изображение для прокрутки');
        }
    }
}

// Функция быстрой прокрутки к последнему (нижнему) изображению в истории
async function scrollToBottomImage() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    // Убираем задержку - она замедляет
    await new Promise(resolve => setTimeout(resolve, 50));

    // Ищем все элементы истории
    const historyItems = historyList.querySelectorAll('.history-mini');
    if (historyItems.length > 0) {
        // Берем последний элемент (самое нижнее изображение)
        const lastHistoryItem = historyItems[historyItems.length - 1];

        // Убираем спам логирования
        if (Math.random() < 0.05) {
            console.log('🚀 Быстрая прокрутка к последнему изображению');
        }

        // Быстрая прокрутка без плавности для мгновенного показа
        lastHistoryItem.scrollIntoView({
            behavior: 'instant', // 'instant' для быстрой прокрутки
            block: 'center',
            inline: 'nearest'
        });

        // Убираем анимацию и подсветку - они бесполезны
        if (Math.random() < 0.05) {
            console.log('✅ Прокрутка к последнему изображению завершена');
        }
    } else {
        // Убираем спам логирования
        if (Math.random() < 0.01) {
            console.warn('⚠️ Не найдены элементы истории для прокрутки');
        }
    }
}

// Функция для создания placeholder'а загрузки в истории
function createLoadingHistoryItem(generation) {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    // ☠️ ЗАЩИТА ОТ ДУБЛИКАТОВ: Проверяем, нет ли уже элемента для этой генерации
    const existingLoading = document.getElementById(`loading-${generation.id}`);
    if (existingLoading) {
        console.log(`🚫 Loading item for generation ${generation.id} already exists, skipping creation`);
        return existingLoading; // возвращаем существующий элемент
    }

    // Создаём элемент нового изображения в истории
    const loadingItem = document.createElement('div');
    loadingItem.className = 'history-mini history-loading';
    loadingItem.id = `loading-${generation.id}`;
    // Добавляем onclick сразу
    loadingItem.onclick = () => console.log('Loading item clicked, but still processing...');

    // Создаём полупрозрачное изображение для анимации загрузки (без src - только placeholder)
    const loadingImage = document.createElement('img');
    loadingImage.className = 'loading-image-placeholder';
    // убираем src чтобы не было иконки
    loadingImage.alt = 'Generating...';

    // Добавляем анимацию пульсации
    loadingImage.style.animation = 'image-loading 2s infinite';

    // Создаём подпись для широких экранов - будем заполнять при готовности
    const loadingCaption = document.createElement('p');
    loadingCaption.classList.add('history-caption');
    loadingCaption.innerHTML = ` `; // Пусто, заполним позднее

    // Собираем элемент
    loadingItem.appendChild(loadingImage);
    loadingItem.appendChild(loadingCaption);

    // Вставляем новый элемент в начало списка
    const firstHistoryItem = historyList.querySelector('.history-mini');
    if (firstHistoryItem) {
        historyList.insertBefore(loadingItem, firstHistoryItem);
    } else {
        historyList.appendChild(loadingItem);
    }

    console.log(`➕ Created loading item for generation ${generation.id}`);
    return loadingItem;
}

// Функция для обновления миниатюры после получения результата
function updateHistoryItemWithImage(generationId, imageUrl) {
    const loadingItem = document.getElementById(`loading-${generationId}`);
    if (!loadingItem) return;

    // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: МЕНЯЕМ ID ЭЛЕМЕНТА ДЛЯ ПРЕДОТВРАЩЕНИЯ ДУБЛИКАТОВ
    loadingItem.id = `history-${generationId}`;
    console.log(`🔧 Changed loading item ID from loading-${generationId} to history-${generationId}`);

    // Снимаем анимацию пульсации и обновляем изображение
    const loadingImage = loadingItem.querySelector('.loading-image-placeholder');
    if (loadingImage) {
        // Убираем анимацию
        loadingImage.style.animation = 'none';

        // Функция для завершения загрузки
        const finalizeLoading = () => {
            // Изображение загружено - добавляем класс 'loaded'
            loadingImage.classList.add('loaded');
            // Убираем data-src, чтобы Intersection Observer перестал наблюдать
            delete loadingImage.dataset.src;
            // Уведомляем GlobalHistoryLoader об окончании загрузки
            if (globalHistoryLoader) {
                globalHistoryLoader.safeUnobserve(loadingImage);
            }
            console.log('✅ History image finalized successfully:', generationId);
        };

        // ⚡ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: НЕМЕДЛЕННАЯ ЗАГРУЗКА ДЛЯ ИСПРАВЛЕНИЯ ПРОБЛЕМЫ "COMPLETE"
        // Представим ситуацию: мы нажимаем generate -> создается loading item -> через секунды генерация завершается -> вызывается updateHistoryItemWithImage
        // БЕЗ ЭТОГО ИСПРАВЛЕНИЯ: изображение просто устанавливается в data-src и ждет IntersectionObserver
        // ПРОБЛЕМА: если элемент уже в зоне видимости (что обычно), IntersectionObserver не вызовет handleIntersection потому что элемент уже наблюдается!
        // Так что для уже видимых элементов - IntersectionObserver не активируется и загрузка НЕ ПРОИСХОДИТ

        console.log('🚀 Loading image immediately for COMPLETE update:', generationId);

        // Таймер безопасности - через 5 секунд гарантировано завершить загрузку
        const safetyTimer = setTimeout(() => {
            console.log('⏰ Safety timer triggered - completing:', generationId);
            // Финализация загрузки
            loadingImage.classList.add('loaded');
            delete loadingImage.dataset.src;
            if (globalHistoryLoader) {
                globalHistoryLoader.safeUnobserve(loadingImage);
            }
            console.log('✅ History image finalized successfully:', generationId);
        }, 5000);

        // Обработчики загрузки
        loadingImage.onload = () => {
            clearTimeout(safetyTimer);
            finalizeLoading();
            console.log('✅ History image loaded via onload:', generationId);
        };

        loadingImage.onerror = () => {
            clearTimeout(safetyTimer);
            // При ошибке загрузки - placeholder
            loadingImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMvb3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+LmV4cGlyZWQtdGV4dHtiYTpnZW5lcmFsIFNhbnMsQXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWY7Zm9udC1zaXplOiAxNHB4O2ZpbGw6ICM5OTk5OTk7fTwvc3R5bGU+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y0ZjRmNCIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZHk9Ii4zNWVtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBjbGFzcz0iZXhwaXJlZC10ZXh0IiBzdHlsZT0iYXVjLWFncmlkLXJvd3M6IHNwYW4gMS8yOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlOyBvcGFjaXR5OiAwLjg7Ij5FeHBpcmVkPC90ZXh0PiAKPC9zdmc+';
            finalizeLoading();
            console.log('❌ History image load failed:', generationId);
        };

        // 🔥 НЕМЕДЛЕННАЯ УСТАНОВКА SRC ДЛЯ ЗАГРУЗКИ
        loadingImage.src = imageUrl;

        // ⚡️ ДОПОЛНИТЕЛЬНО: Действительно отправляем в IntersectionObserver на случай изменений видимости
        loadingImage.dataset.src = imageUrl; // Сохраняем оригинальную логику
        if (globalHistoryLoader) {
            globalHistoryLoader.observe(loadingImage);
            console.log('👁️ Also observing for visibility changes:', generationId);
        }

        loadingImage.alt = 'Generated image';

        // Добавляем эффект плавного появления
        loadingImage.style.opacity = '0';
        requestAnimationFrame(() => {
            loadingImage.style.opacity = '1';
            loadingImage.style.transition = 'opacity 0.3s ease-in-out';
        });
    }

    // Обновляем подпись - показываем завершение генерации
    const loadingCaption = loadingItem.querySelector('p');
    if (loadingCaption) {
        // Найдем объект генерации по ID
        const generation = appState.generationHistory.find(g => g.id == generationId);
        const mode = generation ? generation.mode : 'unknown';
        const style = generation ? generation.style : 'realistic';

        loadingCaption.innerHTML = `
    <span class="complete-status">✅ Complete</span><br>
    <small class="history-date">${new Date().toLocaleDateString()} | ${appState.translate('style_' + style)} | ${appState.translate('mode_' + mode)}</small>
`;

        // Добавляем мягкую анимацию изменения текста
        loadingCaption.style.opacity = '0';
        requestAnimationFrame(() => {
            loadingCaption.style.opacity = '1';
            loadingCaption.style.transition = 'opacity 0.2s ease-in-out';
        });
    }

    // Убираем loading класс через некоторое время для smooth эффекта
    setTimeout(() => {
        loadingItem.classList.remove('history-loading');
    }, 300);

    // Добавляем onclick для просмотра результата
    loadingItem.onclick = () => viewHistoryItem(generationId);

    console.log('🖼️ Updated history item with generated image:', generationId, imageUrl);
}

// 🖼️ UI Initialization
// 🎬 Screen Management with cleanup
let carouselCleanup = null;

function showLoadingScreen() {
    document.getElementById('loadingScreen').classList.add('active');
}

function hideLoadingScreen() {
    document.getElementById('loadingScreen').classList.remove('active');
}

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

function showApp() {
    document.getElementById('app').classList.add('loaded');
}
function getCurrentScreen() {
    const generationEl = document.getElementById('generationScreen');
    const processingEl = document.getElementById('processingScreen');
    const resultEl = document.getElementById('resultScreen');
    const historyEl = document.getElementById('historyScreen');

    const isVisible = el => {
        if (!el) return false;
        const cs = window.getComputedStyle(el);
        if (el.classList.contains('hidden')) return false;
        return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0';
    };

    if (isVisible(resultEl)) return 'result';
    if (isVisible(processingEl)) return 'processing';
    if (isVisible(historyEl)) return 'history';
    if (isVisible(generationEl)) return 'generation';
    return 'unknown';
}

/*
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
    if (!targetScreen) { console.error('Screen not found:', screenId); return; }

    // Update main button
    //updateMainButton(screenId);
}
*/

function showScreen(screenId) {
    // Сначала ищем нужный экран
    const targetScreen = document.getElementById(screenId);
    if (!targetScreen) {
        console.error('Screen not found:', screenId);
        return;
    }

    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden'); // гарантированно прячем
    });

    // Показываем нужный
    targetScreen.classList.remove('hidden');
    targetScreen.classList.add('active');
}


function showProcessing() {
    showScreen('processingScreen');
    updateProcessingSteps(1);
    console.log('--- Проверка processingScreen ---');
    const proc = document.getElementById('processingScreen');
    if (!proc) {
        console.error('❌ Нет блока #processingScreen в DOM');
    } else {
        console.log('✅ Нашёл processingScreen:', proc);
        console.log('Классы:', proc.className);
        console.log('display:', getComputedStyle(proc).display);
        console.log('opacity:', getComputedStyle(proc).opacity);
        console.log('transform:', getComputedStyle(proc).transform);
        console.log('innerHTML длина:', proc.innerHTML.length);
    }

    console.log('after showProcessing ->', getCurrentScreen());
}

// ⚡ ТОСТ-НОТИФИКАЦИИ ДЛЯ НОВЫХ РЕЗУЛЬТАТОВ (БЕЗ ПРЕРЫВАНИЯ ПОЛНОГО ПРОСМОТРА)
let pendingResults = []; // Ожидающие результаты для показа в тостах

function showResult(result) {
    // Проверяем, показывается ли сейчас полный экран результата
    if (getCurrentScreen() === 'result') {
        // Экран уже занят - показываем тост-уведомление
        if (appState.currentGeneration) {
            showResultToast(result);
            console.log('🎯 Показан тост с новым результатом (экран занят)');
        } else {
            console.warn('⚠️ showResult: currentGeneration не установлена, пропускаем тост');
        }
    } else {
        // Экран свободен - показываем полный результат
        if (appState.currentGeneration) {
            displayFullResult(result);
            console.log('🎯 Показан полный результат (экран свободен)');
        } else {
            console.error('❌ showResult: currentGeneration равна null!');
        }
    }
}

function displayFullResult(result) {
    // Переключаемся на экран результата
    showScreen('resultScreen');
    showBackButton(true);

    // Update result display
    const resultImage = document.getElementById('resultImage');
    const resultPrompt = document.getElementById('resultPrompt');
    const resultStyle = document.getElementById('resultStyle');
    const resultMode = document.getElementById('resultMode');
    const resultTime = document.getElementById('resultTime');

    // 🔧 Очистка src + timestamp для предотвращения кэширования
    if (resultImage) {
        resultImage.src = ''; // Сначала очищаем
        resultImage.src = result.image_url + '?t=' + Date.now(); // Добавляем timestamp для свежести
    }
    if (resultPrompt) resultPrompt.textContent = appState.currentGeneration.prompt;
    if (resultStyle) resultStyle.textContent = appState.translate('style_' + appState.currentGeneration.style);
    if (resultMode) resultMode.textContent = appState.translate('mode_' + appState.currentGeneration.mode);

        // Обновлено: отображаем стоимость генерации вместо времени
        if (resultTime) {
            const cost = appState.currentGeneration.generation_cost;
            if (cost !== undefined && cost !== null && cost !== '' && !isNaN(parseFloat(cost))) {
                const numericCost = parseFloat(cost);
                const formattedCost = numericCost.toFixed(cost.includes('.') ? 1 : 0); // 1 знак для дробных, 0 для целых
                const currency = appState.currentGeneration.cost_currency || 'Cr';
                resultTime.textContent = `${formattedCost} ${currency.toUpperCase()}`;
                console.log('💰 Cost displayed:', formattedCost, currency);
            } else {
                console.log('⚠️ Cost not found, showing duration fallback');
                // Fallback если стоимость не пришла или равна 0/null
                const duration = Math.round((appState.currentGeneration.duration || 0) / 1000);
                resultTime.textContent = `${duration}s`;
            }
        }

    console.log('🎯 Результат показан:', getCurrentScreen());
}

function showResultToast(result) {
    // Создаём уникальный ID для тоста
    const toastId = `result-toast-${Date.now()}`;
    const generation = appState.currentGeneration;

    // Создаём элемент тоста
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = 'result-toast';

    // Получаем данные для отображения
    const style = appState.translate('style_' + (generation.style || 'realistic'));
    const mode = appState.translate('mode_' + (generation.mode || 'flux_shnel'));

    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-image">
                <img src="${result.image_url}?t=${Date.now()}" alt="Generated image preview" loading="lazy">
            </div>
            <div class="toast-details">
                <div class="toast-meta">
                    <span class="toast-style">${style}</span>
                    <span class="toast-mode">${mode}</span>
                </div>
                <button class="toast-view-btn">View Result</button>
                <button class="toast-close-btn">×</button>
            </div>
        </div>
    `;

    // Стили для тоста (будут добавлены в CSS или инлайново)
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '280px',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-primary)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateY(100px)',
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        cursor: 'default',
        overflow: 'hidden'
    });

    // Обработчик клика по кнопке просмотра
    toast.querySelector('.toast-view-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        displayFullResult(result); // Показываем полный результат
        removeResultToast(toast);
    });

    // Обработчик клика по закрытию тоста
    toast.querySelector('.toast-close-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        removeResultToast(toast);
    });

    // Обработчик клика по всему тосту (кроме кнопок)
    toast.addEventListener('click', () => {
        displayFullResult(result);
        removeResultToast(toast);
    });

    // Добавляем тост на страницу
    document.body.appendChild(toast);

    // Анимируем появление
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
        removeResultToast(toast);
    }, 5000);

    // Добавляем внутренние стили для содержимого тоста
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .result-toast .toast-content {
            display: flex;
            padding: 0;
        }
        .result-toast .toast-image {
            width: 80px;
            height: 80px;
            flex-shrink: 0;
        }
        .result-toast .toast-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 8px 0 0 8px;
        }
        .result-toast .toast-details {
            flex: 1;
            padding: 12px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .result-toast .toast-meta {
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-bottom: 8px;
        }
        .result-toast .toast-meta span {
            font-size: 11px;
            font-weight: 500;
            color: var(--text-secondary);
            background: var(--bg-secondary);
            padding: 2px 6px;
            border-radius: 4px;
        }
        .result-toast .toast-view-btn {
            background: var(--accent-primary);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 6px 12px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            align-self: flex-start;
        }
        .result-toast .toast-view-btn:hover {
            background: var(--accent-secondary);
            transform: translateY(-1px);
        }
        .result-toast .toast-close-btn {
            position: absolute;
            top: 6px;
            right: 6px;
            background: rgba(0,0,0,0.1);
            border: none;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    document.head.appendChild(styleElement);

    console.log('🔔 Показан тост с новым результатом генерации');
}

function removeResultToast(toast) {
    if (!toast) return;

    toast.style.opacity = '0';
    toast.style.transform = 'translateY(100px)';

    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Функция обновления отображения имени пользователя в header
function updateUserNameDisplay() {
    const nameElement = document.getElementById('userNameDisplay');

    if (!nameElement) return;

    // Приоритет отображения: username > имя+фамилия > имя > userId
    let displayName = '';

    if (appState.userUsername) {
        // Есть username - показываем с @
        displayName = '@' + appState.userUsername;
    } else if (appState.userName && appState.userName.trim() !== '') {
        // Есть имя/фамилия - показываем как есть
        displayName = appState.userName;
    } else if (appState.userId) {
        // Нет имени, но есть ID - используем как запасной вариант
        displayName = 'ID: ' + appState.userId.toString().substring(0, 8) + '...';
    } else {
        // Ничего нет - дефолтное значение
        displayName = '--';
    }

    nameElement.textContent = displayName;
    console.log('👤 User name display updated:', displayName);
}

// Функция обновления баланса пользователя в header
function updateUserBalance(credits, reason = 'webhook_update') {
    // Обновляем баланс в appState
    if (credits !== null && credits !== undefined) {
        const newBalance = parseFloat(credits);
        const oldBalance = appState.userCredits;
        const timestamp = Date.now();

        // Добавляем запись в историю ДО обновления баланса
        appState.balanceHistory.push({
            balance: newBalance,
            timestamp: timestamp,
            reason: reason,
            previousBalance: oldBalance
        });

        // Ограничиваем историю до 100 последних записей
        if (appState.balanceHistory.length > 100) {
            appState.balanceHistory = appState.balanceHistory.slice(-100);
        }

        // Сохраняем историю в localStorage
        appState.saveBalanceHistory();

        // Обновляем текущий баланс
        appState.userCredits = newBalance;
        appState.lastBalanceUpdate = timestamp;
        appState.saveSettings(); // Сохраняем настройки в localStorage

        // Обновляем отображение в header
        const balanceElement = document.getElementById('userCreditsDisplay');
        if (balanceElement) {
            if (!isNaN(credits) && credits !== null) {
                balanceElement.textContent = parseFloat(credits).toLocaleString('en-US');
            } else {
                balanceElement.textContent = '--';
            }
        }

        console.log('💳 Balance updated:', { old: oldBalance, new: newBalance, reason });
    }
}

function showSubscriptionNotice(result) {
    console.log('🔗 Full result object:', result);
    console.log('🔗 Payment URLs from result:', result.payment_urls);

    const modal = document.getElementById('limitModal');
    if (!modal) {
        console.error('❌ Modal not found!');
        return;
    }

    // 🔍 ДИАГНОСТИКА: Проверяем все элементы которые могут быть поверх модального окна
    console.log('🔍 DIAGNOSING modal overlay elements...');

    // Проверяем Z-index всех элементов
    const allElements = document.querySelectorAll('*');
    const highZIndexElements = [];
    const suspiciousElements = [];

    allElements.forEach(el => {
        const zIndex = window.getComputedStyle(el).zIndex;
        if (zIndex !== 'auto' && parseInt(zIndex) > 99995) { // Выше модального окна
            highZIndexElements.push({
                element: el,
                zIndex: zIndex,
                tagName: el.tagName,
                id: el.id,
                className: el.className,
                position: window.getComputedStyle(el).position,
                display: window.getComputedStyle(el).display,
                visibility: window.getComputedStyle(el).visibility
            });
        }

        // Ищем подозрительные элементы с fixed позиционированием в центре
        if (window.getComputedStyle(el).position === 'fixed' && el !== modal) {
            const rect = el.getBoundingClientRect();
            if (rect.width < 100 && rect.height < 100 && // Маленький размер
                Math.abs(rect.left + rect.width / 2 - window.innerWidth / 2) < 50 && // Центр по X
                Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2) < 50) { // Центр по Y
                suspiciousElements.push({
                    element: el,
                    rect: rect,
                    styles: window.getComputedStyle(el),
                    html: el.outerHTML.substring(0, 200) + '...'
                });
            }
        }
    });

    // ✋ РАСШИРЕННАЯ ДИАГНОСТИКА: ПОДРОБНАЯ ИНФОРМАЦИЯ О ВЫСОКИХ ЭЛЕМЕНТАХ
    console.error('🚨 ПРОБЛЕМА ВЫЯВЛЕНА: 7 элементов с высоким Z-INDEX мешают модальному окну!');
    console.table(highZIndexElements.map((el, index) => ({
        '№': index + 1,
        'Элемент': el.element.tagName,
        'Z-Index': el.zIndex,
        'ID': el.element.id || 'без ID',
        'Классы': el.element.className || 'без классов',
        'Position': el.element.style ? el.element.style.position : 'не определено',
        'Display': el.element.style ? el.element.style.display : 'не определено',
        'Visibility': el.element.style ? el.element.style.visibility : 'не определено',
        'Содержимое': el.element.innerText ? el.element.innerText.substring(0, 50) + '...' : 'пустой элемент',
        'HTML': el.element.outerHTML.substring(0, 100) + '...'
    })));

    console.log('🔍 SUSPICIOUS Fixed Elements in center:', suspiciousElements);

    // Ищем элементы с классом 'touch-action' или похожим
    const touchElements = document.querySelectorAll('[class*="touch"], [class*="finger"], [class*="joystick"]');
    console.log('🔍 TOUCH-related elements:', touchElements);

    // Проверяем viewport meta-tag
    const viewport = document.querySelector('meta[name="viewport"]');
    console.log('🔍 Viewport meta:', viewport ? viewport.content : 'NOT FOUND');

    // Проверяем наличие системных overlays
    console.log('🔍 User agent:', navigator.userAgent);
    console.log('🔍 Touch capabilities:', {
        touchscreen: navigator.maxTouchPoints > 0,
        ontouchstart: 'ontouchstart' in window,
        pointerEvent: 'onpointerdown' in window
    });

    // Уведомляем пользователя о начале диагностики
    console.warn('🔍 SYSTEM OVERLAY DETECTION STARTED');
    console.warn('Если видим оранжевый квадратик/джостик, это может быть:');
    console.warn('1. Touch Action Indicator (системный оверлей сеанса)');
    console.warn('2. Pointer Events Hover (CSS hover эффекты)');
    console.warn('3. Browser Gesture Recognition (системное поведение)');
    console.warn('4. Mobile System UI (тпанель навигации)');
    console.warn('5. Input Method Editor (экранная клавиатура)');

    // Показать модальное окно
    modal.classList.add('show');

    // Helper function for safe redirections with error handling
    const safeRedirect = (url, planName) => {
        modal.classList.remove('show');
        showGeneration();
        setTimeout(() => {
            try {
                console.log(`🔗 Redirecting to ${planName} payment URL: ${url}`);
                // Try modern way first
                if (appState.tg && appState.tg.openLink) {
                    appState.tg.openLink(url);
                } else {
                    // Fallback to regular navigation
                    window.open(url, '_blank');
                }
            } catch (error) {
                console.error(`❌ Error redirecting to ${planName} payment link:`, error);
                showToast('error', `Ошибка перехода к ${planName}. Попробуйте снова.`);
                // Fallback to popup
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        }, 100);
    };

    // Настроить обработчики для трех кнопок тарифов
    const upgradeBtn = document.getElementById('upgradeBtn'); // ЛИТЕ планируется как существующий
    const upgradeBtnPro = document.getElementById('upgradebtn_pro'); // ПРО новый
    const upgradeBtnStudio = document.getElementById('upgradebtn_studio'); // СТУДИО новый

    console.log('🔘 Upgrade buttons found:', !!upgradeBtn, !!upgradeBtnPro, !!upgradeBtnStudio);

    // Обработчик для ЛИТЕ тарифа (использует существующую кнопку upgradeBtn)
    if (upgradeBtn) {
        upgradeBtn.onclick = () => {
            console.log('🔘 LITE Upgrade button clicked');
            const paymentUrl = result.payment_urls?.lite || 'https://t.me/tribute/app?startapp=syDv';
            safeRedirect(paymentUrl, 'LITE');
        };
    }

    // Обработчик для ПРО тарифа (новая кнопка)
    if (upgradeBtnPro) {
        upgradeBtnPro.onclick = () => {
            console.log('🔘 PRO Upgrade button clicked');
            const paymentUrl = result.payment_urls?.pro || 'https://t.me/tribute/app?startapp=syDv';
            safeRedirect(paymentUrl, 'PRO');
        };
    }

    // Обработчик для СТУДИО тарифа (новая кнопка)
    if (upgradeBtnStudio) {
        upgradeBtnStudio.onclick = () => {
            console.log('🔘 STUDIO Upgrade button clicked');
            const paymentUrl = result.payment_urls?.studio || 'https://t.me/tribute/app?startapp=syDv';
            safeRedirect(paymentUrl, 'STUDIO');
        };
    }

    // Настроить кнопку закрытия
    const closeBtn = document.getElementById('closeLimitModal');
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.classList.remove('show');
            showGeneration(); // Показываем генератор после закрытия
        };
    }
}

/*function showGeneration() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById('generationScreen').classList.add('active');
    showBackButton(false);
*/
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

    // 🆕 ДОБАВЛЕНИЕ: Обновление отображения истории для принудительной загрузки превью при возврате на генерацию
    updateHistoryDisplay();

    // Принудительная загрузка превью истории при возврате на генерацию
    setTimeout(() => {
        if (globalHistoryLoader) {
            globalHistoryLoader.forceLoadVisibleHistoryPreviews();
        }
    }, 50);
}


// 🎨 UI Initialization
function initializeUI() {
    // Character counter
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

    // Form submission
    const form = document.querySelector('.generation-form');
    if (form) {
        form.addEventListener('submit', generateImage);
    }

    // Update translations
    appState.updateTranslations();

    console.log('✅ UI initialized');
}

// ===== Пользовательское изображение: состояние =====
const userImageState = {
    images: [] // массив объектов {id, file, dataUrl, uploadedUrl} - до 4 изображений
};

// ===== Функции проверки лимитов изображений =====
function getImageLimitForMode(mode) {
    switch (mode) {
        case 'photo_session':
            return 4; // до 4 изображений для nano banana
        case 'fast_generation':
            return 0; // вообще не допускаются изображения для flux shnel
        default:
            return 1; // все остальные режимы - максимум 1 изображение
    }
}

function canUploadMoreImages(mode, currentCount) {
    const limit = getImageLimitForMode(mode);
    return currentCount < limit;
}


// ===== Глобальная функция для обновления видимости UI загрузки изображений =====
function updateImageUploadVisibility() {
    const chooseBtn = document.getElementById('chooseUserImage');
    const preview = document.getElementById('userImagePreview');
    const imageCount = userImageState.images.length;
    const hasImages = imageCount > 0;

    const modeSelect = document.getElementById('modeSelect');
    let shouldShowUploadButton, shouldShowPreview;

    if (modeSelect) {
        const currentMode = modeSelect.value;

        // 🔥 НОВАЯ ЛОГИКА: фиолетовая кнопка всегда скрыта ПОКА ЕСТЬ ИЗОБРАЖЕНИЯ ИЛИ В РЕЖИМЕ FAST_GENERATION
        shouldShowUploadButton = !hasImages && (currentMode !== 'fast_generation');

        if (currentMode === 'fast_generation') {
            // Flux Shnel: кнопку и превью НЕ видим всегда
            shouldShowPreview = false;

            // УДАЛЯЕМ ВСЕ ИЗОБРАЖЕНИЯ при переключении на этот режим
            if (hasImages) {
                console.log('🗑️ Удаляем все изображения в режиме Fast Generation');
                clearAllImages();
                return; // повторим вызов функции после очистки
            }

            console.log(`⚡ Flux Shnel режим: кнопка скрыта, превью скрыто (удалены все изображения)`);
        } else if (currentMode === 'photo_session') {
            // Nano Banana: превью видно с изображениями
            shouldShowPreview = hasImages;
            console.log(`${!hasImages ? '📸' : '❌'} Photo Session режим: кнопка ${shouldShowUploadButton ? 'видна' : 'скрыта'} (пока нет превью)`);
        } else {
            // Другие режимы: превью видно с изображениями
            shouldShowPreview = hasImages;

            // УДАЛЯЕМ ЛИШНИЕ ИЗОБРАЖЕНИЯ до лимита 1 при переключении на эти режимы
            if (imageCount > 1) {
                console.log(`🗑️ Удаляем лишние изображения в режиме ${currentMode} (оставляем только 1)`);
                trimImagesToLimit(1);
                return; // повторим вызов функции после очистки
            }

            console.log(`${!hasImages ? '🎨' : '❌'} Другой режим (${currentMode}): кнопка ${shouldShowUploadButton ? 'видна' : 'скрыта'} (пока нет превью)`);
        }
    } else {
        // Без режима - кнопка видна только без изображений, превью показывается
        shouldShowUploadButton = !hasImages;
        shouldShowPreview = hasImages;
    }

    // Применяем видимость кнопки
    if (chooseBtn) {
        if (shouldShowUploadButton) {
            chooseBtn.style.setProperty('display', 'inline-flex', 'important');
            chooseBtn.classList.remove('flux-shnel-hidden');
            console.log('✅ Кнопка загрузки ВИДИМА');
        } else {
            chooseBtn.style.setProperty('display', 'none', 'important');
            chooseBtn.classList.add('flux-shnel-hidden');
            console.log('🚫 Кнопка загрузки СКРЫТА');
        }
    }

    // Применяем видимость превью
    if (preview) {
        if (shouldShowPreview) {
            preview.classList.remove('flux-shnel-hidden', 'hidden');
            preview.style.setProperty('display', 'block', 'important');
            console.log('✅ Превью изображений ВИДИМО');
        } else {
            preview.style.setProperty('display', 'none', 'important');
            preview.classList.add('flux-shnel-hidden');
            console.log('🚫 Превью изображений СКРЫТО');
        }
    }

    console.log('📊 ИТОГОВАЯ ВИДИМОСТЬ:', {
        режим: modeSelect?.value,
        количество_изображений: userImageState.images.length, // актуальное после возможной очистки
        кнопка_видна: shouldShowUploadButton,
        превью_видно: shouldShowPreview,
        действие: 'обновлено'
    });

    // Обновляем видимость маленькой кнопки внутри превью
    updateInnerUploadButtonVisibility();
}

// ===== Инициализация UI загрузки =====
function initUserImageUpload() {
    const input = document.getElementById('userImage');
    const chooseBtn = document.getElementById('chooseUserImage');
    const removeBtn = document.getElementById('removeUserImage');

    chooseBtn?.addEventListener('click', () => input?.click());
    input?.addEventListener('change', onUserImageChange);
    removeBtn?.addEventListener('click', clearUserImage);

    // Проверить режим при изменении
    const modeSelect = document.getElementById('modeSelect');
    if (modeSelect) {
        // Инициализация видимости при загрузке
        updateImageUploadVisibility();

        // Слушать изменения режима
        modeSelect.addEventListener('change', () => {
            updateImageUploadVisibility();
            // Также обновляем видимость блока размеров при смене режима
            toggleSizeSelectVisibility();
        });
    }
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
// ===== Обработчик выбора файла =====
async function onUserImageChange(e) {
    const files = Array.from(e.target.files || []);
    const errorEl = document.getElementById('userImageError');
    const preview = document.getElementById('userImagePreview');
    const previewContainer = document.getElementById('previewContainer');
    const chooseBtn = document.getElementById('chooseUserImage');
    const optionalLabel = document.querySelector('.under-user-image-label');


    if (errorEl) errorEl.textContent = '';
    if (!files.length) return;

    // Проверка лимита (до 4 изображений)
    const currentCount = userImageState.images.length;
    const newCount = currentCount + files.length;
    if (newCount > 4) {
        if (errorEl) errorEl.textContent = 'Максимум 4 изображения. Вы можете загрузить ещё ' + (4 - currentCount) + '.';
        return;
    }

    // Валидация каждого файла
    const validFiles = [];
    for (let file of files) {
        if (!CONFIG.ALLOWED_TYPES.includes(file.type)) {
            if (errorEl) errorEl.textContent = 'Недопустимый формат: только JPG, PNG, WEBP, GIF.';
            continue;
        }
        const maxBytes = CONFIG.MAX_IMAGE_MB * 1024 * 1024; // МБ в байты
        if (file.size > maxBytes) {
            if (errorEl) errorEl.textContent = `Файл ${file.name} слишком большой (макс ${CONFIG.MAX_IMAGE_MB} MB).`;
            continue;
        }
        validFiles.push(file);
    }

    if (!validFiles.length) return;

    // Обработка каждого файла
    for (let file of validFiles) {
        try {
            const dataUrl = await readFileAsDataURL(file);
            const compressed = await maybeCompressImage(
                dataUrl,
                CONFIG.PREVIEW_MAX_W,
                CONFIG.PREVIEW_MAX_H,
                CONFIG.PREVIEW_JPEG_QUALITY
            );

            // Добавить в массив
            const imageId = Date.now() + Math.random().toString(36).substr(2, 9);
            userImageState.images.push({
                id: imageId,
                file: file,
                dataUrl: compressed,
                uploadedUrl: null
            });

            // Создать превью элемент
            createPreviewItem(imageId, compressed, file.name);

        } catch (err) {
            console.error('Ошибка обработки файла:', file.name, err);
            if (errorEl) errorEl.textContent = `Ошибка обработки ${file.name}.`;
        }
    }

    if (preview) preview.classList.remove('hidden');
    const wrapper = document.getElementById('userImageWrapper');
    wrapper?.classList.add('has-image');
    wrapper?.classList.remove('need-image');

    // Обновление видимости выбора размеров
    toggleSizeSelectVisibility();

    // 🔥 ИСПРАВЛЕНИЕ ПРОБЛЕМЫ МИГАНИЯ КНОПКИ: Быстрое обновление видимости ДО создания превью
    console.log(`🎯 После загрузки изображений: count=${userImageState.images.length}, режим=${document.getElementById('modeSelect')?.value}`);
    updateImageUploadVisibility(); // ← БЫСТРОЕ ОБНОВЛЕНИЕ - НЕ ЗАДЕРЖИВАЕМ

    // 🔥 ДОБАВЛЕНИЕ: Принудительное обновление превью видимости сразу после загрузки
    const hasImages = userImageState.images.length > 0;
    if (preview && hasImages) {
        preview.classList.remove('flux-shnel-hidden', 'hidden');
        preview.style.setProperty('display', 'block', 'important');
        console.log('✅ Превью принудительно показано после загрузки изображений');
    }

    // 🔥 НОВОЕ: Принудительная загрузка превью истории сразу после генерации
    setTimeout(() => {
        // Запустим принудительную загрузку всех видимых превью в истории
        const historyList = document.getElementById('historyList');
        if (historyList && !historyList.classList.contains('hidden')) {
            console.log('🎯 Принудительная загрузка превью истории после обновления...');
            globalHistoryLoader.forceLoadVisibleHistoryPreviews();
        }
    }, 100);
}

// ===== Создание превью элемента =====
function createPreviewItem(imageId, dataUrl, fileName) {
    const previewContainer = document.getElementById('previewContainer');
    if (!previewContainer) return;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'preview-item';
    itemDiv.setAttribute('data-id', imageId);
    itemDiv.style.cssText = `
        position: relative;
        display: inline-block;
        margin: 4px;
        border: 2px solid var(--border-primary);
        border-radius: 6px;
        overflow: hidden;
        background: var(--bg-secondary);
    `;

    const img = document.createElement('img');
    img.src = dataUrl;
    img.alt = fileName;
    img.style.cssText = `
        width: 60px;
        height: 60px;
        object-fit: cover;
        display: block;
    `;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-preview-btn';
    removeBtn.textContent = '×';
    removeBtn.onclick = () => removeImage(imageId);
    removeBtn.style.cssText = `
        position: absolute;
        top: 0;
        right: 0;
        width: 16px;
        height: 16px;
        background: rgba(0,0,0,0.7);
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 12px;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

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


// ===== Удаление изображения =====
function removeImage(imageId) {
    // Удаляем из состояния
    userImageState.images = userImageState.images.filter(img => img.id !== imageId);

    // Удаляем превью элемент
    const previewContainer = document.getElementById('previewContainer');
    const item = previewContainer?.querySelector(`[data-id="${imageId}"]`);
    if (item) item.remove();

    // Если нет изображений, скрыть превью
    if (!userImageState.images.length) {
        const preview = document.getElementById('userImagePreview');
        if (preview) preview.classList.add('hidden');
        const wrapper = document.getElementById('userImageWrapper');
        wrapper?.classList.remove('has-image');
    }

    // Показать кнопку загрузки если меньше 4
    const chooseBtn = document.getElementById('chooseUserImage');
    if (chooseBtn && userImageState.images.length < 4) {
        chooseBtn.style.display = '';
    }

    // Обновление видимости выбора размеров
    toggleSizeSelectVisibility();

    // Обновление видимости кнопки и превью согласно логике режима
    updateImageUploadVisibility();
}

// ===== Удаление ВСЕХ изображений (для режима fast_generation) =====
function clearAllImages() {
    console.log('🗑️ Clearing ALL images for mode switch');

    // Очищаем состояние
    userImageState.images = [];

    // Удаляем все превью элементы
    const previewContainer = document.getElementById('previewContainer');
    if (previewContainer) {
        previewContainer.innerHTML = ''; // полная очистка контейнера
    }

    // Скрываем превью контейнер
    const preview = document.getElementById('userImagePreview');
    if (preview) {
        preview.classList.add('hidden');
    }

    // Снимаем класс has-image с wrapper
    const wrapper = document.getElementById('userImageWrapper');
    if (wrapper) {
        wrapper.classList.remove('has-image');
    }

    console.log('✅ All images cleared successfully');

    // 🔥 ДОБАВЛЕНИЕ: Обновляем видимость после очистки
    setTimeout(() => updateImageUploadVisibility(), 50);
}

// ===== Новое функция: Обновление видимости маленькой кнопки внутри превью =====
function updateInnerUploadButtonVisibility() {
    const currentMode = document.getElementById('modeSelect').value;
    const imageCount = userImageState.images.length;
    const previewItems = document.querySelectorAll('.preview-item');

    previewItems.forEach(item => {
        const innerBtn = item.querySelector('.inner-upload-btn');
        if (!innerBtn) return;

        let shouldShowInnerBtn = false;

        if (currentMode === 'photo_session') {
            // Для Photo Session: показываем кнопку пока не достигнут лимит в 4 изображения
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


// ===== Обновление положения кнопки загрузки =====
function updateUploadButtonPosition() {
    const chooseBtn = document.getElementById('chooseUserImage');
    const preview = document.getElementById('userImagePreview');
    const container = document.getElementById('userImageWrapper');
    const hasImages = userImageState.images.length > 0;
    const hasLimitReached = userImageState.images.length >= getImageLimitForMode(document.getElementById('modeSelect')?.value || 'default');

    if (!chooseBtn || !container) return;

    // Удаляем кнопку из текущего положения
    chooseBtn.remove();

    if (hasImages && !hasLimitReached) {
        // Есть изображения И еще можно загружать - вставляем внутрь превью
        if (preview) {
            preview.appendChild(chooseBtn);

            // Переключаем на стиль "внутри превью"
            chooseBtn.classList.add('inside-preview');
            chooseBtn.classList.remove('outside-upload');
            console.log('🔘 Кнопка перемещена ВНУТРЬprev превью');
        }
    } else if (!hasImages && !hasLimitReached) {
        // Нет изображений И можно загружать - вставляем снаружи
        container.appendChild(chooseBtn);

        // Переключаем на стиль "снаружи"
        chooseBtn.classList.add('outside-upload');
        chooseBtn.classList.remove('inside-preview');
        console.log('🔘 Кнопка перемещена СНАРУЖИ');
    }

    // Лимит достигнут - никак не показываем (кнопка скрыта в любом положении)
    if (hasLimitReached) {
        chooseBtn.style.display = 'none';
        console.log('🚫 Кнопка СКРЫТА - достигнут лимит');
    } else {
        chooseBtn.style.display = '';
    }
}

// ===== Показ размеров =====
function toggleSizeSelectVisibility() {
    const sizeSelect = document.getElementById('sizeSelect');
    const sizeGroup = sizeSelect ? sizeSelect.closest('.form-group') : null;

    if (sizeGroup) {
        const modeSelect = document.getElementById('modeSelect');
        const currentMode = modeSelect ? modeSelect.value : '';

        // Специальная логика для разных режимов
        if (currentMode === 'fast_generation') {
            // Для Flux Shnel всегда показываем выбор размеров
            sizeGroup.style.display = '';
            console.log('📏 Size selector visible for Flux Shnel mode');
        } else if (currentMode === 'photo_session') {
            // Для Nano Banana (photo_session) прячем размер при наличии изображений
            if (userImageState.images.length > 0) {
                sizeGroup.style.display = 'none';
                console.log('📏 Size selector hidden for Photo Session mode - has images');
            } else {
                sizeGroup.style.display = '';
                console.log('📏 Size selector visible for Photo Session mode - no images');
            }
        } else {
            // Для других режимов прячем при наличии изображений
            if (userImageState.images.length > 0) {
                sizeGroup.style.display = 'none';
                console.log('📏 Size selector hidden - has images in other mode');
            } else {
                sizeGroup.style.display = '';
                console.log('📏 Size selector visible - no images in other mode');
            }
        }
    }
}

function maybeCompressImage(dataUrl, maxW = 1024, maxH = 1024, quality = 0.9) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
            let w = img.width, h = img.height;
            const ratio = Math.min(maxW / w, maxH / h, 1);
            w = Math.round(w * ratio);
            h = Math.round(h * ratio);

            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(dataUrl);
        img.src = dataUrl;
    });
}

// ===== Загрузка на imgbb и получение публичного URL =====
// Мягкий аплоад: если ключа нет — пропускаем без throw
async function uploadToImgbb(dataUrl, apiKey) {
    const key = (apiKey || '').trim();
    if (!key) {
        console.warn('IMGBB API key missing — skipping user image upload');
        return null; // не ломаем генерацию
    }

    const base64 = String(dataUrl).split(',')[1];
    const form = new FormData();
    form.append('image', base64);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(key)}`, {
        method: 'POST',
        body: form
    });

    let json;
    try {
        json = await res.json();
    } catch (e) {
        console.error('IMGBB: failed to parse JSON', e);
        return null;
    }
    console.debug('imgbb status:', res.status, res.statusText, json);

    if (!res.ok || !json?.success) {
        console.warn('IMGBB upload failed:', json?.error || json);
        return null;
    }
    return json.data.url;
}

// Загружает все выбранные изображения
async function uploadUserImages() {
    const images = userImageState.images;
    console.log('🚀 Starting uploadUserImages process:', {
        totalImages: images ? images.length : 0,
        hasImages: !!images && images.length > 0
    });

    if (!images || images.length === 0) {
        console.log('❌ No images to upload, returning empty array');
        return [];
    }

    const urls = [];

    // Загружаем все изображения параллельно
    const uploadPromises = images.map(async (image, index) => {
        console.log(`🎯 Processing image ${index + 1}/${images.length}:`, {
            hasDataUrl: !!image.dataUrl,
            hasUploadedUrl: !!image.uploadedUrl,
            fileName: image.file?.name || 'unknown'
        });

        if (!image.dataUrl && !image.uploadedUrl) {
            console.warn(`⚠️ Image ${index + 1} has no dataUrl or uploadedUrl`);
            return null;
        }

        // Если уже загружено, используем существующее
        if (image.uploadedUrl) {
            console.log(`✅ Image ${index + 1} already uploaded, using cached URL`);
            return image.uploadedUrl;
        }

        try {
            console.log(`📤 Starting upload for image ${index + 1}/${images.length}`);
            const url = await uploadToImgbb(image.dataUrl, CONFIG.IMGBB_API_KEY);
            console.log(`📥 Upload result for image ${index + 1}:`, url ? 'success' : 'failed');
            image.uploadedUrl = url || null;
            return url;
        } catch (error) {
            console.error(`❌ Failed to upload image ${index + 1}:`, error);
            return null;
        }
    });

    // Ждём загрузки всех изображений
    console.log('⏳ Waiting for all uploads to complete...');
    const uploadedUrls = await Promise.all(uploadPromises);
    console.log('✅ All upload promises resolved');

    // Фильтруем успешные загрузки
    const successfulUrls = uploadedUrls.filter(url => url !== null);
    console.log('🎯 Upload results:', {
        total: images.length,
        successful: successfulUrls.length,
        failed: images.length - successfulUrls.length,
        allUrls: successfulUrls
    });

    return successfulUrls;
}

// 📱 Telegram WebApp Integration

async function initTelegramApp() {
    console.log('📱 Initializing Telegram WebApp (JavaScript)...');

    // ✅ ПРОВЕРКА: Если SDK уже инициализирован HTML - пропускаем повторную инициализацию
    if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
        console.log('✅ Telegram WebApp already initialized by HTML - reusing existing instance');

        // Пытаемся использовать существующий инстанс
        try {
            appState.tg = window.Telegram.WebApp;
            console.log('🧾 Existing WebApp data:', JSON.stringify(appState.tg.initDataUnsafe, null, 2));
        } catch (error) {
            console.error('❌ Error reusing existing Telegram WebApp:', error);
            return;
        }
    } else {
        // Если SDK еще не загружен - используем fallback
        console.log('⚠️ Telegram WebApp not available - using fallback mode');
        appState.userId = 'fallback_js_' + Date.now();
        appState.userName = 'Fallback User';
        showStatus('info', 'Running in fallback mode');
        return;
    }

    try {
        appState.tg = window.Telegram.WebApp;
        appState.tg.ready();
        appState.tg.expand();
        console.log('🧾 Full initDataUnsafe dump:', JSON.stringify(appState.tg.initDataUnsafe, null, 2));

        // ⚠️ ПРОВЕРКА: Есть ли пользователь?
        if (!appState.tg.initData || !appState.tg.initDataUnsafe?.user) {
            showStatus('info', '⚠️ Приложение запущено в режиме разработки. Telegram интеграция недоступна.');
            // Не возвращаем, продолжаем инициализацию
        } else {
            console.log('👤 Пользователь Telegram найден');
        }

        // ✅ УЛУЧШЕННАЯ ДИАГНОСТИКА:
        console.log('🔍 Telegram WebApp data:', {
            available: !!appState.tg,
            platform: appState.tg.platform,
            version: appState.tg.version,
            initDataUnsafe: appState.tg.initDataUnsafe,
            user: appState.tg.initDataUnsafe?.user,
            // НОВЫЕ ПРОВЕРКИ:
            initData: appState.tg.initData, // Сырые данные
            isExpanded: appState.tg.isExpanded,
            viewportHeight: appState.tg.viewportHeight,
            colorScheme: appState.tg.colorScheme,
            themeParams: appState.tg.themeParams
        });

        // ДОПОЛНИТЕЛЬНАЯ ДИАГНОСТИКА:
        console.log('🌍 Environment check:', {
            url: window.location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            isHTTPS: window.location.protocol === 'https:',
            hasInitData: !!appState.tg.initData,
            initDataLength: appState.tg.initData?.length || 0
        });

        console.log('👤 User data extracted:', {
            userId: appState.tg.initDataUnsafe?.user?.id,
            firstName: appState.tg.initDataUnsafe?.user?.first_name,
            lastName: appState.tg.initDataUnsafe?.user?.last_name,
            username: appState.tg.initDataUnsafe?.user?.username
        });

        // Get user data
        if (appState.tg.initDataUnsafe && appState.tg.initDataUnsafe.user) {
            const user = appState.tg.initDataUnsafe.user;

            // Основные данные
            appState.userId = user.id.toString();
            appState.userName = user.first_name + (user.last_name ? ' ' + user.last_name : '');

            // Дополнительные данные пользователя
            appState.userUsername = user.username || null;
            appState.userLanguage = user.language_code || 'en';
            appState.userIsPremium = user.is_premium || false;
            appState.userPhotoUrl = user.photo_url || null;
            appState.userAllowsWriteToPm = user.allows_write_to_pm || false;

            // Данные чата/сессии
            appState.chatInstance = appState.tg.initDataUnsafe.chat_instance || null;
            appState.chatType = appState.tg.initDataUnsafe.chat_type || null;
            appState.authDate = appState.tg.initDataUnsafe.auth_date || null;

            // Платформа и версия
            appState.telegramPlatform = appState.tg.platform || 'unknown';
            appState.telegramVersion = appState.tg.version || 'unknown';

            console.log('✅ REAL USER DATA SET:', {
                userId: appState.userId,
                userName: appState.userName,
                username: appState.userUsername,
                language: appState.userLanguage,
                isPremium: appState.userIsPremium,
                platform: appState.telegramPlatform,
                version: appState.telegramVersion,
                chatType: appState.chatType
            });
        } else {
            // ✅ УЛУЧШЕННАЯ ДИАГНОСТИКА:
            console.log('❌ NO USER DATA - detailed check:', {
                hasInitDataUnsafe: !!appState.tg.initDataUnsafe,
                initDataUnsafeKeys: Object.keys(appState.tg.initDataUnsafe || {}),
                hasInitData: !!appState.tg.initData,
                initDataPreview: appState.tg.initData?.substring(0, 100),
                launchedVia: appState.tg.initDataUnsafe?.start_param || 'unknown',
                currentURL: window.location.href,
                isDirectAccess: !document.referrer.includes('telegram')
            });

            // Разные fallback для разных случаев
            if (!appState.tg.initDataUnsafe) {
                appState.userId = 'fallback_no_unsafe_' + Date.now();
                appState.userName = 'No InitDataUnsafe';
            } else if (!appState.tg.initDataUnsafe.user) {
                appState.userId = 'fallback_no_user_' + Date.now();
                appState.userName = 'No User Data';
            } else {
                appState.userId = 'fallback_unknown_' + Date.now();
                appState.userName = 'Unknown Issue';
            }

            appState.userUsername = null;
            appState.userLanguage = 'en';
            appState.userIsPremium = false;
            appState.userPhotoUrl = null;
            appState.telegramPlatform = appState.tg?.platform || 'unknown';
            appState.telegramVersion = appState.tg?.version || 'unknown';
        }


        // Auto-detect language
        // Auto-detect language, но не перетирать вручную сохранённый
        const tgLangRaw = appState.tg.initDataUnsafe?.user?.language_code;
        const tgLang = tgLangRaw?.split('-')[0]; // "ru-RU" → "ru"
        const saved = JSON.parse(localStorage.getItem('appSettings') || '{}');
        if (!saved.language && tgLang && CONFIG.LANGUAGES.includes(tgLang)) {
            appState.setLanguage(tgLang);
        }

        // Обновляем отображение имени пользователя в интерфейсе
        updateUserNameDisplay();

        showStatus('success', appState.translate('connected'));

    } catch (error) {
        console.error('❌ Telegram initialization error:', error);
        showStatus('error', 'Telegram connection error');
    }
}

function initLanguageDropdown() {
    const btn = document.getElementById('langBtn');
    const menu = document.getElementById('langMenu');
    if (!btn || !menu) return;

    // Заполнить меню языками
    menu.innerHTML = '';
    CONFIG.LANGUAGES.forEach(l => {
        const li = document.createElement('li');
        li.textContent = l; // можно заменить на красивое имя, если нужно
        li.addEventListener('click', (evt) => {
            evt.stopPropagation();
            appState.setLanguage(l);        // сохранится в localStorage через saveSettings()
            menu.style.display = 'none';    // скрыть после выбора
        });
        menu.appendChild(li);
    });

    // Изначально скрыто (дублируем CSS на случай задержки стилей)
    menu.style.display = 'none';

    // Открыть/закрыть по кнопке
    btn.addEventListener('click', (evt) => {
        evt.stopPropagation();
        menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
    });

    // Закрыть при клике вне
    document.addEventListener('click', (evt) => {
        if (!menu.contains(evt.target) && !btn.contains(evt.target)) {
            menu.style.display = 'none';
        }
    });

    // Закрыть по Esc
    document.addEventListener('keydown', (evt) => {
        if (evt.key === 'Escape') {
            menu.style.display = 'none';
        }
    });
}

// 🚀 App Initialization
document.addEventListener('DOMContentLoaded', async function () {
    console.log('🚀 pixPLace Creator starting...');


    showLoadingScreen();
    appState.loadSettings();
    appState.loadHistory();
    appState.loadBalanceHistory();

    try {
        await loadTelegramSDK();    // 👉 дождаться загрузки SDK
        await initTelegramApp();    // 👉 только теперь можно обращаться к WebApp
    } catch (e) {
        console.error('❌ SDK load error:', e);
        showStatus('error', 'Telegram SDK load failed');
    }

    initializeUI();
    initUserImageUpload(); // ← добавь эту строку
    initLanguageDropdown();

    // ✅ ДОБАВЛЕНИЕ: Принудительно устанавливаем Nano Banana выбранным по умолчанию
    setTimeout(() => {
        const modeSelect = document.getElementById('modeSelect');
        if (modeSelect) {
            modeSelect.value = 'photo_session';
            console.log('❤️ Nano Banana set as default mode');
        }
    }, 100);

    const carouselImages = document.querySelectorAll('.carousel-2d-item img');
    carouselImages.forEach(img => {
        img.loading = 'lazy';
        img.decoding = 'async';
    });

    // 🔥 ТОЧЕЧНОЕ ИСПРАВЛЕНИЕ: Гарантируем завершение загрузки даже при проблемах с Telegram
    const finishLoading = () => {
        hideLoadingScreen();
        showApp();
        updateUserBalance(appState.userCredits);
        initAICoach();
    };

    // Проверяем успешность инициализации Telegram и завершаем загрузку
    if (appState.tg) {
        finishLoading(); // Telegram доступен - сразу завершаем
    } else {
        // Telegram не доступен - завершаем через короткий таймаут для стабильности
        setTimeout(finishLoading, 500);
    }
});



// 🖼️ Image Generation - ОБНОВЛЕНО ДЛЯ ПАРАЛЛЕЛЬНОЙ ГЕНЕРАЦИИ
async function generateImage(event) {
    if (event) {
        event.preventDefault();
    }

    const prompt = document.getElementById('promptInput').value.trim();
    const mode = document.getElementById('modeSelect').value;
    const size = document.getElementById('sizeSelect').value;

    // 🚨 ЭКСТРЕННЫЙ ЛОГИНГ: проверка точно перед отправкой
    const checkedMode = document.getElementById('modeSelect').value;
    console.log('🚨 ULTIMATE MODE CHECK - document.getElementById("modeSelect").value:', checkedMode);
    if (checkedMode !== mode) {
        console.error('🚨 MODE MISMATCH! Function param:', mode, 'vs DOM value:', checkedMode);
        mode = checkedMode; // исправляем если есть рассинхрон
    }

    console.log('🚀 Starting generation:', { prompt, style: appState.selectedStyle, mode, size });

    // 🔧 ДОБАВЛЕНИЕ: Логируем выбранные значения для диагностики
    const modeSelect = document.getElementById('modeSelect');
    console.log('🔍 Mode select debug:', {
        selectedValue: modeSelect?.value,
        selectedText: modeSelect?.selectedOptions[0]?.textContent?.trim(),
        selectedIndex: modeSelect?.selectedIndex,
        allOptions: Array.from(modeSelect?.options || []).map(opt => ({
            value: opt.value,
            text: opt.textContent?.trim(),
            selected: opt.selected
        }))
    });

    // 🔧 ДОБАВЛЕНИЕ: Проверим userImageState
    console.log('🔍 User image state:', {
        hasImages: userImageState?.images?.length || 0,
        hasDataUrl: !!(userImageState?.images?.[0]?.dataUrl),
        hasUploadedUrl: !!(userImageState?.images?.[0]?.uploadedUrl)
    });

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

    const generation = {
        id: Date.now(),
        prompt: prompt,
        style: appState.selectedStyle,
        mode: mode,
        size: size,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };

    // Добавляем плавную прокрутку к истории и автоматическое открытие
    setTimeout(async () => {
        await showHistoryWithScroll();
        createLoadingHistoryItem(generation);
    }, 100);

    // 1) Если выбрано пользовательское изображение — загрузим все на imgbb
    let userImageUrls = [];
    try {
        userImageUrls = await uploadUserImages();
        console.log('📤 Uploaded user images:', userImageUrls.length, 'URLs:', userImageUrls);
    } catch (err) {
        console.warn('User images upload failed:', err);
        const errorEl = document.getElementById('userImageError');
        if (errorEl && !errorEl.textContent) {
            errorEl.textContent = 'Не удалось загрузить изображения. Сгенерируем без них.';
        }
    }

    // Добавляем ссылки на изображения к генерации
    if (userImageUrls.length > 0) {
        generation.userImageUrls = userImageUrls;
    }

    // === ПРЕДПАРОДНАЯ ПРОВЕРКА для photo_session без изображения ===
    if (mode === 'photo_session' && userImageUrls.length === 0) {
        // Останавливаем немедленную генерацию и показываем предупреждение
        const shouldContinue = await showWarningAboutNoImage();
        if (!shouldContinue) {
            // Пользователь решил добавить изображение - моргает кнопка загрузки
            startUploadButtonBlink();
            showGeneration();
            return; // НЕ отправляем webhook
        }
        // Продолжаем генерацию без изображения (text-to-image режим)
    }

    startTimer();

        // Добавляем генерацию в очередь менеджера
    const added = generationManager.addGeneration(generation);
    if (!added) {
        console.log('⏳ Generation added to queue');
        showToast('info', appState.translate('generation_queued'));
    } else {
        console.log('🚀 Generation started immediately');
        showToast('info', appState.translate('generation_started'));
    }

    // Добавляем в историю сразу
    appState.generationHistory.unshift(generation);
    appState.saveHistory();
}
// 🌐 Webhook Communication
async function sendToWebhook(data) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);

    // LOG RAW REQUEST BODY FOR DEBUGGING
    const requestData = {
        ...data,
        prompt: sanitizeJsonString(data.prompt) // Restore sanitize for JSON safety
    };

    const requestBody = JSON.stringify(requestData);
    console.log('📤 RAW webhook request body (first 500 chars):', requestBody.substring(0, 500));

    try {
        console.log('📤 Sending webhook request:', {
            ...data,
            prompt: data.prompt.substring(0, 100) + (data.prompt.length > 100 ? '...' : '') // Логируем первые 100 символов промпта
        });

        const response = await fetch(CONFIG.WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: requestBody, // Use raw JSON.stringify, remove sanitizeJsonString
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
            if (contentType && contentType.includes('application/json')) {
                const jsonText = await response.text();
                result = JSON.parse(jsonText);
                console.log('✅ Parsed webhook response:', result);
            } else if (contentType && contentType.includes('text/')) {
                // Сервер вернул текст (например, ошибку)
                const textResponse = await response.text();
                console.log('📄 Server returned text:', textResponse);

                // Проверяем на признак перегрузки серверов (например, "Accepted")
                if (textResponse.trim().toLowerCase() === 'accepted') {
                    console.log('⚠️ Server overload detected, returning special flag');
                    result = { server_overloaded: true, message: appState.translate('error_server_overloaded') };
                } else {
                    throw new Error('Server returned text instead of JSON: ' + textResponse);
                }
            } else {
                // Неопределённый content-type — пытаемся парсить как JSON
                const textResponse = await response.text();
                console.log('📄 Unexpected content-type, trying to parse as JSON:', textResponse);
                try {
                    result = JSON.parse(textResponse);
                } catch (parseError) {
                    console.error('❌ Failed to parse response:', textResponse);
                    throw new Error('Server returned invalid format: ' + textResponse.substring(0, 100));
                }
            }
        } catch (error) {
            console.error('❌ Response parsing error:', error);
            if (error instanceof SyntaxError) {
                throw new Error('Server returned malformed JSON');
            }
            throw error;
        }

        console.log('✅ Parsed webhook response:', result);
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
// 🎨 Style Selection
//  2D Carousel (loop, Android-friendly)
(() => {
    // Находим трек по id или по классу
    const track = document.getElementById('carousel2d') || document.querySelector('.carousel-2d');
    if (!track) { console.warn('[carousel2d] трек не найден'); return; }
    if (track._carouselInited) return; // защита от двойной инициализации
    track._carouselInited = true;

    const cards = Array.from(track.querySelectorAll('.carousel-2d-item'));
    if (!cards.length) { console.warn('[carousel2d] карточки не найдены'); return; }

    let selectedStyle = (cards[0].dataset.style || '').toLowerCase();
    let isPointerDown = false;
    let isPointerInteracting = false;
    let isHighlighting = false;
    let moved = false;
    let startX = 0, startY = 0, startScroll = 0;

    // ===== helpers =====
    function updateGutters() {
        const cardW = cards[0]?.offsetWidth || 0;
        const viewport = track.clientWidth || 0;
        if (!cardW || !viewport) return;
        const gutter = Math.max(0, (viewport - cardW) / 2);
        track.style.paddingLeft = `${gutter}px`;
        track.style.paddingRight = `${gutter}px`;
    }

    function centerCard(card, smooth = true) {
        if (!card) return;
        const viewport = track.clientWidth;
        const left = card.offsetLeft - (viewport - card.offsetWidth) / 2;
        const maxScroll = track.scrollWidth - viewport;
        const clamped = Math.max(0, Math.min(left, maxScroll));
        track.scrollTo({ left: clamped, behavior: smooth ? 'smooth' : 'auto' });
    }

    function highlight(card, { scroll = false } = {}) {
        cards.forEach(c => c.classList.remove('active'));
        if (!card) return;
        card.classList.add('active');

        // Обновляем выбранный стиль
        selectedStyle = (card.dataset.style || '').toLowerCase();
        if (window.appState) window.appState.selectedStyle = selectedStyle;

        // Сообщаем наружу (если кто-то слушает)
        document.dispatchEvent(new CustomEvent('style:change', { detail: { style: selectedStyle } }));

        if (scroll) centerCard(card, true);
    }

    function nearestCard() {
        const trackRect = track.getBoundingClientRect();
        const centerX = trackRect.left + trackRect.width / 2;
        let best = null, bestDist = Infinity;
        for (const c of cards) {
            const r = c.getBoundingClientRect();
            const cardCenter = r.left + r.width / 2;
            const dist = Math.abs(cardCenter - centerX);
            if (dist < bestDist) { bestDist = dist; best = c; }
        }
        return best;
    }
    // ===== /helpers =====

    // Pointer-события (универсально для мыши/тача/пера)
    track.addEventListener('pointerdown', (e) => {
        isPointerDown = true;
        isPointerInteracting = true;
        moved = false;
        startX = e.clientX;
        startY = e.clientY;
        startScroll = track.scrollLeft;
        track.setPointerCapture?.(e.pointerId);
    });

    track.addEventListener('pointermove', (e) => {
        if (!isPointerDown) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (!moved && Math.hypot(dx, dy) > 8) moved = true; // чуть больше порог «дрожания»
        track.scrollLeft = startScroll - dx;
    });

    function endPointer(e) {
        if (!isPointerDown) return;
        isPointerDown = false;

        requestAnimationFrame(() => {
            isPointerInteracting = false;
        });

        if (moved) {
            // после свайпа — снэп к ближайшей
            requestAnimationFrame(() => {
                const c = nearestCard();
                if (c) highlight(c, { scroll: true });
            });
        } else {
            // это «тап»: возьмём элемент под пальцем/мышью
            const el = document.elementFromPoint(e.clientX, e.clientY);
            const card = el?.closest?.('.carousel-2d-item');
            if (card && track.contains(card)) {
                highlight(card, { scroll: true });
            }
        }
    }

    track.addEventListener('pointerup', endPointer);
    track.addEventListener('pointercancel', endPointer);
    track.addEventListener('pointerleave', endPointer);

    // ADD THIS: scroll event listener for manual scroll selection
    track.addEventListener('scroll', () => {
        if (isPointerInteracting) return; // Don't update during pointer interaction

        const card = nearestCard();
        if (card && !card.classList.contains('active')) {
            requestAnimationFrame(() => {
                highlight(card, { scroll: false }); // Select without scrolling to prevent infinite loop
            });
        }
    });

    // Доп. фолбэк: явные клики по карточкам (на случай, если pointer события где-то перехватываются)
    cards.forEach(c => {
        c.addEventListener('click', (e) => {
            // если только что был свайп — не считаем это кликом
            if (moved) return;
            highlight(c, { scroll: true });
        });
    });

    // Публичный API (если где-то вызывается)
    window.getSelectedStyle = function () { return selectedStyle; };
    window.setCarouselStyle = function (style) {
        const target = String(style || '').toLowerCase();
        const card = cards.find(c => (c.dataset.style || '').toLowerCase() === target);
        if (card) highlight(card, { scroll: true });
    };

    // Инициализация
    updateGutters();
    highlight(cards[0], { scroll: false });

    window.addEventListener('resize', () => {
        updateGutters();
        const active = track.querySelector('.carousel-2d-item.active');
        if (active) centerCard(active, true);
    });
})();

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
        appState.saveHistory();
    }

    appState.isGenerating = false;
    stopTimer();
    showGeneration();
    triggerHaptic('medium');
}

// 📱 Device Integration
async function downloadImage() {
    if (!appState.currentGeneration?.result) return;

    console.log('📱 Starting download for platform:', {
        mobile: isMobile(),
        android: isAndroid(),
        ios: isIOS(),
        tablet: isTablet(),
        share: supportsShare(),
        url: appState.currentGeneration.result
    });

    try {
        // Скачиваем изображение как blob
        showToast('info', 'Preparing file...');
        const response = await fetch(appState.currentGeneration.result);
        if (!response.ok) throw new Error('Failed to fetch image');
        const blob = await response.blob();

        // Если мобильное устройство и поддерживает Web Share API - используем его
        if (isMobile() && supportsShare()) {
            console.log('📱 Using Web Share API for mobile device');

            const file = new File([blob], `ai-generated-${appState.currentGeneration.id}.png`, { type: blob.type });

            const shareData = {
                files: [file],
                title: 'AI Generated Image',
                text: 'Created with pixPLace Bot'
            };

            await navigator.share(shareData);
            showToast('success', 'File shared successfully!');
            triggerHaptic('success');
            return;
        }

        // Для Android/WebView или старых мобильных - открываем в новой вкладке
        if (isAndroid() || (isMobile() && !supportsShare())) {
            console.log('📱 Android or old mobile - opening in new tab');
            window.open(appState.currentGeneration.result, '_blank');
            showToast('info', 'Tap and hold to save image');
            triggerHaptic('light');
            return;
        }

        // Для планшетов - аналогично мобильным
        if (isTablet()) {
            console.log('📱 Tablet - opening in new tab');
            window.open(appState.currentGeneration.result, '_blank');
            showToast('info', 'Use long press to download');
            triggerHaptic('light');
            return;
        }

        // Для десктопа (Mac/Windows/Linux) - стандартный подход
        console.log('💻 Desktop - platform detection:', {
            userAgent: navigator.userAgent.toLowerCase(),
            isTelegramWebApp: !!appState.tg,
            telegramPlatform: appState.telegramPlatform
        });

        // 🔥 СПЕЦИАЛЬНАЯ ОБРАБОТКА ДЛЯ TELEGRAM WEBAPP НА MAC
        if (appState.tg && appState.telegramPlatform === 'macos') {
            console.log('🍏 Telegram WebApp on Mac - using direct URL open');
            window.open(appState.currentGeneration.result, '_blank');
            showToast('info', 'Opened image in new tab');
            triggerHaptic('light');
            return;
        }

        // Стандартный blob download для обычных браузеров
        console.log('💻 Standard desktop browser - using blob download');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ai-generated-${appState.currentGeneration.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showToast('success', 'Download started!');
        triggerHaptic('success');

    } catch (err) {
        console.error("❌ Download error:", err);

        // Fallback для любой ошибки - открываем в новой вкладке
        try {
            window.open(appState.currentGeneration.result, '_blank');
            showToast('info', 'Opened image in new tab');
        } catch (fallbackErr) {
            console.error("❌ Fallback failed:", fallbackErr);
            showToast('error', 'Download failed');
        }
    }
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
window.showSubscriptionNotice = showSubscriptionNotice;

// 🎵 Music Functions
/*let currentWidget = null;
let isPlaying = false;

function toggleMusicDropdown() {
    const dropdown = document.getElementById('musicDropdown');
    const isVisible = dropdown.style.display === 'block';

    if (isVisible) {
    dropdown.style.display = 'none';
    } else {
    dropdown.style.display = 'block';
    }

    console.log('🎵 Music dropdown toggled:', !isVisible);
}

function playPlaylist(type) {
    const playlists = {
    lofi: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/330718027&color=%237a8fb5&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false',
    ambient: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/330718027&color=%237a8fb5&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false',
    jazz: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/330718027&color=%237a8fb5&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false',
    relax: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/330718027&color=%237a8fb5&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false'
    };

    const iframe = document.getElementById('musicPlayer');
    iframe.src = playlists[type];

    // Показать контролы
    const controls = document.getElementById('musicControls');
    if (controls) {
    controls.style.display = 'flex';
    }

    // Обновить кнопку
    const playBtn = document.getElementById('playPauseBtn');
    if (playBtn) {
    playBtn.textContent = '▶ Play';
    playBtn.onclick = function () {
    startMusicPlayback(type);
    };
    }

    console.log(`🎵 Loading ${type} playlist`);
}

function startMusicPlayback(type) {
    const playlists = {
    lofi: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/330718027&color=%237a8fb5&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false',
    ambient: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/330718027&color=%237a8fb5&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false',
    jazz: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/330718027&color=%237a8fb5&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false',
    relax: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/330718027&color=%237a8fb5&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false'
    };

    const iframe = document.getElementById('musicPlayer');
    iframe.src = playlists[type];

    const playBtn = document.getElementById('playPauseBtn');
    if (playBtn) {
    playBtn.textContent = '⏸';
    playBtn.onclick = togglePlayPause;
    }

    isPlaying = true;
    console.log(`🎵 Started ${type} playlist`);
}

function togglePlayPause() {
    const playBtn = document.getElementById('playPauseBtn');
    if (isPlaying) {
    playBtn.textContent = '▶';
    isPlaying = false;
    } else {
    playBtn.textContent = '⏸';
    isPlaying = true;
    }
}

function setVolume(value) {
    console.log(`🔊 Volume set to ${value}%`);
}

// Закрытие dropdown при клике вне его
document.addEventListener('click', function (event) {
    const musicWidget = document.querySelector('.music-widget');
    const dropdown = document.getElementById('musicDropdown');

    if (musicWidget && dropdown && !musicWidget.contains(event.target)) {
    dropdown.style.display = 'none';
    }
});*/
// 🔗 Telegram SDK Loader
async function loadTelegramSDK() {
    console.log('📱 Loading Telegram WebApp SDK...');

    // Если уже загружен - сразу возвращаем
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        console.log('✅ Telegram SDK already loaded');
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            console.warn('⚠️ Telegram SDK load timeout - using fallback mode');
            resolve(); // разрешаем продолжить без SDK
        }, 5000); // 5 секунд таймут

        // Проверяем наличие скрипта Telegram
        const existingScript = document.querySelector('script[src*="telegram-web-app.js"]');
        if (existingScript) {
            console.log('✅ Telegram script already exists');
            clearTimeout(timeout);
            resolve();
            return;
        }

        // Создаём и загружаем скрипт
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-web-app.js';
        script.async = true;
        script.defer = true;

        script.onload = () => {
            console.log('✅ Telegram SDK loaded successfully');
            clearTimeout(timeout);

            // Подождём небольшую задержку для инициализации SDK
            setTimeout(() => {
                resolve();
            }, 100);
        };

        script.onerror = (error) => {
            console.error('❌ Failed to load Telegram SDK:', error);
            clearTimeout(timeout);
            resolve(); // разрешаем продолжить без SDK
        };

        // Добавляем скрипт в head
        document.head.appendChild(script);
        console.log('📱 Telegram SDK loading started...');
    });
}

// 🧪 Debug Functions
window.getAppState = () => appState;
window.setWebhookUrl = (url) => {
    CONFIG.WEBHOOK_URL = url;
    console.log('✅ Webhook URL updated');
};

// Функция для безопасного экранирования пользовательского текста перед JSON.stringify
function getStatusText(status) {
    switch (status) {
        case 'processing': return '⏳';
        case 'success': return '✅';
        case 'error': return '❌';
        default: return status;
    }
}

function sanitizeJsonString(str) {
    if (typeof str !== 'string') return str;

    return str
        .replace(/\\/g, '\\\\')  // Экранируем обратные слэши
        .replace(/"/g, '\\"')    // Экранируем кавычки
        .replace(/\n/g, '\\n')   // Заменяем переносы на \n
        .replace(/\r/g, '\\r')   // Заменяем \r
        .replace(/\t/g, '\\t');  // Заменяем табуляции
}

console.log('✅ JSON Sanitizer интегрирован для защиты от JSON-парсинга ошибок');

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

// ========== COGNITIVE ASSISTANT INTEGRATION ==========
function createCoachButton() {
    // Create button
    const coachButton = document.createElement('button');
    coachButton.textContent = 'AI Prompt Assistant';
    coachButton.className = 'ai-coach-btn';

    // Ванильные CSS стили вместо Tailwind классов (проект не использует Tailwind)
    Object.assign(coachButton.style, {
        position: 'fixed',
        top: '6rem',         // top-4 = 16px
        right: '1rem',       // right-4 = 16px
        zIndex: '40',        // z-40
        background: 'linear-gradient(135deg, #173565ff, #2f3032ff)', // blue-600 to blue-700
        color: 'white',
        padding: '0.5rem 1rem', // px-4 py-2
        borderRadius: '0.5rem',   // rounded-lg
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', // shadow-lg
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',   // text-sm
        fontWeight: '600',
        transition: 'all 0.2s ease' // transition-all duration-200
    });

    // Восстанавливаю правильную функциональность - открытие AI чата
    coachButton.onclick = () => {
        if (window.AICoach) {
            window.AICoach.show();
        } else {
            console.warn('AI Coach not loaded');
        }
    };

    // Add to body (fixed position for easy access)
    document.body.appendChild(coachButton);

    // Style injection for button (minimal)
    const style = document.createElement('style');
    style.textContent = `
        .ai-coach-btn {
            font-size: 14px;
            border: none;
            cursor: pointer;
        }
        .ai-coach-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
    `;
    document.head.appendChild(style);

    console.log('🧠 AI Coach button created');
}

async function initAICoach() {
    try {
        // Проверить, что AICoach доступен (уже загружен из HTML)
        if (!window.AICoach) {
            console.warn('AI Coach not loaded from HTML');
            return;
        }

        createCoachButton();
        // Дополнительно можно прослушать событие, если нужно
        window.addEventListener('ai-coach-ready', createCoachButton);
    } catch (error) {
        console.error('Failed to init AI Coach:', error);
    }
}

function createChatButton() {
    // Create floating chat button
    const chatBtn = document.createElement('button');
    chatBtn.id = 'ai-chat-float-btn';
    chatBtn.innerHTML = 'AI Chat';
    chatBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 20px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 8px;
    `;

    chatBtn.onmouseenter = () => {
        chatBtn.style.transform = 'scale(1.05)';
        chatBtn.style.boxShadow = '0 6px 25px rgba(99, 102, 241, 0.6)';
    };

    chatBtn.onmouseleave = () => {
        chatBtn.style.transform = 'scale(1)';
        chatBtn.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.4)';
    };

    chatBtn.onclick = () => {
        if (window.AICoach) {
            window.AICoach.show();
            triggerHaptic('light');
        }
    };

    document.body.appendChild(chatBtn);
    console.log('🧠 AI Chat floating button created');
}

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
        console.log('Plans carousel not found, skipping init');
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

        // Простая обработка свайпа
        if (Math.abs(diff) > 60 && touchDuration > 100) {
            if (diff > 0 && currentPlanSlide < totalSlides - 1) {
                scrollToSlide(currentPlanSlide + 1);
            } else if (diff < 0 && currentPlanSlide > 0) {
                scrollToSlide(currentPlanSlide - 1);
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

// 🎨 ЭФФЕКТЫ СТЕКЛА
function initGlassmorphismEffects() {
    const cards = document.querySelectorAll('.plan-card');

    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';

        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
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
                        initGlassmorphismEffects();
                    }, 100);
                }
            }
        });
    });

    const modal = document.getElementById('limitModal');
    if (modal) {
        observer.observe(modal, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
});

// 🎨 Функция моргания кнопки загрузки для привлечения внимания (использует существующую анимацию need-image-pulse)
function startUploadButtonBlink() {
    const chooseBtn = document.getElementById('chooseUserImage');
    if (!chooseBtn) return;

    console.log('🎯 Starting upload button pulse animation');

    // Применяем существующую анимацию need-image-pulse (настройка длительности)
    chooseBtn.style.animation = 'need-image-pulse 2.4s infinite';  // ← МЕНЯЙТЕ ДЛИТЕЛЬНОСТЬ ЗДЕСЬ (4s - 4 секунды)

    // Через несколько секунд убираем анимацию
    setTimeout(() => {
        chooseBtn.style.animation = '';
        console.log('✅ Upload button pulse animation stopped');
    }, 10000);  // ← МЕНЯЙТЕ ОБЩУЮ ПРОДОЛЖИТЕЛЬНОСТЬ ЗДЕСЬ (4000мс - 4 секунды)

    // Дополнительно прокручиваем к кнопке если она не видна
    setTimeout(() => {
        chooseBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

// 🎨 Функция показа предупреждения для Photo Session без изображения
async function showWarningAboutNoImage() {
    return new Promise((resolve) => {
        // Создаем оверлей и модал
        const overlay = document.createElement('div');
        overlay.id = 'photo-warning-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: var(--bg-primary, #ffffff);
            border-radius: 20px;
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            transform: translateY(20px);
            transition: transform 0.3s ease;
        `;

        modal.innerHTML = `
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🎨</div>
                <h3 style="margin: 0 0 1rem 0; color: var(--text-primary, #333); font-size: 1.25rem; font-weight: 600;">${appState.translate('photo_warning_title')}</h3>
                <p style="margin: 0; color: var(--text-secondary, #666); font-size: 1rem; line-height: 1.5;">
                    ${appState.translate('photo_warning_text')}
                </p>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button id="upload-image-btn" style="
                    flex: 1;
                    padding: 6px 6px;
                    background: linear-gradient(135deg, #7e94f7ff 0%, #1d5df3ff 100%);
                    color: white;
                    border: none;
                    border-radius: 34px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                ">
                    ${appState.translate('photo_warning_upload_btn')}
                </button>
                <button id="continue-without-btn" style="
                    flex: 1;
                    padding: 6px 6px;
                    background: linear-gradient(135deg, #ee4c62ff 0%, #f72e48ff 100%);
                    color: white;
                    border: none;
                    border-radius: 34px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 15px rgba(245, 87, 108, 0.3);
                ">
                    ${appState.translate('photo_warning_continue_btn')}
                </button>
            </div>
        `;

        // Добавляем эффекты hover для кнопок
        const style = document.createElement('style');
        style.textContent = `
            #upload-image-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
            }
            #continue-without-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(245, 87, 108, 0.5);
            }
        `;
        document.head.appendChild(style);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Анимация появления
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            modal.style.transform = 'translateY(0)';
        });

        // Обработчики кнопок
        const uploadBtn = modal.querySelector('#upload-image-btn');
        const continueBtn = modal.querySelector('#continue-without-btn');

        uploadBtn.addEventListener('click', () => {
            // Закрываем модал
            overlay.style.opacity = '0';
            modal.style.transform = 'translateY(20px)';
            setTimeout(() => {
                document.body.removeChild(overlay);
                document.head.removeChild(style);
                resolve(false); // false значит не продолжаем генерацию, пользователь пойдет загружать изображение
            }, 300);

            // Запуск моргания кнопки upload для привлечения внимания
            startUploadButtonBlink();

            // Опционально: промотать к блоку загрузки изображений
            const imageUpload = document.getElementById('userImageWrapper');
            if (imageUpload) {
                imageUpload.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });

        continueBtn.addEventListener('click', () => {
            // Закрываем модал
            overlay.style.opacity = '0';
            modal.style.transform = 'translateY(20px)';
            setTimeout(() => {
                document.body.removeChild(overlay);
                document.head.removeChild(style);
                resolve(true); // true значит продолжаем генерацию
            }, 300);
        });

        // Закрытие по клику на оверлей
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.opacity = '0';
                modal.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    document.head.removeChild(style);
                    resolve(false); // Закрытие = отмена генерации
                }, 300);
            }
        });
    });
}
// Экспорт функций для использования
