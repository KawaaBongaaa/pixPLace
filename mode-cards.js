// ОТДЕЛЬНЫЙ МОДУЛЬ ДЛЯ УПРАВЛЕНИЕ КАРТОЧКАМИ РЕЖИМОВ
// (LAZY LOADING разделен по модулям для лучшей производительности)

let selectedMode = 'nano_banana';
let currentExpandedCard = null;
let tooltipElement = null;
let globalTooltipShowTimer = null;
let globalTooltipHideTimer = null;

// ЭКСПОРТИРУЕМ ФУНКЦИЮ ДЛЯ ПОЛУЧЕНИЯ ВЫБРАННОГО РЕЖИМА
export function getSelectedMode() {
    return selectedMode;
}

// ЭКСПОРТИРУЕМ ФУНКЦИЮ ИНИЦИАЛИЗАЦИИ ОТЛОЖЕННОЙЗАГРУЗКИ
export async function initOnDemand() {
    await initializeModeCardsLazy();

    // Синхронизируем с appState если он загружен
    if (window.appState && window.appState.selectedMode) {
        selectedMode = window.appState.selectedMode;
    }

    // 🔥 ДОБАВЛЕНО: Экспортируем функции в глобальную область для доступа из других модулей
    window.modeCardsExports = {
        getSelectedMode,
        initOnDemand,
        setSelectedMode,
        selectModeByName: setSelectedMode // Алиас для совместимости с user-account.js
    };

    console.log('✅ Mode cards initialized successfully with selected mode:', selectedMode);
    console.log('✅ Mode cards exports attached to window.modeCardsExports');
}

// ВНУТРЕННЯЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ
async function initializeModeCardsLazy() {
    const modeCardsWrapper = document.getElementById('modeCardsWrapper');
    if (!modeCardsWrapper) {
        console.warn('Mode cards wrapper container not found');
        return;
    }



    //  СОЗДАЕМ ЕДИНЫЙ TOOLTIP ELEMENT (ДО СЛУШАТЕЛЕЙ!)
    initTooltipElement();

    // Инициализируем обработчики карточек
    initModeCardListeners();

    // Инициализируем tooltip слушатели
    initTooltipListeners();

    // Устанавливаем начальный выбранный режим
    selectModeCard(selectedMode);

    // 🔥 ОБНОВЛЯЕМ ПЕРЕВОДЫ ДЛЯ НОВЫХ ЭЛЕМЕНТОВ
    if (window.dictionaryManager && window.dictionaryManager.updateTranslations) {
        window.dictionaryManager.updateTranslations();
    }

    console.log('✅ Mode cards HTML created and inserted to modeCardsWrapper');
    console.log('✅ Mode cards translations applied');
    console.log('✅ Mode cards tooltips initialized');
}

// ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ ОБРАБОТЧИКОВ - FIXED FOR iPAD TOUCH ISSUES
function initModeCardListeners() {
    const modeCards = document.querySelectorAll('.mode-card');
    let touchTimeout;

    modeCards.forEach(card => {
        // 👆 Используем touchend вместо click для предотвращения двойных тапов на iPad
        card.addEventListener('touchend', (e) => {
            e.preventDefault(); // Предотвращаем ghost click после touch
            clearTimeout(touchTimeout);

            touchTimeout = setTimeout(() => {
                const mode = card.dataset.mode;
                selectModeCard(mode);
            }, 10); // Небольшая задержка для предотвращения двойных тапов
        }, { passive: false });

        // 💻 Fallback для desktop (без touch)
        card.addEventListener('click', (e) => {
            if ('ontouchstart' in window) return; // Skip click если есть touch support

            e.preventDefault();
            const mode = card.dataset.mode;
            selectModeCard(mode);
        });
    });
}

// ФУНКЦИЯ ВЫБОРА КАРТОЧКИ РЕЖИМА
async function selectModeCard(modeValue) {
    selectedMode = modeValue;

    // 🔥 ВСЕГДА ОБНОВЛЯЕМ UI ЭЛЕМЕНТЫ ДЛЯ СИНХРОНИЗАЦИИ
    // Обновляем UI карточек
    const allCards = document.querySelectorAll('.mode-card');
    allCards.forEach(card => card.classList.remove('selected'));
    const selectedCard = document.querySelector(`.mode-card[data-mode="${modeValue}"]`);
    if (selectedCard) {
        currentExpandedCard = selectedCard;
        selectedCard.classList.add('selected');
    }

    // Синхронизируем с hidden select для совместимости
    const modeSelect = document.getElementById('modeSelect');
    if (modeSelect) {
        modeSelect.value = modeValue;
    }

    // Синхронизируем с appState если доступен
    if (window.appState) {
        window.appState.selectedMode = modeValue;
    }

    // 🔥 ДОБАВЛЕНО: Принудительное обновление UI элементов для режима
    if (window.updateSizeSelectVisibility) {
        await window.updateSizeSelectVisibility();
    }
    if (window.updateImageUploadVisibility) {
        window.updateImageUploadVisibility();
    }
    if (window.updatePromptVisibility) {
        await window.updatePromptVisibility();
    }

    // 🔥 ДОБАВЛЕНО: Обновление видимости кнопки стиля для текущего режима
    if (window.updateStyleVisibilityForMode) {
        window.updateStyleVisibilityForMode(modeValue);
    }

    // 🔥 ДОБАВЛЕНО: Обновление описания режима
    updateModeDescription(modeValue);

    // Диспатчим событие изменения режима
    document.dispatchEvent(new CustomEvent('mode:changed', {
        detail: { mode: modeValue }
    }));

    console.log(`🎛️ Mode changed to: ${modeValue}`);
}

// ФУНКЦИЯ ОБНОВЛЕНИЯ UI ДЛЯ ВЫБРАННОГО РЕЖИМА
async function updateUIForSelectedMode(mode) {
    // Импортируем функции из app_modern.js если они экспортированы
    if (window.updateImageUploadVisibility) {
        window.updateImageUploadVisibility();
    }

    if (window.updatePromptVisibility) {
        await window.updatePromptVisibility();
    }

    if (window.updateSizeSelectVisibility) {
        await window.updateSizeSelectVisibility();
    }

    // Диспатчим событие изменения режима
    document.dispatchEvent(new CustomEvent('mode:changed', {
        detail: { mode: mode }
    }));
}

// ФУНКЦИЯ ПРОГРАММНОГО ВЫБОРА РЕЖИМА (для внешнего использования)
export function setSelectedMode(mode) {
    selectModeCard(mode);
}

// ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ ЕДИНОГО TOOLTIP ЭЛЕМЕНТА
function initTooltipElement() {
    if (tooltipElement) return; // Уже инициализирован

    tooltipElement = document.createElement('div');
    tooltipElement.className = 'mode-tooltip';
    tooltipElement.style.position = 'fixed';
    tooltipElement.style.zIndex = '10000';
    tooltipElement.style.opacity = '0';
    tooltipElement.style.pointerEvents = 'none';
    document.body.appendChild(tooltipElement);

    console.log('✅ Single tooltip element created');
}

// ФУНКЦИЯ ОБНОВЛЕНИЯ ПОЗИЦИИ И СОДЕРЖИМОГО TOOLTIP
function updateTooltipPosition(text, targetRect) {
    if (!tooltipElement) return;

    // Обновляем текст
    tooltipElement.textContent = text;

    // Определяем позицию (предпочитаем сверху, иначе снизу)
    const viewportWidth = window.innerWidth;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // Абсолютные координаты карточки относительно viewport
    const absTop = targetRect.top + scrollTop;
    const absLeft = targetRect.left + scrollLeft;
    const absBottom = absTop + targetRect.height;

    let top, left;
    const tooltipMaxHeight = 120; // Предполагаемая высота tooltip

    // Сбрасываем позиционные классы
    tooltipElement.classList.remove('position-top', 'position-bottom');

    // Проверяем, есть ли место сверху
    if (targetRect.top - 10 >= tooltipMaxHeight) {
        // Размещаем сверху
        top = absTop - 10;
        tooltipElement.classList.add('position-top');
    } else {
        // Размещаем снизу
        top = absBottom + 10;
        tooltipElement.classList.add('position-bottom');
    }

    // Центрируем по горизонтали
    left = absLeft + (targetRect.width / 2) - 150;

    // Ограничиваем позицию в пределах экрана без учета скролла для viewport позиционирования
    const tooltipWidth = 300;
    left = Math.max(10, Math.min(left, viewportWidth - tooltipWidth - 10));

    // Устанавливаем позицию и размеры
    tooltipElement.style.top = top + 'px';
    tooltipElement.style.left = left + 'px';
    tooltipElement.style.maxWidth = Math.min(300, viewportWidth - 20) + 'px';

    // Показываем просто и напрямую без переходов
    tooltipElement.classList.add('visible');
    tooltipElement.style.opacity = '1';
    tooltipElement.style.visibility = 'visible';
    tooltipElement.style.pointerEvents = 'none';
}

// ФУНКЦИЯ ПОКАЗА TOOLTIP ПРИ HOVER - ПОЛНАЯ ИНФОРМАЦИЯ О РЕЖИМЕ
function showModeTooltip(card) {
    const mode = card.dataset.mode;
    // Получаем полное описание режима из переводов через dictionaryManager
    const fullDescription = window.dictionaryManager ?
        window.dictionaryManager.translate(`mode_${mode}_desc`) : '';

    if (!fullDescription || !tooltipElement) return;

    const cardRect = card.getBoundingClientRect();
    updateTooltipPosition(fullDescription, cardRect);
}

// ФУНКЦИЯ СКРЫТИЯ TOOLTIP
function hideModeTooltip() {
    if (!tooltipElement) return;

    tooltipElement.classList.remove('visible');
    tooltipElement.style.opacity = '0';
    tooltipElement.style.visibility = 'hidden';
}

// ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ TOOLTIP ОБРАБОТЧИКОВ - УЛУЧШЕННАЯ ВЕРСИЯ
function initTooltipListeners() {
    const modeCards = document.querySelectorAll('.mode-card');
    let currentHoveredCard = null;

    function clearAllTimers() {
        clearTimeout(globalTooltipShowTimer);
        clearTimeout(globalTooltipHideTimer);
        globalTooltipShowTimer = null;
        globalTooltipHideTimer = null;
    }

    function hideTooltipInstantly() {
        hideModeTooltip();
        currentHoveredCard = null;
    }

    function hideTooltipWithDelay(delay = 150) {  // Уменьшили задержку до 150ms
        clearTimeout(globalTooltipHideTimer);
        globalTooltipHideTimer = setTimeout(() => {
            hideModeTooltip();
            currentHoveredCard = null;
        }, delay);
    }

    // Показ индикатора на touch
    function showIndicatorOnTouch(card) {
        if (!card.classList.contains('active-touch')) {
            card.classList.add('active-touch');
            setTimeout(() => {
                card.classList.remove('active-touch');
            }, 3000);
        }
    }

    modeCards.forEach(card => {
        const indicator = card.querySelector('.mode-info-indicator');

        // Обработчики для индикатора
        if (indicator) {
            // Для desktop - hover на индикатор
            indicator.addEventListener('mouseenter', () => {
                clearAllTimers();
                currentHoveredCard = card;
                // Моментальное показывание на hover индикатора
                showModeTooltip(card);
            });

            indicator.addEventListener('mouseleave', () => {
                currentHoveredCard = null;
                hideTooltipWithDelay();
            });

            // Для мобильных - tap на индикатор
            indicator.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                clearAllTimers();
                currentHoveredCard = card;
                showModeTooltip(card);
                // Скрываем tooltip через 3 сек на мобильном
                setTimeout(() => {
                    hideTooltipInstantly();
                }, 3000);
            }, { passive: false });

            // Фallback для старых мобильных без touchstart
            indicator.addEventListener('click', (e) => {
                if ('ontouchstart' in window) return; // Skipесли есть touch support
                e.preventDefault();
                e.stopPropagation();
                clearAllTimers();
                currentHoveredCard = card;
                showModeTooltip(card);
                setTimeout(() => {
                    hideTooltipInstantly();
                }, 3000);
            });
        }

        // Показ индикатора при touchstart на карточке
        card.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('mode-info-indicator')) return;
            showIndicatorOnTouch(card);
        }, { passive: true });

        // Hover события для desktop (быстрее по сравнению с старой версией)
        card.addEventListener('mouseenter', () => {
            if (!('ontouchstart' in window)) {
                clearAllTimers();
                currentHoveredCard = card;

                // Быстрее показываем tooltip - 300ms вместо 1s
                globalTooltipShowTimer = setTimeout(() => {
                    if (currentHoveredCard === card) {
                        showModeTooltip(card);
                    }
                }, 300);
            }
        });

        card.addEventListener('mouseleave', () => {
            if (!('ontouchstart' in window)) {
                clearAllTimers();
                currentHoveredCard = null;
                hideTooltipInstantly();
            }
        });

        // Click на карточке скрывает tooltip
        card.addEventListener('click', () => {
            clearAllTimers();
            hideTooltipInstantly();
        });

        // Touchend на карточке для скрытия
        card.addEventListener('touchend', (e) => {
            if (!e.target.classList.contains('mode-info-indicator')) {
                clearAllTimers();
                hideTooltipInstantly();
            }
        }, { passive: true });
    });

    // Глобальные обработчики для мгновенного скрытия tooltip
    function setupGlobalHideHandlers() {
        // Scroll - мгновенное скрытие
        window.addEventListener('scroll', hideTooltipInstantly, { passive: true });
        document.addEventListener('scroll', hideTooltipInstantly, { passive: true });

        // Resize - мгновенное скрытие
        window.addEventListener('resize', hideTooltipInstantly);
        document.addEventListener('resize', hideTooltipInstantly);

        // Orientation change - мгновенное скрытие
        window.addEventListener('orientationchange', () => {
            setTimeout(hideTooltipInstantly, 100);
        });
        document.addEventListener('orientationchange', () => {
            setTimeout(hideTooltipInstantly, 100);
        });

        // Touch/click вне карточек - мгновенное скрытие
        document.addEventListener('touchstart', (e) => {
            if (!e.target.closest('.mode-card') && !e.target.closest('.mode-tooltip')) {
                clearAllTimers();
                hideTooltipInstantly();
            }
        }, { passive: true });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.mode-card') && !e.target.closest('.mode-tooltip')) {
                clearAllTimers();
                hideTooltipInstantly();
            }
        });
    }

    setupGlobalHideHandlers();
}

// ФУНКЦИЯ ОБНОВЛЕНИЯ ОПИСАНИЯ РЕЖИМА - НОВЫЙ БЛОК ОПИСАНИЯ МЕЖДУ РЕЖИМАМИ И ПРОМПТОМ
function updateModeDescription(mode) {
    const descriptionBlock = document.getElementById('modeDescriptionBlock');
    const descriptionText = document.getElementById('modeDescriptionText');

    if (!descriptionBlock || !descriptionText) {
        console.warn('Mode description elements not found');
        return;
    }

    // Получаем описание режима из системы переводов
    const description = window.dictionaryManager ?
        window.dictionaryManager.translate(`mode_${mode}_desc`) : '';

    if (description) {
        // Обновляем текст описания
        descriptionText.textContent = description;

        // Показываем блок с анимацией
        descriptionBlock.style.display = 'block';
        descriptionBlock.classList.add('visible');

        console.log(`📋 Mode description updated for: ${mode}`);
    } else {
        // Скрываем блок если нет описания
        descriptionBlock.style.display = 'none';
        descriptionBlock.classList.remove('visible');

        console.warn(`📋 No description found for mode: ${mode}`);
    }
}

// 🔥 ДОБАВЛЕНО: Инициализация начального описания при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем описание для начального режима
    setTimeout(() => {
        updateModeDescription(selectedMode);
    }, 100); // Небольшая задержка для гарантии загрузки DOM
});
