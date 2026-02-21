// ================================================
// 🎨 STYLE MANAGER MODULE
// Lazy loaded style dropdown management
// ================================================

// Global state for lazy loading
let isInitialized = false;
let isCssLoaded = false;

// Для обратной совместимости - global exports (создаем пустой объект сначала)
window.styleManager = {};

// Make isInitialized accessible through styleManager for external checks
Object.defineProperty(window.styleManager, 'isInitialized', {
    get: () => isInitialized,
    set: (value) => isInitialized = value
});

/**
 * LAZY LOAD CSS только при первом использовании
 */
async function loadStyleCss() {
    if (isCssLoaded) return;

    try {
        // Dynamic CSS import
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/style-card-grid.css';

        document.head.appendChild(link);

        return new Promise((resolve, reject) => {
            link.onload = () => {
                isCssLoaded = true;
                console.log('✅ Style dropdown CSS loaded lazily');
                resolve();
            };
            link.onerror = () => {
                console.error('❌ Failed to load style dropdown CSS');
                reject(new Error('CSS load failed'));
            };
        });
    } catch (error) {
        console.error('❌ CSS lazy load error:', error);
        throw error;
    }
}

/**
 * Переключение видимости dropdown стилей
 */
function toggleStyleDropdown() {
    const dropdown = document.getElementById('styleDropdown');
    const button = document.querySelector('.style-dropdown-button');

    if (!dropdown) {
        console.warn('⚠️ Style dropdown element not found');
        return;
    }

    // ✅ TOGGLE LOGIC: Проверяем текущее состояние и переключаем
    const isOpen = dropdown.classList.contains('show');

    if (isOpen) {
        dropdown.classList.remove('show');
        if (button) button.classList.remove('open');
        console.log('🎨 Style dropdown closed');
    } else {
        dropdown.classList.add('show');
        if (button) button.classList.add('open');
        console.log('🎨 Style dropdown opened');
        // Обновить индикатор выбранного стиля
        updateSelectedStyleIndicator();
    }
}

/**
 * Выбор стиля из dropdown - WITH TOGGLE LOGIC
 */
function selectStyleCard(styleName) {
    if (!styleName) return;

    // 💡 TOGGLE LOGIC: Получаем текущий выбранный стиль
    const currentSelectedStyle = window.appState?.selectedStyle?.toLowerCase() || '';
    const clickedStyle = styleName.toLowerCase();

    let finalStyle = '';

    // Если кликнули по той же карточке - снимаем выбор
    if (currentSelectedStyle === clickedStyle && currentSelectedStyle !== '') {
        finalStyle = ''; // Убираем выбор
        console.log('🎨 Style deselected:', styleName);
    } else {
        // Выбираем новый стиль
        finalStyle = clickedStyle;
        console.log('🎨 Style selected:', styleName);
    }

    // Обновить выбор в состоянии приложения
    if (window.appState) {
        window.appState.selectedStyle = finalStyle;

        // Dispatch event for other components to react
        document.dispatchEvent(new CustomEvent('style:changed', {
            detail: { style: finalStyle }
        }));
    }

    // Обновить визуальное состояние карточек
    updateSelectedStyleCards(finalStyle);

    // Обновить индикатор выбранного стиля
    updateSelectedStyleIndicator();

    // НЕ ЗАКРЫВАТЬ dropdown - он должен оставаться открытым по требованию пользователя
    // closeStyleDropdown(); // ЗАКОММЕНТИРОВАНО: dropdown закрывается только по кнопке "Choose a Style"

    // Trigger haptic feedback
    if (window.triggerHapticFeedback) {
        window.triggerHapticFeedback('light');
    }
    // Trigger haptic feedback
    if (window.triggerHapticFeedback) {
        window.triggerHapticFeedback('light');
    }
}

/**
 * Сброс выбора стиля
 */
function resetStyleSelection() {
    console.log('🎨 Style selection reset requested');

    // Update state
    if (window.appState) {
        window.appState.selectedStyle = '';

        // Dispatch event
        document.dispatchEvent(new CustomEvent('style:changed', {
            detail: { style: '' }
        }));
    }

    // Update UI
    updateSelectedStyleCards('');
    updateSelectedStyleIndicator();

    // Haptic
    if (window.triggerHapticFeedback) {
        window.triggerHapticFeedback('medium');
    }
}
function updateSelectedStyleCards(selectedStyle) {
    const styleCards = document.querySelectorAll('.carousel-2d-item');
    styleCards.forEach(card => {
        const cardStyle = (card.getAttribute('data-style') || '').toLowerCase();
        if (cardStyle === selectedStyle) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
}

/**
 * Обновить индикатор выбранного стиля рядом с чекбоксом
 */
function updateSelectedStyleIndicator() {
    const indicator = document.getElementById('selectedStyleIndicator');
    if (!indicator) return;

    const currentStyle = window.appState?.selectedStyle || '';

    if (currentStyle && currentStyle !== '') {
        // 🔥 БЕЗОПАСНЫЙ ВЫЗОВ: проверяем что translate существует и является функцией
        const translatedName = (typeof window.appState?.translate === 'function')
            ? window.appState.translate(`style_${currentStyle}`)
            : currentStyle;
        indicator.textContent = `: ${translatedName}`;
        indicator.classList.add('show');
        console.log('🎯 Selected style indicator updated:', translatedName);
    } else {
        indicator.textContent = '';
        indicator.classList.remove('show');
    }
}

/**
 * Закрыть dropdown стилей
 */
function closeStyleDropdown() {
    const dropdown = document.getElementById('styleDropdown');

    if (dropdown) {
        dropdown.classList.remove('show');
        console.log('🎨 Style dropdown closed');
    }
}

/**
 * Инициализация/обновление состояния стилей
 */
function updateStyleState() {
    const currentStyle = window.appState?.selectedStyle || '';
    console.log('🔄 Updating style state, current:', currentStyle);

    updateSelectedStyleCards(currentStyle);
    updateSelectedStyleIndicator();
}

/**
 * Cleanup - очистка памяти когда стили не используются
 */
function cleanup() {
    // Здесь можно добавить логику очистки если понадобится в будущем
    console.log('🧹 Style manager cleanup');
}

// ================================================
// 🎯 LAZY INITIALIZATION
// ================================================

/**
 * FIX CURSOR ISSUE - set pointer cursor explicitly before initialization
 */
function fixCursorBeforeInit() {
    const chooseStyleSection = document.getElementById('chooseStyleSection');
    if (chooseStyleSection) {
        // Force cursor to pointer for all interactive elements before init
        chooseStyleSection.style.setProperty('cursor', 'pointer', 'important');
        const dropdownButton = chooseStyleSection.querySelector('.style-dropdown-button');
        if (dropdownButton) {
            dropdownButton.style.setProperty('cursor', 'pointer', 'important');
        }
        console.log('🔧 Cursor fix applied before style init');
    }
}

/**
 * MAIN LAZY INIT FUNCTION - вызывается при первом клике на чекбокс
 */
async function initStyleDropdown() {
    if (isInitialized) return true; // ✅ Возвращаем true если уже инициализирован

    try {
        console.log('🎨 Lazy loading style dropdown module...');

        // 🔧 FIX CURSOR BEFORE CSS LOAD
        fixCursorBeforeInit();

        // ✅ ГАРАНТИРУЕМ ПОЛНУЮ ЗАГРУЗКУ CSS перед return
        await loadStyleCss();

        // 🔥 FIX: Force hide dropdown using only CSS classes (no inline styles)
        const dropdown = document.getElementById('styleDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
            console.log('🔒 Style dropdown forced to hidden state during init (CSS classes only)');
        }

        // MARK AS INITIALIZED
        isInitialized = true;

        // INITIAL STATE UPDATE
        updateStyleState();

        // LISTEN FOR STYLE CHANGES from external sources
        document.addEventListener('style:changed', (event) => {
            updateStyleState();
        });

        console.log('✅ Style dropdown module fully initialized - hidden by default');
        return true; // ✅ Возвращаем true для success проверки

    } catch (error) {
        console.error('❌ Style dropdown lazy init failed:', error);
        throw error;
    }
}

// ================================================
// 🌐 EXPORTS FOR GLOBAL ACCESS
// ================================================

// Export public API
window.toggleStyleDropdown = toggleStyleDropdown;
window.selectStyleCard = selectStyleCard;
window.resetStyleSelection = resetStyleSelection;

// Export main init function (used by lazy loader)
export { initStyleDropdown, toggleStyleDropdown, selectStyleCard, resetStyleSelection, updateStyleState, cleanup };

// Обновляем свойства window.styleManager (уже создан в начале файла)
window.styleManager.initStyleDropdown = initStyleDropdown;
window.styleManager.toggleStyleDropdown = toggleStyleDropdown;
window.styleManager.selectStyleCard = selectStyleCard;
window.styleManager.resetStyleSelection = resetStyleSelection;
window.styleManager.updateStyleState = updateStyleState;
