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

// Функция показа модального окна с результатом генерации
function showGenerationResultModal(item) {
    // Проверяем существует ли уже модальное окно с результатом
    let modal = document.getElementById('generationResultModal');
    if (modal) {
        modal.remove();
    }

    // 🔥 ИСПРАВЛЕНИЕ: Обработка различных полей для изображения
    // Из истории приходит объект с полем 'result', из финансовой истории - 'imageUrl'
    // Приоритет отдаем dataUrl, затем проверяем историю генераций
    let imageSource = item.dataUrl || item.result || item.imageUrl;

    // 🔥 ДОПОЛНИТЕЛЬНЫЙ ПРОВЕРКА: Если изображение внешнее, попробуем найти его в истории генераций
    if (!imageSource.startsWith?.('data:')) {
        const generationHistory = window.appState?.generationHistory || [];
        const foundGen = generationHistory.find(gen => gen.id === item.id);

        if (foundGen?.dataUrl && foundGen.dataUrl.startsWith('data:')) {
            imageSource = foundGen.dataUrl;
            console.log('✅ Found dataUrl for modal from generation history');
        } else {
            console.log('❌ No dataUrl found in history, using external URL');
        }
    }

    const safeDescription = item.prompt || item.description || 'Без описания';

    // 🔥 ИСПРАВЛЕНИЕ: Правильная дата из объекта item
    const itemDate = item.timestamp ? new Date(item.timestamp) :
                   item.date ? new Date(item.date) :
                   new Date();

    // 🔥 ИСПРАВЛЕНИЕ: Правильное преобразование режима для кнопки повторения
    const getStyleName = (type) => {
        const modeMap = {
            'photo_session': 'photo_session',
            'fast_generation': 'fast_generation',
            'pixplace_pro': 'pixplace_pro',
            'background_removal': 'background_removal',
            'upscale_image': 'upscale_image',
            'print_maker': 'print_maker'
        };

        // Для объектов из истории используем item.mode, иначе item.type
        const mode = item.mode || item.type || 'fast_generation';
        return mode in modeMap ? mode : 'fast_generation';
    };

    // 🔥 ИСПРАВЛЕНИЕ: Безопасная обработка суммы списания
    const costAmount = item.generation_cost || item.cost || item.amount || -10;
    const currency = item.cost_currency || item.currency || 'Cr';

    modal = document.createElement('div');
    modal.id = 'generationResultModal';
    modal.className = 'generation-result-modal';
    modal.setAttribute('data-theme-modal', 'true');
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeGenerationResultModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${window.appState?.translate?.('generation_result_title') || 'Generation Result'}</h3>
                <button class="close-btn" onclick="closeGenerationResultModal()">✕</button>
            </div>
            <div class="modal-body">
                    <div class="generation-result-container">
                        <!-- Кнопка закрытия модала на мобильных -->
                        <button class="mobile-modal-close" onclick="closeGenerationResultModal()" style="display: none;" id="mobileModalClose">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        <div class="generation-result-image-container">
                            <div class="image-wrapper-relative">
                                <div class="img-positioning-container">
                                    <div class="img-relative-div">
                                        <img src="${imageSource}" alt="Generated Image" class="result-full-image" loading="lazy" />
                                        <div class="image-overlay">
                                            <button class="overlay-btn download-btn" onclick="downloadResultImage('${imageSource}', '${item.id}')">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                    <polyline points="7,10 12,15 17,10" />
                                                    <line x1="12" y1="15" x2="12" y2="3" />
                                                </svg>
                                            </button>
                                            <button class="overlay-btn share-btn" onclick="shareResultImage('${imageSource}', '${item.id}')">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <circle cx="18" cy="5" r="3" />
                                                    <circle cx="6" cy="12" r="3" />
                                                    <circle cx="18" cy="19" r="3" />
                                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="image-overlay-bottom">
                                        <button class="use-overlay-btn" onclick="useImageForGeneration('${imageSource}', '${item.id}')">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M14.828 14.828a4 4 0 0 1-5.656 0"/>
                                                <path d="M9 10h1.586a1 1 0 0 1 .707.293l.707.707A1 1 0 0 0 12.414 11H15m-3-3V6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1m-4 4V9"/>
                                                <circle cx="5" cy="19" r="2"/>
                                                <path d="M5 15V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2"/>
                                            </svg>
                                            ${window.appState?.translate?.('use_for_generation') || 'Use for Generation'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="result-prompt-container">
                            <div class="prompt-input-row">
                                <button class="reuse-prompt-btn theme-colored" onclick="reusePrompt('${safeDescription.replace(/'/g, "\\'")}', '${getStyleName('')}')" title="${window.appState?.translate?.('reuse_prompt_title') || 'Repeat generation with this prompt'}">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                                        <polyline points="17,1 21,5 17,9"></polyline>
                                        <path d="M3,11V9a4,4,0,0,1,4-4h14"></path>
                                        <polyline points="7,23 3,19 7,15"></polyline>
                                        <path d="M21,13v2a4,4,0,0,1-4,4H3"></path>
                                    </svg>
                                </button>
                                <div class="prompt-text-area">
                                    <div class="prompt-label">${window.appState?.translate?.('prompt_label_modal') || 'Prompt:'}</div>
                                   <div class="prompt-text">${safeDescription}</div>
                                </div>
                            </div>
                        </div>

                    <div class="generation-result-details">
                        <div class="result-meta">
                            <div class="result-meta-item">
                                <span class="meta-label">${window.appState?.translate?.('date_label') || 'Date:'}</span>
                                <span class="meta-value">${itemDate.toLocaleString()}</span>
                            </div>
                            <div class="result-meta-item">
                                <span class="meta-label">${window.appState?.translate?.('mode_label_modal') || 'Mode:'}</span>
                                <span class="meta-value">${window.appState?.translate?.('mode_' + getStyleName('') || getStyleName('')) || 'AI Generation'}</span>
                            </div>
                            <div class="result-meta-item">
                                <span class="meta-label">${window.appState?.translate?.('charged_label') || 'Charged:'}</span>
                                <span class="meta-value amount-negative">${Math.abs(costAmount)} ${currency}</span>
                            </div>
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

        // Показываем кнопку закрытия модала на мобильных устройствах
        const mobileCloseBtn = document.getElementById('mobileModalClose');
        if (mobileCloseBtn && window.innerWidth <= 768) {
            mobileCloseBtn.style.display = 'flex';
        }
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

    console.log('📸 Opened generation result modal for:', item.id, {
        imageSource,
        description: safeDescription,
        mode: getStyleName('')
    });
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

    showToast('success', window.appState?.translate?.('image_downloading') || 'Image downloading...');
}

// Функция поделиться результатом
function shareResultImage(imageUrl, itemId) {
    if (navigator.share) {
        // Используем Web Share API если доступно
        navigator.share({
            title: window.appState?.translate?.('share_title') || 'My AI image from pixPLace',
            text: window.appState?.translate?.('share_text') || 'Look at this AI-generated image from pixPLace!',
            url: imageUrl
        }).catch(console.error);
    } else {
        // Fallback - копируем ссылку в буфер обмена
        navigator.clipboard.writeText(imageUrl).then(() => {
            showToast('info', window.appState?.translate?.('link_copied') || 'Link copied to clipboard!');
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

        showToast('info', window.appState?.translate?.('prompt_applied') || 'Prompt applied! Scroll down and click Generate');
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

// Функция использования изображения для генерации - С ПОИСКОМ DATAURL В ИСТОРИИ
async function useImageForGeneration(imageUrl, itemId) {
    console.log('🎯 Starting image usage for generation, itemId:', itemId, 'URL:', imageUrl?.substring(0, 50) + '...');

    // Закрываем модальное окно с результатом
    closeGenerationResultModal();

    // Переходим к экрану генерации
    showGeneration();

    // Показываем индикатор загрузки
    const originalImageUrl = imageUrl;

    let processedImageUrl = imageUrl;

    try {
        // 🔥 КРАЙНЕ ПРОСТОЕ РЕШЕНИЕ БЕЗ CORS ПРОБЛЕМ:
        // Просто добавляем изображение в состояние И создаем превью напрямую!

        setTimeout(async () => {
            try {
                console.log('🎯 Adding image directly to UI - bypassing cors issues');

                // 🔥 ЧИСТКА: Подготовка к добавлению нового изображения
                if (window.userImageState) {
                    window.userImageState.images = [];
                    console.log('✅ Cleared userImageState manually');
                }

                const previewContainer = document.getElementById('previewContainer');
                if (previewContainer) {
                    previewContainer.innerHTML = '';
                    console.log('✅ Cleared DOM preview container');
                }

                const preview = document.getElementById('userImagePreview');
                if (preview) {
                    // Убираем display, но НЕ добавляем hidden - пусть создастся без классов
                    preview.style.removeProperty('display');
                    console.log('✅ Reset preview container display property only');
                }

                const wrapper = document.getElementById('userImageWrapper');
                if (wrapper) {
                    wrapper.classList.remove('has-image');
                    wrapper.classList.add('need-image');
                    console.log('✅ Reset wrapper classes');
                }

                // 🔥 СОЗДАЕМ ОБЪЕКТ ИЗОБРАЖЕНИЯ ДЛЯ СОСТОЯНИЯ
                const imageId = 'history_' + Date.now() + Math.random().toString(36).substr(2, 9);
                const imageObj = {
                    id: imageId,
                    file: null, // Нет файла, но есть dataUrl
                    dataUrl: processedImageUrl,
                    uploadedUrl: null
                };

                window.userImageState.images.push(imageObj);
                console.log(`📦 Added history image to userImageState: ${imageObj.id}`);

                // 🔥 СОЗДАЕМ ПРЕВЬЮ ТАК ЖЕ, КАК В createPreviewItem В app_modern.js
                createPreviewItem(imageId, processedImageUrl, 'History Image');
                console.log('✅ Created preview element using same logic as upload button');

                // 🔥 ОБНОВЛЯЕМ ВИДИМОСТЬ UI (с двойным обеспечением)
                setTimeout(() => {
                    if (window.updateImageUploadVisibility) {
                        window.updateImageUploadVisibility();
                        console.log('✅ First UI visibility update');
                    }

                    // 🔥 ДОПОЛНИТЕЛЬНЫЙ ОБЕСПЕЧИВАЮЩИЙ ВЫЗОВ для гарантированного скрытия кнопки
                    setTimeout(() => {
                        if (window.updateImageUploadVisibility) {
                            window.updateImageUploadVisibility();
                            console.log('✅ Second UI visibility update (safety check)');
                        }

                // 🔥 АГРЕССИВНАЯ ОЧИСТКА АНИМАЦИЙ С КНОПКИ ЗАГРУЗКИ
                        const chooseBtn = document.getElementById('chooseUserImage');
                        if (chooseBtn) {
                            // Убираем все возможные анимации
                            chooseBtn.style.animation = '';
                            chooseBtn.style.animationName = '';
                            chooseBtn.style.animationDuration = '';
                            chooseBtn.style.animationDelay = '';
                            chooseBtn.style.animationIterationCount = '';

                            // Убираем CSS классы анимации если есть
                            chooseBtn.classList.remove('need-image-pulse', 'blink', 'flashing', 'upload-blink');

                            // 🔥 ДОПОЛНИТЕЛЬНАЯ ЗАЩИТА - ФОРСИРОВАННО ПРЯЧЕМ КНОПКУ
                            chooseBtn.style.setProperty('display', 'none', 'important');
                            chooseBtn.classList.add('flux-shnel-hidden');

                            console.log('🔧 Force cleared all animations and HIDDEN upload button permanently');
                        }
                    }, 50);

                    // 🔥 ДОБАВИТЬ: ЕСЛИ ПРЕВЬЮ ЕЩЁ НЕ ПОКАЗАНОСЬ - ЯВНО СНЯТЬ КЛАССЫ HIDDEN
                    setTimeout(() => {
                        const finalPreview = document.getElementById('userImagePreview');
                        if (finalPreview) {
                            finalPreview.classList.remove('hidden', 'flux-shnel-hidden');
                            finalPreview.style.setProperty('display', 'block', 'important');
                            console.log('✅ Explicitly showed preview container with !important');
                        }

                        // 🔥 ДОБАВИТЬ: ДВОЙНАЯ ПРОВЕРКА ДЛЯ ГАРАНТИРОВАННОГО СКРЫТИЯ КНОПКИ
                        const finalChooseBtn = document.getElementById('chooseUserImage');
                        if (finalChooseBtn) {
                            finalChooseBtn.style.setProperty('display', 'none', 'important');
                            finalChooseBtn.classList.add('flux-shnel-hidden');
                            console.log('✅ Double-check: upload button hidden via CSS !important');
                        }
                    }, 150);

                    // 🔥 ОБНОВЛЯЕМ СЧЕТЧИК ИЗОБРАЖЕНИЙ
                    if (window.updateInnerUploadButtonVisibility) {
                        window.updateInnerUploadButtonVisibility();
                        console.log('✅ Updated inner button visibility');
                    }

                    // 🔥 ДОБАВИТЬ: Автоматический выбор режима photo_session (Nano Banana) при работе с изображениями
                    setTimeout(() => {
                        const modeSelect = document.getElementById('modeSelect');
                        if (modeSelect && modeSelect.value !== 'photo_session') {
                            modeSelect.value = 'photo_session';
                            console.log('🔄 Auto-switched to photo_session mode for image editing');

                            // Обновляем режим в глобальном состоянии
                            if (window.appState) {
                                window.appState.currentMode = 'photo_session';
                            }

                            // Синхронизируем с каруселью режимов - найдем и кликнем карточку photo_session
                            const photoSessionCard = document.querySelector('.mode-card[data-mode="photo_session"]');
                            if (photoSessionCard) {
                                photoSessionCard.click();
                                console.log('✅ Mode carousel synchronized with photo_session');
                            }
                        } else {
                            console.log('✅ Mode already set to photo_session or select not found');
                        }
                    }, 200);
                }, 100);

                // УСПЕХ!
                showToast('success', window.appState?.translate?.('image_added_success') || 'Image added for generation!');
                console.log('✅ Image successfully added using direct UI manipulation');

                // Прокручиваем к превью + финальное обновление UI
                setTimeout(() => {
                    const preview = document.getElementById('userImagePreview');
                    if (preview) {
                        preview.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }

                    // 🔥 ФИНАЛЬНЫЙ ЗАЩИТНЫЙ ОБЕСПЕЧИВАЮЩИЙ ВЫЗОВ
                    if (window.updateImageUploadVisibility) {
                        window.updateImageUploadVisibility();
                        console.log('✅ Final safety UI update completed');
                    }
                }, 800);

            } catch (error) {
                console.error('❌ UI manipulation error:', error);
                showToast('error', `${window.appState?.translate?.('ui_error_message') || 'Interface error:'} ${error.message}`);
            }
        }, 300);

    } catch (error) {
        console.error('❌ Setup error:', error);
        showToast('error', 'Ошибка подготовки: ' + error.message);
    }
}

// Вспомогательная функция для удаления изображения из состояния
function removeImageFromState(imageId) {
    if (window.userImageState?.images) {
        window.userImageState.images = window.userImageState.images.filter(img => img.id !== imageId);
    }

    // Удаляем из DOM
    const item = document.querySelector(`[data-id="${imageId}"]`);
    if (item) item.remove();
}

// 🔥 ИСПРАВЛЕНИЕ: Использование глобального userImageState из app_modern.js для совместимости
function clearAllImages() {
    console.log('🔥 Clearing all existing images for history integration');

    // Теперь функция очищает глобальное состояние userImageState из app_modern.js
    console.log('🔥 Clearing all existing images for history integration');

    // 1. Очищаем состояние изображений
    if (window.userImageState?.images) {
        window.userImageState.images = [];
        console.log('✅ Cleared userImageState.images array');
    }

    // 2. Очищаем DOM элементы превью
    const previewContainer = document.getElementById('previewContainer');
    if (previewContainer) {
        previewContainer.innerHTML = '';
        console.log('✅ Cleared DOM preview container');
    }

    // 3. Скрываем превью контейнер
    const preview = document.getElementById('userImagePreview');
    if (preview) {
        preview.classList.add('hidden', 'flux-shnel-hidden');
        preview.style.removeProperty('display'); // Убираем принудительное display
        console.log('✅ Hidden preview container');
    }

    // 4. Сбрасываем классы wrapper
    const wrapper = document.getElementById('userImageWrapper');
    if (wrapper) {
        wrapper.classList.remove('has-image');
        wrapper.classList.add('need-image');
        console.log('✅ Reset wrapper classes');
    }

    // 5. Сбрасываем input file
    const fileInput = document.getElementById('userImage');
    if (fileInput) {
        fileInput.value = ''; // Сбрасываем выбранный файл
        console.log('✅ Reset file input');
    }

    console.log('🎯 All images cleared successfully');
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
window.useImageForGeneration = useImageForGeneration;

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
    buyCreditPack,
    useImageForGeneration
};

console.log('🎯 User Account module loaded and ready');

// 🎯 Инициализация модуля при загрузке страницы - только один вызов
document.addEventListener('DOMContentLoaded', () => {
    initUserAccount();
});

// Экспорт инициализации в глобальную область для случаев ручного запуска (с защитой от дублирования)
window.initUserAccount = initUserAccount;
