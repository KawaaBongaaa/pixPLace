// ОТДЕЛЬНЫЙ МОДУЛЬ ДЛЯ УПРАВЛЕНИЕ КАРТОЧКАМИ РЕЖИМОВ
// (LAZY LOADING разделен по модулям для лучшей производительности)

let selectedMode = 'photo_session';
let currentExpandedCard = null;

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

    // Создаем карточки режимов
    const cardsHTML = `
        <div class="mode-cards-grid">
            <div class="mode-card" data-mode="photo_session">
                <span class="mode-badge mode-badge--premium" data-i18n="badge_premium">Premium</span>
                <div class="mode-icon">🍌</div>
                <h4 class="mode-title">Nano Banana Editor</h4>
                <p class="mode-description">Perfect for photo editing. Upload an image and describe what to change</p>
            </div>
            
            <div class="mode-card" data-mode="dreamshaper_xl">
                <span class="mode-badge mode-badge--free" data-i18n="badge_free">Free</span>
                <div class="mode-icon">⋆.˚🦋༘⋆</div>
                <h4 class="mode-title">DreamShaper XL</h4>
                <p class="mode-description">Fast generation model designed as an all-in-one for photos, stylized art, and anime/manga.</p>
            </div>
            <div class="mode-card" data-mode="fast_generation">
                <div class="mode-icon">⚡</div>
                <h4 class="mode-title">Flux Fast Generation</h4>
                <p class="mode-description">Fastest mode for simple pictures generation without image upload</p>
            </div>

            <div class="mode-card" data-mode="pixplace_pro">
                <span class="mode-badge mode-badge--premium" data-i18n="badge_premium">Premium</span>
                <div class="mode-icon">𝓟𝓻𝓸</div>
                <h4 class="mode-title">Flux Pro Advanced</h4>
                <p class="mode-description">Advanced mode with text support, logos and complex compositions</p>
            </div>

            <div class="mode-card" data-mode="print_maker">
                <div class="mode-icon">👕</div>
                <h4 class="mode-title">Print on Demand</h4>
                <p class="mode-description">Specialized for Print on Demand. Creates ready-made prints for clothes and accessories</p>
            </div>

            <div class="mode-card" data-mode="background_removal">
                <span class="mode-badge mode-badge--free" data-i18n="badge_free">Free</span>
                <div class="mode-icon">✂</div>
                <h4 class="mode-title">Remove Background</h4>
                <p class="mode-description">Removes background from image while preserving the object</p>
            </div>

            <div class="mode-card" data-mode="upscale_image">
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

    // Устанавливаем начальный выбранный режим
    selectModeCard(selectedMode);

    console.log('✅ Mode cards HTML created and inserted to modeCardsWrapper');
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
