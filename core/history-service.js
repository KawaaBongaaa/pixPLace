// core/history-service.js - Сервис для работы с внешней историей генераций

class HistoryService {
    constructor() {
        this.baseUrl = (window.CONFIG && window.CONFIG.HISTORY_WEBHOOK_URL)
            ? window.CONFIG.HISTORY_WEBHOOK_URL
            : 'https://alv-n8n.pixplace.space/webhook/get-generation-history';
        this.cache = new Map(); // Кэш страниц истории
        this.currentPage = 0;
        this.pageSize = 30;
        this.hasMorePages = true;
        this.loadingStates = new Set();

        // 🔥 TEMPORARY: Флаг для тестирования без аутентификации
        this.testMode = false; // В ПРОДАКШЕНЕ установить false

        console.log('📚 HistoryService initialized', this.testMode ? '(TEST MODE)' : '');
    }

    /**
     * Загружает страницу истории генераций
     * @param {string} userId - ID пользователя
     * @param {number} page - Номер страницы (начиная с 0)
     * @param {number} limit - Количество элементов на страницу
     * @returns {Promise<Object>} - Объект с generations и мета-данными
     */
    async loadHistoryPage(userId, page = 0, limit = 30, forceRefresh = false) {
        // 🔥 TEMPORARY: В тестовом режиме обходим проверку user_id
        if (!this.testMode && !userId) {
            throw new Error('User ID is required');
        }

        // Используем фиксированный ключ для тестового режима
        const effectiveUserId = this.testMode ? 'test_user' : userId;
        const cacheKey = `${effectiveUserId}_${page}_${limit}`;

        if (forceRefresh) {
            this.cache.delete(cacheKey);
        }

        // Проверяем кэш
        if (this.cache.has(cacheKey)) {
            console.log(`📋 Returning cached history page ${page} for user ${userId}`);
            return this.cache.get(cacheKey);
        }

        // Проверяем что запрос не выполняется
        if (this.loadingStates.has(cacheKey)) {
            console.log(`⏳ History page ${page} already loading, waiting...`);
            // Ждем завершения загрузки
            while (this.loadingStates.has(cacheKey)) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return this.cache.get(cacheKey);
        }

        this.loadingStates.add(cacheKey);

        try {
            // 🔥 TEMPORARY: В тестовом режиме отправляем null вместо user_id
            const queryUserId = this.testMode ? null : userId;
            console.log(`📡 Loading history page ${page} for user ${userId} (limit: ${limit})`, this.testMode ? '(TEST MODE - sending null)' : '');

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    user_id: queryUserId,
                    page: page,
                    limit: limit
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            let responseData;

            // 🔥 CRITICAL FIX: To prevent "Unexpected end of JSON input" error
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const text = await response.text();
                if (text && text.trim().length > 0) {
                    try {
                        responseData = JSON.parse(text);
                    } catch (e) {
                        console.warn('⚠️ Webhook returned invalid JSON string, treating as empty', e);
                        responseData = [];
                    }
                } else {
                    console.log('📦 Webhook returned empty body but status was OK');
                    responseData = [];
                }
            } else {
                console.warn('⚠️ Webhook returned non-JSON content type:', contentType);
                responseData = [];
            }

            // Определяем массив генераций с поддержкой различных форматов webhook (особенно n8n)
            let generationsArray = [];
            let totalItems = 0;
            let hasMoreApi = undefined;

            if (Array.isArray(responseData)) {
                // Если webhook вернул массив
                if (responseData.length === 1 && Array.isArray(responseData[0].generations)) {
                    // n8n обернул объект: [ { generations: [...], total, hasMore } ]
                    generationsArray = responseData[0].generations;
                    totalItems = responseData[0].total || 0;
                    hasMoreApi = responseData[0].hasMore;
                } else if (responseData.length === 1 && Array.isArray(responseData[0])) {
                    // n8n обернул массив в массив: [ [...] ]
                    generationsArray = responseData[0];
                } else {
                    // Прямой массив объектов генераций
                    generationsArray = responseData;
                }
            } else if (responseData && Array.isArray(responseData.generations)) {
                // Прямой объект JSON с полем generations
                generationsArray = responseData.generations;
                totalItems = responseData.total || 0;
                hasMoreApi = responseData.hasMore;
            } else {
                console.warn('⚠️ Webhook returned unexpected format, treating as empty array', responseData);
                generationsArray = [];
            }

            console.log(`✅ Received history data: ${generationsArray.length} items from webhook`);

            // Форматируем данные в ожидаемый формат
            // Данные могут приходить в формате {json: {...}} или напрямую
            const formattedData = {
                generations: generationsArray.map(item => {
                    // Извлекаем данные из поля json, если оно есть, иначе используем item напрямую
                    const genData = item.json || item;
                    return {
                        id: genData.generation_id || genData.id || genData.row_number, // 🔥 CRITICAL FIX: Ensure `id` is present for UI dependencies
                        generation_id: genData.generation_id || genData.id || genData.row_number,
                        task_uuid: genData.task_uuid,
                        prompt: genData.prompt,
                        mode: genData.mode,
                        style: genData.style,
                        status: genData.status,
                        image_url: genData.image_url,
                        result: genData.image_url, // 🔥 COMPATIBILITY: Map image_url to result for UI
                        timestamp: genData.timestamp || genData.createdAt,
                        generation_cost: genData.generation_cost,
                        cost_currency: genData.cost_currency
                    };
                }),
                total: totalItems,
                page: page,
                limit: limit,
                hasMore: hasMoreApi !== undefined ? hasMoreApi : (generationsArray.length === limit)
            };

            // Определяем есть ли еще страницы
            this.hasMorePages = formattedData.hasMore || formattedData.generations.length === limit;

            // Сохраняем в кэш
            this.cache.set(cacheKey, formattedData);

            // Очищаем кэш если он слишком большой (> 10 страниц)
            if (this.cache.size > 10) {
                this.cleanupCache();
            }

            console.log(`💾 Cached history page ${page}, cache size: ${this.cache.size}`);

            return formattedData;

        } catch (error) {
            console.error('❌ Failed to load history page:', error);
            throw error;
        } finally {
            this.loadingStates.delete(cacheKey);
        }
    }

    /**
     * Проверяет статус генерации по taskUUID
     * @param {string} taskUUID - UUID задачи
     * @param {string} userId - ID пользователя
     * @returns {Promise<Object>} - Статус генерации
     */
    async checkGenerationStatus(taskUUID, userId) {
        if (!taskUUID || !userId) {
            throw new Error('TaskUUID and UserID are required');
        }

        try {
            console.log(`🔍 Checking status for task ${taskUUID}`);

            const response = await fetch(`${this.baseUrl}/status?task_uuid=${taskUUID}&user_id=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`📊 Status check result:`, data.status);

            return data;

        } catch (error) {
            console.error('❌ Failed to check generation status:', error);
            throw error;
        }
    }

    /**
     * Очищает кэш старых страниц
     */
    cleanupCache() {
        if (this.cache.size <= 5) return; // Оставляем минимум 5 страниц

        const keys = Array.from(this.cache.keys());
        const keysToRemove = keys.slice(0, Math.floor(keys.length / 2)); // Удаляем половину

        keysToRemove.forEach(key => this.cache.delete(key));

        console.log(`🧹 Cleaned history cache: ${keysToRemove.length} pages removed, ${this.cache.size} remaining`);
    }

    /**
     * Получает кэшированную страницу без запроса
     * @param {string} userId
     * @param {number} page
     * @param {number} limit
     * @returns {Object|null}
     */
    getCachedPage(userId, page = 0, limit = 30) {
        const cacheKey = `${userId}_${page}_${limit}`;
        return this.cache.get(cacheKey) || null;
    }

    /**
     * Очищает весь кэш
     */
    clearCache() {
        this.cache.clear();
        this.loadingStates.clear();
        this.currentPage = 0;
        this.hasMorePages = true;
        console.log('🗑️ History cache cleared');
    }

    /**
     * Получает статистику кэша
     * @returns {Object}
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            loadingStates: this.loadingStates.size,
            currentPage: this.currentPage,
            hasMorePages: this.hasMorePages
        };
    }
}

// Экспорт
export { HistoryService };
const historyService = new HistoryService();
export default historyService;
