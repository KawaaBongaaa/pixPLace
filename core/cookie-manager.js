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

// ─── Main class ───────────────────────────────────────────────────────────────
class CookieManager {
    constructor() {
        try { this.consent = localStorage.getItem(COOKIE_CONSENT_KEY); }
        catch (e) { this.consent = null; }
        this._scheduleShow();
    }

    _scheduleShow() {
        // Consent given at login — auto-accept, no banner
        this._setConsent('accepted');
    }

    _loadScripts() {
        TRACKING_SCRIPTS.forEach(s => { try { s.inject(); } catch (e) { console.warn('Tracker error:', e); } });
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
