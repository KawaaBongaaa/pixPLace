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
    let buttonText = '<svg class="w-4 h-4 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Top Up Credits';

    let iconHtml = `
        <svg class="w-14 h-14 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
    `;

    if (reason === 'limit_reached') {
        title = 'Credits Finished';
        messageHtml = `<span class="text-yellow-400 font-bold">Generation limit reached!</span>`;
        subMessageHtml = `<span class="text-gray-300">Tokens for generation have ended.</span>`;
        buttonText = '<svg class="w-4 h-4 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Get More Credits';
        iconHtml = `
            <svg class="w-14 h-14 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
        `;
    }

    const modal = createElement('div', {
        id: 'ai-credits-modal',
        className: 'fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm opacity-0 transition-opacity duration-300',
        onclick: (e) => { if (e.target === modal) closeModal(); }
    });

    const content = createElement('div', {
        className: 'bg-white/10 backdrop-blur-xl border border-white/10 p-7 sm:p-10 rounded-3xl shadow-2xl max-w-sm w-full transform translate-y-4 transition-all duration-300 flex flex-col items-center text-center',
        innerHTML: `
            <div class="mb-4 flex justify-center w-full">${iconHtml}</div>
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
                const sub = (window.appState?.user?.subscription || '').toLowerCase();
                const hasSub = sub && !sub.includes('canceled') && ['pro', 'studio', 'touch'].some(tier => sub.includes(tier));
                showPricingModal({ initialTab: hasSub ? 'credits' : 'plans' });
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
            <div class="mb-4 flex justify-center w-full">
                <svg class="w-14 h-14 text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.49 4.49 0 00-1.757 4.306 4.438 4.438 0 002.58-1.758c.2-.204.414-.403.633-.598m-3.213-2.65c-.195.22-.394.433-.598.632A4.438 4.438 0 004.306 17.5a4.49 4.49 0 004.306-1.757z" />
                </svg>
            </div>
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
        innerHTML: '<svg class="w-4 h-4 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg> View Plans',
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
    const userPlanRaw = (window.appState?.user?.subscription || '').toLowerCase();
    let userPlan = '';
    if (userPlanRaw && !userPlanRaw.includes('canceled')) {
        if (userPlanRaw.includes('pro')) userPlan = 'pro';
        else if (userPlanRaw.includes('studio')) userPlan = 'studio';
        else if (userPlanRaw.includes('touch')) userPlan = 'touch';
    }
    const planParam = userPlan ? `&plan=${userPlan}` : '';

    const currentSrc = _pricingIframe.src || '';
    // Determine if we actually need to reload the iframe
    let needsReload = !currentSrc.includes('pricing.html');
    if (userPlan && !currentSrc.includes(`plan=${userPlan}`)) {
        needsReload = true;
    }

    if (needsReload) {
        // Hide iframe to prevent white flash while loading
        _pricingIframe.style.opacity = '0';
        _pricingIframe.style.transition = 'opacity 0.4s ease';

        if (initialTab === 'credits') {
            const onCreditsReady = (e) => {
                if (e.data === 'credits-modal-ready' || e.data?.type === 'credits-modal-ready') {
                    window.removeEventListener('message', onCreditsReady);
                    _pricingIframe.style.opacity = '1';
                }
            };
            window.addEventListener('message', onCreditsReady);

            setTimeout(() => {
                window.removeEventListener('message', onCreditsReady);
                _pricingIframe.style.opacity = '1';
            }, 1500);

            _pricingIframe.src = `pricing.html?mode=modal${planParam}#credits`;
        } else {
            // Listen for general load
            _pricingIframe.onload = () => {
                _pricingIframe.style.opacity = '1';
            };
            // Fallback
            setTimeout(() => { _pricingIframe.style.opacity = '1'; }, 1000);
            
            _pricingIframe.src = `pricing.html?mode=modal${planParam}`;
        }
    } else {
        // Iframe is already loaded with the correct plan, just show it and send a message if needed
        _pricingIframe.style.opacity = '1';
        if (initialTab === 'credits') {
            _pricingIframe.contentWindow.postMessage({ type: 'switch-tab', tab: 'credits' }, '*');
        }
    }

    // --- Prevent Window Jerk (Scrollbar Lock) ---
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0 && !document.body.classList.contains('portal-modal-open')) {
        document.body.style.paddingRight = scrollbarWidth + 'px';
    }
    document.body.classList.add('portal-modal-open');
    document.body.classList.add('overflow-hidden'); // Actually hide the scrollbar

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
        // Restore scrollbar smoothly
        document.body.classList.remove('portal-modal-open');
        document.body.classList.remove('overflow-hidden');
        document.body.style.paddingRight = '';
    }, 500);
}

