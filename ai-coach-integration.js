/**
 * AI Coach Integration Module
 * Handles lazy loading and integration of AI Coach functionality
 */

// 🎯 AI Coach Integration Module
const aiCoachIntegration = {
    // ✅ ДАТА-ОСНОВНАЯ ЛОГИКА ДЛЯ TOOLTIP (РАЗ В НЕДЕЛЮ)
    lastTooltipShown: null,
    buttonCreated: false,
    aiCoachLoaded: false,

    /**
     * ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
     */
    init() {
        // Загружаем состояния из localStorage
        const lastTooltipTs = localStorage.getItem('aiCoachLastTooltipShown');
        this.lastTooltipShown = lastTooltipTs ? parseInt(lastTooltipTs) : null;
        this.buttonCreated = localStorage.getItem('aiCoachButtonCreated') === 'true';
        this.aiCoachLoaded = localStorage.getItem('aiCoachLoaded') === 'true';

        console.log('🎭 AI Coach Integration initialized:', {
            lastTooltipShown: this.lastTooltipShown ? new Date(this.lastTooltipShown).toLocaleString() : null,
            buttonCreated: this.buttonCreated,
            aiCoachLoaded: this.aiCoachLoaded,
            shouldShowTooltip: this.shouldShowTooltip()
        });

        // ✅ ВСЕГДА ОБЕСПЕЧИВАЕМ КНОПКУ
        this.ensureCoachButton();

        this.setupEventListeners();
    },

    /**
     * ПРОВЕРКА, НАДО ЛИ ПОКАЗАТЬ TOOLTIP (РАЗ В НЕДЕЛЮ)
     */
    shouldShowTooltip() {
        if (!this.lastTooltipShown) return true; // Первый раз

        const weekInMs = 7 * 24 * 60 * 60 * 1000;
        const timeSinceLastShow = Date.now() - this.lastTooltipShown;

        return timeSinceLastShow > weekInMs;
    },

    /**
     * ОБЕСПЕЧИТЬ НАЛИЧИЕ КНОПКИ AI COACH
     */
    async ensureCoachButton() {
        try {
            // Если кнопка уже создана и доступна, ничего не делаем
            if (this.buttonCreated && document.querySelector('.ai-coach-btn')) {
                console.log('🎯 AI Coach button already exists');
                return;
            }

            console.log('🔄 Ensuring AI Coach button creation...');

            // Импортируем и создаем кнопку
            const { createCoachButton } = await import('./ai-coach.js');
            createCoachButton();

            // Отмечаем как созданную
            this.buttonCreated = true;
            localStorage.setItem('aiCoachButtonCreated', 'true');

            console.log('✅ AI Coach button ensured');

        } catch (error) {
            console.error('❌ Failed to ensure AI Coach button:', error);
        }
    },

    /**
     * НАСТРОЙКА ОБРАБОТЧИКОВ СОБЫТИЙ
     */
    setupEventListeners() {
        // 🎯 ЕДИНЫЙ СЛУШАТЕЛЬ НА ВСЕ ГЕНЕРАЦИИ С ЦЕНТРАЛИЗОВАННОЙ ЛОГИКОЙ
        let generationCounter = 0;

        document.addEventListener('generation:completed', async () => {
            generationCounter++;

            console.log(`🔄 Generation completed: ${generationCounter}, should show tooltip: ${this.shouldShowTooltip()}, ai coach loaded: ${this.aiCoachLoaded}`);

            // 🎯 TOOLTIP ПОКАЗЫВАЕТСЯ РАЗ В НЕДЕЛЮ НА ПЕРВОЙ ГЕНЕРАЦИИ + НЕМЕДЛЕННАЯ ЗАГРУЗКА AI COACH
            if (generationCounter === 1 && this.shouldShowTooltip()) {
                await this.showWeeklyTooltip();
                // ✅ НЕМЕДЛЕННАЯ ЗАГРУЗКА AI COACH ПРИ ПОКАЗЕ TOOLTIP (убираем ненужный счетчик генераций >=3)
                setTimeout(async () => {
                    if (!this.aiCoachLoaded) {
                        await this.loadFullAICoach();
                    }
                }, 500); // Маленькая задержка для стабильности
            }
        });
    },

    /**
     * ПОКАЗАТЬ TOOLTIP РАЗ В НЕДЕЛЮ (ОРИЕНТИР ПО ДАТАМ)
     */
    async showWeeklyTooltip() {
        try {
            console.log('🚀 Showing weekly AI Coach tooltip...');

            // МИНИМАЛЬНЫЙ ИМПОРТ ТОЛЬКО ДЛЯ TOOLTIP
            const { createCoachTooltip } = await import('./ai-coach.js');

            // Добавляем MCP запись
            if (typeof useMCPTool === 'function') {
                await useMCPTool({
                    server_name: 'pixplace-project',
                    tool_name: 'add_project_insights',
                    arguments: {
                        insight_type: 'decision',
                        title: 'AI Coach Weekly Tooltip Display',
                        description: 'Tooltip shown based on weekly schedule. User engagement reminder.',
                        tags: ['ai_coach', 'tooltip', 'weekly_interaction']
                    }
                });
            }

            // Показ tooltip
            await createCoachTooltip();

            // ОБНОВЛЯЕМ TIMESTAMP ПОСЛЕДНЕГО ПОКАЗА
            this.lastTooltipShown = Date.now();
            localStorage.setItem('aiCoachLastTooltipShown', this.lastTooltipShown.toString());

            console.log('✅ Weekly tooltip shown successfully');

        } catch (error) {
            console.error('❌ Failed to show weekly tooltip:', error);
        }
    },

    /**
     * ЗАГРУЗИТЬ ПОЛНЫЙ AI COACH ПОСЛЕ НЕСКОЛЬКИХ ГЕНЕРАЦИЙ
     */
    async loadFullAICoach() {
        try {
            console.log('🚀 Loading full AI Coach after multiple generations...');

            // ЗАЩИТА: НЕ ЗАГРУЖАТЬ ЕСЛИ УЖЕ ЗАГРУЖЕН
            if (this.aiCoachLoaded) {
                console.log('🎭 AI Coach already loaded');
                return;
            }

            // ПОЛНЫЙ ИМПОРТ ДЛЯ КОМПЛЕКТНОЙ ФУНКЦИОНАЛЬНОСТИ
            const { initAICoach, createCoachButton } = await import('./ai-coach.js');

            // Инициализация всего функционала
            await initAICoach();
            await createCoachButton();

            // БЛОКИРОВКА ДЛЯ ВСЕЙ СЕССИИ
            this.aiCoachLoaded = true;
            localStorage.setItem('aiCoachLoaded', 'true');

            console.log('✅ Full AI Coach loaded successfully');

        } catch (error) {
            console.error('❌ Failed to load full AI Coach:', error);
        }
    },

    /**
     * ОТЛАДОЧНАЯ ИНФОРМАЦИЯ
     */
    getStatus() {
        return {
            lastTooltipShown: this.lastTooltipShown ? new Date(this.lastTooltipShown).toLocaleString() : null,
            buttonCreated: this.buttonCreated,
            aiCoachLoaded: this.aiCoachLoaded,
            shouldShowTooltip: this.shouldShowTooltip(),
            daysSinceLastTooltip: this.lastTooltipShown ?
                Math.floor((Date.now() - this.lastTooltipShown) / (24 * 60 * 60 * 1000)) : null,
            localStorage: {
                lastTooltipShown: localStorage.getItem('aiCoachLastTooltipShown'),
                buttonCreated: localStorage.getItem('aiCoachButtonCreated'),
                loaded: localStorage.getItem('aiCoachLoaded')
            }
        };
    },

    /**
     * СБРОС ДЛЯ ОТЛАДКИ (ТОЛЬКО В РАЗРАБОТКЕ)
     */
    resetForDebug() {
        if (window.location.hostname !== 'localhost') return;

        console.warn('🔄 Resetting AI Coach state for debugging (dev only)');
        this.lastTooltipShown = null;
        this.buttonCreated = false;
        this.aiCoachLoaded = false;
        localStorage.removeItem('aiCoachLastTooltipShown');
        localStorage.removeItem('aiCoachButtonCreated');
        localStorage.removeItem('aiCoachLoaded');
        localStorage.removeItem('generationCount');

        console.log('✅ AI Coach state reset successfully');
    }
};

// ========== ИНИЦИАЛИЗАЦИЯ ==========
aiCoachIntegration.init();

// ========== ГЛОБАЛЬНЫЙ ДОСТУП ДЛЯ ОТЛАДКИ ==========
if (window.location.hostname === 'localhost') {
    window.aiCoachIntegration = aiCoachIntegration;
}

// ========== ЭКСПОРТ ==========
export { aiCoachIntegration };
