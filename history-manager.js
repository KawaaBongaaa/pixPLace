// 🎯 Модуль управления историей генераций pixPLace
// Импорт необходимых зависимостей
// Импорт убрано - globalHistoryLoader доступен через window

class HistoryManagement {
    constructor() {
        // Связь с globalHistoryLoader через window
        this.globalHistoryLoader = null; // Будет инициализирована позже
        console.log('📋 HistoryManagement initialized');
    }

    // Глобальные переменные для отслеживания страниц
    static currentPage = 0;
    static maxLoadedPage = 0;
    static isLoadingPage = false;

    // Функция для обновления миниатюры после получения результата
    async updateHistoryItemWithImage(generationId, imageUrl) {
        const loadingItem = document.getElementById(`loading-${generationId}`);
        if (!loadingItem) {
            console.warn(`❌ Loading item for generation ${generationId} not found`);
            return;
        }

        // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: МЕНЯЕМ ID ЭЛЕМЕНТА ДЛЯ ПРЕДОТВРАЩЕНИЯ ДУБЛИКАТОВ
        loadingItem.id = `history-${generationId}`;
        console.log(`🔧 Changed loading item ID from loading-${generationId} to history-${generationId}`);
        console.log('🎯 == GEN COMPLETE UPDATE == replacing loading cover with real image');

        // 🎨 НОВАЯ ЛОГИКА: ЗАМЕНЯЕМ ВСЮ ОБЛОЖКУ на реальное изображение
        console.log('🔄 Replacing loading cover with real image for:', generationId);

        // Убираем класс history-loading (теперь это завершенная генерация)
        loadingItem.classList.remove('history-loading');

        // Создаем элемент реального изображения
        const realImage = document.createElement('img');
        realImage.className = 'lazy-loading loaded'; // сразу отмечаем как загруженный
        realImage.src = imageUrl;
        realImage.alt = 'Generated image';
        realImage.loading = 'lazy';
        realImage.decoding = 'async';

        // ⚡ НЕМЕДЛЕННАЯ ОБРАБОТКА: сразу добавляем изображение
        // Удаляем красивую обложку генерации
        const loadingWrapper = loadingItem.querySelector('.loading-wrapper');
        if (loadingWrapper) {
            loadingWrapper.remove();
            console.log('🗑️ Removed loading wrapper');
        }

        // Вставляем реальное изображение ПЕРВЫМ элементом
        loadingItem.insertBefore(realImage, loadingItem.firstChild);
        console.log('✅ Added real image to loading item');

        // ✨ Добавляем эффект плавного появления
        realImage.style.opacity = '0';
        requestAnimationFrame(() => {
            realImage.style.opacity = '1';
            realImage.style.transition = 'opacity 0.4s ease-out';
            console.log('✨ Applied fade-in effect to real image');
        });

        // 🐛 НЕМНОГО СТАБИЛЬНОСТИ: double-check что изображение загрузилось
        realImage.onload = () => {
            realImage.classList.add('loaded');
            console.log('✅ Real image successfully loaded in history:', generationId);
        };

        realImage.onerror = () => {
            // console.warn('⚠️ Real image failed to load:', imageUrl); // ЗАКОММЕНТИРОВАНО - убран спам
            // Fallback: используем placeholder
            realImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMvb3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+LmV4cGlyZWQtdGV4dHtiYTpnZW5lcmFsIFNhbnMsQXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWY7Zm9udC1zaXplOiAxNHB4O2ZpbFw6ICM5OTk5OTk7fTwvc3R5bGU+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y0ZjRmNCIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZHk9Ii4zNWVtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBjbGFzcz0iZXhwaXJlZC10ZXh0IiBzdHlsZT0iYXVjLWFncmlkLXJvd3M6IHNwYW4gMS8yOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlOyBvcGFjaXR5OiAwLjg7Ij5FeHBpcmVkPC90ZXh0PiAKPC9zdmc+';
        };

        // 🔧 ИСПРАВЛЕНИЕ: Обновляем подпись с защитой от mode_undefined
        const loadingCaption = loadingItem.querySelector('p');
        if (loadingCaption) {
            // Найдем объект генерации по ID
            const generation = window.appState.generationHistory.find(g => g.id == generationId);
            const mode = generation ? generation.mode : 'unknown';
            const style = generation ? generation.style : 'realistic';

            // ЗАЩИТА: Убеждаемся что mode не undefined
            const safeMode = (mode && mode !== 'undefined') ? mode : 'photo_session';
            const translatedMode = window.appState.translate('mode_' + safeMode);

            console.log(`🎯 Mode translation debug: mode='${mode}', safeMode='${safeMode}', translated='${translatedMode}'`);

            loadingCaption.innerHTML = `
        <span class="complete-status">✅ Complete</span><br>
        <small class="history-date">${new Date().toLocaleDateString()} | ${window.appState.translate('style_' + style)} | ${translatedMode}</small>
    `;

            // Добавляем мягкую анимацию изменения текста
            loadingCaption.style.opacity = '0';
            requestAnimationFrame(() => {
                loadingCaption.style.opacity = '1';
                loadingCaption.style.transition = 'opacity 0.2s ease-in-out';
            });
        }

        // Убираем loading класс через некоторое время для smooth эффекта
        setTimeout(() => {
            loadingItem.classList.remove('history-loading');
        }, 300);

        // Добавляем onclick для просмотра результата
        loadingItem.onclick = () => viewHistoryItem(generationId);

        console.log('🖼️ Updated history item with generated image:', generationId, imageUrl);

        // 🐛 ДОПОЛНИТЕЛЬНАЯ ПРОВЕРКА: Принудительная загрузка превью
        setTimeout(() => {
            const elementAfterTimeout = document.getElementById(`history-${generationId}`);
            if (elementAfterTimeout) {
                console.log('✅ Preview element found in DOM:', generationId);
                if (window.globalHistoryLoader) {
                    window.globalHistoryLoader.forceLoadVisibleHistoryPreviews();
                    console.log('🔄 Forced visibility check for loaded image');
                }
    } else {
        console.warn('⚠️ No items to display on page', page);
    }
        }, 500);
    }
}

// Функция для создания placeholder'а загрузки в истории (вынесена из app_modern.js)
function createLoadingHistoryItem(generation) {
    console.log('🔧 createLoadingHistoryItem called for generation:', generation.id);

    const historyList = document.getElementById('historyList');
    if (!historyList) {
        console.warn('❌ historyList element not found!');
        return null;
    }
    console.log('✅ historyList found, proceeding with creation');

    // ☠️ ЗАЩИТА ОТ ДУБЛИКАТОВ: Проверяем, нет ли уже элемента для этой генерации
    const existingLoading = document.getElementById(`loading-${generation.id}`);
    if (existingLoading) {
        console.log(`🚫 Loading item for generation ${generation.id} already exists, returning existing`);
        return existingLoading; // возвращаем существующий элемент
    }

    // Создаём элемент нового изображения в истории
    const loadingItem = document.createElement('div');
    loadingItem.className = 'history-mini history-loading';
    loadingItem.id = `loading-${generation.id}`;
    // Добавляем onclick сразу
    loadingItem.onclick = () => console.log('Loading item clicked, but still processing...');

    // 🎨 КРАСИВАЯ ОБЛОЖКА ИСПОЛЬЗУЮЩАЯ CSS ПЕРЕМЕННЫЕ ИЗ VARIABLES.CSS
    const loadingWrapper = document.createElement('div');
    loadingWrapper.className = 'loading-wrapper';

    // Получаем текущую тему приложения
    const body = document.body;
    const isDark = body.classList.contains('dark') || body.getAttribute('data-theme') === 'dark';
    const isLight = body.classList.contains('light') || body.getAttribute('data-theme') === 'light';

    let gradientVar;
    if (isDark) {
        gradientVar = 'var(--loading-cover-dark)';
    } else if (isLight) {
        gradientVar = 'var(--loading-cover-light)';
    } else {
        gradientVar = 'var(--loading-cover-auto)';
    }

    loadingWrapper.style.cssText = `
        position: relative;
        width: 100%;
        height: 100%;
        background: ${gradientVar};
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s ease; /* Плавный переход цвета */
    `;

    // эффект "звездного неба"
    const starsPattern = document.createElement('div');
    starsPattern.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        background:
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle at 70% 80%, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle at 50% 20%, rgba(255,255,255,0.15) 1px, transparent 1px),
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 1px, transparent 1px);
        background-size: 20px 20px;
        animation: twinkle 2s ease-in-out infinite alternate;
    `;

    // ✨ ЛОПАЮЩИЕСЯ ЗВЁЗДОЧКИ (CSS АНИМАЦИЯ)
    const sparkle1 = document.createElement('div');
    sparkle1.style.cssText = `
        position: absolute;
        top: 15%;
        left: 25%;
        width: 4px;
        height: 4px;
        background: white;
        border-radius: 50%;
        animation: sparkle-appear 1.5s ease-in-out infinite;
        animation-delay: 0.2s;
    `;

    const sparkle2 = document.createElement('div');
    sparkle2.style.cssText = `
        position: absolute;
        top: 70%;
        right: 20%;
        width: 3px;
        height: 3px;
        background: rgba(255,255,255,0.8);
        border-radius: 50%;
        animation: sparkle-appear 1.5s ease-in-out infinite;
        animation-delay: 0.7s;
    `;

    const sparkle3 = document.createElement('div');
    sparkle3.style.cssText = `
        position: absolute;
        bottom: 20%;
        left: 15%;
        width: 5px;
        height: 5px;
        background: white;
        border-radius: 50%;
        animation: sparkle-appear 1.5s ease-in-out infinite;
        animation-delay: 1.1s;
    `;

    // ✨ 중앙에 아이콘 (Взрывающаяся звезда)
    const sparkIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    sparkIcon.setAttribute('viewBox', '0 0 24 24');
    sparkIcon.setAttribute('fill', 'none');
    sparkIcon.setAttribute('stroke', 'white');
    sparkIcon.setAttribute('stroke-width', '2');
    sparkIcon.setAttribute('stroke-linecap', 'round');
    sparkIcon.setAttribute('stroke-linejoin', 'round');
    sparkIcon.style.cssText = `
        width: 32px;
        height: 32px;
        animation: pulse-glow 1.5s ease-in-out infinite alternate;
        filter: drop-shadow(0 0 8px rgba(255,255,255,0.3));
    `;

    // Путь для звезды (Взрывающаяся звезда)
    const sparkPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    sparkPath.setAttribute('d', 'M12 3L14.09 8.26L20 7.27L15.82 11.14L18.18 17.02L12 14.77L5.82 17.02L8.18 11.14L4 7.27L9.91 8.26L12 3Z');
    sparkIcon.appendChild(sparkPath);

    // 🔥 Ключевые CSS анимации (через line-height 0 для компактности)
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        @keyframes twinkle {
            0% { opacity: 0.3; }
            100% { opacity: 1; }
        }
        @keyframes sparkle-appear {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-glow {
            0% { transform: scale(1); }
            100% { transform: scale(1.2); }
        }
    `;

    // Добавляем элементы обложки
    loadingWrapper.appendChild(starsPattern);
    loadingWrapper.appendChild(sparkle1);
    loadingWrapper.appendChild(sparkle2);
    loadingWrapper.appendChild(sparkle3);
    loadingWrapper.appendChild(sparkIcon);
    loadingWrapper.appendChild(styleElement); // Добавляем стили

    // Создаём подпись - красную и стильную
    const loadingCaption = document.createElement('p');
    loadingCaption.classList.add('history-caption');
    loadingCaption.innerHTML = `<span style="color: #ffffff; font-weight: 600; font-size: 12px; letter-spacing: 0.5px; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">Generating...</span>`;

    // Собираем элемент
    loadingItem.appendChild(loadingWrapper);
    loadingItem.appendChild(loadingCaption);

    console.log('✅ Created beautiful loading item with animated cover');

    // Вставляем новый элемент в начало списка
    const firstHistoryItem = historyList.querySelector('.history-mini');
    if (firstHistoryItem) {
        historyList.insertBefore(loadingItem, firstHistoryItem);
        console.log('✅ Inserted before first history item');
    } else {
        historyList.appendChild(loadingItem);
        console.log('✅ Appended as first child');
    }

    // 🔍 ПРОВЕРКА: Убеждаемся что элемент действительно добавлен
    const addedItem = document.getElementById(`loading-${generation.id}`);
    if (addedItem) {
        console.log('✅ Loading item successfully added to DOM:', addedItem.id);
        console.log('📊 Current history list children count:', historyList.children.length);
        console.log('📋 History list children:', Array.from(historyList.children).map(c => c.id || c.className));
    } else {
        console.error('❌ Loading item NOT found in DOM after adding!');
    }

    return loadingItem;
}

// Функция просмотра элемента истории (вынесена из app_modern.js)
function viewHistoryItem(id) {
    const item = window.appState.generationHistory.find(h => h.id == id);
    if (item && item.result) {
        window.appState.currentGeneration = item;
        // Используем функцию из screen-manager.js
        import('./screen-manager.js').then(module => {
            module.displayFullResult({ image_url: item.result });
        });
    }
}

// Создаем экземпляр менеджера и экспортируем функции
const historyManagement = new HistoryManagement();

export {
    HistoryManagement,
    historyManagement,
    createLoadingHistoryItem,
    viewHistoryItem
};

// 🚀 Новые функции из app_modern.js для управления отображением истории

// Функция для обновления отображения истории
function updateHistoryDisplay(page = 0) {
    const historyList = document.getElementById('historyList');
    if (!historyList) {
        console.warn('❌ historyList element not found!');
        return;
    }

    // 🔥 ДИАГНОСТИКА: Подробное логирование состояния
    const generationHistory = window.appState?.generationHistory || [];
    console.log('🏥 HISTORY DIAGNOSTIC:');
    console.log(`📊 Total items in history: ${generationHistory.length}`);
    console.log('📋 First 3 items:', generationHistory.slice(0, 3));

    // 🧹 ОЧИСТКА ИСТОРИИ: Убираем все поврежденные элементы с result === 'undefined' ИЛИ вообще без result
    const filteredHistory = generationHistory.filter(item => {
        const isValid = item &&
                       item.result !== undefined &&
                       item.result !== null &&
                       item.result !== 'undefined' &&
                       item.result !== '' &&
                       typeof item.result === 'string' &&
                       item.result.trim() !== '';

        if (!isValid) {
            console.log(`🗑️ Filtering out corrupted/invalid history item:`, {
                id: item.id,
                result: item.result,
                type: typeof item.result,
                status: item.status,
                timestamp: item.timestamp
            });
        }

        return isValid;
    });

    // Обновляем состояние если были изменения
    if (filteredHistory.length !== generationHistory.length) {
        console.log(`🧹 Cleaned history: ${generationHistory.length} → ${filteredHistory.length} items`);
        window.appState.generationHistory = filteredHistory;
        window.appState.saveHistory();

        // Принудительное обновление количества элементов в UI
        setTimeout(() => {
            const historyToggleBtn = document.getElementById('historyToggleBtn');
            if (historyToggleBtn) {
                const count = filteredHistory.length;
                const baseText = 'Generation History';
                historyToggleBtn.textContent = count > 0 ? `${baseText} (${count})` : baseText;
            }
        }, 100);
    }

    const validItems = generationHistory.filter(item => {
        const isValid = item.result &&
                       typeof item.result === 'string' &&
                       item.result.trim() !== '' &&
                       item.result !== 'undefined';

        if (!isValid) {
            console.log(`❌ Filtered out invalid item:`, {
                id: item.id,
                result: item.result,
                type: typeof item.result,
                trimmed: item.result?.trim?.(),
                isUndefined: item.result === 'undefined'
            });
        }

        return isValid;
    });

    console.log(`✅ Valid items after filtering: ${validItems.length}/${generationHistory.length}`);

    if (validItems.length === 0) {
        historyList.innerHTML = `
    <div class="empty-history">
    <div class="empty-icon">📋</div>
    <h3 data-i18n="empty_history_title">${window.appState?.translate?.('empty_history_title') || 'No history yet'}</h3>
    <p data-i18n="empty_history_subtitle">${window.appState?.translate?.('empty_history_subtitle') || 'Generate your first image!'}</p>
    </div>
    `;
        console.log('📝 Displaying empty history message');
        return;
    }

    // Если это первая страница - очищаем список
    if (page === 0) {
        historyList.innerHTML = '';
        console.log('📋 Cleared history list for fresh display');
    }

    // 🔥 НОВОЕ: Изменен лимит для показа только 6 изображений при первом заходе
    const itemsPerPage = page === 0 ? 6 : 15; // первый раз ТОЛЬКО 6 изображений, потом 15

    // Загружаем элементы страницы
    const pageItems = page === 0
        ? validItems.slice(0, 6)  // первые 6 элементов для первой страницы
        : validItems.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

    console.log(`📄 Page ${page}: loading ${pageItems.length} items from ${validItems.length} total`);

    if (pageItems.length > 0) {
        // Добавляем элементы страницы
        pageItems.forEach((item, index) => {
            console.log(`🎨 Creating element ${index + 1}/${pageItems.length} for item ID ${item.id}`);

            const element = document.createElement('div');
            element.className = 'history-mini';
            element.id = `history-${item.id}`;
            element.onclick = () => {
                console.log(`🖱️ Clicked on history item ${item.id}, calling viewHistoryItem`);
                viewHistoryItem(item.id);
            };

            const imageUrl = item.result || '';
            console.log(`🖼️ Item ${item.id} image URL length: ${imageUrl.length}, preview: ${imageUrl.substring(0, 50)}...`);

            // 🔧 ЗАЩИТА ОТ СВИГ-ПЕРЕСТАВОВКИ: Определяем тип изображения заранее
            const isSvgPlaceholder = imageUrl.startsWith('data:image/svg+xml;base64,') ||
                                   imageUrl.includes('Expired') ||
                                   imageUrl === 'undefined';

            const isBrokenImage = !imageUrl || imageUrl.trim() === '' || isSvgPlaceholder;

            element.innerHTML = isBrokenImage ? `
                <div class="broken-image-placeholder" style="
                    width: 100%;
                    height: 120px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-secondary, #f8f9fa);
                    border: 1px solid var(--border-primary, #dee2e6);
                    border-radius: 8px;
                    color: var(--text-secondary, #6c757d);
                    font-size: 12px;
                    text-align: center;
                    padding: 8px;
                ">
                    <div style="font-size: 24px; margin-bottom: 4px;">📷</div>
                    <div>Изображение недоступно</div>
                    <div style="font-size: 10px; margin-top: 2px;">Повторите генерацию</div>
                </div>
            <p class="history-caption">${new Date(item.timestamp).toLocaleDateString()} | ${window.appState?.translate?.('style_' + item.style) || item.style} | ${window.appState?.translate?.('mode_' + (item.mode || 'photo_session')) || 'photo_session'}</p>
            ` : `
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMvb3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIj48L3JlY3Q+PC9zdmc+"
                     data-src="${imageUrl}"
                     alt="Generated"
                     class="lazy-loading"
                     loading="lazy"
                     decoding="async"
                     />
                <p class="history-caption">${new Date(item.timestamp).toLocaleDateString()} | ${window.appState?.translate?.('style_' + item.style) || item.style} | ${window.appState?.translate?.('mode_' + (item.mode || 'photo_session')) || 'photo_session'}</p>
            `;

            historyList.appendChild(element);
            console.log(`➕ Added element for item ${item.id} to DOM`);

            // 🚀 OPTIMIZED LAZY LOADING WITHOUT DEVICE STRESS (ТОЛЬКО для рабочих изображений)
            const img = element.querySelector('img[data-src]');
            if (!img) {
                console.warn(`❌ No img element found for item ${item.id}`);
                return;
            }

            // ✋ ПРОТЕКЦИЯ ОТ СПАМА: НЕ обрабатывать поврежденные изображения вообще!
            if (isBrokenImage) {
                console.log(`🚫 Skipping lazy loading setup for broken image ${item.id}`);
                return; // <-- ПОЛНЫЙ выход из критерия обработки, никаких lazy loading!
            }

            console.log(`📱 LAZY SETUP for item ${item.id}`);

            // 🔥 УМНАЯ ЛОГИКА ЗАГРУЗКИ:
            // Для первых 6 элементов - EAGER loading (чтобы сразу показать самые свежие)
            // Для остальных - LAZY loading по видимости
            const isFirstPage = page === 0;
            const isFirstElements = index < 6; // Первые 6 самых свежих

            if (isFirstPage && isFirstElements) {
                // ⚡ EAGER LOADING для самых свежих изображений
                console.log(`⚡ EAGER loading fresh image ${index + 1}/6 for ${item.id}`);
                img.src = img.dataset.src;
                delete img.dataset.src;
                img.classList.add('loaded');
                img.style.opacity = '1';
            } else {
                // 🦥 LAZY LOADING для остальных изображений
                console.log(`🦥 LAZY setup for item ${item.id}`);
                if (window.globalHistoryLoader && window.globalHistoryLoader.observe) {
                    window.globalHistoryLoader.observe(img);
                } else {
                    // Fallback - загружаем если IntersectionObserver недоступен
                    console.log(`⚠️ IntersectionObserver not available, fallback to direct loading for ${item.id}`);
                    img.src = img.dataset.src;
                    delete img.dataset.src;
                    img.classList.add('loaded');
                }
            }

            // ✅ Убраны все обработчики - нет спама в консоль
        });

        console.log(`🏁 History display updated: showing ${pageItems.length} items from page ${page}, total valid: ${validItems.length}`);
        console.log('📊 History list children count:', historyList.children.length);
    } else {
        console.warn('⚠️ No items to display on page', page);
    }

    console.log(`� DEBUGGING HISTORY PAGING:`);
    console.log(`Total valid items: ${validItems.length}`);
    console.log(`Current page: ${page}`);
    console.log(`Items per page: ${itemsPerPage}`);
    console.log(`Should show load more? ${validItems.length > itemsPerPage}`);

    if (validItems.length > itemsPerPage) {
        // Удаляем старую кнопку, если есть
        const existingBtn = document.getElementById('loadMoreHistoryBtn');
        if (existingBtn) {
            existingBtn.remove();
            console.log('🗑️ Removed existing load more button');
        }

        // Создаем новую кнопку
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.id = 'loadMoreHistoryBtn';
        loadMoreBtn.innerHTML = `<div style="padding: 16px; font-size: 16px; font-weight: bold;"><span style="color: var(--text-primary);">�</span> ${window.appState.translate('load_more_history')}...</div>
                                <div style="font-size: 12px; opacity: 0.7;">Показаны ${pageItems.length} из ${validItems.length}</div>`;

        loadMoreBtn.style.cssText = `
            width: 100%;
            height: 120px;
            background: var(--bg-secondary);
            border: 2px dashed var(--border-primary);
            border-radius: 8px;
            color: var(--text-primary);
            cursor: pointer;
            margin: 8px 0;
            font-family: inherit;
            transition: all 0.2s ease;
        `;

        loadMoreBtn.onmouseenter = () => {
            loadMoreBtn.style.background = 'var(--bg-tertiary)';
            loadMoreBtn.style.borderColor = 'var(--primary-500)';
        };

        loadMoreBtn.onmouseleave = () => {
            loadMoreBtn.style.background = 'var(--bg-secondary)';
            loadMoreBtn.style.borderColor = 'var(--border-primary)';
        };

        loadMoreBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 Load more button clicked');

            loadMoreBtn.textContent = 'Загружаем...';
            loadMoreBtn.disabled = true;

            loadNextHistoryPage();
        };

        historyList.appendChild(loadMoreBtn);
        console.log('✅ Load more button added');
    }
}

// Глобальный счетчик страницы
let currentHistoryPage = 0;

// Функция для загрузки следующей страницы истории
function loadNextHistoryPage() {
    const validItems = window.appState.generationHistory.filter(item =>
        item.result &&
        typeof item.result === 'string' &&
        item.result.trim() !== '' &&
        item.result !== 'undefined'
    );

    // Увеличиваем страницу
    currentHistoryPage++;

    const itemsPerPage = 15; // Всегда используем 15 для пагинации
    const totalPages = Math.ceil(validItems.length / itemsPerPage);

    if (currentHistoryPage >= totalPages) {
        console.log('📄 No more pages to load');
        // Скрываем кнопку если больше нет страниц
        const btn = document.getElementById('loadMoreHistoryBtn');
        if (btn) {
            btn.textContent = 'Все загружено! 🎉';
            btn.disabled = true;
            btn.style.opacity = '0.5';
        }
        return;
    }

    console.log(`📄 Loading next history page: ${currentHistoryPage} (total pages: ${totalPages})`);
    updateHistoryDisplay(currentHistoryPage);

    // Обновляем текст кнопки загрузки
    setTimeout(() => {
        const btn = document.getElementById('loadMoreHistoryBtn');
        if (btn) {
            const nextPageAfterLoad = currentHistoryPage + 1;
            if (nextPageAfterLoad >= totalPages) {
                btn.innerHTML = `<div style="padding: 16px; font-size: 16px; font-weight: bold;">🎉 Все загружено!</div>`;
                btn.disabled = true;
                btn.style.opacity = '0.5';
            } else {
                const loadedSoFar = (currentHistoryPage + 1) * itemsPerPage;
                const remaining = Math.min(validItems.length - loadedSoFar, itemsPerPage);
                btn.innerHTML = `<div style="padding: 16px; font-size: 16px; font-weight: bold;"><span style="color: var(--text-primary);"></span> ${window.appState.translate('load_more_history')} ${remaining}...</div>
                                <div style="font-size: 12px; opacity: 0.7;">Показаны ${Math.min(loadedSoFar, validItems.length)} из ${validItems.length}</div>`;
                btn.disabled = false;
            }
            // Прокрутка к новой кнопке для активации загрузки изображений
            btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 300);
}

// Функция сброса счетчика страницы
function resetHistoryPageCounter() {
    currentHistoryPage = 0;
}

// Функция для показа всей истории без виртуализации
function showAllHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    // Показываем все элементы
    const validItems = window.appState.generationHistory.filter(item =>
        item.result &&
        typeof item.result === 'string' &&
        item.result.trim() !== '' &&
        item.result !== 'undefined'
    );

    historyList.innerHTML = validItems.map(item => {
        const element = document.createElement('div');
        element.className = 'history-mini';
        element.id = `history-${item.id}`;
        element.onclick = () => viewHistoryItem(item.id);

            element.innerHTML = `
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMvb3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIj48L3JlY3Q+PC9zdmc+"
                 data-src="${item.result || ''}"
                 alt="Generated"
                 class="lazy-loading"
                 loading="lazy"
                 decoding="async"
                 ${item.result ? '' : 'style="opacity: 0.7;"'}
                 />
            <p class="history-caption">${new Date(item.timestamp).toLocaleDateString()} | ${window.appState.translate('style_' + item.style)} | $${item.credits || 'N/A'}</p>
        `;

        return element.outerHTML;
    }).join('');

    // Подключаем Observer ко всем новым картинкам
    const newImages = historyList.querySelectorAll('img[data-src]');
    newImages.forEach(img => {
        if (window.globalHistoryLoader) {
            window.globalHistoryLoader.observe(img);
        }
    });

    console.log('📄 All history loaded without virtualization');
}

// Функция для очистки истории
function clearHistory() {
    if (confirm('Clear all generation history?')) {
        window.appState.generationHistory = [];
        window.appState.saveHistory();
        updateHistoryDisplay();
        // Импортируем функцию triggerHaptic из app_modern.js
        if (window.triggerHaptic) {
            window.triggerHaptic('medium');
        }
    }
}

// Функция для переключения отображения истории
function toggleHistoryList() {
    const list = document.getElementById('historyList');
    const btn = document.getElementById('historyToggleBtn');
    if (list.classList.contains('hidden')) {
        list.classList.remove('hidden');
        btn.classList.add('active');
        // Сбрасываем счетчик страниц при открытии
        currentHistoryPage = 0;
        updateHistoryDisplay();

        // Дополнительная быстрая прокрутка к последнему изображению после открытия истории
        setTimeout(() => {
            const historyList = document.getElementById('historyList');
            if (historyList && historyList.lastElementChild) {
                historyList.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
                console.log('🖼️ Scrolled to bottom image in history');
            }
        }, 150);
    } else {
        list.classList.add('hidden');
        btn.classList.remove('active');
    }
}

// Добавляем метод в HistoryManagement класс для eager loading
HistoryManagement.prototype.loadEagerForElement = function(element) {
    if (!element) return;

    const img = element.querySelector('img[data-src]');
    if (!img || !img.dataset.src) return;

    // Немедленная загрузка без IntersectionObserver
    img.src = img.dataset.src;
    delete img.dataset.src;

    console.log(`⚡ Eager loaded image: ${img.src}`);
};

// Функция для обновления истории с изображением (для экспорта)
function updateHistoryItemWithImage(generationId, imageUrl) {
    return historyManagement.updateHistoryItemWithImage(generationId, imageUrl);
}

// Экспортируем дополнительные функции
export {
    updateHistoryDisplay,
    loadNextHistoryPage,
    showAllHistory,
    clearHistory,
    toggleHistoryList,
    updateHistoryItemWithImage
};

// Экспортируем функции в глобальную область для обратной совместимости
window.updateHistoryDisplay = updateHistoryDisplay;
window.loadNextHistoryPage = loadNextHistoryPage;
window.showAllHistory = showAllHistory;
window.clearHistory = clearHistory;
window.toggleHistoryList = toggleHistoryList;
window.updateHistoryItemWithImage = (generationId, imageUrl) => historyManagement.updateHistoryItemWithImage(generationId, imageUrl);
window.createLoadingHistoryItem = createLoadingHistoryItem;
window.viewHistoryItem = viewHistoryItem;

console.log('🎯 History Management module loaded successfully');
