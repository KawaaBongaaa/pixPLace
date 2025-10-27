// store/app-state.js - Центральный менеджер состояния приложения
export class AppStateManager {
    constructor() {
        this.listeners = new Set();
        this.state = {
            // Язык и тема (флаг для пользовательского выбора)
            language: 'en',
            isLanguageSetByUser: false, // Пользователь сам выбрал язык vs дефолт браузера
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
    get isLanguageSetByUser() { return this.state.isLanguageSetByUser; }

    // Метод для установки Telegram объекта
    setTg(tgObj) {
        this.tg = tgObj;
    }

    // Методы для обновления языка
    async setLanguage(lang) {
        this.updateState({
            language: lang,
            isLanguageSetByUser: true // Пользователь явно выбрал этот язык
        });
        document.body.setAttribute('data-lang', lang);

        // 🔥 ИСПОЛЬЗУЕМ DICTIONARY MANAGER ДЛЯ LAZY LOADING (должен быть загружен)
        if (window.dictionaryManager) {
            await window.dictionaryManager.setLanguage(lang);
        }

        // Сохранить настройки после изменения языка
        this.saveSettings();
    }

    // Методы для обновления темы
    setTheme(theme) {
        console.log('🎨 setTheme called with:', theme, 'current:', this.state.theme);
        const oldTheme = this.state.theme;
        this.updateState({ theme });

        // 🔥 ИСПРАВЛЕНИЕ ДЛЯ 'AUTO' ТЕМЫ: Используем 'auto' напрямую для CSS media queries
        document.body.setAttribute('data-theme', theme);
        console.log('🎨 Theme set to:', theme, 'DOM attribute:', theme, '(was:', oldTheme, ')');

        // 🔥 ДОБАВЛЕНИЕ: Сохраняем тему сразу при изменении!
        this.saveSettings();
        console.log('💾 Theme saved to localStorage:', theme);

        // 🔥 НОВОЕ: Настраиваем слушатель изменений системной темы для auto режима
        this.setupAutoThemeListener(theme === 'auto');
    }

    // 🔥 НОВОЕ: Обнаружение системной темы браузера (light/dark)
    detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // 🔥 НОВОЕ: Настройка слушателя изменений системной темы (для auto режима)
    setupAutoThemeListener(isAutoMode) {
        // Отключаем предыдущий слушатель если он существовал
        if (this.themeChangeListener) {
            this.themeChangeListener.removeEventListener('change', this.themeChangeHandler);
            this.themeChangeListener = null;
            this.themeChangeHandler = null;
        }

        // Если включен auto режим - создаем новый слушатель
        if (isAutoMode) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            // Обработчик изменения темы системы
            this.themeChangeHandler = (event) => {
                const newSystemTheme = event.matches ? 'dark' : 'light';
                console.log('🌓 System theme changed to:', newSystemTheme, '(auto mode)');
                document.body.setAttribute('data-theme', newSystemTheme);
            };

            // Добавляем слушатель
            mediaQuery.addEventListener('change', this.themeChangeHandler);
            this.themeChangeListener = mediaQuery;

            console.log('🎯 Auto theme listener activated');
        } else {
            console.log('🎯 Auto theme listener deactivated');
        }
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
                isLanguageSetByUser: this.state.isLanguageSetByUser, // 🔥 ДОБАВЛЕНО: сохраняем флаг!
                theme: this.state.theme
            }));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }

    loadSettings() {
        console.log('🔄 STARTING loadSettings() function');
        try {
            const storedSettings = localStorage.getItem('appSettings');
            console.log('💾 Loading settings from localStorage:', storedSettings);
            console.log('📋 localStorage contents:', Object.keys(localStorage));

            const settings = storedSettings ? JSON.parse(storedSettings) : {};
            console.log('✅ Parsed settings:', settings);

            // Загружаем тему с откатом на дефолт
            const theme = settings.theme || 'dark';
            console.log('🎨 Loading theme:', theme);
            this.setTheme(theme);

            // 🔥 ДОБАВЛЕНИЕ: ВОССТАНАВЛИВАЕМ ФЛАГ isLanguageSetByUser ИЗ localStorage
            // С откатом на false
            const isLanguageSetByUser = settings.isLanguageSetByUser !== undefined ? settings.isLanguageSetByUser : false;
            console.log('🌍 Loading isLanguageSetByUser:', isLanguageSetByUser);
            this.updateState({ isLanguageSetByUser });

            console.log('✅ Settings loaded successfully');

        } catch (error) {
            console.error('❌ Failed to load settings from localStorage:', error);
            // 🔥 ДОБАВЛЕНИЕ: ОТКАТ НА ДЕФОЛТНЫЕ НАСТРОЙКИ ПРИ ОШИБКЕ
            console.warn('⚠️ Using default settings fallback');
            this.setTheme('dark'); // дефолтная тема
            this.updateState({ isLanguageSetByUser: false }); // дефолтный флаг языка
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

    // 🔥 НОВОЕ: Прямое сохранение текущего баланса для надежности
    saveCurrentBalance() {
        try {
            // Не сохранять null - использовать 0 если баланс еще не установлен
            const balanceToSave = this.state.user?.credits ?? 0;
            localStorage.setItem('currentBalance', balanceToSave);
            console.log('💾 Current balance saved to localStorage:', balanceToSave, '(was:', this.state.user?.credits, ')');
        } catch (error) {
            console.error('Failed to save current balance:', error);
        }
    }

    // 🔥 ДОБАВЛЕНИЕ: Метод инициализации дефолтных значений при первом запуске
    initializeDefaults() {
        console.log('🚀 Initializing default app state...');

        // Инициализируем настройки если они отсутствуют
        const existingSettings = localStorage.getItem('appSettings');
        if (!existingSettings) {
            console.log('⚙️ No settings found, saving defaults...');
            this.saveSettings(); // Сохраняем дефолтные настройки
        }

        // Инициализируем пустую историю баланса если она отсутствует
        const existingBalance = localStorage.getItem('balanceHistory');
        if (!existingBalance) {
            console.log('💰 No balance history found, initializing empty...');
            this.saveBalanceHistory(); // Сохраняем пустую историю
        }

        // 🔥 НОВОЕ: Инициализируем бэкап баланса если он отсутствует или поврежден
        const existingBalanceBackup = localStorage.getItem('currentBalance');
        const balanceValue = existingBalanceBackup ? parseFloat(existingBalanceBackup) : NaN;

        if (!existingBalanceBackup || isNaN(balanceValue) || balanceValue < 0) {
            console.log('💰 No valid balance backup found, initializing with 20 credits...');
            // Очищаем поврежденные данные
            if (existingBalanceBackup !== null) {
                localStorage.removeItem('currentBalance');
                console.log('🧹 Cleared corrupted balance backup');
            }

            this.updateState({
                user: {
                    ...this.state.user,
                    credits: 20
                }
            });
            this.state.user.credits = 20; // 🔥 ДОБАВЛЕНИЕ: Прямое присвоение
            console.log('💰 State directly set to:', this.state.user.credits);
            this.saveCurrentBalance(); // Сохраняем начальный баланс
        } else {
            console.log('💰 Valid balance backup found:', balanceValue);
        }

        console.log('✅ Defaults initialized successfully');
    }

    loadBalanceHistory() {
        try {
            const storedHistory = localStorage.getItem('balanceHistory');
            console.log('💰 Loading balance history from localStorage:', storedHistory);

            if (storedHistory) {
                const history = JSON.parse(storedHistory);
                console.log('✅ Parsed balance history:', history);

                if (Array.isArray(history)) {
                    this.updateState({ balanceHistory: history });

                    // Инициализируем текущий баланс самым свежим значением из истории
                    if (history.length > 0) {
                        const latestEntry = history[history.length - 1];
                        if (latestEntry && typeof latestEntry.balance === 'number') {
                            console.log('🪙 Setting current balance to:', latestEntry.balance);
                            this.updateState({
                                user: {
                                    ...this.state.user,
                                    credits: latestEntry.balance
                                }
                            });
                        } else {
                            console.warn('⚠️ Latest balance entry is invalid:', latestEntry);
                        }
                    } else {
                        console.log('📭 No balance history entries found - checking direct backup...');
                        // 🔥 НОВОЕ: Проверить бэкап даже при пустой истории
                        const directBalance = localStorage.getItem('currentBalance');
                        console.log('🔍 DEBUG: directBalance from localStorage:', directBalance, 'type:', typeof directBalance);

                        if (directBalance !== null) {
                            const balance = parseFloat(directBalance);
                            console.log('🧮 DEBUG: parsed balance:', balance, 'isNaN:', isNaN(balance), 'balance >= 0:', balance >= 0);

                            if (!isNaN(balance) && balance >= 0) {
                                console.log('🪙 Loaded balance from direct backup:', balance);
                                this.updateState({
                                    balanceHistory: [],
                                    user: {
                                        ...this.state.user,
                                        credits: balance
                                    }
                                });
                                // 🔥 ДОБАВЛЕНИЕ: Прямое присвоение credits чтоб избежать racing conditions
                                this.state.user.credits = balance;
                                console.log('💰 State directly set to:', this.state.user.credits);
                            } else {
                                console.warn('⚠️ Invalid direct balance backup:', directBalance, 'parsed as:', balance);
                                this.updateState({
                                    balanceHistory: [],
                                    user: {
                                        ...this.state.user,
                                        credits: 20
                                    }
                                });
                            }
                        } else {
                            console.log('📭 No direct balance backup found - setting initial 20 credits');
                            this.updateState({
                                balanceHistory: [],
                                user: {
                                    ...this.state.user,
                                    credits: 20
                                }
                            });
                        }
                    }
                } else {
                    console.error('❌ Balance history is not an array:', history);
                    this.updateState({ balanceHistory: [] });
                    // 🔥 НОВОЕ: При невалидной истории тоже проверить бэкап
                    const directBalance = localStorage.getItem('currentBalance');
                    if (directBalance !== null) {
                        const balance = parseFloat(directBalance);
                        if (!isNaN(balance) && balance >= 0) {
                            console.log('🪙 Recovered balance from direct backup after invalid history:', balance);
                            this.updateState({
                                user: {
                                    ...this.state.user,
                                    credits: balance
                                }
                            });
                        } else {
                            this.updateState({
                                user: {
                                    ...this.state.user,
                                    credits: 20
                                }
                            });
                        }
                    }
                }
            } else {
                console.log('📭 No balance history in localStorage, checking for direct balance backup...');

                // 🔥 НОВОЕ: Проверяем прямой бэкап баланса
                const directBalance = localStorage.getItem('currentBalance');
                console.log('🔍 DEBUG: directBalance from localStorage:', directBalance, 'type:', typeof directBalance);

                if (directBalance !== null) {
                    const balance = parseFloat(directBalance);
                    console.log('🧮 DEBUG: parsed balance:', balance, 'isNaN:', isNaN(balance), 'balance >= 0:', balance >= 0);

                    if (!isNaN(balance) && balance >= 0) {
                        console.log('🪙 Loaded balance from direct backup:', balance);
                        this.updateState({
                            balanceHistory: [],
                            user: {
                                ...this.state.user,
                                credits: balance
                            }
                        });
                    } else {
                        console.warn('⚠️ Invalid direct balance backup:', directBalance, 'parsed as:', balance);
                        // Устанавливаем стартовый баланс для новых пользователей
                        console.log('🎯 Setting initial 20 credits due to invalid backup');
                        this.updateState({
                            balanceHistory: [],
                            user: {
                                ...this.state.user,
                                credits: 20
                            }
                        });
                    }
                } else {
                    console.log('📭 No direct balance backup found - setting initial 20 credits');
                    this.updateState({ balanceHistory: [] });
                    // 🔥 НОВОЕ: Устанавливаем стартовый баланс для новых пользователей
                    this.updateState({
                        user: {
                            ...this.state.user,
                            credits: 20
                        }
                    });
                }
            }

            // 🔥 ДОБАВЛЕНИЕ: Финальная проверка целостности баланса
            // Гарантируем что баланс всегда корректное число
            if (!this.state.user || typeof this.state.user.credits !== 'number' || isNaN(this.state.user.credits) || this.state.user.credits < 0) {
                console.log('⚠️ Balance corrupted or not set, resetting to 20 credits');

                // Очищаем поврежденные данные из localStorage
                try {
                    localStorage.removeItem('balanceHistory');
                    localStorage.removeItem('currentBalance');
                    console.log('🧹 Cleared corrupted balance data from localStorage');
                } catch (cleanupError) {
                    console.warn('❌ Failed to cleanup corrupted data:', cleanupError);
                }

                // Устанавливаем дефолтный баланс
                this.updateState({
                    balanceHistory: [],
                    user: {
                        ...this.state.user,
                        credits: 20
                    }
                });
                this.state.user.credits = 20;
                this.saveCurrentBalance();

                console.log('🛠️ Balance reset to default 20 credits');
            }

            console.log('✅ Balance loaded successfully');

        } catch (error) {
            console.error('❌ Failed to load balance from localStorage:', error);
            // 🔥 НОВОЕ: При ошибке пробуем загрузить прямой бэкап
            console.warn('⚠️ Trying direct balance backup as fallback...');

            const directBalance = localStorage.getItem('currentBalance');
            if (directBalance !== null) {
                const balance = parseFloat(directBalance);
                if (!isNaN(balance) && balance >= 0) {
                    console.log('🪙 Recovered balance from direct backup after error:', balance);
                    this.updateState({
                        balanceHistory: [],
                        user: {
                            ...this.state.user,
                            credits: balance
                        }
                    });
                } else {
                    console.warn('⚠️ Invalid direct balance backup, using default');
                    this.updateState({
                        balanceHistory: [],
                        user: {
                            ...this.state.user,
                            credits: 20
                        }
                    });
                }
            } else {
                console.warn('⚠️ No direct balance backup available, using default');
                this.updateState({ balanceHistory: [] });
                this.updateState({
                    user: {
                        ...this.state.user,
                        credits: 20
                    }
                });
            }
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



    // Метод translate для обратной совместимости - теперь использует DictionaryManager
    translate(key) {
        return window.dictionaryManager?.translate(key) || key;
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

// Глобальный переводчик с учетом состояния для backward compatibility
export function translate(key, stateManager) {
    const language = stateManager?.language || 'en';
    return window.dictionaryManager?.translate(key) || key;
}
