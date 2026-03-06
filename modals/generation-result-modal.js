/**
 * 🎨 LAZY-LOADED GENERATION RESULT MODAL MODULE
 * Модуль модального окна результатов генерации с динамической загрузкой
 */

// Функция создания модального окна с результатом генерации
function createGenerationResultModal(item) {
    // Проверяем существует ли уже модальное окно с результатом
    let modal = document.getElementById('generationResultModal');
    if (modal) {
        modal.remove();
    }

    // 🔥 ИСПРАВЛЕНИЕ: Обработка различных полей для изображения
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
    const itemDate = item.timestamp ? new Date(item.timestamp) :
        item.date ? new Date(item.date) :
            new Date();

    const getStyleName = (type) => {
        const modeMap = {
            'nano_banana': 'nano_banana',
            'fast_generation': 'fast_generation',
            'pixplace_pro': 'pixplace_pro',
            'background_removal': 'background_removal',
            'upscale_image': 'upscale_image',
            'print_maker': 'print_maker'
        };
        const mode = item.mode || item.type || 'fast_generation';
        return mode in modeMap ? mode : 'fast_generation';
    };

    const costAmount = item.generation_cost || item.cost || item.amount || -10;
    const currency = item.cost_currency || item.currency || 'Cr';

    modal = document.createElement('div');
    modal.id = 'generationResultModal';
    modal.className = 'generation-result-modal fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 backdrop-blur-lg transition-all duration-300';

    modal.innerHTML = `
        <div class="modal-content glassmorphism-animate-in">
            <button class="modal-close-btn" onclick="closeGenerationResultModal()" title="Закрыть">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            
            <div class="generation-result-container">
                <!-- Left Column: Image -->
                <div class="result-main-col image-col">
                    <div class="generation-result-image-container">
                        <div class="image-wrapper-relative">
                            <div class="img-positioning-container">
                                <div class="img-relative-div">
                                    <img src="${imageSource}" alt="Generated Image" class="result-full-image" />
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
                    </div>
                </div>

                <!-- Right Column: Info & Details -->
                <div class="result-main-col info-col">
                    <div class="result-prompt-container">
                        <div class="prompt-text-area">
                            <div class="prompt-label">${window.appState?.translate?.('prompt_label_modal') || 'Prompt:'}</div>
                            <div class="prompt-text">${safeDescription}</div>
                        </div>
                        <div class="reuse-btn-row flex gap-2 w-full mt-2">
                            <button class="reuse-prompt-btn flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2 px-3 rounded-lg transition-all" onclick="reusePrompt('${safeDescription.replace(/'/g, "\\'")}', '${getStyleName('')}')" title="${window.appState?.translate?.('use_prompt_title') || 'Use this text prompt only'}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                </svg>
                                <span class="reuse-btn-text text-sm font-medium whitespace-nowrap">${window.appState?.translate?.('use_prompt_only') || 'Использовать промпт'}</span>
                            </button>
                            <button class="reuse-prompt-btn flex-1 flex items-center justify-center gap-2 bg-blue-600/80 hover:bg-blue-600 text-white py-2 px-3 rounded-lg transition-all" onclick="reusePromptAndImage('${safeDescription.replace(/'/g, "\\'")}', '${getStyleName('')}', '${imageSource}', '${item.id}')" title="${window.appState?.translate?.('repeat_with_image_title') || 'Repeat generation with this image and prompt'}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                    <polyline points="17 1 21 5 17 9"></polyline>
                                    <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                                    <polyline points="7 23 3 19 7 15"></polyline>
                                    <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                                </svg>
                                <span class="reuse-btn-text text-sm font-medium whitespace-nowrap">${window.appState?.translate?.('repeat_with_image') || 'Повторить'}</span>
                            </button>
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

    // Показываем с анимацией
    requestAnimationFrame(() => {
        modal.classList.add('show');

        // Обработчик ESC
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                closeGenerationResultModal();
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Сохраняем для очистки
        modal._escapeHandler = handleEscape;
    });

    console.log('📸 Modal created and shown for item:', item.id);
}

// Функция закрытия модала
function closeGenerationResultModal() {
    const modal = document.getElementById('generationResultModal');
    if (modal) {
        modal.classList.remove('show');

        if (modal._escapeHandler) {
            document.removeEventListener('keydown', modal._escapeHandler);
        }

        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

// 🔥 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ МОДАЛА

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

// Функция повторения генерации с промптом И картинкой
async function reusePromptAndImage(prompt, mode, imageUrl, itemId) {
    // Вызываем функцию использования картинки
    await useImageForGeneration(imageUrl, itemId);

    // Затем подставляем текстовый промпт с небольшой задержкой (после переходов и загрузки)
    setTimeout(() => {
        const promptInput = document.getElementById('promptInput');
        if (promptInput) {
            promptInput.value = prompt.replace('...', '').trim();
            promptInput.focus();
        }

        showToast('info', window.appState?.translate?.('prompt_and_image_applied') || 'Промпт и изображение готовы к генерации!');
    }, 800);
}

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

// Функция использования изображения для генерации
async function useImageForGeneration(imageUrl, itemId) {
    console.log('🎯 Starting image usage for generation, itemId:', itemId, 'URL:', imageUrl?.substring(0, 50) + '...');

    // Закрываем модальное окно с результатом
    closeGenerationResultModal();

    // Переходим к экрану генерации
    showGeneration();

    await new Promise(resolve => setTimeout(resolve, 300)); // Ждем завершения анимации перехода

    try {
        // 🔥 НАПРЯМУЮ ДОБАВЛЯЕМ ИЗОБРАЖЕНИЕ В СОСТОЯНИЕ БЕЗ СИМУЛЯЦИИ ЗАГРУЗКИ
        // Это решает проблемы CORS и непредсказуемого поведения симуляции

        // 1. Очищаем все существующие изображения
        clearAllImages();
        console.log('✅ Cleared existing images');

        // 2. Конвертируем изображение в dataURL если оно еще не таковое
        let processedImageUrl = imageUrl;
        if (!imageUrl.startsWith?.('data:')) {
            console.log('🔄 Converting external URL to dataURL for reliability');
            try {
                const imageBlob = await downloadAndConvertImage(imageUrl);
                // 🔥 ИСПРАВЛЕНИЕ: Создаем Object URL из Blob для использования в createPreviewItem
                processedImageUrl = URL.createObjectURL(imageBlob);
                console.log('✅ Image successfully converted to Object URL from Blob');
            } catch (conversionError) {
                console.warn('⚠️ Failed to convert image to dataURL, using original URL:', conversionError.message);
                // Продолжаем с оригинальным URL если конверсия не удалась
                processedImageUrl = imageUrl;
            }
        } else {
            console.log('✅ Image is already a dataURL, no conversion needed');
        }

        // 3. Создаем объект изображения напрямую
        const imageId = 'history_' + Date.now();
        const imageObj = {
            id: imageId,
            file: null, // файл не нужен для существующих изображений из истории
            dataUrl: processedImageUrl, // используем обработанный URL
            uploadedUrl: null
        };

        // 4. Добавляем в глобальное состояние
        window.userImageState.images.push(imageObj);
        console.log('✅ Added image to userImageState:', window.userImageState.images.length, 'images');

        // 5. Создаем превью элемент напрямую
        if (window.createPreviewItem) {
            window.createPreviewItem(imageId, processedImageUrl, 'History Image');
            console.log('✅ Preview item created');
        }

        // 6. Проверяем и переключаем режим если нужно
        setTimeout(async () => {
            // Получаем текущий выбранный режим несколькими способами для надежности
            let currentMode = null;

            // Способ 1: Через функцию getSelectedMode
            if (window.getSelectedMode) {
                try {
                    currentMode = window.getSelectedMode();
                } catch (error) {
                    console.warn('❌ getSelectedMode failed:', error);
                }
            }

            // Способ 2: Через mode-cards API если доступен
            if (!currentMode && window.modeCardsExports?.getSelectedMode) {
                currentMode = window.modeCardsExports?.getSelectedMode();
            }

            // Способ 3: Через DOM select элемент
            if (!currentMode) {
                const modeSelect = document.getElementById('modeSelect');
                currentMode = modeSelect?.value;
            }

            // Способ 4: Через активную карточку
            if (!currentMode) {
                const activeCard = document.querySelector('.mode-card.active, .carousel-2d-item.active');
                currentMode = activeCard?.getAttribute('data-mode');
            }

            console.log('🎯 Current selected mode when using image:', currentMode, {
                from_getSelectedMode: window.getSelectedMode ? window.getSelectedMode() : 'not_available',
                from_modeCards: window.modeCardsExports?.getSelectedMode?.(),
                from_DOM: document.getElementById('modeSelect')?.value,
                from_activeCard: document.querySelector('.mode-card.active, .carousel-2d-item.active')?.getAttribute('data-mode')
            });

            // 🔥 переключаемся на photo_session ТОЛЬКО если текущий режим - fast_generation (Flux Fast)
            if (currentMode === 'fast_generation') {
                console.log(`🔄 Current mode is fast_generation, switching to photo_session for image editing`);

                // Используем новый API из mode-cards если доступен
                if (window.modeCardsExports?.selectModeByName) {
                    console.log('🎯 Using mode-cards API to switch to photo_session');
                    window.modeCardsExports.selectModeByName('nano_banana');
                    console.log('✅ Mode switched using mode-cards API');
                } else {
                    // Fallback к старому методу
                    console.log('🔄 Using fallback mode switching');
                    const modeSelect = document.getElementById('modeSelect');
                    if (modeSelect) {
                        modeSelect.value = 'nano_banana';

                        // Обновляем режим в глобальном состоянии
                        if (window.appState) {
                            window.appState.currentMode = 'nano_banana';
                        }

                        // Синхронизируем с каруселью режимов - найдем и кликнем карточку nano_banana
                        const photoSessionCard = document.querySelector('.mode-card[data-mode="nano_banana"]');
                        if (photoSessionCard) {
                            photoSessionCard.click();
                            console.log('✅ Mode carousel synchronized with nano_banana (fallback)');
                        }
                    } else {
                        console.log('❌ Mode select element not found');
                    }
                }

                // 🔧 ДОБАВИЛИ: Ждем завершения переключения режима перед обновлением UI
                await new Promise(resolve => setTimeout(resolve, 200));
                console.log('⏱️ Waited for mode switch to complete');

            } else {
                console.log(`✅ Current mode is ${currentMode}, keeping as is (supports images)`);
            }

            // Финальное обновление UI после всех изменений
            setTimeout(() => {
                if (window.updateImageUploadVisibility) {
                    window.updateImageUploadVisibility();
                    console.log('✅ Final UI update after mode switch');
                }

                // 🔥 ИСПРАВЛЕНИЕ: Принудительное обновление слайдера strength после добавления изображения из истории
                if (window.strengthSlider?.updateVisibility) {
                    window.strengthSlider.updateVisibility();
                    console.log('✅ Strength slider visibility updated after image addition');
                } else if (window.strengthSlider) {
                    console.warn('⚠️ Strength slider updateVisibility method not available, using force update');
                    // Fallback - попробуем обновить через событие
                    document.dispatchEvent(new CustomEvent('images:updated', {
                        detail: { imageCount: window.userImageState?.images?.length || 0 }
                    }));
                }
            }, 100);
        }, 100);

        // УСПЕХ!
        showToast('success', window.appState?.translate?.('image_added_success') || 'Image added for generation!');
        console.log('✅ Image successfully added using direct state manipulation');

        // Прокручиваем к превью с небольшой задержкой
        setTimeout(() => {
            const preview = document.getElementById('userImagePreview');
            if (preview) {
                preview.scrollIntoView({ behavior: 'smooth', block: 'center' });
                console.log('✅ Scrolled to preview');
            }
        }, 500);

    } catch (error) {
        console.error('❌ Direct image addition error:', error);
        showToast('error', `${window.appState?.translate?.('ui_error_message') || 'Interface error:'} ${error.message}`);
    }
}

// Функция очистки изображений
function clearAllImages() {
    console.log(' Clearing all existing images for history integration');

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

// Функция конвертации изображения в blob
async function downloadAndConvertImage(imageUrl) {
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

// Функция showToast - определим локально если не доступна глобально
function showToast(type, message) {
    // Создаем элемент тоста
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} show`;

    // 🔥 НОВОЕ: Применяем Tailwind shadow класс для toast'ов
    toast.classList.add('shadow-lg');

    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="toast-progress"></div>
    `;

    // Добавляем в контейнер тостов
    const container = document.getElementById('toastContainer');
    if (container) {
        container.appendChild(toast);
    } else {
        document.body.appendChild(toast);
    }

    // Автоматически удаляем через 5 секунд
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }, 5000);

    console.log(`🔔 Toast shown: ${type} - ${message}`);
}

// 🔥 ГЛОБАЛЬНАЯ ФУНКЦИЯ С НАСТОЯЩИМ LAZY LOADING
let modalModuleLoaded = false;

window.showGenerationResultModal = async function (item) {
    console.log('📸 showGenerationResultModal called, checking if module loaded...');

    if (!modalModuleLoaded) {
        console.log('🚀 First call - loading modal CSS and module dynamically...');

        try {
            // 🔥 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Загружаем CSS ПЕРВЫМ и ждем завершения
            await loadModalCSS();
            console.log('✅ CSS loaded, now loading module...');

            // Настоящий динамический импорт модуля
            await import('./generation-result-modal.js');
            modalModuleLoaded = true;

            console.log('✅ Modal module and CSS loaded successfully');

            console.log('✅ Modal module and CSS loaded successfully, all functions exported');
        } catch (error) {
            console.error('❌ Failed to load modal module:', error);
            return;
        }
    } else {
        console.log('✅ Modal already loaded, proceeding directly to creation');
    }

    // 🔥 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Теперь CSS точно загружен, создаем модал
    console.log('🎨 Creating modal with loaded CSS...');

    // Safety check - ensure CSS is really applied before creating DOM
    requestAnimationFrame(() => {
        createGenerationResultModal(item);
    });
};

window.closeGenerationResultModal = closeGenerationResultModal;

// 🔥 ДОБАВИТЬ: Экспорт createGenerationResultModal для совместимости со старой логикой в index.html
// 🔥 ДОБАВИТЬ: Экспорт createGenerationResultModal для совместимости со старой логикой в index.html
window.createGenerationResultModal = createGenerationResultModal;
window.downloadResultImage = downloadResultImage;
window.shareResultImage = shareResultImage;
window.reusePrompt = reusePrompt;
window.reusePromptAndImage = reusePromptAndImage;
window.useImageForGeneration = useImageForGeneration;

// Функция динамической загрузки модуля
async function loadModalModule() {
    console.log('📦 Loading modal module and CSS...');

    // Параллельно загружаем CSS и инициализируем функционал
    const cssPromise = loadModalCSS();
    const functionalityPromise = initializeModalFunctionality();

    await Promise.all([cssPromise, functionalityPromise]);

    console.log('🎯 Modal module fully loaded and ready');
}

// Загрузка CSS для модала
async function loadModalCSS() {
    const cssFiles = ['css/modals.css', 'css/shared/modals.css'];

    for (const cssFile of cssFiles) {
        if (document.querySelector(`link[href="${cssFile}"]`)) {
            console.log(`✅ ${cssFile} already loaded`);
            continue;
        }

        await new Promise((resolve) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssFile;
            link.onload = () => {
                console.log(`✅ ${cssFile} loaded dynamically`);
                resolve();
            };
            link.onerror = () => {
                console.warn(`⚠️ ${cssFile} failed to load, continuing anyway`);
                resolve(); // Продолжаем даже при ошибке
            };
            document.head.appendChild(link);
        });
    }

    console.log('✅ All modal CSS files loaded or checked');
    // Give a small buffer for the browser to parse styles
    await new Promise(resolve => requestAnimationFrame(resolve));
}

// Инициализация функционала модала
async function initializeModalFunctionality() {
    console.log('⚙️ Initializing modal functionality');
    // Здесь можно добавить дополнительную инициализацию если нужно
    return true;
}

// Инициализация модуля - регистрируем глобальные функции
console.log('🎨 Generation Result Modal module initialized with true lazy loading');

// 🔥 TOP-LEVEL AWAIT: Ensure CSS is loaded BEFORE the module is considered "loaded"
// This blocks the import() promise in index.html until CSS is ready.
try {
    await loadModalCSS();
    console.log('✅ CSS loaded via Top-Level Await - FOUC prevented');
} catch (e) {
    console.error('⚠️ CSS loading warning:', e);
}
