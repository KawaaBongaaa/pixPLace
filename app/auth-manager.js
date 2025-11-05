/**
 * 🔐 Auth Manager - Менеджер авторизации для Telegram WebApp
 * Реализует аутентификацию через Telegram WebApp initData
 */

export class AuthManager {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.webappInitialized = false;

        // DOM элементы
        this.authModal = null;
        this.authOverlay = null;

        console.log('🔐 Auth Manager (WebApp mode) created');
    }

    /**
     * Инициализация авторизации
     */
    async initialize() {
        console.log('🔐 Initializing WebApp authentication...');

        // Инициализация Telegram WebApp
        this.initializeTelegramWebApp();

        // Robust WebApp инициализация - ждем данные с таймаутом
        const webAppAuthSuccess = await this.waitForWebAppData();

        // Если WebApp авторизация не удалась - проверим localStorage
        if (!webAppAuthSuccess) {
            console.log('🔄 WebApp auth failed, checking stored auth...');
            await this.checkStoredAuth();
        }

        console.log('✅ Auth Manager initialized');
    }

    /**
     * Финальная инициализация (после готовности DOM)
     */
    async finalizeInitialization() {
        console.log('🔐 Finalizing auth initialization...');

        // Создание модала авторизации после готовности DOM
        this.createAuthModal();

        console.log('✅ Auth finalization complete');
    }

    /**
     * Проверка начальной авторизации
     */
    async checkInitialAuth() {
        try {
            // Сначала проверим WebApp данные
            if (this.checkWebAppAuth()) {
                console.log('✅ WebApp auth found, skipping stored check');
                return;
            }

            // Fallback на localStorage
            const authCompleted = localStorage.getItem('telegram_auth_completed');
            const userData = localStorage.getItem('telegram_user');

            if (authCompleted === 'true' && userData) {
                const user = JSON.parse(userData);
                console.log('✅ Stored auth found for:', user.first_name);
                this.setAuthenticatedUser(user);
                return;
            }
        } catch (error) {
            console.error('❌ Stored auth check failed:', error);
        }
    }

    /**
     * Инициализация Telegram WebApp
     */
    initializeTelegramWebApp() {
        console.log('📱 Initializing Telegram WebApp...');

        // Расширение окна для лучшего UX
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            try {
                Telegram.WebApp.expand();
                console.log('✅ WebApp expanded');
            } catch (error) {
                console.warn('⚠️ Failed to expand WebApp:', error);
            }
        } else {
            console.warn('⚠️ Telegram WebApp not available - assuming standalone mode');
        }

        this.webappInitialized = true;
        console.log('✅ Telegram WebApp initialized');
    }

    /**
     * Проверка WebApp аутентификации
     */
    checkWebAppAuth() {
        if (typeof Telegram === 'undefined' || !Telegram.WebApp) {
            console.log('📱 No Telegram WebApp available');
            return false;
        }

        const tg = Telegram.WebApp;
        const user = tg.initDataUnsafe?.user;

        if (!user) {
            console.log('📱 No user in WebApp initData');
            return false;
        }

        // Асинхронная аутентификация через API
        this.authenticateViaAPI(user, tg.initData);
        return true;
    }

    /**
     * Аутентификация через API
     */
    async authenticateViaAPI(user, initData) {
        console.log('🔑 Starting API authentication for user:', user.first_name);

        try {
            const response = await fetch("https://pixplace.vercel.app/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user.id,
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    initData: initData,
                    traffic_source: "webapp/start ads-teleram-eng-01",
                }),
            });

            const data = await response.json();
            console.log('📥 API auth response:', data);

            if (data.ok) {
                // Сохранение данных
                this.saveAuthData({
                    ...user,
                    auth_type: 'webapp_api'
                });

                // Установка авторизованного пользователя
                this.setAuthenticatedUser(user);

                console.log('✅ WebApp API authentication successful');
            } else {
                throw new Error(data.error || 'API auth failed');
            }

        } catch (error) {
            console.error('❌ WebApp API auth failed:', error);
            // Fallback: попробовать localStorage или показать ошибку
        }
    }

    /**
     * Ручная аутентификация через WebApp
     */
    async manualWebAppAuth() {
        if (typeof Telegram === 'undefined' || !Telegram.WebApp) {
            console.warn('⚠️ Manual WebApp auth not available');
            return false;
        }

        const tg = Telegram.WebApp;
        tg.expand(); // Убедиться что окно развернуто

        const user = tg.initDataUnsafe?.user;
        const initData = tg.initData;

        if (!user || !initData) {
            console.warn('⚠️ No WebApp user data available for manual auth');
            return false;
        }

        await this.authenticateViaAPI(user, initData);
        return true;
    }

    /**
     * Валидация данных пользователя
     */
    validateUserData(user) {
        if (!user) return false;
        if (!user.id || typeof user.id !== 'number') return false;
        if (!user.first_name && !user.username) return false;
        return true;
    }

    /**
     * Сохранение данных авторизации
     */
    saveAuthData(user) {
        try {
            localStorage.setItem('telegram_auth_completed', 'true');
            localStorage.setItem('telegram_auth_token', 'webapp_' + Date.now());
            localStorage.setItem('telegram_auth_timestamp', Date.now().toString());
            localStorage.setItem('telegram_user', JSON.stringify(user));

            console.log('💾 Auth data saved to localStorage');
        } catch (error) {
            console.error('❌ Failed to save auth data:', error);
        }
    }

    /**
     * Установка авторизованного пользователя
     */
    setAuthenticatedUser(user) {
        this.currentUser = user;
        this.isAuthenticated = true;

        // Синхронизация с глобальным appState
        if (window.appState) {
            window.appState.userId = user.id;
            window.appState.userName = user.first_name || user.username;
        }

        // Скрыть модал если показан
        this.hideAuthModal();

        console.log('👤 User authenticated:', user.first_name || user.username);
    }

    /**
     * Показ модала авторизации (только по клику!)
     */
    async showAuthModal() {
        console.log('🔐 Showing auth modal by user request...');

        if (this.authModal && this.authOverlay) {
            this.authModal.style.display = 'block';
            this.authOverlay.style.display = 'block';
            document.body.classList.add('auth-modal-open');

            console.log('✅ Auth modal shown');
        } else {
            console.error('❌ Auth modal not found');
        }
    }

    /**
     * Скрытие модала авторизации
     */
    hideAuthModal() {
        if (this.authModal && this.authOverlay) {
            this.authModal.style.display = 'none';
            this.authOverlay.style.display = 'none';
            document.body.classList.remove('auth-modal-open');

            console.log('✅ Auth modal hidden');
        }
    }

    /**
     * Создание модала авторизации
     */
    createAuthModal() {
        try {
            console.log('🪟 Creating auth modal...');

            // Создание overlay (фон)
            this.authOverlay = document.createElement('div');
            this.authOverlay.className = 'auth-overlay';
            this.authOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.7);
                z-index: 9999;
                display: none;
                backdrop-filter: blur(5px);
                cursor: pointer;
            `;

            // Создание модала
            this.authModal = document.createElement('div');
            this.authModal.className = 'auth-modal';
            this.authModal.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--bg-primary, #fff);
                border-radius: 20px;
                padding: 40px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                z-index: 10000;
                display: none;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                border: 1px solid var(--border-primary, #e1e1e1);
            `;

            // Контент модала для WebApp
            this.authModal.innerHTML = `
                <div style="margin-bottom: 30px;">
                    <svg class="logo-img" style="width:80px; height:80px; margin: 0 auto 20px;">
                        <use xlink:href="#pixplace-logo" />
                    </svg>
                    <h2 style="color: var(--text-primary, #333); margin: 0 0 10px 0; font-size: 24px;">
                        Welcome to pixPLace
                    </h2>
                    <p style="color: var(--text-secondary, #666); margin: 0 0 30px 0;">
                        Your account will be automatically verified through Telegram
                    </p>
                </div>

                <button id="webappAuthBtn" class="webapp-auth-btn" style="
                    background: #0084ff;
                    color: white;
                    border: none;
                    border-radius: 15px;
                    padding: 15px 30px;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    width: 100%;
                    max-width: 280px;
                    box-shadow: 0 4px 15px rgba(0,132,255,0.3);
                    margin: 20px auto;
                ">
                    🚀 Continue with Telegram
                </button>

                <div style="margin-top: 30px;">
                    <p style="color: var(--text-secondary, #888); font-size: 14px; margin: 0;">
                        🔒 Your data is secure and automatically verified
                    </p>
                </div>
            `;

            // Добавление в DOM
            document.body.appendChild(this.authOverlay);
            document.body.appendChild(this.authModal);

            // Добавление обработчиков
            this.setupModalCloseHandlers();
            this.setupWebAppAuthButton();

            console.log('✅ Auth modal created for WebApp');

        } catch (error) {
            console.error('❌ Failed to create auth modal:', error);
        }
    }

    /**
     * Настройка кнопки WebApp аутентификации
     */
    setupWebAppAuthButton() {
        const button = document.getElementById('webappAuthBtn');
        if (button) {
            button.addEventListener('click', () => {
                console.log('🔑 Manual WebApp auth triggered');
                this.manualWebAppAuth();
            });
        }
    }



    /**
     * Настройка обработчиков закрытия модала
     */
    setupModalCloseHandlers() {
        // Закрытие по клику на overlay
        if (this.authOverlay) {
            this.authOverlay.addEventListener('click', (e) => {
                if (e.target === this.authOverlay) {
                    this.hideAuthModal();
                }
            });
        }

        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.authModal && this.authModal.style.display !== 'none') {
                this.hideAuthModal();
            }
        });

        console.log('🎯 Modal close handlers set up');
    }

    /**
     * Выход из аккаунта
     */
    logout() {
        console.log('🚪 Logging out...');

        // Очистка данных
        localStorage.removeItem('telegram_auth_completed');
        localStorage.removeItem('telegram_auth_token');
        localStorage.removeItem('telegram_auth_timestamp');
        localStorage.removeItem('telegram_user');

        // Сброс состояния
        this.isAuthenticated = false;
        this.currentUser = null;

        // Перезагрузка страницы для полного сброса
        window.location.reload();
    }

    /**
     * Получение текущего пользователя
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Robust WebApp инициализация - ждем данные с таймаутом
     */
    async waitForWebAppData() {
        console.log('⏳ Starting robust WebApp data wait...');

        // Проверяем доступность WebApp
        if (typeof Telegram === 'undefined' || !Telegram.WebApp) {
            console.log('📱 No WebApp available - skipping robust wait');
            return false;
        }

        const tg = Telegram.WebApp;

        // Ждем данные пользователя до таймаута (5 секунд максимум)
        for (let attempt = 0; attempt < 50; attempt++) {
            try {
                const user = tg.initDataUnsafe?.user;
                const initData = tg.initData;

                if (user && initData) {
                    console.log('✅ WebApp data available - authenticating automatically');
                    await this.authenticateViaAPI(user, initData);
                    return true; // Успешная авторизация
                }

                // Ждем 100ms перед следующей попыткой
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error) {
                console.warn('⚠️ WebApp data check failed on attempt', attempt, error);
                return false; // Ошибка - прекращаем ждать
            }
        }

        console.log('⏰ WebApp data timeout reached - user will use manual auth');
        return false;
    }

    /**
     * Проверка статуса авторизации
     */
    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    /**
     * Shutdown менеджера
     */
    async shutdown() {
        console.log('🛑 Auth Manager shutting down...');

        // Скрытие модала
        this.hideAuthModal();

        console.log('✅ Auth Manager shutdown complete');
    }
}

// Глобальная функция для совместимости с legacy кодом
window.handleTelegramLogin = async function() {
    console.log('🔄 handleTelegramLogin called - redirecting to AuthManager');

    try {
        // Если AuthManager инициализирован, используем его
        if (window.authManagerInstance) {
            await window.authManagerInstance.showAuthModal();
        } else {
            console.warn('⚠️ AuthManager not initialized, fallback to manual flow');

            // Fallback: показать alert с инструкциями
            alert(`Для авторизации выполните следующие шаги:

1. 🔔 Откройте Telegram бота: @pixPLaceBot
2. 📱 Отправьте команду: /start
3. 🔑 Получите персональную ссылку для авторизации
4. 🔗 Перейдите по ссылке в браузере
5. ✅ Авторизация будет завершена автоматически

После авторизации вы сможете использовать все функции приложения!`);

            // Открыть бота в новой вкладке
            window.open('https://t.me/pixPLaceBot?start=manual_auth', '_blank', 'noopener,noreferrer');
        }
    } catch (error) {
        console.error('❌ handleTelegramLogin failed:', error);

        // Экстренный fallback
        alert('Ошибка авторизации. Пожалуйста, попробуйте снова.');
    }
};

// Экспорт для глобального доступа
window.AuthManagerInstance = null;
