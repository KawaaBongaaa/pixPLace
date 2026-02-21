/**
 * Cookie Consent Manager v2.2
 *
 * LOGIC:
 *  — Shows AFTER onboarding flow (or immediately if onboarding already done)
 *  — User MUST tick checkbox (read Privacy Policy & Terms) to enable any button
 *  — "Accept & Continue"  → full tracking (Yandex + GA, GA geo-blocked for RU)
 *  — "Necessary Only"     → no tracking, but generation is UNLOCKED
 *  — Without ANY choice   → #generateBtn is silently blocked;
 *                           clicking it SHAKES + RED-GLOWS the consent banner
 *                           so user immediately sees what action is needed
 */

const COOKIE_CONSENT_KEY = 'pixplace_cookie_consent';
const ONBOARDING_DONE_KEY = 'pixplace_onboarding_done';

// ─── Tracking scripts ─────────────────────────────────────────────────────────
const TRACKING_SCRIPTS = [
    {
        name: 'Yandex Metrika',
        inject: () => {
            (function (m, e, t, r, i, k, a) {
                m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
                m[i].l = 1 * new Date();
                for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
                k = e.createElement(t), a = e.getElementsByTagName(t)[0],
                    k.async = 1, k.src = r, a.parentNode.insertBefore(k, a);
            })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
            ym(99723230, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true });
            console.log('✅ Yandex Metrika loaded.');
        }
    },
    {
        name: 'Google Analytics',
        inject: () => {
            // ⛔ GEO-BLOCK: Never load GA for Russian users (timezone check)
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const ruTZ = [
                'Europe/Moscow', 'Europe/Kirov', 'Europe/Volgograd', 'Europe/Saratov',
                'Europe/Ulyanovsk', 'Europe/Samara', 'Asia/Yekaterinburg', 'Asia/Omsk',
                'Asia/Novosibirsk', 'Asia/Barnaul', 'Asia/Tomsk', 'Asia/Novokuznetsk',
                'Asia/Krasnoyarsk', 'Asia/Irkutsk', 'Asia/Chita', 'Asia/Yakutsk',
                'Asia/Vladivostok', 'Asia/Magadan', 'Asia/Sakhalin', 'Asia/Srednekolymsk',
                'Asia/Kamchatka', 'Asia/Anadyr', 'Europe/Kaliningrad', 'Europe/Astrakhan'
            ];
            if (ruTZ.some(z => tz.includes(z)) || tz === 'Russian Standard Time') {
                console.log('🛡️ GA blocked — RU timezone detected.');
                return;
            }
            const s = document.createElement('script');
            s.async = true;
            const gaId = 'G-80JF455B6R';
            s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
            document.head.appendChild(s);
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', gaId);
            console.log('✅ Google Analytics loaded.');
        }
    }
];

// ─── Helper: open legal page even before legalRouter is ready ─────────────────
function openLegalPage(docType) {
    if (window.legalRouter) {
        window.legalRouter.navigateTo(docType);
    } else {
        const region = localStorage.getItem('pixplace_legal_region') || 'usa';
        window.location.href = `legal/${docType}-${region}.html`;
    }
}
window.openLegalPageConsent = openLegalPage;

// ─── Check if user has answered consent ───────────────────────────────────────
function consentAnswered() {
    try {
        const v = localStorage.getItem(COOKIE_CONSENT_KEY);
        return v === 'accepted' || v === 'necessary';
    } catch (e) { return false; }
}

// ─── Inject shake+glow CSS once ───────────────────────────────────────────────
function injectConsentAnimStyle() {
    if (document.getElementById('ccb-anim-style')) return;
    const s = document.createElement('style');
    s.id = 'ccb-anim-style';
    s.textContent = `
        @keyframes ccb-shake {
            0%,100%{ transform: translateY(0) scale(1); }
            15%    { transform: translateY(0) scale(1.03) rotate(-1.2deg); }
            30%    { transform: translateY(-5px) scale(1.05) rotate(1.3deg); }
            45%    { transform: translateY(2px) scale(1.02) rotate(-0.9deg); }
            60%    { transform: translateY(-3px) scale(1.03) rotate(0.8deg); }
            75%    { transform: translateY(1px) scale(1.01); }
        }
        #cookie-consent-banner.ccb-attention {
            animation: ccb-shake 0.52s cubic-bezier(0.36,0.07,0.19,0.97) both;
        }
        #cookie-consent-banner.ccb-attention > div {
            box-shadow:
                0 0 0 3px rgba(239,68,68,0.75),
                0 20px 56px rgba(0,0,0,0.32) !important;
            border-color: rgba(239,68,68,0.65) !important;
            transition: box-shadow 0.15s, border-color 0.15s;
        }
    `;
    (document.head || document.documentElement).appendChild(s);
}

// ─── Flash/shake the visible banner (call on blocked generate click) ──────────
function flashConsentBanner(showBannerCb) {
    injectConsentAnimStyle();
    const banner = document.getElementById('cookie-consent-banner');
    if (!banner) {
        // Banner not visible yet — show it now
        showBannerCb();
        return;
    }
    // Re-trigger animation (remove then add class)
    banner.classList.remove('ccb-attention');
    void banner.offsetWidth; // force reflow
    banner.classList.add('ccb-attention');
    banner.addEventListener('animationend', () => {
        banner.classList.remove('ccb-attention');
    }, { once: true });
}

// ─── Block generate button (visually normal, just intercept clicks) ───────────
function blockGenerateUntilConsent(showBannerCb) {
    const applyBlock = () => {
        const btn = document.getElementById('generateBtn');
        if (!btn || btn.dataset.consentGuarded) return;
        btn.dataset.consentGuarded = '1';

        btn.addEventListener('click', function consentGuard(e) {
            if (consentAnswered()) {
                // Consent given — remove guard silently
                btn.removeEventListener('click', consentGuard);
                delete btn.dataset.consentGuarded;
                btn.title = '';
                return; // let real click through
            }
            // Block & alert via banner shake (button stays normal-looking)
            e.preventDefault();
            e.stopImmediatePropagation();
            flashConsentBanner(showBannerCb);
        }, true); // capture phase = runs before app handlers

        // Button looks completely normal — no opacity/filter changes
        btn.title = 'Please accept Privacy Policy & Terms to generate';
    };

    applyBlock();
    // Retry if button isn't in DOM yet
    if (!document.getElementById('generateBtn')) {
        const obs = new MutationObserver(() => {
            if (document.getElementById('generateBtn')) {
                obs.disconnect();
                applyBlock();
            }
        });
        obs.observe(document.body || document.documentElement, { childList: true, subtree: true });
    }
}

function unblockGenerate() {
    const btn = document.getElementById('generateBtn');
    if (!btn) return;
    btn.title = '';
    delete btn.dataset.consentGuarded;
    // The capture listener self-removes on next click (consent check passes)
}

// ─── Main class ───────────────────────────────────────────────────────────────
class CookieManager {
    constructor() {
        try { this.consent = localStorage.getItem(COOKIE_CONSENT_KEY); }
        catch (e) { this.consent = null; }
        this._scheduleShow();
    }

    _scheduleShow() {
        if (this.consent === 'accepted') { this._loadScripts(); return; }
        if (this.consent === 'necessary') { return; } // already answered, no trackers

        // No answer yet — block generate and wait for onboarding to complete
        blockGenerateUntilConsent(() => this.showBanner());

        const onboardingDone = () => !!localStorage.getItem(ONBOARDING_DONE_KEY);
        const onDone = () => setTimeout(() => this.showBanner(), 600);

        if (onboardingDone()) {
            setTimeout(() => this.showBanner(), 800);
        } else {
            document.addEventListener('pixplace:onboarding:done', onDone, { once: true });

            let elapsed = 0;
            const poll = setInterval(() => {
                elapsed += 500;
                if (onboardingDone()) {
                    clearInterval(poll);
                    document.removeEventListener('pixplace:onboarding:done', onDone);
                    onDone();
                }
                if (elapsed > 60000) clearInterval(poll);
            }, 500);
        }
    }

    _loadScripts() {
        TRACKING_SCRIPTS.forEach(s => { try { s.inject(); } catch (e) { console.warn('Tracker error:', e); } });
    }

    showBanner() {
        if (document.getElementById('cookie-consent-banner')) return;
        if (!document.body) { setTimeout(() => this.showBanner(), 500); return; }

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
            || document.documentElement.classList.contains('dark')
            || (window.matchMedia?.('(prefers-color-scheme: dark)').matches);

        const bg = isDark ? 'rgba(14,14,18,0.97)' : 'rgba(255,255,255,0.97)';
        const border = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.08)';
        const text = isDark ? '#f4f4f5' : '#18181b';
        const muted = isDark ? '#a1a1aa' : '#71717a';
        const linkC = isDark ? '#818cf8' : '#4f46e5';
        const checkBg = isDark ? '#27272a' : '#f0f0f2';

        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';

        Object.assign(banner.style, {
            position: 'fixed',
            bottom: '76px',
            right: '14px',
            left: 'auto',
            top: 'auto',
            width: 'clamp(272px, 88vw, 352px)',
            zIndex: '999999',
            opacity: '0',
            transform: 'translateY(18px) scale(0.96)',
            transition: 'opacity 0.38s cubic-bezier(0.16,1,0.3,1), transform 0.38s cubic-bezier(0.16,1,0.3,1)',
            fontFamily: 'Inter, system-ui, sans-serif',
            pointerEvents: 'auto',
        });

        banner.innerHTML = `
            <div style="
                background:${bg};
                border:1px solid ${border};
                border-radius:18px;
                padding:18px 18px 14px;
                box-shadow:0 20px 56px rgba(0,0,0,0.28), 0 0 0 1px ${border};
                color:${text};
                backdrop-filter:blur(24px);
                -webkit-backdrop-filter:blur(24px);
            ">
                <!-- Header -->
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:11px;">
                    <div style="
                        width:32px;height:32px;border-radius:9px;
                        background:rgba(99,102,241,0.13);
                        display:flex;align-items:center;justify-content:center;flex-shrink:0;
                    ">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#6366f1" stroke-width="2.2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                    </div>
                    <div>
                        <div style="font-weight:700;font-size:13.5px;line-height:1.2;letter-spacing:-0.01em;">
                            Privacy &amp; Cookies
                        </div>
                        <div style="font-size:10.5px;color:${muted};margin-top:1px;">Required to generate images</div>
                    </div>
                </div>

                <!-- Info text -->
                <p style="font-size:11.5px;line-height:1.6;color:${muted};margin:0 0 12px;">
                    We use analytics cookies to improve pixPLace.
                    Choose <strong style="color:${text};">Necessary Only</strong> to skip tracking
                    — generation will still be available.
                </p>

                <!-- Legal links (always clickable) -->
                <div style="display:flex;gap:12px;margin-bottom:12px;font-size:10.5px;">
                    <a href="#" onclick="window.openLegalPageConsent('privacy'); return false;"
                        style="color:${linkC};text-decoration:underline;text-underline-offset:2px;">
                        Privacy Policy
                    </a>
                    <a href="#" onclick="window.openLegalPageConsent('terms'); return false;"
                        style="color:${linkC};text-decoration:underline;text-underline-offset:2px;">
                        Terms of Service
                    </a>
                </div>

                <!-- Checkbox — required for BOTH buttons -->
                <label id="ccb-label" style="
                    display:flex;align-items:flex-start;gap:9px;
                    margin-bottom:13px;cursor:pointer;
                    padding:9px 11px;border-radius:11px;
                    background:${checkBg};border:1px solid ${border};
                    transition:background 0.2s,border-color 0.2s;
                ">
                    <input type="checkbox" id="ccb-check" style="
                        width:15px;height:15px;margin-top:1px;flex-shrink:0;
                        accent-color:#6366f1;cursor:pointer;
                    ">
                    <span style="font-size:11px;line-height:1.5;color:${text};user-select:none;">
                        I have read and accept the
                        <a href="#" onclick="window.openLegalPageConsent('privacy'); return false;"
                            style="color:${linkC};font-weight:600;text-decoration:none;">Privacy Policy</a>
                        &amp;
                        <a href="#" onclick="window.openLegalPageConsent('terms'); return false;"
                            style="color:${linkC};font-weight:600;text-decoration:none;">Terms of Service</a>
                    </span>
                </label>

                <!-- Buttons -->
                <div style="display:flex;gap:7px;">
                    <button id="ccb-accept" disabled style="
                        flex:1;padding:10px 0;border-radius:11px;border:none;
                        background:linear-gradient(135deg,#6366f1,#4f46e5);
                        color:#fff;font-weight:600;font-size:12.5px;
                        cursor:not-allowed;opacity:0.42;
                        transition:opacity 0.2s,transform 0.1s;letter-spacing:-0.01em;
                    ">Accept &amp; Continue</button>

                    <button id="ccb-necessary" disabled style="
                        flex:0 0 auto;padding:10px 13px;border-radius:11px;
                        border:1px solid ${border};
                        background:transparent;color:${muted};
                        font-weight:500;font-size:11.5px;cursor:not-allowed;
                        opacity:0.42;transition:opacity 0.2s,background 0.15s;
                        white-space:nowrap;
                    ">Necessary Only</button>
                </div>

                <!-- Hint under buttons -->
                <p id="ccb-hint" style="
                    font-size:10px;color:${muted};opacity:0.7;
                    text-align:center;margin:9px 0 0;
                ">☝️ Tick the checkbox above to continue</p>
            </div>
        `;

        document.body.appendChild(banner);

        // Inject animation styles
        injectConsentAnimStyle();

        // Animate in
        requestAnimationFrame(() => requestAnimationFrame(() => {
            banner.style.opacity = '1';
            banner.style.transform = 'translateY(0) scale(1)';
        }));

        const check = banner.querySelector('#ccb-check');
        const btnAccept = banner.querySelector('#ccb-accept');
        const btnNec = banner.querySelector('#ccb-necessary');
        const label = banner.querySelector('#ccb-label');
        const hint = banner.querySelector('#ccb-hint');

        // Checkbox toggles both buttons
        check.addEventListener('change', () => {
            const on = check.checked;
            [btnAccept, btnNec].forEach(btn => {
                btn.disabled = !on;
                btn.style.opacity = on ? '1' : '0.42';
                btn.style.cursor = on ? 'pointer' : 'not-allowed';
            });
            label.style.background = on
                ? (isDark ? 'rgba(99,102,241,0.13)' : 'rgba(99,102,241,0.07)')
                : checkBg;
            label.style.borderColor = on ? 'rgba(99,102,241,0.38)' : border;
            hint.style.opacity = on ? '0' : '0.7';
        });

        // Accept & Continue → full tracking
        btnAccept.addEventListener('click', () => {
            if (btnAccept.disabled) return;
            this._setConsent('accepted');
            this._hideBanner(banner);
            unblockGenerate();
        });

        // Necessary Only → no tracking, generation unlocked
        btnNec.addEventListener('click', () => {
            if (btnNec.disabled) return;
            this._setConsent('necessary');
            this._hideBanner(banner);
            unblockGenerate();
        });
    }

    _hideBanner(banner) {
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(14px) scale(0.96)';
        setTimeout(() => banner?.remove(), 400);
    }

    _setConsent(status) {
        try { localStorage.setItem(COOKIE_CONSENT_KEY, status); } catch (e) { }
        this.consent = status;
        if (status === 'accepted') this._loadScripts();
        // 'necessary' → no trackers loaded
    }
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CookieManager());
} else {
    new CookieManager();
}
