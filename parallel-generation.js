/**
 * Parallel Image Generation Manager
 * Управление параллельной генерацией изображений с очередью и статусами
 */

class GenerationManager {
    constructor() {
        this.activeGenerations = new Map(); // id -> generation object
        this.generationQueue = []; // очередь ожидающих генераций
        this.maxConcurrentGenerations = 3; // максимум параллельных генераций
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
            const limitReached = response.limit_reached === true ||
                response.limit_reached === 'true' ||
                response.limit_reached === '1' ||
                response.limit_reached === 1;

            if (limitReached) {
                console.log(`🚨 CREDIT LIMIT REACHED: ${response.message || 'Generation limit reached'}`);
                generation.status = 'limit';
                if (window.showSubscriptionNotice) {
                    window.showSubscriptionNotice(response);
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
                                console.warn(`⚠️ Preview replacement failed (history closed: ${!isHistoryClosed}), not updating DOM`);
                                // НЕ используем fallback когда история закрыта - обновление будет при следующем открытии
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

                // Сохраняем обновленное состояние
                if (window.appState) {
                    window.appState.currentGeneration = generation;
                    window.appState.saveHistory();
                    console.log('💾 Generation state saved after webhook success');
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
}

// Глобальный экземпляр
const generationManager = new GenerationManager();

// Экспорт для использования в других файлах
window.GenerationManager = GenerationManager;
window.generationManager = generationManager;
