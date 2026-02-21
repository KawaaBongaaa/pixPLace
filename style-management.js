// ===== STYLE MANAGEMENT MODULE =====
// Manages style dropdown - style-manager.js loaded statically
// pixPLace Project

/**
 * DIRECT ACCESS TO STYLE MANAGER
 * style-manager.js now loaded statically, no lazy loading needed
 */
function getStyleManager() {
    if (window.styleManager) {
        return window.styleManager;
    } else {
        console.warn('❌ Style manager not loaded yet');
        return null;
    }
}

/**
 * Функция обновления видимости стиля для текущего режима
 */
export function updateStyleVisibilityForMode(mode) {
    const chooseStyleSection = document.getElementById('chooseStyleSection');
    if (!chooseStyleSection) return;

    // Логика: Скрываем кнопку стиля в режимах background_removal и upscale_image
    const stylesNotNeeded = ['background_removal', 'upscale_image'];
    const shouldShowStyle = !stylesNotNeeded.includes(mode);

    if (shouldShowStyle) {
        chooseStyleSection.style.display = 'block';
        chooseStyleSection.classList.remove('hidden');
    } else {
        chooseStyleSection.style.setProperty('display', 'none', 'important');
        chooseStyleSection.classList.add('hidden');

        // 🔥 Автоматический сброс выбранного стиля для режимов без поддержки стилей
        unselectAllStyles();
    }
}

/**
 * Обрабатывает клик на кнопке стиля (с lazy loading CSS при первом клике)
 */
export async function handleStyleCheckboxChange() {
    const styleManager = getStyleManager();

    if (styleManager) {
        // 🔥 LAZY INIT: При первом клике загружаем CSS и инициализируем dropdown
        if (styleManager.initStyleDropdown && !styleManager.isInitialized) {
            try {
                await styleManager.initStyleDropdown();
            } catch (error) {
                // НЕ ВОЗВРАЩАЕМСЯ - продолжаем toggle даже при ошибке CSS загрузки
            }
        }

        // Теперь toggling работает независимо от загрузки CSS
        if (styleManager.toggleStyleDropdown) {
            styleManager.toggleStyleDropdown();
        }
    } else {
        // Fallback - try legacy method
        if (typeof toggleStyleDropdown === 'function') {
            toggleStyleDropdown();
        }
    }

    // Обновляем стоимость если есть функция
    if (window.updateCostBadge) {
        window.updateCostBadge();
    }
}

/**
 * Снимает выделение со всех стилей и очищает состояние
 */
export function unselectAllStyles() {
    const activeCards = document.querySelectorAll('.carousel-2d-item.active');
    activeCards.forEach(card => card.classList.remove('active'));

    // Очищаем переменную selectedStyle если она существует глобально
    if (typeof window.selectedStyle !== 'undefined') {
        window.selectedStyle = '';
    }

    // Очищаем в appState если доступно
    if (window.appState && window.appState.selectedStyle) {
        window.appState.selectedStyle = '';
    }
}

/**
 * Инициализирует обработчик чекбокса стилей
 */
export function initStyleCheckboxHandler() {
    const styleCheckbox = document.getElementById('styleCheckbox');

    if (styleCheckbox) {
        styleCheckbox.addEventListener('change', handleStyleCheckboxChange);
    } else {
        console.warn('❌ styleCheckbox не найден при инициализации');
        // Добавим небольшую задержку для поиска
        setTimeout(() => {
            initStyleCheckboxHandler();
        }, 500);
    }
}

// FALLBACK: Legacy function support for HTML onclick attributes
// This allows old HTML code to work without breaking
function toggleStyleDropdown() {
    // Direct access to style manager (loaded statically)
    const styleManager = getStyleManager();
    if (styleManager && styleManager.toggleStyleDropdown) {
        styleManager.toggleStyleDropdown();
    }
}

function selectStyleCard(styleName) {
    // Direct access to style manager (loaded statically)
    const styleManager = getStyleManager();
    if (styleManager && styleManager.selectStyleCard) {
        styleManager.selectStyleCard(styleName);
    }
}

// Экспортируем функции для глобального доступа (modular + legacy support)
window.handleStyleCheckboxChange = handleStyleCheckboxChange;
window.unselectAllStyles = unselectAllStyles;
window.updateStyleVisibilityForMode = updateStyleVisibilityForMode; // ДОБАВЛЕНО: Для интеграции с mode-cards.js
window.toggleStyleDropdown = toggleStyleDropdown; // LEGACY SUPPORT
window.selectStyleCard = selectStyleCard; // LEGACY SUPPORT
