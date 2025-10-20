// store/app-state.js - Центральный менеджер состояния приложения
export class AppStateManager {
    constructor() {
        this.listeners = new Set();
        this.state = {
            // Язык и тема
            language: 'en',
            theme: 'dark',

            // Пользователь
            user: {
                id: null,
                name: null,
                credits: null,
                username: null,
                language: 'en',
                isPremium: false
            },

            // Telegram объект (для обратной совместимости)
            tg: null,

            // История генераций
            generationHistory: [],
            currentGeneration: null,

            // Баланс и история баланса
            balanceHistory: [],

            // Изображения пользователя
            userImageState: {
                images: [] // массив объектов {id, file, dataUrl, uploadedUUID}
            },

            // Стиль (для генерации изображений)
            selectedStyle: 'realistic',

            // Таймеры
            startTime: null,
            timerInterval: null,

            // Снегопад
            snowfallEnabled: false,

            // UI состояние
            isGenerating: false
        };
    }

    // Подписка на изменения
    subscribe(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    // Отписка всех слушателей
    unsubscribeAll() {
        this.listeners.clear();
    }

    // Получение текущего состояния
    getState() {
        return { ...this.state };
    }

    // Установка состояния целиком
    setState(newState) {
        const oldState = { ...this.state };
        this.state = { ...newState };
        this._notifyListeners(this.state, oldState);
    }

    // Частичное обновление состояния
    updateState(updates) {
        const oldState = { ...this.state };
        this.state = { ...this.state, ...updates };
        this._notifyListeners(this.state, oldState);
    }

    // Доступ к конкретным частям состояния
    get language() { return this.state.language; }
    get theme() { return this.state.theme; }
    get user() { return this.state.user; }
    get generationHistory() { return this.state.generationHistory; }
    get currentGeneration() { return this.state.currentGeneration; }
    set currentGeneration(value) { this.state.currentGeneration = value; }
    get userImageState() { return this.state.userImageState; }
    get selectedStyle() { return this.state.selectedStyle; }
    set selectedStyle(value) { this.updateState({ selectedStyle: value }); }
    get tg() { return this.state.tg; }
    set tg(value) { this.updateState({ tg: value }); }

    // Метод для установки Telegram объекта
    setTg(tgObj) {
        this.tg = tgObj;
    }

    // Методы для обновления языка
    setLanguage(lang) {
        this.updateState({ language: lang });
        document.body.setAttribute('data-lang', lang);

        // Обновить статические переводы
        this.updateTranslations();

        // Обновить динамические элементы (история, модалы и т.д.)
        import('../history-manager.js').then(module => {
            if (module.updateHistoryLanguage) {
                module.updateHistoryLanguage(lang);
            }
        }).catch(console.warn);
    }

    // Методы для обновления темы
    setTheme(theme) {
        this.updateState({ theme });
        document.body.setAttribute('data-theme', theme);
    }

    // Методы для работы с пользователем
    setUser(userData) {
        this.updateState({
            user: { ...this.state.user, ...userData }
        });
    }

    // Методы для работы с историей генераций
    setGenerationHistory(history) {
        // 🔥 ИСПРАВЛЕНИЕ ПОРЯДКА: СОРТИРУЕМ МАССИВ ПО ID В ОБРАТНОМ ПОРЯДКЕ ДЛЯ ЗАГРУЗКИ Из localStorage
        // Новые генерации должны быть ПЕРВЫМИ (новые ID - большие числа)
        const sortedHistory = Array.isArray(history) ? history.sort((a, b) => b.id - a.id) : history;
        this.updateState({ generationHistory: sortedHistory });
    }

    addGeneration(generation) {
        const newHistory = [...this.state.generationHistory, generation];
        this.updateState({ generationHistory: newHistory });
    }

    updateGeneration(id, updates) {
        const newHistory = this.state.generationHistory.map(gen =>
            gen.id === id ? { ...gen, ...updates } : gen
        );
        this.updateState({ generationHistory: newHistory });
    }

    // Метод сохранения истории
    saveHistory() {
        try {
            localStorage.setItem('generationHistory', JSON.stringify(this.state.generationHistory));
        } catch (error) {
            console.error('Failed to save history:', error);
            // Попытка сохранить в sessionStorage как fallback
            try {
                sessionStorage.setItem('generationHistory', JSON.stringify(this.state.generationHistory));
            } catch (fallbackError) {
                console.error('Fallback storage also failed:', fallbackError);
            }
        }
    }

    // Методы для работы с настройками (из старого AppState)
    saveSettings() {
        try {
            localStorage.setItem('appSettings', JSON.stringify({
                language: this.state.language,
                theme: this.state.theme
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

    // Методы для работы с балансом
    saveBalanceHistory() {
        try {
            localStorage.setItem('balanceHistory', JSON.stringify(this.state.balanceHistory));
        } catch (error) {
            console.error('Failed to save balance history:', error);
        }
    }

    loadBalanceHistory() {
        try {
            const history = localStorage.getItem('balanceHistory');
            if (history) {
                this.updateState({ balanceHistory: JSON.parse(history) });
                // Инициализируем текущий баланс самым свежим значением из истории
                if (this.state.balanceHistory.length > 0) {
                    const latestEntry = this.state.balanceHistory[this.state.balanceHistory.length - 1];
                    this.updateState({
                        user: {
                            ...this.state.user,
                            credits: latestEntry.balance
                        }
                    });
                }
            } else {
                this.updateState({ balanceHistory: [] });
            }
        } catch (error) {
            console.error('Failed to load balance history:', error);
            this.updateState({ balanceHistory: [] });
        }
    }

    // Переключение языка
    toggleLanguage() {
        const CONFIG_LANGUAGES = ['en', 'ru', 'es', 'fr', 'de', 'zh', 'pt', 'ar', 'hi', 'ja', 'it', 'ko', 'tr', 'pl', 'vi', 'th'];
        const currentIndex = CONFIG_LANGUAGES.indexOf(this.state.language);
        const nextIndex = (currentIndex + 1) % CONFIG_LANGUAGES.length;
        this.setLanguage(CONFIG_LANGUAGES[nextIndex]);
    }

    // Переключение темы
    toggleTheme() {
        const themes = ['light', 'dark', 'auto'];
        const currentIndex = themes.indexOf(this.state.theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.setTheme(themes[nextIndex]);
    }

    // Метод обновления переводов в UI (из старого AppState)
    updateTranslations() {
        // Получаем переводы для текущего языка
        const currentTranslations = getTranslations(this.state.language);
        if (!currentTranslations) return;

        // Обновляем обычные элементы с data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = currentTranslations[key] || key;
            element.textContent = translation;
        });

        // Обновляем элементы с placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = currentTranslations[key] || key;
            element.placeholder = translation;
        });

        // Обновляем элементы с data-i18n-price для ценовых данных
        document.querySelectorAll('[data-i18n-price]').forEach(element => {
            const key = element.getAttribute('data-i18n-price');
            const translation = currentTranslations[key] || key;
            element.textContent = translation;
        });

        console.log(`📝 Updated translations to ${this.state.language}`);
    }

    // Метод translate для обратной совместимости
    translate(key) {
        return getTranslations(this.state.language)?.[key] || key;
    }

    // Методы для работы с изображениями
    setImageState(imageState) {
        this.updateState({ userImageState: imageState });
    }

    // Сериализация состояния для localStorage
    serialize() {
        return {
            language: this.state.language,
            theme: this.state.theme,
            user: this.state.user,
            telegram: this.state.telegram,
            generationHistory: this.state.generationHistory,
            balanceHistory: this.state.balanceHistory
        };
    }

    // Десериализация состояния из localStorage
    deserialize(data) {
        if (data.language) this.state.language = data.language;
        if (data.theme) this.state.theme = data.theme;
        if (data.user) this.state.user = { ...this.state.user, ...data.user };
        if (data.telegram) this.state.telegram = { ...this.state.telegram, ...data.telegram };
        if (data.generationHistory) this.state.generationHistory = data.generationHistory;
        if (data.balanceHistory) this.state.balanceHistory = data.balanceHistory;
    }

    // Уведомление слушателей об изменениях
    _notifyListeners(newState, oldState) {
        this.listeners.forEach(callback => {
            try {
                callback(newState, oldState);
            } catch (error) {
                console.error('Error in state listener:', error);
            }
        });
    }
}

// Глобальный переводчик с учетом состояния
export function translate(key, stateManager) {
    const language = stateManager?.language || 'en';
    // Получаем словарь для текущего языка
    const translations = getTranslations(language);
    return translations?.[key] || key;
}

// Доступ к статическому объекту TRANSLATIONS из app_modern.js
let translationsObject = null;

function getTranslations(lang) {
    // Если TRANSLATIONS объект еще не доступен - создаем базовый
    if (!translationsObject) {
        // Базовые переводы для обратной совместимости
        const defaultTranslations = {
            'error_prompt_required': 'Please enter a prompt',
            'error_prompt_too_short': 'Prompt too short, minimum 5 characters',
            'error_webhook_not_configured': 'Webhook not configured',
            'error_server_overloaded': 'Server overloaded, please try again later',
            'error_timeout': 'Request timeout',
            'connected': 'Connected successfully',
            'download_started': 'Download started',
            'copied_to_clipboard': 'Copied to clipboard',
            'please_upload_for_upscale': 'Please upload an image to upscale',
            'please_upload_for_background_removal': 'Please upload an image for background removal',
            'please_upload_photo_session': 'Please upload an image for photo session',
            'image_limit_error': 'Maximum of {{count}} images allowed'
        };

        // Пытаемся получить доступ к TRANSLATIONS из window
        try {
            translationsObject = window.TRANSLATIONS || defaultTranslations;
        } catch (e) {
            translationsObject = defaultTranslations;
        }
    }

    return translationsObject[lang] || translationsObject['en'] || {};
}
