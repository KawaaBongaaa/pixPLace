import { showResult, displayFullResult, showResultToast, removeResultToast, showApp } from './screen-manager.js';

// Legacy modal loaders removed. Everything redirects to pricing.html or uses showCreditPurchaseModal.


// ================================================
// 🌍 NAVIGATION FUNCTIONS
// ================================================

// Функция из app_modern.js - updateUserNameDisplay
export function updateUserNameDisplay() {
    const nameElement = document.getElementById('userNameDisplay');

    if (!nameElement) return;

    // Получаем appState из window или из local переменной
    let state = (typeof appState !== 'undefined' ? appState : window.appState);
    if (!state) {
        console.warn('❌ updateUserNameDisplay: appState не найден ни в module, ни в window');
        return;
    }

    // Приоритет отображения: username > имя+фамилия > имя > userId
    let displayName = '';

    if (state.user?.username) {
        // Есть username - показываем с @
        displayName = '@' + state.user.username;
    } else if (state.user?.name && state.user.name.trim() !== '') {
        // Есть имя/фамилия - показываем как есть
        displayName = state.user.name;
    } else if (state.user?.id) {
        // Нет имени, но есть ID - используем как запасной вариант
        displayName = 'ID: ' + state.user.id.toString().substring(0, 8) + '...';
    } else {
        // Ничего нет - дефолтное значение
        displayName = '--';
    }

    nameElement.textContent = displayName;
    console.log('👤 User name display updated:', displayName, 'from:', {
        hasUsername: !!state.userUsername,
        hasName: !!state.userName,
        hasId: !!state.userId
    });
}



export function updateUserBalanceDisplay(credits, reason = '') {
    console.log('💰 updateUserBalanceDisplay called with:', credits, 'reason:', reason);
    console.log(' Current appState balance:', window.appState?.user?.credits);

    // Получаем appState из window или из local переменной
    let state = (typeof appState !== 'undefined' ? appState : window.appState);
    if (!state) {
        console.warn('❌ updateUserBalanceDisplay: appState не найден ни в module, ни в window');
        return;
    }

    // 🔥 ОБЯЗАТЕЛЬНАЯ ИНИЦИАЛИЗАЦИЯ user объекта если его нет
    // Это важно для предотвращения ошибки state.user?.credits = undefined
    if (!state.user) {
        console.log('🔧 Initializing user object in state');
        state.user = {};
    }

    console.log('🔍 state.user before:', state.user);
    console.log('🔍 state.user.credits before:', state.user.credits);

    // Если credits не переданы - взять текущее значение из state
    if (credits === null || credits === undefined) {
        credits = state.user.credits; // НЕ используем optional chaining здесь!
        console.log('💰 Taking credits from state:', credits, 'state.user.credits:', state.user.credits);
    }

    // Найдем элемент для отображения баланса
    const balanceElement = document.getElementById('userCreditsDisplay');
    console.log('🔍 Looking for balance element #userCreditsDisplay:', !!balanceElement);

    if (credits !== null && credits !== undefined) {

        const newBalance = parseFloat(credits);
        const oldBalance = state.user?.credits || 0;
        const timestamp = Date.now();

        // Добавляем запись в историю ДО обновления баланса
        if (!state.balanceHistory) state.balanceHistory = [];
        state.balanceHistory.push({
            balance: newBalance,
            timestamp: timestamp,
            reason: reason,
            previousBalance: oldBalance
        });

        // Ограничиваем историю до 100 последних записей
        if (state.balanceHistory.length > 100) {
            state.balanceHistory = state.balanceHistory.slice(-100);
        }

        // Сохраняем историю в localStorage
        if (window.appState && window.appState.saveBalanceHistory) window.appState.saveBalanceHistory();

        // 🔥 НОВОЕ: Сохраняем текущий баланс для надежности
        if (window.appState && window.appState.saveCurrentBalance) window.appState.saveCurrentBalance();

        // 🔥 ДОБАВЛЕНИЕ: Прямое присвоение к state ссылке для надежности
        if (!state.user) state.user = {};
        state.user.credits = newBalance;
        if (window.appState?.state?.user) {
            window.appState.state.user.credits = newBalance;
        }
        console.log('💰 Direct state assignment: state.user.credits =', newBalance);

        state.lastBalanceUpdate = timestamp;
        if (state.saveSettings) state.saveSettings(); // Сохраняем настройки в localStorage

        // Обновляем отображение в header
        const balanceElement = document.getElementById('userCreditsDisplay');
        console.log('🔍 Updating balance display element:', balanceElement, 'credits value:', credits);
        if (balanceElement) {
            if (!isNaN(credits) && credits !== null) {
                const formattedBalance = parseFloat(credits).toLocaleString('en-US');
                console.log('💰 Setting balance display to:', formattedBalance);
                balanceElement.textContent = formattedBalance;
            } else {
                console.log('💰 Setting balance display to: -- (because credits is null/undefined)');
                balanceElement.textContent = '--';
            }
        } else {
            console.warn('❌ Balance element not found in DOM!');
        }

        console.log('💳 Balance updated:', { old: oldBalance, new: newBalance, reason });
    }
}


// Функция из app_modern.js - showBackButton
export function showBackButton(show) {
    const body = document.body;
    if (show) {
        body.classList.add('show-back');
    } else {
        body.classList.remove('show-back');
    }
}


// Добавляем экспорт в window для обратной совместимости
window.showBackButton = showBackButton;

// Функция из app_modern.js - toggleHistoryList
// toggleHistoryList удален отсюда, используется продвинутая версия из history-manager.js 
// которая поддерживает серверную синхронизацию при раскрытии.

// Функция из app_modern.js - showHistory
export function showHistory() {
    toggleHistoryList();
}

// Функция из app_modern.js - showSubscriptionNotice
// showSubscriptionNotice was removed. Check parallel-generation.js for showCreditPurchaseModal usage.
export async function showSubscriptionNotice(result, limitType = 'trial') {
    console.warn('showSubscriptionNotice is deprecated. Redirecting to pricing.html...');
    window.location.href = 'pricing.html';
}

// Функция из app_modern.js - showWarningAboutNoImage (исправленная версия с улучшенным удалением overlay)
// Функция из app_modern.js - showWarningAboutNoImage (Refactored to Tailwind CSS)
export async function showWarningAboutNoImage() {
    return new Promise((resolve) => {
        // Флаг для предотвращения двойного удаления
        let isResolved = false;

        const overlay = document.createElement('div');
        overlay.id = 'photo-warning-overlay';
        // Tailwind classes: fixed fullscreen overlay with backdrop blur
        overlay.className = 'fixed inset-0 bg-black/70 backdrop-blur-xl z-[10000] flex items-center justify-center opacity-0 transition-opacity duration-300 ease-out';

        const modal = document.createElement('div');
        // Tailwind classes: white/dark modal card with shadow and transform transition
        modal.className = 'bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-[90%] shadow-2xl shadow-black/30 translate-y-5 transition-transform duration-300 ease-out text-center';

        // Prepare texts using translation or fallback
        const titleText = typeof appState !== 'undefined' ? appState.translate('photo_warning_title') : 'For better results, upload an image';
        const bodyText = typeof appState !== 'undefined' ? appState.translate('photo_warning_text') : 'The "Nano Banana" mode works better with an image for img2img generation. Would you like to upload an image or continue without it?';
        const uploadBtnText = typeof appState !== 'undefined' ? appState.translate('photo_warning_upload_btn') : 'Upload Image';
        const continueBtnText = typeof appState !== 'undefined' ? appState.translate('photo_warning_continue_btn') : 'Continue without';

        // Helper for button classes to keep HTML clean
        const btnBaseClass = "flex-1 py-3 px-6 text-white border-none rounded-full text-base font-semibold cursor-pointer transition-all duration-200 ease-out active:scale-95 hover:-translate-y-0.5";
        const uploadBtnClass = `${btnBaseClass} bg-gradient-to-br from-[#7e94f7] to-[#1d5df3] shadow-lg shadow-blue-500/40 hover:shadow-xl hover:shadow-blue-500/50`;
        const continueBtnClass = `${btnBaseClass} bg-gradient-to-br from-[#ee4c62] to-[#f72e48] shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/50`;

        modal.innerHTML = `
            <div class="flex flex-col items-center mb-6">
                <div class="text-6xl mb-2 flex items-center justify-center text-blue-500 animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                </div>
            </div>
            <div class="mb-8">
                <h3 class="mb-3 text-[var(--text-primary)] text-xl font-bold tracking-tight">${titleText}</h3>
                <p class="text-[var(--text-secondary)] text-base leading-relaxed opacity-90">${bodyText}</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-4 justify-center w-full">
                <button id="upload-image-btn" class="${uploadBtnClass}">
                    ${uploadBtnText}
                </button>
                <button id="continue-without-btn" class="${continueBtnClass}">
                    ${continueBtnText}
                </button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Animation in
        requestAnimationFrame(() => {
            overlay.classList.remove('opacity-0');
            modal.classList.remove('translate-y-5');
        });

        // Safe cleanup function
        const safeRemoveOverlay = () => {
            try {
                if (overlay && overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            } catch (error) {
                console.error('❌ Error removing overlay:', error);
            }
        };

        // Safe resolve function
        const safeResolve = (value) => {
            if (isResolved) return;
            isResolved = true;
            resolve(value);
        };

        const uploadBtn = modal.querySelector('#upload-image-btn');
        const continueBtn = modal.querySelector('#continue-without-btn');

        uploadBtn.addEventListener('click', () => {
            // Immediate hiding to prevent drag/click issues
            overlay.style.display = 'none';
            safeRemoveOverlay();

            // Scroll to upload button
            setTimeout(() => {
                const chooseBtn = document.getElementById('urlInputContainer');
                if (chooseBtn) {
                    chooseBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Use blink effect utility if available
                    if (window.startUploadButtonBlink) {
                        try { window.startUploadButtonBlink(); } catch (e) { }
                    }
                }
            }, 100);

            safeResolve(false); // Do not continue generation
        });

        continueBtn.addEventListener('click', () => {
            // Animate out
            overlay.classList.add('opacity-0');
            modal.classList.add('translate-y-5');

            setTimeout(() => {
                safeRemoveOverlay();
                // Create preview if continuing
                if (window.createPreviewForGeneration && window.currentGeneration) {
                    window.createPreviewForGeneration(window.currentGeneration);
                }
                safeResolve(true); // Continue generation
            }, 300);
        });

        // Close on backdrop click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.add('opacity-0');
                modal.classList.add('translate-y-5');
                setTimeout(() => {
                    safeRemoveOverlay();
                    safeResolve(false); // Cancel/Close = false
                }, 300);
            }
        });
    });
}

// ================================================
// 📋 HISTORY NAVIGATION
// ================================================

// Функции для скролла истории из app_modern.js
export async function scrollToLatestImage() {
    await new Promise(resolve => setTimeout(resolve, 100)); // даем DOM обновиться

    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    // ОЖИДАЕМ пока DOM обновится после отображения превью!
    await new Promise(resolve => setTimeout(resolve, 200));

    // Ищем первый элемент истории (это будет крайнее/новое изображение)
    const firstHistoryItem = historyList.querySelector('.history-mini');
    if (firstHistoryItem) {
        console.log('🚀 Прокрутка к новому превью генерации');

        // Быстрая прокрутка к центру экрана для показа нового превью
        firstHistoryItem.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });

        console.log('✅ Прокрутка к новому превью завершена');
    } else {
        console.warn('⚠️ Не найдено новое превью для прокрутки');
    }
}

export async function scrollToBottomImage() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    // Убираем задержку - она замедляет
    await new Promise(resolve => setTimeout(resolve, 50));

    // Ищем все элементы истории
    const historyItems = historyList.querySelectorAll('.history-mini');
    if (historyItems.length > 0) {
        // Берем последний элемент (самое нижнее изображение)
        const lastHistoryItem = historyItems[historyItems.length - 1];

        // Убираем спам логирования
        if (Math.random() < 0.05) {
            console.log('🚀 Быстрая прокрутка к последнему изображению');
        }

        // Быстрая прокрутка без плавности для мгновенного показа
        lastHistoryItem.scrollIntoView({
            behavior: 'instant', // 'instant' для быстрой прокрутки
            block: 'center',
            inline: 'nearest'
        });

        // Убираем анимацию и подсветку - они бесполезны
        if (Math.random() < 0.05) {
            console.log('✅ Прокрутка к последнему изображению завершена');
        }
    } else {
        // Убираем спам логирования
        if (Math.random() < 0.01) {
            console.warn('⚠️ Не найдены элементы истории для прокрутки');
        }
    }
}

// Функция плавной прокрутки к истории и открытия списка
export async function showHistoryWithScroll() {
    const historyBtn = document.getElementById('historyToggleBtn');
    const historyList = document.getElementById('historyList');

    if (historyBtn) {
        // Плавная прокрутка к кнопке истории - центрируем её
        historyBtn.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });
    }

    // Подождем завершения прокрутки
    await new Promise(resolve => setTimeout(resolve, 300));

    // Автоматически открываем список истории если он закрыт
    if (historyList && historyList.classList.contains('hidden')) {
        const btn = document.getElementById('historyToggleBtn');
        historyList.classList.remove('hidden');
        btn.classList.add('active');
        updateHistoryDisplay();

        // Ждем пока DOM обновится после открытия
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Дополнительная прокрутка к крайнему (новому) изображению после открытия истории
    await scrollToLatestImage();
}

// ================================================
// 🎨 UTILITY FUNCTIONS
// ================================================

// Функция из app_modern.js - startUploadButtonBlink
export function startUploadButtonBlink() {
    const chooseBtn = document.getElementById('urlInputContainer');
    if (!chooseBtn) return;

    console.log('🎯 Starting upload button pulse animation');

    // Применяем существующую анимацию need-image-pulse (настройка длительности)
    chooseBtn.style.animation = 'need-image-pulse 2.4s infinite';  // ← МЕНЯЙТЕ ДЛИТЕЛЬНОСТЬ ЗДЕСЬ (4s - 4 секунды)

    // Через несколько секунд убираем анимацию
    setTimeout(() => {
        chooseBtn.style.animation = '';
        console.log('✅ Upload button pulse animation stopped');
    }, 10000);  // ← МЕНЯЙТЕ ОБЩУЮ ПРОДОЛЖИТЕЛЬНОСТЬ ЗДЕСЬ (4000мс - 4 секунды)

    // Дополнительно прокручиваем к кнопке если она не видна
    setTimeout(() => {
        chooseBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

// Функция из app_modern.js - toggleModeDetails
export function toggleModeDetails() {
    const carousel = document.getElementById('modeCarouselContainer');
    if (!carousel) {
        console.warn('Mode carousel container not found');
        return;
    }

    const isVisible = carousel.style.display !== 'none';
    carousel.style.display = isVisible ? 'none' : 'block';

    console.log('Mode carousel toggled:', !isVisible ? 'visible' : 'hidden');

    // Плавная прокрутка к карусели при показе
    if (!isVisible) {
        setTimeout(() => {
            carousel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
}

// Импорт функций из истории (нужно определить выше или импортировать)
import('./history-manager.js').then(module => {
    window.updateHistoryDisplay = module.updateHistoryDisplay;
});

// Импорт функций из mode-cards.js (пока что, потом перенесем)
import { selectModeCard, getSelectedMode } from './mode-cards.js';

// 🔥 НОВЫЕ ФУНКЦИИ ДЛЯ РАБОТЫ С КАРТОЧКАМИ РЕЖИМОВ



// ========== TAB MANAGEMENT FUNCTIONS ==========

// РАЗДЕЛЬНЫЕ СОСТОЯНИЯ ДЛЯ РАЗНЫХ ТАБОВ (перенесено из mode-cards.js)
let selectedImageMode = 'nano_banana_pro';
let selectedVideoMode = 'image_to_video';
let selectedMode = 'nano_banana_pro'; // 🔥 ДОБАВЛЕНО: Для совместимости с существующим кодом
let activeTab = 'image';

// ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ ВКЛАДОК (перенесено из mode-cards.js)
function initTabs() {
    const tabs = document.querySelectorAll('.generation-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();     // ОСТАНОВИТЬ submit формы
            event.stopPropagation();    // ОСТАНОВИТЬ всплытие события
            const tabType = tab.dataset.tab;
            switchTab(tabType);
        });
    });

    // Показываем вкладку по умолчанию (Image)
    showTab(activeTab);

    // Удалены старые функции работы с карточками режимов

    // Инициализация описания при загрузке
    const currentMode = getSelectedMode();
    const modeSelect = document.getElementById('modeSelect');
    if (modeSelect) modeSelect.value = currentMode;

    console.log('✅ Tabs initialized with preventDefault and clean interface');
}

// ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ ВКЛАДКИ (перенесено из mode-cards.js)
function switchTab(tabType) {
    // Обновляем активную вкладку
    activeTab = tabType;

    // 🔥 ДОБАВЛЕНО: Устанавливаем дефолтный режим для video таба как image_to_video
    if (tabType === 'video') {
        selectedVideoMode = 'image_to_video';
        selectedMode = 'image_to_video'; // Синхронизируем для совместимости
    }

    // Обновляем UI вкладок
    const allTabs = document.querySelectorAll('.generation-tab');
    allTabs.forEach(tab => tab.classList.remove('active'));

    const activeTabEl = document.querySelector(`.generation-tab[data-tab="${tabType}"]`);
    if (activeTabEl) {
        activeTabEl.classList.add('active');
    }

    // Показываем содержание вкладки
    showTab(tabType);

    if (tabType === 'video') {
        // Синхронно выбираем режим для video таба, чтобы обновить состояние в mode-cards.js
        selectModeCard('image_to_video');
    }
    if (tabType === 'image') {
        const currentImageMode = selectedImageMode || 'nano_banana_pro';
        console.log(`🔄 Switching back to image tab, restoring mode: ${currentImageMode}`);
        selectModeCard(currentImageMode);
    }

    // --- FIXED: Restore Edit tab state (Step 2 if image exists) ---
    if (tabType === 'edit') {
        const hasImage = window._editImageBlob || window._editImageUrl;
        if (hasImage && typeof window._showEditStep2 === 'function') {
            const src = window._editImageUrl || (window._editImageBlob ? URL.createObjectURL(window._editImageBlob) : '');
            if (src) {
                console.log('🔄 Restoring Edit tab state (Step 2)');
                window._showEditStep2(src);
            }
        }
    }

    // 🔥 ДОБАВЛЕНО: Обновляем текст кнопки generate при переключении таба
    updateGenerateButtonText();

    // Диспатчим событие изменения режима
    document.dispatchEvent(new CustomEvent('tab:changed', {
        detail: { tab: tabType }
    }));

    console.log(`🔄 Switched to tab: ${tabType}`);
}

// ФУНКЦИЯ ПОКАЗА СОДЕРЖАНИЯ ВКЛАДКИ (перенесено из mode-cards.js)
function showTab(tabType) {
    const allPanes = document.querySelectorAll('.tab-pane');
    allPanes.forEach(pane => {
        pane.classList.remove('active');
        pane.style.display = 'none'; // 🔥 Explicitly hide all panes
    });

    const activePane = document.querySelector(`.tab-pane[data-tab="${tabType}"]`);
    if (activePane) {
        activePane.classList.add('active');
        activePane.style.display = 'block'; // 🔥 Explicitly show active pane
    }

    console.log(`📋 Showing tab content: ${tabType}`);
}

// ФУНКЦИЯ ОБНОВЛЕНИЯ ТЕКСТА КНОПКИ GENERATE В ЗАВИСИМОСТИ ОТ АКТИВНОЙ ВКЛАДКИ (перенесено из mode-cards.js)
function updateGenerateButtonText() {
    const generateBtn = document.getElementById('generateBtn');
    if (!generateBtn) {
        console.warn('❌ Generate button not found for text update');
        return;
    }

    const activeTab = getActiveTab();
    const newKey = activeTab === 'video' ? 'generate_video_btn' : 'generate_image_btn';

    // Обновляем data-i18n атрибут
    generateBtn.setAttribute('data-i18n', newKey);

    // Принудительно обновляем текст через dictionaryManager
    if (window.dictionaryManager && window.dictionaryManager.updateTranslations) {
        // Обновляем только этот элемент
        const translation = window.dictionaryManager.translate(newKey);
        if (translation && translation !== newKey) {
            const btnText = generateBtn.querySelector('.btn-text');
            if (btnText) {
                btnText.textContent = translation;
            }
        }
    }

    console.log(`🎯 Generate button text updated for tab: ${activeTab} (key: ${newKey})`);
}

// ВНУТРЕННЯЯ ФУНКЦИЯ ПОЛУЧЕНИЯ АКТИВНОГО ТАБА (перенесено из mode-cards.js)
function getActiveTab() {
    const activePane = document.querySelector('.tab-pane.active');
    return activePane ? activePane.dataset.tab : 'image';
}

// Удалена функция обновления видимости toggle

// Экспортируем функции вкладок для использования в других модулях
export { initTabs, switchTab, showTab, getActiveTab, updateGenerateButtonText };

// ========== END TAB MANAGEMENT ==========

// ================================================
// 🎨 STYLE MANAGEMENT - LEGACY CAROUSEL REMOVED
// ================================================

// LEGACY FUNCTION - NOW USING MODULAR style-manager.js WITH LAZY LOADING
export async function initStyleCarousel() {
    console.log('🎨 [LEGACY] initStyleCarousel called - now handled by modular style-manager.js with lazy loading');
    // This function is kept for backward compatibility but does nothing
    // All style functionality is now in style-manager.js module with lazy loading
}



// 🔥 Функция обновления индикаторов текущего языка в меню
function updateLanguageMenuIndicators() {
    const langMenu = document.getElementById('langMenu');
    if (!langMenu) return;

    // Получаем текущий язык
    const currentLang = window.dictionaryManager?.currentLanguage || window.appState?.language || 'en';

    console.log(`🌍 Updating language menu indicators for current language: ${currentLang}`);

    // Убираем все индикаторы текущего языка
    const allItems = langMenu.querySelectorAll('li[data-lang]');
    allItems.forEach(item => {
        const indicator = item.querySelector('.current-indicator');
        if (indicator) {
            indicator.remove();
        }
        // Убираем класс current для CSS
        item.classList.remove('current');
    });

    // Добавляем индикатор к текущему языку
    const currentItem = langMenu.querySelector(`[data-lang="${currentLang}"]`);
    if (currentItem) {
        // Добавляем класс current для CSS
        currentItem.classList.add('current');

        // Добавляем индикатор ✓ в конец текста языка
        if (!currentItem.querySelector('.current-indicator')) {
            const indicator = document.createElement('span');
            indicator.className = 'current-indicator';
            indicator.textContent = ' ✓';
            indicator.style.fontWeight = 'bold';
            indicator.style.color = '#10b981'; // зеленый цвет
            currentItem.appendChild(indicator);
        }

        console.log(`✅ Updated current language indicator to: ${currentLang}`);
    } else {
        console.warn(`⚠️ Current language item not found in menu: ${currentLang}`);
    }
}

// 🔥 НОВАЯ ФУНКЦИЯ: Lazy инициализация language dropdown
export function initLazyLanguageDropdown() {
    console.log('🚀 initLazyLanguageDropdown STARTED');

    const langBtn = document.getElementById('langBtn');
    const langMenu = document.getElementById('langMenu');

    if (!langBtn || !langMenu) {
        console.warn('❌ Language elements not found');
        return;
    }

    // Singleton pattern: Check if we already initialized
    if (langBtn.dataset.listenerAttached === 'true') {
        return;
    }
    langBtn.dataset.listenerAttached = 'true';

    // Helper: Close menu
    const closeMenu = () => {
        langMenu.classList.add('hidden');
        langMenu.style.display = 'none'; // Ensure it's hidden
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
    };

    // Helper: Open menu
    const openMenu = () => {
        langMenu.classList.remove('hidden');
        langMenu.style.display = 'block';

        // Close other menus (mutual exclusion)
        const authMenu = document.getElementById('authMenu');
        if (authMenu) authMenu.classList.add('hidden');
        const userMenu = document.getElementById('userMenuDropdown');
        if (userMenu) userMenu.classList.remove('show');

        // Force layout check
        const rect = langMenu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            langMenu.style.right = '0';
            langMenu.style.left = 'auto';
        }

        // Add global listeners with a slight delay to avoid immediate close
        setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }, 10);
    };

    // Handler: Click outside
    const handleClickOutside = (event) => {
        if (!langMenu.contains(event.target) && !langBtn.contains(event.target)) {
            closeMenu();
        }
    };

    // Handler: Escape key
    const handleEscape = (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    };

    // Handler: Toggle button
    langBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        const isVisible = !langMenu.classList.contains('hidden') && langMenu.style.display !== 'none';

        if (isVisible) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Handler: Language items
    const langItems = langMenu.querySelectorAll('li[data-lang]');
    langItems.forEach(item => {
        item.style.cursor = 'pointer'; // Force pointer cursor via JS as backup

        item.addEventListener('click', async (event) => {
            event.stopPropagation();
            const lang = item.getAttribute('data-lang');

            // UI Feedback
            langItems.forEach(li => li.style.background = 'transparent');
            item.style.background = 'rgba(59, 130, 246, 0.1)';

            closeMenu(); // Close immediately

            if (lang) {
                console.log(`🌍 Language selected: ${lang}`);
                try {
                    if (window.dictionaryManager) {
                        await window.dictionaryManager.setLanguage(lang);
                    }
                } catch (error) {
                    console.error('❌ Error switching language:', error);
                }
            }
        });
    });

    // Initialize indicators
    if (window.dictionaryManager) {
        updateLanguageMenuIndicators();
    }
}

// Экспортируем функции в глобальный scope
window.updateUserNameDisplay = updateUserNameDisplay;
window.updateUserBalanceDisplay = updateUserBalanceDisplay;

// === ДОСТУПНЫЕ В ГЛОБАЛЬНОМ ОБЪЕКТЕ ===
window.toggleModeDetails = toggleModeDetails;

// Экспорт функций в глобальный scope для обратной совместимости


// Экспортируем функции в глобальный scope

// ================================================
// 💎 SUBSCRIPTION & CREDITS NAVIGATION
// ================================================

export async function openSubscriptionPlans() {
    console.log('💎 [Portal] openSubscriptionPlans() called');
    try {
        // Закрываем меню пользователя если оно открыто
        if (typeof window.toggleUserMenu === 'function') {
            const menu = document.getElementById('userMenuDropdown');
            if (menu && menu.classList.contains('show')) {
                window.toggleUserMenu();
            }
        }

        const { showPricingModal } = await import('./js/modules/ui-utils.js?v=portal-1');
        showPricingModal({ initialTab: 'plans' });
    } catch (e) {
        console.error('❌ Error in openSubscriptionPlans:', e);
        window.location.href = 'pricing.html';
    }
}

export async function openCreditPacks() {
    console.log('💳 [Portal] openCreditPacks() called');
    try {
        // Закрываем меню пользователя если оно открыто
        if (typeof window.toggleUserMenu === 'function') {
            const menu = document.getElementById('userMenuDropdown');
            if (menu && menu.classList.contains('show')) {
                window.toggleUserMenu();
            }
        }

        const { showPricingModal } = await import('./js/modules/ui-utils.js?v=portal-1');
        showPricingModal({ initialTab: 'credits' });
    } catch (e) {
        console.error('❌ Error in openCreditPacks:', e);
        window.location.href = 'pricing.html#credits';
    }
}

// Экспортируем в глобальную область для доступа из HTML onclick
window.openSubscriptionPlans = openSubscriptionPlans;
window.openCreditPacks = openCreditPacks;

