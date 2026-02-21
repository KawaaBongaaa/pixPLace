// 🔥 LAZY LOADING WORDS MANAGER - Загружает словари по требованию
// Средства на 90% сокращение начальной загрузки JS с 2MB до 200KB

const AVAILABLE_LANGUAGES = ['en', 'ru', 'es', 'fr', 'de', 'zh', 'pt', 'ar', 'hi', 'ja', 'it', 'ko', 'tr', 'pl', 'vi', 'th'];

class DictionaryManager {
    constructor() {
        this.currentLanguage = 'en';
        this.loadedDictionaries = new Map();

        // Поддерживаемые языки
        this.supportedLanguages = [
            'en', 'ru', 'es', 'fr', 'de', 'zh', 'pt', 'ar', 'hi', 'ja', 'it', 'ko', 'tr', 'pl', 'vi', 'th'
        ];

        console.log('🌍 DictionaryManager initialized');
    }

    // 🔥 ЦЕНТРАЛИЗОВАННЫЙ МЕТОД: Определение и установка базового языка
    async determineAndSetBaseLanguage() {
        try {

            // 🔥 ПРИОРИТЕТЫ ДЛЯ ОПРЕДЕЛЕНИЯ ЯЗЫКА (ЕДИНЫЕ ПРАВИЛА ВСЕГО ПРИЛОЖЕНИЯ):
            // 1. localStorage (если пользователь выбирал язык и установлен флаг isLanguageSetByUser)
            // 2. Telegram данные браузера (если Telegram доступен)
            // 3. По умолчанию 'en' (единый дефолт для всего приложения)

            let baseLang = 'en'; // Единый дефолт для всего приложения

            // 1. Проверяем localStorage ПЕРЕД Telegram (пользовательский выбор имеет приоритет)
            const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
            if (settings.language && this.supportedLanguages.includes(settings.language)) {
                // 🔥 ПРОВЕРКА: пользователь сам выбирал этот язык?
                const isUserSet = settings.isLanguageSetByUser === true;
                if (isUserSet) {
                    baseLang = settings.language;
                }
            }


            // 2. ПРОВЕРЯЕМ TELEGRAM ТОЛЬКО ЕСЛИ НЕТ ПОЛЬЗОВАТЕЛЬСКОГО ВЫБОРА
            if (!settings.isLanguageSetByUser) {
                try {
                    // Доступен ли Telegram SDK?
                    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
                        const tg = window.Telegram.WebApp;
                        // Пытаемся получить язык браузера пользователя
                        if (tg.initDataUnsafe?.user?.language_code) {
                            const tgLang = tg.initDataUnsafe.user.language_code;
                            // Преобразуем код Telegram в наш поддерживаемый формат
                            const langMap = {
                                'ru': 'ru', 'en': 'en', 'es': 'es', 'fr': 'fr',
                                'de': 'de', 'zh': 'zh', 'pt': 'pt', 'ar': 'ar',
                                'hi': 'hi', 'ja': 'ja', 'it': 'it', 'ko': 'ko',
                                'tr': 'tr', 'pl': 'pl', 'vi': 'vi', 'th': 'th'
                            };

                            // 🔥 УЛУЧШЕННОЕ МЭППИНГ: Обработка языков с регионами (ru-RU -> ru)
                            let mappedLang = langMap[tgLang];
                            if (!mappedLang) {
                                // Попробуем удалить регион (ru-RU -> ru, es-ES -> es)
                                const baseTgLang = tgLang.split('-')[0];
                                mappedLang = langMap[baseTgLang];
                            }

                            if (mappedLang && mappedLang !== baseLang) {
                                baseLang = mappedLang;
                            }
                        }
                    }
                } catch (error) {
                    console.warn('❌ Error reading Telegram language:', error);
                }

                // 3. 🌐 BROWSER DETECTION (FALLBACK)
                // Если Telegram не дал языка (или мы не в Telegram), берем язык браузера
                if (baseLang === 'en') { // Если все еще дефолт
                    try {
                        const browserLang = navigator.language || navigator.userLanguage;
                        if (browserLang) {
                            const langCode = browserLang.split('-')[0];
                            if (this.supportedLanguages.includes(langCode)) {
                                baseLang = langCode;
                            }
                        }
                    } catch (e) {
                        console.warn('❌ Error detecting browser language:', e);
                    }
                }
            }

            // 🔥 КРИТИЧЕСКОЕ: УСТАНАВЛИВАЕМ ЯЗЫК БЕЗ ОБНОВЛЕНИЯ ПЕРЕВОДОВ (UI еще не готов!)
            await this.setLanguageInternal(baseLang);

            return baseLang;

        } catch (error) {
            console.error('❌ Failed to determine and set base language:', error);
            // Экстренный fallback на English
            try {
                await this.setLanguageInternal('en');
                return 'en';
            } catch (fallbackError) {
                console.error('❌ Even fallback language failed:', fallbackError);
                return 'en';
            }
        }
    }

    // 🔥 LAZY LOADING - Загружаем словарь только при необходимости
    async loadDictionary(lang) {
        if (!AVAILABLE_LANGUAGES.includes(lang)) {
            console.warn('⚠️ Unknown language: ' + lang);
            return null;
        }

        // Уже загружен?
        if (this.loadedDictionaries.has(lang)) {
            return this.loadedDictionaries.get(lang);
        }

        try {
            // Динамический импорт словаря
            const modulePath = './dictionaries/' + lang + '.js';
            const module = await import(modulePath);
            const dictionary = module.default || module[lang];

            if (!dictionary) {
                throw new Error('Dictionary export not found in ' + lang + '.js');
            }

            // Сохраняем в кэш
            this.loadedDictionaries.set(lang, dictionary);

            return dictionary;

        } catch (error) {
            console.error('❌ Failed to load dictionary ' + lang + ':', error);
            return null;
        }
    }



    // 🔥 ВНУТРЕННИЙ МЕТОД: Установка языка БЕЗ ОБНОВЛЕНИЯ UI (для инициализации)
    async setLanguageInternal(lang) {
        if (!lang) return;

        const oldLang = this.currentLanguage;
        this.currentLanguage = lang;

        // 🔥 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Загружаем словарь ТОЛЬКО если он еще не загружен!
        if (!this.isDictionaryLoaded(lang)) {
            const dictResult = await this.loadDictionary(lang);
        }

        return this.getCurrentDictionary();
    }

    // Получить текущий словарь
    getCurrentDictionary() {
        return this.loadedDictionaries.get(this.currentLanguage) || {};
    }

    // Переключить язык
    async setLanguage(lang) {
        if (this.currentLanguage === lang) return;

        const oldLang = this.currentLanguage;
        this.currentLanguage = lang;

        // Загружаем новый словарь
        await this.loadDictionary(lang);

        // 🔥 ОБНОВЛЯЕМ ПЕРЕВОДЫ СРАЗУ ПОСЛЕ СМЕНЫ
        this.updateTranslations();

        // 🔥 КРИТИЧЕСКОЕ: Синхронизируем appState.language для правильной работы appState.translate()
        if (window.appState && window.appState.setLanguage) {
            window.appState.setLanguage(lang);
        }

        // 🔥 СОБЫТИЕ ДЛЯ ОБНОВЛЕНИЯ ВСЕХ МОДУЛЕЙ
        document.dispatchEvent(new CustomEvent('dictionary:language-changed', {
            detail: { newLang: lang, oldLang }
        }));

        return this.getCurrentDictionary();
    }

    // Обновить переводы в интерфейсе
    updateTranslations() {
        const translations = this.getCurrentDictionary();

        if (!translations) return;

        // Обновляем обычные элементы с data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = translations[key] || key;
            element.textContent = translation;
        });

        // Обновляем элементы с placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = translations[key] || key;
            element.placeholder = translation;
        });

        // Обновляем элементы с data-i18n-price
        document.querySelectorAll('[data-i18n-price]').forEach(element => {
            const key = element.getAttribute('data-i18n-price');
            const translation = translations[key] || key;
            element.textContent = translation;
        });
    }

    // Перевести ключ
    translate(key) {
        const dict = this.getCurrentDictionary();
        return dict?.[key] || key;
    }

    // Проверить, загружен ли словарь
    isDictionaryLoaded(lang) {
        return this.loadedDictionaries.has(lang);
    }

    // Получить статистику
    getStats() {
        return {
            loadedLanguages: Array.from(this.loadedDictionaries.keys()),
            currentLanguage: this.currentLanguage,
            totalLoaded: this.loadedDictionaries.size,
            availableLanguages: AVAILABLE_LANGUAGES.length,
            memoryUsage: 'estimated ' + (this.loadedDictionaries.size * 50) + 'KB' // roughly
        };
    }

    // 🚀 Method Removed: preloadCommonLanguages
    // We strictly load ONLY the current language to save bandwidth and startup time.
}

// 🔥 ГЛОБАЛЬНЫЙ ЭКЗЕМПЛЯР ДЛЯ ИСПОЛЬЗОВАНИЯ ВО ВСЕМ ПРИЛОЖЕНИИ
const dictionaryManager = new DictionaryManager();

// 🔥 ЭКСПОРТ ГЛОБАЛЬНОГО МЕНЕДЖЕРА
window.dictionaryManager = dictionaryManager;

// 🔥 ОБРАТНАЯ СОВМЕСТИМОСТЬ С СТАРЫМ TRANSLATE
window.translate = (key) => dictionaryManager.translate(key);

// 🔥 ЭКСПОРТ ДЛЯ МОДУЛЕЙ
export default dictionaryManager;
export { dictionaryManager };

console.log('📚 Dictionary Manager module loaded and available globally');
