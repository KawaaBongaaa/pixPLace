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

// Функция для получения текста статуса
export function getStatusText(status) {
    switch (status) {
        case 'processing': return '⏳';
        case 'success': return '✅';
        case 'error': return '❌';
        default: return status;
    }
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
