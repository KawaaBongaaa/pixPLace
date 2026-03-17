import { showResult, displayFullResult, showResultToast, removeResultToast, showApp } from './screen-manager.js';

// Функция динамической загрузки limitModal по требованию (lazy loading)
const getLoadLimitModal = async () => {
    // Если уже загружено - используем
    if (window.loadLimitModal) {
        return window.loadLimitModal;
    }

    try {
        console.log('🔄 Lazy loading plans-modal.js on demand...');

        // Ленивая загрузка модуля
        const module = await import('./plans-modal.js');
        console.log('✅ Plans modal loaded via import()');

        // Ждем инициализации модуля
        await new Promise(resolve => setTimeout(resolve, 100));

        // Получаем функцию из экспорта или глобальной области
        const loadLimitModalFunc = module.loadLimitModal || window.loadLimitModal;

        if (loadLimitModalFunc) {
            console.log('✅ loadLimitModal function found');
            return loadLimitModalFunc;
        } else {
            console.error('❌ loadLimitModal not found in module exports or window');
            throw new Error('loadLimitModal not found');
        }
    } catch (error) {
        console.error('❌ Failed to lazy load plans modal:', error);
        return null;
    }
};

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
export async function showSubscriptionNotice(result, limitType = 'trial') {
    // 🔥 Ensure services are ready before showing subscription notice
    if (!window.appServices && !window.appState) {
        console.warn('⚠️ Waiting for appState before showing subscription notice...');
        let attempts = 0;
        while ((!window.appServices && !window.appState) && attempts < 30) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
    }

    console.log('🔗 Full result object:', result);
    console.log('🔗 Payment URLs from result:', result?.payment_urls);
    console.log('🔗 Limit type:', limitType);

    // Динамическая загрузка limitModal по требованию (lazy loading)
    const loadLimitModal = await getLoadLimitModal();
    if (!loadLimitModal) {
        console.error('❌ Failed to load limit modal!');
        return;
    }

    const modal = await loadLimitModal();
    if (!modal) {
        console.error('❌ Failed to create limit modal!');
        return;
    }

    // Получаем тексты из словаря по выбранному языку
    const titleKey = limitType === 'premium' ? 'premium_limit_title' : 'limit_title';
    const messageKey = limitType === 'premium' ? 'premium_limit_message' : 'limit_message';

    const title = window.appState?.translate?.(titleKey);
    const message = window.appState?.translate?.(messageKey);

    console.log('🌍 TRANSLATION DEBUG:', {
        limitType,
        currentLanguage: (typeof appState !== 'undefined' ? appState : window.appState)?.language,
        titleKey,
        messageKey,
        title,
        message,
        titleFallback: title || 'Generation Limit Reached',
        messageFallback: message || 'Your credits are depleted. Upgrade for more!'
    });

    // Динамически устанавливаем текст модального окна
    const titleElement = modal.querySelector('.limit-title');
    const messageElement = modal.querySelector('.limit-message');

    if (titleElement) {
        titleElement.textContent = title || 'Generation Limit Reached';  // Fallback английский
    }
    if (messageElement) {
        messageElement.textContent = message || 'Your credits are depleted. Upgrade for more!';  // Fallback английский
    }

    console.log('📝 Set modal text for limit type:', limitType, { title, message });

    // 🔍 ДИАГНОСТИКА: Проверяем все элементы которые могут быть поверх модального окна
    console.log('🔍 DIAGNOSING modal overlay elements...');

    // Проверяем Z-index всех элементов
    const allElements = document.querySelectorAll('*');
    const highZIndexElements = [];
    const suspiciousElements = [];

    allElements.forEach(el => {
        const zIndex = window.getComputedStyle(el).zIndex;
        if (zIndex !== 'auto' && parseInt(zIndex) > 99995) { // Выше модального окна
            highZIndexElements.push({
                element: el,
                zIndex: zIndex,
                tagName: el.tagName,
                id: el.id,
                className: el.className,
                position: window.getComputedStyle(el).position,
                display: window.getComputedStyle(el).display,
                visibility: window.getComputedStyle(el).visibility
            });
        }

        // Ищем подозрительные элементы с fixed позиционированием в центре
        if (window.getComputedStyle(el).position === 'fixed' && el !== modal) {
            const rect = el.getBoundingClientRect();
            if (rect.width < 100 && rect.height < 100 && // Маленький размер
                Math.abs(rect.left + rect.width / 2 - window.innerWidth / 2) < 50 && // Центр по X
                Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2) < 50) { // Центр по Y
                suspiciousElements.push({
                    element: el,
                    rect: rect,
                    styles: window.getComputedStyle(el),
                    html: el.outerHTML.substring(0, 200) + '...'
                });
            }
        }
    });

    // ✋ РАСШИРЕННАЯ ДИАГНОСТИКА: ПОДРОБНАЯ ИНФОРМАЦИЯ О ВЫСОКИХ ЭЛЕМЕНТАХ
    if (highZIndexElements.length > 0) {
        console.warn(`🔍 Found ${highZIndexElements.length} elements with high Z-INDEX:`);
    }
    console.table(highZIndexElements.map((el, index) => ({
        '№': index + 1,
        'Элемент': el.element.tagName,
        'Z-Index': el.zIndex,
        'ID': el.element.id || 'без ID',
        'Классы': el.element.className || 'без классов',
        'Position': el.element.style ? el.element.style.position : 'не определено',
        'Display': el.element.style ? el.element.style.display : 'не определено',
        'Visibility': el.element.style ? el.element.style.visibility : 'не определено',
        'Содержимое': el.element.innerText ? el.element.innerText.substring(0, 50) + '...' : 'пустой элемент',
        'HTML': el.element.outerHTML.substring(0, 100) + '...'
    })));

    console.log('🔍 SUSPICIOUS Fixed Elements in center:', suspiciousElements);

    // Ищем элементы с классом 'touch-action' или похожим
    const touchElements = document.querySelectorAll('[class*="touch"], [class*="finger"], [class*="joystick"]');
    console.log('🔍 TOUCH-related elements:', touchElements);

    // Проверяем viewport meta-tag
    const viewport = document.querySelector('meta[name="viewport"]');
    console.log('🔍 Viewport meta:', viewport ? viewport.content : 'NOT FOUND');

    // Проверяем наличие системных overlays
    console.log('🔍 User agent:', navigator.userAgent);
    console.log('🔍 Touch capabilities:', {
        touchscreen: navigator.maxTouchPoints > 0,
        ontouchstart: 'ontouchstart' in window,
        pointerEvent: 'onpointerdown' in window
    });

    // Уведомляем пользователя о начале диагностики
    console.warn('🔍 SYSTEM OVERLAY DETECTION STARTED');
    console.warn('Если видим оранжевый квадратик/джостик, это может быть:');
    console.warn('1. Touch Action Indicator (системный оверлей сеанса)');
    console.warn('2. Pointer Events Hover (CSS hover эффекты)');
    console.warn('3. Browser Gesture Recognition (системное поведение)');
    console.warn('4. Mobile System UI (панель навигации)');
    console.warn('5. Input Method Editor (экранная клавиатура)');

    // Показать модальное окно с небольшой задержкой для корректного reflow
    setTimeout(() => {
        if (!document.body.contains(modal)) {
            console.warn('⚠️ Modal was not in body, re-appending...');
            document.body.appendChild(modal);
        }

        modal.classList.add('show');
        console.log('✨ Modal visibility toggled: SHOW');
    }, 50);

    // Helper function for safe redirections with error handling
    const safeRedirect = (url, planName) => {
        modal.classList.remove('show');
        showApp(); // Используем showApp из screen-manager
        setTimeout(() => {
            try {
                console.log(`🔗 Redirecting to ${planName} payment URL: ${url}`);
                // Try modern way first
                if (window.appState?.tg?.openLink) {
                    window.appState.tg.openLink(url);
                } else {
                    // Fallback to regular navigation
                    window.open(url, '_blank');
                }
            } catch (error) {
                console.error(`❌ Error redirecting to ${planName} payment link:`, error);
                showToast('error', `Ошибка перехода к ${planName}. Попробуйте снова.`);
                // Fallback to popup
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        }, 100);
    };

    // Настроить обработчики для трех кнопок тарифов
    // 🔥 FIX: Search within the modal element for reliability
    const upgradeBtnLimit = modal.querySelector('#upgradeBtn') || document.getElementById('upgradeBtn');
    const upgradeBtnPro = modal.querySelector('#upgradebtn_pro') || document.getElementById('upgradebtn_pro');
    const upgradeBtnStudio = modal.querySelector('#upgradebtn_studio') || document.getElementById('upgradebtn_studio');

    console.log('🔘 Upgrade buttons found:', !!upgradeBtnLimit, !!upgradeBtnPro, !!upgradeBtnStudio);

    // Helper to setup button with clean listener
    const setupButton = (btn, planName, defaultUrl) => {
        if (!btn) return;

        // Clone to remove old listeners
        const newBtn = btn.cloneNode(true);
        if (btn.parentNode) {
            btn.parentNode.replaceChild(newBtn, btn);
        }

        newBtn.onclick = () => {
            console.log(`🔘 ${planName} Upgrade button clicked`);
            // Use custom URL or default fallback
            let paymentUrl = defaultUrl;
            if (result.payment_urls) {
                if (planName === 'LITE' && result.payment_urls.lite) paymentUrl = result.payment_urls.lite;
                if (planName === 'PRO' && result.payment_urls.pro) paymentUrl = result.payment_urls.pro;
                if (planName === 'STUDIO' && result.payment_urls.studio) paymentUrl = result.payment_urls.studio;
            }

            safeRedirect(paymentUrl, planName);
        };
    };

    setupButton(upgradeBtnLimit, 'LITE', 'https://t.me/tribute/app?startapp=syDv');
    setupButton(upgradeBtnPro, 'PRO', 'https://t.me/tribute/app?startapp=d71w'); // Updated Pro Link
    setupButton(upgradeBtnStudio, 'STUDIO', 'https://t.me/tribute/app?startapp=s8E3'); // Updated Studio Link

    // Настроить кнопку закрытия
    const closeBtn = modal.querySelector('#closeLimitModal') || document.getElementById('closeLimitModal');
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.classList.remove('show');
            showApp(); // Используем showApp из screen-manager
        };
    }
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

// ФУНКЦИЯ СВОРАЧИВАНИЯ КАРТОЧЕК РЕЖИМОВ
export function setModeCardsCollapsed(collapsed) {
    const wrapper = document.getElementById('modeCardsWrapper');
    if (!wrapper) {
        console.warn('❌ modeCardsWrapper not found for collapse toggle');
        return;
    }

    const toggleBtn = document.getElementById('modeCardsToggle');
    const toggleText = document.getElementById('modeCardsToggleText');

    console.log(`🔄 setModeCardsCollapsed called with: ${collapsed}, current classes: ${wrapper.className}`);

    if (collapsed) {
        // Применяем inline стили для сворачивания
        wrapper.style.display = 'none';
        wrapper.style.opacity = '0';
        wrapper.style.maxHeight = '0';
        wrapper.style.overflow = 'hidden';
        wrapper.style.transform = 'scaleY(0)';
        wrapper.style.transformOrigin = 'top';
        wrapper.style.transition = 'all 0.3s ease';

        wrapper.classList.add('collapsed');
        wrapper.classList.remove('expanded');

        if (toggleBtn) {
            toggleBtn.classList.remove('expanded');
            toggleBtn.classList.add('collapsed');
        }
        if (toggleText) {
            // 🔥 ВСЕГДА показываем название выбранной модели для свернутого состояния
            const selectedMode = getSelectedMode();
            const translatedName = getTranslatedModeName(selectedMode);
            toggleText.textContent = translatedName || selectedMode || 'Nano Banana Pro';
            console.log(`📝 Toggle text set to: ${toggleText.textContent} (selected: ${selectedMode})`);
        }
        console.log('📦 Mode cards collapsed');
    } else {
        // Применяем inline стили для разворачивания
        wrapper.style.display = 'block';
        wrapper.style.opacity = '1';
        wrapper.style.maxHeight = 'none'; // Allow full height
        wrapper.style.height = 'auto';    // Ensure it pushes content
        wrapper.style.overflow = 'visible';
        wrapper.style.transform = 'scaleY(1)';
        wrapper.style.transition = 'all 0.3s ease';
        wrapper.style.position = 'relative'; // Ensure flow
        wrapper.style.marginBottom = '20px'; // Add spacing

        wrapper.classList.remove('collapsed');
        wrapper.classList.add('expanded');

        if (toggleBtn) {
            toggleBtn.classList.remove('collapsed');
            toggleBtn.classList.add('expanded');
        }
        if (toggleText) {
            toggleText.textContent = 'Close Modes';
        }
        console.log('📦 Mode cards expanded');
    }
}

// ФУНКЦИЯ СВОРАЧИВАНИЯ ВИДЕО КАРТОЧЕК
export function setVideoCardsCollapsed(collapsed) {
    const wrapper = document.getElementById('videoCardsWrapper');
    if (!wrapper) {
        console.warn('❌ videoCardsWrapper not found for collapse toggle');
        return;
    }

    const toggleBtn = document.getElementById('videoCardsToggle');
    const toggleText = document.getElementById('videoCardsToggleText');

    if (collapsed) {
        // Применяем inline стили для сворачивания
        wrapper.style.display = 'none';
        wrapper.style.opacity = '0';
        wrapper.style.maxHeight = '0';
        wrapper.style.overflow = 'hidden';
        wrapper.style.transform = 'scaleY(0)';
        wrapper.style.transformOrigin = 'top';
        wrapper.style.transition = 'all 0.3s ease';

        wrapper.classList.add('collapsed');
        wrapper.classList.remove('expanded');

        if (toggleBtn) {
            toggleBtn.classList.remove('expanded');
            toggleBtn.classList.add('collapsed');
        }
        if (toggleText) {
            toggleText.textContent = getSelectedMode() || 'Image to Video';
        }
        console.log('🎬 Video cards collapsed');
    } else {
        // Применяем inline стили для разворачивания
        wrapper.style.display = 'block';
        wrapper.style.opacity = '1';
        wrapper.style.maxHeight = '1000px';
        wrapper.style.overflow = 'visible';
        wrapper.style.transform = 'scaleY(1)';
        wrapper.style.transition = 'all 0.3s ease';

        wrapper.classList.remove('collapsed');
        wrapper.classList.add('expanded');

        if (toggleBtn) {
            toggleBtn.classList.remove('collapsed');
            toggleBtn.classList.add('expanded');
        }
        if (toggleText) {
            toggleText.textContent = 'Close Modes';
        }
        console.log('🎬 Video cards expanded');
    }
}

// 🔥 ДОБАВЛЕНО: Слушатель для обновления описания при смене режима
document.addEventListener('mode:changed', (event) => {
    updateModeDescription(event.detail.mode);
});

// ФУНКЦИЯ ОБНОВЛЕНИЯ ОПИСАНИЯ РЕЖИМА
export function updateModeDescription(mode) {
    const descriptionBlock = document.getElementById('modeDescriptionBlock');
    const descriptionText = document.getElementById('modeDescriptionText');

    if (!descriptionBlock || !descriptionText) {
        console.warn('❌ Mode description elements not found');
        return;
    }

    // Попытка получить перевод через dictionaryManager
    let translatedDescription = '';
    const descKey = `mode_${mode}_desc`;
    if (window.dictionaryManager && window.dictionaryManager.translate) {
        const translated = window.dictionaryManager.translate(descKey);
        if (translated && translated !== descKey) {
            translatedDescription = translated;
        }
    }

    // Если перевода нет, берем из атрибутов карточки
    if (!translatedDescription) {
        const selectedCard = document.querySelector(`[data-mode="${mode}"]`);
        if (selectedCard) {
            translatedDescription = selectedCard.getAttribute('data-description') || '';
        }
    }

    // Крайний случай - дефолтные значения (на англ)
    if (!translatedDescription) {
        const defaultDescriptions = {
            'nano_banana_pro': 'Professional-grade photo editing! Advanced AI with enhanced precision for complex edits, up to 4 reference images, perfect for professional photo retouching and modifications 💎',
            'nano_banana': 'Ultimate photo editor! Drop up to 4 reference pics and just tell the AI what to change — it handles everything for you 🚀',
            'pixplace_pro': 'Switch to Professional Mode — ideal for logo design, text compositions, and complex layouts, just like a Pro Designer',
            'fast_generation': 'Fastest model for quick image generation — works instantly without uploads',
            'z_image': 'New generation model Z-Image Turbo — creates stunning visuals with unique style and high precision ⚡',
            'qwen_image': 'The Qwen Image empowers creators, developers, and businesses to generate and edit photorealistic images effortlessly.',
            'qwen_image_edit': 'Qwen Image-edit supporting semantic and appearance editing with precise, visually coherent results.',
            'print_maker': 'Specially crafted for Print-on-Demand creators — make print-ready designs for clothes, bags, and beyond',
            'dreamshaper_xl': 'Fast generation model designed as an all-in-one for photos, stylized art, and anime/manga.',
            'background_removal': 'Remove the background and keep the main object. Upload a photo to start',
            'upscale_image': 'Boost image quality and resolution — make your visuals look crisp and detailed',
            'image_to_video': 'Bring static images to life! Upload any photo and transform it into smooth, animated video sequences with AI-powered motion 🌟📹'
        };
        translatedDescription = defaultDescriptions[mode] || 'Select a model to see its description 🚀';
    }

    // Обновляем текст и i18n атрибут для поддержки смены языка "на лету"
    descriptionText.textContent = translatedDescription;
    descriptionText.setAttribute('data-i18n', descKey);
    descriptionBlock.style.display = 'block';

    console.log(`📝 Mode description updated for: ${mode}`);
}


// ФУНКЦИЯ ПОЛУЧЕНИЯ ПЕРЕВЕДЕННОГО НАЗВАНИЯ РЕЖИМА
function getTranslatedModeName(modeKey) {
    if (!modeKey) return '';

    // Используем dictionaryManager для перевода
    if (window.dictionaryManager && window.dictionaryManager.translate) {
        const translated = window.dictionaryManager.translate(`mode_${modeKey}`);
        if (translated && translated !== `mode_${modeKey}`) {
            return translated;
        }
    }

    // Fallback на дефолтные значения
    const defaultNames = {
        'nano_banana_pro': 'Nano Banana Pro',
        'nano_banana': 'Nano Banana',
        'pixplace_pro': 'Flux Pro Advanced',
        'z_image': 'Z-Image Turbo',
        'fast_generation': 'Flux Fast Generation',
        'print_maker': 'Print on Demand SDXL',
        'dreamshaper_xl': 'DreamShaper XL',
        'background_removal': 'Remove Background',
        'upscale_image': 'Enhance Image',
        'image_to_video': 'Image to Video',
        'video_gen': 'Video Generation',
        'video_edit': 'Video Edit'
    };

    return defaultNames[modeKey] || modeKey;
}

// ФУНКЦИЯ ОБНОВЛЕНИЯ ТЕКСТА TOGGLE КНОПКИ
export function updateToggleText() {
    const activeTab = getActiveTab();
    const selectedMode = getSelectedMode();
    const translatedModeName = getTranslatedModeName(selectedMode);

    if (activeTab === 'image') {
        const toggleText = document.getElementById('modeCardsToggleText');
        if (toggleText) {
            toggleText.textContent = translatedModeName || 'Nano Banana Pro';
        }
    } else if (activeTab === 'video') {
        const toggleText = document.getElementById('videoCardsToggleText');
        if (toggleText) {
            toggleText.textContent = translatedModeName || 'Image to Video';
        }
    }

    console.log(`🔄 Toggle text updated for tab: ${activeTab}, mode: ${selectedMode}, translated: ${translatedModeName}`);
}

// ФУНКЦИЯ ОБНОВЛЕНИЯ ТЕКСТА TOGGLE КНОПКИ С УЧЕТОМ СОСТОЯНИЯ
export function updateToggleTextForState() {
    const activeTab = getActiveTab();
    const wrapper = activeTab === 'image' ? document.getElementById('modeCardsWrapper') : document.getElementById('videoCardsWrapper');
    const toggleText = activeTab === 'image' ? document.getElementById('modeCardsToggleText') : document.getElementById('videoCardsToggleText');

    if (wrapper && toggleText) {
        if (wrapper.classList.contains('expanded')) {
            toggleText.textContent = 'Close Modes';
        } else {
            toggleText.textContent = getSelectedMode() || (activeTab === 'image' ? 'Nano Banana Pro' : 'Image to Video');
        }
    }
}

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

    // 🔥 ДОБАВЛЕНО: Автоматически сворачиваем карточки при первой загрузке
    // Инициализируем синхронно для максимальной скорости загрузки
    setModeCardsCollapsed(true);

    // Инициализация описания при загрузке
    const currentMode = getSelectedMode();
    const modeSelect = document.getElementById('modeSelect');
    if (modeSelect) modeSelect.value = currentMode;

    updateModeDescription(currentMode);

    // 🔥 ДОБАВЛЕНО: Инициализируем обработчики кликов для карточек режимов
    initModeCardClickHandlers();

    // 🔥 ДОБАВЛЕНО: Инициализируем обработчики кликов для toggle кнопок
    initModeCardToggleHandlers();

    // 🔥 ДОБАВЛЕНО: Обновляем UI сразу после инициализации
    updateToggleVisibilityForActiveTab();
    updateToggleText();

    console.log('✅ Mode cards automatically collapsed on app initialization');
    console.log('✅ Mode card click handlers initialized');
    console.log('✅ Mode card toggle handlers initialized');
    console.log('✅ Toggle UI updated for stable interface');

    // 🔥 НОВАЯ ФУНКЦИЯ: Инициализация обработчиков кликов для карточек режимов
    function initModeCardClickHandlers() {
        console.log('🎯 Initializing mode card click handlers');

        // Обработчики кликов для карточек режимов инициализируются в mode-cards.js
        // Эта функция служит для совместимости и логирования
        console.log('✅ Mode card click handlers initialized (delegated to mode-cards.js)');
    }

    // 🔥 НОВАЯ ФУНКЦИЯ: Инициализация обработчиков кликов для toggle кнопок
    function initModeCardToggleHandlers() {
        console.log('🎛️ Initializing mode card toggle handlers');

        // Обработчик для toggle кнопки image режимов
        const modeCardsToggle = document.getElementById('modeCardsToggle');
        if (modeCardsToggle) {
            modeCardsToggle.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                const wrapper = document.getElementById('modeCardsWrapper');
                if (wrapper) {
                    const isCollapsed = wrapper.classList.contains('collapsed');
                    setModeCardsCollapsed(!isCollapsed);
                }
            });
            console.log('✅ Image mode cards toggle handler attached');
        }

        // Обработчик для toggle кнопки video режимов
        const videoCardsToggle = document.getElementById('videoCardsToggle');
        if (videoCardsToggle) {
            videoCardsToggle.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                const wrapper = document.getElementById('videoCardsWrapper');
                if (wrapper) {
                    const isCollapsed = wrapper.classList.contains('collapsed');
                    setVideoCardsCollapsed(!isCollapsed);
                }
            });
            console.log('✅ Video mode cards toggle handler attached');
        }

        console.log('✅ Mode card toggle handlers initialized');
    }

    console.log('✅ Tabs initialized with preventDefault and auto-collapse');
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

    // 🔥 ДОБАВЛЕНО: Обновляем видимость toggle-кнопок при переключении таба
    updateToggleVisibilityForActiveTab();

    // 🔥 ДОБАВЛЕНО: Гарантируем что карточки collapsed при переключении таба
    if (tabType === 'video') {
        setVideoCardsCollapsed(true);
        // Синхронно выбираем режим для video таба, чтобы обновить состояние в mode-cards.js
        selectModeCard('image_to_video');
    }
    if (tabType === 'image') {
        setModeCardsCollapsed(true);
        // 🔥 ФИКС: Восстанавливаем последний выбранный режим изображения при возврате на вкладку
        // Это обновит состояние activeTab внутри mode-cards.js
        // Если selectedImageMode не определен, используем дефолтный
        const currentImageMode = selectedImageMode || 'nano_banana_pro';
        console.log(`🔄 Switching back to image tab, restoring mode: ${currentImageMode}`);
        selectModeCard(currentImageMode);
    }

    // 🔥 Removed: No longer expand cards on tab switch, keep collapsed by default

    // 🔥 ДОБАВЛЕНО: Обновляем текст toggle при переключении таба
    updateToggleText();

    // 🔥 ДОБАВЛЕНО: Обновляем текст кнопки generate при переключении таба
    updateGenerateButtonText();

    // Диспатчим событие изменения режима
    document.dispatchEvent(new CustomEvent('tab:changed', {
        detail: { tab: tabType }
    }));

    // 🔥 ДОБАВИТЬ: Обновляем описание режима при переключении таба
    updateModeDescription(getSelectedMode());

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

    // 🔥 ДОБАВЛЕНО: Прячем все mode-cards-wrapper кроме активного таба
    const modeCardsWrapper = document.getElementById('modeCardsWrapper');
    const videoCardsWrapper = document.getElementById('videoCardsWrapper');

    if (tabType === 'image') {
        // Показываем image карточки (только если expanded), прячем video
        if (modeCardsWrapper && modeCardsWrapper.classList.contains('expanded')) {
            modeCardsWrapper.style.display = 'block';
        }
        if (videoCardsWrapper) videoCardsWrapper.style.display = 'none';
    } else if (tabType === 'video') {
        // Показываем video карточки (только если expanded), прячем image
        if (modeCardsWrapper) modeCardsWrapper.style.display = 'none';
        if (videoCardsWrapper && videoCardsWrapper.classList.contains('expanded')) {
            videoCardsWrapper.style.display = 'block';
        }
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

// ФУНКЦИЯ ОБНОВЛЕНИЯ ВИДИМОСТИ TOGGLE ДЛЯ АКТИВНОГО ТАБА (перенесено из mode-cards.js)
function updateToggleVisibilityForActiveTab() {
    const activeTabType = getActiveTab();
    const toggleBtn = document.getElementById('modeCardsToggle');
    const videoToggleBtn = document.getElementById('videoCardsToggle');

    // Hide both toggles first
    if (toggleBtn) toggleBtn.style.display = 'none';
    if (videoToggleBtn) videoToggleBtn.style.display = 'none';

    // Show only the active tab's toggle
    if (activeTabType === 'image' && toggleBtn) {
        toggleBtn.style.display = 'flex';
        console.log('✅ Image mode cards toggle shown for active tab');
    } else if (activeTabType === 'video' && videoToggleBtn) {
        videoToggleBtn.style.display = 'flex';
        console.log('✅ Video mode cards toggle shown for active tab');
    }
}

// Экспортируем функции вкладок для использования в других модулях
export { initTabs, switchTab, showTab, getActiveTab, updateGenerateButtonText, updateToggleVisibilityForActiveTab };

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
    console.log('💎 Opening subscription plans... (Redirecting to pricing.html)');
    try {
        // Закрываем меню пользователя если оно открыто
        if (typeof window.toggleUserMenu === 'function') {
            const menu = document.getElementById('userMenuDropdown');
            if (menu && menu.classList.contains('show')) {
                window.toggleUserMenu();
                console.log('💎 User menu closed');
            }
        }

        window.location.href = 'pricing.html';
    } catch (e) {
        console.error('❌ Error in openSubscriptionPlans redirection:', e);
    }
}

export async function openCreditPacks() {
    console.log('💳 Opening credit packs...');
    // Закрываем меню пользователя если оно открыто
    if (typeof window.toggleUserMenu === 'function') {
        const menu = document.getElementById('userMenuDropdown');
        if (menu && menu.classList.contains('show')) {
            window.toggleUserMenu();
        }
    }

    // Если есть специализированная функция для модалки кредитов - используем ее
    if (typeof window.showCreditPacksModal === 'function') {
        window.showCreditPacksModal();
    } else {
        await showSubscriptionNotice({ payment_urls: {} }, 'trial');
    }
}

// Экспортируем в глобальную область для доступа из HTML onclick
window.openSubscriptionPlans = openSubscriptionPlans;
window.openCreditPacks = openCreditPacks;
window.showSubscriptionNotice = showSubscriptionNotice;
window.updateModeDescription = updateModeDescription;
