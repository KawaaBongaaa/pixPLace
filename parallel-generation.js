/**
 * Parallel Image Generation Manager
 * Управление параллельной генерацией изображений с очередью и статусами
 */

class GenerationManager {
    constructor() {
        this.activeGenerations = new Map(); // id -> generation object
        this.generationQueue = []; // очередь ожидающих генераций
        this.maxConcurrentGenerations = 3; // максимум параллельных генераций

        console.log('🚀 GenerationManager initialized (no persistence)');
    }



    canStartNewGeneration() {
        return this.activeGenerations.size < this.maxConcurrentGenerations && this.generationQueue.length === 0;
    }

    addGeneration(generation) {
        // Создаём генерацию с уникальным ID
        generation.id = generation.id || Date.now() + Math.random().toString(36).substr(2, 9);

        if (this.activeGenerations.size >= this.maxConcurrentGenerations) {
            // Добавляем в очередь ожидания
            this.generationQueue.push(generation);
            generation.status = 'queued';
            generation.queuedAt = Date.now();
            console.log(`📋 Generation ${generation.id} queued (${this.generationQueue.length} in queue)`);

            return false;
        }

        // Запускаем сразу
        this.activeGenerations.set(generation.id, generation);
        generation.status = 'processing';
        generation.startedAt = Date.now();
        console.log(`🚀 Generation ${generation.id} started (${this.activeGenerations.size}/${this.maxConcurrentGenerations} active)`);



        // НАЧИНАЕМ ПРОЦЕСС ГЕНЕРАЦИИ
        console.log(`⚡ Starting processGeneration for ${generation.id}`);
        this.processGeneration(generation);

        return true;
    }

    completeGeneration(generationId, result = null, error = null) {
        const generation = this.activeGenerations.get(generationId);
        if (!generation) {
            console.warn(`Generation ${generationId} not found in active list`);
            return;
        }

        generation.completedAt = Date.now();
        generation.duration = generation.completedAt - (generation.startedAt || generation.completedAt);

        if (error) {
            generation.status = 'error';
            generation.error = error.message || error;
        } else if (result) {
            generation.status = 'success';
            generation.result = result;
        } else {
            generation.status = 'completed';
        }

        // 🔥 UPDATING COMPLETED GENERATION STATUS (no more duplicate history logic needed - generated added at preview creation)
        console.log(`✅ Generation ${generationId} completed with status: ${generation.status}`);

        this.activeGenerations.delete(generationId);
        console.log(`✅ Generation ${generationId} completed (${this.activeGenerations.size} remaining)`);

        // 🔥 ДОБАВЛЕНО: УБИРАЕМ ЗАЦИКЛЕННЫЙ LOADING ЭЛЕМЕНТ ПРИ ОШИБКЕ
        if (error) {
            const loadingElement = document.getElementById(`loading-${generationId}`);
            if (loadingElement) {
                console.log(`🗑️ Removing failed generation loading element: ${generationId}`);
                loadingElement.remove();

                // Плавная прокрутка вверх когда превью удаляется
                setTimeout(() => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    console.log('🆙 Scrolled to top after removing failed preview');
                }, 300); // небольшой delay чтобы DOM обновился

                // ❗❗❗ ТОСТ НЕ ПОКАЗЫВАЕМ ЗДЕСЬ - ВСЁ ДЕЛАЕТСЯ В processGeneration ДЛЯ КОНТРОЛЯ ❗❗❗
                // Тост будет показан либо для перегрузки (длинный), либо для других ошибок (обычный)
            }
        }

        // Запускаем следующую из очереди
        this.startNextFromQueue();
    }

    startNextFromQueue() {
        if (this.generationQueue.length === 0) return;

        const nextGeneration = this.generationQueue.shift();
        if (nextGeneration) {
            nextGeneration.status = 'processing';
            nextGeneration.startedAt = Date.now();
            this.activeGenerations.set(nextGeneration.id, nextGeneration);

            this.processGeneration(nextGeneration);
            console.log(`🚀 Started queued generation ${nextGeneration.id}`);
        }
    }

    async processGeneration(generation) {
        try {
            // 🔥 ULTIMATE DEBUGGING: Log all generation details
            console.log('🎯 processGeneration START - Full generation object:', {
                id: generation.id,
                mode: generation.mode,
                modeType: typeof generation.mode,
                prompt: generation.prompt,
                imageUUIDs: generation.imageUUIDs,
                imageUUID: generation.imageUUID,
                style: generation.style,
                size: generation.size,
                taskUUID: generation.taskUUID,
                allProps: Object.keys(generation)
            });

            // 🔥 DEBUG: Log what mode is actually being processed
            console.log('🔍 DEBUG: Processing generation mode:', {
                mode: generation.mode,
                modeType: typeof generation.mode,
                modeLength: generation.mode ? generation.mode.length : 'N/A',
                modeToLower: generation.mode ? generation.mode.toLowerCase() : 'N/A',
                isStrictEqual: generation.mode === 'background_removal',
                isEqualIgnoreCase: generation.mode?.toLowerCase() === 'background_removal'
            });





            // Принудительная загрузка изображений для быстрой обратной связи
            if (window.globalHistoryLoader) {
                setTimeout(() => {
                    if (window.globalHistoryLoader.forceLoadVisibleHistoryPreviews) {
                        window.globalHistoryLoader.forceLoadVisibleHistoryPreviews();
                    }
                }, 100);
            }

            // Отправляем реальный webhook запрос
            const requestData = {
                action: 'Image Generation',
                prompt: generation.prompt,
                style: generation.style || appState?.selectedStyle,
                mode: generation.mode,
                // 🔥 НОВОЕ: Отправляем конкретные размеры вместо строкового значения
                width: generation.width,
                height: generation.height,
                // size: generation.size, // Оставляем для обратной совместимости если нужно

                // ВАЖНО: Приоритет отдаем внутреннему ID из базы, сохраненному в сессии, затем appState
                user_id: (() => {
                    try {
                        const tgUser = JSON.parse(localStorage.getItem('telegram_user') || '{}');
                        const storedId = tgUser.internalUserId || sessionStorage.getItem('auth_user_id');
                        // Если есть сохраненный внутренний ID (и это не числовой Telegram ID), используем его
                        if (storedId && isNaN(Number(storedId))) return storedId;
                    } catch (e) { }
                    return window.appState?.userId || null;
                })(),
                user_name: window.appState?.userName || ((appState && appState.user && appState.user.name) ? appState.user.name : null),
                user_username: window.appState?.userName || ((appState && appState.user && appState.user.username) ? appState.user.username : null),
                user_language: (appState && appState.language) ? appState.language : 'en',
                user_is_premium: (appState && appState.user && appState.user.isPremium) ? appState.user.isPremium : false,
                telegram_platform: appState?.tg?.platform || 'unknown',
                telegram_version: appState?.tg?.version || 'unknown',
                timestamp: generation.timestamp || new Date().toISOString(),
                generation_id: generation.id,
                taskUUID: generation.taskUUID,
                negative_prompt: generation.negativePrompt ?? null,
                strength: generation.strength ?? null,
                // 🔥 ОБРАБОТКА ИЗОБРАЖЕНИЙ: UUID и base64 данные
                ...(generation.imageUUIDs?.length === 1
                    ? { imageUUID: generation.imageUUIDs[0] }  // единичное изображение - одиночный ключ
                    : generation.imageUUIDs?.length > 1
                        ? { imageUUIDs: generation.imageUUIDs }  // уже массив UUID - сохраняем как есть для бэка
                        : {}),  // или пустой объект если нет изображений
                // 🔥 НОВЫЙ МЕХАНИЗМ: Изображения передаются как бинарные файлы через FormData
                // generation.imageData больше не используется - данные передаются через FormData в sendToWebhook
            };

            // 🔥 НЕОБХОДИМОЕ ДОПОЛНЕНИЕ: Результаты обрабатываются inline в processGeneration

            // 🔥 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Удаляем экспорт processResult - логика теперь inline

            // Добавляем ссылки на пользовательские изображения если есть
            console.log('🎯 Checking userImageUrls:', {
                exists: !!generation.userImageUrls,
                length: generation.userImageUrls ? generation.userImageUrls.length : 0,
                urls: generation.userImageUrls
            });

            if (generation.userImageUrls && generation.userImageUrls.length > 0) {
                console.log('✅ Found user images, sending to webhook:', generation.userImageUrls.length, 'images');

                // Если одно изображение - отправляем как "user_image_url" (единственное), если несколько - "user_image_urls" (множественное)
                if (generation.userImageUrls.length === 1) {
                    requestData.user_image_url = generation.userImageUrls[0]; // единственное число
                    console.log('📤 Sending single image URL (user_image_url):', requestData.user_image_url.substring(0, 100) + '...');
                } else {
                    requestData.user_image_urls = generation.userImageUrls; // множественное число
                    console.log('📤 Sending array of URLs (user_image_urls):', requestData.user_image_urls.length, 'items');
                }
            } else {
                console.log('❌ No user images found for this generation');
            }

            console.log('📤 Sending webhook request for generation:', generation.id);

            // 🔥 НОВЫЙ МЕХАНИЗМ: Проверяем, есть ли бинарные изображения для отправки через FormData
            let webhookData = requestData;

            if (generation.formData) {
                console.log('🔍 Binary FormData found in generation, using multipart request');
                console.log('📦 FormData contains keys:', Array.from(generation.formData.keys()));

                // 🔥 ИСПРАВЛЕНИЕ: Добавляем текстовые поля в существующий FormData из generation
                Object.entries(requestData).forEach(([key, value]) => {
                    if (value !== undefined) {
                        generation.formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
                    }
                });

                webhookData = {
                    ...requestData,
                    formData: generation.formData
                };

                console.log('📦 Final FormData prepared with binary files and text fields:', Array.from(generation.formData.keys()));
            } else {
                console.log('📄 No binary images, using JSON request');
            }

            // Используем обновленную функцию sendToWebhook
            let response;
            console.log('🔗 Calling sendToWebhook for generation:', generation.id);
            if (window.sendToWebhook) {
                response = await window.sendToWebhook(webhookData);
            } else {
                // Fallback для тестирования - имитируем задержку
                await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
                response = {
                    status: 'success',
                    image_url: 'https://picsum.photos/512/512?random=' + generation.id,
                    cost: 1,
                    cost_currency: 'cr'
                };
            }

            console.log('📥 Webhook response for generation:', generation.id, response);

            // 🔥 ДОБАВИЛИ: ВАЖНО! Сначала проверяем на перегрузку сервера
            if (response.server_overloaded === true) {
                console.log(`🚨 SERVER OVERLOADED DETECTED: ${response.message || 'backend timeout'}`);
                // ОБРАБАТЫВАЕМ КАК ПЕРЕГРУЗКУ - УДАЛЯЕМ LOADING-CARD И ПОКАЗЫВАЕМ ТОСТ
                this.removeFailedLoadingCard(generation.id);

                if (window.showToast) {
                    const overloadMessage = window.appState?.translate('error_server_overloaded') ||
                        '😓 Серверы перегружены. Попробуйте позже.';
                    window.showToast('error', overloadMessage);
                }
                this.completeGeneration(generation.id, null, new Error('Server overloaded'));
                return;
            }

            // 📝 ОБНОВЛЕНИЕ: Обработка "accepted" ответа.
            // Теперь мы НЕ считаем это ошибкой и НЕ удаляем карточку.
            if (response.status === 'accepted' || response === 'accepted' || (response.status && response.status.toLowerCase() === 'accepted')) {
                console.log(`📡 TASK ACCEPTED BY SERVER: "${JSON.stringify(response)}" - keeping loading card`);

                // Обновляем текст на карточке для обратной связи
                const loadingElement = document.getElementById(`loading-${generation.id}`);
                if (loadingElement) {
                    const caption = loadingElement.querySelector('.history-caption');
                    if (caption) {
                        caption.innerHTML = `<span style="color: #60a5fa; font-weight: 600;">Accepted...</span>`;
                    }
                }

                // Завершаем текущий процесс ожидания, но не удаляем карточку
                this.completeGeneration(generation.id, null);
                return;
            }

            // Обрабатываем явные ошибки в ответе
            if (response.status === 'error' || response.error) {
                console.log(`🚨 API ERROR DETECTED: ${response.error || response.message || 'Generation failed'}`);
                this.removeFailedLoadingCard(generation.id);
                throw new Error(response.error || response.message || 'Generation failed');
            }

            // Проверка лимитов кредитов
            const limitType = (response.limit_reached === true || response.limit_reached === 'true' || response.limit_reached === '1' || response.limit_reached === 1) ? 'trial' :
                (response.premium_limit_reached === true || response.premium_limit_reached === 'true' || response.premium_limit_reached === '1' || response.premium_limit_reached === 1) ? 'premium' : null;

            if (limitType) {
                console.log(`🚨 ${limitType.toUpperCase()} LIMIT REACHED: ${response.message || 'Generation limit reached'}`);
                generation.status = 'limit';
                if (window.showSubscriptionNotice) {
                    window.showSubscriptionNotice(response, limitType);
                }
                if (window.showToast) {
                    window.showToast('warning', response.message || 'Generation limit reached');
                }
                this.removeFailedLoadingCard(generation.id);
                this.completeGeneration(generation.id, null, new Error('Limit reached'));
                return;
            }

            // Успешная генерация - проверяем наличие image_url (может быть и без status: 'success' в некоторых n8n схемах)
            if (response.image_url || (response.status === 'success' && response.image_url)) {
                try {
                    console.log('✅ WEBHOOK SUCCESS - launching preview replacement for:', generation.id);
                    console.log('📋 Full webhook response:', response);

                    const replacementData = {
                        image_url: response.image_url,
                        generation_id: response.generation_id || generation.id,
                        mode: generation.mode,
                        style: generation.style,
                        generation_cost: response.generation_cost,
                        cost_currency: response.cost_currency || 'Cr',
                        remaining_credits: response.remaining_credits,
                        imageUUID: response.imageUUID,
                        taskUUID: response.taskUUID || generation.taskUUID
                    };

                    console.log('🎯 Data for preview replacement:', replacementData);

                    let visualUpdateDone = false;
                    const isHistoryClosed = !document.getElementById('historyList')?.classList.contains('hidden');

                    if (window.replaceLoadingWithPreview) {
                        const replaced = window.replaceLoadingWithPreview(generation.taskUUID, replacementData);
                        if (replaced) {
                            console.log('✅ Preview successfully replaced animation for taskUUID:', generation.taskUUID);
                            visualUpdateDone = true;
                        } else if (window.updateHistoryItemWithImage) {
                            console.warn(`⚠️ Preview replacement failed - using mandatory fallback`);
                            window.updateHistoryItemWithImage(generation.id, response.image_url);
                            visualUpdateDone = true;
                        }
                    } else if (window.updateHistoryItemWithImage) {
                        console.warn('❌ replaceLoadingWithPreview not available, using fallback');
                        window.updateHistoryItemWithImage(generation.id, response.image_url);
                        visualUpdateDone = true;
                    }

                    // 🔥 FORCE SYNC: Очищаем кэш истории чтобы при следующем открытии были свежие данные
                    if (window.appServices?.history) {
                        window.appServices.history.clearCache();
                        console.log('🔄 History cache cleared to ensure sync on next view');
                    }

                    // События завершения
                    console.log('🎯 Sending completion events for generation:', generation.id);
                    const globalCompletionEvent = new CustomEvent('generation:completed', {
                        detail: { ...replacementData, generation_id: generation.id, taskUUID: generation.taskUUID }
                    });
                    document.dispatchEvent(globalCompletionEvent);

                    // Сохранение в state
                    generation.result = response.image_url;
                    generation.status = 'completed';
                    if (window.appState) {
                        window.appState.addGeneration(generation);
                        window.appState.saveHistory();
                        console.log('💾 Generation successfully added to history and saved');
                    }

                    // Обновление баланса
                    let remainingCredits = response.remaining_credits;
                    if (remainingCredits !== undefined && remainingCredits !== null && remainingCredits !== "") {
                        const parsedCredits = parseFloat(remainingCredits);
                        if (!isNaN(parsedCredits) && window.updateUserBalance) {
                            window.updateUserBalance(parsedCredits);
                            console.log(`💰 Updated user balance to: ${parsedCredits}`);
                        }
                    }

                    // Уведомление
                    if (window.showResultToast) {
                        window.showResultToast({ image_url: response.image_url });
                    } else if (window.showToast) {
                        window.showToast('success', window.appState?.translate('generation_success_standard') || 'Изображение готово!');
                    }

                    this.completeGeneration(generation.id, response.image_url);
                    return;

                } catch (logicError) {
                    console.error('⚠️ UI/Logic error during success handling (non-critical):', logicError);
                    // Even if UI fails, we still consider generation successful as we have the image
                    this.completeGeneration(generation.id, response.image_url);
                    window.showToast('success', 'Изображение готово (ошибка обновления UI)');
                    return;
                }
            }

            // Если не успех, но и не исключение (например, JSON без image_url)
            throw new Error(response.message || response.error || 'Invalid response from server');

        } catch (error) {
            console.error(`❌ Generation error for ${generation.id}:`, error);

            // 🚨 ПОКАЗЫВАЕМ ТОСТ ПРО ПЕРЕГРУЗКУ ТОЛЬКО ДЛЯ СЕТЕВЫХ ОШИБОК ИЛИ ОШИБОК СЕРВЕРА
            // Если это TypeError в нашем коде, не пугаем пользователя перегрузкой
            const isLogicError = error instanceof TypeError || error.message.includes('replaceLoadingWithPreview');

            if (window.showToast && !isLogicError) {
                const overloadMessage = '😓 Генерация не удалась. Серверы сейчас перегружены, пожалуйста, попробуйте позже или выберите другой режим генерации… 🙏';
                window.showToast('error', overloadMessage);
            } else if (window.showToast && isLogicError) {
                window.showToast('error', '⚠️ Ошибка при отображении результата. Проверьте историю.');
            }

            this.completeGeneration(generation.id, null, error);
        }
    }

    cancelGeneration(generationId) {
        // Удаляем из активных
        if (this.activeGenerations.has(generationId)) {
            const generation = this.activeGenerations.get(generationId);
            generation.status = 'cancelled';
            generation.error = 'Cancelled by user';
            this.completeGeneration(generationId);
            return true;
        }

        // Удаляем из очереди
        const queueIndex = this.generationQueue.findIndex(g => g.id === generationId);
        if (queueIndex !== -1) {
            this.generationQueue.splice(queueIndex, 1);
            console.log(`❌ Generation ${generationId} removed from queue`);
            return true;
        }

        return false;
    }

    getActiveGenerationCount() {
        return this.activeGenerations.size;
    }

    getQueueLength() {
        return this.generationQueue.length;
    }

    // Получить статус генерации
    getGenerationStatus(generationId) {
        const active = this.activeGenerations.get(generationId);
        if (active) return active.status;

        const queued = this.generationQueue.find(g => g.id === generationId);
        if (queued) return 'queued';

        return null;
    }

    // 🔧 ДОБАВИЛИ: Метод для удаления неудавшейся loading-card
    removeFailedLoadingCard(generationId) {
        const loadingElement = document.getElementById(`loading-${generationId}`);
        if (loadingElement) {
            console.log(`🗑️ Removing failed generation loading card: ${generationId}`);
            loadingElement.remove();

            // Плавная прокрутка вверх когда превью удаляется
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                console.log('🆙 Scrolled to top after removing failed preview');
            }, 300);
        }
    }

    // 🔥 НОВЫЕ МЕТОДЫ ДЛЯ POLLING ЗАВИСШИХ ГЕНЕРАЦИЙ

    // Запуск polling для зависшей генерации (>120 сек)
    startStatusPollingForStuckGeneration(generation) {
        console.log(`🔄 Starting polling for stuck generation ${generation.id} (taskUUID: ${generation.taskUUID})`);

        // Создаем элемент для отображения статуса polling
        this.updateStuckCardUI(generation.id, 'Checking status...');

        // Начинаем polling каждые 15 секунд
        const pollInterval = setInterval(async () => {
            try {
                // Проверяем статус через HistoryService
                if (window.appServices?.history) {
                    const status = await window.appServices.history.checkGenerationStatus(generation.taskUUID, window.appState?.user?.id);

                    if (status && status.status === 'completed' && status.image_url) {
                        console.log(`✅ Stuck generation ${generation.id} completed via polling`);

                        // Обновляем генерацию
                        generation.result = status.image_url;
                        generation.status = 'completed';

                        // Заменяем превью
                        if (window.replaceLoadingWithPreview) {
                            window.replaceLoadingWithPreview(generation.taskUUID, {
                                image_url: status.image_url,
                                generation_id: generation.id,
                                mode: generation.mode,
                                style: generation.style,
                                taskUUID: generation.taskUUID
                            });
                        }

                        // Добавляем в историю
                        if (window.appState) {
                            window.appState.addGeneration(generation);
                            window.appState.saveHistory();
                        }

                        clearInterval(pollInterval);
                        return;
                    }
                }

                // Продолжаем polling...
                console.log(`⏳ Still polling for generation ${generation.id}`);

            } catch (error) {
                console.warn(`⚠️ Polling error for generation ${generation.id}:`, error);
            }

            // Останавливаем polling через 30 минут (120 * 15сек = 1800 сек = 30 мин)
            if (Date.now() - generation.startedAt > 30 * 60 * 1000) {
                console.log(`⏰ Stopping polling for generation ${generation.id} (timeout)`);
                this.updateStuckCardUI(generation.id, 'Generation timeout');
                clearInterval(pollInterval);

                // Удаляем элемент через 5 секунд
                setTimeout(() => {
                    this.removeFailedLoadingCard(generation.id);
                }, 5000);
            }
        }, 15000); // Каждые 15 секунд
    }

    // Обновление UI для зависшей генерации
    updateStuckCardUI(generationId, status) {
        const element = document.getElementById(`loading-${generationId}`);
        if (element) {
            const caption = element.querySelector('p');
            if (caption) {
                caption.innerHTML = `<span style="color: #ffa500; font-weight: 600;">${status}</span>`;
            }
        }
    }


}

// Глобальный экземпляр
const generationManager = new GenerationManager();

// Экспорт для использования в других файлах (modern ES modules)
export { GenerationManager, generationManager };

// Fallback for global scope
window.GenerationManager = GenerationManager;
window.generationManager = generationManager;
