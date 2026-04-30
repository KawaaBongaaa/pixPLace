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
                credits: localStorage.getItem('currentBalance') ? parseFloat(localStorage.getItem('currentBalance')) : null,
                username: null,
                photo_url: null,
                language: 'en',
                isPremium: false,
                subscription: null,    // e.g. '', 'touch', 'pro', 'studio'
                funnel_stage: null,    // stored, no action yet
                last_login: null       // stored, no action yet
            },

            // Telegram объект (для обратной совместимости)
            tg: null,

            // История генераций
            generationHistory: [],
            externalHistory: [], // Для данных из внешнего HistoryService
            currentGeneration: null,

            // Баланс и история баланса
            balanceHistory: [],

            // Изображения пользователя
            userImageState: {
                images: [] // массив объектов {id, file, dataUrl, uploadedUUID}
            },

            // Стиль (для генерации изображений)
            selectedStyle: '',

            // 🔥 MODE-SPECIFIC STATE: Each mode stores only what it actually uses.
            // DeepLink overrides: prompt, model, image_url — all other fields stay at defaults.
            activeMode: 'image',
            modesState: {
                image: { model: 'z_image', modelName: 'Z-Image Turbo', prompt: '', size: '1024x1024' },
                edit: { model: 'qwen_image_edit', modelName: 'Qwen Image Edit', prompt: '', size: 'square' },
                video: { model: 'image_to_video', modelName: 'Luma AI', prompt: '' },
                sound: { model: 'suno', modelName: 'Suno AI', prompt: '', subMode: 'audio_from_text' }
            },

            // Таймеры
            startTime: null,
            timerInterval: null,

            // Снегопад
            snowfallEnabled: false,

            // UI состояние
            isGenerating: false
        };

        // Load persisted modes state from localStorage
        this._loadModesState();
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

    // Explicit User getters and setters for backward compatibility
    get userId() { return this.state.user.id; }
    set userId(value) {
        this.updateState({ user: { ...this.state.user, id: value } });
    }
    get userName() { return this.state.user.name; }
    set userName(value) {
        this.updateState({ user: { ...this.state.user, name: value } });
    }

    // 🔥 ADDED: Backward compatibility for credits
    get userCredits() {
        return this.state.user.credits;
    }
    set userCredits(value) {
        if (value !== undefined && value !== null) {
            const numValue = Number(value);
            this.updateState({
                user: { ...this.state.user, credits: numValue }
            });
            this.saveCurrentBalance();
        }
    }
    get userAvatar() { return this.state.user.photo_url; }
    set userAvatar(value) {
        this.updateState({ user: { ...this.state.user, photo_url: value } });
    }

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
        const oldTheme = this.state.theme;
        this.updateState({ theme });

        // 🔥 ИСПРАВЛЕНИЕ ДЛЯ TAILWIND CSS v4: Используем data-theme на html элементе
        const html = document.documentElement;

        if (theme === 'dark') {
            // Устанавливаем data-theme атрибут на html элемент для Tailwind CSS
            html.setAttribute('data-theme', 'dark');
            html.classList.add('dark'); // 🔥 Ensure .dark class is present for Tailwind class strategy
            html.classList.remove('light');

            // 🔥 UPDATE INLINE STYLES DYNAMICALLY (Fix for "partial switch")
            html.style.backgroundColor = '#09090b';
            html.style.color = '#fafafa';
        } else if (theme === 'light') {
            html.setAttribute('data-theme', 'light');
            html.classList.add('light'); // 🔥 Ensure .light class is present
            html.classList.remove('dark');

            // 🔥 UPDATE INLINE STYLES DYNAMICALLY
            html.style.backgroundColor = '#ffffff';
            html.style.color = '#1e293b';
        } else if (theme === 'auto') {
            // Для auto режима определяем системную тему
            const systemTheme = this.detectSystemTheme();
            html.setAttribute('data-theme', systemTheme);
            html.classList.remove('light', 'dark');
            html.classList.add(systemTheme);

            // Update inline styles based on system theme
            if (systemTheme === 'dark') {
                html.style.backgroundColor = '#09090b';
                html.style.color = '#fafafa';
            } else {
                html.style.backgroundColor = '#ffffff';
                html.style.color = '#1e293b';
            }
        }

        // 🔥 ДОБАВЛЕНИЕ: Сохраняем тему сразу при изменении!
        this.saveSettings();

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
                // 🔥 ИСПРАВЛЕНИЕ: Устанавливаем data-theme на html элемент вместо body
                document.documentElement.setAttribute('data-theme', newSystemTheme);
            };

            // Добавляем слушатель
            mediaQuery.addEventListener('change', this.themeChangeHandler);
            this.themeChangeListener = mediaQuery;
        }
    }

    // Методы для работы с пользователем
    setUser(userData) {
        console.log('👤 AppState: setting user:', userData);
        const newState = {
            user: { ...this.state.user, ...userData }
        };
        this.updateState(newState);

        // 🔥 CRITICAL: If credentials/credits were in userData, save them to localStorage immediately
        if (userData.credits !== undefined && userData.credits !== null) {
            this.saveCurrentBalance();
        }
    }

    // Методы для работы с историей генераций
    setGenerationHistory(history) {
        // 🔥 ИСПРАВЛЕНИЕ ПОРЯДКА: СОРТИРУЕМ МАССИВ ПО ID В ОБРАТНОМ ПОРЯДКЕ ДЛЯ ЗАГРУЗКИ Из localStorage
        // Новые генерации должны быть ПЕРВЫМИ (новые ID - большие числа)
        // 🔥 Учтен fallback на generation_id, чтобы не возникало NaN
        const sortedHistory = Array.isArray(history) ? history.sort((a, b) => (b.id || b.generation_id || 0) - (a.id || a.generation_id || 0)) : history;
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

    // Методы для работы с внешней историей из HistoryService
    setHistoryFromExternal(data) {
        // Преобразование данных из webhook в формат приложения
        // Данные могут приходить в формате {generations: [...]} или напрямую как массив
        const rawArray = Array.isArray(data) ? data : (data?.generations || []);

        const formattedHistory = rawArray.map(item => {
            // Извлекаем данные из поля json, если оно есть, иначе используем item напрямую
            const genData = item.json || item;
            return {
                id: genData.generation_id,
                taskUUID: genData.task_uuid,
                prompt: genData.prompt,
                mode: genData.mode,
                style: genData.style,
                result: genData.image_url,
                status: genData.status,
                timestamp: genData.timestamp,
                generation_cost: genData.generation_cost,
                cost_currency: genData.cost_currency
            };
        });

        // Устанавливаем во временное хранилище для отображения
        this.updateState({ externalHistory: formattedHistory });
    }

    getExternalHistory() {
        return this.state.externalHistory || [];
    }

    // Метод сохранения истории
    saveHistory() {
        // Оставляем пустым - история теперь хранится только на сервере
        console.log('ℹ️ saveHistory is deprecated - history is now managed by server');
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
            const settings = storedSettings ? JSON.parse(storedSettings) : {};

            // 1. Сначала восстанавливаем язык и флаг В СОСТОЯНИЕ (без сохранения)
            if (settings.language) {
                this.updateState({ language: settings.language });
            }
            const isLanguageSetByUser = settings.isLanguageSetByUser !== undefined ? settings.isLanguageSetByUser : false;
            this.updateState({ isLanguageSetByUser });

            // 2. Теперь загружаем тему (внутри setTheme вызовется saveSettings(), 
            // который сохранит УЖЕ ПРАВИЛЬНЫЕ language и isLanguageSetByUser)
            const theme = settings.theme || 'dark';
            this.setTheme(theme);

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
        } catch (error) {
            console.error('Failed to save current balance:', error);
        }
    }

    // 🔥 ДОБАВЛЕНИЕ: Метод инициализации дефолтных значений при первом запуске
    initializeDefaults() {
        // Инициализируем настройки если они отсутствуют
        const existingSettings = localStorage.getItem('appSettings');
        if (!existingSettings) {
            this.saveSettings(); // Сохраняем дефолтные настройки
        }

        // Инициализируем пустую историю баланса если она отсутствует
        const existingBalance = localStorage.getItem('balanceHistory');
        if (!existingBalance) {
            this.saveBalanceHistory(); // Сохраняем пустую историю
        }

        // 🔥 НОВОЕ: Инициализируем бэкап баланса если он отсутствует или поврежден
        const existingBalanceBackup = localStorage.getItem('currentBalance');
        const balanceValue = existingBalanceBackup ? parseFloat(existingBalanceBackup) : NaN;

        // 🔥 ИСПРАВЛЕНИЕ: Приоритет currentBalance над любыми другими инициализациями
        if (existingBalanceBackup && !isNaN(balanceValue) && balanceValue >= 0) {
            this.updateState({
                user: {
                    ...this.state.user,
                    credits: balanceValue
                }
            });
            this.state.user.credits = balanceValue; // 🔥 ДОБАВЛЕНИЕ: Прямое присвоение
            this.saveCurrentBalance(); // Подтверждаем сохранение валидного баланса
        } else {
            // Очищаем поврежденные данные
            if (existingBalanceBackup !== null) {
                localStorage.removeItem('currentBalance');
            }

            this.updateState({
                user: {
                    ...this.state.user,
                    credits: 20
                }
            });
            this.state.user.credits = 20; // 🔥 ДОБАВЛЕНИЕ: Прямое присвоение
            this.saveCurrentBalance(); // Сохраняем начальный баланс
        }
    }

    loadBalanceHistory() {
        try {
            // 🔥 ИСПРАВЛЕНИЕ: ПРИОРИТЕТ ПРЯМОГО БЭКАПА BALANCE НАД HISTORIAЙ
            // Сначала проверяем currentBalance, так как ЭТО основной источник баланса
            const directBalance = localStorage.getItem('currentBalance');

            if (directBalance !== null) {
                const balanceValue = parseFloat(directBalance);

                if (!isNaN(balanceValue) && balanceValue >= 0) {
                    this.updateState({
                        user: {
                            ...this.state.user,
                            credits: balanceValue
                        }
                    });
                    this.state.user.credits = balanceValue;
                    this.saveCurrentBalance(); // Подтверждаем валидность
                } else {
                    console.warn('⚠️ Invalid currentBalance, clearing and using defaults');
                    localStorage.removeItem('currentBalance');
                    // Устанавливаем дефолтный баланс
                    this.updateState({
                        user: {
                            ...this.state.user,
                            credits: 20
                        }
                    });
                    this.state.user.credits = 20;
                }
            }

            // 🔥 ДОБАВЛЕНИЕ: Загружаем историю, если она есть, НО НЕ ПЕРЕЗАПИСЫВАЕМ баланс!
            const storedHistory = localStorage.getItem('balanceHistory');

            if (storedHistory) {
                const history = JSON.parse(storedHistory);

                if (Array.isArray(history)) {
                    this.updateState({ balanceHistory: history });
                } else {
                    console.warn('⚠️ Balance history is not an array, initializing empty');
                    this.updateState({ balanceHistory: [] });
                }
            } else {
                this.updateState({ balanceHistory: [] });
            }

            // Если баланс все еще не установлен, устанавливаем дефолтный
            if (this.state.user.credits === null || this.state.user.credits === undefined) {
                this.updateState({
                    user: {
                        ...this.state.user,
                        credits: 20
                    }
                });
                this.state.user.credits = 20;
            }

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
        const themes = ['dark', 'light']; // 🔥 ONLY DARK AND LIGHT, DEFAULT DARK
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

    // ========== MODE-SPECIFIC STATE MANAGEMENT ==========

    /** Get state for a specific mode */
    getModeState(mode) {
        return this.state.modesState[mode] || null;
    }

    /** Update state for a specific mode (partial update, merges) */
    setModeState(mode, updates) {
        if (!this.state.modesState[mode]) return;

        // Update the state object immutably so listeners can detect changes
        const newModesState = { ...this.state.modesState };
        newModesState[mode] = { ...newModesState[mode], ...updates };

        // Use updateState to ensure listeners are notified
        this.updateState({ modesState: newModesState });

        this._saveModesState();
    }

    /** Save current modesState to localStorage (lightweight) */
    _saveModesState() {
        try {
            const dataToSave = {
                activeMode: this.state.activeMode,
                modesState: this.state.modesState
            };
            localStorage.setItem('pixplace_modesState', JSON.stringify(dataToSave));

            // 🔥 ALSO: Save image state metadata (safely)
            this._saveImageState();
        } catch (e) {
            console.warn('⚠️ Failed to save modesState:', e);
        }
    }

    _saveImageState() {
        try {
            // Save only metadata and small previews to avoid localStorage limits
            const imagesToSave = this.state.userImageState.images.map(img => {
                // If dataUrl is too big (e.g. > 1MB), don't persist the raw data, just the UUID
                const persistData = (img.dataUrl && img.dataUrl.length < 500000) ? img.dataUrl : null;
                return {
                    id: img.id,
                    uploadedUUID: img.uploadedUUID,
                    dataUrl: persistData,
                    name: img.file ? img.file.name : 'image'
                };
            });
            localStorage.setItem('pixplace_imageState', JSON.stringify(imagesToSave));
        } catch (e) {
            console.warn('⚠️ Failed to save imageState:', e);
        }
    }

    /** Load persisted modesState from localStorage */
    _loadModesState() {
        // 🕒 TTL: 24 hours since LAST VISIT.
        // Compares current time with the timestamp of the user's previous page open.
        // Resets mode settings (prompt/model) but NOT auth/balance.
        const VISIT_TTL = 24 * 60 * 60 * 1000;
        const now = Date.now();

        try {
            // 1️⃣ Check when user last visited
            const lastVisitRaw = localStorage.getItem('pixplace_last_visit');
            const lastVisit = lastVisitRaw ? parseInt(lastVisitRaw, 10) : 0;
            const isNewDay = lastVisit > 0 && (now - lastVisit) > VISIT_TTL;

            // 2️⃣ Update last-visit timestamp immediately (this visit = now)
            localStorage.setItem('pixplace_last_visit', String(now));

            // 3️⃣ If >24h since last visit — wipe stale mode settings
            if (isNewDay) {
                console.log('🕒 [AppState] >24h since last visit — resetting mode settings to defaults.');
                localStorage.removeItem('pixplace_modesState');
                localStorage.removeItem('pixplace_imageState');
                // Auth/balance keys are NOT touched here
                return; // Use constructor defaults
            }

            // 4️⃣ Recent visit — restore saved state
            const raw = localStorage.getItem('pixplace_modesState');
            if (raw) {
                const saved = JSON.parse(raw);
                if (saved.activeMode) this.state.activeMode = saved.activeMode;

                const savedModes = saved.modesState || saved;
                for (const mode of Object.keys(this.state.modesState)) {
                    if (savedModes[mode]) {
                        // Merge on top of defaults (new fields automatically get defaults)
                        this.state.modesState[mode] = { ...this.state.modesState[mode], ...savedModes[mode] };
                    }
                }
            }

            // Load Images (no separate TTL — cleared together with modesState above)
            const rawImages = localStorage.getItem('pixplace_imageState');
            if (rawImages) {
                const savedImages = JSON.parse(rawImages);
                this.state.userImageState.images = savedImages;
            }
        } catch (e) {
            console.warn('⚠️ Failed to load state:', e);
        }
    }

    /** Get the currently active mode name */
    get activeMode() { return this.state.activeMode; }
    set activeMode(mode) {
        if (this.state.activeMode !== mode) {
            this.state.activeMode = mode;
            this._saveModesState();
        }
    }

    // Сериализация состояния для localStorage
    serialize() {
        return {
            language: this.state.language,
            theme: this.state.theme,
            user: this.state.user,
            telegram: this.state.telegram,
            balanceHistory: this.state.balanceHistory
        };
    }

    // Десериализация состояния из localStorage
    deserialize(data) {
        if (data.language) this.state.language = data.language;
        if (data.theme) this.state.theme = data.theme;
        if (data.user) this.state.user = { ...this.state.user, ...data.user };
        if (data.telegram) this.state.telegram = { ...this.state.telegram, ...data.telegram };
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
