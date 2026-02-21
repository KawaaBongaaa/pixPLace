/**
 * pixPLace Onboarding Flow v2.0
 *
 * STEP 0 — Cinema Intro (full-Screen cinematic reveal)
 * STEPS 1–8 — Smart Spotlight Tour:
 *   1. Image / Video tabs
 *   2. AI Model selector (modeCardsToggle)
 *   3. Prompt input (+ Nano Banana Pro typewriter demo)
 *   4. Upload image button
 *   5. Resolution / aspect ratio selector
 *   6. GPT Chat button
 *   7. Generate button
 *
 * ✅ SWAPPABLE: Replace onboarding.js + onboarding.css for a new flow
 * ✅ MULTILINGUAL: window.dictionaryManager.translate(key)
 * ✅ NEW USERS ONLY: checks localStorage 'pixplace_onboarding_done'
 */

export class PixPlaceOnboarding {
    static STORAGE_KEY = 'pixplace_onboarding_done';

    static shouldShow() {
        try { return !localStorage.getItem(PixPlaceOnboarding.STORAGE_KEY); }
        catch { return false; }
    }

    static markDone() {
        try { localStorage.setItem(PixPlaceOnboarding.STORAGE_KEY, '1'); }
        catch {/* ignore */ }
    }

    constructor() {
        this.currentStep = 0;
        this.cinemaEl = null;
        this.tourEl = null;
        this.tooltipEl = null;
        this.ringEl = null;
        this._scrollLocked = false;
        this._resizeHandler = this._onResize.bind(this);
        this._typewriterTimer = null;

        // ── Tour step definitions (1 step = 1 DOM element to spotlight) ───
        this.tourSteps = [
            // ① Image / Video content-type tabs
            {
                selector: '.generation-tab[data-tab="image"], [data-tab="image"], .tab-btn:first-child, .generation-tabs button:first-child',
                fallback: '.tabs button, nav[data-tabs] a',
                titleKey: 'ob_tour_tabs_title',
                descKey: 'ob_tour_tabs_desc',
                typewriter: null,
            },
            // ② AI Model selector toggle
            {
                selector: '#modeCardsToggle, #videoCardsToggle, .mode-cards-toggle',
                fallback: '.mode-cards-toggle',
                titleKey: 'ob_tour_model_title',
                descKey: 'ob_tour_model_desc',
                typewriter: null,
            },
            // ③ Prompt input — with typewriter demo of Nano Banana Pro!
            {
                selector: '#promptInput',
                fallback: 'textarea[maxlength="2000"]',
                titleKey: 'ob_tour_prompt_title',
                descKey: 'ob_tour_prompt_desc',
                typewriter: true,   // special: show animated typing demo
            },
            // ④ Upload reference image button
            {
                selector: '#chooseUserImage',
                fallback: 'button[type="button"]',
                titleKey: 'ob_tour_upload_title',
                descKey: 'ob_tour_upload_desc',
                typewriter: null,
            },
            // ⑤ Resolution / aspect-ratio selector
            {
                selector: '#sizeGroup, #sizeSelect',
                fallback: 'select[id*="size"]',
                titleKey: 'ob_tour_size_title',
                descKey: 'ob_tour_size_desc',
                typewriter: null,
            },
            // ⑥ GPT Chat floating button
            {
                selector: '#ai-chat-float-btn',
                fallback: '.ai-chat-btn-entrance',
                titleKey: 'ob_tour_gpt_title',
                descKey: 'ob_tour_gpt_desc',
                typewriter: null,
            },
            // ⑦ Generate!
            {
                selector: '#generateBtn',
                fallback: 'button[type="submit"]',
                titleKey: 'ob_tour_generate_title',
                descKey: 'ob_tour_generate_desc',
                typewriter: null,
            },
        ];

        this.totalSteps = 1 + this.tourSteps.length; // 8
    }

    /* ── i18n ─────────────────────────────────────────────────── */
    t(key, vars = {}) {
        let text = window.dictionaryManager?.translate?.(key) || '';
        if (!text || text === key) text = FALLBACK_EN[key] || key;
        Object.entries(vars).forEach(([k, v]) => {
            text = text.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
        });
        return text;
    }

    /* ── Entry ────────────────────────────────────────────────── */
    async start() {
        this._lockScroll();
        this._renderCinema();
        await this._wait(60);
        this._showCinema();
    }

    /* ─────────────────────────────────────────────────────────────
       STEP 0 — CINEMA INTRO
    ───────────────────────────────────────────────────────────── */
    _renderCinema() {
        const el = document.createElement('div');
        el.className = 'ob-cinema-overlay';
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-label', 'Welcome to pixPLace');
        el.innerHTML = `
            <div class="ob-cinema-card">
                <button class="ob-cinema-skip" aria-label="Skip">${this.t('ob_skip')}</button>

                <div class="ob-cinema-logo">
                    <div class="ob-cinema-logo-ring">${this._logoSVG()}</div>
                </div>

                <h1 class="ob-cinema-title">${this.t('ob_cinema_title')}</h1>
                <p class="ob-cinema-tagline">${this.t('ob_cinema_tagline')}</p>

                <button class="ob-cinema-btn">
                    ${this.t('ob_cinema_btn')}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2.5"
                         stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </button>

                <div class="ob-progress-dots">
                    ${Array.from({ length: this.totalSteps }, (_, i) =>
            `<span class="ob-progress-dot ${i === 0 ? 'ob-active' : ''}"></span>`
        ).join('')}
                </div>
            </div>`;

        document.body.appendChild(el);
        this.cinemaEl = el;

        el.querySelector('.ob-cinema-skip').addEventListener('click', () => this._finish());
        el.querySelector('.ob-cinema-btn').addEventListener('click', () => this._onCinemaContinue());
    }

    async _showCinema() {
        const ov = this.cinemaEl;
        const els = [
            ov.querySelector('.ob-cinema-card'),
            ov.querySelector('.ob-cinema-logo'),
            ov.querySelector('.ob-cinema-title'),
            ov.querySelector('.ob-cinema-tagline'),
            ov.querySelector('.ob-cinema-btn'),
            ov.querySelector('.ob-progress-dots'),
        ];

        ov.classList.add('ob-visible');
        await this._wait(180);
        els[0].classList.add('ob-visible');
        await this._wait(280);
        els[1].classList.add('ob-visible');
        await this._wait(220);
        for (let i = 2; i < els.length; i++) {
            els[i].classList.add('ob-visible');
            await this._wait(130);
        }
    }

    async _onCinemaContinue() {
        const el = this.cinemaEl;
        el.style.transition = 'opacity 0.4s ease';
        el.style.opacity = '0';
        await this._wait(420);
        el.remove();
        this.cinemaEl = null;
        this.currentStep = 1;
        this._renderTour();
        await this._wait(80);
        this._goToTourStep(0);
    }

    /* ─────────────────────────────────────────────────────────────
       STEPS 1–7 — SPOTLIGHT TOUR
    ───────────────────────────────────────────────────────────── */
    _renderTour() {
        // SVG overlay layer
        const tourEl = document.createElement('div');
        tourEl.className = 'ob-tour-layer';
        tourEl.innerHTML = `
            <svg class="ob-spotlight-svg" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <mask id="ob-spotlight-mask">
                        <rect width="100%" height="100%" fill="white"/>
                        <rect id="ob-spotlight-hole" rx="0" fill="black"/>
                    </mask>
                </defs>
                <rect class="ob-spotlight-mask" width="100%" height="100%"
                      mask="url(#ob-spotlight-mask)" style="pointer-events:all;"/>
            </svg>`;
        document.body.appendChild(tourEl);
        this.tourEl = tourEl;

        // Highlight ring
        const ring = document.createElement('div');
        ring.className = 'ob-spotlight-ring';
        document.body.appendChild(ring);
        this.ringEl = ring;

        // Tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'ob-tooltip';
        tooltip.setAttribute('role', 'tooltip');
        document.body.appendChild(tooltip);
        this.tooltipEl = tooltip;

        // Clicking dark area = next step
        tourEl.querySelector('.ob-spotlight-svg rect.ob-spotlight-mask')
            .addEventListener('click', () => this._nextTourStep());

        window.addEventListener('resize', this._resizeHandler);
    }

    _goToTourStep(tourIdx) {
        const step = this.tourSteps[tourIdx];
        const target = this._findTarget(step);

        if (!target) {
            console.warn(`[Onboarding] No target for step ${tourIdx + 1}, skipping`);
            const next = tourIdx + 1;
            if (next < this.tourSteps.length) this._goToTourStep(next);
            else this._finish();
            return;
        }

        this._currentTourIndex = tourIdx;
        this._currentTarget = target;

        // Kill any running typewriter
        clearTimeout(this._typewriterTimer);

        // Scroll into view, then position
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
            this._positionSpotlight(target);
            this._renderTooltip(step, tourIdx);
        }, 320);
    }

    _findTarget({ selector, fallback }) {
        for (const sel of selector.split(',').map(s => s.trim())) {
            try {
                const el = document.querySelector(sel);
                if (el && this._isVisible(el)) return el;
            } catch {/* bad selector */ }
        }
        if (fallback) {
            for (const sel of fallback.split(',').map(s => s.trim())) {
                try {
                    const el = document.querySelector(sel);
                    if (el && this._isVisible(el)) return el;
                } catch { }
            }
        }
        return null;
    }

    _isVisible(el) {
        const r = el.getBoundingClientRect();
        if (!r.width && !r.height) return false;
        const s = getComputedStyle(el);
        return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';
    }

    _positionSpotlight(target) {
        const PAD = 10, R = 12;
        const rect = target.getBoundingClientRect();
        const x = rect.left - PAD,
            y = rect.top - PAD,
            w = rect.width + PAD * 2,
            h = rect.height + PAD * 2;

        const hole = this.tourEl.querySelector('#ob-spotlight-hole');
        hole.setAttribute('x', x);
        hole.setAttribute('y', y);
        hole.setAttribute('width', w);
        hole.setAttribute('height', h);
        hole.setAttribute('rx', R);

        Object.assign(this.ringEl.style, {
            left: `${x}px`,
            top: `${y}px`,
            width: `${w}px`,
            height: `${h}px`,
            borderRadius: `${R + 2}px`,
        });

        this._targetRect = { x, y, w, h };
    }

    _renderTooltip(step, tourIdx) {
        const tooltip = this.tooltipEl;
        const globalStep = tourIdx + 2;               // cinema = step 1
        const isLast = tourIdx === this.tourSteps.length - 1;
        const stepLabel = this.t('ob_step_of', { current: globalStep, total: this.totalSteps });

        // Progress dots for tour
        const dots = this.tourSteps.map((_, i) => {
            const cls = i < tourIdx ? 'ob-done' : i === tourIdx ? 'ob-active' : '';
            return `<span class="ob-tooltip-dot ${cls}"></span>`;
        }).join('');

        // Optional typewriter block (prompt step)
        const twBlock = step.typewriter
            ? `<div class="ob-typewriter-demo" id="ob-tw-demo"><span class="ob-typewriter-cursor"></span></div>`
            : '';

        tooltip.innerHTML = `
            <div class="ob-tooltip-step">${stepLabel}</div>
            <span class="ob-tooltip-arrow ob-arrow-top"></span>
            <h3 class="ob-tooltip-title">${this.t(step.titleKey)}</h3>
            <p class="ob-tooltip-desc">${this.t(step.descKey)}</p>
            ${twBlock}
            <div class="ob-tooltip-footer">
                <div class="ob-tooltip-dots">${dots}</div>
                <div class="ob-tooltip-buttons">
                    <button class="ob-btn-skip">${this.t('ob_skip')}</button>
                    <button class="ob-btn-next">${isLast ? this.t('ob_finish') : this.t('ob_next')}</button>
                </div>
            </div>`;

        this._positionTooltip();

        tooltip.querySelector('.ob-btn-skip').addEventListener('click', () => this._finish());
        tooltip.querySelector('.ob-btn-next').addEventListener('click', () => this._nextTourStep());

        // Animate in
        requestAnimationFrame(() => tooltip.classList.add('ob-visible'));

        // Start typewriter if this step has it
        if (step.typewriter) this._startTypewriter();
    }

    _startTypewriter() {
        const demo = document.getElementById('ob-tw-demo');
        if (!demo) return;

        const text = this.t('ob_tour_prompt_demo');
        let index = 0;

        const cursor = demo.querySelector('.ob-typewriter-cursor');

        const type = () => {
            if (!document.getElementById('ob-tw-demo')) return; // tooltip gone
            if (index < text.length) {
                // Insert text node before cursor
                const node = document.createTextNode(text[index]);
                demo.insertBefore(node, cursor);
                index++;
                this._typewriterTimer = setTimeout(type, 42 + Math.random() * 28);
            }
        };

        // Small delay so tooltip is visible first
        this._typewriterTimer = setTimeout(type, 400);
    }

    _positionTooltip() {
        if (!this._targetRect) return;
        const { x, y, w, h } = this._targetRect;
        const VW = window.innerWidth;
        const VH = window.innerHeight;
        const TW = Math.min(300, VW - 32);
        const TH = 180;
        const GAP = 14;

        // Prefer below; fall back to above
        let top = y + h + GAP;
        let dir = 'ob-arrow-top';
        if (top + TH > VH - GAP) {
            top = y - TH - GAP;
            dir = 'ob-arrow-bottom';
        }
        top = Math.max(GAP, Math.min(top, VH - TH - GAP));

        let left = x;
        left = Math.max(GAP, Math.min(left, VW - TW - GAP));

        Object.assign(this.tooltipEl.style, {
            top: `${top}px`,
            left: `${left}px`,
            width: `${TW}px`,
        });

        const arrow = this.tooltipEl.querySelector('.ob-tooltip-arrow');
        if (arrow) arrow.className = `ob-tooltip-arrow ${dir}`;
    }

    _nextTourStep() {
        clearTimeout(this._typewriterTimer);
        this.tooltipEl.classList.remove('ob-visible');
        const next = this._currentTourIndex + 1;
        if (next < this.tourSteps.length) {
            setTimeout(() => this._goToTourStep(next), 290);
        } else {
            this._finish();
        }
    }

    _onResize() {
        if (this._currentTarget) {
            this._positionSpotlight(this._currentTarget);
            this._positionTooltip();
        }
    }

    /* ─────────────────────────────────────────────────────────────
       FINISH / CLEANUP
    ───────────────────────────────────────────────────────────── */
    _finish() {
        clearTimeout(this._typewriterTimer);
        PixPlaceOnboarding.markDone();
        this._unlockScroll();
        this._destroyAll();
    }

    _destroyAll() {
        window.removeEventListener('resize', this._resizeHandler);
        [this.cinemaEl, this.tourEl, this.tooltipEl, this.ringEl].forEach(el => {
            if (!el) return;
            el.style.opacity = '0';
            el.style.transition = 'opacity 0.32s ease';
            setTimeout(() => el?.remove(), 340);
        });
        this.cinemaEl = this.tourEl = this.tooltipEl = this.ringEl = null;
    }

    /* ─────────────────────────────────────────────────────────────
       UTILITIES
    ───────────────────────────────────────────────────────────── */
    _lockScroll() {
        if (this._scrollLocked) return;
        this._scrollLocked = true;
        this._prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    }

    _unlockScroll() {
        if (!this._scrollLocked) return;
        this._scrollLocked = false;
        document.body.style.overflow = this._prevOverflow || '';
    }

    _wait(ms) { return new Promise(r => setTimeout(r, ms)); }

    _logoSVG() {
        return `<svg viewBox="0 0 863.1 706.9" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true">
            <path d="M413,488.9c-2.9-52.7-49-126.7-111-115c-16.7,4-58.6,12.4-37,36c15.5,23.5,47.8,53.5,51,7c3.4-5.6,6-0.9,9,2
            c8.7,18.6,30.9,29.7,41,47c8.2,5.6,0.7,12.2-5,16c-1.1,14.9,7.1,33.6,1,48c-5.1,14-21.7-9.1-37-4c-19.5,9.5-57,23.3-52,51
            c-3.1,43.2,35.5,65.3,13,76c-65.2,15.2-83.3-68.7-68-117c10.5-23.9,59.8-38.4,57-68c-12.4-26.6-48.1-37.6-75-31
            c-11.3,3.7-21.7,8.8-34,10c-9.1-9.5,16.4-13.9,14-25c-6.6-17.5,9.8-31.8,18-45c38.9-120.1,17-35.2,95-41
            c-11.5-42.1-69-89.5-109-42c-58.9,41.5-33.1,132.5-51,122c-32.2-19.7-29.9,9.6-23,32c9.3,22.1,31.6,37.2,54,41
            c74.2-11.9,39.6-1.4,11,38c-10.5,19.2-14.3,43.4-44,35c-10.7-5-18-19.7-30-21c-9.9,5.1-35.4,42.9-35,13
            c1.6-9.6-11.4-10.3-14-20c-3.2-11.7-8-45.7,7-49c10.4,13,24.3,21.4,42,20c16-6.2-9.6-20.4-9-31
            c-10.7-19.1-12.6-44.7-15-66c-11.2,9.7-32.2,40.5-24,3c4.5-10,6.2-20.5,12-30c1-3.9-7.7-8-9-13
            c-2.5-6.7-7.3-26.9,2-31c8.2-2.7,39.6,21.6,30,2c-15.4-35.5,2.6-16.9,22-11c8.1,1.5,129.9-115.8,75-93
            c-8.9,1.4-18,5.2-26,10c-41.8,27.3-14.6-23.1,6-34c14.3-10.5,29.9-16,45-21c11.3-5.9,1.2-46.8,22-20
            c0,0.9,10.1,21.7,9,15c7.5-17.3,25.6-28.8,41-38c16.3-15.3,54.2-10.9,45-42c-3.6-22.6,60.2-96.3,42-26
            c-10.3,16.2,16.3,9.5,2,33c-10.4,63.7-136.2,56.8-110,136c17.3,28.2,50.6,47.4,68,76c5.5,12.8,7.8,3.8,16,1
            c7-5.5,15.3-7.5,23-12c21.5-7-24.6,36.8,6,47c8.2,4.4,26.3,30.4,30,27c25.3-334-48.3-35.7-80-126
            c-39-70.3-51.1-31.5,26-72c17.6-9.9,42.4-11.5,52-33c2.9-37.5,17.6-139.6-29-153c-48.8-12.2-92.1,20.5-136,36
            c-32.9,12.5-71.3,42.9-82,79c-42,39.4-105.7,80.9-119,145c-11.2,25.3-5.3,59.4-17,85C8.7,364.3,2.9,384,0,403.9
            c3,68.1,11.6,64.9,15,1c4.8-16.7,12.4,10.3,14,15c12.2,17.1,18.2,19.2,2,36c-16.9,26.2-22.5,58-9,88
            c11.9,31.8,50.1,46.8,67,74c12.3,41.7,60.1,80.4,103,84c1.5-2.7,6.1,0.8,2-3c-28-16-43.4-49.7-69-68
            c-17.4,1.1-21.5-45.9-7-41c8.6,4,17.2,6.1,26,9c41.6,6.7,34.1-29.4,51,21c1.8,4.7,9.1,16.1-2,15
            c-7.6-1.6-24.8-20.1-22-6c7.3,36.2,43.4,70.9,80,78c49.2,0.7,97.6-50.6,85-100c-13.4-44,7.6-24.8,27-6
            C409.6,591.6,413.4,530.3,413,488.9z"/>
            <path d="M862,400.9c-0.2-24.6-13.1-42.1-22-64c-5.2-44.7-9.1-87.4-35-123c-19.7-37.6-64.3-67.1-95-92
            c-2.4-3.3-1.3-8.7-4-12c-27.3-62.8-102.6-78.1-155-103c-25-5.7-59.4-16.1-80,10c-16.4,33-30.7,140.4,13,160
            c21.5,5.4,42,19.2,63,27c44.8,9.9,10,22.8-2,45c-16.1,71.3-40.5,2.3-72-18c-31.5-26.8-11.9,115.2-14,141
            c4.4,11.6-5.1,27.5,11,6c8.9-13.5,38.8-23.4,29-42c-5.9-16.9-21.3-33.5,9-17c31.1,28.6,39.7-21.8,65-39
            c14-10.2,31.4-24.5,33-42c6.2-29-22.9-54.6-47-67c-22.8-12.2-53.1-19.9-63-48c-0.3-10.5-15.5-25.4-2-32
            c6.9-0.5,2.9-8.7,1-12c0.2-2.5-0.4-7.1-2-9c-9.8-57.3,56.1,22.9,43,44c-4.2,14.8,16.6,17.5,25,22
            c21.5,11.1,53.5,25.4,62,51c5.3-8.6,8.3-18.7,17-26c5.9-0.7,6.5,5.4,8,9c-0.6,35.6,68.1,29.7,78,73
            c10.5,25.7-27-3.3-35-5c-74.1-24.7,26.3,50.3,35,68c8.1,18.5,32.8,29.2,47,12c16.4-5.1,4,17,2,24
            c-4,6.1-0.2,4.8,5,4c46.4-25.1,33,13.5,21,41c3.2,8.6,20.2,39.5,6,42c-36.3-40.7-13.5-1.5-29,29
            c-1.6,9.2-6.7,16.6-10,25c-3.8,6.5-18.4,18.8-5,22c17.2,1.3,30.8-6.7,42-20c14.5,4.9,9,38,6,50
            c-4.9,10.3-17.2,10.8-13,24c-6.2,19.8-27.8-15.3-35-18c-18.4,6.5-52.6,46-66,2c0-16.3-72.1-72.5-28-58
            c71.6,32.5,126.6-101,61-69c-17,0.7-0.5-40.4-10-54c-9-38.6-36.7-75.2-75-89c-23.3-10.6-84.8,51.1-71,63
            c29.7,11,49.1-25.9,65-23c14.9,9.7,13.4,31,19,45c5.1,16.9,17.4,31.2,26,47c-1.8,35,3.5,17.9,15,40
            c-5.3,7.1-56.4-21.4-79-5c-13.4,7.3-34.4,16.6-32,36c32.9,45.2,82.4,57.9,58,126c-9.4,37.7-34.9,68.7-76,45
            c11.3-42.1,47.3-88-15-113c-42.2-29-64,43.5-52-51c-27.8-18.6,26.4-40.8,33-60c3-6.6,11.2-15.1,12-2
            c3.3,9.6,5.8,29.3,21,19c28.6-21.7,57.9-50.3,7-63c-60.6-23.5-117.4,43.7-123,98c-4.9,25.6-3.1,58.4,5,81
            c7.3,27.3,38,65.1,61,27c12.3-9.3,15.3,4.2,10,13c-22.3,67,60,145.9,121,93c18.3-3.3,63.4-83.3,30-59
            c-26.5,15.4-11-11.2-6-24c1.1-7,2.9-16.2,12-12c42.3,24.8,71.3-36.7,67,21c-1.9,8.9-10.2,15.4-19,18
            c-18,19.9-51.5,53.9-64,68c38.1,1.4,79.5-34.1,99-69c4.7-17.6,15.8-33.6,34-42c40.1-31.9,59.3-80,35-124
            c-21.8-36.5-18.5-17.5,0-54c10.6-34.5,15.4,17.1,13,29c-1.9,1.4,0.7,4.6,0,7c1.2,2.2,3.2,4.7,4,7
            C863.2,455.3,864.3,412.4,862,400.9z"/>
        </svg>`;
    }
}

/* ─── Fallback English strings ─────────────────────────────── */
const FALLBACK_EN = {
    ob_cinema_title: 'Welcome to pixPLace',
    ob_cinema_tagline: 'Turn your words into stunning visuals with AI',
    ob_cinema_btn: "Let's explore",
    ob_skip: 'Skip',
    ob_next: 'Next →',
    ob_finish: "Let's create! 🚀",
    ob_step_of: '{{current}} of {{total}}',

    ob_tour_tabs_title: 'Images or Videos?',
    ob_tour_tabs_desc: 'Switch between Image generation and the upcoming Video tools — each tab unlocks a different set of AI models.',

    ob_tour_model_title: 'Choose your AI model',
    ob_tour_model_desc: 'Pick the engine that fits your task — quick edits, pro retouching, creative generation, or background removal.',

    ob_tour_prompt_title: 'Describe your idea',
    ob_tour_prompt_desc: 'Just write what you need in natural language. Try: "edit my photo in Wes Anderson style with warm tones".',
    ob_tour_prompt_demo: 'Edit my photo in Wes Anderson style — warm pastel tones, symmetrical framing...',

    ob_tour_upload_title: 'Add reference images',
    ob_tour_upload_desc: 'Upload your own photos for Nano Banana Pro — the AI uses them as a base for editing, not just as inspiration.',

    ob_tour_size_title: 'Choose output resolution',
    ob_tour_size_desc: 'Pick Square for social posts, Portrait for Stories and Reels, or Landscape for banners and wallpapers.',

    ob_tour_gpt_title: 'Need help with prompts? ✨',
    ob_tour_gpt_desc: 'GPT Chat is your AI assistant for crafting perfect prompts — describe your idea and it rewrites it like a pro.',

    ob_tour_generate_title: 'Ready? Hit Generate!',
    ob_tour_generate_desc: 'Your image will be ready in seconds. Results appear in the History panel — swipe to see them.',
};

/* ─── Auto-init helper ──────────────────────────────────────── */
export function initOnboarding() {
    if (!PixPlaceOnboarding.shouldShow()) return;
    new PixPlaceOnboarding().start();
}

export default PixPlaceOnboarding;
