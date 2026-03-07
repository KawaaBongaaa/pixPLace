import { AppStateManager } from '../store/app-state.js';
import { eventBus } from '../events/event-bus.js';
import { HistoryService } from './history-service.js';

// Сервис Telegram
class TelegramService {
    constructor(appStateManager, eventBus) {
        this.appState = appStateManager;
        this.eventBus = eventBus;
        this.tg = null;

        // Подписываемся на события о завершении генерации
        this.eventBus.on('generation:completed', this._handleGenerationCompleted.bind(this));
    }

    // Инициализация Telegram WebApp
    async initialize() {
        console.log('📱 Initializing Telegram WebApp service');

        // --- 1. HANDLE INCOMING DATA (From URL) ---
        const urlParams = new URLSearchParams(window.location.search);
        const urlUserId = urlParams.get('user_id');
        const urlUserData = urlParams.get('user_data');
        const urlPrompt = urlParams.get('prompt');

        // If we have a prompt in the URL, store it immediately
        if (urlPrompt) {
            console.log('📝 Prompt received in URL:', urlPrompt);
            localStorage.setItem('pending_prompt', urlPrompt);
        }

        // --- 2. БЫСТРАЯ ПРОВЕРКА ОКРУЖЕНИЯ ---
        // Проверяем, запущен ли сайт внутри Telegram: WebApp всегда передает свои параметры в HASH.
        const hash = window.location.hash || '';
        const isTelegramContext = hash.includes('tgWebAppData') || window.location.search.includes('tgWebApp');

        // Priority 2: URL Parameters (Handshake from Landing)
        if (urlUserId && urlUserData) {
            try {
                const parsedUser = JSON.parse(decodeURIComponent(urlUserData));
                console.log('👤 User data handshaked from URL:', parsedUser);

                this.appState.setUser({
                    id: parsedUser.id.toString(),
                    name: parsedUser.first_name + (parsedUser.last_name ? ' ' + parsedUser.last_name : ''),
                    username: parsedUser.username || null,
                    photo_url: parsedUser.photo_url || null,
                    language: parsedUser.language_code || 'en',
                    isPremium: parsedUser.is_premium || false
                });

                localStorage.setItem('tg_user_data', JSON.stringify(parsedUser));

                // Clean URL after handshake
                const cleanUrl = window.location.pathname + window.location.hash;
                window.history.replaceState({}, document.title, cleanUrl);

                return true;
            } catch (e) {
                console.error('❌ Failed to parse user_data from URL:', e);
            }
        }

        // Если не в Telegram и нет хендшейка - сразу загружаем приложение без задержек!
        if (!isTelegramContext) {
            console.log('🌐 Regular browser context detected - bypassing Telegram SDK init.');

            // Final Fallback: Clean URL but we resolve false since WebApp is bypassed
            const cleanUrl = window.location.pathname + window.location.hash;
            window.history.replaceState({}, document.title, cleanUrl);
            return false;
        }

        // Ждем доступности Telegram SDK, так как мы внутри Telegram
        console.log('⏳ Telegram context detected. Waiting for Telegram SDK to load...');

        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 30; // 30 * 100ms = 3 секунды максимум для бота
            const retryDelay = 100;

            const checkWebApp = async () => {
                attempts++;
                if (attempts === 1 || attempts >= maxAttempts || attempts % 10 === 0) {
                    console.log(`🔍 WebApp check attempt ${attempts}/${maxAttempts}`);
                }

                if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
                    console.log('📱 WebApp detected, initializing...');

                    this.tg = window.Telegram.WebApp;
                    this.tg.ready();
                    this.appState.setTg(this.tg);

                    // Priority 1: Telegram WebApp User
                    if (this.tg.initDataUnsafe && this.tg.initDataUnsafe.user) {
                        const user = this.tg.initDataUnsafe.user;
                        console.log('👤 Loading user from initDataUnsafe:', user);

                        try {
                            // 🔥 НОВОЕ: Авторизация через Backend сразу при загрузке WebApp
                            console.log('🔐 Authenticating WebApp user via backend webhook...');

                            // Извлекаем hash из initData, так как он нужен бекенду для проверки подписи
                            const initDataParams = new URLSearchParams(this.tg.initData || '');
                            const authHash = initDataParams.get('hash');

                            const response = await fetch('https://alv-n8n.pixplace.space/webhook/telegram-auth', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    ...user,
                                    initData: this.tg.initData,
                                    hash: authHash,
                                    traffic_source: 'webapp/telegram_webapp_auto'
                                })
                            });

                            const data = await response.json();

                            if (data.userId) {
                                console.log('✅ Backend auth successful, DB internal ID:', data.userId);

                                // Устанавливаем в AppState ПОЛНОСТЬЮ данные из DB
                                this.appState.setUser({
                                    id: String(data.userId), // Используем ВНУТРЕННИЙ ID
                                    name: data.userName || user.first_name + (user.last_name ? ' ' + user.last_name : ''),
                                    username: user.username || null,
                                    photo_url: data.userPhotoUrl || user.photo_url || null,
                                    language: user.language_code || 'en',
                                    isPremium: user.is_premium || false
                                });

                                // Сохраняем сессию так же, как в обычной авторизации (fixes F5 localstorage bug)
                                const userDataToSave = {
                                    ...user,
                                    internalUserId: data.userId,
                                    first_name: data.userName || user.first_name,
                                    photo_url: data.userPhotoUrl || user.photo_url || null
                                };

                                localStorage.setItem('telegram_auth_completed', 'true');
                                localStorage.setItem('telegram_user', JSON.stringify(userDataToSave));
                                localStorage.setItem('telegram_user_data', JSON.stringify(userDataToSave));
                                localStorage.setItem('telegram_auth_timestamp', Date.now().toString());

                                document.documentElement.classList.add('auth-session-active');

                                // Сообщаем об успехе авторизации приложению если оно уже готово
                                if (typeof window.updateUserMenuInfo === 'function') {
                                    window.updateUserMenuInfo();
                                }
                            } else {
                                console.warn('⚠️ Backend did not return a valid userId form WebApp init');
                                // Fallback к старому поведению (Только Telegram ID)
                                this.appState.setUser({
                                    id: user.id.toString(),
                                    name: user.first_name + (user.last_name ? ' ' + user.last_name : ''),
                                    username: user.username || null,
                                    photo_url: user.photo_url || null,
                                    language: user.language_code || 'en',
                                    isPremium: user.is_premium || false
                                });
                                localStorage.setItem('tg_user_data', JSON.stringify(user));
                            }
                        } catch (err) {
                            console.error('❌ Failed to authenticate WebApp user via backend:', err);
                            // Fallback к старому поведению (Только Telegram ID)
                            this.appState.setUser({
                                id: user.id.toString(),
                                name: user.first_name + (user.last_name ? ' ' + user.last_name : ''),
                                username: user.username || null,
                                photo_url: user.photo_url || null,
                                language: user.language_code || 'en',
                                isPremium: user.is_premium || false
                            });
                            localStorage.setItem('tg_user_data', JSON.stringify(user));
                        }

                        // Clean URL just in case
                        const cleanUrl = window.location.pathname + window.location.hash;
                        window.history.replaceState({}, document.title, cleanUrl);
                        resolve(true);
                        return;
                    }

                    // Telegram WebApp exists but no user info
                    const cleanUrl = window.location.pathname + window.location.hash;
                    window.history.replaceState({}, document.title, cleanUrl);
                    resolve(true);
                    return;

                } else if (attempts >= maxAttempts) {
                    console.warn('❌ Telegram WebApp not available after max attempts in bot context');
                    const cleanUrl = window.location.pathname + window.location.hash;
                    window.history.replaceState({}, document.title, cleanUrl);
                    resolve(false);
                } else {
                    setTimeout(checkWebApp, retryDelay);
                }
            };

            // Start check loop
            checkWebApp();
        });
    }

    // Обработчик завершения генерации
    _handleGenerationCompleted(data) {
        console.log('🎯 TelegramService: Generation completed, checking share options');

        // В Telegram можно предложить поделиться результатом
        if (this.tg && data?.image_url) {
            // Отправляем событие о готовности к шарингу
            this.eventBus.emit('telegram:share_ready', {
                imageUrl: data.image_url,
                prompt: data.prompt,
                canShare: this.tg?.platform === 'android' || this.tg?.platform === 'ios'
            });
        }
    }

    // Получение текущего пользователя
    getCurrentUser() {
        return this.appState.user;
    }

    // Проверка премиум статуса
    isPremium() {
        return this.appState.user.isPremium || false;
    }
}

// Сервис локального хранилища
class StorageService {
    constructor(appStateManager) {
        this.appState = appStateManager;
    }

    // Сохранение настроек
    saveSettings() {
        try {
            const data = this.appState.serialize();
            localStorage.setItem('appSettings', JSON.stringify(data));
            console.log('💾 Settings saved to localStorage');
        } catch (error) {
            console.error('❌ Failed to save settings:', error);
        }
    }

    // Загрузка настроек - УПРОЩЕННАЯ! Теперь только получает готовые данные от AppState
    loadSettings() {
        console.log('📋 Services loadSettings: using AppState data (theme already loaded):', this.appState.theme);
        // 🔥 РЕМОВЕР: НЕ ЗАГРУЖАЕМ ТЕМУ СНОВА - AppState уже загрузил её
        // Тема и язык теперь управляются централизованно через AppState
    }

    // Сохранение истории генераций
    saveHistory() {
        try {
            localStorage.setItem('generationHistory', JSON.stringify(this.appState.generationHistory));
            console.log('💾 History saved');
        } catch (error) {
            console.error('❌ Failed to save history:', error);
            // Попытка сохранить в sessionStorage как fallback
            try {
                sessionStorage.setItem('generationHistory', JSON.stringify(this.appState.generationHistory));
            } catch (fallbackError) {
                console.error('Fallback storage also failed:', fallbackError);
            }
        }
    }

    // Загрузка истории генераций
    loadHistory() {
        try {
            const history = JSON.parse(localStorage.getItem('generationHistory') || '[]');
            this.appState.setGenerationHistory(history);
            console.log('📚 History loaded:', history.length, 'items');
        } catch (error) {
            console.error('❌ Failed to load history:', error);
            this.appState.setGenerationHistory([]);
        }
    }
}

// Сервис уведомлений
class NotificationService {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('notification:show', this.showNotification.bind(this));
    }

    // Показать уведомление
    showNotification(type, message, duration = 3000) {
        // Создаем элемент уведомления
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-message">${message}</span>
            <button class="toast-close">×</button>
        `;

        // Обработчики
        toast.querySelector('.toast-close').onclick = () => this.removeToast(toast);
        toast.onclick = () => this.removeToast(toast);

        // Добавляем на страницу
        document.body.appendChild(toast);

        // Автоматическое скрытие
        if (duration > 0) {
            setTimeout(() => this.removeToast(toast), duration);
        }

        console.log(`🔔 Notification shown: ${type} - ${message}`);
    }

    // Удалить уведомление
    removeToast(toast) {
        if (toast.parentNode) {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }
}

// Сервис UI эффектов
class UIService {
    constructor() {
        // Сервис для управления UI эффектами и анимациями
    }

    // 🎨 ЭФФЕКТЫ СТЕКЛА
    initGlassmorphismEffects() {
        const cards = document.querySelectorAll('.plan-card');

        cards.forEach((card, index) => {
            // Добавляем анимацию через CSS классы без постоянных inline стилей
            card.classList.add('glassmorphism-animate-in');
            card.style.animationDelay = `${index * 0.2}s`;

            // Через задержку убираем анимационные стили для чистоты
            setTimeout(() => {
                card.classList.remove('glassmorphism-animate-in');
                // Очищаем inline стили анимации
                card.style.animationDelay = '';
            }, 1000 + index * 200); // После завершения анимации + задержка
        });

        console.log('✨ Glassmorphism effects initialized with cleanup');
    }
}

// ─── User Profile Service ───────────────────────────────────────────────────
// Fetches fresh user profile data (credits, subscription) from the backend
// and syncs it into appState so the Access Guard always has real data.
class UserProfileService {
    constructor(appStateManager) {
        this.appState = appStateManager;
        this._isFetching = false;
    }

    /**
     * Fetch user profile from backend and sync into appState.
     * @param {string} userId - Internal user ID from database
     * @returns {Promise<object|null>} Profile data or null on failure
     */
    async fetchProfile(userId) {
        if (!userId) {
            console.warn('⚠️ UserProfileService: no userId, skipping fetch');
            return null;
        }
        if (this._isFetching) {
            console.log('⏳ UserProfileService: fetch already in progress, skipping');
            return null;
        }

        this._isFetching = true;
        const webhookUrl = 'PLACEHOLDER_GET_USER_PROFILE_WEBHOOK_URL'; // replaced by CI/CD

        try {
            console.log('📡 UserProfileService: fetching profile for user:', userId);
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId })
            });

            if (!response.ok) {
                console.warn(`⚠️ UserProfileService: HTTP ${response.status}`);
                return null;
            }

            // Guard against empty / non-JSON bodies
            const text = await response.text();
            if (!text || text.trim() === '') {
                console.warn('⚠️ UserProfileService: empty response body');
                return null;
            }

            const data = JSON.parse(text);
            console.log('✅ UserProfileService: profile received:', data);

            // Merge fresh data into appState user object
            const updates = {};
            if (data.credits !== undefined && data.credits !== null) updates.credits = Number(data.credits);
            if (data.subscription !== undefined) updates.subscription = data.subscription;
            if (data.name || data.userName) updates.name = data.name || data.userName;
            if (data.photo_url || data.userPhotoUrl) updates.photo_url = data.photo_url || data.userPhotoUrl;

            if (Object.keys(updates).length > 0) {
                this.appState.setUser(updates);

                // Also persist balance to localStorage backup
                if (updates.credits !== undefined) {
                    localStorage.setItem('currentBalance', updates.credits);
                    if (window.updateUserBalance) window.updateUserBalance(updates.credits);
                }

                console.log('💾 UserProfileService: appState.user updated:', updates);
            }

            return data;
        } catch (err) {
            console.warn('⚠️ UserProfileService: fetch failed:', err.message);
            return null;
        } finally {
            this._isFetching = false;
        }
    }

    /**
     * Called once on app init if user session is already restored.
     */
    async syncOnInit() {
        const userId = this.appState.user?.id || window.appState?.userId;
        if (userId && isNaN(Number(userId))) {  // only real internal IDs (not Telegram numeric IDs)
            await this.fetchProfile(userId);
        }
    }
}

// Фабрика сервисов - получает существующий AppStateManager
export function createAppServices(existingAppState) {
    // 🔥 ИСПРАВЛЕНИЕ: Всегда используем существующий appState, если передан
    // Не создаем новый, если передан existingAppState
    const appState = existingAppState;

    // Создаем сервис событий
    const evBus = eventBus;

    // Создаем сервисы с зависимостями
    const services = {
        appState,
        eventBus: evBus,
        telegram: new TelegramService(appState, evBus),
        storage: new StorageService(appState),
        notifications: new NotificationService(evBus),
        ui: new UIService(),
        history: new HistoryService(),
        userProfile: new UserProfileService(appState)
    };

    // Загружаем сохраненные настройки при старте
    services.storage.loadSettings();
    services.storage.loadHistory();

    // 🔥 Sync fresh user profile (credits, subscription) from backend after a short delay
    // so that DOM and auth session are guaranteed to be ready first.
    setTimeout(() => {
        services.userProfile.syncOnInit();
    }, 1500);

    console.log('✅ App services initialized');
    return services;
}

// Экспорт глобальных экземпляров для совместимости
export let globalServices = null;

export function initializeGlobalServices(existingAppState) {
    if (!globalServices) {
        globalServices = createAppServices(existingAppState);

        // Делаем доступным глобально для legacy поддержки
        if (typeof window !== 'undefined') {
            window.appServices = globalServices;

            // Экспортируем UI функции для глобального доступа (совместимость с plans-modal.js)
            if (globalServices.ui) {
                window.initGlassmorphismEffects = globalServices.ui.initGlassmorphismEffects.bind(globalServices.ui);
            }
        }
    }
    return globalServices;
}
