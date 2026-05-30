// telegram-auth.js - Модуль для обработки авторизации через Telegram

// ГЕНЕРИРУЕМ УНИКАЛЬНЫЙ ПАРАМЕТР СЕССИИ ДЛЯ КАЖДОЙ АВТОРИЗАЦИИ
function generateAuthSession() {
    return 'auth_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Функция для обработки авторизации через Telegram
async function handleTelegramLogin() {
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

                // ✅ FIX: Account-switch mismatch detection.
                // If the current Telegram user differs from the stored session, purge stale
                // localStorage data BEFORE the API call so the old user's avatar / balance
                // never appear during the new login sequence.
                try {
                    const storedUser = JSON.parse(localStorage.getItem('telegram_user') || '{}');
                    const storedId = storedUser.id != null ? String(storedUser.id) : null;
                    const currentId = String(user.id);

                    if (storedId && storedId !== currentId) {
                        console.log('🔄 Account switch detected (' + storedId + ' → ' + currentId + '). Clearing stale session...');
                        localStorage.removeItem('telegram_user');
                        localStorage.removeItem('telegram_user_data');
                        localStorage.removeItem('telegram_auth_completed');
                        localStorage.removeItem('telegram_auth_timestamp');
                        localStorage.removeItem('currentBalance');
                        document.documentElement.classList.remove('auth-session-active');
                        // Reset stale credits / avatar in appState so UI shows nothing
                        // while the fresh API response is in-flight
                        if (window.appState && typeof window.appState.updateState === 'function') {
                            window.appState.updateState({
                                user: {
                                    ...window.appState.state.user,
                                    id: null, name: null, photo_url: null, credits: null
                                }
                            });
                        }
                    }
                } catch (e) { /* silent */ }

                // Call backend webhook to get real internal ID
                // Извлекаем hash из initData, так как он нужен бекенду для проверки подписи
                const initDataParams = new URLSearchParams(webApp.initData || '');
                const authHash = initDataParams.get('hash');

                const response = await fetch('https://alv-n8n.pixplace.space/webhook/telegram-auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...user,
                        initData: webApp.initData,
                        hash: authHash,
                        traffic_source: 'webapp/telegram_webapp'
                    })
                });
                const data = await response.json();

                if (data.userId) {
                    // ✅ FIX: Single batched update — fires _notifyListeners exactly ONCE
                    // instead of separate userId / userName / userAvatar / setUser() calls
                    // that each triggered a separate UI render (4-step flicker).
                    if (typeof window.appState !== 'undefined') {
                        const normCredits = data.credits_balance !== undefined ? data.credits_balance : (data.credits !== undefined ? data.credits : data.balance);
                        if (typeof window.appState.setUser === 'function') {
                            window.appState.setUser({
                                id: String(data.userId),
                                name: data.userName || user.first_name,
                                photo_url: data.userPhotoUrl || user.photo_url || null,
                                credits: normCredits !== undefined && normCredits !== null ? Number(normCredits) : undefined,
                                isPremium: data.isPremium !== undefined ? !!data.isPremium : undefined,
                                subscription: data.subscription || null
                            });
                        } else {
                            // Fallback: legacy path
                            window.appState.userId = String(data.userId);
                            window.appState.userName = data.userName || user.first_name;
                            window.appState.userAvatar = data.userPhotoUrl || user.photo_url || null;
                            if (normCredits !== undefined && normCredits !== null) {
                                window.appState.userCredits = Number(normCredits);
                            }
                        }

                        // Save normalized balance in localStorage
                        if (normCredits !== undefined && normCredits !== null) {
                            localStorage.setItem('currentBalance', normCredits.toString());
                        }
                    }

                    // Save session to localStorage
                    const userDataToSave = {
                        ...user,
                        internalUserId: data.userId,
                        first_name: data.userName || user.first_name,
                        photo_url: data.userPhotoUrl || user.photo_url || null
                    };
                    localStorage.setItem('telegram_auth_completed', 'true');
                    localStorage.setItem('telegram_user', JSON.stringify(userDataToSave));
                    localStorage.setItem('telegram_user_data', JSON.stringify(userDataToSave));
                    localStorage.setItem('telegram_auth_timestamp', Date.now().toString());

                    document.documentElement.classList.add('auth-session-active');

                    // 🔥 Fetch fresh profile balance from DB instantly!
                    if (window.appServices && window.appServices.userProfile && data.userId) {
                        console.log('📡 Fetching fresh profile balance for telegram WebApp user:', data.userId);
                        window.appServices.userProfile.fetchProfile(data.userId);
                    }

                    // ✅ Single UI refresh — after ALL state is committed
                    if (typeof window.updateUserMenuInfo === 'function') {
                        window.updateUserMenuInfo();
                    }

                    // Navigate to generation screen
                    if (typeof window.showGeneration === 'function') {
                        window.showGeneration();
                    }

                    return; // Successful WebApp auth
                } else {
                    console.warn('⚠️ WebApp: Backend did not return a valid userId');
                    if (typeof window.showToast === 'function') {
                        window.showToast('error', 'Login failed: Invalid server response');
                    }
                }
            } else {
                console.log('⚠️ WebApp доступен, но данных пользователя нет - продолжаем с инструкциями');
            }
        } catch (error) {
            console.error('❌ Ошибка WebApp авторизации:', error);
            if (typeof window.showToast === 'function') {
                window.showToast('error', 'Login failed: Server unreachable');
            }
        }
    }

    // ЕСЛИ WEBAPP НЕДОСТУПЕН ИЛИ НЕ СРАБОТАЛ - ПОКАЗЫВАЕМ КРАСИВЫЙ МОДАЛЬНЫЙ ДИАЛОГ
    console.log('📱 Показываем инструкции по авторизации в модальном окне');



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

async function completeTelegramAuth(authData) {
    console.log('✅ Completing Telegram auth with data:', authData);

    if (authData.user) {
        try {


            const response = await fetch('https://alv-n8n.pixplace.space/webhook/telegram-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    auth_provider: 'telegram',
                    ...authData.user,
                    traffic_source: 'webapp/telegram_oauth_return'
                })
            });
            const data = await response.json();

            if (data.userId && typeof window.appState !== 'undefined') {
                window.appState.userId = data.userId;
                window.appState.userName = data.userName || authData.user.first_name || authData.user.username;
                window.appState.userAvatar = data.userPhotoUrl || authData.user.photo_url || null;

                // 🔥 ADDED: Sync credits and profile to appState
                const normCredits = data.credits_balance !== undefined ? data.credits_balance : (data.credits !== undefined ? data.credits : data.balance);
                if (typeof window.appState.setUser === 'function') {
                    window.appState.setUser({
                        credits: normCredits !== undefined && normCredits !== null ? Number(normCredits) : undefined,
                        isPremium: data.isPremium !== undefined ? !!data.isPremium : undefined,
                        subscription: data.subscription || null
                    });
                }

                // Save normalized balance in localStorage
                if (normCredits !== undefined && normCredits !== null) {
                    localStorage.setItem('currentBalance', normCredits.toString());
                }

                // 🔥 Fetch fresh profile balance from DB instantly!
                if (window.appServices && window.appServices.userProfile) {
                    console.log('📡 Fetching fresh profile balance for Telegram oauth return user:', data.userId);
                    window.appServices.userProfile.fetchProfile(data.userId);
                }

                // Update UI immediately 
                if (typeof window.updateUserMenuInfo === 'function') {
                    window.updateUserMenuInfo();
                }
            } else {
                console.warn('⚠️ Backend did not return a valid userId');
                if (typeof window.showToast === 'function') {
                    window.showToast('error', 'Login failed: Invalid server response');
                }
                return; // Stop execution if backend failed to provide internal ID
            }
        } catch (err) {
            console.error('❌ Telegram auth webhook failed:', err);
            if (typeof window.showToast === 'function') {
                window.showToast('error', 'Login failed: Server unreachable');
            }
            return; // Stop execution if server unreachable
        }
    }

    // Сохраняем авторизационные данные
    localStorage.setItem('telegram_auth_completed', 'true');
    localStorage.setItem('telegram_auth_token', authData.token);
    localStorage.setItem('telegram_auth_timestamp', Date.now().toString());

    document.documentElement.classList.add('auth-session-active');

    if (authData.user) {
        // Добавляем внутренний ID, если он был получен (из appState, куда мы его только что записали)
        const userToSave = { ...authData.user };
        if (window.appState && window.appState.userId) {
            userToSave.internalUserId = window.appState.userId;
        }
        localStorage.setItem('telegram_user', JSON.stringify(userToSave));
        localStorage.setItem('telegram_user_data', JSON.stringify(userToSave));
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



    // Очищаем сессионные данные
    localStorage.removeItem('telegram_auth_session');
    localStorage.removeItem('telegram_auth_timestamp');

    console.log('🎉 Telegram authorization completed successfully');
}

// Export functions globally
window.handleTelegramLogin = handleTelegramLogin;
