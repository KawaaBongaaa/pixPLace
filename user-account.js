// 🎯 Модуль личного кабинета pixPLace
// Импорт необходимых зависимостей
import { ru } from './dictionaries/ru.js';
import { en } from './dictionaries/en.js';
// Глобальное состояние для модуля
const userAccountState = {
    currentModal: null,
    financialHistoryPage: 1,
    creditPacksModal: null,
    isInitialized: false // Флаг предотвращения повторной инициализации
};

// 🔥 СЛУШАТЕЛЬ НА СМЕНУ ЯЗЫКА ДЛЯ МОДАЛЬНЫХ ОКОН
document.addEventListener('dictionary:language-changed', (event) => {
    const { newLang, oldLang } = event.detail;
    console.log('🌍 Dictionary language changed:', oldLang, '→', newLang, '- updating modals');

    // 🔄 ОБНОВЛЯЕМ ВСЕ ЭЛЕМЕНТЫ С ПЕРЕВОДАМИ В ОТКРЫТЫХ МОДАЛЬНЫХ ОКНАХ
    const openModals = document.querySelectorAll('.financial-history-modal, .credit-packs-modal, .generation-result-modal');

    if (openModals.length > 0) {
        console.log('📜 Found', openModals.length, 'open modals to update');

        openModals.forEach(modal => {
            // 🔥 ИСПРАВЛЕНИЕ: Обновляем стандартные элементы с data-i18n
            modal.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                const translation = window.appState?.translate?.(key) || key;
                element.textContent = translation;
            });

            // 🔥 ДОБАВЛЕНИЕ: Обновляем элементы с data-i18n-placeholder
            modal.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                const key = element.getAttribute('data-i18n-placeholder');
                const translation = window.appState?.translate?.(key) || key;
                element.placeholder = translation;
            });

            // 🔥 ОБНОВЛЯЕМ УНИКАЛЬНЫЕ ЭЛЕМЕНТЫ В ГЕНЕРАЦИОННОМ МОДАЛЬНОМ ОКНЕ
            if (modal.classList.contains('generation-result-modal')) {
                // Обновляем переводные элементы в модальном окне результата
                const translateElements = [
                    { selector: '.modal-header h3', key: 'generation_result_title' },
                    { selector: '.use-overlay-btn', key: 'use_for_generation' },
                    { selector: '[data-i18n-placeholder]', keys: ['date_label_modal', 'mode_label_modal', 'charged_label'] }
                ];

                translateElements.forEach(item => {
                    if (item.selector) {
                        const elements = modal.querySelectorAll(item.selector);
                        elements.forEach(el => {
                            if (el.hasAttribute('data-i18n')) {
                                const key = el.getAttribute('data-i18n');
                                const translation = window.appState?.translate?.(key) || key;
                                el.textContent = translation;
                            }
                        });
                    }
                });

                console.log('✅ Updated translations in generation result modal');
            }

            // 🔥 ОБНОВЛЯЕМ ЭЛЕМЕНТЫ В ФИНАНСОВОЙ ИСТОРИИ
            if (modal.classList.contains('financial-history-modal')) {
                // Перезагружаем финансовую историю
                loadFinancialHistory();
                console.log('✅ Refreshed financial history with new language');
            }
        });

        console.log('✅ All open modal translations updated successfully');
    } else {
        console.log('📜 No open modals to update');
    }
});

// 🎯 Инициализация модуля личного кабинета
function initUserAccount() {
    // Проверяем, была ли уже вызвана инициализация
    if (userAccountState.isInitialized) {
        console.log('🔄 User Account module already initialized, skipping');
        return;
    }

    console.log('🎯 Initializing User Account module');

    userAccountState.isInitialized = true; // Устанавливаем флаг инициализации

    // Добавляем обработчик клика на кнопку меню пользователя
    const userMenuBtn = document.getElementById('userMenuBtn');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', toggleUserMenu);
        console.log('✅ User menu button handler attached');
    } else {
        console.warn('⚠️ User menu button not found');
    }

    // Закрытие меню при клике вне его (с задержкой чтобы дать время на обработку)
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('userMenuDropdown');
        const btn = document.getElementById('userMenuBtn');
        const wrapper = document.getElementById('user-menu-wrapper');

        // Игнорируем клик если он только что был по кнопке
        if (menu && menu.classList.contains('show') &&
            !menu.contains(e.target) &&
            !btn.contains(e.target) &&
            (!wrapper || !wrapper.contains(e.target))) {
            // Небольшая задержка чтобы обработчик клика по кнопке успел отработать
            setTimeout(() => {
                const menuStillOpen = document.getElementById('userMenuDropdown');
                if (menuStillOpen && menuStillOpen.classList.contains('show')) {
                    menuStillOpen.classList.remove('show');
                    console.log('Menu closed by outside click');
                }
            }, 50);
        }
    });

    console.log('✅ User Account module initialized');

    // Auth menu button toggle
    const authBtn = document.getElementById('authBtn');
    const authMenu = document.getElementById('authMenu');
    if (authBtn && authMenu) {
        authBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            authMenu.classList.toggle('hidden');
            // Close language menu if open
            const langMenu = document.getElementById('langMenu');
            if (langMenu) langMenu.classList.add('hidden');
            // Close user menu if open
            const userMenu = document.getElementById('userMenuDropdown');
            if (userMenu) userMenu.classList.remove('show');
        });
        console.log('✅ Auth menu button handler attached');
    }

    // Close auth menu on outside click
    document.addEventListener('click', (e) => {
        if (authMenu && !authMenu.classList.contains('hidden') &&
            !authMenu.contains(e.target) && !authBtn?.contains(e.target)) {
            authMenu.classList.add('hidden');
        }
    });
}

async function downloadAndConvertImage(imageUrl, itemId) {
    console.log('🌐 Downloading external image for conversion:', imageUrl?.substring(0, 100) + '...');

    try {
        // Проверяем если это уже dataURL - используем напрямую
        if (imageUrl && imageUrl.startsWith('data:')) {
            console.log('✅ Image is already a dataURL, skipping conversion');
            return imageUrl;
        }

        // Загружаем изображение внешней ссылки
        const response = await fetch(imageUrl, {
            mode: 'cors',
            credentials: 'omit'
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to fetch image`);
        }

        const blob = await response.blob();
        const mimeType = blob.type || 'image/png';

        console.log('✅ Downloaded blob:', {
            size: blob.size,
            type: mimeType
        });

        // Конвертируем Blob в dataURL
        const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });

        console.log('✅ Converted to dataURL, length:', dataUrl.length);
        return dataUrl;

    } catch (error) {
        console.error('❌ Failed to download/convert image:', error);
        throw error;
    }
}

// Все функции модала перенесены в modals/generation-result-modal.js

// Вспомогательная функция для обновления выбора режима в карусели
function updateModeSelection(mode) {
    // Используем новый API из mode-cards.js если доступен
    if (window.modeCardsExports && window.modeCardsExports.selectModeByName) {
        console.log('🔄 Using mode-cards API to select mode:', mode);
        window.modeCardsExports.selectModeByName(mode);

        // Синхронизируем старый hidden select для совместимости
        const modeSelect = document.getElementById('modeSelect');
        if (modeSelect) {
            modeSelect.value = mode;
        }
    } else {
        // Fallback для старого метода карусели
        const modeCards = document.querySelectorAll('[data-mode]');
        modeCards.forEach(card => {
            const cardMode = card.getAttribute('data-mode');
            if (cardMode === mode) {
                // Кликаем по карточке режима чтобы активировать ее
                setTimeout(() => {
                    card.click();
                }, 50);
            }
        });
    }
}

// Вспомогательная функция для переключения на экран генерации
function showGeneration() {
    const generationScreen = document.getElementById('generationScreen');
    const currentScreen = document.querySelector('.screen.active');

    if (generationScreen && currentScreen && currentScreen.id !== 'generationScreen') {
        currentScreen.classList.remove('active');
        generationScreen.classList.add('active');

        // Обновляем атрибут текущего экрана
        const mainContent = document.querySelector('.main-content[data-current-screen]');
        if (mainContent) {
            mainContent.setAttribute('data-current-screen', 'generation');
        }

        console.log('Switched to generation screen');
    }
}

// Функция переключения меню пользователя
function toggleUserMenu() {
    const menu = document.getElementById('userMenuDropdown');
    if (!menu) return;

    const isVisible = menu.classList.contains('show');
    if (isVisible) {
        menu.classList.remove('show');
        console.log('User menu toggled: hidden');
    } else {
        menu.classList.add('show');
        // 🔥 НОВОЕ: Применяем Tailwind shadow класс для user-menu
        menu.classList.add('shadow-xl');
        // Закрываем другие меню
        const authMenu = document.getElementById('authMenu');
        if (authMenu) authMenu.classList.add('hidden');
        const langMenu = document.getElementById('langMenu');
        if (langMenu) langMenu.classList.add('hidden');
        // Обновление отображения данных пользователя
        updateUserMenuInfo();
        console.log('User menu toggled: visible');
    }
}

// Функция обновления данных в меню пользователя
function updateUserMenuInfo() {
    // Получаем элементы
    const dropdownNameElement = document.getElementById('userMenuNameFull');
    const balanceInfoElement = document.getElementById('userBalanceInfo');
    const creditsElement = document.getElementById('userMenuCredits');

    const isAuthenticated = !!window.appState?.userId;
    const userName = window.appState?.userName ||
        window.appState?.userUsername ||
        window.appState?.userId || 'User';

    // Заменяем содержимое dropdown в зависимости от состояния авторизации
    if (dropdownNameElement) {
        if (isAuthenticated) {
            dropdownNameElement.innerHTML = userName;
        } else {
            dropdownNameElement.innerHTML = 'Guest';
        }
    }

    // Управляем видимостью баланса - показываем только для авторизованных
    if (balanceInfoElement) {
        balanceInfoElement.style.display = isAuthenticated ? 'flex' : 'none';
    }

    // Обновляем кредиты
    if (creditsElement) {
        const credits = window.appState?.userCredits || 0;
        creditsElement.textContent = credits;
    }

    console.log('📋 User menu info updated:', { isAuthenticated, userName });
}

// Функция открытия истории списаний
function openFinancialHistory() {
    console.log('🔥 Opening financial history modal');
    showFinancialHistoryModal();
    // Скрываем меню с небольшой задержкой, чтобы модальное окно успело открыться
    setTimeout(() => {
        toggleUserMenu();
    }, 100);
}

// Модальное окно истории финансовых операций
function showFinancialHistoryModal() {
    // Проверяем существует ли уже модальное окно
    let modal = document.getElementById('financialHistoryModal');
    if (modal) {
        modal.remove();
    }

    modal = document.createElement('div');
    modal.id = 'financialHistoryModal';
    modal.className = 'financial-history-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeFinancialHistoryModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3 data-i18n="financial_history">История списаний</h3>
                <button class="close-btn" onclick="closeFinancialHistoryModal()">✕</button>
            </div>
            <div class="modal-body">
                <div id="financial-history-list" class="financial-history-list">
                    <!-- Истории будут загружаться динамически -->
                </div>
                <div id="financial-history-loader" class="history-loader hidden">
                    <div class="loader"></div>
                    <p data-i18n="loading">Загрузка...</p>
                </div>
                <div id="financial-history-empty" class="empty-history hidden">
                    <div class="empty-icon">💳</div>
                    <p data-i18n="no_financial_history">История списаний пуста</p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Показываем модальное окно
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);

    // Загружаем историю с lazy loading
    loadFinancialHistory();
}

// Функция загрузки финансовой истории с lazy loading
function loadFinancialHistory(page = 1, limit = 20) {
    const historyList = document.getElementById('financial-history-list');
    const loader = document.getElementById('financial-history-loader');
    const empty = document.getElementById('financial-history-empty');

    if (!historyList) return;

    // Показываем загрузку
    loader.classList.remove('hidden');
    empty.classList.add('hidden');

    // Имитируем загрузку данных (в реальности здесь будет API запрос)
    setTimeout(() => {
        const mockHistory = generateMockFinancialHistory();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const pageData = mockHistory.slice(startIndex, endIndex);

        if (page === 1) {
            historyList.innerHTML = '';
        }

        if (pageData.length === 0) {
            if (page === 1) {
                empty.classList.remove('hidden');
            }
            loader.classList.add('hidden');
            return;
        }

        pageData.forEach(item => {
            const historyItem = createFinancialHistoryItem(item);
            historyList.appendChild(historyItem);
        });

        // Если есть еще данные, добавляем кнопку "Загрузить ещё"
        if (mockHistory.length > endIndex) {
            const loadMoreBtn = document.createElement('button');
            loadMoreBtn.className = 'load-more-financial-btn';
            loadMoreBtn.textContent = 'Загрузить ещё...';
            loadMoreBtn.onclick = () => {
                loadMoreBtn.remove();
                loadFinancialHistory(page + 1, limit);
            };
            historyList.appendChild(loadMoreBtn);
        }

        loader.classList.add('hidden');
    }, 1000); // Имитация задержки API
}

// Функция создания элемента финансовой истории
function createFinancialHistoryItem(item) {
    const element = document.createElement('div');
    element.className = 'financial-history-item history-item-clickable';

    const isPositive = item.amount > 0;

    element.innerHTML = `
        <div class="history-item-header">
            <div class="history-item-date">${new Date(item.date).toLocaleString()}</div>
            <div class="history-item-amount ${isPositive ? 'positive' : 'negative'}">
                ${isPositive ? '+' : ''}${item.amount} ${item.currency}
            </div>
        </div>
        <div class="history-item-details">
            <div class="history-item-type">${item.type}</div>
            <div class="history-item-description">${item.description}</div>
            ${item.imageUrl ? `<img src="${item.imageUrl}" alt="Generated" class="history-item-preview" loading="lazy">` : ''}
        </div>
    `;

    // Добавляем обработчик клика для показа модального окна с результатом
    if (item.imageUrl) {
        element.style.cursor = 'pointer';
        element.addEventListener('click', () => {
            showGenerationResultModal(item);
        });

        // Добавляем hover-эффекты
        element.addEventListener('mouseenter', () => {
            element.classList.add('history-item-hover');
        });

        element.addEventListener('mouseleave', () => {
            element.classList.remove('history-item-hover');
        });
    }

    return element;
}

// Функция генерации моковых данных финансовой истории
function generateMockFinancialHistory() {
    const mockData = [];
    const currentDate = new Date();

    // Используем историю генераций из appState если доступна
    const generationHistory = window.appState?.generationHistory || [];

    // Создаем записи на основе реальных генераций
    generationHistory.forEach((gen, index) => {
        const date = new Date(gen.timestamp);
        const cost = gen.generation_cost || gen.cost || -10; // отрицательные для списаний

        mockData.push({
            id: `hist_${gen.id}`,
            date: date.toISOString(),
            amount: parseFloat(cost),
            currency: 'Cr',
            type: getModeDisplayName(gen.mode),
            description: gen.prompt ? `${gen.prompt.substring(0, 50)}...` : 'Генерация изображения',
            imageUrl: gen.result || null
        });
    });

    // Если истории генераций мало, добавляем дополнительные моковые данные
    if (mockData.length < 25) {
        for (let i = mockData.length; i < 25; i++) {
            const date = new Date(currentDate);
            date.setDate(date.getDate() - i);
            date.setHours(Math.floor(Math.random() * 24));
            date.setMinutes(Math.floor(Math.random() * 60));

            const modes = [
                'Flux Fast Generation',
                'Nano Banana Editor',
                'Flux Pro Advanced',
                'Background Removal',
                'Upscale Image'
            ];

            const mode = modes[Math.floor(Math.random() * modes.length)];

            const amounts = [-5, -10, -15, -20, -25, -50, 100, 250];
            const amount = amounts[Math.floor(Math.random() * amounts.length)];

            const descriptions = [
                'Генерация изображения в высоком качестве',
                'Обработка фотографии с эффектами',
                'Премиум генерация с расширенными опциями',
                'Удаление фона с сохранением качества',
                'Увеличение разрешения изображения до 4K',
                'Пополнение баланса кредитов'
            ];

            const description = descriptions[Math.floor(Math.random() * descriptions.length)];

            mockData.push({
                id: `hist_mock_${i}`,
                date: date.toISOString(),
                amount: amount,
                currency: 'Cr',
                type: mode,
                description: description,
                imageUrl: amount < 0 ? `https://picsum.photos/100?random=${i}` : null
            });
        }
    }

    return mockData.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Функция получения читаемого названия режима
function getModeDisplayName(mode) {
    const modeNames = {
        'nano_banana': 'Nano Banana Editor',
        'fast_generation': 'Flux Fast Generation',
        'pixplace_pro': 'Flux Pro Advanced',
        'background_removal': 'Background Removal',
        'upscale_image': 'Upscale Image',
        'print_maker': 'Print on Demand'
    };

    return modeNames[mode] || mode;
}

// Функция закрытия модального окна финансовой истории
function closeFinancialHistoryModal() {
    console.log('🔒 Attempting to close financial history modal');
    const modal = document.getElementById('financialHistoryModal');
    if (modal) {
        console.log('✅ Found financial history modal, removing show class');
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    } else {
        console.log('⚠️ Financial history modal not found - may not be created yet');
    }
}

// Модальное окно выбора Credit Packs
function showCreditPacksModal() {
    // Проверяем существует ли уже модальное окно
    let modal = document.getElementById('creditPacksModal');
    if (modal) {
        modal.remove();
    }

    modal = document.createElement('div');
    modal.id = 'creditPacksModal';
    modal.className = 'credit-packs-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeCreditPacksModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3 data-i18n="choose_credit_pack">Выбрать Credit Pack</h3>
                <button class="close-btn" onclick="closeCreditPacksModal()">✕</button>
            </div>
            <div class="modal-body">
                <div class="credit-packs-grid">
                    <!-- Credit Pack 250 -->
                    <div class="credit-pack-card" data-amount="250">
                        <div class="pack-header">
                            <div class="pack-amount">250</div>
                            <div class="pack-label" data-i18n="credits">Credits</div>
                        </div>
                        <div class="pack-price">
                            <span class="price">€2.99</span>
                        </div>
                        <button class="btn btn-primary buy-pack-btn" onclick="buyCreditPack(250)">
                            <span class="btn-text" data-i18n="buy_now">Купить</span>
                        </button>
                    </div>

                    <!-- Credit Pack 500 -->
                    <div class="credit-pack-card" data-amount="500">
                        <div class="pack-header">
                            <div class="pack-amount">500</div>
                            <div class="pack-label" data-i18n="credits">Credits</div>
                        </div>
                        <div class="pack-price">
                            <span class="price">€4.99</span>
                        </div>
                        <button class="btn btn-primary buy-pack-btn" onclick="buyCreditPack(500)">
                            <span class="btn-text" data-i18n="buy_now">Купить</span>
                        </button>
                    </div>

                    <!-- Credit Pack 1000 -->
                    <div class="credit-pack-card popular" data-amount="1000">
                        <div class="pack-badge" data-i18n="most_popular_pack">Популярный</div>
                        <div class="pack-header">
                            <div class="pack-amount">1000</div>
                            <div class="pack-label" data-i18n="credits">Credits</div>
                        </div>
                        <div class="pack-price">
                            <span class="price">€7.99</span>
                        </div>
                        <button class="btn btn-primary buy-pack-btn" onclick="buyCreditPack(1000)">
                            <span class="btn-text" data-i18n="buy_now">Купить</span>
                        </button>
                    </div>

                    <!-- Credit Pack 2000 -->
                    <div class="credit-pack-card" data-amount="2000">
                        <div class="pack-header">
                            <div class="pack-amount">2000</div>
                            <div class="pack-label" data-i18n="credits">Credits</div>
                        </div>
                        <div class="pack-price">
                            <span class="price">€12.99</span>
                        </div>
                        <button class="btn btn-primary buy-pack-btn" onclick="buyCreditPack(2000)">
                            <span class="btn-text" data-i18n="buy_now">Купить</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Показываем модальное окно
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);

    userAccountState.creditPacksModal = modal;
}

// Функция покупки Credit Pack
function buyCreditPack(amount) {
    const packUrls = {
        250: 'https://example.com/buy-250',
        500: 'https://example.com/buy-500',
        1000: 'https://example.com/buy-1000',
        2000: 'https://example.com/buy-2000'
    };

    const url = packUrls[amount] || 'https://t.me/tribute/app?start=credits';
    window.open(url, '_blank');

    closeCreditPacksModal();
    showToast('info', `Открыта страница покупки ${amount} кредитов`);
}

// Функция закрытия модального окна Credit Packs
function closeCreditPacksModal() {
    console.log('🔒 Attempting to close credit packs modal');
    const modal = document.getElementById('creditPacksModal');
    if (modal) {
        console.log('✅ Found credit packs modal, removing show class');
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    } else {
        console.log('⚠️ Credit packs modal not found - may not be created yet');
    }
}

// Функция showToast удалена - теперь используется window.showToast из screen-manager.js

async function convertToBlob(imageUrl) {
    return new Promise((resolve, reject) => {
        // Создаем изображение для загрузки с CORS
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            // Создаем canvas для преобразования в blob
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            // Рисуем изображение на canvas
            ctx.drawImage(img, 0, 0);

            // Конвертируем в blob
            canvas.toBlob(resolve, 'image/png');
        };

        img.onerror = (error) => {
            console.warn('CORS blocked image loading, trying fetch method...', error);
            // Попытка загрузки через fetch как альтернативу
            fetch(imageUrl, {
                mode: 'cors',
                credentials: 'omit'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('CORS blocked');
                    }
                    return response.blob();
                })
                .then(resolve)
                .catch(reject);
        };

        img.src = imageUrl;
    });
}

// Все функции модала перенесены в modals/generation-result-modal.js

// Функция обработки клика на кнопку Sign In в dropdown (через Telegram Bot)
function handleSignInClick() {
    console.log('🔐 Sign In via Telegram Bot clicked');
    // Close auth menu
    const authMenu = document.getElementById('authMenu');
    if (authMenu) authMenu.classList.add('hidden');

    // Открываем модалку авторизации через бота
    if (typeof loadTelegramAuthModal === 'function') {
        loadTelegramAuthModal();
    } else if (typeof window.loadTelegramAuthModal === 'function') {
        window.loadTelegramAuthModal();
    } else {
        console.warn('⚠️ loadTelegramAuthModal not available');
    }
}

// 🔐 Вход через Telegram OAuth (redirect на сайт)
function handleTelegramOAuth() {
    console.log('🔐 Telegram OAuth clicked');
    const authMenu = document.getElementById('authMenu');
    if (authMenu) authMenu.classList.add('hidden');

    window.open('https://prompt.pixplace.space/pixplace-ai-app/', '_blank');
}

// ✉️ Вход через Email (placeholder)
function handleEmailLogin() {
    console.log('✉️ Email login clicked');
    const authMenu = document.getElementById('authMenu');
    if (authMenu) authMenu.classList.add('hidden');

    // TODO: реализовать email auth flow
    if (typeof window.showToast === 'function') {
        window.showToast('info', 'Email login coming soon!');
    }
}

// Экспортируем функции в глобальную область видимости
window.toggleUserMenu = toggleUserMenu;
window.updateUserMenuInfo = updateUserMenuInfo;
window.openFinancialHistory = openFinancialHistory;
window.showFinancialHistoryModal = showFinancialHistoryModal;
window.closeFinancialHistoryModal = closeFinancialHistoryModal;
window.showCreditPacksModal = showCreditPacksModal;
window.closeCreditPacksModal = closeCreditPacksModal;
window.buyCreditPack = buyCreditPack;
window.handleSignInClick = handleSignInClick;
window.handleTelegramOAuth = handleTelegramOAuth;
window.handleEmailLogin = handleEmailLogin;

// Экспортируем функции модуля
export {
    initUserAccount,
    toggleUserMenu,
    updateUserMenuInfo,
    openFinancialHistory,
    showFinancialHistoryModal,
    closeFinancialHistoryModal,
    showCreditPacksModal,
    closeCreditPacksModal,
    buyCreditPack
};

console.log('🎯 User Account module loaded and ready');

// 🎯 Инициализация модуля при загрузке страницы - только один вызов
document.addEventListener('DOMContentLoaded', () => {
    initUserAccount();
});

// Экспорт инициализации в глобальную область для случаев ручного запуска (с защитой от дублирования)
window.initUserAccount = initUserAccount;
