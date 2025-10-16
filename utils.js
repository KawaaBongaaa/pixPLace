// 🔧 Device detection helpers
export function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isAndroid() {
    return /Android/i.test(navigator.userAgent);
}

export function isTablet() {
    return /iPad|Android(?=.*\bMobile\b)|Tablet/i.test(navigator.userAgent) || isAndroid();
}

export function supportsShare() {
    return navigator.share && navigator.canShare;
}

// 🔥 УЛУЧШЕННАЯ ОПТИМИЗИРОВАННАЯ ЛОГИКА СКАЧИВАНИЯ/ШАРИНГА
// 🎯 Smart platform detection with comprehensive support
export function getDeviceCapabilities() {
    const ua = navigator.userAgent;
    const hasShareAPI = navigator.share !== undefined;
    const hasCanShareAPI = navigator.canShare !== undefined;
    const isWebView = ua.includes('wv') || ua.includes('WebView');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isTelegram = window.Telegram?.WebApp !== undefined;

    return {
        platform: {
            mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
            android: /Android/i.test(ua),
            ios: /iPad|iPhone|iPod/.test(ua),
            tablet: /iPad|Android(?=.*\bMobile\b)|Tablet/i.test(ua) || /Android/i.test(ua),
            windows: /Windows/i.test(ua),
            macos: /Mac OS X/i.test(ua),
            linux: /Linux/i.test(ua) && !/Android/i.test(ua),
            telegram: isTelegram,
            webview: isWebView,
            standalone: isStandalone
        },
        api: {
            share: hasShareAPI,
            canShare: hasCanShareAPI,
            canShareFiles: hasCanShareAPI && navigator.canShare({ files: [new File([''], 'test.png')] }),
            blobUrl: URL.createObjectURL !== undefined,
            dataUrl: true
        },
        features: {
            haptic: navigator.vibrate !== undefined,
            clipboard: navigator.clipboard !== undefined,
            download: document.createElement('a').download !== undefined
        }
    };
}

// 🖼️ Unified image download/share function with optimal platform handling
export async function downloadOrShareImage(imageUrl, options = {}) {
    const {
        filename = `ai-generated-${Date.now()}.png`,
        title = 'AI Generated Image',
        text = 'Created with pixPLace Bot',
        showToast = true
    } = options;

    const caps = getDeviceCapabilities();
    console.log('📱 Device capabilities:', caps);
    console.log('🔗 Image URL to download:', imageUrl);

    // 🎯 DESKTOP BROWSERS - PRIORITY DOWNLOAD FIRST
    if (!caps.platform.mobile) {
        console.log('💻 Desktop detected - starting download process');

        // Step 1: Try direct download with a.download attribute (Firefox, modern browsers)
        try {
            console.log('🔗 Direct download with download attr');
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = filename;
            link.style.display = 'none';
            link.target = '_blank'; // Open in new tab if download doesn't work

            // Add to DOM and click
            document.body.appendChild(link);

            // Try programatic click first
            link.click();

            // Remove immediately after
            document.body.removeChild(link);

            console.log('✅ Direct download link triggered');
            if (showToast) showToastNat('success', 'Download started! Check your downloads folder.');
            return { method: 'direct-download', success: true };
        } catch (error) {
            console.warn('⚠️ Direct download failed:', error.message);
        }

        // Step 2: Try blob download if CORS allows
        if (caps.api.blobUrl) {
            try {
                console.log('💿 Attempting blob download');
                const response = await fetch(imageUrl, {
                    method: 'GET',
                    mode: 'cors' // Explicitly set CORS mode
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const blobUrl = URL.createObjectURL(blob);

                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = filename;
                    link.style.display = 'none';

                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    URL.revokeObjectURL(blobUrl);

                    console.log('✅ Blob download succeeded');
                    if (showToast) showToastNat('success', 'Download completed!');
                    return { method: 'blob-download', success: true };
                } else {
                    console.warn('⚠️ Blob fetch failed with status:', response.status);
                }
            } catch (corsError) {
                console.warn('⚠️ Blob download failed (likely CORS):', corsError.message);
                console.log('💡 CORS error is normal in local development - will use fallback');
            }
        }

        // Step 3: Final fallback - open in new tab with clear instructions
        console.log('📂 Desktop fallback - opening in new tab with save instructions');
        window.open(imageUrl, '_blank');

        // Show detailed instructions based on browser
        if (caps.platform.mac) {
            if (showToast) showToastNat('info', 'Image opened - ⌘+S or right-click > Save Image As');
        } else {
            if (showToast) showToastNat('info', 'Image opened - Ctrl+S or right-click > Save image as');
        }

        return { method: 'open-with-save-instructions', success: true };
    }

    // � EMERGENCY MANUAL DOWNLOAD FOR BROKEN ENVIRONMENTS
    console.log('🚨 Emergency manual download for broken environment');

    // Create a temporary download button
    const emergencyBtn = document.createElement('button');
    emergencyBtn.innerHTML = '📥 Download Image';
    emergencyBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        padding: 10px 20px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
    `;

    emergencyBtn.onclick = () => {
        window.open(imageUrl, '_blank');
        document.body.removeChild(emergencyBtn);
        if (showToast) showToastNat('info', 'Manual download initiated - use browser menu to save');
    };

    document.body.appendChild(emergencyBtn);

    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (emergencyBtn.parentNode) {
            document.body.removeChild(emergencyBtn);
        }
    }, 10000);

    if (showToast) showToastNat('warning', 'Download button created - click top-right blue button');
    return { method: 'emergency-manual', success: true };

    // �📱 MOBILE DEVICES LOGIC BELOW

    // 1️⃣ MOBILE WITH SHARE API SUPPORT
    if (caps.api.share && caps.api.canShare) {
        try {
            console.log('📱 Using native share API');
            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error('Fetch failed');

            const blob = await response.blob();
            const file = new File([blob], filename, { type: blob.type });

            const shareData = {
                files: [file],
                title,
                text
            };

            if (navigator.canShare(shareData)) {
                await navigator.share(shareData);
                if (showToast) showToastNat('success', 'File shared successfully!');
                return { method: 'native-share', success: true };
            } else {
                throw new Error('Cannot share files');
            }
        } catch (error) {
            console.warn('⚠️ Native share failed, falling back:', error.message);
        }
    }

    // 2️⃣ IOS SPECIAL HANDLING
    if (caps.platform.ios) {
        console.log('🍎 iOS device - opening in new tab with instructions');
        window.open(imageUrl, '_blank');
        if (showToast) showToastNat('info', 'Tap and hold to save or share image');
        return { method: 'ios-open', success: true };
    }

    // 3️⃣ ANDROID/OTHER MOBILE - TRY BLOB IF SUPPORTED
    if (caps.api.blobUrl && caps.features.download) {
        try {
            console.log('📱 Mobile blob download attempt');
            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error('Fetch failed');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);

            if (showToast) showToastNat('success', 'Download started!');
            return { method: 'mobile-blob-download', success: true };
        } catch (error) {
            console.warn('⚠️ Mobile blob download failed:', error.message);
        }
    }

    // 4️⃣ MOBILE FALLBACK - OPEN IN NEW TAB
    console.log('📂 Mobile opening in new tab');
    try {
        window.open(imageUrl, '_blank');

        let message = 'Image opened in new tab';
        if (caps.platform.android) {
            message = 'Tap and hold image to save';
        } else {
            message = 'Use browser menu to save image';
        }

        if (showToast) showToastNat('info', message);
        return { method: 'mobile-open-tab', success: true };
    } catch (error) {
        console.error('❌ All mobile methods failed:', error);
        if (showToast) showToastNat('error', 'Download failed - please check image URL');
        return { method: 'failed', success: false, error: error.message };
    }
}

// 🔔 ОСТОРОЖНАЯ ФУНКЦИЯ С ТОСТОМ - НЕ ЗАВИСИТ ОТ ВНЕШНИХ МОДУЛЕЙ
function showToastNat(type, message) {
    // Проверяем - есть ли уже функция showToast в window
    if (window.showToast && typeof window.showToast === 'function') {
        window.showToast(type, message);
        return;
    }

    // Fallback implementation - простое сообщение в консоль
    const emoji = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    console.log(`${emoji[type] || '📌'} ${message}`);
}

// 💤 Haptic feedback abstraction
export function triggerHapticFeedback(type = 'light') {
    if (!navigator.vibrate) return false;

    const patterns = {
        light: 50,
        medium: [50, 50, 50],
        heavy: [100, 50, 100],
        success: [100, 50, 100, 50, 100],
        error: [200, 50, 200],
        warning: [50, 100, 50, 100, 50]
    };

    const pattern = patterns[type] || patterns.light;
    navigator.vibrate(pattern);
    return true;
}

// ⚡ Кэшированные результаты платформенных проверок
let deviceCapabilitiesCache = null;
let deviceCapabilitiesTimestamp = 0;
const CACHE_DURATION = 30000; // 30 секунд кэширования

// 🧠 Smart platform detection with cached results
export function getSmartDeviceCapabilities(forceRefresh = false) {
    const now = Date.now();

    // Возвращаем кэшированный результат если актуален и не принудительно обновляем
    if (!forceRefresh && deviceCapabilitiesCache && (now - deviceCapabilitiesTimestamp) < CACHE_DURATION) {
        return deviceCapabilitiesCache;
    }

    // Получаем свежие данные
    const fresh = getDeviceCapabilities();

    // Расширяем логику умными выводами
    const smart = {
        ...fresh,

        // Рекомендуемая стратегия загрузки
        recommendedStrategy: getRecommendedDownloadStrategy(fresh),

        // Совместимость с различными форматами
        formats: {
            webp: supportsFormat('image/webp'),
            avif: supportsFormat('image/avif'),
            heic: fresh.platform.ios && fresh.platform.mobile,
            jpeg: true,
            png: true
        },

        // Тайминги для различных операций
        timings: {
            imageFetchTimeout: fresh.platform.mobile ? 10000 : 5000,
            shareTimeout: fresh.platform.mobile ? 5000 : 3000,
            downloadTimeout: fresh.platform.mobile ? 8000 : 4000
        }
    };

    // Кэшируем результат
    deviceCapabilitiesCache = smart;
    deviceCapabilitiesTimestamp = now;

    console.log('🔍 Smart device capabilities detected:', smart);
    return smart;
}

// 🎯 Рекомендуемая стратегия скачивания на основе возможностей устройства
function getRecommendedDownloadStrategy(caps) {
    // Mobile с Share API - лучший вариант
    if (caps.platform.mobile && caps.api.share && caps.api.canShare) {
        return 'native-share';
    }

    // iOS - специальная обработка
    if (caps.platform.ios) {
        return 'ios-open';
    }

    // Chrome/Edge - blob download
    if (caps.api.blobUrl && caps.features.download) {
        return 'blob-download';
    }

    // Firefox - url download
    if (caps.api.download) {
        return 'url-download';
    }

    // Fallback
    return 'open-tab';
}

// 🔍 Проверка поддержки формата изображений через canvas
function supportsFormat(format) {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        return ctx.getImageData && canvas.toDataURL(format).indexOf(format) > -1;
    } catch (e) {
        return false;
    }
}


// 🔧 Utility Functions
export function generateUUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function sanitizeJsonString(str) {
    if (typeof str !== 'string') return str;

    return str
        .replace(/\\/g, '\\\\')  // Экранируем обратные слэши
        .replace(/"/g, '\\"')    // Экранируем кавычки
        .replace(/\n/g, '\\n')   // Заменяем переносы на \n
        .replace(/\r/g, '\\r')   // Заменяем \r
        .replace(/\t/g, '\\t');  // Заменяем табуляции
}

// Функция чтения файла как DataURL
export function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Функция компрессии изображений
export function maybeCompressImage(dataUrl, maxW = 1024, maxH = 1024, quality = 0.9) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
            let w = img.width, h = img.height;
            const ratio = Math.min(maxW / w, maxH / h, 1);
            w = Math.round(w * ratio);
            h = Math.round(h * ratio);

            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(dataUrl);
        img.src = dataUrl;
    });
}

// 🍃 Простые функции снегопада (упрощенная версия для тестов)
export function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';

    // 🔥 Реалистичные мелкие символы без окантовки
    const snowSymbols = ['·', '•', '◦', '*', '⁃', '.'];
    snowflake.textContent = snowSymbols[Math.floor(Math.random() * snowSymbols.length)];

    // 🔥 Только мелкие размеры для более плотного снегопада
    const sizes = ['extra-small', 'small', 'mini'];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    snowflake.classList.add(randomSize);

    // 🔥 Расширенная позиция по горизонтали для большего покрытия
    snowflake.style.left = Math.random() * 150 + 'vw';

    // 🔥 ГАРАНТИРОВАННАЯ СТАРТОВАЯ ПОЗИЦИЯ ВЫШЕ ДИСПЛЕЯ: от -100vh до -20vh (очень высоко!)
    snowflake.style.top = -(Math.random() * 80 + 20) + 'vh'; // от -100vh до -20vh рандомно

    // 🔥 НЕ ПЛАВНЫЙ СТАРТ: без задержки на старт - мгновенное появление
    snowflake.style.animationDelay = '0s'; // МГНОВЕННО без задержки!

    // 🔥 ПЛАВНОЕ ПОЯВЛЕНИЕ: добавляем начальную невидимость и fade in в CSS
    snowflake.style.opacity = '0';

    return snowflake;
}

export function startSnowfall() {
    const snowfallContainer = document.querySelector('.snowfall');
    if (!snowfallContainer) {
        console.warn('Snowfall container not found');
        return;
    }

    // 🔥 БОЛЬШЕ СНЕЖИНОК для плотности
    const maxSnowflakes = 900;
    for (let i = 0; i < maxSnowflakes; i++) {
        const snowflake = createSnowflake();
        snowfallContainer.appendChild(snowflake);
    }

    console.log(`❄️ Rich snowfall started - ${maxSnowflakes} snowflakes from above`);

    // 🔥 Периодическая поддержка непрерывности
    setInterval(() => {
        if (snowfallContainer.children.length < maxSnowflakes) {
            const snowflake = createSnowflake();
            snowfallContainer.appendChild(snowflake);
        }
    }, 1400); // каждые 2 секунды добавляем если нужно
}

export function stopSnowfall() {
    const snowfallContainer = document.querySelector('.snowfall');
    if (!snowfallContainer) return;

    // Очищаем все снежинки
    snowfallContainer.innerHTML = '';
    console.log('❄️ Snowfall stopped - all snowflakes removed');
}

console.log('🎯 Utils module loaded successfully');

// 💰 BALANCE MANAGEMENT - Синхронизация баланса кредитов
export function updateUserBalance(newBalance) {
    console.log(`💰 updateUserBalance called with: ${newBalance}`);

    try {
        // 1. Обновляем appState
        if (window.appState) {
            window.appState.userCredits = newBalance;
            console.log(`✅ appState.userCredits updated to: ${newBalance}`);
        }

        // 2. Добавляем в историю баланса
        if (window.appState && window.appState.balanceHistory) {
            const entry = {
                balance: newBalance,
                timestamp: Date.now(),
                reason: 'generation_complete'
            };
            window.appState.balanceHistory.push(entry);
            window.appState.saveBalanceHistory();
            console.log(`📊 Balance history entry added: ${entry.balance} credits`);
        }

        // 3. Обновляем UI через существующую функцию из navigation-manager
        if (window.updateUserBalanceDisplay) {
            window.updateUserBalanceDisplay(newBalance);
            console.log(`🔄 UI balance display updated`);
        } else {
            console.warn('⚠️ updateUserBalanceDisplay function not available');
        }

    } catch (error) {
        console.error('❌ Error in updateUserBalance:', error);
    }
}

// Делаем функцию глобальной для совместимости с parallel-generation.js
window.updateUserBalance = updateUserBalance;

console.log('💰 Balance management initialized');
