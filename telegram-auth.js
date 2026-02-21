// telegram-auth.js - Модуль для обработки авторизации через Telegram

console.log('📱 Telegram Auth module initialized');

// ГЕНЕРИРУЕМ УНИКАЛЬНЫЙ ПАРАМЕТР СЕССИИ ДЛЯ КАЖДОЙ АВТОРИЗАЦИИ
function generateAuthSession() {
    return 'auth_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Функция для обработки авторизации через Telegram
function handleTelegramLogin() {
    console.log('🔔 Handle Telegram login called');

    // СНАЧАЛА ПРОВЕРЯЕМ - ДОСТУПЕН ЛИ TELEGRAM WEB APP API?
    if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
        console.log('✅ Официальный Telegram WebApp API доступен - пытаемся автоматическую авторизацию');

        try {
            // Используем Telegram WebApp авторизацию
            const webApp = window.Telegram.WebApp;

            // Проверяем наличие данных пользователя
            if (webApp.initDataUnsafe && webApp.initDataUnsafe.user) {
                const user = webApp.initDataUnsafe.user;
                console.log('👤 Автоматическая авторизация через WebApp:', {
                    id: user.id,
                    first_name: user.first_name,
                    username: user.username
                });

                // Сохраняем данные пользователя
                if (typeof window.appState !== 'undefined') {
                    window.appState.userId = user.id;
                    window.appState.userName = user.first_name;
                }

                // Переходим на главный экран
                if (typeof window.showGeneration === 'function') {
                    window.showGeneration();
                }

                // Показываем приветствие
                setTimeout(() => {
                    if (typeof window.showToast === 'function') {
                        window.showToast('success', `Добро пожаловать, ${user.first_name}! 🎉`);
                    }
                }, 1000);

                return; // Успешная WebApp авторизация
            } else {
                console.log('⚠️ WebApp доступен, но данных пользователя нет - продолжаем с инструкциями');
            }
        } catch (error) {
            console.error('❌ Ошибка WebApp авторизации:', error);
        }
    }

    // ЕСЛИ WEBAPP НЕДОСТУПЕН ИЛИ НЕ СРАБОТАЛ - ПОКАЗЫВАЕМ КРАСИВЫЙ МОДАЛЬНЫЙ ДИАЛОГ
    console.log('📱 Показываем инструкции по авторизации в модальном окне');

    if (typeof window.showToast === 'function') {
        window.showToast('info', 'Открываем инструкции по авторизации...');
    }

    // Load beautiful modal dialog instead of alert()
    setTimeout(async () => {
        await loadTelegramAuthModal();
    }, 500);
}

// Функция для прослушивания возврата авторизации
function listenForAuthReturn(sessionId) {
    console.log('👂 Listening for auth return with session:', sessionId);

    // Проверяем наличие авторизационных данных каждые 2 секунды
    const authCheckInterval = setInterval(() => {
        try {
            // Проверяем наличие параметров авторизации в URL
            const urlParams = new URLSearchParams(window.location.search);
            const authToken = urlParams.get('telegram_auth');
            const authSession = urlParams.get('session');
            const userData = urlParams.get('user');

            if (authToken && authSession === sessionId) {
                console.log('🎉 Auth token received, processing...');

                // Парсим данные пользователя
                let userInfo = null;
                if (userData) {
                    try {
                        userInfo = JSON.parse(decodeURIComponent(userData));
                    } catch (e) {
                        console.error('❌ Ошибка парсинга пользовательских данных:', e);
                    }
                }

                // Очищаем интервал проверки
                clearInterval(authCheckInterval);

                // Выполняем успешную авторизацию
                completeTelegramAuth({
                    token: authToken,
                    sessionId: authSession,
                    user: userInfo
                });

                // Очищаем URL параметры
                const cleanUrl = window.location.pathname + window.location.hash;
                window.history.replaceState({}, document.title, cleanUrl);

                return;
            }

            // Проверяем не истекло ли время ожидания (5 минут)
            const startTimeStr = localStorage.getItem('telegram_auth_timestamp');
            if (startTimeStr) {
                const startTime = parseInt(startTimeStr);
                const timeElapsed = Date.now() - startTime;

                if (timeElapsed > 5 * 60 * 1000) { // 5 minutes timeout
                    console.warn('⏰ Auth timeout reached');
                    clearInterval(authCheckInterval);

                    if (typeof window.showToast === 'function') {
                        window.showToast('warning', 'Время ожидания авторизации истекло');
                    }

                    // Очищаем сессию
                    localStorage.removeItem('telegram_auth_session');
                    localStorage.removeItem('telegram_auth_timestamp');
                }
            }

        } catch (error) {
            console.error('❌ Ошибка проверки авторизации:', error);
            clearInterval(authCheckInterval);
        }
    }, 2000); // Каждые 2 секунды

    // Ограничиваем время ожидания - максимум 3 минуты
    setTimeout(() => {
        clearInterval(authCheckInterval);
        console.log('⏳ Auth listening timeout');
    }, 3 * 60 * 1000); // 3 минуты климакс
}

function completeTelegramAuth(authData) {
    console.log('✅ Completing Telegram auth with data:', authData);

    // Сохраняем авторизационные данные
    localStorage.setItem('telegram_auth_completed', 'true');
    localStorage.setItem('telegram_auth_token', authData.token);
    localStorage.setItem('telegram_auth_timestamp', Date.now().toString());

    if (authData.user) {
        localStorage.setItem('telegram_user_data', JSON.stringify(authData.user));
    }

    // Сохраняем в appState если доступен
    if (typeof window.appState !== 'undefined') {
        if (authData.user) {
            window.appState.userId = authData.user.id;
            window.appState.userName = authData.user.first_name || authData.user.username;
        }
    }

    // Удаляем экран авторизации
    if (typeof window.ScreenManager !== 'undefined' && window.ScreenManager.removeAuthScreen) {
        window.ScreenManager.removeAuthScreen();
        console.log('✅ Auth screen removed after successful login');
    }

    // Переходим на главный экран
    if (typeof window.showGeneration === 'function') {
        window.showGeneration();
    }

    // Показываем приветственное сообщение
    setTimeout(() => {
        if (typeof window.showToast === 'function') {
            let userName = 'Пользователь';
            if (authData.user) {
                userName = authData.user.first_name || authData.user.first_name || 'Пользователь';
            }
            window.showToast('success', `Добро пожаловать, ${userName}! 🎉`);
        }
    }, 1000);

    // Очищаем сессионные данные
    localStorage.removeItem('telegram_auth_session');
    localStorage.removeItem('telegram_auth_timestamp');

    console.log('🎉 Telegram authorization completed successfully');
}

// Function to load Telegram auth modal from HTML file
async function loadTelegramAuthModal() {
    console.log('📋 Loading Telegram auth modal from HTML file');

    // Check if modal already exists
    if (document.getElementById('telegramAuthInstructionsModal')) {
        console.log('✅ Telegram auth modal already loaded');
        return;
    }

    try {
        // Load HTML file
        console.log('📡 Fetching telegram-auth-modal.html...');
        const response = await fetch('telegram-auth-modal.html');
        console.log('📡 Fetch response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const htmlContent = await response.text();
        console.log('📄 Telegram auth modal HTML loaded successfully, length:', htmlContent.length);

        // Insert HTML into body
        document.body.insertAdjacentHTML('beforeend', htmlContent);
        console.log('✅ Telegram auth modal HTML inserted into DOM');

        // Check if modal was inserted
        const insertedModal = document.getElementById('telegramAuthInstructionsModal');
        if (insertedModal) {
            console.log('✅ Modal element found in DOM');
        } else {
            console.error('❌ Modal element NOT found in DOM after insertion');
        }

        // Update translations if dictionary manager is available
        if (typeof window.dictionaryManager !== 'undefined' && window.dictionaryManager.updateTranslations) {
            setTimeout(() => {
                window.dictionaryManager.updateTranslations();
                console.log('✅ Translations updated for Telegram auth modal');
            }, 100);
        }

        // Animate appearance
        const modal = document.getElementById('telegramAuthInstructionsModal');
        if (modal) {
            setTimeout(() => {
                modal.classList.add('animate-in', 'fade-in', 'zoom-in-95', 'duration-300');
                console.log('✅ Animation classes added to modal');
            }, 10);
        }

        console.log('📋 Telegram auth modal shown successfully');

    } catch (error) {
        console.error('❌ Failed to load Telegram auth modal:', error);
        // Fallback to simple alert if modal loading fails
        alert('Open Telegram bot @pixPLaceBot and send /start command to authorize');
    }
}

// Function to open Telegram bot
function openTelegramBot() {
    console.log('📱 Opening Telegram bot with app_auth_button start parameter');

    try {
        window.open('https://t.me/pixPLaceBot?start=app_auth_button', '_blank', 'noopener,noreferrer');
        console.log('✅ Telegram bot opened successfully');

        // Close modal
        closeTelegramAuthModal();

    } catch (error) {
        console.error('❌ Failed to open Telegram bot:', error);
        if (typeof window.showToast === 'function') {
            window.showToast('error', 'Failed to open Telegram. Please try manually.');
        }
    }
}

// Function to close modal
function closeTelegramAuthModal() {
    const modal = document.getElementById('telegramAuthInstructionsModal');
    if (modal) {
        modal.classList.add('animate-out', 'fade-out', 'zoom-out-95', 'duration-200');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 200);
        console.log('📋 Telegram auth modal closed');
    }
}

// Export functions globally
window.handleTelegramLogin = handleTelegramLogin;
window.loadTelegramAuthModal = loadTelegramAuthModal;
window.openTelegramBot = openTelegramBot;
window.closeTelegramAuthModal = closeTelegramAuthModal;

console.log('✅ Telegram Auth functions registered globally');
