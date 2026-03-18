/**
 * Legal Document Router & Region Manager
 * Handles region selection, modal display, and navigation routing for Privacy Policy and Terms of Service.
 */

const LegalRouter = {
    STORAGE_KEY: 'pixplace_legal_region',

    /**
     * Initialize the router logic.
     * Can be called on page load to check for redirects or setup.
     */
    init: function () {
        // Initialize header scroll logic for clean UI
        this.setupHeaderScroll();
    },

    /**
     * Handle header appearance on scroll to avoid "dark strip" issue.
     * Makes header transparent at top, and glassmorphic on scroll.
     */
    setupHeaderScroll: function () {
        const header = document.querySelector('header');
        if (!header) return;

        // Force transparent initially
        header.classList.remove('bg-white/80', 'dark:bg-[#09090b]/80', 'backdrop-blur-xl', 'border-b', 'border-gray-200/50', 'dark:border-white/5');
        header.classList.add('bg-transparent', 'border-transparent');
        header.style.backgroundColor = 'transparent'; // Force inline

        const updateHeader = () => {
            // Check Dark Mode manually
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
                document.documentElement.classList.contains('dark');

            if (window.scrollY > 10) {
                // Scrolled: Apply Glass Effect
                header.classList.remove('bg-transparent', 'border-transparent');
                header.classList.add('backdrop-blur-xl', 'border-b');

                // Manually apply background color to ensure correctness
                if (isDark) {
                    header.classList.remove('bg-white/80', 'border-gray-200/50');
                    header.classList.add('bg-[#09090b]/80', 'border-white/5');
                    header.style.backgroundColor = 'rgba(9, 9, 11, 0.8)'; // #09090b at 80% opacity
                    header.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                } else {
                    header.classList.remove('bg-[#09090b]/80', 'border-white/5');
                    header.classList.add('bg-white/80', 'border-gray-200/50');
                    header.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                    header.style.borderColor = 'rgba(229, 231, 235, 0.5)';
                }
            } else {
                // Top: Transparent
                header.classList.add('bg-transparent', 'border-transparent');
                header.classList.remove('backdrop-blur-xl', 'border-b', 'bg-white/80', 'dark:bg-[#09090b]/80', 'border-gray-200/50', 'dark:border-white/5');
                header.style.backgroundColor = 'transparent';
                header.style.borderColor = 'transparent';
            }
        };

        // Run immediately
        updateHeader();

        // Listen for scroll
        window.addEventListener('scroll', updateHeader, { passive: true });

        // Listen for theme changes if possible (optional, but good for robustness)
        // Using a MutationObserver on html class/attribute would be overkill but safe-guard
        const observer = new MutationObserver(updateHeader);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    },

    /**
     * Get the currently saved region.
     * @returns {string|null} 'usa', 'eu', or null if not set
     */
    getRegion: function () {
        return localStorage.getItem(this.STORAGE_KEY);
    },

    /**
     * Set the user's region preference.
     * @param {string} region 'usa' or 'eu'
     */
    setRegion: function (region) {
        localStorage.setItem(this.STORAGE_KEY, region);
    },

    navigateTo: function (docType) {
        const region = this.getRegion();
        if (region) {
            this._redirect(docType, region);
        } else {
            this._showModal(docType);
        }
    },

    /**
     * Switch region explicitly (e.g., from footer button).
     * Updates storage and redirects immediately.
     * @param {string} docType 'privacy' or 'terms'
     * @param {string} targetRegion 'usa' or 'eu'
     */
    switchRegionLegacy: function (docType, targetRegion) {
        this.setRegion(targetRegion);
        this._redirect(docType, targetRegion);
    },

    /**
     * Internal: Redirect to the correct file.
     * Handling paths relative to current location.
     */
    _redirect: function (docType, region) {
        // Determine base path
        // If we are in /legal/, path is just filename
        // If we are in root (index.html), path is legal/filename

        const isLegalDir = window.location.pathname.includes('/legal/');
        const filename = `${docType}-${region}.html`;
        const path = isLegalDir ? filename : `legal/${filename}`;

        window.open(path, '_blank');
    },

    /**
     * Internal: Show the Region Selection Modal.
     * dynamically injects HTML into the DOM.
     */
    _showModal: function (docType) {
        // Remove existing modal if any
        const existing = document.getElementById('legal-region-modal');
        if (existing) existing.remove();

        // Check Dark Mode manually to ensure correct rendering independent of Tailwind config
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
            document.documentElement.classList.contains('dark') ||
            (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

        // Force colors based on detection
        const bgStyle = isDark ? 'background-color: #09090b; color: #ffffff;' : 'background-color: #ffffff; color: #111827;';
        const borderStyle = isDark ? 'border-color: rgba(255, 255, 255, 0.1);' : 'border-color: #f3f4f6;';
        const backdropStyle = 'background-color: rgba(0, 0, 0, 0.6);';

        // Button styles
        const btnBase = "group relative flex items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer";
        const btnLight = "border-gray-200 hover:border-blue-500 bg-gray-50 hover:bg-blue-50/50 text-gray-900";
        const btnDark = "border-white/10 hover:border-blue-500 bg-white/5 hover:bg-blue-900/10 text-white";
        const btnClass = isDark ? btnDark : btnLight;

        const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';

        const modalHtml = `
        <div id="legal-region-modal" style="position: fixed; inset: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; padding: 1rem;">
            <!-- Backdrop -->
            <div style="position: absolute; inset: 0; ${backdropStyle} backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);"></div>
            
            <!-- Modal Content -->
            <div style="position: relative; width: 100%; max-width: 28rem; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); border: 1px solid; overflow: hidden; ${bgStyle} ${borderStyle}">
                
                <!-- Decorative Top Line -->
                <div style="height: 4px; width: 100%; background: linear-gradient(to right, #3b82f6, #a855f7, #3b82f6);"></div>

                <div class="p-8 text-center" style="padding: 2rem; text-align: center;">
                    <div style="width: 4rem; height: 4rem; background-color: rgba(59, 130, 246, 0.1); border-radius: 9999px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
                        <svg style="width: 2rem; height: 2rem; color: #3b82f6;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                    </div>

                    <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: inherit;">Select Your Region</h2>
                    <p class="${textMuted}" style="margin-bottom: 2rem; opacity: 0.8;">
                        Please select your region to view the appropriate legal documents and terms of service.
                    </p>

                    <div style="display: grid; gap: 1rem;">
                        <button onclick="legalRouter.handleSelection('${docType}', 'usa')" 
                            class="${btnBase} ${btnClass}">
                            <span class="flex-1 text-left font-semibold">
                                🇺🇸 United States / Global
                            </span>
                            <svg class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" style="color: #3b82f6;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>

                        <button onclick="legalRouter.handleSelection('${docType}', 'eu')" 
                            class="${btnBase} ${btnClass}">
                            <span class="flex-1 text-left font-semibold">
                                🇪🇺 EU / EEA
                            </span>
                            <svg class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" style="color: #3b82f6;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    /**
     * Handler called by modal buttons.
     */
    handleSelection: function (docType, region) {
        this.setRegion(region);

        // Animate modal out? or just redirect
        // For speed, just redirect
        this._redirect(docType, region);
    }
};

// Expose globally
window.legalRouter = LegalRouter;

// Auto-init to apply header fixes immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LegalRouter.init());
} else {
    LegalRouter.init();
}
