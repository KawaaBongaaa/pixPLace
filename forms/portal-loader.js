/**
 * Portal Loader - управление iframe формами для pixPLace
 * 
 * Протокол коммуникации:
 * Форма → Родитель:
 *   { type: 'form-loaded', formType: 'image' }
 *   { type: 'form-submit', formType: 'image', data: {...} }
 *   { type: 'model-selected', mode: 'z_image', name: '...', badge: '...' }
 * 
 * Родитель → Форма:
 *   { type: 'set-theme', theme: 'dark' }
 *   { type: 'set-form-data', data: {...} }
 *   { type: 'reset-form' }
 */

class PortalLoader {
    constructor(options = {}) {
        this.options = {
            basePath: '/forms/',
            containerSelector: '#form-portal-container',
            defaultForm: 'image',
            ...options
        };

        this.currentForm = null;
        this.currentIframe = null;
        this.iframeCache = new Map(); // Кэш загруженных iframe
        this.isDarkTheme = document.documentElement.classList.contains('dark');

        this.init();
    }

    init() {
        this.container = document.querySelector(this.options.containerSelector);
        if (!this.container) {
            console.error(`Container ${this.options.containerSelector} not found`);
            return;
        }

        // Слушаем сообщения от iframe
        window.addEventListener('message', this.handleMessage.bind(this));

        // Наблюдаем за изменением темы
        this.observeThemeChanges();

        // Инъекция CSS для раскрытых модалов портала
        this.injectPortalStyles();

        // Загружаем форму по умолчанию
        if (this.options.defaultForm) {
            this.loadForm(this.options.defaultForm);
        }
    }

    /**
     * Загружает форму указанного типа
     * @param {string} formType - тип формы (image, video, edit, sound)
     * @param {boolean} forceReload - принудительно перезагрузить, даже если уже загружена
     */
    loadForm(formType, forceReload = false) {
        if (this.currentForm === formType && !forceReload && this.currentIframe) {
            // Форма уже загружена
            this.showCurrentIframe();
            return;
        }

        // Скрываем текущий iframe
        this.hideCurrentIframe();

        // Проверяем кэш
        if (this.iframeCache.has(formType) && !forceReload) {
            this.currentIframe = this.iframeCache.get(formType);
            this.currentForm = formType;
            this.showCurrentIframe();
            return;
        }

        // Создаем новый iframe
        const iframe = document.createElement('iframe');
        iframe.id = `form-iframe-${formType}`;
        iframe.className = 'form-iframe w-full h-full border-0 bg-transparent';
        iframe.src = `${this.options.basePath}${formType}-form.html`;
        iframe.loading = 'lazy';
        iframe.setAttribute('data-form-type', formType);

        // Обработка загрузки iframe
        iframe.onload = () => {
            console.log(`Form ${formType} loaded`);
            // Отправляем тему после загрузки
            this.sendThemeToIframe(iframe);
        };

        iframe.onerror = (error) => {
            console.error(`Failed to load form ${formType}:`, error);
            this.showError(`Failed to load ${formType} form`);
        };

        // Добавляем в контейнер
        this.container.appendChild(iframe);
        this.currentIframe = iframe;
        this.currentForm = formType;

        // Кэшируем iframe
        this.iframeCache.set(formType, iframe);
    }

    /**
     * Переключает на другую форму (используется при смене вкладок)
     * @param {string} formType 
     */
    switchForm(formType) {
        if (formType === this.currentForm) return;

        // Уведомляем текущую форму о деактивации (опционально)
        if (this.currentIframe) {
            this.sendToIframe(this.currentIframe, { type: 'form-deactivated' });
        }

        this.loadForm(formType);
    }

    /**
     * Отправляет сообщение в текущий iframe
     * @param {object} message 
     */
    sendToCurrentIframe(message) {
        if (!this.currentIframe) return;
        this.sendToIframe(this.currentIframe, message);
    }

    /**
     * Отправляет сообщение в конкретный iframe
     * @param {HTMLIFrameElement} iframe 
     * @param {object} message 
     */
    sendToIframe(iframe, message) {
        if (!iframe || !iframe.contentWindow) return;
        iframe.contentWindow.postMessage(message, '*');
    }

    /**
     * Отправляет текущую тему в iframe
     * @param {HTMLIFrameElement} iframe 
     */
    sendThemeToIframe(iframe) {
        const theme = this.isDarkTheme ? 'dark' : 'light';
        this.sendToIframe(iframe, { type: 'set-theme', theme });
    }

    /**
     * Обработчик сообщений от iframe
     * @param {MessageEvent} event 
     */
    handleMessage(event) {
        const data = event.data;
        if (!data || !data.type) return;

        console.log('Message from iframe:', data);

        switch (data.type) {
            case 'form-loaded':
                console.log(`Form ${data.formType} loaded successfully`);
                // Можно уведомить UI Manager о готовности формы
                this.notifyUIManager('form-loaded', data);
                break;

            case 'form-submit':
                console.log('Form submit:', data);
                // Передаем данные в generation-manager.js
                this.handleFormSubmit(data);
                break;

            case 'model-selected':
                console.log('Model selected:', data);
                // Обновляем UI (например, отображение стоимости)
                this.notifyUIManager('model-selected', data);
                // 🔥 FIX: Directly sync the selected mode to the mode-cards state
                // (window.uiManager may not exist, so we call selectModeCard directly)
                if (data.mode) {
                    if (typeof window.selectModeCard === 'function') {
                        window.selectModeCard(data.mode);
                    } else if (window.modeCardsExports?.selectModeCard) {
                        window.modeCardsExports.selectModeCard(data.mode);
                    }
                }
                break;

            case 'modal-toggle':
                console.log('📡 Portal Modal Toggle:', data);
                // Поиск iframe, который отправил сообщение
                const senderIframe = Array.from(document.querySelectorAll('iframe')).find(
                    iframe => iframe.contentWindow === event.source
                ) || this.currentIframe;

                if (senderIframe) {
                    if (data.open) {
                        senderIframe.classList.add('portal-modal-active');
                        this.container.classList.add('portal-container-modal-active');
                        document.body.classList.add('portal-any-modal-open');
                        
                        // Задержка для плавной анимации фона
                        setTimeout(() => {
                            senderIframe.classList.add('portal-modal-open-anim');
                        }, 10);
                    } else {
                        senderIframe.classList.remove('portal-modal-open-anim');
                        setTimeout(() => {
                            senderIframe.classList.remove('portal-modal-active');
                            // Проверяем, нет ли других открытых модалов перед удалением классов с контейнера/body
                            const otherActive = document.querySelector('.portal-modal-active');
                            if (!otherActive) {
                                this.container.classList.remove('portal-container-modal-active');
                                document.body.classList.remove('portal-any-modal-open');
                            }
                        }, 300);
                    }
                }
                break;

            default:
                console.warn('Unknown message type:', data.type);
        }
    }

    /**
     * Обработка отправки формы
     * @param {object} data
     */
    handleFormSubmit(data) {
        console.log('📤 Handling form submit from portal:', data);

        // Отправляем статус "в процессе" обратно в iframe
        this.sendToCurrentIframe({
            type: 'generation-status',
            status: 'processing',
            message: 'Starting generation...'
        });

        // Ищем generation-manager в глобальной области
        if (window.generationManager) {
            try {
                window.generationManager.handleFormSubmit(data);
            } catch (error) {
                console.error('Error in generation manager:', error);
                this.sendToCurrentIframe({
                    type: 'generation-status',
                    status: 'error',
                    message: `Generation failed: ${error.message}`
                });
            }
        } else if (window.app && window.app.generationManager) {
            try {
                window.app.generationManager.handleFormSubmit(data);
            } catch (error) {
                console.error('Error in generation manager:', error);
                this.sendToCurrentIframe({
                    type: 'generation-status',
                    status: 'error',
                    message: `Generation failed: ${error.message}`
                });
            }
        } else {
            console.error('Generation manager not found');
            this.sendToCurrentIframe({
                type: 'generation-status',
                status: 'error',
                message: 'Generation system not available'
            });
            // Fallback: отправляем событие
            document.dispatchEvent(new CustomEvent('form-submit', { detail: data }));
        }
    }

    /**
     * Отправляет результат генерации обратно в iframe
     * @param {object} resultData - данные результата
     */
    sendGenerationResult(resultData) {
        this.sendToCurrentIframe({
            type: 'generation-result',
            ...resultData
        });
    }

    /**
     * Уведомляет UI Manager о событиях
     * @param {string} event 
     * @param {object} data 
     */
    notifyUIManager(event, data) {
        // Ищем ui-manager
        if (window.uiManager) {
            window.uiManager.handlePortalEvent(event, data);
        } else if (window.app && window.app.uiManager) {
            window.app.uiManager.handlePortalEvent(event, data);
        }
    }

    /**
     * Показывает текущий iframe
     */
    showCurrentIframe() {
        if (!this.currentIframe) return;
        this.currentIframe.style.display = 'block';
        this.currentIframe.style.visibility = 'visible';
        this.currentIframe.style.opacity = '1';
    }

    /**
     * Скрывает текущий iframe
     */
    hideCurrentIframe() {
        if (!this.currentIframe) return;
        this.currentIframe.style.display = 'none';
        this.currentIframe.style.visibility = 'hidden';
        this.currentIframe.style.opacity = '0';
    }

    /**
     * Показывает сообщение об ошибке
     * @param {string} message 
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg';
        errorDiv.textContent = message;

        // Очищаем контейнер и показываем ошибку
        this.container.innerHTML = '';
        this.container.appendChild(errorDiv);
    }

    /**
     * Инъекция стилей для управления состоянием модалов портала
     */
    injectPortalStyles() {
        if (document.getElementById('portal-loader-styles')) return;

        const style = document.createElement('style');
        style.id = 'portal-loader-styles';
        style.textContent = `
            .portal-modal-active {
                position: fixed !important;
                inset: 0 !important;
                z-index: 11000 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(0, 0, 0, 0) !important;
                backdrop-filter: blur(0px) !important;
                border: none !important;
                pointer-events: auto !important;
                transition: background 0.3s ease, backdrop-filter 0.3s ease !important;
            }
            .portal-modal-active.portal-modal-open-anim {
                background: rgba(0, 0, 0, 0.4) !important;
                backdrop-filter: blur(4px) !important;
            }
            .portal-container-modal-active {
                z-index: 11000 !important;
            }
            .portal-any-modal-open {
                overflow: hidden !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Наблюдает за изменениями темы
     */
    observeThemeChanges() {
        // Проверяем начальную тему
        this.isDarkTheme = document.documentElement.classList.contains('dark');

        // Слушаем изменения data-theme атрибута
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class' || mutation.attributeName === 'data-theme') {
                    const wasDark = this.isDarkTheme;
                    this.isDarkTheme = document.documentElement.classList.contains('dark') ||
                        document.documentElement.getAttribute('data-theme') === 'dark';

                    // Если тема изменилась, обновляем все iframe
                    if (wasDark !== this.isDarkTheme) {
                        this.updateAllIframesTheme();
                    }
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });

        // Также слушаем медиа-запрос prefers-color-scheme
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            this.isDarkTheme = e.matches;
            this.updateAllIframesTheme();
        });
    }

    /**
     * Обновляет тему во всех закэшированных iframe
     */
    updateAllIframesTheme() {
        const theme = this.isDarkTheme ? 'dark' : 'light';
        this.iframeCache.forEach((iframe) => {
            this.sendToIframe(iframe, { type: 'set-theme', theme });
        });
    }

    /**
     * Очищает кэш iframe
     */
    clearCache() {
        this.iframeCache.clear();
    }

    /**
     * Уничтожает загрузчик
     */
    destroy() {
        window.removeEventListener('message', this.handleMessage.bind(this));
        this.iframeCache.clear();
        this.currentIframe = null;
        this.currentForm = null;
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortalLoader;
} else {
    window.PortalLoader = PortalLoader;
}