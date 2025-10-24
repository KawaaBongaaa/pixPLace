/**
 * Parallel Image Generation Manager
 * Управление параллельной генерацией изображений с очередью и статусами
 */

class GenerationManager {
    constructor() {
        this.activeGenerations = new Map(); // id -> generation object
        this.generationQueue = []; // очередь ожидающих генераций
        this.maxConcurrentGenerations = 3; // максимум параллельных генераций

        // Initialize persisting storage
        this.storageKey = 'generationManager_state';
        this.persistEnabled = true; // флаг для отключения persisting если нужно для отладки

        this.initPersistentStorage();
        this.loadPersistedState();
        this.startCleanupInterval();
        this.startBackgroundCompletionPolling();
    }

    // Initialize localStorage structure for persisting
    initPersistentStorage() {
        if (!this.persistEnabled) return;

        try {
            // Try to initialize storage
            localStorage.setItem('generationManager_init', Date.now().toString());
            localStorage.removeItem('generationManager_init');
        } catch (error) {
            console.warn('❌ localStorage not available for GenerationManager persisting:', error.message);
            this.persistEnabled = false;
        }
    }

    // Save current state to localStorage
    persistState() {
        if (!this.persistEnabled) return;

        try {
            const stateToSave = {
                activeGenerations: Array.from(this.activeGenerations.entries()),
                generationQueue: this.generationQueue,
                timestamp: Date.now(),
                version: '1.0'
            };

            localStorage.setItem(this.storageKey, JSON.stringify(stateToSave));
        } catch (error) {
            console.warn('❌ Failed to persist GenerationManager state:', error.message);
        }
    }

    // Load and restore state from localStorage - ENHANCED VERSION with complete generationHistory backup
    loadPersistedState() {
        if (!this.persistEnabled) return;

        try {
            const savedState = localStorage.getItem(this.storageKey);
            if (!savedState) {
                console.log('📋 No persisted state found for GenerationManager');
                return;
            }

            const state = JSON.parse(savedState);
            if (!state || typeof state !== 'object') {
                console.warn('❌ Invalid persisted state format');
                this.clearPersistedState();
                return;
            }

            // Check if state is not too old (24 hours max)
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
            if (Date.now() - state.timestamp > maxAge) {
                console.log('🧹 Persisted state is too old, discarding');
                this.clearPersistedState();
                return;
            }

            // 🔥 NEW: Restore complete generationHistory from persisted state
            // This ensures generation IDs match exactly what was saved
            if (state.generationHistory && Array.isArray(state.generationHistory)) {
                if (window.appState) {
                    // Sort by ID descending (newest first) to maintain proper order
                    const sortedHistory = state.generationHistory.sort((a, b) => b.id - a.id);
                    window.appState.setGenerationHistory(sortedHistory);
                    console.log(`💾 Restored ${state.generationHistory.length} complete generations from persisted history`);
                }
            }

            // Clear current state before loading
            this.activeGenerations.clear();
            this.generationQueue.length = 0;

            // Restore activeGenerations Map
            if (state.activeGenerations && Array.isArray(state.activeGenerations)) {
                state.activeGenerations.forEach(([id, generation]) => {
                    if (this.isValidGeneration(generation)) {
                        this.activeGenerations.set(id, generation);
                    }
                });
            }

            // Restore generationQueue
            if (state.generationQueue && Array.isArray(state.generationQueue)) {
                state.generationQueue.forEach(generation => {
                    if (this.isValidGeneration(generation)) {
                        this.generationQueue.push(generation);
                    }
                });
            }

            console.log(`✅ Restored ${this.activeGenerations.size} active generations and ${this.generationQueue.length} queued from persisted state`);

            // Restore visual elements for active and queued generations
            this.restoreVisualElements(state);

            // Resume processing for active generations that are not completed
            this.activeGenerations.forEach((generation, id) => {
                if (generation.status === 'processing' && !generation.result) {
                    console.log(`🔄 Resuming processing for generation ${id}`);
                    this.processGeneration(generation);
                }
            });

        } catch (error) {
            console.error('❌ Failed to load persisted state:', error);
            this.clearPersistedState();
        }
    }

    // Check if generation object is valid for restoration
    isValidGeneration(generation) {
        return generation &&
               typeof generation === 'object' &&
               typeof generation.id === 'number' &&
               Date.now() - generation.id < 24 * 60 * 60 * 1000; // Not older than 24 hours
    }

    // Clear persisted state
    clearPersistedState() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (error) {
            console.warn('Failed to clear persisted state:', error.message);
        }
    }

    // Periodic cleanup of old data
    startCleanupInterval() {
        // Cleanup every 5 minutes for testing (can be changed to 30 minutes in production)
        setInterval(() => {
            this.cleanupExpiredGenerations();
        }, 5 * 60 * 1000); // 5 minutes

        console.log('🧹 Started cleanup interval (5 minutes)');
    }

    // Remove expired generations from persisted storage
    cleanupExpiredGenerations() {
        if (!this.persistEnabled) return;

        try {
            console.log('🧹 Running cleanup for GenerationManager persisted state');
            const savedState = localStorage.getItem(this.storageKey);

            if (!savedState) return;

            const state = JSON.parse(savedState);
            let cleanedCount = 0;

            // Clean activeGenerations (remove too old or completed)
            if (state.activeGenerations && Array.isArray(state.activeGenerations)) {
                const filteredActive = state.activeGenerations.filter(([id, generation]) => {
                    const isExpired = Date.now() - generation.startedAt > 5 * 60 * 1000; // 5 minutes timeout for active generations
                    const isCompleted = generation.result || generation.error;

                    if (isExpired || isCompleted) {
                        cleanedCount++;
                        console.log(`🧹 Cleaning expired generation ${id}: expired=${isExpired}, completed=${isCompleted}, startedAt=${generation.startedAt}`);
                        return false;
                    }
                    return true;
                });
                state.activeGenerations = filteredActive;
            }

            // Clean generationQueue (remove very old items)
            if (state.generationQueue && Array.isArray(state.generationQueue)) {
                const filteredQueue = state.generationQueue.filter(generation => {
                    const age = Date.now() - (generation.queuedAt || generation.id);
                    if (age > 24 * 60 * 60 * 1000) { // 24 hours max queue age
                        cleanedCount++;
                        return false;
                    }
                    return true;
                });
                state.generationQueue = filteredQueue;
            }

            // Save back cleaned state or remove if empty
            if (state.activeGenerations.length === 0 && state.generationQueue.length === 0) {
                localStorage.removeItem(this.storageKey);
                console.log('🗑️ All persisted generations cleaned up, removed storage');
            } else {
                state.timestamp = Date.now(); // Refresh timestamp
                localStorage.setItem(this.storageKey, JSON.stringify(state));
                if (cleanedCount > 0) {
                    console.log(`🧹 Cleaned up ${cleanedCount} expired generations from persisted state`);
                }
            }

        } catch (error) {
            console.error('❌ Error during cleanup:', error);
            this.clearPersistedState();
        }
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

            // Persist state after queueing
            this.persistState();
            return false;
        }

        // Запускаем сразу
        this.activeGenerations.set(generation.id, generation);
        generation.status = 'processing';
        generation.startedAt = Date.now();
        console.log(`🚀 Generation ${generation.id} started (${this.activeGenerations.size}/${this.maxConcurrentGenerations} active)`);

        // Persist state after adding to active
        this.persistState();

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

        // Persist state after completion
        this.persistState();

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

            // Persist state after moving from queue to active
            this.persistState();

            this.processGeneration(nextGeneration);
            console.log(`🚀 Started queued generation ${nextGeneration.id}`);
        }
    }

    async processGeneration(generation) {
        try {
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
                size: generation.size,
                user_id: appState?.user?.id || null,
                user_name: appState?.user?.name || null,
                user_username: appState?.user?.username || null,
                user_language: appState?.user?.language || 'en',
                user_is_premium: appState?.user?.isPremium || false,
                telegram_platform: appState?.tg?.platform || 'unknown',
                telegram_version: appState?.tg?.version || 'unknown',
                timestamp: generation.timestamp || new Date().toISOString(),
                generation_id: generation.id,
                taskUUID: generation.taskUUID,
                // 🔥 ДОБАВИЛИ: УМНАЯ ОБРАБОТКА UUID - одиночное или массив "uuid1","uuid2" для бэкенда
                ...(generation.imageUUIDs?.length === 1
                    ? { imageUUID: generation.imageUUIDs[0] }  // единичное изображение - одиночный ключ
                    : generation.imageUUIDs?.length > 1
                        ? { imageUUIDs: generation.imageUUIDs }  // уже массив UUID - сохраняем как есть для бэка
                        : {})  // или пустой объект если нет изображений
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

            // Используем существующую функцию sendToWebhook
            let response;
            console.log('🔗 Calling sendToWebhook for generation:', generation.id);
            if (window.sendToWebhook) {
                response = await window.sendToWebhook(requestData);
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

            // 📝 ДОБАВИЛИ: Обработка "accepted" ответа как перегрузки
            if (response.trim && response.trim().toLowerCase() === 'accepted') {
                console.log(`🚨 SERVER ACCEPTED RESPONSE - treating as overload: "${response}"`);
                this.removeFailedLoadingCard(generation.id);

                if (window.showToast) {
                    const overloadMessage = window.appState?.translate('error_server_overloaded') ||
                        '😓 Серверы перегружены. Попробуйте позже.';
                    window.showToast('error', overloadMessage);
                }
                this.completeGeneration(generation.id, null, new Error('Server accepted - overload'));
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

            // Успешная генерация
            if (response.status === 'success' && response.image_url) {
                console.log('✅ WEBHOOK SUCCESS - launching preview replacement for:', generation.id);
                console.log('📋 Full webhook response:', response);

                // 🔥 НОВАЯ ЛОГИКА: Заменяем анимацию на превью по taskUUID
                const replacementData = {
                    image_url: response.image_url,
                    generation_id: response.generation_id || generation.id,
                    mode: generation.mode,
                    style: generation.style,
                    generation_cost: response.generation_cost,
                    cost_currency: response.cost_currency,
                    remaining_credits: response.remaining_credits,
                    imageUUID: response.imageUUID,
                    taskUUID: response.taskUUID || generation.taskUUID
                };

                console.log('🎯 Data for preview replacement:', replacementData);

                        // 🔥 ЗАМЕНА АНИМАЦИИ НА ПРЕВЬЮ по taskUUID
                        let visualUpdateDone = false;

                        // 🔥 ПРОВЕРЯЕМ: Закрыта ли история перед обновлением DOM
                        const isHistoryClosed = !document.getElementById('historyList')?.classList.contains('hidden');

                        if (window.replaceLoadingWithPreview) {
                            const replaced = window.replaceLoadingWithPreview(generation.taskUUID, replacementData);
                            if (replaced) {
                                console.log('✅ Preview successfully replaced animation for taskUUID:', generation.taskUUID);
                                visualUpdateDone = true;
                            } else {
                                console.warn(`⚠️ Preview replacement failed - using mandatory fallback`);
                                // ДОБАВИЛИ: ОБЯЗАТЕЛЬНЫЙ FALLBACK когда replaceLoadingWithPreview вернул false
                                if (window.updateHistoryItemWithImage) {
                                    window.updateHistoryItemWithImage(generation.id, response.image_url);
                                    visualUpdateDone = true;
                                }
                            }
                        } else {
                            console.warn('❌ replaceLoadingWithPreview not available');
                            // Если история открыта, используем fallback
                            if (window.updateHistoryItemWithImage && isHistoryClosed) {
                                console.log('🔄 Using fallback visual update while history is open');
                                window.updateHistoryItemWithImage(generation.id, response.image_url);
                                visualUpdateDone = true;
                            }
                        }

                        // 🔥 ВСЕГДА отправляем события завершения генерации для background listeners
                        console.log('🎯 Sending completion events for generation:', generation.id, `(visualUpdateDone: ${visualUpdateDone})`);

                        const completionEvent = new CustomEvent(`generation:completed:${generation.taskUUID}`, {
                            detail: replacementData
                        });
                        document.dispatchEvent(completionEvent);

                        // Также отправляем глобальное событие
                        const globalCompletionEvent = new CustomEvent('generation:completed', {
                            detail: {
                                ...replacementData,
                                generation_id: generation.id,
                                taskUUID: generation.taskUUID
                            }
                        });
                        document.dispatchEvent(globalCompletionEvent);

                        console.log('🎯 Background completion events sent for generation:', generation.id);

                // Обновляем текущую генерацию в памяти
                generation.result = response.image_url;
                generation.status = 'completed';

                // 🔥 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: ДОБАВЛЯЕМ ГЕНЕРАЦИЮ В ИСТОРИЮ ПРИ ЗАВЕРШЕНИИ
                if (window.appState) {
                    window.appState.addGeneration(generation);
                    window.appState.currentGeneration = generation;
                    window.appState.saveHistory();
                    console.log('💾 Generation successfully added to history and saved');
                }

                // Обновляем баланс если возвращается в ответе
                if (response.remaining_credits !== undefined && window.updateUserBalance) {
                    window.updateUserBalance(response.remaining_credits);
                }

                // Сохраняем дополнительные данные от webhook
                if (response.generation_cost !== undefined) {
                    generation.generation_cost = response.generation_cost;
                    generation.cost_currency = response.cost_currency || 'Cr';
                }
                if (response.imageUUID) {
                    generation.imageUUID = response.imageUUID;
                }

                // Показываем уведомление
                try {
                    if (window.showResultToast) {
                        window.showResultToast({ image_url: response.image_url });
                        console.log('🎯 Success notification shown for generation:', generation.id);
                    } else if (window.showToast) {
                        window.showToast('success', 'Изображение готово! Посмотрите в истории.');
                    }
                } catch (e) {
                    console.error('❌ Error showing success notification:', e);
                }

                // Финальный статус: превью заменено успешно
                console.log(`✅ Generation ${generation.id} completed successfully - preview replaced using taskUUID`);

                this.completeGeneration(generation.id, response.image_url);
                return;
            }

            // Неожиданный формат ответа
            throw new Error('Unexpected response format');

        } catch (error) {
            // 🚨 ТОСТ ПРО ПЕРЕГРУЗКУ ПОКАЗЫВАТЬ НА ВСЕ ОШИБКИ (КРОМЕ ВАЛИДНОГО SUCCESS JSON)
            console.log(`🚨 Showing server overload toast for all non-success responses for generation ${generation.id}`);

            if (window.showToast) {
                const overloadMessage = '😓 Генерация не удалась. Серверы сейчас перегружены, пожалуйста, попробуйте позже или выберите другой режим генерации… Мы искренне извиняемся за неудобства и надеемся на ваше понимание 🙏';
                window.showToast('error', overloadMessage);
            }

            console.error(`❌ Generation error for ${generation.id}:`, error);
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

    // Restore visual elements (animations) for persisted generations
    restoreVisualElements(persistedState) {
        try {
            // Filter generations that need visual restoration
            const generationsToRestore = [];

            // Active generations that are processing
            if (persistedState.activeGenerations && Array.isArray(persistedState.activeGenerations)) {
                persistedState.activeGenerations.forEach(([id, generation]) => {
                    if (generation.status === 'processing' && !generation.result) {
                        generationsToRestore.push(generation);
                    }
                });
            }

            // Queued generations
            if (persistedState.generationQueue && Array.isArray(persistedState.generationQueue)) {
                persistedState.generationQueue.forEach(generation => {
                    generationsToRestore.push(generation);
                });
            }

            console.log(`🎨 Restoring visual elements for ${generationsToRestore.length} generations`);

            // Create visual animations for restored generations
            generationsToRestore.forEach(generation => {
                // Add to history as processing
                if (window.appState && window.appState.addGeneration) {
                    // Ensure generation is in history for visual restoration
                    if (!window.appState.generationHistory.find(g => g.id === generation.id)) {
                        window.appState.addGeneration({
                            ...generation,
                            status: 'processing',
                            timestamp: generation.timestamp || new Date().toISOString()
                        });
                        console.log(`📝 Added generation ${generation.id} to history for visual restoration`);
                    }
                }

                // Create loading animation in DOM
                setTimeout(() => {
                    if (window.createLoadingHistoryItem) {
                        const visualElement = window.createLoadingHistoryItem(generation);
                        if (visualElement) {
                            console.log(`✅ Restored visual animation for generation ${generation.id}`);
                        } else {
                            console.warn(`⚠️ Failed to create visual element for generation ${generation.id}`);
                        }
                    } else {
                        console.warn('❌ createLoadingHistoryItem not available for visual restoration');
                    }
                }, 500); // Small delay to ensure DOM is ready
            });

        } catch (error) {
            console.error('❌ Error restoring visual elements:', error);
        }
    }

    // Override persistState to include generationHistory backup
    persistState() {
        if (!this.persistEnabled) return;

        try {
            const stateToSave = {
                activeGenerations: Array.from(this.activeGenerations.entries()),
                generationQueue: this.generationQueue,
                generationHistory: window.appState?.generationHistory || [], // 🔥 NEW: Backup complete history
                timestamp: Date.now(),
                version: '1.0'
            };

            localStorage.setItem(this.storageKey, JSON.stringify(stateToSave));

            // Update UI indicators
            this.updateUIIndicators();

        } catch (error) {
            console.warn('❌ Failed to persist GenerationManager state:', error.message);
        }
    }

    // Start background completion polling for cross-tab synchronization
    startBackgroundCompletionPolling() {
        if (!this.persistEnabled) return;

        this.lastPollTimestamp = Date.now();
        this.backgroundPollInterval = setInterval(() => {
            this.checkBackgroundCompletions();
        }, 3000); // Poll every 3 seconds

        console.log('🔄 Started background completion polling (3s intervals)');

        // Listen for storage changes from other tabs
        window.addEventListener('storage', (event) => {
            if (event.key === this.storageKey && event.newValue) {
                console.log('🔄 Storage change detected from another tab, checking completions');
                setTimeout(() => this.checkBackgroundCompletions(), 100);
            }
        });
    }

    // Check for completions from background processes or other tabs
    checkBackgroundCompletions() {
        if (!this.persistEnabled) return;

        try {
            const savedState = localStorage.getItem(this.storageKey);
            if (!savedState) return;

            const state = JSON.parse(savedState);
            if (!state || !state.activeGenerations) return;

            // Check for completed generations that we haven't processed yet
            const completedGenerations = [];
            state.activeGenerations.forEach(([id, generation]) => {
                if (generation.result && generation.status === 'completed') {
                    // Check if this generation is not already completed in our local state
                    const localGen = this.activeGenerations.get(id);
                    if (localGen && !localGen.result) {
                        console.log(`🎯 Found background-completed generation ${id}, processing locally`);
                        completedGenerations.push(generation);
                    }
                }
            });

            // Process background completions
            completedGenerations.forEach(generation => {
                // Update local active generation
                const localGen = this.activeGenerations.get(generation.id);
                if (localGen) {
                    localGen.result = generation.result;
                    localGen.status = 'completed';
                    localGen.completedAt = generation.completedAt;
                    localGen.generation_cost = generation.generation_cost;
                    localGen.cost_currency = generation.cost_currency;
                    localGen.imageUUID = generation.imageUUID;

                    console.log(`✅ Processed background completion for generation ${generation.id}`);

                    // Trigger visual update events
                    const completionData = {
                        image_url: generation.result,
                        generation_id: generation.id,
                        mode: generation.mode,
                        style: generation.style,
                        generation_cost: generation.generation_cost,
                        cost_currency: generation.cost_currency,
                        remaining_credits: generation.remaining_credits,
                        imageUUID: generation.imageUUID,
                        taskUUID: generation.taskUUID
                    };

                    // Send completion events
                    const taskUUIDEvent = new CustomEvent(`generation:completed:${generation.taskUUID}`, {
                        detail: completionData
                    });
                    document.dispatchEvent(taskUUIDEvent);

                    const globalEvent = new CustomEvent('generation:completed', {
                        detail: {
                            ...completionData,
                            generation_id: generation.id,
                            taskUUID: generation.taskUUID
                        }
                    });
                    document.dispatchEvent(globalEvent);

                    console.log(`🎯 Background completion events sent for generation ${generation.id}`);

                    // Remove from active list since it's completed
                    this.activeGenerations.delete(generation.id);
                    this.persistState();
                }
            });

        } catch (error) {
            console.error('❌ Error checking background completions:', error);
        }
    }

    // Update UI indicators when persisting state
    updateUIIndicators() {
        try {
            if (window.updateHistoryCount) {
                // Include active animations in count
                const animationCount = this.activeGenerations.size + this.generationQueue.length;

                // Wait a bit for DOM updates
                setTimeout(() => window.updateHistoryCount(), 100);
            }
        } catch (error) {
            console.warn('Failed to update UI indicators:', error.message);
        }
    }
}

// Глобальный экземпляр
const generationManager = new GenerationManager();

// Экспорт для использования в других файлах
window.GenerationManager = GenerationManager;
window.generationManager = generationManager;
