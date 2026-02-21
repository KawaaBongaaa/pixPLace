/**
 * ai-prompt-helper.js — Ai Assistant pixPlace
 * Isolated module for pixPLace AI Prompt Helper
 * @version 1.0.0
 * @author pixPlace Team
 * @license MIT
 */

// ========== AI COACH INTEGRATION ==========
// Simplified: External CSS/HTML loading removed in favor of Tailwind and JS generation.

// 🔥 STYLES REMOVED: Using pure Tailwind classes as requested
// The previous injectCoachStyles() function has been removed.

import { showConfirmationModal } from './js/modules/ui-utils.js';


export function createCoachButton() {
    console.log('⚠️ Legacy createCoachButton called - ignored in favor of new GPT Chat button');
    return;
}



/**
 * Create tooltip for AI Coach suggestion after first generation
 */
export function createCoachTooltip() {
    // Tooltip disabled for simplified chat experience
    console.log('💬 AI Coach tooltip disabled (simple chat mode)');
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

        // Disabled creating the legacy ugly button
        // createCoachButton(); 

        // window.addEventListener('ai-coach-ready', createCoachButton);
    } catch (error) {
        console.error('Failed to init AI Coach:', error);
    }
}

export function createChatButton() {
    // Инжектим надежную CSS-анимацию "из ниоткуда"
    if (!document.getElementById('ai-chat-btn-anim')) {
        const style = document.createElement('style');
        style.id = 'ai-chat-btn-anim';
        style.innerText = `
            @keyframes bubbleSpinGrow {
                0% { transform: scale(0) rotate(-180deg) translateY(20px); opacity: 0; max-width: 38px; padding: 0; border-radius: 50%; }
                50% { transform: scale(1.1) rotate(10deg) translateY(-5px); opacity: 1; max-width: 38px; padding: 0; border-radius: 50%; }
                70% { transform: scale(0.95) rotate(-5deg) translateY(0); max-width: 45px; padding: 0 8px; border-radius: 20px 20px 20px 20px; }
                /* Делаем финальную форму нестандартной (как облачко чата) и очень компактной */
                100% { transform: scale(1) rotate(0deg) translateY(0); opacity: 1; max-width: 105px; padding: 0.4rem 0.75rem; border-radius: 20px 20px 4px 20px; }
            }
            @keyframes textFadeIn {
                0%, 65% { opacity: 0; max-width: 0; padding-left: 0; transform: scale(0.5); }
                100% { opacity: 1; max-width: 80px; padding-left: 0.35rem; transform: scale(1); }
            }
            @keyframes iconWaggle {
                from { transform: translateY(0) rotate(0deg); }
                to { transform: translateY(-2px) rotate(8deg); }
            }
            .ai-chat-btn-entrance {
                animation: bubbleSpinGrow 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                opacity: 0; 
                overflow: hidden;
                /* Задаем базовую высоту шарика, чтобы он не прыгал по вертикали слишком сильно */
                height: 38px; 
            }
            .ai-chat-btn-entrance .ai-text {
                animation: textFadeIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                white-space: nowrap;
                display: inline-block;
                opacity: 0;
            }
            .ai-chat-btn-entrance:hover .ai-icon {
                animation: iconWaggle 1s ease-in-out infinite alternate;
            }
        `;
        document.head.appendChild(style);
    }

    // Создаем кнопку с применением кастомного класса-аниматора и базовых Tailwind стилей
    const chatBtn = document.createElement('button');
    chatBtn.id = 'ai-chat-float-btn';

    // Иконка и текст чуть меньше
    chatBtn.innerHTML = `
        <span class="ai-icon text-base leading-none flex-shrink-0 transition-transform">✨</span>
        <span class="ai-text font-semibold text-xs tracking-wide opacity-90">GPT Chat</span>
    `;

    chatBtn.classList.add(
        'group',
        'fixed', 'bottom-5', 'right-5', 'z-10',
        // Делаем цвета чуть более приглушенными/полупрозрачными, чтобы не кричать на фоне главной кнопки
        'bg-gray-800/90', 'backdrop-blur-sm',
        'border', 'border-indigo-500/30',
        'text-indigo-100',
        'cursor-pointer', 'shadow-lg', 'shadow-indigo-500/20',
        'flex', 'items-center', 'justify-center',
        // Hover
        'hover:-translate-y-1', 'hover:shadow-xl', 'hover:shadow-indigo-500/40', 'hover:bg-gray-800', 'hover:border-indigo-500/50',
        // Класс с @keyframes
        'ai-chat-btn-entrance'
    );

    document.body.appendChild(chatBtn);

    chatBtn.onclick = () => {
        // 0. Load CSS Dynamically if not present (Fix for AI Chat button)
        if (!document.getElementById('gpt-chat-styles')) {
            console.log('🎨 Loading AI Coach CSS dynamically...');
            const link = document.createElement('link');
            link.id = 'gpt-chat-styles';
            link.rel = 'stylesheet';
            link.href = 'css/gpt-chat.css';
            document.head.appendChild(link);
        }

        // ✅ ENABLED: Show AI Coach modal
        if (window.AICoach) {
            window.AICoach.show();
            // Trigger haptic if available
            if (typeof triggerHaptic === 'function') triggerHaptic('light');
        } else {
            console.warn('⚠️ AICoach not loaded yet');
            // Try to load it if missing (fallback)
            if (typeof createCoachButton === 'function') createCoachButton();
        }
    };

    document.body.appendChild(chatBtn);
    console.log('🧠 AI Chat floating button created');
}

(function () {
    'use strict';

    // ========== PRIVATE STATE ==========
    // ========== PRIVATE STATE ==========
    let state = {
        // Use a persistent ID for the main chat session, or load last active one
        conversationId: localStorage.getItem('aiCoachCurrentSession') || 'default_ai_coach_session',
        history: [],
        modal: null,
        isOpen: false,
        isProcessing: false,
        chatUI: null,
        MAX_VISIBLE_MESSAGES: 50,
        messagesLoadedThroughDOM: false
    };

    // ========== LOCAL STORAGE FUNCTIONS ==========
    function cleanupOldHistory(savedData) {
        if (!savedData) return {};

        const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        let hasChanges = false;

        // Structure: { [sessionId]: { timestamp: number, messages: [] } }
        // Or simple structure: { [sessionId]: [] } - we need timestamp for cleanup

        // Migration: If we find old array-only format, wrap it or clear it
        // For simplicity in this simple chat: We will just check the last message timestamp if available,
        // or add a 'lastUpdated' field to the storage object.

        // Let's use a simpler approach for this specific request:
        // We only care about the current session 'default_ai_coach_session'

        if (savedData[state.conversationId]) {
            const session = savedData[state.conversationId];
            // Check if it has a timestamp property (new format)
            if (session.lastUpdated) {
                if (now - session.lastUpdated > ONE_WEEK_MS) {
                    console.log('🧹 Clearing old AI chat history (1 week retention)');
                    delete savedData[state.conversationId];
                    hasChanges = true;
                }
            } else {
                // Legacy format (array only) - keep it for now, will be updated on next save
            }
        }

        return hasChanges ? savedData : null;
    }

    function loadChatHistory() {
        try {
            let saved = JSON.parse(localStorage.getItem('aiCoachHistory') || '{}');

            // Clean up old history
            const cleaned = cleanupOldHistory(saved);
            if (cleaned) {
                saved = cleaned;
                localStorage.setItem('aiCoachHistory', JSON.stringify(saved));
            }

            if (saved[state.conversationId]) {
                // Support both old array format and new object format
                const sessionData = saved[state.conversationId];
                state.history = Array.isArray(sessionData) ? sessionData : (sessionData.messages || []);

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

            // Save with timestamp for retention policy
            saved[state.conversationId] = {
                lastUpdated: Date.now(),
                messages: state.history
            };

            localStorage.setItem('aiCoachHistory', JSON.stringify(saved));

            // Update sidebar real-time
            renderHistorySidebar();
        } catch (error) {
            console.warn('Failed to save chat history:', error);
        }
    }

    async function sendToWebhook(message, fullHistory) {
        // Проверяем доступность CONFIG
        const webhookUrl = (typeof window.CONFIG !== 'undefined' && window.CONFIG.CHAT_WEBHOOK_URL)
            ? window.CONFIG.CHAT_WEBHOOK_URL
            : 'https://hook.us2.make.com/your-chat-webhook-url';

        console.log('📤 Sending message:', message);

        // Extended context: Last 20 messages
        const trimmedHistory = fullHistory.slice(-20);

        const payload = {
            message: message,
            history: trimmedHistory, // Includes {role: 'user'|'assistant', content: string}
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`Webhook error: ${response.status}`);

            let responseText = await response.text();

            // Cleanup markdown json if present
            if (responseText.includes('```json')) {
                responseText = responseText.replace(/```json\n?/g, '').replace(/\n?```$/g, '');
            }

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                // If not JSON, treat as plain text
                return responseText;
            }

            return data.response || data.message || 'Error: No response field in JSON';
        } catch (error) {
            console.error('💥 Webhook request failed:', error);
            return 'Sorry, I am having trouble connecting right now.';
        }
    }

    // ========== UTILITY FUNCTIONS ==========
    function createElement(tag, props = {}, children = []) {
        const el = document.createElement(tag);
        Object.assign(el, props);
        if (!Array.isArray(children)) children = [children];
        children.forEach(child => {
            if (typeof child === 'string') el.appendChild(document.createTextNode(child));
            else if (child) el.appendChild(child);
        });
        return el;
    }

    function scrollChatToBottom(chatContainer) {
        if (!chatContainer) return;
        requestAnimationFrame(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        });
    }

    function createTypingIndicator() {
        const bubble = createElement('div', {
            className: 'ai-typing-bubble'
        });

        const dotsContainer = createElement('div', { className: 'ai-typing-dots' });

        [1, 2, 3].forEach(i => {
            const dot = createElement('div', { className: 'ai-typing-dot' });
            dotsContainer.appendChild(dot);
        });

        bubble.appendChild(dotsContainer);
        return bubble;
    }

    function startNewChat() {
        // Generate new session ID
        state.conversationId = 'session_' + Date.now();
        state.history = [];
        state.messagesLoadedThroughDOM = false; // Allow clearing
        localStorage.setItem('aiCoachCurrentSession', state.conversationId); // Save current session ID

        // Clear UI
        const chatContainer = document.getElementById('ai-coach-chat');
        if (chatContainer) chatContainer.innerHTML = '';

        // Add welcome message
        addMessageToChat(
            typeof appState !== 'undefined' ? appState.translate('ai_coach_welcome', '👋 Hi! I can help you improve your prompts. Just type your idea below!') : '👋 Hi! I can help you improve your prompts. Just type your idea below!',
            'bot'
        );

        console.log('✨ Started new chat session:', state.conversationId);
    }

    function addMessageToChat(text, sender) {
        const chatContainer = document.getElementById('ai-coach-chat');
        if (!chatContainer) return;

        const isUser = sender === 'user';
        const wrapper = createElement('div', {
            className: `ai-msg-wrapper ${isUser ? 'user' : 'bot'}`
        });

        // Avatar for Bot (Optional - can be added via CSS or here)
        // Kept simple for now as requested by user in CSS ("message-avatar display: none")

        const bubble = createElement('div', {
            className: 'ai-msg-bubble'
        });

        // Format text with basic markdown support
        let formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`(.*?)`/g, '<code style="background: rgba(0,0,0,0.2); padding: 2px 4px; border-radius: 4px; font-family: monospace;">$1</code>')
            .replace(/\n/g, '<br>');

        bubble.innerHTML = formattedText;

        // Timestamp
        const time = createElement('div', {
            className: 'ai-msg-timestamp',
            innerText: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        bubble.appendChild(time);

        wrapper.appendChild(bubble);
        chatContainer.appendChild(wrapper);
        scrollChatToBottom(chatContainer);
    }

    // ========== UI FUNCTIONS ==========
    function createModal() {
        if (state.modal) return state.modal;

        // Overlay
        const overlay = createElement('div', {
            id: 'ai-coach-overlay',
            onclick: (e) => {
                if (e.target === e.currentTarget) hideCognitiveAssistant();
            }
        });

        // Main modal container - Styles handled by #ai-coach-modal in css/ai-coach.css
        const modal = createElement('div', {
            id: 'ai-coach-modal'
        });

        // ============ MOBILE DRAWER OVERLAY ============
        const sidebarOverlay = createElement('div', {
            id: 'ai-coach-sidebar-overlay',
            className: 'ai-coach-sidebar-overlay',
            onclick: toggleHistorySidebar
        });
        modal.appendChild(sidebarOverlay);

        // ============ SIDEBAR ============
        const sidebar = createElement('div', {
            id: 'ai-coach-history-sidebar',
            className: 'ai-coach-sidebar'
        });

        // Sidebar Header
        const sidebarHeader = createElement('div', {
            className: 'ai-coach-sidebar-header',
            innerHTML: '<h3 class="ai-coach-sidebar-title">Chat History</h3>'
        });

        // New Chat Button
        const newChatSidebarBtn = createElement('button', {
            className: 'ai-coach-new-chat-btn',
            onclick: () => startNewChat(),
            // Simple Plus Icon
            innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> New Chat'
        });

        // Sidebar List
        const historyList = createElement('div', {
            id: 'ai-coach-history-list',
            className: 'ai-coach-history-list custom-scrollbar'
        });

        sidebar.appendChild(sidebarHeader);
        sidebar.appendChild(newChatSidebarBtn);
        sidebar.appendChild(historyList);
        modal.appendChild(sidebar);

        // ============ MAIN CHAT AREA ============
        const mainContent = createElement('div', {
            id: 'ai-coach-main-content',
            className: 'ai-coach-main'
        });

        // Header
        const header = createElement('div', {
            className: 'ai-coach-header'
        });

        const leftControls = createElement('div', { className: 'flex items-center gap-3' });

        // MOBILE MENU TOGGLE
        const menuBtn = createElement('button', {
            className: 'md:hidden p-1.5 -ml-2 text-gray-500 hover:text-white transition-colors rounded-lg',
            onclick: toggleHistorySidebar,
            innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>'
        });
        leftControls.appendChild(menuBtn);

        const titleText = createElement('h3', { className: 'ai-coach-sidebar-title', style: 'font-size: 1.1rem;' }, 'pixPlace AI');
        leftControls.appendChild(titleText);

        const rightControls = createElement('div', { className: 'flex items-center gap-1' });
        const closeBtn = createElement('button', {
            className: 'ai-coach-close-btn',
            onclick: hideCognitiveAssistant,
            innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>'
        });
        rightControls.appendChild(closeBtn);
        header.appendChild(leftControls);
        header.appendChild(rightControls);

        // Chat Container
        const chatContainer = createElement('div', {
            id: 'ai-coach-chat',
            className: 'ai-coach-chat-container custom-scrollbar'
        });

        // Input Area
        const inputArea = createElement('div', { className: 'ai-coach-input-area' });
        const inputWrapper = createElement('div', { className: 'ai-input-wrapper' });

        const input = createElement('input', {
            id: 'ai-coach-input',
            type: 'text',
            placeholder: 'Type your message...',
            className: 'ai-coach-input',
            onkeypress: (e) => { if (e.key === 'Enter') sendMessage(); }
        });

        const sendBtn = createElement('button', {
            className: 'ai-send-btn',
            onclick: sendMessage,
            innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 24px; height: 24px;"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>`
        });

        inputWrapper.appendChild(input);
        inputWrapper.appendChild(sendBtn);
        inputArea.appendChild(inputWrapper);

        mainContent.appendChild(header);
        mainContent.appendChild(chatContainer);
        mainContent.appendChild(inputArea);

        modal.appendChild(mainContent);
        overlay.appendChild(modal);

        document.body.appendChild(overlay);
        state.modal = overlay;

        // Trigger visibility for CSS transition
        requestAnimationFrame(() => {
            overlay.classList.add('visible');
            modal.classList.add('visible');
        });

        return overlay;
    }

    function renderCoachInterface() {
        if (!state.modal) createModal();

        if (!state.messagesLoadedThroughDOM) {
            loadChatHistory();
            state.messagesLoadedThroughDOM = true;
        }

        // Show welcome if history is empty
        const chatContainer = document.getElementById('ai-coach-chat');
        if (state.history.length === 0 && chatContainer && chatContainer.children.length === 0) {
            // FIX: Robust translation check
            const welcomeText = (typeof appState !== 'undefined' && typeof appState.translate === 'function')
                ? appState.translate('ai_coach_welcome', '👋 Hi! I can help you improve your prompts. Just type your idea below!')
                : '👋 Hi! I can help you improve your prompts. Just type your idea below!';

            addMessageToChat(welcomeText, 'bot');
        }

        // 🔥 FIX: Populate sidebar history
        renderHistorySidebar();

        state.isOpen = true;
        const modal = state.modal; // This is the overlay

        // Ensure it's in DOM
        if (!document.body.contains(modal)) {
            document.body.appendChild(modal);
        }

        document.body.style.overflow = 'hidden';
        modal.classList.remove('invisible', 'opacity-0');
        modal.classList.add('opacity-100', 'visible');

        // Show inner modal explicitly
        const innerModal = document.getElementById('ai-coach-modal');
        if (innerModal) {
            innerModal.classList.remove('invisible', 'opacity-0');
            innerModal.classList.add('opacity-100', 'visible');
        }
    }

    async function sendMessage() {
        const input = document.getElementById('ai-coach-input');
        if (!input || !input.value.trim() || state.isProcessing) return;

        const message = input.value.trim();
        addMessageToChat(message, 'user');

        state.history.push({ role: 'user', content: message });
        saveChatHistory();

        state.isProcessing = true;
        input.value = '';
        input.disabled = true;

        // Typing indicator
        const typingIndicator = createTypingIndicator();
        document.getElementById('ai-coach-chat')?.appendChild(typingIndicator);
        scrollChatToBottom(document.getElementById('ai-coach-chat'));

        try {
            const aiResponse = await sendToWebhook(message, state.history);

            // Remove typing indicator
            typingIndicator.remove();

            // Check specifically for "Accepted" which usually means webhook is not returning data
            if (aiResponse === 'Accepted') {
                const warningMsg = "⚠️ Webhook returned 'Accepted'. Ensure your Make.com scenario has a 'Webhook Response' module.";
                console.warn(warningMsg);
                addMessageToChat(warningMsg, 'bot');
            } else {
                addMessageToChat(aiResponse, 'bot');
                state.history.push({ role: 'assistant', content: aiResponse });
                saveChatHistory();
            }

        } catch (error) {
            console.error(error);
            typingIndicator.remove();
            addMessageToChat('Error connecting to AI.', 'bot');
        } finally {
            state.isProcessing = false;
            input.disabled = false;
            input.focus();
        }
    }

    function loadSession(sessionId) {
        state.conversationId = sessionId;
        state.messagesLoadedThroughDOM = false;
        localStorage.setItem('aiCoachCurrentSession', sessionId);

        // Hide sidebar automatically when selecting a chat
        // FIX: REMOVED toggleHistorySidebar() call. Sidebar stays OPEN always.
        // toggleHistorySidebar(); 

        // Clear current chat
        const chatContainer = document.getElementById('ai-coach-chat');
        if (chatContainer) chatContainer.innerHTML = '';

        // Load new history
        loadChatHistory();
        renderHistorySidebar(); // Highlight active session
        console.log('📂 Loaded session:', sessionId);
    }

    // ========== CONFIRMATION MODAL ==========
    // ========== CONFIRMATION MODAL ==========
    // Helper removed - using imported showConfirmationModal directly


    function deleteSession(sessionId, event) {
        event.stopPropagation();
        showConfirmationModal(
            'Delete Chat?',
            'Are you sure you want to delete this chat history? This action cannot be undone.',
            () => {
                let saved = JSON.parse(localStorage.getItem('aiCoachHistory') || '{}');
                delete saved[sessionId];
                localStorage.setItem('aiCoachHistory', JSON.stringify(saved));
                renderHistorySidebar();
                if (state.conversationId === sessionId) startNewChat();
            }
        );
    }

    // ========== HISTORY MANAGEMENT ==========
    function toggleSelectionMode() {
        state.isSelectionMode = !state.isSelectionMode;
        state.selectedSessions = new Set(); // Reset selection
        renderHistorySidebar();
    }

    function toggleSessionSelection(sessionId) {
        if (state.selectedSessions.has(sessionId)) {
            state.selectedSessions.delete(sessionId);
        } else {
            state.selectedSessions.add(sessionId);
        }
        renderHistorySidebar(); // Re-render to update UI state
    }

    function deleteSelectedSessions() {
        if (state.selectedSessions.size === 0) return;
        showConfirmationModal(
            `Delete ${state.selectedSessions.size} Chats?`,
            'Are you sure you want to delete the selected chats? This action cannot be undone.',
            () => {
                const saved = JSON.parse(localStorage.getItem('aiCoachHistory') || '{}');
                state.selectedSessions.forEach(id => delete saved[id]);
                localStorage.setItem('aiCoachHistory', JSON.stringify(saved));
                if (state.selectedSessions.has(state.conversationId)) startNewChat();
                toggleSelectionMode();
                renderHistorySidebar();
            }
        );
    }

    function clearAllHistory() {
        showConfirmationModal(
            'Clear All History?',
            'Are you sure you want to delete ALL chat history? This action cannot be undone.',
            () => {
                localStorage.removeItem('aiCoachHistory');
                startNewChat();
                renderHistorySidebar();
                // Close drawer on mobile if open
                const sidebar = document.getElementById('ai-coach-history-sidebar');
                const overlay = document.getElementById('ai-coach-sidebar-overlay');
                if (sidebar) sidebar.classList.remove('open');
                if (overlay) overlay.classList.remove('visible');
            }
        );
    }

    function toggleHistorySidebar() {
        const sidebar = document.getElementById('ai-coach-history-sidebar');
        const overlay = document.getElementById('ai-coach-sidebar-overlay');

        if (sidebar) {
            sidebar.classList.toggle('open');
            if (overlay) {
                overlay.classList.toggle('visible');
            }
        }
    }
    // Expose to window for inline onclick handlers
    window.toggleHistorySidebar = toggleHistorySidebar;

    function renderHistorySidebar() {
        const sidebarList = document.getElementById('ai-coach-history-list');
        const sidebarHeader = document.querySelector('.ai-coach-sidebar-header');
        if (!sidebarList) return;

        // --- RENDER HEADER ACTIONS (Edit / Done) ---
        if (sidebarHeader) {
            // Keep title, update actions
            let actionsContainer = sidebarHeader.querySelector('.ai-history-actions');
            if (!actionsContainer) {
                actionsContainer = createElement('div', { className: 'ai-history-actions flex gap-2' });
                sidebarHeader.appendChild(actionsContainer);
            }

            actionsContainer.innerHTML = ''; // Clear current buttons

            if (state.isSelectionMode) {
                // "Delete (N)" Button with Label
                if (state.selectedSessions.size > 0) {
                    const deleteBtn = createElement('button', {
                        className: 'flex items-center gap-1 text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-colors',
                        onclick: deleteSelectedSessions,
                        innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        Delete (${state.selectedSessions.size})`
                    });
                    actionsContainer.appendChild(deleteBtn);
                }

                // "Clear All" Button (Only in Edit Mode)
                const clearAllBtn = createElement('button', {
                    className: 'flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1',
                    onclick: clearAllHistory,
                    innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    Clear All`
                });
                actionsContainer.appendChild(clearAllBtn);

                // "Done" Button
                const doneBtn = createElement('button', {
                    className: 'text-xs text-indigo-400 hover:text-white transition-colors font-medium px-2',
                    innerText: 'Done',
                    onclick: toggleSelectionMode
                });
                actionsContainer.appendChild(doneBtn);
            } else {
                // "Edit" Button
                const editBtn = createElement('button', {
                    className: 'flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors',
                    onclick: toggleSelectionMode,
                    innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                    Edit`
                });
                actionsContainer.appendChild(editBtn);
            }
        }

        sidebarList.innerHTML = '';
        const saved = JSON.parse(localStorage.getItem('aiCoachHistory') || '{}');

        // Sort by lastUpdated desc
        const sessions = Object.entries(saved)
            .map(([id, data]) => ({
                id,
                ...data,
                lastUpdated: data.lastUpdated || 0,
                preview: Array.isArray(data) ? (data[0]?.content || 'New Chat') : (data.messages?.[0]?.content || 'New Chat')
            }))
            .sort((a, b) => b.lastUpdated - a.lastUpdated);

        if (sessions.length === 0) {
            sidebarList.innerHTML = `
                <div class="flex flex-col items-center justify-center py-8 text-gray-500 opacity-60">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 mb-2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.69 9-8.25s-4.03-8.25-9-8.25S3 7.44 3 12c0 1.05.28 2.09.83 3.04L3 20.25l5.21-.83c.96.55 1.99.83 3.04.83z" /></svg>
                    <span class="text-xs">No history yet</span>
                </div>
            `;
            return;
        }

        sessions.forEach(session => {
            const isActive = state.conversationId === session.id;
            const isSelected = state.selectedSessions && state.selectedSessions.has(session.id);

            const item = createElement('div', {
                className: `group relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border w-full shrink-0 ${state.isSelectionMode
                    ? (isSelected ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'bg-transparent border-transparent hover:bg-white/5 text-gray-400')
                    : (isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 border-indigo-500/50' : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border-transparent hover:border-white/10')
                    }`,
                onclick: () => {
                    if (state.isSelectionMode) {
                        toggleSessionSelection(session.id);
                    } else {
                        loadSession(session.id);
                    }
                }
            });

            // CHECKBOX (Selection Mode Only)
            if (state.isSelectionMode) {
                const checkbox = createElement('div', {
                    className: `w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-gray-500 bg-transparent'
                        }`,
                    innerHTML: isSelected ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3 text-white"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>' : ''
                });
                item.appendChild(checkbox);
            }

            // Text Content - FIX: whitespace-nowrap to prevent ugly wrapping
            const content = createElement('div', { className: 'flex-1 min-w-0 pr-3 flex flex-col gap-0.5' });

            const title = createElement('div', {
                className: `text-sm font-medium truncate ${isActive && !state.isSelectionMode ? 'text-white' : 'text-gray-200'}`,
                innerText: session.preview.length > 25 ? session.preview.substring(0, 25) + '...' : session.preview
            });

            const date = createElement('div', {
                className: `text-[10px] ${isActive && !state.isSelectionMode ? 'text-indigo-200' : 'text-gray-500'}`,
                innerText: new Date(session.lastUpdated).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            });

            content.appendChild(title);
            content.appendChild(date);
            item.appendChild(content);

            // Active Indicator (Only if NOT in selection mode)
            if (isActive && !state.isSelectionMode) {
                const indicator = createElement('div', {
                    className: 'absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-r-sm'
                });
                item.appendChild(indicator);
            }

            sidebarList.appendChild(item);
        });
    }

    function hideCognitiveAssistant() {
        if (state.modal) {
            // Hide overlay
            state.modal.classList.remove('visible', 'opacity-100');
            state.modal.classList.add('invisible', 'opacity-0');

            // Hide inner modal too (to ensure state reset)
            const innerModal = document.getElementById('ai-coach-modal');
            if (innerModal) {
                innerModal.classList.remove('visible', 'opacity-100');
                innerModal.classList.add('invisible', 'opacity-0');
            }

            state.isOpen = false;
            document.body.style.overflow = '';
            console.log('🙈 AI Coach hidden');
        }
    }

    window.AICoach = {
        init: function () {
            // Listen to language change to update chat messages
            document.addEventListener('dictionary:language-changed', (event) => {
                const modalChat = document.getElementById('ai-coach-chat');
                if (modalChat && modalChat.children.length > 0) {
                    modalChat.innerHTML = '<div style="text-align: center; color: #64748b; font-size: 0.875rem; margin-top: 2rem;">' +
                        (typeof appState !== 'undefined' ? appState.translate('ai_coach_ready') : '✨ GPT Chat is ready to help with AI generation!') +
                        '</div>';
                }
            });

            // Dispatch ready event
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('ai-coach-ready'));
            }, 100);
        },

        show: function () {
            console.log('🧠 AICoach.show() called - opening modal');
            // Ensure CSS is loaded even if called programmatically
            if (!document.getElementById('gpt-chat-styles')) {
                console.log('🎨 Loading AI Coach CSS dynamically (Fallback in init)...');
                const link = document.createElement('link');
                link.id = 'gpt-chat-styles';
                link.rel = 'stylesheet';
                link.href = 'css/gpt-chat.css';
                // Use a promise or timeout to ensure styles apply? 
                // For now, appending it immediately. Browser usually handles this fast enough, 
                // but if modal relies on display:none from CSS, FOUC might happen slightly 
                // or it might not animate in correct starting state.
                document.head.appendChild(link);
            }
            renderCoachInterface();
        },

        hide: function () {
            hideCognitiveAssistant();
        },

        processMessage: sendMessage,

        getState: function () { return { ...state, history: state.history.slice(-5) }; }
    };

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
