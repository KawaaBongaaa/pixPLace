// 🎯 UI Navigation Manager - Вынос функций навигации из app_modern.js
// Управление экранами, историей, навигацией

import { showResult, displayFullResult, showResultToast, removeResultToast, showApp } from './screen-manager.js';

// ================================================
// 🌍 NAVIGATION FUNCTIONS
// ================================================

// Функция из app_modern.js - updateUserNameDisplay
export function updateUserNameDisplay() {
    const nameElement = document.getElementById('userNameDisplay');

    if (!nameElement) return;

    // Приоритет отображения: username > имя+фамилия > имя > userId
    let displayName = '';

    if (appState.userUsername) {
        // Есть username - показываем с @
        displayName = '@' + appState.userUsername;
    } else if (appState.userName && appState.userName.trim() !== '') {
        // Есть имя/фамилия - показываем как есть
        displayName = appState.userName;
    } else if (appState.userId) {
        // Нет имени, но есть ID - используем как запасной вариант
        displayName = 'ID: ' + appState.userId.toString().substring(0, 8) + '...';
    } else {
        // Ничего нет - дефолтное значение
        displayName = '--';
    }

    nameElement.textContent = displayName;
    console.log('👤 User name display updated:', displayName);
}



export function updateUserBalanceDisplay(credits, reason = '') {
    if (credits !== null && credits !== undefined) {
        const newBalance = parseFloat(credits);
        const oldBalance = appState.userCredits;
        const timestamp = Date.now();

        // Добавляем запись в историю ДО обновления баланса
        appState.balanceHistory.push({
            balance: newBalance,
            timestamp: timestamp,
            reason: reason,
            previousBalance: oldBalance
        });

        // Ограничиваем историю до 100 последних записей
        if (appState.balanceHistory.length > 100) {
            appState.balanceHistory = appState.balanceHistory.slice(-100);
        }

        // Сохраняем историю в localStorage
        appState.saveBalanceHistory();

        // Обновляем текущий баланс
        appState.userCredits = newBalance;
        appState.lastBalanceUpdate = timestamp;
        appState.saveSettings(); // Сохраняем настройки в localStorage

        // Обновляем отображение в header
        const balanceElement = document.getElementById('userCreditsDisplay');
        if (balanceElement) {
            if (!isNaN(credits) && credits !== null) {
                balanceElement.textContent = parseFloat(credits).toLocaleString('en-US');
            } else {
                balanceElement.textContent = '--';
            }
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
export function toggleHistoryList() {
    const list = document.getElementById('historyList');
    const btn = document.getElementById('historyToggleBtn');

    if (list.classList.contains('hidden')) {
        // Открываем историю
        list.classList.remove('hidden');
        btn.classList.add('active');

        console.log('📂 History opened');

        // 🔥 ИСПРАВЛЕНИЕ: НЕ ОБНОВЛЯЕМ ДИСПЛЕЙ ПРИ ОТКРЫТИИ - ТОЛЬКО ЕСЛИ ИСТОРИЯ БЫЛА СКРЫТА!
        // Вместо постоянного обновления - показываем текущее состояние
        // updateHistoryDisplay не нужен здесь, так как превью уже создается при генерации

        // После открытия - прокручиваем к последней генерации
        setTimeout(() => {
            if (window.appState?.generationHistory?.length > 0) {
                console.log('📋 Scrolling to latest generation after open');
                scrollToLatestGeneration();
            }
        }, 100);

    } else {
        // Закрываем историю
        list.classList.add('hidden');
        btn.classList.remove('active');

        console.log('📂 History closed');
    }

    // Обновляем переключатель тем (учитывая новую высоту)
    updateThemeTogglePosition();

    console.log('📋 History toggle completed');
}

// Добавляем экспорт в window
window.toggleHistoryList = toggleHistoryList;

// Функция из app_modern.js - showHistory
export function showHistory() {
    toggleHistoryList();
}

// Функция из app_modern.js - showSubscriptionNotice
export function showSubscriptionNotice(result) {
    console.log('🔗 Full result object:', result);
    console.log('🔗 Payment URLs from result:', result.payment_urls);

    const modal = document.getElementById('limitModal');
    if (!modal) {
        console.error('❌ Modal not found!');
        return;
    }

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
    console.error('🚨 ПРОБЛЕМА ВЫЯВЛЕНА: 7 элементов с высоким Z-INDEX мешают модальному окну!');
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

    // Показать модальное окно
    modal.classList.add('show');

    // Helper function for safe redirections with error handling
    const safeRedirect = (url, planName) => {
        modal.classList.remove('show');
        showApp(); // Используем showApp из screen-manager
        setTimeout(() => {
            try {
                console.log(`🔗 Redirecting to ${planName} payment URL: ${url}`);
                // Try modern way first
                if (appState.tg && appState.tg.openLink) {
                    appState.tg.openLink(url);
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
    const upgradeBtn = document.getElementById('upgradeBtn'); // ЛИТЕ планируется как существующий
    const upgradeBtnPro = document.getElementById('upgradebtn_pro'); // ПРО новый
    const upgradeBtnStudio = document.getElementById('upgradebtn_studio'); // СТУДИО новый

    console.log('🔘 Upgrade buttons found:', !!upgradeBtn, !!upgradeBtnPro, !!upgradeBtnStudio);

    // Обработчик для ЛИТЕ тарифа (использует существующую кнопку upgradeBtn)
    if (upgradeBtn) {
        upgradeBtn.onclick = () => {
            console.log('🔘 LITE Upgrade button clicked');
            const paymentUrl = result.payment_urls?.lite || 'https://t.me/tribute/app?startapp=syDv';
            safeRedirect(paymentUrl, 'LITE');
        };
    }

    // Обработчик для ПРО тарифа (новая кнопка)
    if (upgradeBtnPro) {
        upgradeBtnPro.onclick = () => {
            console.log('🔘 PRO Upgrade button clicked');
            const paymentUrl = result.payment_urls?.pro || 'https://t.me/tribute/app?startapp=syDv';
            safeRedirect(paymentUrl, 'PRO');
        };
    }

    // Обработчик для СТУДИО тарифа (новая кнопка)
    if (upgradeBtnStudio) {
        upgradeBtnStudio.onclick = () => {
            console.log('🔘 STUDIO Upgrade button clicked');
            const paymentUrl = result.payment_urls?.studio || 'https://t.me/tribute/app?startapp=syDv';
            safeRedirect(paymentUrl, 'STUDIO');
        };
    }

    // Настроить кнопку закрытия
    const closeBtn = document.getElementById('closeLimitModal');
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.classList.remove('show');
            showApp(); // Используем showApp из screen-manager
        };
    }
}

// Функция из app_modern.js - showWarningAboutNoImage (упрощенная версия без конфликтов с импортами)
export async function showWarningAboutNoImage() {
    return new Promise((resolve) => {
        // Создаем оверлей и модал
        const overlay = document.createElement('div');
        overlay.id = 'photo-warning-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: var(--bg-primary, #ffffff);
            border-radius: 20px;
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            transform: translateY(20px);
            transition: transform 0.3s ease;
        `;

        modal.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 1rem;">
                <div style="font-size: 4rem; margin-bottom: 0.25rem; display: flex; align-items: center; justify-content: center;" class="photo-warning-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                </div>
            </div>
            <div style="text-align: center; margin-bottom: 1rem;">
                <h3 style="margin: 0 0 1rem 0; color: var(--text-primary, #333); font-size: 1.25rem; font-weight: 600;">Предупреждение</h3>
                <p style="margin: 0; color: var(--text-secondary, #666); font-size: 1rem; line-height: 1.5;">
                    Для лучшего результата в режиме Photo Session рекомендуется добавить изображение.
                </p>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button id="upload-image-btn" style="
                    flex: 1;
                    padding: 6px 6px;
                    background: linear-gradient(135deg, #7e94f7ff 0%, #1d5df3ff 100%);
                    color: white;
                    border: none;
                    border-radius: 34px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                ">
                    Загрузить изображение
                </button>
                <button id="continue-without-btn" style="
                    flex: 1;
                    padding: 6px 6px;
                    background: linear-gradient(135deg, #ee4c62ff 0%, #f72e48ff 100%);
                    color: white;
                    border: none;
                    border-radius: 34px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 15px rgba(245, 87, 108, 0.3);
                ">
                    Продолжить без фото
                </button>
            </div>
        `;

        // Добавляем эффекты hover для кнопок
        const style = document.createElement('style');
        style.textContent = `
            #upload-image-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
            }
            #continue-without-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(245, 87, 108, 0.5);
            }
        `;
        document.head.appendChild(style);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Анимация появления
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            modal.style.transform = 'translateY(0)';
        });

        // Обработчики кнопок
        const uploadBtn = modal.querySelector('#upload-image-btn');
        const continueBtn = modal.querySelector('#continue-without-btn');

        uploadBtn.addEventListener('click', () => {
            // Закрываем модал
            overlay.style.opacity = '0';
            modal.style.transform = 'translateY(20px)';
            setTimeout(() => {
                document.body.removeChild(overlay);
                document.head.removeChild(style);
                resolve(false); // false значит не продолжаем генерацию, пользователь пойдет загружать изображение
            }, 300);
        });

        continueBtn.addEventListener('click', () => {
            // Закрываем модал
            overlay.style.opacity = '0';
            modal.style.transform = 'translateY(20px)';
            setTimeout(() => {
                document.body.removeChild(overlay);
                document.head.removeChild(style);
                resolve(true); // true значит продолжаем генерацию
            }, 300);
        });

        // Закрытие по клику на оверлей
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.opacity = '0';
                modal.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    document.head.removeChild(style);
                    resolve(false); // Закрытие = отмена генерации
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
    const chooseBtn = document.getElementById('chooseUserImage');
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

// === ДОСТУПНЫЕ В ГЛОБАЛЬНОМ ОБЪЕКТЕ ===
window.toggleModeDetails = toggleModeDetails;

// Экспорт функций в глобальный scope для обратной совместимости
