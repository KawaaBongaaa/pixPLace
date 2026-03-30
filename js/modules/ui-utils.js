/**
 * 🎨 Shared UI Utilities
 * Contains reusable UI components like modals, toasts, etc.
 * Designed for dynamic import to optimize performance.
 */

/**
 * Creates a DOM element with given tag and attributes
 * @param {string} tag 
 * @param {object} attributes 
 * @returns {HTMLElement}
 */
export function createElement(tag, attributes = {}) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'innerHTML') {
            element.innerHTML = value;
        } else if (key.startsWith('on') && typeof value === 'function') {
            element.addEventListener(key.substring(2).toLowerCase(), value);
        } else {
            element.setAttribute(key, value);
        }
    });
    return element;
}

/**
 * Shows a beautiful glassmorphism confirmation modal
 * @param {string} title - Modal title
 * @param {string} message - Modal message
 * @param {function} onConfirm - Callback when user clicks Delete/Confirm
 * @param {object} options - Optional settings { confirmText: 'Delete', cancelText: 'Cancel', confirmColor: 'red-500' }
 */
export function showConfirmationModal(title, message, onConfirm, options = {}) {
    const {
        confirmText = 'Delete',
        cancelText = 'Cancel',
        confirmColor = 'red-500',
        icon = '🗑️'
    } = options;

    // Create modal container
    const modal = createElement('div', {
        id: 'ai-confirmation-modal',
        className: 'fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm opacity-0 transition-opacity duration-300',
        onclick: (e) => {
            if (e.target === modal) closeModal();
        }
    });

    // Modal Content
    const content = createElement('div', {
        className: 'bg-white/10 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-2xl shadow-2xl max-w-sm w-full transform scale-95 transition-all duration-300 flex flex-col items-center text-center',
        innerHTML: `
            <div class="text-4xl mb-4 opacity-90">${icon}</div>
            <h3 class="text-xl font-bold text-white mb-3 tracking-wide">${title}</h3>
            <p class="text-gray-300 text-base mb-8 leading-relaxed">${message}</p>
        `
    });

    // Create Button Container
    const btnContainer = createElement('div', {
        className: 'flex flex-col sm:flex-row gap-3 w-full'
    });

    // Cancel Button
    const cancelBtn = createElement('button', {
        className: 'w-full sm:w-1/2 px-4 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all border border-white/5 hover:border-white/10 cursor-pointer',
        innerHTML: cancelText,
        onclick: closeModal
    });

    // Proceed Button
    const proceedBtn = createElement('button', {
        className: `w-full sm:w-1/2 px-4 py-3 rounded-xl text-sm font-bold bg-${confirmColor} hover:brightness-110 text-white shadow-lg shadow-${confirmColor}/20 transition-all flex items-center justify-center gap-2 cursor-pointer`,
        innerHTML: `<span>${confirmText}</span>`,
        onclick: () => {
            console.log('✅ Modal proceed clicked'); // Debug
            // Haptic feedback
            if (window.navigator?.vibrate) window.navigator.vibrate(50);

            try {
                onConfirm();
            } catch (e) {
                console.error('Error in confirmation callback:', e);
            }
            closeModal();
        }
    });

    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(proceedBtn);
    content.appendChild(btnContainer);

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Animation Enter
    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
    });

    function closeModal() {
        modal.classList.add('opacity-0');
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
        setTimeout(() => modal.remove(), 300);
    }

    // Event listeners are attached directly to buttons above
}

/**
 * Shows a glassmorphism modal when user has insufficient credits.
 * @param {object} options - { cost: number, balance: number, onTopUp?: function }
 */
/**
 * Показывает модальное окно для покупки кредитов
 * @param {object} options - { cost?: number, balance?: number, reason?: string, onTopUp?: function }
 * reason can be 'insufficient_funds' or 'limit_reached'
 */
export function showCreditPurchaseModal({ cost = 0, balance = 0, reason = 'insufficient_funds', onTopUp } = {}) {
    document.getElementById('ai-credits-modal')?.remove();

    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('warning');
    }

    let title = 'Not Enough Credits';
    let messageHtml = `This generation costs <span class="text-yellow-400 font-bold">${cost} credits</span>`;
    let subMessageHtml = `Your balance: <span class="font-semibold text-white">${balance} credits</span>`;
    let buttonText = '⭐ Top Up Credits';

    if (reason === 'limit_reached') {
        title = 'Credits Finished';
        messageHtml = `<span class="text-yellow-400 font-bold">Generation limit reached!</span>`;
        subMessageHtml = `<span class="text-gray-300">Tokens for generation have ended.</span>`;
        buttonText = '🚀 Get More Credits';
    }

    const modal = createElement('div', {
        id: 'ai-credits-modal',
        className: 'fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm opacity-0 transition-opacity duration-300',
        onclick: (e) => { if (e.target === modal) closeModal(); }
    });

    const content = createElement('div', {
        className: 'bg-white/10 backdrop-blur-xl border border-white/10 p-7 sm:p-10 rounded-3xl shadow-2xl max-w-sm w-full transform translate-y-4 transition-all duration-300 flex flex-col items-center text-center',
        innerHTML: `
            <div class="mb-4 text-5xl">${reason === 'limit_reached' ? '🪫' : '💎'}</div>
            <h3 class="text-xl font-bold text-white mb-2 tracking-wide">${title}</h3>
            <p class="text-gray-300 text-sm mb-1">${messageHtml}</p>
            <p class="text-gray-400 text-sm mb-7">${subMessageHtml}</p>
            <div class="w-full bg-white/5 rounded-2xl p-4 mb-7 border border-white/10">
                <p class="text-xs text-gray-400 leading-relaxed">Top up your credits or upgrade your plan on the <span class="text-blue-400">Pricing page</span> to continue.</p>
            </div>
        `
    });

    const btnContainer = createElement('div', { className: 'flex flex-col sm:flex-row gap-3 w-full' });

    const cancelBtn = createElement('button', {
        className: 'w-full px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all border border-white/5 cursor-pointer',
        innerHTML: 'Maybe later',
        onclick: closeModal
    });

    const topUpBtn = createElement('button', {
        className: 'w-full px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white shadow-lg shadow-violet-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer',
        innerHTML: buttonText,
        onclick: () => {
            if (window.navigator?.vibrate) window.navigator.vibrate(30);
            if (typeof onTopUp === 'function') {
                onTopUp();
            } else {
                window.location.href = 'pricing.html';
            }
            closeModal();
        }
    });

    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(topUpBtn);
    content.appendChild(btnContainer);
    modal.appendChild(content);
    document.body.appendChild(modal);

    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        content.classList.remove('translate-y-4');
        content.classList.add('translate-y-0');
    });

    function closeModal() {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.remove(), 300);
    }
}

/**
 * Shows an upgrade modal when user tries to use a Pro-only feature.
 * @param {object} options - { featureName?: string }
 */
export function showSubscriptionUpgradeModal({ featureName = 'this feature' } = {}) {
    document.getElementById('ai-upgrade-modal')?.remove();

    const modal = createElement('div', {
        id: 'ai-upgrade-modal',
        className: 'fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm opacity-0 transition-opacity duration-300',
        onclick: (e) => { if (e.target === modal) closeModal(); }
    });

    const content = createElement('div', {
        className: 'bg-white/10 backdrop-blur-xl border border-white/10 p-7 sm:p-10 rounded-3xl shadow-2xl max-w-sm w-full transform translate-y-4 transition-all duration-300 flex flex-col items-center text-center',
        innerHTML: `
            <div class="mb-4 text-5xl">🚀</div>
            <h3 class="text-xl font-bold text-white mb-2 tracking-wide">Pro Feature</h3>
            <p class="text-gray-300 text-sm mb-7"><span class="text-violet-400 font-semibold">${featureName}</span> is available on the Pro plan. Upgrade to unlock all Pro models, priority queue, and no watermarks.</p>
        `
    });

    const btnContainer = createElement('div', { className: 'flex flex-col sm:flex-row gap-3 w-full' });

    const cancelBtn = createElement('button', {
        className: 'w-full px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all border border-white/5 cursor-pointer',
        innerHTML: 'Maybe later',
        onclick: closeModal
    });

    const upgradeBtn = createElement('button', {
        className: 'w-full px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-white shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer',
        innerHTML: '✨ View Plans',
        onclick: () => {
            if (window.navigator?.vibrate) window.navigator.vibrate(30);
            window.location.href = 'pricing.html';
            closeModal();
        }
    });

    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(upgradeBtn);
    content.appendChild(btnContainer);
    modal.appendChild(content);
    document.body.appendChild(modal);

    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        content.classList.remove('translate-y-4');
        content.classList.add('translate-y-0');
    });

    function closeModal() {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.remove(), 300);
    }
}

/**
 * Shows a portal (iframe) to the pricing page within a modal.
 * @param {object} options - { initialTab?: 'plans' | 'credits' }
 */
export function showPricingModal({ initialTab = 'plans' } = {}) {
    const modalId = 'pricing-portal-modal';
    document.getElementById(modalId)?.remove();

    // Construct URL with mode=modal for conditional styling
    const url = `pricing.html?mode=modal${initialTab === 'credits' ? '#credits' : ''}`;

    const modal = createElement('div', {
        id: modalId,
        className: 'fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md opacity-0 transition-opacity duration-500',
        style: 'z-index: 10000000 !important;', // 10 million - above everything
        onclick: (e) => { if (e.target === modal) closeModal(); }
    });

    const container = createElement('div', {
        className: 'relative w-full h-full max-w-7xl max-h-[92vh] sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl transform scale-95 transition-all duration-500 bg-[#09090b] sm:mx-4',
    });

    // Premium Floating Close Button
    const closeBtn = createElement('button', {
        className: 'absolute top-5 right-5 p-2 bg-black/50 hover:bg-white/10 text-white rounded-full backdrop-blur-md border border-white/10 transition-all cursor-pointer shadow-xl hover:scale-110 active:scale-90',
        style: 'z-index: 10000001 !important;',
        innerHTML: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>',
        onclick: closeModal
    });

    const iframe = createElement('iframe', {
        src: url,
        className: 'w-full h-full border-0',
        onload: () => {
            iframe.style.opacity = '1';
        }
    });
    iframe.style.opacity = '0';
    iframe.style.transition = 'opacity 0.25s ease';

    container.appendChild(closeBtn);
    container.appendChild(iframe);
    modal.appendChild(container);
    document.body.appendChild(modal);

    // Entrance Animation
    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        container.classList.remove('scale-95');
        container.classList.add('scale-100');
    });

    function closeModal() {
        modal.classList.add('opacity-0');
        container.classList.remove('scale-100');
        container.classList.add('scale-95');
        setTimeout(() => modal.remove(), 500);
    }

    // Accessibility: Escape key support (from parent window)
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);

    // Listen for messages from iframe (e.g. to close modal via Esc within iframe)
    const handleMessage = (e) => {
        if (e.data === 'close-pricing-modal') {
            closeModal();
            window.removeEventListener('message', handleMessage);
            document.removeEventListener('keydown', handleEsc);
        } else if (e.data === 'hide-close-btn') {
            closeBtn.style.display = 'none';
        } else if (e.data === 'show-close-btn') {
            closeBtn.style.display = 'block';
        }
    };
    window.addEventListener('message', handleMessage);
}

