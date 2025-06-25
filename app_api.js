// App configuration - ЗАМЕНИТЕ НА ВАШ BOT TOKEN!
const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE'; // ⚠️ ЗАМЕНИТЕ НА ВАШ ТОКЕН!
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

// App state
let tg = window.Telegram?.WebApp;
let selectedStyle = 'realistic';
let isGenerating = false;
let isTelegramApp = false;
let currentTheme = 'light';
let userId = null;
let generationHistory = [];
let currentGenerationId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 App loaded');
    loadHistory();
    initTelegramApp();
    initEventListeners();
});

function initTelegramApp() {
    console.log('🔍 Инициализация Telegram WebApp...');

    if (typeof window.Telegram === 'undefined' || !window.Telegram.WebApp) {
        console.log('⚠️ Telegram WebApp недоступен');
        showStatus('⚠️ Откройте через Telegram для полной функциональности', 'info');
        return;
    }

    tg = window.Telegram.WebApp;
    console.log('✅ Telegram WebApp найден');

    try {
        tg.ready();
        tg.expand();
        isTelegramApp = true;

        // Get user data
        if (tg.initDataUnsafe?.user) {
            userId = tg.initDataUnsafe.user.id;
            console.log('👤 Пользователь:', tg.initDataUnsafe.user.first_name);
            console.log('🆔 User ID:', userId);
        }

        // Setup main button
        if (tg.MainButton) {
            tg.MainButton.setText('✨ Создать изображение');
            tg.MainButton.onClick(generateImage);
            tg.MainButton.show();
            console.log('✅ MainButton настроена');
        }

        showStatus('📱 Подключено к Telegram', 'success');

    } catch (error) {
        console.error('❌ Ошибка инициализации:', error);
        showStatus('⚠️ Ошибка подключения к Telegram', 'error');
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

async function generateImage() {
    if (isGenerating) return;

    const prompt = document.getElementById('prompt').value.trim();
    const quality = document.getElementById('quality').value;

    console.log('🚀 Начало генерации');
    console.log('📝 Промпт:', prompt);
    console.log('🎨 Стиль:', selectedStyle);
    console.log('⚙️ Качество:', quality);

    // Validation
    if (!prompt) {
        showStatus('❌ Пожалуйста, опишите изображение', 'error');
        if (tg?.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('error');
        }
        return;
    }

    if (prompt.length < 5) {
        showStatus('❌ Описание слишком короткое (минимум 5 символов)', 'error');
        return;
    }

    // Check bot token
    if (BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
        showStatus('❌ Необходимо настроить BOT_TOKEN в коде', 'error');
        return;
    }

    isGenerating = true;
    currentGenerationId = Date.now();

    // Add to history immediately
    const historyItem = {
        id: currentGenerationId,
        prompt: prompt,
        style: selectedStyle,
        quality: quality,
        timestamp: new Date().toISOString(),
        status: 'pending',
        result: null
    };

    generationHistory.unshift(historyItem);
    saveHistory();

    showGeneratingScreen();

    try {
        await sendGenerationRequest(prompt, selectedStyle, quality);

        // Start polling for result
        startResultPolling(currentGenerationId);

    } catch (error) {
        console.error('❌ Ошибка отправки запроса:', error);
        showStatus('❌ Ошибка отправки запроса: ' + error.message, 'error');
        updateHistoryItem(currentGenerationId, 'error', null, error.message);
        isGenerating = false;
        showMain();
    }
}

async function sendGenerationRequest(prompt, style, quality) {
    const requestData = {
        action: 'generate_image',
        prompt: prompt,
        style: style,
        quality: quality,
        user_id: userId,
        user_name: tg?.initDataUnsafe?.user?.first_name || 'Guest',
        timestamp: new Date().toISOString(),
        generation_id: currentGenerationId
    };

    // Создаем сообщение для отправки боту
    const message = `🎨 WEB_APP_REQUEST
${JSON.stringify(requestData, null, 2)}`;

    console.log('📤 Отправляем запрос:', message);

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: userId,
            text: message,
            parse_mode: 'HTML'
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP ${response.status}: ${errorData.description || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('✅ Запрос отправлен успешно:', result);

    return result;
}

function startResultPolling(generationId) {
    let attempts = 0;
    const maxAttempts = 60; // 5 минут максимум

    const pollInterval = setInterval(() => {
        attempts++;

        // Update progress
        const progress = Math.min((attempts / maxAttempts) * 100, 95);
        updateProgress(progress, `Генерируем... (${attempts}/${maxAttempts})`);

        // Check for result in history (симуляция - в реальности результат придет от бота)
        const historyItem = generationHistory.find(item => item.id === generationId);

        if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
            updateHistoryItem(generationId, 'timeout', null, 'Превышено время ожидания');
            showStatus('⏰ Превышено время ожидания. Проверьте результат позже.', 'error');
            isGenerating = false;
            showMain();
            return;
        }

        // Симуляция получения результата (в реальности это будет приходить от бота)
        if (attempts === 10) { // Симуляция через 10 секунд
            clearInterval(pollInterval);
            simulateResult(generationId);
        }

    }, 5000); // Проверяем каждые 5 секунд
}

function simulateResult(generationId) {
    // Это симуляция - в реальности результат будет приходить от Make/бота
    const mockImageUrl = 'https://picsum.photos/512/512?random=' + generationId;

    updateHistoryItem(generationId, 'success', mockImageUrl);
    showResult(generationId);
    isGenerating = false;
}

function updateProgress(percentage, text) {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.getElementById('progressText');

    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }

    if (progressText) {
        progressText.textContent = text;
    }
}

function updateHistoryItem(id, status, result = null, error = null) {
    const itemIndex = generationHistory.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        generationHistory[itemIndex].status = status;
        if (result) generationHistory[itemIndex].result = result;
        if (error) generationHistory[itemIndex].error = error;
        saveHistory();
    }
}

function showGeneratingScreen() {
    hideAllScreens();
    document.getElementById('generatingScreen').classList.add('active');

    // Update main button
    if (isTelegramApp && tg?.MainButton) {
        tg.MainButton.setText('⏳ Генерируем...');
        tg.MainButton.hide();
    }

    updateProgress(10, 'Отправляем запрос...');
}

function showResult(generationId) {
    const historyItem = generationHistory.find(item => item.id === generationId);
    if (!historyItem) return;

    hideAllScreens();
    document.getElementById('resultScreen').classList.add('active');

    const resultContent = document.getElementById('resultContent');
    resultContent.innerHTML = `
        <img src="${historyItem.result}" alt="Generated Image" class="result-image" />
        <div class="result-info">
            <h4>📝 Промпт:</h4>
            <p>${historyItem.prompt}</p>
            <h4>🎨 Параметры:</h4>
            <p>Стиль: ${historyItem.style} | Качество: ${historyItem.quality}</p>
            <h4>⏰ Время создания:</h4>
            <p>${new Date(historyItem.timestamp).toLocaleString('ru-RU')}</p>
        </div>
    `;

    // Update main button
    if (isTelegramApp && tg?.MainButton) {
        tg.MainButton.setText('✨ Создать новое');
        tg.MainButton.show();
    }

    if (tg?.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
}

function showHistory() {
    hideAllScreens();
    document.getElementById('historyScreen').classList.add('active');

    const historyContent = document.getElementById('historyContent');

    if (generationHistory.length === 0) {
        historyContent.innerHTML = `
            <div class="empty-history">
                <p>История пуста</p>
                <p>Создайте первое изображение!</p>
            </div>
        `;
    } else {
        historyContent.innerHTML = generationHistory.map(item => `
            <div class="history-item">
                <div class="history-item-header">
                    <span class="history-item-date">${new Date(item.timestamp).toLocaleString('ru-RU')}</span>
                    <span class="history-item-status ${item.status}">${getStatusText(item.status)}</span>
                </div>
                <div class="history-item-prompt">${item.prompt}</div>
                <div class="history-item-details">
                    <span>🎨 ${item.style}</span>
                    <span>⚙️ ${item.quality}</span>
                </div>
                ${item.result ? `<img src="${item.result}" alt="Generated" class="history-item-image" />` : ''}
                ${item.error ? `<p style="color: var(--error-text); font-size: 12px; margin-top: 8px;">❌ ${item.error}</p>` : ''}
            </div>
        `).join('');
    }

    // Update main button
    if (isTelegramApp && tg?.MainButton) {
        tg.MainButton.setText('← Назад к генерации');
        tg.MainButton.show();
    }
}

function getStatusText(status) {
    switch (status) {
        case 'pending': return '⏳ Генерируется';
        case 'success': return '✅ Готово';
        case 'error': return '❌ Ошибка';
        case 'timeout': return '⏰ Таймаут';
        default: return status;
    }
}

function showMain() {
    hideAllScreens();
    document.getElementById('mainScreen').classList.add('active');

    // Update main button
    if (isTelegramApp && tg?.MainButton) {
        tg.MainButton.setText('✨ Создать изображение');
        tg.MainButton.show();
    }
}

function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
}

function newGeneration() {
    showMain();
}

function cancelGeneration() {
    if (currentGenerationId) {
        updateHistoryItem(currentGenerationId, 'cancelled', null, 'Отменено пользователем');
    }
    isGenerating = false;
    showMain();
}

function clearHistory() {
    if (confirm('Очистить всю историю генераций?')) {
        generationHistory = [];
        saveHistory();
        showHistory();

        if (tg?.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('medium');
        }
    }
}

function saveHistory() {
    try {
        localStorage.setItem('generationHistory', JSON.stringify(generationHistory));
    } catch (error) {
        console.error('Ошибка сохранения истории:', error);
    }
}

function loadHistory() {
    try {
        const saved = localStorage.getItem('generationHistory');
        if (saved) {
            generationHistory = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Ошибка загрузки истории:', error);
        generationHistory = [];
    }
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

// Global functions for testing and debugging
window.testGeneration = function() {
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
        userId: userId,
        historyCount: generationHistory.length,
        botTokenConfigured: BOT_TOKEN !== 'YOUR_BOT_TOKEN_HERE'
    };
};

window.setBotToken = function(token) {
    // Функция для установки токена через консоль (для тестирования)
    BOT_TOKEN = token;
    console.log('✅ Bot token установлен');
};

console.log('🎯 Команды для отладки:');
console.log('- testGeneration() - тест генерации');
console.log('- getAppInfo() - информация о приложении');
console.log('- setBotToken("your_token") - установить токен');
console.log('⚠️ НЕ ЗАБУДЬТЕ ЗАМЕНИТЬ BOT_TOKEN В КОДЕ!');