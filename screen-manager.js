// screen-manager.js - Управление экранами и навигацией приложения

class ScreenManager {
    static currentScreen = null;
    static pendingResults = []; // Ожидающие результаты для показа в тостах

    // Основная функция переключения экранов
    static show(screenId) {
        // Сначала ищем нужный экран
        const targetScreen = document.getElementById(screenId);
        if (!targetScreen) {
            console.error('Screen not found:', screenId);
            return;
        }

        // Скрываем все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('hidden'); // гарантированно прячем
        });

        // Показываем нужный
        targetScreen.classList.remove('hidden');
        targetScreen.classList.add('active');
        this.currentScreen = screenId;
    }

    // Получить текущий видимый экран
    static getCurrent() {
        const generationEl = document.getElementById('generationScreen');
        const processingEl = document.getElementById('processingScreen');
        const resultEl = document.getElementById('resultScreen');
        const historyEl = document.getElementById('historyScreen');

        const isVisible = el => {
            if (!el) return false;
            const cs = window.getComputedStyle(el);
            if (el.classList.contains('hidden')) return false;
            return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0';
        };

        if (isVisible(resultEl)) return 'result';
        if (isVisible(processingEl)) return 'processing';
        if (isVisible(historyEl)) return 'history';
        if (isVisible(generationEl)) return 'generation';
        return 'unknown';
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

    // Полный показ результата
    static displayFullResult(result) {
        // Переключаемся на экран результата
        this.show('resultScreen');
        showBackButton(true);

        // Update result display
        const resultImage = document.getElementById('resultImage');
        const resultPrompt = document.getElementById('resultPrompt');
        const resultStyle = document.getElementById('resultStyle');
        const resultMode = document.getElementById('resultMode');
        const resultTime = document.getElementById('resultTime');

        // Очистка src + timestamp для предотвращения кэширования
        if (resultImage) {
            resultImage.src = ''; // Сначала очищаем
            resultImage.src = result.image_url + '?t=' + Date.now(); // Добавляем timestamp для свежести
        }

        // Используем глобальную переменную appState, которая должна быть доступна
        if (resultPrompt) resultPrompt.textContent = window.appState.currentGeneration.prompt;
        if (resultStyle) resultStyle.textContent = window.appState.translate('style_' + window.appState.currentGeneration.style);
        if (resultMode) resultMode.textContent = window.appState.translate('mode_' + window.appState.currentGeneration.mode);

        // Обновлено: отображаем стоимость генерации вместо времени
        if (resultTime) {
            const cost = window.appState.currentGeneration.generation_cost;
            if (cost !== undefined && cost !== null && cost !== '' && !isNaN(parseFloat(cost))) {
                const numericCost = parseFloat(cost);
                const formattedCost = numericCost.toFixed(cost.includes('.') ? 1 : 0); // 1 знак для дробных, 0 для целых
                const currency = window.appState.currentGeneration.cost_currency || 'Cr';
                resultTime.textContent = `${formattedCost} ${currency.toUpperCase()}`;
                console.log('💰 Cost displayed:', formattedCost, currency);
            } else {
                console.log('⚠️ Cost not found, showing duration fallback');
                // Fallback если стоимость не пришла или равна 0/null
                const duration = Math.round((window.appState.currentGeneration.duration || 0) / 1000);
                resultTime.textContent = `${duration}s`;
            }
        }

        console.log('🎯 Результат показан:', this.getCurrent());
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
        const style = window.appState.translate('style_' + (generation.style || 'realistic'));
        const mode = window.appState.translate('mode_' + (generation.mode || 'flux_shnel'));

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
function displayFullResult(result) { return ScreenManager.displayFullResult(result); }
function showResultToast(result) { return ScreenManager.showResultToast(result); }
function removeResultToast(toast) { return ScreenManager.removeResultToast(toast); }

// Экспортируем класс и функции
export { ScreenManager };
export { showScreen, getCurrentScreen, showProcessing, showApp, showResult, displayFullResult, showResultToast, removeResultToast };

console.log('✅ showToast function registered globally');
