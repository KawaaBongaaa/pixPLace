/**
 * ai-prompt-helper.js — Ai Assistant pixPlace
 * Isolated module for pixPLace AI Prompt Helper
 * UID: KLB-12SN-17A | Cognitive Framework: 3-7-12-22-25 | ECHO-BLOCK Active
 * @version 1.0.0
 * @author pixPlace Team
 * @license MIT
 */

// ========== COGNITIVE ASSISTANT INTEGRATION ==========

/**
 * Creates and displays the AI Coach floating button
 * @function createCoachButton
 * @returns {void}
 * @global
 */
export function createCoachButton() {
    // Create button
    const coachButton = document.createElement('button');
    coachButton.textContent = 'AI Prompt Assistant';
    coachButton.className = 'ai-coach-btn';

    // Все стили теперь через CSS класс ai-coach-btn с медиа-запросами

    // Восстанавливаю правильную функциональность - открытие AI чата
    coachButton.onclick = () => {
        console.log('🧠 AI Coach button clicked');
        if (window.AICoach) {
            console.log('✅ AICoach found, showing...');
            window.AICoach.show();
        } else {
            console.warn('⚠️ AI Coach not loaded - loading now...');
            // Фолбэк: попробовать загрузить и показать
            if (typeof showToast !== 'undefined') {
                showToast('info', 'Loading AI Assistant...');
            }

            // Попытка загрузки
            setTimeout(() => {
                if (window.AICoach) {
                    window.AICoach.show();
                } else {
                    console.error('❌ Unable to load AI Coach');
                    if (typeof showToast !== 'undefined') {
                        showToast('error', 'Unable to load AI Assistant');
                    }
                }
            }, 1000);
        }
    };

    // Add to body (fixed position for easy access)
    document.body.appendChild(coachButton);

    // Style injection for button (minimal)
    const style = document.createElement('style');
    style.textContent = `
        .ai-coach-btn {
            font-size: 14px;
            border: none;
            cursor: pointer;
        }
        .ai-coach-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
    `;
    document.head.appendChild(style);

    console.log('🧠 AI Coach button created');
}

/**
 * Create tooltip for AI Coach suggestion after first generation
 */
export function createCoachTooltip() {
    // 🔥 ФУНКЦИЯ createCoachTooltip - ПРОСТОЕ СОЗДАНИЕ TOOLTIP
    // Все проверки теперь в ai-coach-integration.js

    // Create AI coach button first (visible from start)
    if (!document.querySelector('.ai-coach-btn')) {
        createCoachButton();


    }

    const coachButton = document.querySelector('.ai-coach-btn');
    if (!coachButton) {
        console.error('❌ AI Coach button not found for tooltip');
        return;
    }

    // Get button position for tooltip positioning
    const buttonRect = coachButton.getBoundingClientRect();

    // Dynamic bottom position based on screen width - closer to button
    const isWideScreen = window.innerWidth >= 1200;
    const isMediumScreen = window.innerWidth >= 768 && window.innerWidth < 1200;
    const dynamicBottom = isWideScreen ? '6rem' :
        isMediumScreen ? '5rem' :
            window.innerWidth <= 768 ? '4rem' :
                `${buttonRect.height + 10}px`;

    // Create tooltip container
    const tooltip = document.createElement('div');
    tooltip.className = 'ai-coach-tooltip';
    tooltip.style.cssText = `
        position: fixed !important;
        bottom: ${dynamicBottom} !important; /* Dynamic positioning for wide screens */
        left: ${Math.max(10, buttonRect.left + buttonRect.width / 2 - 110)}px !important; /* Center above button, but keep in viewport */
        background: transparent !important;
        color: rgba(34, 197, 94, 0.95) !important;
        padding: ${window.innerWidth <= 768 ? '0.75rem 1rem' : '0.875rem 1.25rem'} !important;
        border-radius: ${window.innerWidth <= 768 ? '1.25rem' : '1.5rem'} !important;
        box-shadow: 0 12px 20px -4px rgba(34, 197, 94, 0.2), 0 8px 8px -4px rgba(34, 197, 94, 0.08) !important;
        max-width: ${window.innerWidth <= 768 ? '220px' : '240px'} !important;
        z-index: 10001 !important;
        font-size: ${window.innerWidth <= 768 ? '0.8rem' : '0.825rem'} !important;
        line-height: 1.4 !important;
        border: 1px solid rgba(34, 197, 94, 0.25) !important;
        animation: tooltip-appear 0.4s ease-out !important;
        opacity: 0 !important;
        transform: translateY(8px) scale(0.95) !important;
        backdrop-filter: blur(10px) !important;
        -webkit-backdrop-filter: blur(10px) !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        font-weight: 500 !important;
    `;

    // Tooltip arrow pointing to button center
    const arrow = document.createElement('div');
    arrow.style.cssText = `
        position: absolute !important;
        bottom: -6px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        width: 0 !important;
        height: 0 !important;
        border-left: 6px solid transparent !important;
        border-right: 6px solid transparent !important;
        border-top: 6px solid rgba(255, 255, 255, 0.1) !important;
    `;

    const arrowInner = document.createElement('div');
    arrowInner.style.cssText = `
        position: absolute !important;
        bottom: 1px !important;
        left: -5px !important;
        width: 0 !important;
        height: 0 !important;
        border-left: 5px solid transparent !important;
        border-right: 5px solid transparent !important;
        border-top: 5px solid rgba(30, 41, 59, 0.8) !important;
    `;

    // Minimal content without button
    const content = document.createElement('div');
    content.innerHTML = `
        <div style="text-align: center; font-size: 0.75rem;">
            <span style="font-size: 1.1rem; filter: drop-shadow(0 1px 3px rgba(0,0,0,0.3));">☘️</span><br>
            <span style="font-weight: 500;">${typeof appState !== 'undefined' ? appState.translate('ai_tooltip_first_generation') : 'Nice start! Want to see how AI can expand your idea\'s?'}</span>
        </div>
    `;

    // Assemble tooltip
    arrow.appendChild(arrowInner);
    tooltip.appendChild(arrow);
    tooltip.appendChild(content);
    document.body.appendChild(tooltip);

    // Make entire tooltip clickable for activation
    tooltip.onclick = () => {
        console.log('✅ User activated AI Coach via tooltip click');
        hideCoachTooltip(tooltip);
        // AI Coach activated via tooltip click - handled automatically
    };

    // Auto-hide after 8 seconds
    setTimeout(() => {
        if (tooltip.parentNode) {
            hideCoachTooltip(tooltip);
        }
    }, 8000);

    // Animate in
    setTimeout(() => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0) scale(1)';
    }, 100);

    console.log('💬 AI Coach tooltip created above visible button');
    return tooltip;
}

/**
 * Hide and remove coach tooltip
 */
function hideCoachTooltip(tooltip) {
    if (!tooltip) return;

    tooltip.style.opacity = '0';
    tooltip.style.transform = 'translateY(10px) scale(0.95)';

    setTimeout(() => {
        if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
        }
    }, 300); // Wait for animation
}

export async function initAICoach() {
    try {
        // Проверить, что AICoach доступен (уже загружен из HTML)
        if (!window.AICoach) {
            console.warn('AI Coach not loaded from HTML');
            return;
        }

        // ❌ УБРАНО: createCoachButton() - кнопка создается только при ONE-TIME активации триггера
        // createCoachButton(); <- moved to activate() function

        // Дополнительно можно прослушать событие, если нужно
        window.addEventListener('ai-coach-ready', createCoachButton);
    } catch (error) {
        console.error('Failed to init AI Coach:', error);
    }
}

export function createChatButton() {
    // Create floating chat button
    const chatBtn = document.createElement('button');
    chatBtn.id = 'ai-chat-float-btn';
    chatBtn.innerHTML = 'AI Chat';
    chatBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 20px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
        transition: all 0.3s ease;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 8px;
    `;

    chatBtn.onmouseenter = () => {
        chatBtn.style.transform = 'scale(1.05)';
        chatBtn.style.boxShadow = '0 6px 25px rgba(99, 102, 241, 0.6)';
    };

    chatBtn.onmouseleave = () => {
        chatBtn.style.transform = 'scale(1)';
        chatBtn.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.4)';
    };

    chatBtn.onclick = () => {
        // DISABLED: Removed duplicate AICoach.show() call to prevent modal conflicts
        // if (window.AICoach) {
        //     window.AICoach.show();
        //     triggerHaptic('light');
        // }
        console.log('❌ Duplicate chat button disabled to prevent modal conflicts');
    };

    document.body.appendChild(chatBtn);
    console.log('🧠 AI Chat floating button created');
}

(function () {
    'use strict';

    // ========== CORE ARCHITECTURE ==========
    const COGNITIVE_ENGINE = {
        levels: ['ученик', 'игрок', 'исследователь'],
        triggers: [
            'удивление', 'боль', 'решение', 'доказательство', 'эксклюзив',
            'сенсорика', 'история', 'микро-обязательство', 'рефрейм',
            'онбординг', 'реферал', 'лояльность'
        ],
        cognitiveFramework: '3-7-12-22-25',
        echoBlock: { shock: '', segmentation: '', retention: '' }
    };

    // ========== PRIVATE STATE ==========
    let state = {
        userLevel: 'исследователь',
        conversationId: Date.now().toString(),
        history: [],
        currentTrigger: null,
        kpi: { clarity: 0, actionability: 0, understanding: 0 },
        modal: null,
        isOpen: false,
        isProcessing: false,
        chatUI: null,
        // PERFORMANCE: Message virtualization constants - increased for better UX
        MAX_VISIBLE_MESSAGES: 50,
        TYPING_INDICATOR: null, // Reusable typing indicator element
        messagesLoadedThroughDOM: false // PREVENT DUPLICATION: track if messages already loaded to DOM
    };

    // ========== LOCAL STORAGE FUNCTIONS ==========
    function loadChatHistory() {
        try {
            const saved = JSON.parse(localStorage.getItem('aiCoachHistory') || '{}');
            if (saved[state.conversationId]) {
                state.history = saved[state.conversationId];
                // Восстановить историю сообщений
                state.history.forEach(msg => {
                    addMessageToChat(msg.content, msg.role === 'user' ? 'user' : 'bot');
                });
            }
        } catch (error) {
            console.warn('Failed to load chat history:', error);
            state.history = [];
        }
    }

    function saveChatHistory() {
        try {
            const saved = JSON.parse(localStorage.getItem('aiCoachHistory') || '{}');
            saved[state.conversationId] = state.history;
            localStorage.setItem('aiCoachHistory', JSON.stringify(saved));
        } catch (error) {
            console.warn('Failed to save chat history:', error);
        }
    }

    // ========== TOKEN LIMIT FUNCTIONS ==========
    function estimateTokens(text) {
        // Rough estimation: 1 token ≈ 4 characters for Russian/English
        return Math.max(1, Math.ceil(text.length / 4));
    }

    function trimHistoryToTokenLimit(history, currentMessage, maxTokens = 5000) {
        const currentTokens = estimateTokens(currentMessage);
        let availableTokens = maxTokens - currentTokens - 100; // Reserve some tokens
        const trimmedHistory = [];
        let totalTokens = 0;

        // Start from the most recent messages
        for (let i = history.length - 1; i >= 0; i--) {
            const msg = history[i];
            const tokens = estimateTokens(msg.content);

            if (totalTokens + tokens <= availableTokens) {
                trimmedHistory.unshift(msg);
                totalTokens += tokens;
            } else {
                break;
            }
        }

        console.log(`📊 History trimmed: ${totalTokens} tokens (${trimmedHistory.length} messages)`);
        return trimmedHistory;
    }

    async function sendToWebhook(message, fullHistory) {
        // Проверяем доступность CONFIG
        const webhookUrl = (typeof window.CONFIG !== 'undefined' && window.CONFIG.CHAT_WEBHOOK_URL)
            ? window.CONFIG.CHAT_WEBHOOK_URL
            : 'https://hook.us2.make.com/your-chat-webhook-url';

        console.log('🪝 Using webhook URL:', webhookUrl);
        console.log('📤 Sending message:', message);

        // Trim history to fit token limit
        const trimmedHistory = trimHistoryToTokenLimit(fullHistory, message, 5000);
        console.log('📊 Trimmed history:', trimmedHistory.length, 'messages');

        const userId = (typeof appState !== 'undefined' && appState.userId)
            ? appState.userId
            : (typeof window !== 'undefined' && window.appState?.userId)
                ? window.appState.userId
                : 'unknown';
        const userName = (typeof appState !== 'undefined' && appState.userName)
            ? appState.userName
            : (typeof window !== 'undefined' && window.appState?.userName)
                ? window.appState.userName
                : 'Unknown';

        const payload = {
            action: 'AI Prompt Helper Chat Message',
            message: message,
            conversation_id: state.conversationId,
            history: trimmedHistory,
            user_id: userId,
            user_name: userName,
            timestamp: new Date().toISOString()
        };

        console.log('📦 Payload:', JSON.stringify(payload, null, 2));

        try {
            console.log('🔄 Starting fetch to:', webhookUrl);
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            console.log('📥 Response status:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Webhook error response:', errorText);
                throw new Error(`Webhook error: ${response.status} - ${errorText}`);
            }

            let responseText = await response.text();
            console.log('📄 Full webhook response:', responseText);

            // Очистка от markdown форматирования
            if (responseText.includes('```json')) {
                responseText = responseText.replace(/```json\n?/g, '').replace(/\n?```$/g, '');
                console.log('✨ Cleaned response:', responseText);
            }

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('❌ JSON parse error:', parseError);
                console.warn('📄 Raw response that failed to parse:', responseText);
                return 'Извините, произошла ошибка обработки ответа. Повторите пожалуйста.';
            }

            console.log('✅ Parsed webhook response data:', data);
            return data.response || 'Спасибо за сообщение! Ваш запрос обработан.';
        } catch (error) {
            console.error('💥 Webhook request failed:', error);
            console.error('Stack trace:', error.stack);
            return 'Извините, произошла ошибка. Повторите пожалуйста.';
        }
    }

    // ========== UTILITY FUNCTIONS ==========
    function createElement(tag, props = {}, children = []) {
        const el = document.createElement(tag);
        Object.assign(el, props);

        // Ensure children is an array
        if (!Array.isArray(children)) {
            children = [children];
        }

        children.forEach(child => {
            if (typeof child === 'string') {
                el.appendChild(document.createTextNode(child));
            } else if (child) {
                el.appendChild(child);
            }
        });
        return el;
    }

    // FIX SCROLLING: Enhanced scroll function with debug and multiple strategies
    function scrollChatToBottom(chatContainer) {
        if (!chatContainer) {
            console.error('❌ No chat container to scroll');
            return;
        }

        console.log('🔍 Scroll debug:', {
            id: chatContainer.id,
            scrollHeight: chatContainer.scrollHeight,
            clientHeight: chatContainer.clientHeight,
            scrollTop: chatContainer.scrollTop,
            isScrollable: chatContainer.scrollHeight > chatContainer.clientHeight,
            style: {
                overflowY: getComputedStyle(chatContainer).overflowY,
                height: getComputedStyle(chatContainer).height,
                maxHeight: getComputedStyle(chatContainer).maxHeight
            }
        });

        // Method 1: Force immediate scroll with height check
        const forceScroll = () => {
            if (chatContainer.scrollHeight > chatContainer.clientHeight) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
                console.log('✅ Method 1: Scrolled to', chatContainer.scrollTop);
            } else {
                console.log('⚠️ Method 1: Container not scrollable yet');
            }
        };

        // Try immediate scroll
        requestAnimationFrame(forceScroll);

        // Method 2: Delayed scroll (for dynamic content rendering)
        setTimeout(() => {
            requestAnimationFrame(() => {
                if (chatContainer.scrollHeight > chatContainer.clientHeight) {
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                    console.log('✅ Method 2: Scrolled to', chatContainer.scrollTop);
                }
            });
        }, 50);

        // Method 3: Super delayed scroll (for absolute safety)
        setTimeout(() => {
            requestAnimationFrame(() => {
                if (chatContainer.scrollHeight > chatContainer.clientHeight) {
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                    console.log('✅ Method 3: Final scroll to', chatContainer.scrollTop);
                }
            });
        }, 200);
    }

    function detectUserLevel(message) {
        // Enhanced heuristic based on message complexity
        const length = message.length;
        const complexity = (message.match(/[,:;.!?]/g) || []).length / length;
        const uppercaseWords = (message.match(/\b[A-ZА-Я]\w*\b/g) || []).length;
        const questions = (message.match(/\?/g) || []).length;

        // Yandexo's upgraded logic
        if (length < 30 || complexity < 0.05 || uppercaseWords < 1) {
            return 'ученик';
        }
        if (length < 150 || complexity < 0.12 || questions < 2) {
            return 'игрок';
        }
        return 'исследователь';
    }

    function selectOptimalTrigger(message) {
        // Enhanced selection with more patterns
        const patterns = {
            удивление: ['удив', 'неожида', 'шок', 'интересн', 'нов', 'вау'],
            боль: ['проблем', 'трудн', 'не работает', 'слома', 'ошибк', 'помоги'],
            решение: ['как', 'помо', 'реше', 'вариант', 'совет', 'что делать'],
            доказательство: ['почему', 'объясн', 'доказ', 'причин', 'факты'],
            эксклюзив: ['особ', 'уник', 'тольк', 'никт', 'секрет'],
            сенсорика: ['виде', 'зву', 'металл', 'запах', 'чувств', 'ощущ'],
            история: ['расска', 'выращива', 'был', 'была', 'было'],
            'микро-обязательство': ['попроб', 'сдела', 'планир', 'начн', 'давай'],
            рефрейм: ['дума', 'смотр', 'может', 'иначе', 'по-друг'],
            онбординг: ['обуч', 'изуч', 'науч', 'начина'],
            реферал: ['друг', 'знаком', 'пригл', 'подел', 'рассказ'],
            лояльность: ['верный', 'довер', 'поддерж', 'остаюс']
        };

        const lowerMsg = message.toLowerCase();
        for (const [trigger, words] of Object.entries(patterns)) {
            if (words.some(word => lowerMsg.includes(word))) {
                return trigger;
            }
        }

        // Fallback to default based on message length
        const index = Math.min(Math.floor(message.length / 20), COGNITIVE_ENGINE.triggers.length - 1);
        return COGNITIVE_ENGINE.triggers[index];
    }

    function createEchoBlock(message, trigger) {
        return {
            shock: `🔥 ШОК: Ваш запрос "${message.substring(0, 30)}..." активировал триггер "${trigger}"`,
            segmentation: `📊 АНАЛИЗ: Уровень "${state.userLevel}". Cognitive Framework: ${COGNITIVE_ENGINE.cognitiveFramework}`,
            retention: `🎯 ДЕЙСТВИЕ: Следующий шаг - интегрировать в pixPLace`
        };
    }

    function buildCognitiveContent(message) {
        const trigger = state.currentTrigger;

        // Dynamic cognitive content based on trigger
        const cognitiveTemplates = {
            удивление: `**P — Восприятие:** Ваш запрос требует интерактивного подхода к генерации!\n**M — Смысл:** Используйте когнитивные паттерны - сочетайте сложные понятия с неожиданными элементами.\n**A — Действие:** Структурируйте промпт как: "Создать {тип} с {интересный аспект} + {неожиданный элемент} в стиле {стиль}"`,

            боль: `**P — Восприятие:** Строгая рациональная оценка существующих ограничений.\n**M — Смысл:** Фокус на трансформации проблемы через детальное описание желаемого состояния.\n**A — Действие:** Используйте формулу: "Устранить {проблема} через {решение} дает {абсолютный результат}"`,

            решение: `**P — Восприятие:** Методичное рассмотрение всех доступных опций для достижения результата.\n**M — Смысл:** Логическая структура в комбинации с творческими подходами - математическая точность плюс артистичность.\n**A — Действие:** Формат: "Я хочу, чтобы AI создал {описание} используя {метод} для достижения {цель} с precision of {уровень детали}"`,

            доказательство: `**P — Восприятие:** Тщательная верификация всех параметров и условий корректности.\n**M — Смысл:** Enhancement через подробное обоснование - почему именно этот подход оптимален.\n**A — Действие:** Начать промпт: "Verification checklist complete: {условие} подтверждено || {новая концепция} requires {спецификация}"`,
        };

        return cognitiveTemplates[trigger] || `**Cognitive Framework:** Запрос обработан со стратегией neural adaptation.\n**Adaptive recommendation:** Рекомендуется стиль "${trigger}" с акцентом на детальную спецификацию.\n**Next iteration:** Усилить через increased contextual density.`;
    }

    function calculateKPI(response) {
        // Simple scoring
        state.kpi.clarity = 4;
        state.kpi.actionability = 5;
        state.kpi.understanding = 4;
        return state.kpi;
    }

    function suggestNextAction() {
        return 'Внедрить в pixPLace: toggle to Act Mode для кода.';
    }

    // ========== UI FUNCTIONS ==========
    function createModal() {
        if (state.modal) return state.modal;

        // Determine sizes based on screen width
        const isMobile = window.innerWidth <= 768;
        const buttonPadding = isMobile ? '0.5rem 1rem' : '0.75rem 1.5rem';
        const buttonSize = isMobile ? '0.875rem' : '0.9rem';
        const buttonMinWidth = isMobile ? 'auto' : 'none';

        const overlay = createElement('div', {
            id: 'ai-coach-overlay',
            className: 'ai-coach-overlay-modern hidden',
            style: {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.25)',
                backdropFilter: 'blur(12px) saturate(180%)',
                zIndex: '10000',
                opacity: '0',
                transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem'
            },
            onclick: (e) => {
                // Проверяем что клик именно по самому overlay, а не по дочерним элементам
                if (e.target === e.currentTarget) {
                    console.log('🧠 Clicked on modal backdrop - closing modal');
                    hideCognitiveAssistant();
                }
            }
        });

        const modal = createElement('div', {
            id: 'ai-coach-modal',
            className: 'ai-coach-modal', // Use CSS class instead of inline styles
            // Removed inline style to allow CSS control
        });

        // Header with gradient - CSS classes only
        const header = createElement('div', {
            className: 'ai-coach-header'
        }, [
            createElement('div', {
                className: 'ai-coach-header-content'
            }, [
                createElement('div', {
                    className: 'ai-coach-header-left'
                }, [
                    createElement('div', {
                        className: 'ai-coach-header-icon'
                    }, ''),
                    createElement('div', {}, [
                        createElement('h3', {
                            className: 'ai-coach-header-title'
                        }, typeof appState !== 'undefined' ? appState.translate('ai_chat_title') : 'AI Assistant')
                    ])
                ]),
                createElement('button', {
                    className: 'ai-coach-close-btn',
                    onclick: hideCognitiveAssistant,
                    title: typeof appState !== 'undefined' ? appState.translate('close_button') : 'Закрыть',
                    'aria-label': typeof appState !== 'undefined' ? appState.translate('close_button') : 'Закрыть'
                }, '×')
            ])
        ]);

        // Chat area - optimized container with CSS classes only
        const chatArea = createElement('div', {
            id: 'ai-coach-chat',
            className: 'ai-chat-container',
        }, [
            // Messages container - CSS controls all styling
            createElement('div', {
                id: 'ai-chat-messages',
                className: 'ai-chat-messages',
            }, [
                // Welcome message with proper translation
                createElement('div', {
                    className: 'ai-welcome-message',
                }, typeof appState !== 'undefined' ? appState.translate('ai_chat_ready') : 'AI chat ready!')
            ])
        ]);

        // Input area - CSS classes only
        const inputArea = createElement('div', {
            className: 'ai-coach-input-area',
            'aria-label': typeof appState !== 'undefined' ? appState.translate('ai_input_area_label') : 'Message input area'
        }, [
            createElement('div', {
                className: 'ai-coach-input-container'
            }, [
                createElement('input', {
                    id: 'ai-coach-input',
                    className: 'ai-coach-input form-textarea',
                    type: 'text',
                    placeholder: (typeof appState !== 'undefined' ? appState.translate('ai_placeholder_modal') : 'Write to your AI assistant...'),
                    'aria-label': typeof appState !== 'undefined' ? appState.translate('ai_placeholder_modal') : 'Write to your AI assistant...',
                    onkeypress: (e) => { if (e.key === 'Enter') sendMessage(); }
                }),
                createElement('button', {
                    id: 'ai-coach-send-btn',
                    className: 'ai-coach-send-btn',
                    onclick: sendMessage,
                    title: typeof appState !== 'undefined' ? appState.translate('ai_send_button') : 'Отправить сообщение',
                    'aria-label': typeof appState !== 'undefined' ? appState.translate('ai_send_button') : 'Отправить сообщение'
                }, '📤')
            ])
        ]);

        // DEBUG: Log the modal structure
        console.log('🧠 Created modal structure:', {
            header: header.outerHTML.substring(0, 100) + '...',
            chatArea: chatArea.outerHTML.substring(0, 100) + '...',
            inputArea: inputArea.outerHTML.substring(0, 100) + '...'
        });

        modal.append(header, chatArea, inputArea);
        overlay.appendChild(modal);

    // Animation styles controlled via CSS now - no inline style injection needed

        document.body.appendChild(overlay);
        state.modal = overlay;
        return overlay;
    }

    function renderCoachInterface() {
        console.log('🧠 renderCoachInterface called, messagesLoadedThroughDOM:', state.messagesLoadedThroughDOM);

        try {
            // Проверяем что модал существует и видим - если нет, создаем
            if (!state.modal) {
                console.log('🆕 Creating modal for the first time');
                createModal();
            }

            // PREVENT DUPLICATION: Load history from localStorage ONLY once per session
            if (!state.messagesLoadedThroughDOM) {
                console.log('📚 Loading chat history from localStorage (first time)');
                loadChatHistory();

                // Если история пустая, показать приветственное сообщение
                if (state.history.length === 0) {
                    const introKey = typeof appState !== 'undefined' ? appState.translate('ai_welcome_intro') : 'AI Prompt Helper: Welcome! I am your AI assistant for improving the quality of image generation results. Ask any question about creating prompts! Or briefly describe your vision, and I will create a professional prompt for you.';
                    addMessageToChat(introKey, 'bot');
                }

                // Mark as loaded to prevent duplication on reopening
                state.messagesLoadedThroughDOM = true;
                console.log('✅ Chat history loaded and rendered, messagesLoadedThroughDOM set to true');
            } else {
                console.log('⏯️ Skipping history load - already rendered in DOM');
            }

            state.isOpen = true;
            const modal = state.modal;
            console.log('🧠 Modal ready, showing...', modal);

            // ✅ FIX: PREVENT BODY SCROLL WHEN MODAL IS OPEN
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';

            // ✅ ФИКС: ПРИНУДИТЕЛЬНО ПОКАЗАТЬ MODAL через inline styles
            modal.style.display = 'flex';
            modal.style.opacity = '1';
            modal.style.zIndex = '10001';
            modal.classList.remove('hidden');

            // Также применить к внутреннему modal
            const innerModal = modal.querySelector('#ai-coach-modal');
            if (innerModal) {
                innerModal.style.opacity = '1';
                innerModal.style.transform = 'scale(1)';
            }

            console.log('✅ Modal forced visible, body scroll locked');

        } catch (error) {
            console.error('❌ Error in renderCoachInterface:', error);
        }
    }

    function createMessageElement(text, sender, timestamp = null, status = 'sent') {
        // Modern WhatsApp-style message bubble with status indicators and actions
        const messageDiv = createElement('div', {
            className: `ai-chat-message ${sender}`,
            // ACCESSIBILITY: ARIA labels and status
            'aria-label': `${sender === 'user' ? 'Your message' : 'AI Assistant message'}: ${text}`,
            'data-status': status,
            style: {
                marginBottom: '0.5rem',
                alignItems: 'flex-start'
            }
        });

        // Avatar - MOVED TO CSS CLASSES
        const avatar = createElement('div', {
            className: 'message-avatar'
        }, sender === 'user' ? '👤' : '');

        // Message bubble with content and actions
        const bubbleContainer = createElement('div', {
            className: 'message-bubble-container',
            style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
            }
        });

        // Message bubble content
        const bubble = createElement('div', {
            className: sender,
            style: {
                wordWrap: 'break-word'
            }
        });

        // Process text with line breaks and formatting
        const lines = text.split('\n');
        const messageContent = lines.map(line => {
            if (line.trim() === '') return createElement('br');
            return createElement('div', {}, line);
        });

        bubble.append(...messageContent);

        // Action buttons for bot messages (copy and insert)
        if (sender === 'bot') {
            const actionsDiv = createElement('div', {
                className: 'ai-message-actions'
            });

            // Copy button
            const copyBtn = createElement('button', {
                className: 'ai-action-btn ai-copy-btn',
                title: 'Copy message',
                type: 'button',
                onclick: async (e) => {
                    e.stopPropagation(); // Prevent message bubble click
                    try {
                        await navigator.clipboard.writeText(text);
                        // Visual feedback
                        copyBtn.textContent = '✓';
                        copyBtn.style.background = '#059669';
                        setTimeout(() => {
                            copyBtn.textContent = '📋';
                            copyBtn.style.background = '';
                        }, 1000);

                        console.log('✅ Message copied to clipboard');
                        if (typeof showToast !== 'undefined') {
                            showToast('success', 'Message copied!');
                        }
                    } catch (error) {
                        console.error('❌ Failed to copy message:', error);
                        // Fallback for older browsers
                        const textArea = createElement('textarea', {}, text);
                        textArea.style.position = 'absolute';
                        textArea.style.left = '-9999px';
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);

                        if (typeof showToast !== 'undefined') {
                            showToast('warning', 'Message copied (fallback method)');
                        }
                    }
                }
            }, '📋');

            // Insert prompt button - REPLACE text and close chat modal
            const insertBtn = createElement('button', {
                className: 'ai-action-btn ai-insert-btn',
                title: 'Insert into prompt field and close chat',
                type: 'button',
                onclick: async (e) => {
                    e.stopPropagation(); // Prevent message bubble click

                    // Find the MAIN prompt input field (generation screen)
                    const mainPromptField = document.getElementById('promptInput');

                    if (mainPromptField && text.length < 1000) { // Reasonable limit for prompts
                        // COMPLETELY REPLACE the current prompt text
                        mainPromptField.value = text;

                        // Visual feedback for button
                        insertBtn.textContent = '✓';
                        insertBtn.style.background = '#7c3aed';
                        setTimeout(() => {
                            insertBtn.textContent = '📝';
                            insertBtn.style.background = '';
                        }, 1000);

                        // Highlight the prompt field
                        mainPromptField.style.backgroundColor = 'rgba(124, 58, 237, 0.1)';
                        mainPromptField.style.borderColor = '#7c3aed';
                        mainPromptField.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.2)';
                        setTimeout(() => {
                            mainPromptField.style.backgroundColor = '';
                            mainPromptField.style.borderColor = '';
                            mainPromptField.style.boxShadow = '';
                        }, 2000);

                        // Close the chat modal first
                        console.log('🔄 Closing chat modal after prompt insertion');
                        hideCognitiveAssistant();

                        // Small delay to ensure modal is closed before focusing
                        setTimeout(() => {
                            mainPromptField.focus();
                            mainPromptField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            console.log('✅ Prompt replaced and chat modal closed - user transitioned to generation');

                            if (typeof showToast !== 'undefined') {
                                showToast('success', 'Prompt inserted - ready to generate!');
                            }
                        }, 150);

                    } else {
                        console.warn('❌ Could not find main prompt field or prompt too long');
                        if (typeof showToast !== 'undefined') {
                            showToast('error', 'No prompt field found or prompt too long');
                        }
                    }
                }
            }, '📝');

            actionsDiv.append(copyBtn, insertBtn);
            bubbleContainer.append(bubble, actionsDiv);
        } else {
            bubbleContainer.appendChild(bubble);
        }

        // Timestamp
        if (timestamp) {
            const timeStr = new Date(timestamp).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            });

            const timestampEl = createElement('div', {
                className: 'message-timestamp'
            }, timeStr);

            bubble.appendChild(timestampEl);
        }

        // Assemble message - adjust order for proper layout
        if (sender === 'user') {
            messageDiv.appendChild(bubbleContainer);
            messageDiv.appendChild(avatar);
        } else {
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(bubbleContainer);
        }

        return messageDiv;
    }

    function getOrCreateTypingIndicator() {
        // PERFORMANCE: Reuse typing indicator instead of recreating
        if (!state.TYPING_INDICATOR) {
            state.TYPING_INDICATOR = createTypingIndicator();
        }
        return state.TYPING_INDICATOR;
    }

    function createTypingIndicator() {
        // Keep the same structure but make it reusable
        const typingDiv = createElement('div', {
            id: 'ai-typing-indicator', // Add ID for reusability
            style: {
                maxWidth: '85%',
                marginBottom: '0.75rem',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-end',
                gap: '0.5rem'
            }
        });

        // Avatar
        const avatar = createElement('div', {
            style: {
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                color: 'white',
                background: 'linear-gradient(135deg, #ec4899, #f97316)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                flexShrink: '0'
            }
        }, '☘️');

        // Typing bubble - MOVED TO CSS.class
        const bubble = createElement('div', {
            className: 'ai-typing-indicator-bubble'
        });

        // Typing animation
        const indicator = createElement('div', {
            className: 'ai-typing-indicator'
        }, createElement('div', {
            className: 'typing-dots'
        }, [
            createElement('span'),
            createElement('span'),
            createElement('span')
        ]));

        bubble.appendChild(indicator);
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(bubble);

        return typingDiv;
    }

    function addMessageToChat(text, sender) {
        const chat = document.getElementById('ai-chat-messages');
        if (!chat) {
            console.error('❌ #ai-chat-messages container not found! Chat messages cannot be displayed.');
            return;
        }

        let messageElement;
        if (text === 'TYPING_INDICATOR_FLAG') {
            // Special case for typing indicator - use reusable element
            messageElement = getOrCreateTypingIndicator();
            console.log('✨ Using typing indicator');
        } else {
            // Normal message - create new element
            messageElement = createMessageElement(text, sender);
        }

        // FIX SCROLLING: Add message with animation timing
        chat.appendChild(messageElement);

        // PERFORMANCE: Message virtualization - keep only last messages (reduced for better UX)
        const allMessages = Array.from(chat.children);
        if (allMessages.length > state.MAX_VISIBLE_MESSAGES) {
            const messagesToRemove = allMessages.length - state.MAX_VISIBLE_MESSAGES;
            for (let i = 0; i < messagesToRemove; i++) {
                if (allMessages[i] && allMessages[i].parentNode) {
                    chat.removeChild(allMessages[i]);
                }
            }
            console.log(`🧹 Virtualized: removed ${messagesToRemove} old messages`);
        }

        // FIX SCROLLING: Enhanced auto-scroll with multiple attempts
        scrollChatToBottom(chat);
    }

    function showChatScreen() {
        renderCoachInterface();
    }

    function hideChatScreen() {
        showGeneration(); // Go back to generation screen

        // Reset logo behavior
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.onclick = () => showGeneration();
        }

        // Hide back button in header when leaving chat screen
        if (typeof window.showBackButton === 'function') {
            window.showBackButton(false);
        }

        state.isOpen = false;
    }

    function initializeChat() {
        const messagesContainer = document.getElementById('ai-chat-messages');
        if (!messagesContainer) {
            console.error('Chat messages container not found!');
            return;
        }

        console.log('🚀 Initializing chat screen');
        console.log('📋 All input elements in DOM:', document.querySelectorAll('input').length);
        console.log('📋 All ai-chat-input in DOM:', document.querySelectorAll('#ai-chat-input').length);
        console.log('📋 Chat screen visible:', !document.getElementById('chatScreen')?.classList.contains('hidden'));

        // Clear existing messages
        messagesContainer.innerHTML = '';

        // Show normal welcome message (RESTORED)
        const welcomeText = typeof appState !== 'undefined' ? appState.translate('ai_welcome_chat') : 'AI Prompt Helper: Welcome to the chat!';
        const welcomeMessage = createMessageElement(welcomeText, 'bot');
        welcomeMessage.setAttribute('data-welcome-message', 'true'); // Mark as welcome message
        messagesContainer.appendChild(welcomeMessage);

        // Load chat history (only actual conversation messages, not welcome)
        loadChatHistory();

        // Setup input handlers with delay to ensure elements are ready
        setTimeout(() => {
            const input = document.getElementById('ai-chat-input');
            const sendBtn = document.getElementById('ai-chat-send-btn');

            console.log('🎯 Setting up chat input handlers (delayed):', {
                input: !!input,
                inputTag: input?.tagName,
                inputId: input?.id,
                sendBtn: !!sendBtn,
                sendBtnId: sendBtn?.id
            });

            if (input && sendBtn) {
                const handleSend = () => {
                    console.log('🚀 Send message triggered');
                    sendMessage();
                };

                input.addEventListener('keypress', (e) => {
                    console.log('⌨️ Key pressed:', e.key, e.key === 'Enter');
                    if (e.key === 'Enter') handleSend();
                });
                sendBtn.addEventListener('click', (e) => {
                    console.log('👆 Send button clicked');
                    handleSend();
                });

                console.log('✅ Chat input handlers set up successfully');
            } else {
                console.error('❌ Chat input elements not found even after delay');
            }
        }, 200); // Small delay to ensure DOM is ready
    }

    function generateCognitiveResponse(message) {
        // Detect user level from message
        state.userLevel = detectUserLevel(message);

        // Select optimal trigger
        state.currentTrigger = selectOptimalTrigger(message);

        // Create ECHO-BLOCK
        state.echoBlock = createEchoBlock(message, state.currentTrigger);

        // Build cognitive content
        const cognitiveContent = buildCognitiveContent(message);

        // Calculate KPI
        state.kpi = calculateKPI({ content: cognitiveContent });

        // Suggest next action
        const nextAction = suggestNextAction();

        return {
            level: state.userLevel,
            trigger: state.currentTrigger,
            echo_block: state.echoBlock,
            content: cognitiveContent,
            kpi: state.kpi,
            next_step: nextAction,
            timestamp: new Date().toISOString()
        };
    }

    async function sendMessage() {
        console.log('🔥 sendMessage() called, isProcessing:', state.isProcessing);

        // 🔥 PRIORITY: Check modal input first (modern modal mode)
        let input = document.getElementById('ai-coach-input');
        console.log('🎯 Modal input found:', !!input, input?.id);

        if (!input) {
            console.log('🔄 Modal input not found, checking chat screen...');
            input = document.getElementById('ai-chat-input') || document.querySelector('#ai-chat-input');
            console.log('🎯 Chat screen input found:', !!input, input?.id, input?.tagName);
        }

        if (!input || !input.value.trim() || state.isProcessing) {
            console.log('🚫 sendMessage blocked:', {
                input: !!input,
                hasValue: !!input?.value?.trim(),
                value: input?.value,
                isProcessing: state.isProcessing
            });
            return;
        }

        const message = input.value.trim();
        console.log('📝 Adding user message to chat:', message);
        addMessageToChat(message, 'user');

        // Add to history
        state.history.push({ role: 'user', content: message, timestamp: new Date().toISOString() });
        saveChatHistory();

        console.log('🔄 Setting isProcessing = true');
        state.isProcessing = true;
        input.style.opacity = '0.5';
        input.value = '';

        // Show typing indicator AND get a reference to it immediately - REMOVED ROBOT EMOJI
        const typingKey = 'TYPING_INDICATOR_FLAG';
        const typingIndicator = getOrCreateTypingIndicator();
        addMessageToChat(typingKey, 'bot');
        console.log('🎭 Typing indicator created:', !!typingIndicator);

        try {
            // Send to webhook with history
            const aiResponse = await sendToWebhook(message, state.history.slice(0, -1)); // Exclude current message from history

            console.log('📨 AI Response received:', aiResponse.substring(0, 50));

            // IMPROVED: Remove typing indicator immediately to prevent element conflicts
            if (typingIndicator && typingIndicator.parentNode) {
                console.log('🗑️ Removing typing indicator immediately for clean transition');
                typingIndicator.classList.remove('removing'); // Remove any removal class
                typingIndicator.parentNode.removeChild(typingIndicator);
                console.log('✅ Typing indicator removed');
            } else {
                console.warn('⚠️ Typing indicator not found or already removed:', typingIndicator);
            }

            // Small delay to ensure proper DOM cleanup before adding new message
            await new Promise(resolve => setTimeout(resolve, 10));

            // Add AI response message with clean DOM state
            console.log('✉️ Adding AI response message');
            addMessageToChat(aiResponse, 'bot');

            // Add AI response to history
            state.history.push({ role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() });
            saveChatHistory();

        } catch (error) {
            console.error('Chat processing failed:', error);
            // Remove typing indicator from DOM
            if (typingIndicator && typingIndicator.parentNode) {
                console.log('🗑️ Removing typing indicator after error');
                typingIndicator.parentNode.removeChild(typingIndicator);
            }
            const errorKey = typeof appState !== 'undefined' ? appState.translate('ai_error_message') : 'Sorry, there was an error. Please try again.';
            addMessageToChat(errorKey, 'bot');
        } finally {
            console.log('🏁 Processing finished, setting isProcessing = false');
            state.isProcessing = false;
            input.style.opacity = '';
        }
    }

    function formatResponse(response) {
        let formatted = `**Уровень:** ${response.level}\n`;
        formatted += `**Триггер:** ${response.trigger}\n\n`;
        formatted += `**ECHO-BLOCK:**\n`;
        formatted += `- Шок: ${response.echo_block.shock}\n`;
        formatted += `- Сегментация: ${response.echo_block.segmentation}\n`;
        formatted += `- Удержание: ${response.echo_block.retention}\n\n`;
        formatted += `${response.content}\n\n`;
        formatted += `**KPI:** Clarity: ${response.kpi.clarity}/5 | Action: ${response.kpi.actionability}/5\n`;
        formatted += `**Следующий шаг:** ${response.next_step}`;
        return formatted;
    }

    function hideCognitiveAssistant() {
        if (state.modal) {
            state.modal.classList.add('hidden');
            state.isOpen = false;

            // ✅ FIX: RESTORE BODY SCROLL WHEN MODAL IS CLOSED
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
    }

    // ========== MCP INTEGRATION ==========
    async function saveToMCP(response) {
        if (typeof useMCPTool === 'function') {
            try {
                await useMCPTool({
                    server_name: 'pixplace-project',
                    tool_name: 'add_project_insights',
                    arguments: {
                        insight_type: 'decision',
                        title: `AI Coach Response: ${response.trigger}`,
                        description: JSON.stringify(response, null, 2),
                        tags: ['ai_coach', 'cognitive', response.trigger]
                    }
                });
            } catch (error) {
                console.warn('MCP save failed:', error);
            }
        }
    }

    // ========== PUBLIC API ==========
    window.AICoach = {
        init: function () {
            // Setup event listeners
            // REMOVED: ai-coach-show event listener to prevent duplicate calls

            // Listen to language change to update chat messages
            document.addEventListener('dictionary:language-changed', (event) => {
                // Simple solution: reinitialize chats if they are open
                // Check modal chat if visible (ai-coach-chat)
                const modalChat = document.getElementById('ai-coach-chat');
                if (modalChat && modalChat.children.length > 0) {
                    // Clear modal chat content
                    modalChat.innerHTML = '<div style="text-align: center; color: #64748b; font-size: 0.875rem; margin-top: 2rem;">' +
                        (typeof appState !== 'undefined' ? appState.translate('ai_coach_ready') : '✨ AI Prompt Helper is ready to help with AI generation!') +
                        '</div>';
                }
            });

            // Dispatch ready event
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('ai-coach-ready'));
            }, 100);
        },

        show: function () {
            // ✅ PURE MODAL MODE - no screen switching
            console.log('🧠 AICoach.show() called - opening modal');
            renderCoachInterface();
            analyzeUserLevel(); // Initial analysis
        },

        hide: function () {
            // Hide modal only
            hideCognitiveAssistant();
        },

        processMessage: sendMessage,

        getState: function () { return { ...state, history: state.history.slice(-5) }; }
    };

    // Initial user level analysis (placeholder)
    function analyzeUserLevel() {
        // Could integrate with appState.userName or other data
        state.userLevel = 'исследователь'; // Default for now
    }

    // Listen for app ready event - lazy initialize after main app components are loaded
    document.addEventListener('app:ready', () => {
        window.AICoach.init();
    });

    // 🚨 FORCED INIT: Initialize AICoach immediately for debugging
    // This ensures AICoach is available even if app:ready doesn't fire
    console.log('🚨 Force initializing AICoach for debugging');
    setTimeout(() => {
        if (window.AICoach && !window.AICoachInitialized) {
            console.log('✅ Forcing AICoach.init()');
            window.AICoach.init();
            window.AICoachInitialized = true;
        }
    }, 500); // Small delay to let everything load

    // Global functions for easy access
    window.showAICoach = () => window.AICoach.show();
    window.hideAICoach = () => window.AICoach.hide();

    // 🔥 DELAYED LOADING MECHANISM - REMOVED DUE TO DUPLICATION WITH ai-coach-integration.js
    // All tooltip logic now centralized in ai-coach-integration.js for one-time showing

    // AI Coach module loaded - lazy initialization ready
})();
