// ОТДЕЛЬНЫЙ МОДУЛЬ ДЛЯ УПРАВЛЕНИЕ КАРТОЧКАМИ РЕЖИМОВ
// (LAZY LOADING разделен по модулям для лучшей производительности)

let selectedMode = 'photo_session';
let currentExpandedCard = null;
let activeTooltip = null;
let tooltipShowTimer = null;
let tooltipHideTimer = null;

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
        setSelectedMode
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

    // Создаем карточки режимов с полными описаниями для tooltip
    const cardsHTML = `
        <div class="mode-cards-grid">
            <div class="mode-card" data-mode="photo_session" data-full-description="Perfect for photo editing. Upload an image and describe what to change - adjust lighting, composition, colors, or add creative elements. Supports various image formats with precise control over each modification.">
                <span class="mode-badge mode-badge--premium" data-i18n="badge_premium">Premium</span>
                <div class="mode-icon">🍌</div>
                <h4 class="mode-title">Nano Banana Editor</h4>
                <p class="mode-description">Perfect for photo editing. Upload an image and describe what to change</p>
            </div>

            <div class="mode-card" data-mode="dreamshaper_xl" data-full-description="Fast generation model designed as an all-in-one solution for photos, stylized art, anime, and manga. Optimized for quick results with high quality output across multiple styles and creative directions.">
                <span class="mode-badge mode-badge--free" data-i18n="badge_free">Free</span>
                <div class="mode-icon">⋆.˚🦋༘⋆</div>
                <h4 class="mode-title">DreamShaper XL</h4>
                <p class="mode-description">Fast generation model designed as an all-in-one for photos, stylized art, and anime/manga.</p>
            </div>
            <div class="mode-card" data-mode="fast_generation" data-full-description="The fastest mode for simple picture generation without requiring image upload. Perfect for quick concepts, ideas, or basic illustrations that don't need reference material.">
                <span class="mode-badge mode-badge--standard" data-i18n="badge_standard">Standard</span>
                <div class="mode-icon">⚡</div>
                <h4 class="mode-title">Flux Fast Generation</h4>
                <p class="mode-description">Fastest mode for simple pictures generation without image upload</p>
            </div>

            <div class="mode-card" data-mode="pixplace_pro" data-full-description="Advanced mode with comprehensive text support, logos, and complex multi-element compositions. Ideal for professional projects requiring precise placement, typography, and layered designs with multiple visual components.">
                <span class="mode-badge mode-badge--premium" data-i18n="badge_premium">Premium</span>
                <div class="mode-icon">𝓟𝓻𝓸</div>
                <h4 class="mode-title">Flux Pro Advanced</h4>
                <p class="mode-description">Advanced mode with text support, logos and complex compositions</p>
            </div>

            <div class="mode-card" data-mode="print_maker" data-full-description="Specialized for Print on Demand industry. Creates ready-made designs optimized for clothes, accessories, and merchandise. Automatically adapts to different print surfaces with proper color profiles and sizing.">
                <span class="mode-badge mode-badge--standard" data-i18n="badge_standard">Standard</span>
                <div class="mode-icon">👕</div>
                <h4 class="mode-title">Print on Demand</h4>
                <p class="mode-description">Specialized for Print on Demand. Creates ready-made prints for clothes and accessories</p>
            </div>

            <div class="mode-card" data-mode="background_removal" data-full-description="Advanced background removal that preserves objects with pixel-perfect accuracy. Uses AI to detect and isolate subjects while maintaining edge quality and transparency for professional results.">
                <span class="mode-badge mode-badge--free" data-i18n="badge_free">Free</span>
                <div class="mode-icon">✂</div>
                <h4 class="mode-title">Remove Background</h4>
                <p class="mode-description">Removes background from image while preserving the object</p>
            </div>

            <div class="mode-card" data-mode="upscale_image" data-full-description="Improves quality and resolution of existing images up to 4K using advanced AI algorithms. Enhances details, reduces noise, and restores clarity without losing original characteristics.">
                <span class="mode-badge mode-badge--premium" data-i18n="badge_premium">Premium</span>
                <div class="mode-icon">*ੈ✩‧₊˚</div>
                <h4 class="mode-title">Upscale Image</h4>
                <p class="mode-description">Improves quality and resolution of existing image up to 4K</p>
            </div>
        </div>
    `;

    modeCardsWrapper.innerHTML = cardsHTML;

    // Инициализируем обработчики карточек
    initModeCardListeners();

    // Инициализируем tooltip слушатели
    initTooltipListeners();

    // Устанавливаем начальный выбранный режим
    selectModeCard(selectedMode);

    console.log('✅ Mode cards HTML created and inserted to modeCardsWrapper');
    console.log('✅ Mode cards tooltips initialized');
}

// ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ ОБРАБОТЧИКОВ
function initModeCardListeners() {
    const modeCards = document.querySelectorAll('.mode-card');

    modeCards.forEach(card => {
        card.addEventListener('click', () => {
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

// ФУНКЦИЯ СОЗДАНИЯ TOOLTIP ЭЛЕМЕНТА
function createTooltipElement(text, targetRect) {
    // Удаляем существующий tooltip с анимацией
    if (activeTooltip) {
        activeTooltip.classList.remove('visible');
        setTimeout(() => {
            if (activeTooltip) {
                activeTooltip.remove();
                activeTooltip = null;
            }
        }, 200);
    }

    // Создаем новый tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'mode-tooltip';
    tooltip.textContent = text;
    tooltip.setAttribute('data-tooltip-id', 'mode-tooltip-' + Date.now());

    // Определяем позицию (предпочитаем сверху, иначе снизу)
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // Абсолютные координаты карточки относительно viewport
    const absTop = targetRect.top + scrollTop;
    const absLeft = targetRect.left + scrollLeft;
    const absBottom = absTop + targetRect.height;

    let top, left;
    const tooltipMaxHeight = 120; // Предполагаемая высота tooltip

    // Проверяем, есть ли место сверху
    if (targetRect.top - 10 >= tooltipMaxHeight) {
        // Размещаем сверху
        top = absTop - 10;
        tooltip.classList.add('position-top');
    } else {
        // Размещаем снизу
        top = absBottom + 10;
        tooltip.classList.add('position-bottom');
    }

    // Центрируем по горизонтали
    left = absLeft + (targetRect.width / 2) - 150;

    // Ограничиваем позицию в пределах экрана без учета скролла для viewport позиционирования
    const tooltipWidth = 300;
    left = Math.max(10, Math.min(left, viewportWidth - tooltipWidth - 10));

    // Устанавливаем позицию как fixed для корректной работы с мобильными устройствами
    tooltip.style.position = 'fixed';
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    tooltip.style.maxWidth = Math.min(300, viewportWidth - 20) + 'px';
    tooltip.style.zIndex = '10000';

    // Добавляем fade-in анимацию после установки позиции
    requestAnimationFrame(() => {
        document.body.appendChild(tooltip);
        activeTooltip = tooltip;
        requestAnimationFrame(() => tooltip.classList.add('visible'));
    });

    return tooltip;
}

// ФУНКЦИЯ ПОКАЗА TOOLTIP ПРИ HOVER
function showModeTooltip(card) {
    const fullDescription = card.dataset.fullDescription;
    if (!fullDescription) return;

    const cardRect = card.getBoundingClientRect();
    createTooltipElement(fullDescription, cardRect);

    // После показа tooltip, увеличиваем задержку скрытия для плавности
    if (activeTooltip) {
        activeTooltip.style.transitionDelay = '0ms';
    }
}

// ФУНКЦИЯ СКРЫТИЯ TOOLTIP
function hideModeTooltip() {
    if (activeTooltip) {
        activeTooltip.classList.remove('visible');
        setTimeout(() => {
            if (activeTooltip) {
                activeTooltip.remove();
                activeTooltip = null;
            }
        }, 200);
    }
}

// ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ TOOLTIP ОБРАБОТЧИКОВ
function initTooltipListeners() {
    const modeCards = document.querySelectorAll('.mode-card');

    modeCards.forEach(card => {
        let touchTimer;
        let touchStartX = 0;
        let touchStartY = 0;
        let isLongPress = false;
        let showTimer;
        let hideTimer;

        // Hover события для desktop
        card.addEventListener('mouseenter', () => {
            if (!('ontouchstart' in window) || !isLongPress) {
                clearTimeout(showTimer);
                clearTimeout(hideTimer);

                // Маленькая задержка перед показом
                showTimer = setTimeout(() => {
                    showModeTooltip(card);
                }, 200);
            }
        });

        card.addEventListener('mouseleave', () => {
            if (!isLongPress) {
                clearTimeout(showTimer);
                clearTimeout(hideTimer);

                // Задержка больше задержки показа для плавных переходов
                hideTimer = setTimeout(() => {
                    // Проверяем что мышь не на какой-то другой карте
                    const anyCardHovered = Array.from(modeCards).some(c => c.matches(':hover'));
                    if (!anyCardHovered) {
                        hideModeTooltip();
                    }
                }, 300);
            }
        });

        // Touch события для мобильных устройств
        card.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isLongPress = false;

            clearTimeout(touchTimer);
            clearTimeout(showTimer);
            clearTimeout(hideTimer);

            touchTimer = setTimeout(() => {
                isLongPress = true;
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
                showModeTooltip(card);
            }, 800);
        });

        card.addEventListener('touchend', () => {
            clearTimeout(touchTimer);

            if (isLongPress) {
                setTimeout(() => {
                    hideModeTooltip();
                    isLongPress = false;
                }, 200);
            }
        });

        card.addEventListener('touchmove', (e) => {
            if (!touchTimer) return;

            const touch = e.touches[0];
            const deltaX = Math.abs(touch.clientX - touchStartX);
            const deltaY = Math.abs(touch.clientY - touchStartY);

            if (deltaX > 10 || deltaY > 10) {
                clearTimeout(touchTimer);
                clearTimeout(showTimer);
                clearTimeout(hideTimer);
                touchTimer = null;
                hideModeTooltip();
            }
        });

        card.addEventListener('click', () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
            clearTimeout(touchTimer);
            hideModeTooltip();
        });
    });

    // Глобальные обработчики для скрытия tooltip
    document.addEventListener('scroll', () => {
        clearTimeout(tooltipShowTimer);
        clearTimeout(tooltipHideTimer);
        hideModeTooltip();
    }, { passive: true });

    document.addEventListener('resize', () => {
        hideModeTooltip();
    });

    document.addEventListener('orientationchange', () => {
        hideModeTooltip();
    });

    if ('ontouchstart' in window) {
        document.addEventListener('touchstart', (e) => {
            const target = e.target;
            if (!target.closest('.mode-card') && !target.closest('.mode-tooltip')) {
                clearTimeout(tooltipShowTimer);
                clearTimeout(tooltipHideTimer);
                hideModeTooltip();
            }
        }, { passive: true });
    }
}
