/**
 * 🚀 APP.JS - Главный файл приложения pixPLace
 * Модульная архитектура с разделением ответственности
 */

import { InitializationManager } from './initialization.js';
import { AuthManager } from './auth-manager.js';
import { UIManager } from './ui-manager.js';
import { GenerationManager } from './generation-manager.js';
import { EventBus } from '../events/event-bus.js';

export class App {
    constructor() {
        this.initializationManager = null;
        this.authManager = null;
        this.uiManager = null;
        this.generationManager = null;
        this.eventBus = null;

        this.isInitialized = false;
        this.isRunning = false;

        console.log('🎯 App instance created');
    }

    /**
     * Инициализация приложения
     */
    async initialize() {
        console.log('🔧 Starting app initialization...');

        try {
            // 1. Создание основных менеджеров
            await this.createManagers();

            // 2. Подключение системы событий
            await this.setupEventSystem();

            // 3. Синхронизация между модулями
            this.connectManagers();

            // 4. Проверка готовности
            await this.validateInitialization();

            this.isInitialized = true;
            console.log('✅ App initialization completed successfully');

        } catch (error) {
            console.error('❌ App initialization failed:', error);
            await this.handleInitializationError(error);
            throw error;
        }
    }

    /**
     * Создание основных менеджеров
     */
    async createManagers() {
        console.log('🏗️ Creating application managers...');

        // Initialization Manager - первый, так как нужен для запуска других
        this.initializationManager = new InitializationManager();

        // Event Bus - нужен для коммуникации между модулями
        this.eventBus = new EventBus();

        // Auth Manager - отвечает за авторизацию
        this.authManager = new AuthManager();

        // UI Manager - отвечает за интерфейс
        this.uiManager = new UIManager();

        // Generation Manager - отвечает за генерацию
        this.generationManager = new GenerationManager();

        console.log('✅ All managers created');
    }

    /**
     * Настройка системы событий
     */
    async setupEventSystem() {
        console.log('📡 Setting up event system...');

        // Глобальный доступ к EventBus
        window.appEventBus = this.eventBus;

        // Настройка глобальных обработчиков
        await this.setupGlobalEventHandlers();

        console.log('✅ Event system configured');
    }

    /**
     * Синхронизация между менеджерами
     */
    connectManagers() {
        console.log('🔗 Connecting managers...');

        // Auth Manager -> UI callbacks
        this.authManager.onAuthSuccess = (user) => {
            this.uiManager.showAuthenticatedState(user);
            this.generationManager.enableGeneration();
        };

        this.authManager.onAuthFailure = (reason) => {
            this.uiManager.showError(`Authentication failed: ${reason}`);
            // Reset header to show login button
            this.uiManager.initializeAuthDisplay();
            this.generationManager.disableGeneration();
        };

        // UI Manager -> Auth callbacks
        this.uiManager.onAuthRequired = () => {
            this.authManager.showAuthModal();
        };

        this.uiManager.onGenerationRequired = () => {
            this.generationManager.handleGenerationRequest();
        };

        // Generation Manager -> Auth check
        this.generationManager.onAuthRequired = () => {
            this.authManager.showAuthModal();
        };

        console.log('✅ Managers connected');
    }

    /**
     * Настройка глобальных обработчиков событий
     */
    async setupGlobalEventHandlers() {
        // Обработка ошибок браузера
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));

        // Обработка изменения видимости страницы
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

        // Обработка потери/восстановления сети
        window.addEventListener('online', this.handleNetworkChange.bind(this, true));
        window.addEventListener('offline', this.handleNetworkChange.bind(this, false));

        console.log('✅ Global event handlers installed');
    }

    /**
     * Проверка готовности инициализации
     */
    async validateInitialization() {
        const results = {
            initialization: this.initializationManager?.isInitialized || false,
            auth: this.authManager?.widgetInitialized || false,
            ui: !!this.uiManager,  // UI Manager exists
            generation: !!this.generationManager,  // Generation Manager exists
            eventBus: !!this.eventBus  // EventBus exists
        };

        const valid = Object.values(results).every(v => v);
        if (!valid) {
            console.warn('⚠️ Some managers not fully initialized:', results);
        }

        console.log('✅ Initialization validation passed');
    }

    /**
     * Запуск приложения
     */
    async start() {
        if (!this.isInitialized) {
            throw new Error('App not initialized. Call initialize() first.');
        }

        console.log('🚀 Starting application...');

        try {
            // Инициализация основ системы
            await this.initializationManager.initializeCore();

            // Ждем завершения инициализации авторизации (уже сделано в initialize())
            console.log('⏳ Waiting for auth initialization to complete...');
            // WebApp авторизация уже инициализирована в AuthManager.initialize()

            // Запуск UI
            await this.uiManager.initialize();

            // Финализация авторизации (создание модала после готовности DOM)
            await this.authManager.finalizeInitialization();

            // Запуск генерации
            await this.generationManager.initialize();

            // Финальная синхронизация
            await this.finalizeStartup();

            this.isRunning = true;
            console.log('✅ Application started successfully!');

        } catch (error) {
            console.error('❌ Application startup failed:', error);
            await this.handleStartupError(error);
            throw error;
        }
    }

    /**
     * Финальные настройки при запуске
     */
    async finalizeStartup() {
        // Обновление состояния UI на основе авторизации
        if (this.authManager.isAuthenticated) {
            const user = this.authManager.getCurrentUser();
            this.uiManager.showAuthenticatedState(user);
            this.generationManager.enableGeneration();
        } else {
            // Инициализируем отображение неавторизованного состояния (login button)
            this.uiManager.initializeAuthDisplay();
            this.generationManager.disableGeneration();
        }

        // Показ приветственного сообщения если нужно
        this.showWelcomeMessage();

        console.log('✅ Startup finalized');
    }

    /**
     * Показ приветственного сообщения
     */
    showWelcomeMessage() {
        const isFirstLaunch = !localStorage.getItem('pixplace_first_launch');
        if (isFirstLaunch) {
            localStorage.setItem('pixplace_first_launch', 'true');
            console.log('🎉 First launch - welcome message triggered');
        }
    }

    /**
     * Остановка приложения
     */
    async stop() {
        console.log('🛑 Stopping application...');

        try {
            // Остановка генерации
            if (this.generationManager) {
                await this.generationManager.shutdown();
            }

            // Остановка UI
            if (this.uiManager) {
                await this.uiManager.shutdown();
            }

            // Остановка авторизации
            if (this.authManager) {
                await this.authManager.shutdown();
            }

            // Остановка инициализации
            if (this.initializationManager) {
                await this.initializationManager.shutdown();
            }

            this.isRunning = false;
            console.log('✅ Application stopped');

        } catch (error) {
            console.error('❌ Error during application shutdown:', error);
        }
    }

    /**
     * Обработка ошибки инициализации
     */
    async handleInitializationError(error) {
        console.error('❌ Initialization error handling:', error);

        // Показ ошибки в UI если возможно
        if (this.uiManager) {
            try {
                this.uiManager.showError('Application initialization failed. Please refresh the page.');
            } catch (uiError) {
                console.error('❌ Cannot show error in UI:', uiError);
            }
        }

        // Отправка отчета об ошибке
        this.reportError('initialization', error);
    }

    /**
     * Обработка ошибки запуска
     */
    async handleStartupError(error) {
        console.error('❌ Startup error handling:', error);

        // Попытка показать экран ошибки
        if (this.uiManager) {
            try {
                this.uiManager.showError('Application failed to start. Please try refreshing the page.');
            } catch (uiError) {
                console.error('❌ Cannot show startup error:', uiError);
            }
        }

        // Отправка отчета об ошибке
        this.reportError('startup', error);
    }

    /**
     * Обработка глобальных ошибок браузера
     */
    handleGlobalError(event) {
        console.error('💥 Global application error:', event.error);
        console.error('Error details:', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
        this.reportError('global', event.error);
    }

    /**
     * Обработка необработанных отклонений промисов
     */
    handleUnhandledRejection(event) {
        console.error('💥 Unhandled promise rejection:', event.reason);
        this.reportError('promise', event.reason);
    }

    /**
     * Обработка изменения видимости страницы
     */
    handleVisibilityChange() {
        const isVisible = !document.hidden;
        console.log('👁️ Page visibility changed:', isVisible);

        // При возврате на страницу можно обновить состояния
        if (isVisible) {
            this.handlePageResume();
        } else {
            this.handlePageBackground();
        }
    }

    /**
     * Обработка восстановления сети
     */
    handleNetworkChange(isOnline) {
        console.log('🌐 Network status changed:', isOnline);

        if (isOnline) {
            this.handleNetworkResumed();
        } else {
            this.handleNetworkLost();
        }
    }

    /**
     * При возврате на страницу
     */
    handlePageResume() {
        // Можно обновить данные, переподключиться и т.д.
        console.log('📱 Page resumed - potential data refresh');
    }

    /**
     * Когда страница отправлена в фон
     */
    handlePageBackground() {
        // Можно сохранить состояние, очистить ресурсы и т.д.
        console.log('📱 Page backgrounded');
    }

    /**
     * Когда сеть восстановлена
     */
    handleNetworkResumed() {
        console.log('🌐 Network resumed - checking connectivity');
        // Можно подтвердить подключение, синхронизировать данные
    }

    /**
     * Когда сеть потеряна
     */
    handleNetworkLost() {
        if (this.uiManager) {
            this.uiManager.showError('Connection lost. Some features may not be available.');
        }
    }

    /**
     * Отправка отчета об ошибке
     */
    reportError(type, error) {
        try {
            const reportData = {
                type,
                message: error.message,
                stack: error.stack,
                url: window.location.href,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            };

            // В продакшене отправить на сервер
            console.error('📊 Error report:', reportData);

        } catch (reportError) {
            console.error('❌ Error reporting failed:', reportError);
        }
    }

    /**
     * Получить состояние приложения
     */
    getState() {
        return {
            isInitialized: this.isInitialized,
            isRunning: this.isRunning,
            managers: {
                initialization: this.initializationManager?.isReady(),
                auth: this.authManager?.isAuthenticated,
                ui: this.uiManager?.getCurrentScreen(),
                generation: this.generationManager?.isEnabled,
                eventBus: !!this.eventBus
            }
        };
    }

    /**
     * Получить метрики производительности
     */
    getPerformanceMetrics() {
        return {
            memoryUsage: performance.memory ? {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize
            } : null,
            navigation: performance.timing,
            marks: performance.getEntriesByType('mark'),
            measures: performance.getEntriesByType('measure')
        };
    }
}

window.pixPlaceApp = null;
