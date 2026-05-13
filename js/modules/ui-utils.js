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
            closeModal();
            showPricingModal({ initialTab: 'plans' });
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

// ── Pricing Modal (singleton, pre-warm pattern) ─────────────────────────────
let _pricingModal = null;
let _pricingIframe = null;
let _pricingCloseBtn = null;
let _pricingContainer = null;

/**
 * Pre-warms the Pricing Modal by creating and hiding the iframe in the background.
 * Call this once early (e.g. after app init) so the modal opens instantly.
 */
export function prewarmPricingModal() {
    if (_pricingModal) return; // already created
    console.log('💎 Pre-warming Pricing Modal iframe...');

    _pricingModal = createElement('div', {
        id: 'pricing-portal-modal',
        className: 'fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md opacity-0 transition-opacity duration-500 pointer-events-none',
        style: 'z-index: 10000000 !important; display: none;',
        onclick: (e) => { if (e.target === _pricingModal) closePricingModal(); }
    });

    _pricingContainer = createElement('div', {
        className: 'relative w-full h-full max-w-7xl max-h-[92vh] sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl transform translate-y-full sm:translate-y-24 transition-all duration-500 ease-out bg-[#09090b] sm:mx-4',
    });

    _pricingCloseBtn = createElement('button', {
        className: 'absolute top-5 right-5 p-2 bg-black/50 hover:bg-white/10 text-white rounded-full backdrop-blur-md border border-white/10 transition-all cursor-pointer shadow-xl hover:scale-110 active:scale-90',
        style: 'z-index: 10000001 !important;',
        innerHTML: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>',
        onclick: closePricingModal
    });

    _pricingIframe = createElement('iframe', {
        src: 'pricing.html?mode=modal',
        className: 'w-full h-full border-0',
        loading: 'lazy',
        onload: () => {
            _pricingIframe.style.opacity = '1';
            console.log('✅ Pricing iframe loaded and ready');
        }
    });
    _pricingIframe.style.opacity = '0';
    _pricingIframe.style.transition = 'opacity 0.3s ease';

    _pricingContainer.appendChild(_pricingCloseBtn);
    _pricingContainer.appendChild(_pricingIframe);
    _pricingModal.appendChild(_pricingContainer);
    document.body.appendChild(_pricingModal);

    // Global message listener for iframe communication
    window.addEventListener('message', (e) => {
        if (!_pricingModal) return;
        if (e.data === 'close-pricing-modal') {
            closePricingModal();
        } else if (e.data?.type === 'open-pricing-plans') {
            // User clicked "Upgrade to Premium" inside the iframe — close modal
            // and scroll to the plan cards on the page behind it
            closePricingModal();
            setTimeout(() => {
                const plansGrid = document.querySelector('.grid.grid-cols-1');
                if (plansGrid) {
                    plansGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 550);
        } else if (e.data === 'hide-close-btn') {
            if (_pricingCloseBtn) _pricingCloseBtn.style.display = 'none';
        } else if (e.data === 'show-close-btn') {
            if (_pricingCloseBtn) _pricingCloseBtn.style.display = 'block';
        }
    });
}

/**
 * Shows a portal (iframe) to the pricing page within a modal.
 * First call triggers pre-warm automatically.
 * @param {object} options - { initialTab?: 'plans' | 'credits' }
 */
export function showPricingModal({ initialTab = 'plans' } = {}) {
    // Pre-warm if not done yet
    if (!_pricingModal) prewarmPricingModal();

    // Resolve user's current subscription plan to highlight in pricing page
    const userPlan = (window.appState?.user?.subscription || '').toLowerCase() || '';
    const planParam = userPlan ? `&plan=${userPlan}` : '';

    if (initialTab === 'credits') {
        // Hide iframe until credit overlay is fully open (prevents flash of pricing content)
        _pricingIframe.style.opacity = '0';
        _pricingIframe.style.transition = 'opacity 0.3s ease';

        // Listen for credit modal ready signal from iframe
        const onCreditsReady = (e) => {
            if (e.data === 'credits-modal-ready' || e.data?.type === 'credits-modal-ready') {
                window.removeEventListener('message', onCreditsReady);
                _pricingIframe.style.opacity = '1';
            }
        };
        window.addEventListener('message', onCreditsReady);

        // Fallback: show iframe after 2s even if signal never comes
        setTimeout(() => {
            window.removeEventListener('message', onCreditsReady);
            _pricingIframe.style.opacity = '1';
        }, 2000);

        // Timestamp forces reload every time (browser ignores same-URL reassignment)
        _pricingIframe.src = `pricing.html?mode=modal${planParam}&_t=${Date.now()}#credits`;
    } else {
        _pricingIframe.style.opacity = '1';
        _pricingIframe.src = `pricing.html?mode=modal${planParam}&_t=${Date.now()}`;
    }

    // Show modal
    _pricingModal.style.display = 'flex';
    _pricingModal.style.pointerEvents = 'auto';

    // Entrance animation (double-rAF ensures display:flex has rendered first)
    requestAnimationFrame(() => requestAnimationFrame(() => {
        _pricingModal.classList.remove('opacity-0');
        _pricingContainer.classList.remove('translate-y-full', 'sm:translate-y-24');
        _pricingContainer.classList.add('translate-y-0');
    }));

    // Escape key support
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closePricingModal();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}

/**
 * Hides the pricing modal with animation (does NOT destroy the iframe).
 */
export function closePricingModal() {
    if (!_pricingModal) return;
    _pricingModal.classList.add('opacity-0');
    _pricingModal.style.pointerEvents = 'none';
    _pricingContainer.classList.remove('translate-y-0');
    _pricingContainer.classList.add('translate-y-full', 'sm:translate-y-24');
    setTimeout(() => {
        if (_pricingModal) _pricingModal.style.display = 'none';
    }, 500);
}

