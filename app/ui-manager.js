/**
 * 🖥️ UI Manager - Менеджер пользовательского интерфейса
 * Управляет экранами, модалами, состояниями UI
 */

import { ScreenManager } from '../screen-manager.js';

export class UIManager {
    constructor() {
        this.currentScreen = 'loading';

        // Callbacks
        this.onAuthRequired = null;
        this.onGenerationRequired = null;

        console.log('🖥️ UI Manager created');
    }

    /**
     * Инициализация UI
     */
    async initialize() {
        console.log('🎨 Initializing UI...');

        // Инициализация базовых UI компонентов
        await this.initializeBaseUI();

        // Инициализация модальных окон
        await this.initializeModals();

        // Инициализация состояния аутентификации в хедере
        this.initializeAuthDisplay();

        // Показ начального экрана
        this.showInitialScreen();

        console.log('✅ UI initialized');
    }

    /**
     * Инициализация базового UI
     */
    async initializeBaseUI() {
        // Настройка счётчиков символов
        this.initializeCharacterCounters();

        // Инициализация dropdown'ов
        this.initializeDropdowns();

        // Инициализация тем
        this.initializeThemes();

        // Настройка генератора формы
        this.initializeForm();
    }

    /**
     * Инициализация модальных окон
     */
    async initializeModals() {
        // Модал лимита инициализируется отдельно
        this.initializeLimitModal();

        // Другие модалы
        console.log('🪟 Modals ready');
    }

    /**
     * Инициализация счётчиков символов
     */
    initializeCharacterCounters() {
        const promptInput = document.getElementById('promptInput');
        const charCounter = document.getElementById('charCounter');

        if (promptInput && charCounter) {
            promptInput.addEventListener('input', function() {
                charCounter.textContent = this.value.length;
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            });
            console.log('✅ Prompt character counter initialized');
        }

        const negativePromptInput = document.getElementById('negativePromptInput');
        const negativeCharCounter = document.getElementById('negativeCharCounter');

        if (negativePromptInput && negativeCharCounter) {
            negativePromptInput.addEventListener('input', function() {
                negativeCharCounter.textContent = this.value.length;
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 120) + 'px';
            });
            console.log('✅ Negative prompt character counter initialized');
        }
    }

    /**
     * Инициализация dropdown'ов
     */
    initializeDropdowns() {
        // Language dropdown
        const langBtn = document.getElementById('langBtn');
        const langMenu = document.getElementById('langMenu');

        if (langBtn && langMenu) {
            this.setupLanguageDropdown(langBtn, langMenu);
        }
    }

    /**
     * Настройка dropdown языка
     */
    setupLanguageDropdown(btn, menu) {
        // Предотвращаем дублирование
        if (menu.dataset.initialized === 'true') return;
        menu.dataset.initialized = 'true';

        // Карта языков
        const languageMap = {
            'en': { flag: '🇬🇧', name: 'English' },
            'ru': { flag: '🇷🇺', name: 'Русский' },
            'es': { flag: '🇪🇸', name: 'Español' },
            'fr': { flag: '🇫🇷', name: 'Français' },
            'de': { flag: '🇩🇪', name: 'Deutsch' },
            'zh': { flag: '🇨🇳', name: '中文' },
            'pt': { flag: '🇵🇹', name: 'Português' },
            'ar': { flag: '🇦🇪', name: 'العربية' },
            'hi': { flag: '🇮🇳', name: 'हिंदी' },
            'ja': { flag: '🇯🇵', name: '日本語' },
            'it': { flag: '🇮🇹', name: 'Italiano' },
            'ko': { flag: '🇰🇷', name: '한국어' },
            'vi': { flag: '🇻🇳', name: 'Tiếng Việt' },
            'th': { flag: '🇹🇭', name: 'ไทย' },
            'tr': { flag: '🇹🇷', name: 'Türkçe' },
            'pl': { flag: '🇵🇱', name: 'Polski' }
        };

        // Заполнение меню
        menu.innerHTML = '';
        const CONFIG = window.CONFIG || { LANGUAGES: ['en', 'ru', 'es'] };
        CONFIG.LANGUAGES.forEach(lang => {
            const li = document.createElement('li');
            const langInfo = languageMap[lang] || { flag: lang, name: lang };
            li.innerHTML = `<span class="flag">${langInfo.flag}</span> <span class="lang-name">${langInfo.name}</span>`;
            li.dataset.lang = lang;

            li.addEventListener('click', async (evt) => {
                evt.stopPropagation();

                try {
                    const { dictionaryManager } = await import('../dictionary-manager.js');
                    await dictionaryManager.setLanguage(lang);
                    window.appState.setLanguage(lang);
                    menu.style.display = 'none';
                    console.log('✅ Language changed to:', lang);
                } catch (error) {
                    console.error('❌ Language change failed:', error);
                }
            });
            menu.appendChild(li);
        });

        menu.style.display = 'none';

        // Обработчики открытия/закрытия
        btn.addEventListener('click', (evt) => {
            evt.stopPropagation();
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });

        // Закрытие при клике вне
        document.addEventListener('click', (evt) => {
            if (!menu.contains(evt.target) && !btn.contains(evt.target)) {
                menu.style.display = 'none';
            }
        });

        document.addEventListener('keydown', (evt) => {
            if (evt.key === 'Escape') {
                menu.style.display = 'none';
            }
        });

        console.log('🌍 Language dropdown initialized');
    }

    /**
     * Инициализация тем
     */
    initializeThemes() {
        const themeBtn = document.querySelector('button[title="Theme"]');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                window.appState.toggleTheme();
            });
            console.log('✅ Theme button initialized');
        } else {
            console.warn('⚠️ Theme button not found in DOM');
        }
    }

    /**
     * Инициализация формы генерации
     */
    initializeForm() {
        const form = document.querySelector('.generation-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleGenerationSubmit();
            });
        }
    }

    /**
     * Обработка отправки формы генерации
     */
    async handleGenerationSubmit() {
        console.log('📝 Generation form submitted');

        // Проверка авторизации
        if (this.onAuthRequired) {
            const isAuth = await this.checkAuthentication();
            if (!isAuth) {
                this.onAuthRequired();
                return;
            }
        }

        // Вызов генерации
        if (this.onGenerationRequired) {
            this.onGenerationRequired();
        }
    }

    /**
     * Проверка авторизации
     */
    async checkAuthentication() {
        // TODO: Реализовать проверку через AuthManager
        return window.appState?.userId ? true : false;
    }

    /**
     * Показ начального экрана
     */
    showInitialScreen() {
        this.currentScreen = 'generation';
        ScreenManager.show('generationScreen');
        console.log('🏠 Initial screen shown: generation');
    }

    /**
     * Показ экрана генерации
     */
    showGeneration() {
        ScreenManager.show('generationScreen');
        this.currentScreen = 'generation';

        // Обновление истории
        this.refreshHistoryDisplay();

        // Принудительная загрузка превью
        setTimeout(() => {
            this.forceLoadVisiblePreviews();
        }, 50);
    }

    /**
     * Показ экрана результатов - удалена конфликтующая функция
     * Теперь используйте ScreenManager.showResult(result) для правильной логики
     */

    /**
     * Обновление отображения истории
     */
    async refreshHistoryDisplay() {
        try {
            const { updateHistoryDisplay } = await import('../history-manager.js');
            updateHistoryDisplay();
        } catch (error) {
            console.warn('⚠️ Could not refresh history display:', error);
        }
    }

    /**
     * Принудительная загрузка видимых превью
     */
    forceLoadVisiblePreviews() {
        // TODO: Реализовать через GlobalHistoryLoader
        console.log('🖼️ Force load previews requested');
    }

    /**
     * Показ состояния авторизации
     */
    showAuthenticatedState(user) {
        console.log('🎉 Showing authenticated state for:', user.first_name);

        // Обновление UI элементов
        this.updateUserDisplay(user);

        // Показ welcome toast
        this.showWelcomeToast(user);
    }

    /**
     * Обновление отображения пользователя
     */
    updateUserDisplay(user) {
        this.updateHeaderAuthDisplay(user);
    }

    /**
     * Обновление отображения аутентификации в хедере
     */
    updateHeaderAuthDisplay(user) {
        const userBalanceContainer = document.getElementById('userBalance');
        const userNameDisplay = document.getElementById('userNameDisplay');
        const userCreditsDisplay = document.getElementById('userCreditsDisplay');

        if (userBalanceContainer) {
            // Очищаем предыдущее содержимое
            userBalanceContainer.innerHTML = '';

            if (user) {
                // Авторизованный пользователь - показываем имя и баланс
                userBalanceContainer.innerHTML = `
                    <div class="user-info">
                        <span class="user-name">${user.first_name || user.username || 'User'}</span>
                        <span class="balance-text">Balance:</span>
                    </div>
                    <span class="credits-amount">--</span>
                `;

                console.log('👤 Header updated with authenticated user:', user.first_name || user.username);
            } else {
                // Неавторизованный пользователь - показываем кнопку входа
                const loginButton = document.createElement('button');
                loginButton.className = 'header-login-btn';
                loginButton.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 6px;">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 5.547c.24.24.443.442.443.783v.054c0 .34-.203.542-.443.783l-.054.054-2.572 2.572-1.781 1.781a.48.48 0 0 1-.683 0l-.054-.054-.832-.832-.832-.832-.832-.832-.832-.832-.054-.054a.48.48 0 0 1 0-.683l.054-.054 1.781-1.781L14.746 5.6c1.086 1.086 2.238 2.238 2.572 2.572z"/>
                    </svg>
                    Login
                `;

                loginButton.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 6px 12px;
                    background: var(--accent-primary, #0088cc);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.2s;
                `;

                loginButton.onmouseover = () => {
                    loginButton.style.background = 'var(--accent-hover, #0077b5)';
                };

                loginButton.onmouseout = () => {
                    loginButton.style.background = 'var(--accent-primary, #0088cc)';
                };

                loginButton.onclick = () => {
                    console.log('🔐 Header login button clicked');
                    if (this.onAuthRequired) {
                        this.onAuthRequired();
                    }
                };

                userBalanceContainer.appendChild(loginButton);
                console.log('🔓 Header updated with login button');
            }
        }
    }

    /**
     * Инициализация отображения аутентификации в хедере
     */
    initializeAuthDisplay() {
        console.log('🔐 Initializing header auth display...');

        // Используем состояние AuthManager вместо appState (более надежно)
        const authManager = window.pixPlaceApp?.authManager;
        let currentUser = null;

        if (authManager?.isAuthenticated && authManager?.currentUser) {
            currentUser = authManager.currentUser;
            console.log('👤 Using authenticated user from AuthManager:', currentUser.first_name);
        } else if (window.appState?.userId && window.appState?.userName) {
            // Fallback на appState в крайнем случае
            currentUser = {
                id: window.appState.userId,
                first_name: window.appState.userName,
                username: window.appState.userName
            };
            console.log('🔄 Using fallback user from appState');
        } else {
            console.log('🔓 No authentication found, showing login button');
        }

        // Отображаем соответствующее состояние (логин кнопка или имя пользователя)
        this.updateHeaderAuthDisplay(currentUser);

        console.log('✅ Header auth display initialized');
    }

    /**
     * Показ welcome toast
     */
    showWelcomeToast(user) {
        const userName = user.first_name || user.username || 'Пользователь';
        if (window.showToast) {
            window.showToast('success', `Добро пожаловать, ${userName}! 🎉`);
        }
    }

    /**
     * Инициализация модала лимита
     */
    initializeLimitModal() {
        // Модал лимита инициализируется отдельно через mutation observer
        console.log('🪟 Limit modal observer set');

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const modal = document.getElementById('limitModal');
                    if (modal && modal.classList.contains('show')) {
                        this.initializeLimitModalInternal();
                    }
                }
            });
        });

        const modal = document.getElementById('limitModal');
        if (modal) {
            observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
        }
    }

    /**
     * Внутренняя инициализация модала лимита
     */
    async initializeLimitModalInternal() {
        try {
            // Импорт и инициализация карусели планов
            const planCarousel = await this.generatePlanCarouselHTML();
            this.injectPlanCarousel(planCarousel);

            // TODO: Инициализация handlers для карточек планов
        } catch (error) {
            console.error('❌ Failed to initialize limit modal:', error);
        }
    }

    /**
     * Генерация HTML карусели планов
     */
    generatePlanCarouselHTML() {
        // Простая заглушка - потом можно расширить
        return '<div class="plans-carousel">Plans carousel content</div>';
    }

    /**
     * Вставка карусели в модал
     */
    injectPlanCarousel(html) {
        const container = document.querySelector('#limitModal .plans-carousel-container');
        if (container) {
            container.innerHTML = html;
        }
    }

    /**
     * Показ ошибки
     */
    showError(message) {
        if (window.showToast) {
            window.showToast('error', message);
        } else {
            alert(message);
        }
    }

    /**
     * Показ успеха
     */
    showSuccess(message) {
        if (window.showToast) {
            window.showToast('success', message);
        }
    }

    /**
     * Получение текущего экрана
     */
    getCurrentScreen() {
        return this.currentScreen;
    }

    /**
     * Завершение UI менеджера
     */
    async shutdown() {
        console.log('🛑 UI Manager shutting down...');

        // Очистка listeners
        this.cleanupEventListeners();

        // Скрытие модалов
        this.hideAllModals();

        console.log('✅ UI Manager shutdown complete');
    }

    /**
     * Очистка listeners
     */
    cleanupEventListeners() {
        // TODO: Реализовать очистку всех listeners
    }

    /**
     * Скрытие всех модалов
     */
    hideAllModals() {
        // Скрытие auth модала
        if (this.authModal) {
            this.authModal.style.display = 'none';
        }
    }
}
