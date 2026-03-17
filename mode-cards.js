// УПРОЩЕННЫЙ МОДУЛЬ MODE CARDS - БАЗОВЫЕ ФУНКЦИИ ДЛЯ СОВМЕСТИМОСТИ
// Основная логика перенесена в navigation-manager.js

// РАЗДЕЛЬНЫЕ СОСТОЯНИЯ ДЛЯ РАЗНЫХ ТАБОВ
let selectedImageMode = 'nano_banana_pro';
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

    // 🔥 FIX: Обновляем текст на кнопке toggle через централизованную функцию если она есть
    if (window.updateToggleText) {
        window.updateToggleText();
    } else {
        const toggleText = document.getElementById('modeCardsToggleText');
        if (toggleText) {
            const card = document.querySelector(`[data-mode="${mode}"]`);
            const title = card ? card.querySelector('h4')?.textContent : null;
            toggleText.textContent = title || mode.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
    }

    // 🔥 FIX: Автоматическое сворачивание меню через централизованную функцию
    setTimeout(() => {
        if (window.setModeCardsCollapsed) {
            window.setModeCardsCollapsed(true);
            console.log('✅ Menu auto-collapsed via setModeCardsCollapsed');
        } else {
            // Fallback если функция не загружена
            const wrapper = document.getElementById('modeCardsWrapper');
            const toggle = document.getElementById('modeCardsToggle');
            if (wrapper && toggle) {
                wrapper.style.display = 'none'; // Важно: перебиваем inline style
                wrapper.classList.remove('expanded');
                wrapper.classList.add('collapsed');
                toggle.classList.remove('expanded');
                toggle.classList.add('collapsed');
            }
        }

        // 🔥 ДОБАВЛЕНО: Прокрутка к полю ввода и фокус
        const promptInput = document.getElementById('promptInput');
        const promptFormGroup = document.getElementById('promptFormGroup');
        if (promptInput && promptFormGroup) {
            // Мягкая прокрутка
            promptFormGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Задержка фокуса, чтобы анимация прокрутки не дрожала
            setTimeout(() => {
                promptInput.focus();
                console.log('✅ Focus prioritized on prompt input');
            }, 600);
        }
    }, 400); // 400ms для комфортного восприятия

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
