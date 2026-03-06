import { translate } from './store/app-state.js';

// 🎯 Модуль управления историей генераций pixPLace
// Упрощенная версия для работы с внешним HistoryService

// 🔧 ДОБАВЛЕНИЕ: Функция замены анимации на превью по taskUUID
function replaceLoadingWithPreview(taskUUID, generationData) {
    console.log('🔄 replaceLoadingWithPreview called for taskUUID:', taskUUID);

    // Находим анимацию по data-taskuuid
    const animationEl = document.querySelector(`[data-taskuuid="${taskUUID}"]`);
    if (!animationEl) {
        console.warn('❌ Animation element not found for taskUUID:', taskUUID);
        return false;
    }

    // Проверяем что элементы есть в generationData
    if (!generationData || !generationData.image_url || !generationData.generation_id) {
        console.warn('❌ Missing generation data:', generationData);
        return false;
    }

    // Обновляем ID элемента (важный шаг)
    animationEl.id = `history-${generationData.generation_id}`;
    console.log(`🔧 Changed ID from ${animationEl.id} to history-${generationData.generation_id}`);

    // Убираем анимацию загрузки
    animationEl.classList.remove('history-loading');

    // Создаем реальное изображение
    const realImage = document.createElement('img');
    realImage.className = 'lazy-loading loaded';
    realImage.src = generationData.image_url;
    realImage.alt = 'Generated image';
    realImage.loading = 'lazy';
    realImage.decoding = 'async';

    // Удаляем анимированную оболочку
    const loadingWrapper = animationEl.querySelector('.loading-wrapper');
    if (loadingWrapper) {
        loadingWrapper.remove();
        console.log('🗑️ Removed loading wrapper');
    }

    // Добавляем реальное изображение
    animationEl.insertBefore(realImage, animationEl.firstChild);

    // Обновляем подпись с новой информацией
    const caption = animationEl.querySelector('p');
    if (caption) {
        const safeMode = (generationData.mode && generationData.mode !== 'undefined') ?
            generationData.mode : 'nano_banana';
        const styleText = generationData.style ? `${translate('style_' + generationData.style, window.appState) || generationData.style}` : '';
        const separator1 = generationData.style ? ' | ' : '';
        const separator2 = ' | ';
        caption.innerHTML = `
            <span class="complete-status">✅ Complete</span><br>
            <small class="history-date">${new Date().toLocaleDateString()}${separator1}${styleText}${separator2}${translate('mode_' + safeMode, window.appState) || safeMode || 'unknown'}</small>
        `;

        // Добавляем анимацию изменения текста
        caption.style.opacity = '0';
        requestAnimationFrame(() => {
            caption.style.opacity = '1';
            caption.style.transition = 'opacity 0.2s ease-in-out';
        });
    }

    // Обновляем onclick для просмотра полного результата
    animationEl.onclick = () => {
        const item = window.appState.generationHistory.find(h => (h.id || h.generation_id) == (generationData.generation_id || generationData.id));
        if (item && item.result) {
            window.appState.currentGeneration = item;
            import('./screen-manager.js').then(module => {
                module.displayFullResult({ image_url: item.result });
            });
        }
    };

    // Принудительная загрузка превью
    setTimeout(() => {
        if (window.globalHistoryLoader) {
            window.globalHistoryLoader.forceLoadVisibleHistoryPreviews();
        }

        // Инвалидируем кэш серверной истории, т.к. появилась новая генерация
        if (window.appServices?.history) {
            console.log('🧹 Clearing HistoryService cache due to new generation');
            window.appServices.history.clearCache();
        }
    }, 100);

    console.log('✅ Successfully replaced loading animation with preview for:', taskUUID);
    return true;
}

// Функция для создания placeholder'а загрузки в истории
function createLoadingHistoryItem(generation) {
    console.log('🔧 createLoadingHistoryItem called for generation:', generation.id);

    const historyList = document.getElementById('historyList');
    if (!historyList) {
        console.warn('❌ historyList element not found!');
        return null;
    }

    // ☠️ ЗАЩИТА ОТ ДУБЛИКАТОВ
    const existingLoading = document.getElementById(`loading-${generation.id}`);
    if (existingLoading) {
        return existingLoading;
    }

    // Создаём элемент
    const loadingItem = document.createElement('div');
    loadingItem.className = 'history-mini history-loading';
    loadingItem.id = `loading-${generation.id}`;
    loadingItem.setAttribute('data-taskuuid', generation.taskUUID);

    // Создаем красивую обложку загрузки с Tailwind
    const loadingWrapper = document.createElement('div');
    // Tailwind classes: relative full size rounded overflow hidden flex center gradient bg
    loadingWrapper.className = 'relative w-full h-full rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 dark:from-blue-600 dark:to-purple-800';

    // Эффект звездного неба (Complex animations kept as inline/injected)
    const starsPattern = document.createElement('div');
    starsPattern.classList.add('absolute', 'inset-0');
    starsPattern.style.cssText = `
        background:
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle at 70% 80%, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle at 50% 20%, rgba(255,255,255,0.15) 1px, transparent 1px);
        background-size: 20px 20px;
        animation: twinkle 2s ease-in-out infinite alternate;
    `;

    // Звезды с Tailwind позиционированием и кастомной анимацией
    const sparkle1 = document.createElement('div');
    sparkle1.className = 'absolute top-[15%] left-[25%] w-1 h-1 bg-white rounded-full animate-[sparkle-appear_1.5s_ease-in-out_infinite] delay-200';

    const sparkle2 = document.createElement('div');
    sparkle2.className = 'absolute top-[70%] right-[20%] w-0.75 h-0.75 bg-white/80 rounded-full animate-[sparkle-appear_1.5s_ease-in-out_infinite] delay-700';

    const sparkle3 = document.createElement('div');
    sparkle3.className = 'absolute bottom-[20%] left-[15%] w-1.25 h-1.25 bg-white rounded-full animate-[sparkle-appear_1.5s_ease-in-out_infinite] delay-1100';

    // Центральная звезда
    const sparkIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    sparkIcon.setAttribute('viewBox', '0 0 24 24');
    sparkIcon.setAttribute('fill', 'none');
    sparkIcon.setAttribute('stroke', 'white');
    sparkIcon.setAttribute('stroke-width', '2');
    // Tailwind classes for size and animation
    sparkIcon.classList.add('w-8', 'h-8', 'animate-[pulse-glow_1.5s_ease-in-out_infinite_alternate]', 'drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]');

    // Fallback animation style if arbitrary values aren't picked up (Safe measure)
    sparkIcon.style.animation = 'pulse-glow 1.5s ease-in-out infinite alternate';

    const sparkPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    sparkPath.setAttribute('d', 'M12 3L14.09 8.26L20 7.27L15.82 11.14L18.18 17.02L12 14.77L5.82 17.02L8.18 11.14L4 7.27L9.91 8.26L12 3Z');
    sparkIcon.appendChild(sparkPath);

    // CSS анимации (Global definition - ensuring they exist)
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        @keyframes twinkle { 0% { opacity: 0.3; } 100% { opacity: 1; } }
        @keyframes sparkle-appear { 0%, 100% { opacity: 0; transform: scale(0); } 50% { opacity: 1; transform: scale(1); } }
        @keyframes pulse-glow { 0% { transform: scale(1); } 100% { transform: scale(1.2); } }
    `;

    // Собираем обложку
    loadingWrapper.appendChild(starsPattern);
    loadingWrapper.appendChild(sparkle1);
    loadingWrapper.appendChild(sparkle2);
    loadingWrapper.appendChild(sparkle3);
    loadingWrapper.appendChild(sparkIcon);
    loadingWrapper.appendChild(styleElement);

    // Подпись с Tailwind классами
    const loadingCaption = document.createElement('p');
    loadingCaption.className = 'history-caption';
    // Tailwind styling for text inside
    const captionTextClass = 'text-white font-semibold text-xs tracking-wide drop-shadow-sm';
    loadingCaption.innerHTML = `<span class="${captionTextClass}">Generating...</span>`;

    // Собираем элемент
    loadingItem.appendChild(loadingWrapper);
    loadingItem.appendChild(loadingCaption);

    // Вставляем в начало списка
    const firstHistoryItem = historyList.querySelector('.history-mini');
    if (firstHistoryItem) {
        historyList.insertBefore(loadingItem, firstHistoryItem);
    } else {
        historyList.appendChild(loadingItem);
    }

    return loadingItem;
}

// Функция просмотра элемента истории (вынесена из app_modern.js)
function viewHistoryItem(id) {
    // 1. Ищем в кэше HistoryService
    let item = null;
    const historyService = window.appServices?.history;
    if (historyService && historyService.cache) {
        for (const pageData of historyService.cache.values()) {
            const foundInPage = pageData.generations.find(g => g.generation_id == id || g.id == id);
            if (foundInPage) {
                item = foundInPage;
                // Приводим к формату модалки
                item.id = item.generation_id || item.id;
                item.result = item.image_url || item.result;
                console.log('✅ Found item in HistoryService cache');
                break;
            }
        }
    }

    if (item && (item.result || item.image_url)) {
        window.appState.currentGeneration = item;

        // 🔥 ИСПОЛЬЗУЕМ ГЛОБАЛЬНУЮ ФУНКЦИЮ С LAZY LOADING
        window.showGenerationResultModal(item);
    } else {
        console.warn('⚠️ Item not found or has no result image:', id);
    }
}

// Создаем экземпляр менеджера и экспортируем функции
const historyManagement = null; // Временно null - будет заменено на HistoryService

export {
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

    // CONSTANTS for Pagination
    // CONSTANTS for Pagination
    const ITEMS_INITIAL = 20; // 🔥 INCREASED from 6 to 20 to fill the screen
    const ITEMS_PER_PAGE = 20; // Sync with initial load

    // 🔥 ДИАГНОСТИКА: Подробное логирование состояния
    const generationHistory = window.appState?.externalHistory || window.appState?.generationHistory || [];

    const validItems = [...generationHistory].filter(item => item && typeof item === 'object');

    if (validItems.length === 0) {
        historyList.innerHTML = `
    <div class="empty-history">
    <div class="empty-icon">📋</div>
    <h3 data-i18n="empty_history_title">${window.appState?.translate?.('empty_history_title') || 'No history yet'}</h3>
    <p data-i18n="empty_history_subtitle">${window.appState?.translate?.('empty_history_subtitle') || 'Generate your first image!'}</p>
    </div>
    `;
        return;
    }

    // 🔥 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: ЗАЩИТА АКТИВНЫХ АНИМАЦИЙ ОТ ОЧИСТКИ!
    // ДОБАВЛЕНИЕ: СОРТИРОВКА ПО ПОРЯДКУ ДОБАВЛЕНИЯ (ID) ДЛЯ ПРАВИЛЬНОГО ПОРЯДКА GENERAЦИЙ
    // Если это первая страница - очищаем список, НО сохраняем активные анимации
    if (page === 0) {
        // Активные анимации больше не используются (persisting удален)
        const activeAnimationElements = [];

        // Очищаем список, удаляя только завершенные генерации
        const elementsToRemove = Array.from(historyList.children).filter(child =>
            !child.id.startsWith('loading-') // <-- НЕ удаляем активные анимации!
        );

        elementsToRemove.forEach(element => element.remove());
    }

    // 🔥 ДОБАВЛЕНИЕ: СОРТИРУЕМ ВСЕГДА ПО ID ИЛИ GENERATION_ID (ВРЕМЕНИ СОЗДАНИЯ) В НИСХОДЯЩЕМ ПОРЯДКЕ
    // Новые генерации - ПЕРВЫЕ, старые - ПОСЛЕДНИЕ (правильный порядок добавления)
    validItems.sort((a, b) => (b.id || b.generation_id || 0) - (a.id || a.generation_id || 0)); // Сортировка в обратном порядке

    // 🔥 НОВОЕ: Изменен лимит для показа только 6 изображений при первом заходе
    // Исправленная логика пагинации (User Feedback - Increase to 12 to show more):
    // Page 0: 0..12 (12 items)
    // Page 1: 12..27 (15 items)
    // Page 2: 27..42 (15 items)

    // Calculate start and end indices based on page number
    const start = page === 0 ? 0 : ITEMS_INITIAL + (page - 1) * ITEMS_PER_PAGE;
    const end = start + (page === 0 ? ITEMS_INITIAL : ITEMS_PER_PAGE);
    const pageItems = validItems.slice(start, Math.min(end, validItems.length));

    if (pageItems.length > 0) {
        // Добавляем элементы страницы
        pageItems.forEach((item, index) => {
            // Проверяем, не существует ли уже элемент для эту раздела (предотвращаем дубликаты)
            const itemId = item.id || item.generation_id;
            if (document.getElementById(`history-${itemId}`)) {
                return;
            }

            const element = document.createElement('div');
            element.className = 'history-mini group relative'; // Added group and relative for hover effect
            element.id = `history-${item.id || item.generation_id}`;
            element.onclick = () => {
                viewHistoryItem(item.id || item.generation_id);
            };

            const imageUrl = item.result || '';

            // 🔧 ЗАЩИТА ОТ СВИГ-ПЕРЕСТАВОВКИ: Определяем тип изображения заранее
            const isSvgPlaceholder = imageUrl.startsWith('data:image/svg+xml;base64,') ||
                imageUrl.includes('Expired') ||
                imageUrl === 'undefined';

            const isBrokenImage = !imageUrl || imageUrl.trim() === '' || isSvgPlaceholder;

            element.innerHTML = isBrokenImage ? `
                <div class="broken-image-placeholder">
                    <div class="broken-image-icon">📷</div>
                    <div class="broken-image-text">Изображение недоступно</div>
                    <div class="broken-image-subtext">Повторите генерацию</div>
                </div>
                <p class="history-caption">${new Date(item.timestamp).toLocaleDateString()} | ${translate('style_' + item.style, window.appState) || item.style || 'unknown'} | ${translate('mode_' + item.mode, window.appState) || item.mode || 'unknown'}</p>

            <!-- 🔥 ДОБАВЛЕНИЕ: Сохраняем состояние для восстановления! -->
            <script type="application/json" class="generation-state" style="display:none;">
                ${JSON.stringify({
                id: item.id,
                taskUUID: item.taskUUID,
                status: item.status || 'completed',
                preview_status: 'has_preview',
                generation_cost: item.generation_cost,
                cost_currency: item.cost_currency,
                remaining_credits: item.remaining_credits,
                imageUUID: item.imageUUID,
                mode: item.mode,
                style: item.style,
                timestamp: item.timestamp
            })}
            </script>
            ` : `
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMvb3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIj48L3JlY3Q+PC9zdmc+"
                     data-src="${imageUrl}"
                     alt="Generated"
                     class="lazy-loading ${item.result ? '' : 'opacity-70'}"
                     loading="lazy"
                     decoding="async"
                     />
                <p class="history-caption">${new Date(item.timestamp).toLocaleDateString()} | ${translate('style_' + item.style, window.appState) || item.style || 'unknown'} | ${translate('mode_' + item.mode, window.appState) || item.mode || 'unknown'}</p>
                <!-- 🔥 FIXED: Added type="button" to prevent form submission -->
                <button type="button" class="absolute top-2 right-2 p-2 bg-black/40 hover:bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                        onclick="event.stopPropagation(); window.deleteHistoryItem(${item.id || item.generation_id});"
                        title="Delete">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            `;

            historyList.appendChild(element);

            // 🚀 OPTIMIZED LAZY LOADING WITHOUT DEVICE STRESS (ТОЛЬКО for рабочих изображений)
            const img = element.querySelector('img[data-src]');
            if (!img) {
                return;
            }

            // ✋ ПРОТЕКЦИЯ ОТ СПАМА: НЕ обрабатывать поврежденные изображения вообще!
            if (isBrokenImage) {
                return; // <-- ПОЛНЫЙ выход из критерия обработки, никаких lazy loading!
            }

            // 🔥 НОВАЯ УМНАЯ ЛОГИКА ЗАГРУЗКИ:
            // Все завершенные генерации - EAGER LOAD при первой загрузке страниц
            // Благодаря сохранению состояния - покажем реальные превью всегда
            img.src = img.dataset.src;
            delete img.dataset.src;
            img.classList.add('loaded');
            img.style.opacity = '1';

            // ✅ Убраны все обработчики - нет спама в консоль
        });
    } else {
        console.warn('⚠️ No items to display on page', page);
    }

    const totalShownSoFar = page === 0 ? pageItems.length : ITEMS_INITIAL + (page - 1) * ITEMS_PER_PAGE + pageItems.length;

    // 🔥 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Кнопка всегда должна добавляться ПОСЛЕ всех элементов!
    // Удаляем старую кнопку в начале, чтобы не мешала вставке элементов
    const existingBtn = document.getElementById('loadMoreHistoryBtn');
    if (existingBtn) {
        existingBtn.remove();
    }

    // 🔥 ИСПРАВЛЕНИЕ: Правильная логика для показывания кнопки пагинации
    // Показываем кнопку только если есть еще элементы для загрузки
    const itemsShownSoFar = page === 0 ? ITEMS_INITIAL : (ITEMS_INITIAL + (page * ITEMS_PER_PAGE));
    const shouldShowMoreButton = validItems.length > itemsShownSoFar;

    if (shouldShowMoreButton) {
        // Удаляем старую кнопку, если есть
        const existingBtn = document.getElementById('loadMoreHistoryBtn');
        if (existingBtn) {
            existingBtn.remove();
        }

        // Создаем новую кнопку — современный дизайн 2026
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.id = 'loadMoreHistoryBtn';
        // 🔥 FIXED: Added type="button" to prevent form submission
        loadMoreBtn.type = 'button';
        loadMoreBtn.className = 'w-full my-3 py-3 px-4 flex items-center justify-center gap-2 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-gray-200/50 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-white/10 hover:border-blue-400/40 transition-all duration-300 cursor-pointer group shadow-sm';
        const remaining = validItems.length - itemsShownSoFar;
        loadMoreBtn.innerHTML = `
            <svg class="w-4 h-4 text-blue-500 group-hover:rotate-180 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            <span>${translate('load_more_history', window.appState) || 'Load More'}</span>
            <span class="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded-full">${remaining}</span>
        `;

        loadMoreBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            loadMoreBtn.innerHTML = '<svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4m0 12v4m-7.07-3.93l2.83-2.83m8.48-8.48l2.83-2.83M2 12h4m12 0h4m-3.93 7.07l-2.83-2.83M7.76 7.76L4.93 4.93"/></svg> Loading...';
            loadMoreBtn.disabled = true;
            updateHistoryDisplay(page + 1);
        };

        historyList.appendChild(loadMoreBtn);
    }
}

// Функция для обновления счетчика истории в UI
function updateHistoryCount() {
    try {
        const badge = document.getElementById('historyCountBadge');
        if (badge) {
            // Фильтруем пустые и дедуплицируем элементы, чтобы цифра точно совпадала с UI
            const history = window.appState?.externalHistory || window.appState?.generationHistory || [];
            const validItems = history.filter(item => item && typeof item === 'object');

            // Считаем уникальные ID (так же, как их рисует UI)
            const uniqueIds = new Set(validItems.map(item => item.id || item.generation_id));
            const count = uniqueIds.size;

            if (count > 0) {
                badge.textContent = count;
                badge.classList.remove('hidden');
            } else {
                badge.textContent = '';
                badge.classList.add('hidden');
            }
            console.log(`📊 History count updated: ${count} items`);
        }
    } catch (error) {
        console.warn('⚠️ Failed to update history count:', error);
    }
}

// Экспортируем функцию обновления счетчика
window.updateHistoryCount = updateHistoryCount;

// Глобальный счетчик страницы
let currentHistoryPage = 0;

// Функция для загрузки следующей страницы истории
function loadNextHistoryPage() {
    // 🔥 СИНХРОНИЗАЦИЯ: Используем ту же логику фильтрации что и в updateHistoryDisplay
    const historyData = window.appState?.externalHistory || window.appState?.generationHistory || [];
    const validItems = historyData.filter(item =>
        item && typeof item === 'object'
    );

    // Увеличиваем страницу
    currentHistoryPage++;

    const ITEMS_PER_PAGE = 15; // Should match updateHistoryDisplay
    const totalPages = Math.ceil(validItems.length / ITEMS_PER_PAGE);

    if (currentHistoryPage >= totalPages) {
        // Если локальных страниц больше нет, пробуем загрузить с сервера
        const historyService = window.appServices?.history;
        const userId = historyService?.testMode ? null : window.appState?.user?.id;

        // Если сервис доступен и есть еще страницы на бэкенде
        if (historyService && historyService.hasMorePages && userId) {
            console.log('📡 Fetching next page from HistoryService backend...');
            const btn = document.getElementById('loadMoreHistoryBtn');
            if (btn) {
                btn.innerHTML = '<svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4m0 12v4m-7.07-3.93l2.83-2.83m8.48-8.48l2.83-2.83M2 12h4m12 0h4m-3.93 7.07l-2.83-2.83M7.76 7.76L4.93 4.93"/></svg> Загрузка сервера...';
                btn.disabled = true;
            }

            // Вычисляем следующую страницу для сервера (каждая серверная страница = 30 элементов)
            const serverPageToLoad = Math.floor(validItems.length / 30);

            historyService.loadHistoryPage(userId, serverPageToLoad, 30).then(historyData => {
                const rawArray = Array.isArray(historyData) ? historyData : (historyData?.generations || []);

                if (rawArray.length > 0) {
                    const serverGenerations = rawArray;
                    const localGenerations = window.appState?.externalHistory || window.appState?.generationHistory || [];
                    const localIds = new Set(localGenerations.map(g => g.id || g.taskUUID));

                    // Добавляем только те, которых нет локально
                    const newItems = serverGenerations.filter(g => !localIds.has(g.id || g.taskUUID));

                    if (newItems.length > 0) {
                        const allGenerations = [...localGenerations, ...newItems];
                        allGenerations.sort((a, b) => {
                            const timeA = new Date(a.timestamp || a.created_at || 0).getTime();
                            const timeB = new Date(b.timestamp || b.created_at || 0).getTime();
                            return timeB - timeA;
                        });

                        if (window.appState?.setExternalHistory) {
                            window.appState.setExternalHistory(allGenerations);
                        } else if (window.appState?.setGenerationHistory) {
                            window.appState.setGenerationHistory(allGenerations);
                        }

                        updateHistoryDisplay(currentHistoryPage);
                    } else {
                        // Если новых нет, но есть еще страницы серверов
                        updateHistoryDisplay(currentHistoryPage);
                    }

                    // Восстанавливаем кнопку
                    if (btn) {
                        btn.disabled = false;
                    }
                } else {
                    // Сервер вернул пустой список
                    if (btn) {
                        btn.innerHTML = `<div class="p-4 text-lg font-bold">🎉 Все загружено!</div>`;
                    }
                }
            }).catch(e => {
                console.error('❌ Failed to fetch next server page:', e);
                if (btn) {
                    btn.textContent = 'Ошибка загрузки';
                    btn.disabled = false;
                }
            });
            return;
        } else {
            console.log('📄 No more pages to load');
            // Скрываем кнопку если больше нет страниц
            const btn = document.getElementById('loadMoreHistoryBtn');
            if (btn) {
                btn.innerHTML = '<div class="p-4 text-lg font-bold">🎉 Все загружено!</div>';
                btn.disabled = true;
                btn.style.opacity = '0.5';
            }
            return;
        }
    }

    console.log(`📄 Loading next history page: ${currentHistoryPage} (total pages: ${totalPages})`);
    updateHistoryDisplay(currentHistoryPage);

    // Обновляем текст кнопки загрузки
    setTimeout(() => {
        const btn = document.getElementById('loadMoreHistoryBtn');
        if (btn) {
            const nextPageAfterLoad = currentHistoryPage + 1;
            if (nextPageAfterLoad >= totalPages) {
                btn.innerHTML = `<div class="p-4 text-lg font-bold">🎉 Все загружено!</div>`;
                btn.disabled = true;
                btn.classList.add('opacity-50');
            } else {
                const loadedSoFar = (currentHistoryPage + 1) * ITEMS_PER_PAGE;
                const remaining = Math.min(validItems.length - loadedSoFar, ITEMS_PER_PAGE);
                btn.innerHTML = `<div class="p-4 text-lg font-bold"><span class="text-primary"></span> ${translate('load_more_history', window.appState)} ${remaining}...</div>
                                <div class="text-xs opacity-70">Показаны ${Math.min(loadedSoFar, validItems.length)} из ${validItems.length}</div>`;
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
    const historyData = window.appState?.externalHistory || window.appState?.generationHistory || [];
    const validItems = [...historyData].filter(item => item && typeof item === 'object');

    historyList.innerHTML = validItems.map(item => {
        const element = document.createElement('div');
        element.className = 'history-mini';
        element.id = `history-${item.id || item.generation_id}`;
        element.onclick = () => viewHistoryItem(item.id || item.generation_id);

        element.innerHTML = `
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMvb3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIj48L21lY3Q+PC9zdmc+"
                 data-src="${item.result || ''}"
                 alt="Generated"
                 class="lazy-loading ${item.result ? '' : 'opacity-70'}"
                 loading="lazy"
                 decoding="async"
                 />
            <p class="history-caption">${new Date(item.timestamp).toLocaleDateString()} | ${translate('style_' + item.style, window.appState) || item.style || 'unknown'} | ${translate('mode_' + item.mode, window.appState) || item.mode || 'unknown'}</p>
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
// Функция для очистки истории
async function clearHistory() {
    try {
        // Dynamically import the beautiful modal
        const { showConfirmationModal } = await import('./js/modules/ui-utils.js');

        showConfirmationModal(
            'Clear All History?',
            'Are you sure you want to delete ALL generation history? This action cannot be undone.',
            () => {
                window.appState.generationHistory = [];
                updateHistoryDisplay();

                // Импортируем функцию triggerHaptic из app_modern.js
                if (window.triggerHaptic) {
                    window.triggerHaptic('medium');
                }
            },
            {
                confirmText: 'Clear All',
                confirmColor: 'red-600',
                icon: '🧹'
            }
        );
    } catch (error) {
        console.error('Failed to load confirmation modal:', error);
        // Fallback to native confirm
        if (confirm('Clear all generation history?')) {
            window.appState.generationHistory = [];
            updateHistoryDisplay();
        }
    }
}

// 🔥 НОВАЯ ФУНКЦИЯ: Удаление одного элемента истории
async function deleteHistoryItem(id) {
    if (!id) return;

    try {
        const { showConfirmationModal } = await import('./js/modules/ui-utils.js');

        showConfirmationModal(
            'Delete Image?',
            'Are you sure you want to delete this generation? This cannot be undone.',
            () => {
                // 1. Remove from State
                const newHistory = window.appState.generationHistory.filter(item => item.id != id);
                if (window.appState.setGenerationHistory) {
                    window.appState.setGenerationHistory(newHistory);
                } else {
                    // Fallback if setter is missing (unlikely given other code)
                    console.error('setGenerationHistory not found on appState');
                }

                // 2. Remove from DOM with animation
                const element = document.getElementById(`history-${id}`);
                if (element) {
                    element.style.transform = 'scale(0.9) opacity(0)';
                    setTimeout(() => element.remove(), 300);
                }

                // 3. Update Counts
                updateHistoryCount();

                // 4. Check if empty
                if (window.appState.generationHistory.length === 0) {
                    updateHistoryDisplay();
                }

                console.log(`🗑️ Deleted history item ${id}`);
            },
            {
                confirmText: 'Delete',
                confirmColor: 'red-600',
                icon: '🗑️'
            }
        );
    } catch (e) {
        console.error('Delete failed:', e);
        if (confirm('Delete this image?')) {
            window.appState.generationHistory = window.appState.generationHistory.filter(item => item.id != id);
            updateHistoryDisplay();
        }
    }
}

// Export globally
window.deleteHistoryItem = deleteHistoryItem;

// Функция для переключения отображения истории с lazy loading
async function toggleHistoryList() {
    const list = document.getElementById('historyList');
    const btn = document.getElementById('historyToggleBtn');

    if (list.classList.contains('hidden')) {
        // ОТКРЫТИЕ ИСТОРИИ - lazy loading
        console.log('📂 Opening history with lazy loading');
        list.innerHTML = '<div class="history-loading-indicator">Loading history...</div>';
        list.classList.remove('hidden');
        btn.classList.add('active');
        // Поворот шеврона
        const chevron = document.getElementById('historyChevron');
        if (chevron) chevron.style.transform = 'rotate(180deg)';

        try {
            // Получаем HistoryService из appServices
            const historyService = window.appServices?.history;
            if (!historyService) {
                console.warn('❌ HistoryService not available, falling back to local history');
                // Fallback на локальную историю
                updateHistoryDisplay();
                return;
            }

            // Используем уже полученный historyService из выше
            const isTestMode = historyService?.testMode;
            const userId = isTestMode ? null : window.appState?.user?.id;

            if (!isTestMode && !userId) {
                console.warn('❌ User not authenticated');
                list.innerHTML = '<div class="history-error">Please log in to view history</div>';
                return;
            }

            console.log('🔧 History loading with userId:', userId, isTestMode ? '(TEST MODE)' : '');

            // Загружаем первую страницу через HistoryService
            console.log('📡 Loading first page from HistoryService');
            const historyData = await historyService.loadHistoryPage(userId, 0, 30, true);

            // Устанавливаем данные в AppState
            if (window.appState?.setHistoryFromExternal) {
                window.appState.setHistoryFromExternal(historyData);
                // Also update generationHistory to fully switch over
                if (window.appState?.setGenerationHistory) {
                    window.appState.setGenerationHistory(window.appState.getExternalHistory());
                }
            }

            // Запрашиваем актуальный кэш
            list.innerHTML = '';

            // Используем unified updateHistoryDisplay для отрисовки
            updateHistoryDisplay(0);

        } catch (error) {
            console.error('❌ Failed to load history:', error);
            list.innerHTML = '<div class="history-error">Failed to load history</div>';
            // Fallback на локальную историю
            updateHistoryDisplay();
        } finally {
            // 🔥 ОБНОВЛЕНИЕ: После завершения (успех или ошибка) - прокручиваем к последней генерации
            setTimeout(() => {
                if (window.scrollToLatestGeneration) {
                    window.scrollToLatestGeneration();
                }
            }, 100);

            // Обновляем переключатель тем (учитывая новую высоту)
            if (window.updateThemeTogglePosition) {
                window.updateThemeTogglePosition();
            }
        }

    } else {
        // ЗАКРЫТИЕ ИСТОРИИ
        list.classList.add('hidden');
        btn.classList.remove('active');
        // Возврат шеврона
        const chevron = document.getElementById('historyChevron');
        if (chevron) chevron.style.transform = 'rotate(0deg)';

        // Обновляем положение переключателя темы
        if (window.updateThemeTogglePosition) {
            window.updateThemeTogglePosition();
        }
    }
}

// TODO: Реализовать eager loading через HistoryService если нужно

// Функция для обновления истории с изображением
function updateHistoryItemWithImage(generationId, imageUrl) {
    // Пытаемся найти элемент по ID
    const element = document.getElementById(`history-${generationId}`) ||
        document.getElementById(`loading-${generationId}`);

    if (!element) {
        console.warn(`⚠️ Element for generation ${generationId} not found in DOM`);
        return false;
    }

    // Если это loading-элемент, мы можем использовать replaceLoadingWithPreview если есть UUID
    // Но так как у нас только ID и URL, делаем прямую замену

    // Находим картинку
    let img = element.querySelector('img');
    if (img) {
        img.src = imageUrl;
        img.dataset.src = imageUrl;
        img.classList.add('loaded');
        img.classList.remove('opacity-70');
        img.style.opacity = '1';
    }

    // Если был loading-wrapper, убираем его
    const loadingWrapper = element.querySelector('.loading-wrapper') || element.querySelector('.relative.w-full.h-full');
    if (loadingWrapper && element.classList.contains('history-loading')) {
        loadingWrapper.remove();
        element.classList.remove('history-loading');

        // Добавляем изображение если его не было
        if (!img) {
            img = document.createElement('img');
            img.className = 'lazy-loading loaded';
            img.src = imageUrl;
            element.insertBefore(img, element.firstChild);
        }
    }

    // Обновляем статус в подписи
    const caption = element.querySelector('.history-caption');
    if (caption) {
        caption.innerHTML = `<span class="complete-status text-green-500">✅ Complete</span>`;
    }

    return true;
}

// Экспортируем дополнительные функции
export {
    updateHistoryDisplay,
    loadNextHistoryPage,
    showAllHistory,
    clearHistory,
    toggleHistoryList,
    updateHistoryItemWithImage,
    updateHistoryCount
};

// Функция для рендеринга страницы истории из внешних данных
async function renderHistoryPage(generations, page = 0) {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    if (!generations || generations.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <div class="empty-icon">📋</div>
                <h3>No history yet</h3>
                <p>Generate your first image!</p>
            </div>
        `;
        return;
    }

    // Сортируем по timestamp в обратном порядке (новые сверху)
    generations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // ИСПРАВЛЕНИЕ: Рендерим ВСЕ переданные элементы (нарезка теперь делается вызывающим кодом)

    generations.forEach((item, index) => {
        // Защита от дублей
        const itemId = item.generation_id || item.id;
        if (document.getElementById(`history-${itemId}`)) {
            return;
        }

        const element = document.createElement('div');
        element.className = 'history-mini';
        element.id = `history-${itemId}`;
        element.onclick = () => viewHistoryItem(itemId);

        const imageUrl = item.image_url || '';
        const isBrokenImage = !imageUrl || imageUrl.trim() === '';

        element.innerHTML = isBrokenImage ? `
            <div class="broken-image-placeholder">
                <div class="broken-image-icon">📷</div>
                <div class="broken-image-text">Изображение недоступно</div>
            </div>
            <p class="history-caption">${new Date(item.timestamp).toLocaleDateString()} | ${translate('style_' + item.style, window.appState) || item.style || 'unknown'} | ${translate('mode_' + item.mode, window.appState) || item.mode || 'unknown'}</p>
        ` : `
            <img src="${imageUrl}"
                 alt="Generated"
                 class="lazy-loading loaded"
                 loading="lazy"
                 decoding="async"
                 />
            <p class="history-caption">${new Date(item.timestamp).toLocaleDateString()} | ${translate('style_' + item.style, window.appState) || item.style || 'unknown'} | ${translate('mode_' + item.mode, window.appState) || item.mode || 'unknown'}</p>
        `;

        historyList.appendChild(element);
    });
}

// Функция для добавления кнопки "Load More"
// allGenerations — все загруженные (но не все показанные) элементы
// shownCount — сколько уже показано
// hasMoreServer — есть ли ещё страницы на сервере
function addLoadMoreButton(allGenerations = [], shownCount = 0, hasMoreServer = false) {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    // Удаляем существующую кнопку
    const existingBtn = document.getElementById('loadMoreHistoryBtn');
    if (existingBtn) {
        existingBtn.remove();
    }

    const ITEMS_PER_LOAD = 15;
    const totalLoaded = allGenerations.length;
    let currentOffset = shownCount; // сколько показано из allGenerations

    // Создаем новую кнопку
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.id = 'loadMoreHistoryBtn';
    loadMoreBtn.classList.add(
        'w-full', 'h-30', 'my-2',
        'bg-gray-100', 'dark:bg-gray-700',
        'border-2', 'border-dashed', 'border-gray-300', 'dark:border-gray-500',
        'rounded-lg', 'text-gray-900', 'dark:text-gray-100',
        'cursor-pointer', 'font-inherit',
        'transition-all', 'duration-200',
        'hover:bg-gray-200', 'hover:dark:bg-gray-600',
        'hover:border-blue-500'
    );

    const updateBtnText = () => {
        const renderedCount = historyList.querySelectorAll('.history-mini').length;
        const totalAvailable = hasMoreServer ? `${totalLoaded}+` : `${totalLoaded}`;
        loadMoreBtn.innerHTML = `<div class="p-4 text-lg font-bold">📥 ${translate('load_more_history', window.appState) || 'Load More'}...</div>
                                <div class="text-xs opacity-70">Shown ${renderedCount} of ${totalAvailable}</div>`;
    };
    updateBtnText();

    loadMoreBtn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        loadMoreBtn.innerHTML = `<div class="p-4 text-lg font-bold">Loading...</div>`;
        loadMoreBtn.disabled = true;

        try {
            // Шаг 1: Показываем ещё элементы из уже загруженных
            if (currentOffset < totalLoaded) {
                const nextBatch = allGenerations.slice(currentOffset, currentOffset + ITEMS_PER_LOAD);
                await renderHistoryPage(nextBatch, 1);
                currentOffset += nextBatch.length;
            }

            // Шаг 2: Если локальные кончились — грузим с сервера
            if (currentOffset >= totalLoaded && hasMoreServer) {
                const historyService = window.appServices?.history;
                const isTestMode = historyService?.testMode;
                const userId = isTestMode ? null : window.appState?.user?.id;

                if (historyService) {
                    const serverPage = Math.ceil(totalLoaded / 30);
                    const historyData = await historyService.loadHistoryPage(userId, serverPage, 30);
                    const newGens = historyData.generations || [];

                    // Добавляем в общий массив
                    allGenerations.push(...newGens);
                    hasMoreServer = historyService.hasMorePages;

                    // Показываем новые
                    const nextBatch = newGens.slice(0, ITEMS_PER_LOAD);
                    await renderHistoryPage(nextBatch, serverPage);
                    currentOffset += nextBatch.length;
                }
            }

            // Проверяем, остались ли ещё элементы
            const stillHasMore = (currentOffset < allGenerations.length) || hasMoreServer;
            if (!stillHasMore) {
                loadMoreBtn.innerHTML = `<div class="p-4 text-lg font-bold">🎉 ${translate('all_loaded', window.appState) || 'All loaded!'}</div>`;
                loadMoreBtn.disabled = true;
                loadMoreBtn.classList.add('opacity-50');
            } else {
                updateBtnText();
                loadMoreBtn.disabled = false;
            }

        } catch (error) {
            console.error('❌ Failed to load more history:', error);
            loadMoreBtn.innerHTML = `<div class="p-4 text-lg font-bold">⚠️ Retry</div>`;
            loadMoreBtn.disabled = false;
        }
    };

    historyList.appendChild(loadMoreBtn);
}

// Экспортируем функции в глобальную область для обратной совместимости
window.updateHistoryDisplay = updateHistoryDisplay;
window.loadNextHistoryPage = loadNextHistoryPage;
window.showAllHistory = showAllHistory;
window.clearHistory = clearHistory;
window.toggleHistoryList = toggleHistoryList;
window.updateHistoryItemWithImage = updateHistoryItemWithImage;
window.createLoadingHistoryItem = createLoadingHistoryItem;
window.viewHistoryItem = viewHistoryItem;
window.replaceLoadingWithPreview = replaceLoadingWithPreview;
window.updateHistoryCount = updateHistoryCount;
