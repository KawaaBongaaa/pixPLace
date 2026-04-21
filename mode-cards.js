// УПРОЩЕННЫЙ МОДУЛЬ MODE CARDS - БАЗОВЫЕ ФУНКЦИИ ДЛЯ СОВМЕСТИМОСТИ
// Основная логика перенесена в navigation-manager.js

// РАЗДЕЛЬНЫЕ СОСТОЯНИЯ ДЛЯ РАЗНЫХ ТАБОВ
let selectedImageMode = 'z_image';
let selectedVideoMode = 'image_to_video';
let activeTab = 'image';

// ЭКСПОРТИРУЕМ ФУНКЦИЮ ДЛЯ ПОЛУЧЕНИЯ ВЫБРАННОГО РЕЖИМА
export function getSelectedMode() {
    const mode = activeTab === 'video' ? selectedVideoMode : selectedImageMode;
    // Убрали спам в консоль
    // console.log('🎛️ getSelectedMode() called:', { ... });
    return mode;
}

// ЭКСПОРТИРУЕМ ФУНКЦИЮ ПРОГРАММНОГО ВЫБОРА РЕЖИМА
export function setSelectedMode(mode) {
    const isImageMode = ['nano_banana_pro', 'nano_banana', 'nano_banana_2', 'fast_generation', 'z_image', 'qwen_image', 'qwen_image_edit', 'pixplace_pro', 'dreamshaper_xl', 'background_removal', 'upscale_image', 'print_maker'].includes(mode);
    const isVideoMode = ['video_gen', 'image_to_video', 'video_edit'].includes(mode);

    if (isVideoMode) {
        selectedVideoMode = mode;
        activeTab = 'video';
    } else if (isImageMode) {
        selectedImageMode = mode;
        activeTab = 'image';
    }

    // Синхронизируем с appState если доступен
    if (window.appState) {
        window.appState.selectedMode = mode;
    }

    console.log(`🎛️ Mode set to: ${mode} (tab: ${activeTab})`);
}

// МИНИМАЛЬНЫЕ ЗАГЛУШКИ ДЛЯ СОВМЕСТИМОСТИ ИМПОРТА ИЗ navigation-manager.js

// ФУНКЦИЯ ВЫБОРА КАРТОЧКИ РЕЖИМА
export function selectModeCard(mode) {
    console.log(`🎛️ Mode card selected: ${mode}`);

    // Устанавливаем выбранный режим
    setSelectedMode(mode);

    // 🔥 FIX: Визуально выделяем выбранную карточку
    highlightSelectedCard(mode);

    // Sync the new model picker button label
    const pickerLabel = document.getElementById('modelPickerLabel');
    if (pickerLabel) {
        const item = document.querySelector(`.model-item[data-mode="${mode}"] .model-item-name`);
        pickerLabel.textContent = item ? item.textContent : mode.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
    // Also call the new global selectModelFromPicker if it exists (for icon update)
    const itemEl = document.querySelector(`.model-item[data-mode="${mode}"]`);
    if (itemEl && typeof window.selectModelFromPicker === 'function') {
        // Determine icon key from item class
        const iconEl = itemEl.querySelector('.model-item-icon');
        const iconKey = iconEl ? Array.from(iconEl.classList).find(c => c.startsWith('model-icon-'))?.replace('model-icon-', '') : 'other';
        const labelEl = itemEl.querySelector('.model-item-name');
        window.selectModelFromPicker(mode, labelEl?.textContent || mode, iconKey || 'other');
        return true;
    }

    // 🔥 FIX: Автоматическое сворачивание меню через централизованную функцию
    setTimeout(() => {
        // Close model dropdown
        const dd = document.getElementById('modelDropdown');
        if (dd) dd.classList.add('hidden');

        // 🔥 HIGHLIGHT: Pulse the model selection toggle instead of scrolling
        const modelToggle = document.getElementById('modelSelectToggle') || document.getElementById('chooseModelBtn');
        if (modelToggle) {
            modelToggle.style.transition = 'box-shadow 0.3s, transform 0.3s';
            modelToggle.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.5)';
            modelToggle.style.transform = 'scale(1.03)';
            setTimeout(() => {
                modelToggle.style.boxShadow = '';
                modelToggle.style.transform = '';
            }, 1200);
        }
    }, 200);


    // Диспатчим событие для обновления UI в navigation-manager.js и app_modern.js
    document.dispatchEvent(new CustomEvent('mode:changed', {
        detail: { mode: mode }
    }));

    return true;
}



// ЭКСПОРТИРУЕМ ФУНКЦИЮ ИНИЦИАЛИЗАЦИИ (МИНИМАЛЬНАЯ)
export async function initOnDemand() {
    // Экспортируем функции в глобальную область для совместимости
    window.modeCardsExports = {
        getSelectedMode,
        setSelectedMode,
        selectModeByName: setSelectedMode, // Алиас для совместимости
        selectModeCard,
        initOnDemand
    };

    // 🔥 FIX: Also expose directly on window so portal-loader.js can call window.selectModeCard
    window.selectModeCard = selectModeCard;
    window.getSelectedMode = getSelectedMode;

    console.log('✅ Mode Cards initialized with core functions only');
}

// 🔥 НОВАЯ ФУНКЦИЯ: Инициализация обработчиков кликов для карточек
function initCardClickHandlers() {
    console.log('🎯 Initializing card click handlers');

    // Находим все карточки с data-mode атрибутом
    const modeCards = document.querySelectorAll('[data-mode]');
    console.log(`📋 Found ${modeCards.length} mode cards`);

    modeCards.forEach(card => {
        // Добавляем обработчик клика
        card.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            const mode = card.getAttribute('data-mode');
            console.log(`🖱️ Card clicked: ${mode}`);

            // Выбираем режим
            selectModeCard(mode);

            // 🔥 ДОБАВЛЕНО: Визуально выделяем выбранную карточку
            highlightSelectedCard(mode);
        });

        console.log(`✅ Handler attached to card: ${card.getAttribute('data-mode')}`);
    });

    console.log('✅ All card click handlers initialized');
}

// 🔥 НОВАЯ ФУНКЦИЯ: Визуальное выделение выбранной карточки
function highlightSelectedCard(selectedMode) {
    // Убираем выделение со всех карточек
    document.querySelectorAll('[data-mode]').forEach(card => {
        card.classList.remove('selected');
    });

    // Выделяем выбранную карточку с помощью Tailwind класса
    const selectedCard = document.querySelector(`[data-mode="${selectedMode}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        console.log(`✅ Card highlighted with Tailwind: ${selectedMode}`);
    }
}

// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎛️ Mode Cards module loaded with compatibility functions');

    // 🔥 ДОБАВЛЕНО: Инициализируем обработчики кликов синхронно для максимальной скорости
    initCardClickHandlers();
    console.log('✅ Card click handlers initialized immediately');
});
