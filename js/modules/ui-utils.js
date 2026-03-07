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
export function showCreditPurchaseModal({ cost = 0, balance = 0, onTopUp } = {}) {
    document.getElementById('ai-credits-modal')?.remove();

    const modal = createElement('div', {
        id: 'ai-credits-modal',
        className: 'fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm opacity-0 transition-opacity duration-300',
        onclick: (e) => { if (e.target === modal) closeModal(); }
    });

    const content = createElement('div', {
        className: 'bg-white/10 backdrop-blur-xl border border-white/10 p-7 sm:p-10 rounded-3xl shadow-2xl max-w-sm w-full transform translate-y-4 transition-all duration-300 flex flex-col items-center text-center',
        innerHTML: `
            <div class="mb-4 text-5xl">💎</div>
            <h3 class="text-xl font-bold text-white mb-2 tracking-wide">Not Enough Credits</h3>
            <p class="text-gray-300 text-sm mb-1">This generation costs <span class="text-yellow-400 font-bold">${cost} credits</span></p>
            <p class="text-gray-400 text-sm mb-7">Your balance: <span class="font-semibold text-white">${balance} credits</span></p>
            <div class="w-full bg-white/5 rounded-2xl p-4 mb-7 border border-white/10">
                <p class="text-xs text-gray-400 leading-relaxed">Top up your credits via <span class="text-blue-400">⭐ Telegram Stars</span> in your account.</p>
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
        innerHTML: '⭐ Top Up Credits',
        onclick: () => {
            if (window.navigator?.vibrate) window.navigator.vibrate(30);
            if (typeof onTopUp === 'function') {
                onTopUp();
            } else {
                const accountBtn = document.querySelector('[data-tab="account"]') || document.getElementById('accountBtn');
                if (accountBtn) accountBtn.click();
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
            const accountBtn = document.querySelector('[data-tab="account"]') || document.getElementById('accountBtn');
            if (accountBtn) accountBtn.click();
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
