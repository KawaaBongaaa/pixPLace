/**
 * DreamShaper XL Generator Module
 * Отдельный модуль для генерации изображений в режиме DreamShaper XL
 */

class DreamShaperGeneratorModule {
    constructor() {
        this.initialized = false;
        this.webhookUrl = 'https://api.runware.ai/v1/'; // Direct API endpoint
    }

    /**
     * Инициализация модуля
     */
    init() {
        if (this.initialized) return;
        console.log('🎨 DreamShaperGeneratorModule initialized');
        this.initialized = true;
    }

    /**
     * Получить размеры для DreamShaper XL на основе выбранного значения
     * @param {string} sizeValue - значение из sizeSelect (square, landscape, portrait, etc.)
     * @returns {object} объект с width, height
     */
    getSizeForDreamShaper(sizeValue) {
        const sizeMap = {
            'square': { width: 1024, height: 1024 },          // Square 1:1
            'ultra_wide_landscape': { width: 1536, height: 640 }, // Ultra-Wide Landscape 21:9
            'wide_landscape': { width: 1344, height: 768 },   // Wide Landscape 16:9
            'standard_landscape': { width: 1152, height: 896 }, // Standard Landscape 4:3
            'classic_landscape': { width: 1280, height: 832 },  // Classic Landscape 3:2
            'classic_portrait': { width: 832, height: 1280 },   // Classic Portrait 2:3
            'standard_portrait': { width: 896, height: 1152 }, // Standard Portrait 3:4
            'tall_portrait': { width: 768, height: 1344 },     // Tall Portrait 9:16
            'ultra_tall_portrait': { width: 640, height: 1536 }  // Ultra-Tall Portrait 9:21
        };

        return sizeMap[sizeValue] || { width: 1024, height: 1024 }; // fallback to square
    }

    /**
     * Генерация изображений в режиме DreamShaper XL
     * @param {Object} generation - объект генерации из generationManager
     * @param {string} apiKey - API ключ Runware
     */
    async processGeneration(generation, apiKey) {
        console.log('🎨 Starting DreamShaper XL generation for generation:', generation.id);

        try {
            // Получить размеры на основе selected size
            const sizeOption = generation.size || 'square';
            const dimensions = this.getSizeForDreamShaper(sizeOption);

            console.log('🎨 Using size:', sizeOption, '-> dimensions:', dimensions);
            console.log('🎨 Task UUID:', generation.taskUUID);

            // Создаем запрос для DreamShaper XL
            const result = await this.directRunwareRequest(generation, dimensions, apiKey);
            console.log('🎨 DreamShaper XL result:', result);

            if (result.status === 'success') {
                console.log('✅ DreamShaper XL generation successful:', result.image_url);

                // Устанавливаем cost (может вернуться 0 для тестового режима)
                return {
                    status: 'success',
                    image_url: result.image_url,
                    cost: result.cost || 0,
                    cost_currency: 'Cr',
                    remaining_credits: null, // Пока без кредитов
                    imageUUID: result.imageUUID,
                    taskUUID: generation.taskUUID
                };
            } else {
                throw new Error(result.error || 'DreamShaper XL generation failed');
            }

        } catch (error) {
            console.error('❌ DreamShaper XL generation failed:', error);
            return {
                status: 'error',
                error: error.message || 'DreamShaper XL generation failed'
            };
        }
    }

    /**
     * Прямое обращение к Runware API для DreamShaper XL генерации
     * @param {Object} generation - объект генерации
     * @param {Object} dimensions - объект с width, height
     * @param {string} apiKey - API ключ
     */
    async directRunwareRequest(generation, dimensions, apiKey) {
        if (!apiKey) {
            throw new Error('Runware API key not configured');
        }

        const requestBody = [
            {
                taskType: "imageInference",
                model: "civitai:112902@355868",
                numberResults: 1,
                outputFormat: "JPEG",
                width: dimensions.width,
                height: dimensions.height,
                steps: 8,
                CFGScale: 3.3,
                scheduler: "KDPM2AncestralDiscreteScheduler",
                includeCost: true,
                checkNSFW: true,
                outputType: ["URL"],
                outputQuality: 99,
                positivePrompt: generation.prompt,
                taskUUID: generation.taskUUID
            }
        ];

        // 🔥 ДОБАВЛЯЕМ NEGATIVE PROMPT ТОЛЬКО ЕСЛИ ОН ПРЕДОСТАВЛЕН
        const requestData = requestBody[0]; // Получаем единственный объект в массиве
        if (generation.negativePrompt && generation.negativePrompt.trim().length > 0) {
            requestData.negativePrompt = generation.negativePrompt.trim();
            console.log('📝 Negative prompt added to DreamShaper XL request');
        } else {
            console.log('🚫 No negative prompt for DreamShaper XL - not sending');
        }

        // 🔥 ДОБАВЛЯЕМ imageUUID ЕСЛИ ДОСТУПЕН (ДЛЯ ИЗМЕНЕНИЯ СИЛЫ ПРИМЕНЕНИЯ)
        if (generation.imageUUIDs && generation.imageUUIDs.length > 0) {
            requestData.imageUUID = generation.imageUUIDs[0];
            console.log('🖼️ imageUUID added to DreamShaper XL request:', generation.imageUUIDs[0]);
        } else {
            console.log('🚫 No imageUUID for DreamShaper XL - pure text-to-image mode');
        }

        // 🔥 ДОБАВЛЯЕМ STRENGTH ПАРАМЕТР С ЗНАЧЕНИЕМ ПО УМОЛЧАНИЮ 0.8
        const strength = generation.strength || 0.8;
        requestData.strength = strength;
        console.log('🎚️ Strength parameter added to DreamShaper XL request:', strength);

        const finalRequestBody = requestBody; // Для ясности

        console.log('🎨 Direct Runware request for DreamShaper XL:', {
            taskUUID: generation.taskUUID,
            model: "civitai:112902@355868",
            size: `${dimensions.width}x${dimensions.height}`,
            prompt: generation.prompt?.substring(0, 50) + '...',
            hasNegativePrompt: !!(generation.negativePrompt && generation.negativePrompt.trim().length > 0)
        });

        try {
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(finalRequestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log('🎨 Direct Runware response for DreamShaper XL:', result);

            if (result.data && result.data[0] && result.data[0].imageURL) {
                return {
                    status: 'success',
                    image_url: result.data[0].imageURL,
                    cost: result.data[0].cost || 0,
                    imageUUID: result.data[0].imageUUID
                };
            } else {
                throw new Error('Unexpected response format from Runware');
            }
        } catch (error) {
            console.error('❌ Direct Runware request failed for DreamShaper XL:', error);
            throw error;
        }
    }
}

// Экземпляр модуля
const dreamShaperGeneratorModule = new DreamShaperGeneratorModule();

// Экспорт
export { dreamShaperGeneratorModule, DreamShaperGeneratorModule };

// Для совместимости с window
window.dreamShaperGeneratorModule = dreamShaperGeneratorModule;

console.log('🎨 DreamShaper XL Generator Module loaded');
