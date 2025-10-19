// core/services.js - Контейнер зависимостей и фабрика сервисов

import { AppStateManager } from '../store/app-state.js';
import { eventBus } from '../events/event-bus.js';

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

        // Сначала проверяем, есть ли сохраненные данные авторизации
        const authenticated = localStorage.getItem('telegram_auth_completed') === 'true';
        const authToken = localStorage.getItem('telegram_auth_token');
        const userData = JSON.parse(localStorage.getItem('telegram_user_data') || 'null');

        if (authenticated && authToken && userData) {
            console.log('✅ Using saved Telegram user data:', userData);

            this.appState.setUser({
                id: userData.id.toString(),
                name: userData.first_name + (userData.last_name ? ' ' + userData.last_name : ''),
                username: userData.username || null,
                language: userData.language_code || 'en',
                isPremium: userData.is_premium || false
            });

            // Автопереключение языка
            if (userData.language_code && ['en', 'ru', 'es', 'fr', 'de', 'zh', 'pt', 'ar', 'hi', 'ja', 'it', 'ko', 'vi', 'th', 'tr', 'pl'].includes(userData.language_code)) {
                this.appState.setLanguage(userData.language_code);
            }

            return true; // НЕ ПОКАЗЫВАТЬ AUTH SCREEN
        }

        // Проверяем доступность Telegram SDK
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            this.tg = window.Telegram.WebApp;
            this.tg.ready();
            this.tg.expand();

            console.log('📱 WebApp available, initDataUnsafe:', {
                hasInitData: !!this.tg.initDataUnsafe,
                hasUser: !!this.tg.initDataUnsafe?.user,
                userId: this.tg.initDataUnsafe?.user?.id,
                userFirstName: this.tg.initDataUnsafe?.user?.first_name
            });

            // Функция для загрузки пользователя из initDataUnsafe
            const loadUserFromInitData = () => {
                if (this.tg.initDataUnsafe?.user) {
                    const user = this.tg.initDataUnsafe.user;
                    this.appState.setUser({
                        id: user.id.toString(),
                        name: user.first_name + (user.last_name ? ' ' + user.last_name : ''),
                        username: user.username || null,
                        language: user.language_code || 'en',
                        isPremium: user.is_premium || false
                    });

                    // Автопереключение языка
                    if (user.language_code && ['en', 'ru', 'es', 'fr', 'de', 'zh', 'pt', 'ar', 'hi', 'ja', 'it', 'ko', 'vi', 'th', 'tr', 'pl'].includes(user.language_code)) {
                        this.appState.setLanguage(user.language_code);
                    }

                    console.log('✅ Telegram user data loaded:', this.appState.user);

                    // Сохраняем данные для будущих сессий
                    localStorage.setItem('telegram_auth_completed', 'true');
                    localStorage.setItem('telegram_auth_token', 'webapp_' + Date.now());
                    localStorage.setItem('telegram_user_data', JSON.stringify(user));
                    localStorage.setItem('telegram_auth_timestamp', Date.now().toString());

                    return true;
                }
                return false;
            };

            // Пытаемся загрузить сразу
            if (loadUserFromInitData()) {
                return true;
            }

            // Если initDataUnsafe.user пустой, проверяем URL параметры (fallback)
            const urlParams = new URLSearchParams(window.location.search);
            const urlUserId = urlParams.get('user_id');
            const urlUserData = urlParams.get('user_data');

            if (urlUserId && urlUserData) {
                try {
                    console.log('📡 User data from URL params detected');
                    const parsedUserData = JSON.parse(decodeURIComponent(urlUserData));

                    this.appState.setUser({
                        id: parsedUserData.id.toString(),
                        name: parsedUserData.first_name + (parsedUserData.last_name ? ' ' + parsedUserData.last_name : ''),
                        username: parsedUserData.username || null,
                        language: parsedUserData.language_code || 'en',
                        isPremium: parsedUserData.is_premium || false
                    });

                    console.log('✅ Telegram user data loaded from URL:', this.appState.user);

                    // Сохраняем данные
                    localStorage.setItem('telegram_auth_completed', 'true');
                    localStorage.setItem('telegram_auth_token', 'url_' + Date.now());
                    localStorage.setItem('telegram_user_data', JSON.stringify(parsedUserData));
                    localStorage.setItem('telegram_auth_timestamp', Date.now().toString());

                    // Очищаем URL параметры
                    const cleanUrl = window.location.pathname + window.location.hash;
                    window.history.replaceState({}, document.title, cleanUrl);

                    return true;
                } catch (error) {
                    console.error('❌ Error parsing URL user data:', error);
                }
            }

            // Если данных нет ни в initDataUnsafe, ни в URL - пробуем с задержкой (SDK может загружаться асинхронно)
            console.log('⏳ No user data found, trying with retry delay');

            return new Promise((resolve) => {
                let attempts = 0;
                const maxAttempts = 10;
                const retryDelay = 200; // каждые 200мс

                const checkWithDelay = () => {
                    attempts++;
                    console.log(`🔄 Retry attempt ${attempts}/${maxAttempts}`);

                    if (loadUserFromInitData()) {
                        resolve(true);
                        return;
                    }

                    if (attempts >= maxAttempts) {
                        console.warn('❌ No user data after max retries');
                        resolve(false); // ПОКАЗАТЬ AUTH SCREEN
                    } else {
                        setTimeout(checkWithDelay, retryDelay);
                    }
                };

                setTimeout(checkWithDelay, retryDelay);
            });
        } else {
            console.warn('❌ Telegram WebApp not available');
            return false; // ПОКАЗАТЬ AUTH SCREEN
        }
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

    // Загрузка настроек
    loadSettings() {
        try {
            const data = JSON.parse(localStorage.getItem('appSettings') || '{}');
            this.appState.deserialize(data);
            console.log('📚 Settings loaded from localStorage');
        } catch (error) {
            console.error('❌ Failed to load settings:', error);
        }
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

// Фабрика сервисов
export function createAppServices() {
    // Создаем менеджер состояния
    const appState = new AppStateManager();

    // Создаем сервис событий
    const evBus = eventBus;

    // Создаем сервисы с зависимостями
    const services = {
        appState,
        eventBus: evBus,
        telegram: new TelegramService(appState, evBus),
        storage: new StorageService(appState),
        notifications: new NotificationService(evBus)
    };

    // Загружаем сохраненные настройки при старте
    services.storage.loadSettings();
    services.storage.loadHistory();

    console.log('✅ App services initialized');
    return services;
}

// Экспорт глобальных экземпляров для совместимости
export let globalServices = null;

export function initializeGlobalServices() {
    if (!globalServices) {
        globalServices = createAppServices();

        // Делаем доступным глобально для legacy поддержки
        if (typeof window !== 'undefined') {
            window.appServices = globalServices;
        }
    }
    return globalServices;
}

// Автоматическая инициализация при импорте
if (typeof window !== 'undefined') {
    // Инициализируем сервисы при первой загрузке страницы
    document.addEventListener('DOMContentLoaded', () => {
        initializeGlobalServices();
    });
}
