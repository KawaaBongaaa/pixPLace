// 🎯 Модуль управления историей генераций pixPLace
// Импорт необходимых зависимостей
// Импорт убрано - globalHistoryLoader доступен через window

class HistoryManagement {
    constructor() {
        // Связь с globalHistoryLoader через window
        this.globalHistoryLoader = null; // Будет инициализирована позже
        console.log('📋 HistoryManagement initialized');
    }

    // 🔧 ИСПРАВЛЕНИЕ: Мягкая очистка - убираем только очень старые (неделя+) неуспешные генерации
    cleanupOldGenerations() {
        if (!window.appState?.generationHistory) return;

        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // неделя назад
        const originalLength = window.appState.generationHistory.length;

        window.appState.generationHistory = window.appState.generationHistory.filter(item => {
            const itemDate = new Date(item.timestamp);

            // ВСЕГДА оставляем завершенные генерации - даже очень старые
            if (item.status === 'completed') return true;

            // Оставляем все генерации в обработке, независимо от возраста
            if (item.status === 'processing') return true;

            // Убираем только очень старые (старше недели) неуспешные генерации
            if (itemDate < weekAgo && (item.status === 'error' || item.status === 'cancelled' || item.status === 'server_overloaded')) {
                console.log(`🧹 Removing very old failed generation: ${item.id} (status: ${item.status}, age: ${Math.floor((Date.now() - itemDate) / (1000*60*60*24))} days)`);
                return false;
            }

            // Все остальные (включая недавние неуспешные) оставляем
            console.log(`💾 Keeping generation: ${item.id} (status: ${item.status})`);
            return true;
        });

        if (originalLength !== window.appState.generationHistory.length) {
            console.log(`🧹 Soft cleaned old generations: ${originalLength} → ${window.appState.generationHistory.length} (kept most items)`);
            window.appState.saveHistory();
        }

        return window.appState.generationHistory;
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

        // ✅ ДОБАВЛЕНИЕ: Удаляем завершенную генерацию из localStorage с активными анимациями
        // Таким образом анимация не восстановится позже при перезагрузке/переоткрытии истории
        try {
            const activeAnimations = JSON.parse(localStorage.getItem('active_history_animations') || '[]');
            const filteredAnimations = activeAnimations.filter(a => a.generationId != generationId);
            localStorage.setItem('active_history_animations', JSON.stringify(filteredAnimations));
            console.log('🧹 Cleaned completed animation from localStorage:', generationId);
        } catch (error) {
            console.warn('⚠️ Failed to clean animation from localStorage:', error);
        }

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
            generationData.mode : 'photo_session';
        const translatedMode = window.appState.translate('mode_' + safeMode);

        caption.innerHTML = `
            <span class="complete-status">✅ Complete</span><br>
            <small class="history-date">${new Date().toLocaleDateString()} | ${window.appState.translate('style_' + (generationData.style || 'realistic'))} | ${translatedMode}</small>
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
        const item = window.appState.generationHistory.find(h => h.id == generationData.generation_id);
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
    }, 100);

    console.log('✅ Successfully replaced loading animation with preview for:', taskUUID);
    return true;
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

    // 🔥 ДОБАВЛЕНИЕ: Атрибут для привязки к taskUUID
    loadingItem.setAttribute('data-taskuuid', generation.taskUUID);

    console.log('🎯 Created loading item with taskUUID:', generation.taskUUID, 'for generation:', generation.id);

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

            // 🔥 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Сохраняем активные элементы анимации в localStorage
            // Это гарантирует, что анимация восстановится, даже если история закроется-откроется
            try {
                const activeAnimations = JSON.parse(localStorage.getItem('active_history_animations') || '[]');
                const animationData = {
                    generationId: generation.id,
                    taskUUID: generation.taskUUID,
                    timestamp: Date.now(),
                    status: 'animating'
                };

                // Удаляем возможные дубликаты перед добавлением
                const filtered = activeAnimations.filter(a => a.generationId !== generation.id);
                filtered.push(animationData);

                localStorage.setItem('active_history_animations', JSON.stringify(filtered));
                console.log('💿 Saved active animation to localStorage:', generation.id);

                // 🔥 ДОБАВЛЕНИЕ: ОБНОВЛЯЕМ СЧЁТЧИК ПОСЛЕ СОХРАНЕНИЯ НОВОЙ АНИМАЦИИ
                setTimeout(updateHistoryCount, 50);
            } catch (error) {
                console.warn('⚠️ Failed to save animation state:', error);
            }

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
        console.log('🎯 Clicking history item, opening generationResultModal');

        // 🔥 ИСПРАВЛЕНИЕ: Открываем generationResultModal вместо обычного просмотра
        if (window.showGenerationResultModal) {
            window.showGenerationResultModal(item);
        } else {
            console.warn('❌ showGenerationResultModal not available');
            // Fallback: используем обычный просмотр если модал недоступен
            import('./screen-manager.js').then(module => {
                module.displayFullResult({ image_url: item.result });
            });
        }
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
    // 🔧 ИСПРАВЛЕНИЕ: ПОКАЗЫВАЕМ ВСЕ генерации с результатами И с правильным статусом
    const hasValidResult = item &&
                          item.result !== undefined &&
                          item.result !== null &&
                          item.result !== 'null' &&
                          item.result !== '' &&
                          item.result !== 'undefined' &&
                          typeof item.result === 'string' &&
                          item.result.trim() !== '';

    if (!hasValidResult) {
        console.log(`❌ FILTER: Skipped item: id=${item.id}, status=${item.status}, resultLength=${item.result?.length || 0}, trimmedResult='${item.result?.trim()?.substring(0, 50)}...'`);
    } else {
        console.log(`✅ KEPT: id=${item.id}, status=${item.status}, resultLength=${item.result?.length || 0}`);
    }

    return hasValidResult;
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

    // 🔥 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: ЗАЩИТА АКТИВНЫХ АНИМАЦИЙ ОТ ОЧИСТКИ!
    // Если это первая страница - очищаем список, НО сохраняем активные анимации
    if (page === 0) {
        // Собираем все активные анимированные элементы перед очисткой
        const activeAnimationIds = getActiveAnimationIds ? getActiveAnimationIds() : [];
        const activeAnimationElements = activeAnimationIds.map(id => document.getElementById(`loading-${id}`)).filter(el => el);

        console.log(`� Preserving ${activeAnimationElements.length} active animations before clearing history`);

        // Очищаем список, удаляя только завершенные генерации
        const elementsToRemove = Array.from(historyList.children).filter(child =>
            !child.id.startsWith('loading-') // <-- НЕ удаляем активные анимации!
        );

        elementsToRemove.forEach(element => element.remove());

        console.log(`📋 Cleared ${elementsToRemove.length} completed items, kept ${activeAnimationElements.length} active animations`);
    }

    // 🔥 НОВОЕ: Изменен лимит для показа только 6 изображений при первом заходе
    const start = page === 0 ? 0 : page * 15 - 9;  // page=0: 0, page=1:6, page=2:21, etc.
    const end = start + (page === 0 ? 6 : 15);
    const pageItems = validItems.slice(start, Math.min(end, validItems.length));

    console.log(`📄 Page ${page}: loading items ${start}-${Math.min(end-1, validItems.length-1)} from ${validItems.length} total (${pageItems.length} items)`);

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

    console.log(`📱 LAZY SETUP for completed item ${item.id}`);

    // 🔥 НОВАЯ УМНАЯ ЛОГИКА ЗАГРУЗКИ:
    // Все завершенные генерации - EAGER LOAD при первой загрузке страниц
    // Благодаря сохранению состояния - покажем реальные превью всегда
    console.log(`⚡ EAGER loading completed image ${item.id} (status: ${item.status})`);
    img.src = img.dataset.src;
    delete img.dataset.src;
    img.classList.add('loaded');
    img.style.opacity = '1';

            // ✅ Убраны все обработчики - нет спама в консоль
        });

        console.log(`🏁 History display updated: showing ${pageItems.length} items from page ${page}, total valid: ${validItems.length}`);
        console.log('📊 History list children count:', historyList.children.length);
    } else {
        console.warn('⚠️ No items to display on page', page);
    }

    console.log(`🔄 DEBUGGING HISTORY PAGING:`);
    console.log(`Total valid items: ${validItems.length}`);
    console.log(`Current page: ${page}`);
    console.log(`Page items shown: ${pageItems.length}`);
    const totalShownSoFar = page === 0 ? 6 : page * 15 - 9 + 15;
    console.log(`Total shown so far: ${totalShownSoFar}`);
    console.log(`Should show load more? ${validItems.length > totalShownSoFar}`);

    // 🔥 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Кнопка всегда должна добавляться ПОСЛЕ всех элементов!
    // Удаляем старую кнопку в начале, чтобы не мешала вставке элементов
    const existingBtn = document.getElementById('loadMoreHistoryBtn');
    if (existingBtn) {
        existingBtn.remove();
        console.log('🗑️ Removed existing load more button before adding new items');
    }

    // 🔥 ИСПРАВЛЕНИЕ: Правильная логика для показывания кнопки пагинации
    // Показываем кнопку только если есть еще элементы для загрузки
    const minItemsForPagination = page === 0 ? 6 : page * 15 - 9 + 15;
    if (validItems.length > minItemsForPagination) {
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
            console.log('🎯 Load more button clicked - calling updateHistoryDisplay with next page');

            loadMoreBtn.textContent = 'Загружаем...';
            loadMoreBtn.disabled = true;

            // 🔥 ПРЯМАЯ ВЫЗОВ можно loadNextHistoryPage() или updateHistoryDisplay(currentHistoryPage + 1)
            updateHistoryDisplay(page + 1);  // <-- Используем page + 1 а не глобальную переменную
        };

        historyList.appendChild(loadMoreBtn);
        console.log('✅ Load more button added');
    }
}

// Функция для обновления счетчика истории в UI
function updateHistoryCount() {
    try {
        const activeAnimations = JSON.parse(localStorage.getItem('active_history_animations') || '[]');
        const totalHistoryItems = window.appState.generationHistory.length + activeAnimations.length;

        const historyToggleBtn = document.getElementById('historyToggleBtn');
        if (historyToggleBtn) {
            const baseText = 'Generation History';
            historyToggleBtn.textContent = totalHistoryItems > 0 ? `${baseText} (${totalHistoryItems})` : baseText;
            console.log(`📊 History count updated: ${totalHistoryItems} total (completed: ${window.appState.generationHistory.length}, animations: ${activeAnimations.length})`);
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
    const validItems = window.appState.generationHistory.filter(item =>
        item &&
        item.result !== undefined &&
        item.result !== null &&
        item.result !== 'null' &&
        item.result !== '' &&
        item.result !== 'undefined' &&
        typeof item.result === 'string' &&
        item.result.trim() !== '' &&
        item.status === 'completed'
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
        console.log('📂 Opening history');
        list.classList.remove('hidden');
        btn.classList.add('active');

        // 🔥 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Полная синхронизация состояния истории
        // ВАЖНО: Вызываем synchronizeHistoryState ДО updateHistoryDisplay!
        synchronizeHistoryState();

        // Сбрасываем счетчик страниц при открытии
        currentHistoryPage = 0;

        setTimeout(() => {
            updateHistoryDisplay();
        }, 100); // Небольшая задержка для синхронизации анимаций

    } else {
        console.log('📁 Closing history - detaching animations for background completion');
        list.classList.add('hidden');
        btn.classList.remove('active');

        // 🔥 ДОБАВЛЕНИЕ: При закрытии истории не отсоединяем анимации от DOM!
        // ВОССТАНАВЛИВАЕМ анимации ТОЛЬКО КОГДА НУЖНО, а не автоматически
        // detachActiveAnimationsFromDOM(); // ЗАКОММЕНТИРОВАНО - не нужно при закрытии!
        console.log('🔌 History closed - animations preserved in localStorage for reopening');
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

// 🔥 ДОБАВЛЕНИЕ: Функция для восстановления активных анимаций из localStorage
function restoreActiveAnimations() {
    try {
        const activeAnimations = JSON.parse(localStorage.getItem('active_history_animations') || '[]');

        if (activeAnimations.length === 0) {
            console.log('📋 No active animations to restore');
            return;
        }

        const currentTime = Date.now();
        const validAnimations = activeAnimations.filter(animation => {
            // Проверяем что генерация все еще в истории и активна
            const generation = window.appState.generationHistory.find(g => g.id == animation.generationId);
            const isNotExpired = (currentTime - animation.timestamp) < 3600000; // 1 час максимум
            const shouldKeep = generation && generation.status === 'processing' && isNotExpired;

            if (!shouldKeep) {
                console.log(`🗑️ Removing expired/completed animation for: ${animation.generationId}`, {
                    foundInHistory: !!generation,
                    status: generation?.status,
                    age: Math.floor((currentTime - animation.timestamp) / 1000),
                    expired: !isNotExpired
                });
            }

            return shouldKeep;
        });

        console.log(`🔄 Restoring ${validAnimations.length} active animations from ${activeAnimations.length} stored`);

        // 🔥 ИСПРАВЛЕНИЕ БАГА: Проверяем историю СТРОГО при открытии.
        // Если история закрыта или только что очищена - ФОРСИРОВАНО восстанавливаем анимации
        const historyList = document.getElementById('historyList');
        const isHistoryHidden = historyList?.classList.contains('hidden') || !historyList;
        const existingAnimationIds = getActiveAnimationIds();

        console.log(`📊 History state check: visible=${!isHistoryHidden}, existingAnimations=${existingAnimationIds.length}, animationsToRestore=${validAnimations.length}`);

        // 🔥 НОВОЕ ПРАВИЛО: ВОССТАНАВЛИВАЕМ если недостаточно элементов в DOM или история была очистена
        const forceRestore = isHistoryHidden || validAnimations.length > existingAnimationIds.length;

        if (forceRestore && validAnimations.length > 0) {
            console.log('🎯 FORCE RESTORING animations - DOM was cleared or history was closed');

            // Восстанавливаем отсутствующие анимированные элементы в DOM
            validAnimations.forEach(animation => {
                const elementExists = document.getElementById(`loading-${animation.generationId}`);
                if (!elementExists) {
                    // 🔥 НАХОДИМ генерацию и восстанавливаем элемент НЕМЕДЛЕННО!
                    const generation = window.appState?.generationHistory?.find(g => g.id == animation.generationId);
                    if (generation && generation.status === 'processing') {
                        console.log(`🔗 Restoring missing animation element for ${animation.generationId}`);
                        const restoredElement = createLoadingHistoryItem(generation);
                        if (restoredElement) {
                            console.log(`✅ Successfully restored animation element for ${animation.generationId}`);
                        } else {
                            console.warn(`❌ Failed to restore animation element for ${animation.generationId}`);
                        }
                    } else {
                        console.warn(`⚠️ Generation not found or not processing: ${animation.generationId}`, {
                            found: !!generation,
                            status: generation?.status
                        });
                    }
                }
            });

            // Проверяем сколько элементов действительно удалось восстановить
            const restoredCount = getActiveAnimationIds().length;
            console.log(`📊 Restore results: attempted ${validAnimations.length}, restored ${restoredCount}`);
        } else {
            console.log('✅ Not restoring animations - DOM elements already exist');
        }

        // === ДОПОЛНИТЕЛЬНО: ОЧИСТИМ localStorage, удалив дубликаты и невалидные записи
        localStorage.setItem('active_history_animations', JSON.stringify(validAnimations));
        console.log(`💾 Updated localStorage with ${validAnimations.length} valid animations`);

    } catch (error) {
        console.error('❌ Failed to restore active animations:', error);
        // В крайнем случае очищаем поврежденные данные
        try {
            localStorage.removeItem('active_history_animations');
        } catch {}
    }
}

// 🔥 ДОБАВЛЕНИЕ: Функция для получения списка ID активных анимаций для исключения из обычной истории
function getActiveAnimationIds() {
    try {
        const activeAnimations = JSON.parse(localStorage.getItem('active_history_animations') || '[]');
        const currentTime = Date.now();

        return activeAnimations
            .filter(animation => {
                const generation = window.appState?.generationHistory?.find(g => g.id == animation.generationId);
                return generation && generation.status === 'processing' && (currentTime - animation.timestamp) < 3600000;
            })
            .map(animation => animation.generationId);
    } catch (error) {
        console.warn('⚠️ Failed to get active animation IDs:', error);
        return [];
    }
}

// 🔥 ДОБАВЛЕНИЕ: Вызываем восстановление анимаций при инициализации истории
// Это должно происходить ПОСЛЕ загрузки данных, ПОСЛЕ перестройки истории в app_modern.js
document.addEventListener('DOMContentLoaded', () => {
    // Небольшая задержка для гарантированного восстановления
    setTimeout(() => {
        if (window.appState?.generationHistory) {
            restoreActiveAnimations();
            console.log('🎭 Animation restoration completed after DOM ready');
        }
    }, 1000);
});

// Экспортируем функции в глобальную область для обратной совместимости
window.updateHistoryDisplay = updateHistoryDisplay;
window.loadNextHistoryPage = loadNextHistoryPage;
window.showAllHistory = showAllHistory;
window.clearHistory = clearHistory;
window.toggleHistoryList = toggleHistoryList;
window.updateHistoryItemWithImage = (generationId, imageUrl) => historyManagement.updateHistoryItemWithImage(generationId, imageUrl);
window.createLoadingHistoryItem = createLoadingHistoryItem;
window.viewHistoryItem = viewHistoryItem;

// 🔥 ДОБАВЛЕНИЕ: Новый экспорт функции замены превью по taskUUID
window.replaceLoadingWithPreview = replaceLoadingWithPreview;
window.restoreActiveAnimations = restoreActiveAnimations;

// 🔥 ДОБАВЛЕНИЕ: Функция для отсоединения активных анимаций от DOM при закрытии истории
// Это позволяет завершить генерации даже когда история скрыта
function detachActiveAnimationsFromDOM() {
    console.log('🔌 detachActiveAnimationsFromDOM: Preparing for history closure');

    try {
        const activeAnimations = JSON.parse(localStorage.getItem('active_history_animations') || '[]');

        if (activeAnimations.length === 0) {
            console.log('🔌 No active animations to detach');
            return;
        }

        console.log(`🔌 Detaching ${activeAnimations.length} animations from DOM for background completion`);

        // Для каждой активной анимации создаем слушатель событий завершения
        activeAnimations.forEach(animation => {
            const generationId = animation.generationId;
            const taskUUID = animation.taskUUID;

            // Создаем слушателя для событий завершения генерации
            const completionListener = (event) => {
                console.log(`🔌 Background completion listener triggered for ${generationId}`, event.detail);

                try {
                    // Меняем статус генерации на completed, даже если DOM элемент не найден
                    const generation = window.appState?.generationHistory?.find(g => g.id == generationId);
                    console.log(`🔌 Generation found in history: ${!!generation}, status: ${generation?.status}`);

                    if (generation) {
                        generation.status = 'completed';
                        generation.result = event.detail?.image_url || generation.result || `completed-${generationId}`;

                        // Добавляем дополнительные данные если есть
                        if (event.detail) {
                            generation.generation_cost = event.detail.generation_cost;
                            generation.cost_currency = event.detail.cost_currency;
                            generation.remaining_credits = event.detail.remaining_credits;
                            generation.imageUUID = event.detail.imageUUID;
                        }

                        console.log(`🔌 Updated generation ${generationId} in memory: status=${generation.status}, hasResult=${!!generation.result}`);

                        // 🔥 КРИТИЧЕСКОЕ: Сохраняем историю ПРИНУДИТЕЛЬНО
                        if (window.appState?.saveHistory) {
                            const historyBefore = window.appState.generationHistory.length;
                            window.appState.saveHistory();
                            console.log(`🔌 Generation ${generationId} saved to history in background (total items: ${historyBefore})`);
                        }

                        // 🔥 ДОБАВЛЕНИЕ: Обновляем счетчик UI чтобы показать новую карточку
                        // Проверяем закрыта ли история и обновляем соот. образом
                        const historyList = document.getElementById('historyList');
                        const isHistoryHidden = historyList?.classList.contains('hidden');

                        if (window.updateHistoryCount) {
                            window.updateHistoryCount();
                            console.log(`🔌 Updated history count after background completion (history ${isHistoryHidden ? 'hidden' : 'visible'})`);

                            // 🔥 ДОБАВЛЕНИЕ: Если история закрыта, добавляем визуальную индикацию в UI
                            if (isHistoryHidden) {
                                console.log('📱 History is closed - generation saved, UI updated when reopened');
                                // При следующем открытии истории updateHistoryDisplay() покажет все актуальные генерации
                            }
                        }

                        // Удаляем анимацию из localStorage
                        const updatedAnimations = activeAnimations.filter(a => a.generationId != generationId);
                        localStorage.setItem('active_history_animations', JSON.stringify(updatedAnimations));
                        console.log(`🧹 Cleaned animation ${generationId} from localStorage (remaining: ${updatedAnimations.length})`);
                    } else {
                        console.warn(`❌ Generation ${generationId} not found in history for background completion!`);
                    }

                    // Удаляем слушателя события
                    document.removeEventListener(`generation:completed:${taskUUID}`, completionListener);
                } catch (error) {
                    console.error(`❌ Error in background completion listener for ${generationId}:`, error);
                }
            };

            // Добавляем слушателя события
            document.addEventListener(`generation:completed:${taskUUID}`, completionListener);

            console.log(`🔌 Attached background listener for generation ${generationId} (taskUUID: ${taskUUID})`);
        });

        // Добавляем global слушатель для всех генераций (safety net)
        document.addEventListener('generation:completed', (event) => {
            console.log('🔌 Global background listener triggered for any generation');
            const generationId = event.detail?.generation_id || event.detail?.id;

            if (generationId) {
                const generation = window.appState?.generationHistory?.find(g => g.id == generationId);
                if (generation && !generation.result) {
                    generation.status = 'completed';
                    generation.result = event.detail?.image_url || `completed-${generationId}`;

                    if (window.appState?.saveHistory) {
                        window.appState.saveHistory();
                    }
                }
            }
        });

        console.log('🔌 Background completion system established');

    } catch (error) {
        console.error('❌ Failed to detach animations from DOM:', error);
    }
}

// 🔥 ДОБАВЛЕНИЕ: Функция для повторного подключения анимаций к DOM при открытии истории
function reattachActiveAnimationsToDOM() {
    console.log('🔗 reattachActiveAnimationsToDOM: Restoring DOM elements');

    try {
        const activeAnimations = JSON.parse(localStorage.getItem('active_history_animations') || '[]');

        if (activeAnimations.length === 0) {
            console.log('🔗 No active animations to reattach');
            return;
        }

        console.log(`🔗 Reattaching ${activeAnimations.length} animations to DOM`);

        // Восстанавливаем DOM элементы для активных анимаций
        activeAnimations.forEach(animation => {
            const generation = window.appState?.generationHistory?.find(g => g.id == animation.generationId);
            const isValid = generation && generation.status === 'processing';

            if (isValid && !document.getElementById(`loading-${generation.id}`)) {
                const animationElement = createLoadingHistoryItem(generation);
                if (animationElement) {
                    console.log(`🔗 Reattached DOM element for generation ${generation.id}`);
                }
            } else if (!isValid) {
                console.log(`🔗 Skipping invalid animation ${animation.generationId}`);
            }
        });

        console.log('🔗 Animation reattachment completed');

    } catch (error) {
        console.error('❌ Failed to reattach animations to DOM:', error);
    }
}

// 🔥 ДОБАВЛЕНИЕ: Master функция полной синхронизации состояния истории
function synchronizeHistoryState() {
    console.log('🔄 synchronizeHistoryState started');

    try {
        const activeAnimations = JSON.parse(localStorage.getItem('active_history_animations') || '[]');
        console.log(`🎭 Found ${activeAnimations.length} active animations in localStorage`);

        const currentTime = Date.now();
        // 🔥 ОЧИЩАЕМ ПРОСРОЧЕННЫЕ АНИМАЦИИ: те что висят дольше 5 минут и не завершены
        const validAnimations = activeAnimations.filter(animation => {
            const isExpired = (currentTime - animation.timestamp) > 300000; // 5 минут
            if (isExpired) {
                console.log(`🗑️ Clearing expired animation for generation ${animation.generationId} (${Math.floor((currentTime - animation.timestamp) / 1000)}s ago)`);
                // 🔥 ДОБАВЛЕНИЕ: Проверяем и завершаем просроченные генерации
                const generation = window.appState?.generationHistory?.find(g => g.id == animation.generationId);
                if (generation && generation.status === 'processing') {
                    generation.status = 'error';
                    generation.error = 'Timeout - generation took too long';
                    if (window.appState?.saveHistory) {
                        window.appState.saveHistory();
                        console.log(`🔌 Marked timeout generation ${animation.generationId} as error`);
                    }
                }
            }
            return !isExpired;
        });

        // Сохраняем очищенные анимации обратно в localStorage
        if (validAnimations.length !== activeAnimations.length) {
            localStorage.setItem('active_history_animations', JSON.stringify(validAnimations));
            console.log(`🧹 Cleaned stale animations: ${activeAnimations.length} → ${validAnimations.length}`);
        }

        // 🔥 ОБНОВЛЯЕМ КОЛИЧЕСТВО в UI - включаем анимации!
        const totalHistoryItems = window.appState.generationHistory.length + validAnimations.length;
        setTimeout(() => {
            const historyToggleBtn = document.getElementById('historyToggleBtn');
            if (historyToggleBtn) {
                const baseText = 'Generation History';
                historyToggleBtn.textContent = totalHistoryItems > 0 ? `${baseText} (${totalHistoryItems})` : baseText;
                console.log(`📊 Updated history count in UI: ${totalHistoryItems} (completed: ${window.appState.generationHistory.length}, animations: ${validAnimations.length})`);
            }
        }, 100);

        if (validAnimations.length === 0) {
            console.log('📋 No active animations to synchronize');
            return;
        }

        // 🔥 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: ВОССТАНАВЛИВАЕМ анимации НЕ ЗАВИСИМО от состояния истории!
        // Если элементы отсутствуют в DOM - ВОССТАНАВЛИВАЕМ их немедленно
        console.log('🎯 Checking and restoring animations in DOM regardless of history state');

        let restorationNeeded = false;
        validAnimations.forEach(animation => {
            const elementExists = document.getElementById(`loading-${animation.generationId}`);
            if (!elementExists) {
                restorationNeeded = true;
                console.log(`🔗 Animation element ${animation.generationId} missing from DOM, restoring immediately`);
                // 🔥 НАХОДИМ генерацию и восстанавливаем элемент НЕМЕДЛЕННО!
                const generation = window.appState?.generationHistory?.find(g => g.id == animation.generationId);
                if (generation && generation.status === 'processing') {
                    createLoadingHistoryItem(generation);
                    console.log(`✅ Immediately restored missing animation element for ${animation.generationId}`);
                } else {
                    console.warn(`⚠️ Generation not found or not processing: ${animation.generationId}`, {
                        found: !!generation,
                        status: generation?.status
                    });
                }
            } else {
                console.log(`✅ Animation element ${animation.generationId} already exists in DOM`);
            }
        });

        if (restorationNeeded) {
            console.log('🔄 DOM restoration completed - animations should now be visible');
        } else {
            console.log('✅ All animation elements already present in DOM');
        }

        console.log('🎯 Synchronization completed (always checks DOM restoration)');

    } catch (error) {
        console.error('❌ Failed to synchronize history state:', error);
    }
}

// Экспортируем master функцию
window.synchronizeHistoryState = synchronizeHistoryState;

console.log('🎯 History Management module loaded successfully with full state synchronization');
