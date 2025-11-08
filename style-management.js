// ===== STYLE MANAGEMENT MODULE =====
// Lazy loads style-manager.js when user interacts with style checkbox
// pixPLace Project

/**
 * LAZY LOAD FOR STYLE MANAGER
 * Инициализирует style-manager только при первой активации чекбокса
 */
async function lazyLoadStyleManager() {
    try {
        console.log('🎨 [LAZY LOAD] Loading style-manager module...');
        const { initStyleDropdown } = await import('./style-manager.js');
        await initStyleDropdown();
        console.log('✅ [LAZY LOAD] Style manager loaded and initialized');
        return true;
    } catch (error) {
        console.error('❌ [LAZY LOAD] Failed to load style manager:', error);
        return false;
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
        console.log(`🎨 Style section VISIBLE for mode: ${mode}`);
    } else {
        chooseStyleSection.style.setProperty('display', 'none', 'important');
        chooseStyleSection.classList.add('hidden');
        console.log(`🚫 Style section HIDDEN for mode: ${mode} (styles not applicable)`);

        // 🔥 Автоматический сброс выбранного стиля для режимов без поддержки стилей
        unselectAllStyles();
        console.log(`🎨 Selected style cleared for mode: ${mode}`);
    }
}

/**
 * Обрабатывает клик на кнопке стиля (с lazy loading)
 */
export function handleStyleCheckboxChange() {
    const chooseStyleSection = document.getElementById('chooseStyleSection');
    if (chooseStyleSection) {
        chooseStyleSection.classList.add('style-loading'); // Добавляем loading состояние
    }

    lazyLoadStyleManager().then(success => {
        if (chooseStyleSection) {
            chooseStyleSection.classList.remove('style-loading'); // Убираем loading состояние
        }

        if (success) {
            // Теперь можем использовать функции из style-manager
            if (window.styleManager && window.styleManager.toggleStyleDropdown) {
                window.styleManager.toggleStyleDropdown();
            }
        } else {
            console.warn('🚫 Could not load style dropdown');
        }
    }).catch(() => {
        if (chooseStyleSection) {
            chooseStyleSection.classList.remove('style-loading'); // Убираем loading состояние при ошибке
        }
    });

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
    console.log('✅ All style selections cleared');

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
    console.log('🔍 Looking for styleCheckbox:', styleCheckbox);

    // Временная отладка - найдём все чекбоксы на странице
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    console.log('🔍 Found all checkboxes on page:', allCheckboxes.length, Array.from(allCheckboxes).map(cb => ({ id: cb.id, name: cb.name, checked: cb.checked })));

    // Найдем контейнер чекбокса стиля
    const checkboxContainer = document.querySelector('.style-checkbox-container');
    console.log('🔍 Style checkbox container found:', checkboxContainer);
    if (checkboxContainer) {
        console.log('🔍 Container HTML:', checkboxContainer.innerHTML.slice(0, 200) + '...');
    }

    if (styleCheckbox) {
        styleCheckbox.addEventListener('change', handleStyleCheckboxChange);
        console.log('✅ Style checkbox handler initialized');

        // ❌ УБРАЛИ скрытие styleGrid - теперь видимость контролируется через #styleDropdown.show
        console.log('📝 Style dropdown controlled by .show class only');
    } else {
        console.warn('❌ styleCheckbox не найден при инициализации. Элементы DOM:', document.querySelectorAll('[id]').length);
        // Добавим небольшую задержку для поиска
        setTimeout(() => {
            console.log('⏰ Повторный поиск styleCheckbox...');
            initStyleCheckboxHandler();
        }, 500);
    }
}

// FALLBACK: Legacy function support for HTML onclick attributes
// This allows old HTML code to work without breaking
function toggleStyleDropdown() {
    console.log('🎨 [LEGACY] toggleStyleDropdown called - redirecting to modern implementation');

    // If style-manager is loaded, delegate to it
    if (window.styleManager && window.styleManager.toggleStyleDropdown) {
        window.styleManager.toggleStyleDropdown();
    } else {
        // Otherwise, trigger lazy load and show dropdown
        lazyLoadStyleManager().then(success => {
            if (success && window.styleManager) {
                window.styleManager.toggleStyleDropdown();
            }
        }).catch(() => {
            console.error('❌ Cannot load style dropdown for legacy call');
        });
    }
}

function selectStyleCard(styleName) {
    console.log('🎨 [LEGACY] selectStyleCard called - redirecting to modern implementation:', styleName);

    // If style-manager is loaded, delegate to it
    if (window.styleManager && window.styleManager.selectStyleCard) {
        window.styleManager.selectStyleCard(styleName);
    } else {
        // Otherwise, simulate the loading
        console.error('❌ Style manager not loaded yet, cannot select style');
    }
}

// Экспортируем функции для глобального доступа (modular + legacy support)
window.handleStyleCheckboxChange = handleStyleCheckboxChange;
window.unselectAllStyles = unselectAllStyles;
window.updateStyleVisibilityForMode = updateStyleVisibilityForMode; // ДОБАВЛЕНО: Для интеграции с mode-cards.js
window.toggleStyleDropdown = toggleStyleDropdown; // LEGACY SUPPORT
window.selectStyleCard = selectStyleCard; // LEGACY SUPPORT
