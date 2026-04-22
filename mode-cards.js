// УПРОЩЕННЫЙ МОДУЛЬ MODE CARDS - БАЗОВЫЕ ФУНКЦИИ ДЛЯ СОВМЕСТИМОСТИ
// Основная логика перенесена в navigation-manager.js

// РАЗДЕЛЬНЫЕ СОСТОЯНИЯ ДЛЯ РАЗНЫХ ТАБОВ
let selectedImageMode = 'z_image';
let selectedVideoMode = 'image_to_video';
let activeTab = 'image';

// ЭКСПОРТИРУЕМ ФУНКЦИЮ ДЛЯ ПОЛУЧЕНИЯ ВЫБРАННОГО РЕЖИМА
export function getSelectedMode() {
    // Приоритет: appState per-tab → локальная переменная
    const currentTab = window._currentGenerationTab || activeTab || 'image';
    if (window.appState?.getModeState) {
        const saved = window.appState.getModeState(currentTab);
        if (saved?.model) return saved.model;
    }
    return activeTab === 'video' ? selectedVideoMode : selectedImageMode;
}

// ЭКСПОРТИРУЕМ ФУНКЦИЮ ПРОГРАММНОГО ВЫБОРА РЕЖИМА
export function setSelectedMode(mode) {
    const isVideoMode = ['video_gen', 'image_to_video', 'video_edit', 'kling_video', 'hailuo_video', 'runway_gen3'].includes(mode);
    const isMusicMode = ['audio_from_text', 'audio_from_image'].includes(mode);

    // Определяем текущий таб — используем _currentGenerationTab как источник правды
    const currentTab = window._currentGenerationTab || activeTab || 'image';

    if (isVideoMode) {
        selectedVideoMode = mode;
        activeTab = 'video';
    } else if (isMusicMode) {
        // music/sound tab — не трогаем selectedImageMode
        activeTab = 'sound';
    } else {
        // image или edit — обновляем selectedImageMode только если мы на image табе
        // чтобы edit-таб не перезаписывал image-таб
        if (currentTab === 'image' || currentTab === 'video') {
            selectedImageMode = mode;
        }
        activeTab = currentTab;
    }

    // 🔥 КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: Сохраняем модель в appState per-tab bucket
    if (window.appState?.setModeState) {
        window.appState.setModeState(currentTab, { model: mode });
    }
    if (window.appState) {
        window.appState.selectedMode = mode;
    }

    console.log(`🎛️ setSelectedMode: ${mode} → tab bucket: "${currentTab}"`);
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
