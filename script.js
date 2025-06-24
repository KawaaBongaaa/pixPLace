// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;

// Глобальные переменные
let selectedStyle = 'realistic';
let currentUser = null;
let generationHistory = [];

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initTelegramApp();
    initEventListeners();
    loadHistory();
});

// Инициализация Telegram Web App
function initTelegramApp() {
    // Расширяем приложение на весь экран
    tg.expand();

    // Получаем данные пользователя
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        currentUser = tg.initDataUnsafe.user;
        console.log('Пользователь авторизован:', currentUser.first_name);
    }

    // Настраиваем главную кнопку
    tg.MainButton.setText('✨ Генерировать изображение');
    tg.MainButton.onClick(handleGenerate);

    // Показываем кнопку назад для навигации
    tg.BackButton.onClick(goBackToMain);

    // Уведомляем Telegram что приложение готово
    tg.ready();
}

// Инициализация обработчиков событий
function initEventListeners() {
    // Обработчики для кнопок стилей
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Убираем активный класс со всех кнопок
            document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
            // Добавляем активный класс к выбранной кнопке
            this.classList.add('active');
            selectedStyle = this.dataset.style;

            // Тактильная обратная связь
            if (tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('light');
            }
        });
    });

    // Кнопка генерации
    document.getElementById('generateBtn').addEventListener('click', handleGenerate);

    // Кнопка истории
    document.getElementById('historyBtn').addEventListener('click', showHistory);

    // Кнопки в секции результатов
    document.getElementById('saveBtn').addEventListener('click', saveImage);
    document.getElementById('shareBtn').addEventListener('click', shareImage);
    document.getElementById('newImageBtn').addEventListener('click', goBackToMain);

    // Кнопка назад из истории
    document.getElementById('backFromHistory').addEventListener('click', goBackToMain);

    // Автоматическое изменение высоты текстовой области
    document.getElementById('prompt').addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
}

// Обработчик генерации изображения
async function handleGenerate() {
    const prompt = document.getElementById('prompt').value.trim();
    const quality = document.getElementById('quality').value;

    // Проверяем валидность данных
    if (!prompt) {
        showAlert('Пожалуйста, опишите какое изображение вы хотите создать');
        return;
    }

    if (prompt.length < 10) {
        showAlert('Описание слишком короткое. Добавьте больше деталей (минимум 10 символов)');
        return;
    }

    // Показываем экран загрузки
    showLoading();

    // Создаем объект с данными для генерации
    const generationData = {
        action: 'generate_image',
        prompt: prompt,
        style: selectedStyle,
        quality: quality,
        user_id: currentUser ? currentUser.id : null,
        user_name: currentUser ? currentUser.first_name : 'Гость',
        timestamp: new Date().toISOString()
    };

    try {
        // Отправляем данные в ваш бот через Make
        await sendToBot(generationData);

        // Показываем экран ожидания результата
        showWaitingForResult();

    } catch (error) {
        console.error('Ошибка при генерации:', error);
        showError('Произошла ошибка при генерации изображения. Попробуйте еще раз.');
    }
}

// Отправка данных в бот через Telegram Web App API
function sendToBot(data) {
    return new Promise((resolve, reject) => {
        try {
            // Отправляем данные обратно в бота
            tg.sendData(JSON.stringify(data));
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

// Показать экран загрузки
function showLoading() {
    hideAllSections();
    document.getElementById('loadingSection').style.display = 'block';

    // Обновляем главную кнопку
    tg.MainButton.setText('Генерируем...');
    tg.MainButton.hide();

    // Блокируем кнопку генерации
    document.getElementById('generateBtn').disabled = true;
    document.getElementById('generateBtn').textContent = '⏳ Генерируем...';
}

// Показать экран ожидания результата
function showWaitingForResult() {
    const loadingSection = document.getElementById('loadingSection');
    loadingSection.innerHTML = `
        <div class="loading-spinner"></div>
        <p>🎨 Создаем ваше изображение...</p>
        <p class="loading-tip">💡 Обычно это занимает 30-60 секунд</p>
        <p class="loading-tip">Результат придет в чат с ботом</p>
        <button onclick="goBackToMain()" class="back-btn" style="margin-top: 20px;">
            ← Создать новое изображение
        </button>
    `;
}

// Показать результат (эта функция будет вызвана когда бот пришлет результат)
function showResult(imageUrl, originalPrompt) {
    hideAllSections();

    const resultSection = document.getElementById('resultSection');
    const imageContainer = document.getElementById('imageContainer');

    // Добавляем изображение
    imageContainer.innerHTML = `
        <img src="${imageUrl}" alt="Сгенерированное изображение" />
        <p style="margin-top: 10px; font-size: 14px; color: var(--tg-theme-hint-color, #666);">
            "${originalPrompt}"
        </p>
    `;

    resultSection.style.display = 'block';

    // Сохраняем в историю
    saveToHistory({
        imageUrl: imageUrl,
        prompt: originalPrompt,
        style: selectedStyle,
        timestamp: Date.now()
    });

    // Обновляем главную кнопку
    tg.MainButton.setText('🔄 Создать новое');
    tg.MainButton.show();
    tg.MainButton.onClick(goBackToMain);

    // Тактильная обратная связь об успехе
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
}

// Показать историю
function showHistory() {
    hideAllSections();
    document.getElementById('historySection').style.display = 'block';

    const historyGrid = document.getElementById('historyGrid');

    if (generationHistory.length === 0) {
        historyGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--tg-theme-hint-color, #666);">
                <p>📱 История пока пуста</p>
                <p style="font-size: 14px; margin-top: 8px;">Создайте первое изображение!</p>
            </div>
        `;
    } else {
        historyGrid.innerHTML = generationHistory.map((item, index) => `
            <div class="history-item" onclick="viewHistoryItem(${index})">
                <img src="${item.imageUrl}" alt="История ${index + 1}" />
            </div>
        `).join('');
    }

    // Показываем кнопку назад
    tg.BackButton.show();

    // Обновляем главную кнопку
    tg.MainButton.setText('← Назад к генерации');
    tg.MainButton.show();
    tg.MainButton.onClick(goBackToMain);
}

// Просмотр элемента истории
function viewHistoryItem(index) {
    const item = generationHistory[index];
    if (item) {
        showResult(item.imageUrl, item.prompt);
    }
}

// Сохранение изображения
function saveImage() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }

    showAlert('💾 Изображение сохранено в галерею!');

    // Здесь можно добавить логику сохранения
    // Например, отправить команду боту для сохранения
    const saveData = {
        action: 'save_image',
        user_id: currentUser ? currentUser.id : null
    };

    tg.sendData(JSON.stringify(saveData));
}

// Поделиться изображением
function shareImage() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }

    const shareData = {
        action: 'share_image',
        user_id: currentUser ? currentUser.id : null
    };

    tg.sendData(JSON.stringify(shareData));
    showAlert('📤 Изображение отправлено в чат!');
}

// Вернуться к главному экрану
function goBackToMain() {
    hideAllSections();
    document.querySelector('.main-content').style.display = 'block';

    // Сбрасываем кнопку генерации
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.disabled = false;
    generateBtn.textContent = '✨ Создать изображение';

    // Настраиваем главную кнопку
    tg.MainButton.setText('✨ Генерировать');
    tg.MainButton.show();
    tg.MainButton.onClick(handleGenerate);

    // Скрываем кнопку назад
    tg.BackButton.hide();
}

// Скрыть все секции
function hideAllSections() {
    document.getElementById('loadingSection').style.display = 'none';
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('historySection').style.display = 'none';
    document.querySelector('.main-content').style.display = 'none';
}

// Показать главную секцию
function showMainSection() {
    hideAllSections();
    document.querySelector('.main-content').style.display = 'block';
}

// Показать ошибку
function showError(message) {
    hideAllSections();
    showMainSection();

    const generateBtn = document.getElementById('generateBtn');
    generateBtn.disabled = false;
    generateBtn.textContent = '✨ Создать изображение';

    tg.MainButton.setText('✨ Генерировать');
    tg.MainButton.show();

    showAlert('❌ ' + message);

    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('error');
    }
}

// Показать уведомление
function showAlert(message) {
    if (tg.showAlert) {
        tg.showAlert(message);
    } else {
        alert(message);
    }
}

// Сохранение в историю
function saveToHistory(item) {
    generationHistory.unshift(item); // Добавляем в начало массива

    // Ограничиваем историю 20 элементами
    if (generationHistory.length > 20) {
        generationHistory = generationHistory.slice(0, 20);
    }

    // Сохраняем в localStorage
    try {
        localStorage.setItem('generation_history', JSON.stringify(generationHistory));
    } catch (error) {
        console.warn('Не удалось сохранить историю:', error);
    }
}

// Загрузка истории
function loadHistory() {
    try {
        const saved = localStorage.getItem('generation_history');
        if (saved) {
            generationHistory = JSON.parse(saved);
        }
    } catch (error) {
        console.warn('Не удалось загрузить историю:', error);
        generationHistory = [];
    }
}

// Функция для получения результата от бота (вызывается извне)
window.showGenerationResult = function(imageUrl, prompt) {
    showResult(imageUrl, prompt);
};

// Обработка ошибок от бота
window.showGenerationError = function(error) {
    showError(error || 'Произошла ошибка при генерации');
};

// Обработка закрытия приложения
window.addEventListener('beforeunload', function() {
    // Уведомляем бота о закрытии приложения
    const closeData = {
        action: 'app_closed',
        user_id: currentUser ? currentUser.id : null
    };

    try {
        tg.sendData(JSON.stringify(closeData));
    } catch (error) {
        console.warn('Не удалось отправить данные о закрытии:', error);
    }
});

// Дополнительные утилиты для работы с ботом
window.telegramMiniApp = {
    // Показать результат генерации
    showResult: function(imageUrl, prompt) {
        showResult(imageUrl, prompt);
    },

    // Показать ошибку
    showError: function(error) {
        showError(error);
    },

    // Получить текущие настройки пользователя
    getCurrentSettings: function() {
        return {
            style: selectedStyle,
            quality: document.getElementById('quality').value,
            prompt: document.getElementById('prompt').value
        };
    },

    // Установить промпт извне (например, из предложенных шаблонов)
    setPrompt: function(prompt) {
        document.getElementById('prompt').value = prompt;
    }
};

console.log('🚀 Telegram Mini App инициализировано успешно!');