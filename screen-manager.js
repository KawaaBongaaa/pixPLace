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

    // 🔥 НОВАЯ ФУНКЦИЯ: Динамическая загрузка экрана авторизации
    static async loadAuthScreen() {
        console.log('🔄 Loading auth screen dynamically...');

        // Проверяем, не загружен ли уже экран авторизации
        if (document.getElementById('authScreen')) {
            console.log('✅ Auth screen already loaded, showing it');
            return this.showAuth();
        }

        try {
            // Загружаем HTML файл с экраном авторизации
            const response = await fetch('auth-modal.html');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const htmlContent = await response.text();
            console.log('📄 Auth modal HTML loaded successfully');

            // Вставляем HTML в main контейнер
            const main = document.querySelector('main');
            if (!main) {
                throw new Error('Main container not found');
            }

            main.insertAdjacentHTML('afterbegin', htmlContent);
            console.log('✅ Auth screen HTML inserted into DOM');

            // Показываем экран авторизации
            this.showAuth();

        } catch (error) {
            console.error('❌ Failed to load auth screen:', error);
            showToast('error', 'Failed to load authentication screen');
        }
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

    // 🔥 НОВАЯ ФУНКЦИЯ: Удаление экрана авторизации после успешной аутентификации
    static removeAuthScreen() {
        const authScreen = document.getElementById('authScreen');
        if (authScreen) {
            authScreen.remove();
            console.log('🗑️ Auth screen removed from DOM');
        }
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

        // 🔥 ИСПОЛЬЗУЕМ ГЛОБАЛЬНУЮ ФУНКЦИЮ С LAZY LOADING
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

        // Глобальная функция сама управляет lazy loading
        window.showGenerationResultModal(item);
        console.log('🎯 Opened generationResultModal for generation result (lazy-loaded via global function)');
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

        // 🔥 МИГРАЦИЯ: Применяем Tailwind классы вместо inline стилей
        toast.classList.add(
            'fixed', 'bottom-5', 'right-5', 'w-70',
            'bg-white', 'dark:bg-gray-800',
            'border', 'border-gray-200', 'dark:border-gray-600',
            'rounded-xl', 'shadow-2xl', 'z-10000',
            'opacity-0', 'translate-y-28',
            'transition-all', 'duration-300', 'ease-out',
            'cursor-default', 'overflow-hidden'
        );

        // Получаем данные для отображения
        const style = (generation?.style || generation?.data?.style || 'unknown');
        const mode = (generation?.mode || generation?.data?.mode || 'unknown');

        // 🔥 ПЕРЕВОДИМ названия стиля и режима для корректного отображения в тосте
        const translatedStyle = style !== 'unknown' ? (window.appState?.translate?.(`style_${style}`) || style) : style;
        const translatedMode = mode !== 'unknown' ? (window.appState?.translate?.(`mode_${mode}`) || mode) : mode;

        toast.innerHTML = `
            <div class="flex p-0">
                <div class="w-20 h-20 flex-shrink-0">
                    <img src="${result.image_url}?t=${Date.now()}" alt="Generated image preview" loading="lazy" class="w-full h-full object-cover rounded-l-xl">
                </div>
                <div class="flex-1 p-3 flex flex-col justify-between">
                    <div class="flex flex-col gap-1 mb-2">
                        ${translatedStyle && translatedStyle !== 'unknown' ? `<span class="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">${translatedStyle}</span>` : ''}
                        ${translatedMode && translatedMode !== 'unknown' ? `<span class="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">${translatedMode}</span>` : ''}
                    </div>
                    <button class="toast-view-btn bg-green-500 hover:bg-green-600 text-white border-none rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all duration-200 self-start">${window.appState?.translate?.('toast_view_result') || 'View Result'}</button>
                    <button class="toast-close-btn absolute top-1.5 right-1.5 w-5 h-5 bg-black/10 hover:bg-red-100 dark:bg-white/10 dark:hover:bg-red-900/20 border-none rounded-full text-xs font-bold cursor-pointer flex items-center justify-center">×</button>
                </div>
            </div>
        `;

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

        // Анимируем появление через Tailwind классы
        requestAnimationFrame(() => {
            toast.classList.remove('opacity-0', 'translate-y-28');
            toast.classList.add('opacity-100', 'translate-y-0');
        });

        // Автоматически скрываем через 5 секунд
        setTimeout(() => {
            this.removeResultToast(toast);
        }, 5000);

        // 🔥 МИГРАЦИЯ: Удалены старые CSS стили - теперь все через Tailwind классы

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

    // 🔥 НОВОЕ: Применяем Tailwind shadow класс для toast'ов
    toast.classList.add('shadow-lg');

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
function loadAuthScreen() { return ScreenManager.loadAuthScreen(); }
function displayFullResult(result) { return ScreenManager.displayFullResult(result); }
function showResultToast(result) { return ScreenManager.showResultToast(result); }
function removeResultToast(toast) { return ScreenManager.removeResultToast(toast); }

// Экспортируем в глобальную область для доступа из HTML onclick
window.loadAuthScreen = loadAuthScreen;
window.ScreenManager = ScreenManager;

// Экспортируем класс и функции
export { ScreenManager };
export { showScreen, getCurrentScreen, showProcessing, showApp, showResult, showAuth, loadAuthScreen, displayFullResult, showResultToast, removeResultToast };

console.log('✅ showToast function registered globally');
