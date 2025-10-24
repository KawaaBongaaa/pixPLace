// screen-manager.js - Управление экранами и навигацией приложения

class ScreenManager {
    static currentScreen = null;
    static pendingResults = []; // Ожидающие результаты для показа в тостах

    // Основная функция переключения экранов
    static show(screenId) {
        console.log('🔄 ScreenManager.show called for:', screenId);

        // Сначала ищем нужный экран
        const targetScreen = document.getElementById(screenId);
        if (!targetScreen) {
            console.error('Screen not found:', screenId);
            return;
        }

        // 🔥 ОСТАНОВКА СНЕГОПАДА: завершаем снегопад при переключении на любой экран приложения
        // (но НЕ при переходе на loading screen)
        if (typeof window.stopSnowfall === 'function' && screenId !== 'loadingScreen') {
            console.log('❄️ Stopping snowfall on screen switch to:', screenId);
            window.stopSnowfall();
        }

        // Логируем текущее состояние
        console.log('📋 Current screens state:');
        document.querySelectorAll('.screen').forEach(screen => {
            const isActive = screen.classList.contains('active');
            const isHidden = screen.classList.contains('hidden');
            if (isActive || !isHidden) {
                console.log(`   ${screen.id}: active=${isActive}, hidden=${isHidden}`);
            }
        });

        // Скрываем все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('hidden'); // гарантированно прячем
        });

        // Показываем нужный
        targetScreen.classList.remove('hidden');
        targetScreen.classList.add('active');
        this.currentScreen = screenId;

        console.log(`✅ Switched to screen: ${screenId}, target classes:`, targetScreen.className);

        // Проверяем стиль после небольшой задержки
        setTimeout(() => {
            console.log(`🎯 Screen ${screenId} final display:`, window.getComputedStyle(targetScreen).display);
            console.log(`🎯 Screen ${screenId} final visibility:`, window.getComputedStyle(targetScreen).visibility);
            console.log(`🎯 Screen ${screenId} final opacity:`, window.getComputedStyle(targetScreen).opacity);
        }, 10);
    }

    // Получить текущий видимый экран
    static getCurrent() {
        const generationEl = document.getElementById('generationScreen');
        const processingEl = document.getElementById('processingScreen');
        const authScreen = document.getElementById('authScreen');
        const chatScreen = document.getElementById('chatScreen');

        const isVisible = el => {
            if (!el) return false;
            const cs = window.getComputedStyle(el);
            if (el.classList.contains('hidden')) return false;
            return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0';
        };

        if (isVisible(processingEl)) return 'processing';
        if (isVisible(generationEl)) return 'generation';
        if (isVisible(chatScreen)) return 'chat';
        if (isVisible(authScreen)) return 'auth';
        return 'unknown';
    }

    // Показать экран авторизации
    static showAuth() {
        this.show('authScreen');
        console.log('🎯 Показан экран авторизации');

        // Убедимся, что .app контейнер видимый
        const app = document.querySelector('.app');
        if (app && !app.classList.contains('loaded')) {
            app.classList.add('loaded');
            console.log('🎯 App container made visible for auth screen');
        }

        // 🔥 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Обновить переводы для аутентификации
        if (typeof window.dictionaryManager !== 'undefined' && window.dictionaryManager.updateTranslations) {
            setTimeout(() => {
                window.dictionaryManager.updateTranslations();
                console.log('✅ Translations updated for auth screen');
            }, 100); // Небольшая задержка для гарантии готовности DOM
        }

        // Диагностика структуры экрана авторизации
        const authScreen = document.getElementById('authScreen');
        const authContainer = authScreen?.querySelector('.auth-container');
        const authTitle = authScreen?.querySelector('.auth-title');
        const authSubtitle = authScreen?.querySelector('.auth-subtitle');
        const authContent = authScreen?.querySelector('.auth-content');
        const authBtn = authScreen?.querySelector('.auth-btn');

        console.log('👀 Auth screen structure:', {
            screen: !!authScreen,
            screenDisplay: authScreen ? getComputedStyle(authScreen).display : 'null',
            screenClasses: authScreen?.className,
            container: !!authContainer,
            containerDisplay: authContainer ? getComputedStyle(authContainer).display : 'null',
            containerPosition: authContainer ? getComputedStyle(authContainer).position : 'null',
            containerWidth: authContainer ? getComputedStyle(authContainer).width : 'null',
            containerHeight: authContainer ? getComputedStyle(authContainer).height : 'null',
            containerMargin: authContainer ? getComputedStyle(authContainer).margin : 'null',
            containerPadding: authContainer ? getComputedStyle(authContainer).padding : 'null',
            containerLeft: authContainer ? getComputedStyle(authContainer).left : 'null',
            containerTop: authContainer ? getComputedStyle(authContainer).top : 'null',
            containerBgColor: authContainer ? getComputedStyle(authContainer).backgroundColor : 'null',
            title: !!authTitle,
            titleText: authTitle?.textContent?.substring(0, 20),
            titleDisplay: authTitle ? getComputedStyle(authTitle).display : 'null',
            titleColor: authTitle ? getComputedStyle(authTitle).color : 'null',
            subtitle: !!authSubtitle,
            subtitleDisplay: authSubtitle ? getComputedStyle(authSubtitle).display : 'null',
            subtitleColor: authSubtitle ? getComputedStyle(authSubtitle).color : 'null',
            content: !!authContent,
            contentDisplay: authContent ? getComputedStyle(authContent).display : 'null',
            btn: !!authBtn,
            btnDisplay: authBtn ? getComputedStyle(authBtn).display : 'null',
            btnBgColor: authBtn ? getComputedStyle(authBtn).backgroundColor : 'null'

        });
    }

    // Показать обработку
    static showProcessing() {
        this.show('processingScreen');
        // updateProcessingSteps(1); // Функция не найдена, убрана из кода
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
    }

    // Показать экран генерации
    static showGeneration() {
        this.show('generationScreen');
    }

    static showApp() {
        console.log('ScreenManager.showApp called - showing app screen');
        this.show('generationScreen');
        // Обновляем статус загрузки для плавного входа
        document.querySelector('.app').classList.add('loaded');
        console.log('🎯 App screen shown successfully');
    }

    // Показать экран результатов с логикой
    static showResult(result) {
        // Проверяем, показывается ли сейчас полный экран результата
        if (this.getCurrent() === 'result') {
            // Экран уже занят - показываем тост-уведомление
            this.showResultToast(result);
            console.log('🎯 Показан тост с новым результатом (экран занят)');
        } else {
            // Экран свободен - показываем полный результат
            this.displayFullResult(result);
            console.log('🎯 Показан полный результат (экран свободен)');
        }
    }

    // Полный показ результата - переход к модальному окну
    static displayFullResult(result) {
        console.log('🔄 displayFullResult: Redirecting to generationResultModal');

        // Проверяем наличие глобальной функции showGenerationResultModal
        if (typeof window.showGenerationResultModal === 'function') {
            // Создаем объект item в формате, ожидаемом showGenerationResultModal
            const item = {
                id: window.appState.currentGeneration?.id || Date.now(),
                result: result.image_url,
                dataUrl: result.image_url, // Предпочитаем dataUrl для лучшей совместимости
                prompt: window.appState.currentGeneration?.prompt || '',
                mode: window.appState.currentGeneration?.mode || 'unknown',
                style: window.appState.currentGeneration?.style || 'unknown',
                generation_cost: window.appState.currentGeneration?.generation_cost,
                cost_currency: window.appState.currentGeneration?.cost_currency || 'Cr',
                timestamp: window.appState.currentGeneration?.timestamp || new Date().toISOString()
            };

            // Показываем модальное окно результата
            window.showGenerationResultModal(item);
            console.log('🎯 Opened generationResultModal for generation result');
        } else {
            console.error('❌ showGenerationResultModal function not available');
            // Fallback - показываем тост об ошибке
            this.showResultToast(result);
        }
    }

    // Тост-уведомление с результатом
    static showResultToast(result) {
        // Создаем уникальный ID для тоста
        const toastId = `result-toast-${Date.now()}`;
        const generation = window.appState.currentGeneration;

        // Создаем элемент тоста
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = 'result-toast';

        // Получаем данные для отображения
        const style = (generation.style || 'unknown');
        const mode = (generation.mode || 'unknown');

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
            this.displayFullResult(result);
            this.removeResultToast(toast);
        });

        // Обработчик клика по закрытию тоста
        toast.querySelector('.toast-close-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeResultToast(toast);
        });

        // Обработчик клика по всему тосту (кроме кнопок)
        toast.addEventListener('click', () => {
            this.displayFullResult(result);
            this.removeResultToast(toast);
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
            this.removeResultToast(toast);
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

    // Удаление тоста
    static removeResultToast(toast) {
        if (!toast) return;

        toast.style.opacity = '0';
        toast.style.transform = 'translateY(100px)';

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    // 🔥 НОВЫЕ ФУНКЦИИ ДЛЯ ОБРАБОТКИ ОШИБОК ГЕНЕРАЦИИ =====

    // Обработка ошибок генерации - удаление превью если вебхук вернул ошибку
    static handleGenerationError(generationId, error) {
        console.log(`❌ Handling generation error for ID: ${generationId}`);

        // Ищем превью элемент
        const previewItem = document.getElementById(`loading-${generationId}`) || document.getElementById(`history-${generationId}`);
        if (previewItem) {
            // Анимируем исчезновение и удаляем
            previewItem.style.transition = 'all 0.3s ease-out';
            previewItem.style.opacity = '0';
            previewItem.style.transform = 'translateY(-20px)';

            setTimeout(() => {
                if (previewItem.parentNode) {
                    previewItem.parentNode.removeChild(previewItem);
                    console.log(`🗑️ Removed failed preview for generation ${generationId}`);
                }
            }, 300);
        }

        // Ищем объект генерации в истории и удаляем
        if (window.appState && window.appState.generationHistory) {
            const generationIndex = window.appState.generationHistory.findIndex(g => g.id == generationId);
            if (generationIndex !== -1) {
                window.appState.generationHistory.splice(generationIndex, 1);
                window.appState.saveHistory();
                console.log(`📋 Removed generation ${generationId} from history due to error`);
            }
        }

        // Показываем ошибку пользователю
        if (error && error.message) {
            showToast('error', `Generation failed: ${error.message}`);
        } else {
            showToast('error', 'Generation failed. Please try again.');
        }
    }

    // Обработка "accepted" ответа от вебхука - конвертируем в ошибку
    // Если вебхук вернул "accepted" - это означает перегрузку сервера
    static handleWebhookAcceptedResponse(generationId) {
        console.warn(`🚨 Webhook returned "accepted" for generation ${generationId} - server overloaded`);

        // Удаляем превью так как генерация не удалась
        const error = new Error('Server overloaded. Please try again later.');
        this.handleGenerationError(generationId, error);
    }
}

// Реализация глобальной функции showToast
function showToast(type, message) {
    // Создаем элемент тоста
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} show`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="toast-progress"></div>
    `;

    // Добавляем в контейнер тостов
    const container = document.getElementById('toastContainer');
    if (container) {
        container.appendChild(toast);
    } else {
        document.body.appendChild(toast);
    }

    // Автоматически удаляем через 5 секунд
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }, 5000);

    console.log(`🔔 Toast shown: ${type} - ${message}`);
}

// Задаем глобальную функцию showToast
window.showToast = showToast;

// Легаси функции для совместимости
function showScreen(screenId) { return ScreenManager.show(screenId); }
function getCurrentScreen() { return ScreenManager.getCurrent(); }
function showProcessing() { return ScreenManager.showProcessing(); }
function showApp() { return ScreenManager.showApp(); }
function showResult(result) { return ScreenManager.showResult(result); }
function showAuth() { return ScreenManager.showAuth(); }
function displayFullResult(result) { return ScreenManager.displayFullResult(result); }
function showResultToast(result) { return ScreenManager.showResultToast(result); }
function removeResultToast(toast) { return ScreenManager.removeResultToast(toast); }

// Экспортируем класс и функции
export { ScreenManager };
export { showScreen, getCurrentScreen, showProcessing, showApp, showResult, showAuth, displayFullResult, showResultToast, removeResultToast };

console.log('✅ showToast function registered globally');
