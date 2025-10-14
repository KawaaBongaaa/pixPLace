// 🎯 Модуль личного кабинета pixPLace
// Импорт необходимых зависимостей
import { ru } from './dictionaries/ru.js';
import { en } from './dictionaries/en.js';

// Глобальное состояние для модуля
const userAccountState = {
    currentModal: null,
    financialHistoryPage: 1,
    creditPacksModal: null
};

// 🎯 Инициализация модуля личного кабинета
function initUserAccount() {
    console.log('🎯 Initializing User Account module');

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
}

// Функция показа модального окна с результатом генерации
function showGenerationResultModal(item) {
    // Проверяем существует ли уже модальное окно с результатом
    let modal = document.getElementById('generationResultModal');
    if (modal) {
        modal.remove();
    }

    // Определяем стиль по имени
    const getStyleName = (type) => {
        const modeMap = {
            'Nano Banana Editor': 'photo_session',
            'Flux Fast Generation': 'fast_generation',
            'Flux Pro Advanced': 'pixplace_pro',
            'Background Removal': 'background_removal',
            'Upscale Image': 'upscale_image',
            'Print on Demand': 'print_maker'
        };

        const mode = type in modeMap ? modeMap[type] : 'fast_generation';

        return mode;
    };

    modal = document.createElement('div');
    modal.id = 'generationResultModal';
    modal.className = 'generation-result-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeGenerationResultModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Результат генерации</h3>
                <button class="close-btn" onclick="closeGenerationResultModal()">✕</button>
            </div>
            <div class="modal-body">
                <div class="generation-result-container">
                    <div class="generation-result-image">
                        <img src="${item.imageUrl}" alt="Generated Image" class="result-full-image" loading="lazy" />
                    </div>
                    <div class="generation-result-details">
                        <div class="result-meta">
                            <div class="result-meta-item">
                                <span class="meta-label">Дата:</span>
                                <span class="meta-value">${new Date(item.date).toLocaleString()}</span>
                            </div>
                            <div class="result-meta-item">
                                <span class="meta-label">Режим:</span>
                                <span class="meta-value">${item.type}</span>
                            </div>
                            <div class="result-meta-item">
                                <span class="meta-label">Списано:</span>
                                <span class="meta-value amount-negative">${Math.abs(item.amount)} ${item.currency}</span>
                            </div>
                        </div>
                        <div class="result-prompt">
                            <div class="prompt-label">Промпт:</div>
                            <div class="prompt-text">${item.description}</div>
                        </div>
                        <div class="result-actions">
                            <button class="btn btn-primary download-result-btn" onclick="downloadResultImage('${item.imageUrl}', '${item.id}')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7,10 12,15 17,10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                Скачать
                            </button>
                            <button class="btn btn-secondary share-result-btn" onclick="shareResultImage('${item.imageUrl}', '${item.id}')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="18" cy="5" r="3" />
                                    <circle cx="6" cy="12" r="3" />
                                    <circle cx="18" cy="19" r="3" />
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                </svg>
                                Поделиться
                            </button>
                            <button class="btn btn-outline reuse-prompt-btn" onclick="reusePrompt('${item.description}', '${getStyleName(item.type)}')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polygon points="23,12 20.5,9.5 18,12 23,12" />
                                    <polygon points="1,12 3.5,14.5 6,12 1,12" />
                                    <rect x="2" y="3" rx="2" ry="2" width="20" height="8" />
                                </svg>
                                Повторить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Показываем модальное окно с анимацией
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);

    // Добавляем обработчик клавиши ESC для закрытия
    const handleEscapeKey = (event) => {
        if (event.key === 'Escape') {
            closeGenerationResultModal();
        }
    };

    document.addEventListener('keydown', handleEscapeKey);

    // Очищаем обработчик при закрытии модального окна
    const originalClose = closeGenerationResultModal;
    const closeWithCleanup = () => {
        document.removeEventListener('keydown', handleEscapeKey);
        originalClose();
    };

    // Переопределяем функцию закрытия для этого модального окна
    window.closeGenerationResultModal = closeWithCleanup;

    console.log('📸 Opened generation result modal for:', item.id);
}

// Функция закрытия модального окна с результатом
function closeGenerationResultModal() {
    console.log('🔒 Attempting to close generation result modal');
    const modal = document.getElementById('generationResultModal');
    if (modal) {
        console.log('✅ Found modal, removing show class');
        modal.classList.remove('show');
        setTimeout(() => {
            console.log('🗑️ Removing modal from DOM');
            modal.remove();
        }, 300);
    } else {
        console.log('❌ Modal not found');
    }
}

// Функция скачивания изображения результата
function downloadResultImage(imageUrl, itemId) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `pixplace-generation-${itemId}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('success', 'Изображение скачивается...');
}

// Функция поделиться результатом
function shareResultImage(imageUrl, itemId) {
    if (navigator.share) {
        // Используем Web Share API если доступно
        navigator.share({
            title: 'Мое AI изображение из pixPLace',
            text: 'Посмотрите на изображение, сгенерированное в pixPLace!',
            url: imageUrl
        }).catch(console.error);
    } else {
        // Фallback - копируем ссылку в буфер обмена
        navigator.clipboard.writeText(imageUrl).then(() => {
            showToast('info', 'Ссылка на изображение скопирована!');
        }).catch(() => {
            // Дополнительный fallback - открываем в новой вкладке
            window.open(imageUrl, '_blank');
        });
    }
}

// Функция повторения генерации с тем же промптом
function reusePrompt(prompt, mode) {
    // Закрываем оба модальных окна
    closeGenerationResultModal();
    closeFinancialHistoryModal();

    // Переходим к форме генерации
    showGeneration();

    // Устанавливаем промпт и режим после небольшой задержки
    setTimeout(() => {
        const promptInput = document.getElementById('promptInput');
        const modeSelect = document.getElementById('modeSelect');

        if (promptInput) {
            promptInput.value = prompt.replace('...', '').trim();
            promptInput.focus();
        }

        if (modeSelect) {
            modeSelect.value = mode;
            // Обновляем карусель режимов если она существует
            updateModeSelection(mode);
        }

        showToast('info', 'Промпт применен! Прокрутите вниз и нажмите Generate');
    }, 300);
}

// Вспомогательная функция для обновления выбора режима в карусели
function updateModeSelection(mode) {
    // Ищем кнопку режима в карусели
    const modeCards = document.querySelectorAll('.mode-card');
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
        // Обновление отображения данных пользователя
        updateUserMenuInfo();
        console.log('User menu toggled: visible');
    }
}

// Функция обновления данных в меню пользователя
function updateUserMenuInfo() {
    const nameElement = document.getElementById('userMenuName');
    const creditsElement = document.getElementById('userMenuCredits');

    if (nameElement) {
        nameElement.textContent = window.appState?.userName ||
                                 window.appState?.userUsername ||
                                 window.appState?.userId || '--';
    }

    if (creditsElement) {
        creditsElement.textContent = window.appState?.userCredits ?
                                    parseFloat(window.appState.userCredits).toLocaleString('en-US') : '--';
    }
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

// Функция открытия выбора тарифов
function openSubscriptionPlans() {
    if (window.showSubscriptionNotice) {
        // Используем существующую функцию для показа тарифов
        window.showSubscriptionNotice({
            payment_urls: {
                lite: 'https://example.com/lite',
                pro: 'https://example.com/pro',
                studio: 'https://example.com/studio'
            }
        });
    } else {
        showToast('error', 'Tariff selection not available');
    }
    toggleUserMenu(); // Скрываем меню
}

// Функция открытия Credit Packs
function openCreditPacks() {
    console.log('🔥 Opening credit packs modal');
    showCreditPacksModal();
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
        'photo_session': 'Nano Banana Editor',
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
    const modal = document.getElementById('financialHistoryModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
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
    const modal = document.getElementById('creditPacksModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Вспомогательная функция для показа тостов
function showToast(type, message) {
    if (window.showToast) {
        window.showToast(type, message);
    } else {
        console.log(`Toast (${type}): ${message}`);
    }
}

// Экспортируем функции в глобальную область видимости
window.toggleUserMenu = toggleUserMenu;
window.updateUserMenuInfo = updateUserMenuInfo;
window.openFinancialHistory = openFinancialHistory;
window.openSubscriptionPlans = openSubscriptionPlans;
window.openCreditPacks = openCreditPacks;
window.showFinancialHistoryModal = showFinancialHistoryModal;
window.closeFinancialHistoryModal = closeFinancialHistoryModal;
window.showCreditPacksModal = showCreditPacksModal;
window.closeCreditPacksModal = closeCreditPacksModal;
window.buyCreditPack = buyCreditPack;
window.showGenerationResultModal = showGenerationResultModal;
window.closeGenerationResultModal = closeGenerationResultModal;
window.downloadResultImage = downloadResultImage;
window.shareResultImage = shareResultImage;
window.reusePrompt = reusePrompt;

// Экспортируем функции модуля
export {
    initUserAccount,
    toggleUserMenu,
    updateUserMenuInfo,
    openFinancialHistory,
    openSubscriptionPlans,
    openCreditPacks,
    showFinancialHistoryModal,
    closeFinancialHistoryModal,
    showCreditPacksModal,
    closeCreditPacksModal,
    buyCreditPack
};

console.log('🎯 User Account module loaded and ready');

// 🎯 Инициализация модуля при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initUserAccount();
});

// Или если страница уже загружена
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUserAccount);
} else {
    initUserAccount();
}

// Экспорт инициализации в глобальную область для случаев ручного запуска
window.initUserAccount = initUserAccount;
