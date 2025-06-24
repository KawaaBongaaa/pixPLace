// App state
let tg = window.Telegram?.WebApp;
let selectedStyle = 'realistic';
let isGenerating = false;
let isTelegramApp = false;
let currentTheme = 'light';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 App loaded');
    initTelegramApp();
    initEventListeners();
});

function initTelegramApp() {
    console.log('🔍 Инициализация Telegram WebApp...');

    if (typeof window.Telegram === 'undefined' || !window.Telegram.WebApp) {
        console.log('⚠️ Telegram WebApp недоступен');
        showStatus('⚠️ Откройте через Telegram', 'info');
        return;
    }

    tg = window.Telegram.WebApp;
    console.log('✅ Telegram WebApp найден');

    try {
        tg.ready();
        tg.expand();
        isTelegramApp = true;

        // Setup main button
        if (tg.MainButton) {
            tg.MainButton.setText('✨ Создать изображение');
            tg.MainButton.onClick(generateImage);
            tg.MainButton.show();
            console.log('✅ MainButton настроена');
        }

        showStatus('📱 Подключено к Telegram', 'success');

        // Get user data
        if (tg.initDataUnsafe?.user) {
            console.log('👤 Пользователь:', tg.initDataUnsafe.user.first_name);
        }

    } catch (error) {
        console.error('❌ Ошибка инициализации:', error);
        showStatus('⚠️ Ошибка подключения', 'error');
    }
}

function initEventListeners() {
    // Style buttons
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedStyle = this.dataset.style;

            if (tg?.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('light');
            }

            console.log('🎨 Выбран стиль:', selectedStyle);
        });
    });

    // Auto-resize textarea
    const textarea = document.getElementById('prompt');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
}

function changeTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', currentTheme);

    if (tg?.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }

    console.log('🎨 Тема изменена на:', currentTheme);
}

function generateImage() {
    if (isGenerating) return;

    const prompt = document.getElementById('prompt').value.trim();
    const quality = document.getElementById('quality').value;

    console.log('🚀 Начало генерации');
    console.log('📝 Промпт:', prompt);
    console.log('🎨 Стиль:', selectedStyle);
    console.log('⚙️ Качество:', quality);

    // Validation
    if (!prompt) {
        showStatus('❌ Опишите изображение', 'error');
        if (tg?.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('error');
        }
        return;
    }

    if (prompt.length < 5) {
        showStatus('❌ Описание слишком короткое', 'error');
        return;
    }

    isGenerating = true;
    showLoading();

    // Создаем команду для бота
    const command = `/generate ${prompt} --style=${selectedStyle} --quality=${quality}`;

    console.log('📤 Команда для бота:', command);

    // Отправляем через Telegram WebApp
    if (tg && isTelegramApp) {
        try {
            // Метод 1: sendData
            if (typeof tg.sendData === 'function') {
                const data = {
                    command: 'generate',
                    prompt: prompt,
                    style: selectedStyle,
                    quality: quality,
                    user_id: tg?.initDataUnsafe?.user?.id || null,
                    timestamp: Date.now()
                };

                tg.sendData(JSON.stringify(data));
                console.log('✅ Данные отправлены через sendData');
                showStatus('📤 Запрос отправлен!', 'success');
                return;
            }

            // Метод 2: MainButton с данными
            if (tg.MainButton) {
                tg.MainButton.setText('⏳ Генерируем...');
                tg.MainButton.hide();

                // Сохраняем данные и закрываем
                setTimeout(() => {
                    tg.close();
                }, 1000);

                console.log('✅ Приложение закрыто с данными');
                return;
            }

        } catch (error) {
            console.error('❌ Ошибка отправки:', error);
        }
    }

    // Fallback - показываем команду для копирования
    showFallback(command);
}

function showFallback(command) {
    setTimeout(() => {
        const fallbackDiv = document.createElement('div');
        fallbackDiv.innerHTML = `
            <div class="status info" style="text-align: left;">
                <h3>📋 Скопируйте команду:</h3>
                <div style="background: #f0f0f0; padding: 12px; border-radius: 8px; margin: 8px 0; font-family: monospace; word-break: break-all;">
                    ${command}
                </div>
                <button onclick="copyCommand('${command.replace(/'/g, "\'")}'); this.textContent='✅ Скопировано!'" 
                        style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%;">
                    📋 Копировать команду
                </button>
                <p style="margin-top: 12px; font-size: 14px;">
                    Отправьте эту команду боту @pixPLacebot
                </p>
            </div>
        `;

        document.getElementById('loading').appendChild(fallbackDiv);
    }, 1500);
}

function copyCommand(command) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(command);
    } else {
        const textArea = document.createElement('textarea');
        textArea.value = command;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    if (tg?.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
}

function showLoading() {
    document.getElementById('mainForm').style.display = 'none';
    document.getElementById('loading').classList.add('show');

    if (isTelegramApp && tg?.MainButton) {
        tg.MainButton.setText('⏳ Генерируем...');
        tg.MainButton.hide();
    }
}

function backToForm() {
    document.getElementById('loading').classList.remove('show');
    document.getElementById('mainForm').style.display = 'block';
    isGenerating = false;

    if (isTelegramApp && tg?.MainButton) {
        tg.MainButton.setText('✨ Создать изображение');
        tg.MainButton.show();
    }

    // Clear fallback content
    const fallbacks = document.querySelectorAll('#loading > div:not(.spinner):not(h3):not(p):not(.back-btn)');
    fallbacks.forEach(fb => fb.remove());
}

function showStatus(message, type = 'info') {
    const statusDiv = document.getElementById('status');
    if (statusDiv) {
        statusDiv.querySelector('span').textContent = message;
        statusDiv.className = `status ${type}`;

        if (type === 'success') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 3000);
        }
    }
}

// Global functions for testing
window.testApp = function() {
    document.getElementById('prompt').value = 'красивый закат над морем';
    generateImage();
};

window.getAppInfo = function() {
    return {
        telegramAvailable: !!tg,
        isTelegramApp: isTelegramApp,
        selectedStyle: selectedStyle,
        isGenerating: isGenerating,
        currentTheme: currentTheme,
        userId: tg?.initDataUnsafe?.user?.id || null
    };
};

console.log('🎯 Для тестирования: testApp() или getAppInfo()');