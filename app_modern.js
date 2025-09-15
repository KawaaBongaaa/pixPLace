// 🚀 Modern AI Image Generator WebApp

// Configuration
const CONFIG = {
    WEBHOOK_URL: 'https://hook.us2.make.com/x2hgl6ocask8hearbpwo3ch7pdwpdlrk', // ⚠️ ЗАМЕНИТЕ НА ВАШ WEBHOOK!
    CHAT_WEBHOOK_URL: 'https://hook.us2.make.com/xsj1a14x1qaterd8fcxrs8e91xwhvjh6', // ⚠️ ЗАМЕНИТЕ НА WEBHOOK ДЛЯ ЧАТА!
    TIMEOUT: 120000, // 120 секунд
    LANGUAGES: ['en', 'ru', 'es', 'fr', 'de', 'zh', 'pt', 'ar', 'hi', 'ja', 'it', 'ko', 'tr', 'pl'],
    DEFAULT_LANGUAGE: 'en',
    DEFAULT_THEME: 'dark', // 'light', 'dark', 'auto'
    IMGBB_API_KEY: '34627904ae4633713e1fee94a243794e', // только для тестов/прототипа
    MAX_IMAGE_MB: 10,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    PREVIEW_MAX_W: 1024,
    PREVIEW_MAX_H: 1024,
    PREVIEW_JPEG_QUALITY: 0.9,
    TELEGRAM_BOT_URL: 'https://t.me/pixPLaceBot?start=user_shared', // Замените на ссылку вашего бота
    SHARE_DEFAULT_HASHTAGS: '#pixPLaceBot #Telegram #miniApp'
};
// 🌍 Translations
const TRANSLATIONS = {



    en: {
        loading: "The pixPLace",
        app_title: "pixPLace",
        connecting: "Connecting...",
        connected: "Connected to Telegram",
        welcome_title: "Create Amazing Images",
        welcome_subtitle: "Describe your vision and watch AI bring it to life",
        prompt_label: "Prompt",
        prompt_placeholder: "Describe your vision and watch AI bring it to life...",
        style_label: "Style",
        style_realistic: "Realistic",
        style_artistic: "Artistic",
        style_cartoon: "Cartoon",
        style_fantasy: "Fantasy",
        style_anime: "Anime",
        style_cyberpunk: "Cyberpunk",
        style_popart: "Pop Art",
        style_abstract: "Abstract",
        style_sketch: "Sketch",
        style_3d: "3d",
        style_sticker: "Sticker",
        style_vector: "Vector",
        style_interior: "Interior",
        style_architecture: "Architecture",
        style_fashion: "Fashion",
        style_tattoo: "Tattoo",
        style_print: "Print",
        style_logo: "Logo",
        style_icon: "Icon",
        style_banner: "Banner",
        mode_label: "Mode",
        mode_background_removal: "Remove Background",
        mode_upscale_image: "Upscale Image | ~5cr",
        mode_print_maker: "SDXL T-Shirt Print | PoD Helper | ~2cr",
        mode_photo_session: "Nano Banana | Photo Editing by Kontext Explaining",
        mode_fast_generation: "Fastest pixPlace | Simple Pictures",
        mode_pixplace_pro: "Flux Krea | Logo | Text(eng)",
        size_label: "Size",
        size_square: "1:1",
        size_portrait: "9:16",
        size_landscape: "16:9",
        generate_btn: "Generate Image",
        create_new: "Create New",
        empty_history_title: "No generations yet",
        empty_history_subtitle: "Create your first AI image to see it here",
        generation_cost: "Generation cost",
        error_prompt_required: "Please describe your image",
        error_prompt_too_short: "Prompt too short (minimum 5 characters)",
        error_webhook_not_configured: "Webhook URL not configured",
        error_generation_failed: "Generation failed",
        error_timeout: "Generation timeout. Please try again.",
        success_generated: "Image generated successfully!",
        copied_to_clipboard: "Copied to clipboard",
        download_started: "Download started",
        limit_title: "Generation Limit Reached",
        limit_message: "Your credits for generation have run out.\nYou can get more credits by paying for one of the subscription plans for our private channel.\n\nPayment by any card or crypto, through the Tribute Telegram payment service.",
        closeLimitModal: "Maybe Later",
        upgradeBtn: "Pay",
        remove_user_image: "Remove",
        reference_image: "Reference",
        upload_image: "Upload Image",
        please_upload_photo_session: "Please upload Your image for Photo Session mode. \nOr just choice another Mode",
        upload_failed: "Failed to upload the image. \nPlease try again.",
        please_upload_for_upscale: "Please upload an image to Upscale.",
        please_upload_for_background_removal: "Please upload an image for Background removal.",

        // ========== AI CHAT TRANSLATIONS ==========
        ai_coach_ready: "✨ AI Prompt Helper is ready to help with AI generation!",
        ai_welcome_intro: "AI Prompt Helper: Welcome! I am your AI assistant for improving the quality of image generation results. Ask any question about creating prompts! Or briefly describe your vision, and I will create a professional prompt for you.",
        ai_welcome_chat: "AI Prompt Helper: Welcome to the chat! I am your AI assistant for help with creating images. Tell me what you want to generate and I will help you create a quality prompt. Or just ask me any question, I'll help with generation!",
        ai_placeholder_modal: "Write to your AI assistant...",
        ai_placeholder_chat: "Write your message...",
        ai_send_button: "Send",
        ai_close_button: "Close",
        ai_thinking_indicator: "🤖 pixPLace Assistant is thinking...",
        ai_error_message: "Sorry, there was an error. Please try again.",

        // ==============TARIFFS MODAL ENGLISH TRANSLATIONS ==============
        plan_lite_title: "LITE",
        plan_lite_price: "€12",
        plan_lite_desc: "Perfect for casual users",
        plan_lite_credits: "500 credits",
        plan_lite_feature1: "• Fast generation",
        plan_lite_feature2: "• Standard models",
        plan_lite_feature3: "• Best Quality ",
        plan_lite_select: "Subscribe",

        plan_pro_title: "PRO",
        plan_pro_price: "€17",
        plan_pro_desc: "Best for enthusiasts",
        plan_pro_credits: "1000 credits",
        plan_pro_feature1: "• FLUX models",
        plan_pro_feature2: "• AI Assistant included",
        plan_pro_feature3: "• HD quality",
        plan_pro_select: "Subscribe",

        plan_studio_title: "STUDIO",
        plan_studio_price: "€31",
        plan_studio_desc: "Full creative power",
        plan_studio_credits: "2000 credits",
        plan_studio_feature1: "• Max performance",
        plan_studio_feature2: "• All premium models",
        plan_studio_feature3: "• Priority support",
        plan_studio_select: "Subscribe",

        // Additional AI Chat translations for english
        ai_placeholder_modal: "Write to your AI assistant...",
        ai_chat_title: "AI Assistant"
    },

    ru: {
        loading: "The pixPLace",
        app_title: "pixPLace",
        connecting: "Подключение...",
        connected: "Подключено к Telegram",
        welcome_title: "Создавайте Потрясающие Изображения",
        welcome_subtitle: "Опишите своё видение и наблюдайте, как AI воплощает его в жизнь",
        prompt_label: "Prompt",
        prompt_placeholder: "Опишите своё видение и наблюдайте, как AI воплощает его в жизнь...",
        style_label: "Стиль",
        style_realistic: "Реализм",
        style_artistic: "Арт",
        style_cartoon: "Мульт",
        style_fantasy: "Фэнтези",
        style_anime: "Аниме",
        style_cyberpunk: "CyberPunk",
        style_popart: "Поп-арт",
        style_abstract: "Абстракция",
        style_sketch: "Скетч",
        style_3d: "3D",
        style_sticker: "Стикер",
        style_vector: "Вектор",
        style_interior: "Интерьер",
        style_architecture: "Архитектура",
        style_fashion: "Мода",
        style_tattoo: "Тату",
        style_print: "Print",
        style_logo: "Logo",
        style_icon: "Icon",
        style_banner: "Баннер",
        mode_label: "Режим",
        mode_background_removal: "Удаление фона | ~1cr",
        mode_upscale_image: "Улучшение качества | ~5cr",
        mode_print_maker: "Печать | Sticker | PoD Helper ~2cr",
        mode_photo_session: "ФотоCессия | Опишите, что изменить | ~5cr",
        mode_fast_generation: "Быстрая Генерация | Простые картинки | ~1cr",
        mode_pixplace_pro: "Pro | Logo | Text ~3cr",
        size_label: "Размер",
        size_square: "1:1",
        size_portrait: "9:16",
        size_landscape: "16:9",
        generate_btn: "Создать изображение",
        processing_subtitle: "Это может занять до 60 секунд",
        step_analyzing: "Анализируем промпт",
        step_generating: "Генерируем изображение",
        step_finalizing: "Завершаем результат",
        elapsed_time: "Прошло времени:",
        cancel_btn: "Отменить",
        create_new: "Создать новое",
        view_history: "Посмотреть историю",
        history_title: "История генераций",
        empty_history_title: "Пока нет генераций",
        empty_history_subtitle: "Создайте первое изображение, чтобы увидеть его здесь",
        generation_cost: "Стоимость генерации",
        error_prompt_required: "Пожалуйста, опишите изображение",
        error_prompt_too_short: "Описание слишком короткое (минимум 5 символов)",
        error_webhook_not_configured: "Webhook URL не настроен",
        error_generation_failed: "Генерация не удалась",
        error_timeout: "Превышено время ожидания. Попробуйте ещё раз.",
        success_generated: "Изображение успешно создано!",
        copied_to_clipboard: "Скопировано в буфер",
        download_started: "Загрузка началась",
        limit_title: "Лимит генераций исчерпан",
        limit_message: "Ваши кредиты для генерации закончились.\nБольше кредитов Вы можете получить, оплатив один из тарифных планов подписки на наш приватный канал.\n\nОплата любой картой или криптой, через платежный сервис Tribute Telegram.",
        check_subsciption: "Проверить подписку",
        closeLimitModal: "Может позже",
        upgradeBtn: "Выбрать тариф",
        remove_user_image: "Удалить",
        reference_image: "Референс",
        upload_image: "Загрузить изображение",
        please_upload_photo_session: "Загрузите изображение, чтобы использовать данный режим",
        upload_failed: "Не получилось загрузить изображение. Попробуй ещё раз",
        please_upload_for_upscale: "Загрузите изображение, чтобы использовать данный режим (Улучшение Качества)",
        please_upload_for_background_removal: "Загрузите изображение, чтобы использовать данный режим (Удаление заднего фона)",

        // ========== AI CHAT TRANSLATIONS ==========
        ai_coach_ready: "✨ Ai Prompt Helper готов помочь с ИИ генерацией!",
        ai_welcome_intro: "AI Prompt Helper: Добро пожаловать! Я ваш AI помощник промптов для повышения качества результатов генерации изображений. Задайте любой вопрос о создании промптов! Или коротко опишите свое видение, и я создам для Вас профессиональный Prompt.",
        ai_welcome_chat: "AI Prompt Helper: Добро пожаловать в чат! Я ваш AI помощник промптов для помощи с созданием изобщений. Скажите, что вы хотите сгенерировать и я помогу Вам создать качественный промпт. Или же просто задайте мне любой вопрос, буду помогать с генерацией!",
        ai_placeholder_modal: "Напишите своему AI ассистенту...",
        ai_placeholder_chat: "Напишите своё сообщение...",
        ai_send_button: "Отправить",
        ai_close_button: "Закрыть",
        ai_thinking_indicator: "🤖 pixPLace Assistant думает...",
        ai_error_message: "Извините, произошла ошибка. Повторите пожалуйста.",
        // ==============TARIFFS MODAL RUSSIAN TRANSLATIONS ==============
        plan_lite_title: "LITE",
        plan_lite_price: "1100₽",
        plan_lite_desc: "Идеально для редкого использования",
        plan_lite_credits: "500 кредитов",
        plan_lite_feature1: "• Быстрая генерация",
        plan_lite_feature2: "• Стандартные модели",
        plan_lite_feature3: "• Высокое качество",
        plan_lite_select: "Оплатить подписку",

        plan_pro_title: "PRO",
        plan_pro_price: "1700₽",
        plan_pro_desc: "Лучший выбор для увлечённых пользователей",
        plan_pro_credits: "1000 кредитов",
        plan_pro_feature1: "• Модели FLUX",
        plan_pro_feature2: "• Включен AI ассистент",
        plan_pro_feature3: "• Качество HD",
        plan_pro_select: "Оплатить подписку",

        plan_studio_title: "STUDIO",
        plan_studio_price: "2900₽",
        plan_studio_desc: "Максимальная творческая свобода",
        plan_studio_credits: "2000 кредитов",
        plan_studio_feature1: "• Максимальная производительность",
        plan_studio_feature2: "• Все премиум фитчи",
        plan_studio_feature3: "• Приоритетная поддержка",
        plan_studio_select: "Оплатить подписку",

    },

    es: {
        loading: "The pixPLace",
        app_title: "pixPLace",
        connecting: "Conectando...",
        connected: "Conectado a Telegram",
        welcome_title: "Crea Imágenes Asombrosas",
        welcome_subtitle: "Describe tu visión y observa cómo la IA la hace realidad",
        prompt_label: "Prompt",
        prompt_placeholder: "Describe tu visión y observa cómo la IA la hace realidad...",
        style_label: "Estilo",
        style_realistic: "Realista",
        style_artistic: "Artístico",
        style_cartoon: "Dibujo animado",
        style_fantasy: "Fantasía",
        style_anime: "Anime",
        style_cyberpunk: "Ciberpunk",
        style_popart: "Arte pop",
        style_abstract: "Abstracto",
        style_sketch: "Boceto",
        style_3d: "3D",
        style_sticker: "Sticker",
        style_vector: "Vector",
        style_interior: "Interior",
        style_architecture: "Arquitectura",
        style_fashion: "Moda",
        style_tattoo: "Tatuaje",
        style_print: "Impresión",
        style_logo: "Logo",
        style_icon: "Icono",
        style_banner: "Banner",
        mode_label: "Modo",
        mode_background_removal: "Eliminación de fondo | img2img | ~1cr",
        mode_upscale_image: "Mejorar imagen | img2img | ~5cr",
        mode_print_maker: "Impresión | Sticker | POD Helper | txt2img | ~2cr",
        mode_photo_session: "Sesión de foto | Modelo Kontext | img2img | ~5cr",
        mode_fast_generation: "Más rápido | Imágenes simples | txt2img | ~1cr",
        mode_pixplace_pro: "pixPLace Pro | Logo | Texto | img2img | ~5cr",
        size_label: "Tamaño",
        size_square: "1:1",
        size_portrait: "9:16",
        size_landscape: "16:9",
        generate_btn: "Generar imagen",
        processing_title: "Creando tu obra maestra",
        processing_subtitle: "Esto puede tardar hasta 60 segundos",
        step_analyzing: "Analizando el prompt",
        step_generating: "Generando imagen",
        step_finalizing: "Finalizando resultado",
        elapsed_time: "Tiempo transcurrido:",
        cancel_btn: "Cancelar",
        create_new: "Crear nuevo",
        view_history: "Ver historial",
        history_title: "Historial de generaciones",
        empty_history_title: "Aún no hay generaciones",
        empty_history_subtitle: "Crea tu primera imagen AI para verla aquí",
        generation_cost: "Costo de generación",
        error_prompt_required: "Por favor describe tu imagen",
        error_prompt_too_short: "Prompt demasiado corto (mínimo 5 caracteres)",
        error_webhook_not_configured: "URL de webhook no configurada",
        error_generation_failed: "La generación falló",
        error_timeout: "Tiempo de generación agotado. Inténtalo de nuevo.",
        success_generated: "¡Imagen generada con éxito!",
        copied_to_clipboard: "Copiado al portapapeles",
        download_started: "Descarga iniciada",
        limit_title: "Límite de generación alcanzado",
        limit_message: "Has alcanzado tu límite gratuito de generaciones. ¡Actualiza para seguir creando imágenes asombrosas!",
        check_subsciption: "Comprobar suscripción",
        closeLimitModal: "Quizás más tarde",
        upgradeBtn: "Actualizar ahora",
        remove_user_image: "Eliminar",
        reference_image: "Referencia",
        upload_image: "Subir imagen",
        please_upload_photo_session: "Por favor sube tu foto de rostro para el modo Foto. O elige otro modo",
        upload_failed: "Error al subir la imagen. Intenta de nuevo.",
        please_upload_for_upscale: "Por favor sube una imagen para mejorar.",
        please_upload_for_background_removal: "Por favor sube una imagen para eliminar el fondo."
    },

    fr: {
        loading: "S'il vous plaît, amusez-vous",
        app_title: "pixPLace",
        connecting: "Connexion...",
        connected: "Connecté à Telegram",
        welcome_title: "Créez des images incroyables",
        welcome_subtitle: "Décrivez votre vision et regardez l'IA la concrétiser",
        prompt_label: "Prompt",
        prompt_placeholder: "Décrivez votre vision et regardez l'IA la concrétiser...",
        style_label: "Style",
        style_realistic: "Réaliste",
        style_artistic: "Artistique",
        style_cartoon: "Dessiné",
        style_fantasy: "Fantaisie",
        style_anime: "Anime",
        style_cyberpunk: "Cyberpunk",
        style_popart: "Pop Art",
        style_abstract: "Abstrait",
        style_sketch: "Croquis",
        style_3d: "3D",
        style_sticker: "Autocollant",
        style_vector: "Vecteur",
        style_interior: "Intérieur",
        style_architecture: "Architecture",
        style_fashion: "Mode",
        style_tattoo: "Tatouage",
        style_print: "Impression",
        style_logo: "Logo",
        style_icon: "Icône",
        style_banner: "Bannière",
        mode_label: "Mode",
        mode_background_removal: "Suppression de fond | img2img | ~1cr",
        mode_upscale_image: "Améliorer l'image | img2img | ~5cr",
        mode_print_maker: "Impression | Sticker | POD Helper | txt2img | ~2cr",
        mode_photo_session: "Session photo | Modèle Kontext | img2img | ~5cr",
        mode_fast_generation: "Le plus rapide | Images simples | txt2img | ~1cr",
        mode_pixplace_pro: "pixPLace Pro | Logo | Texte | img2img | ~5cr",
        size_label: "Taille",
        size_square: "1:1",
        size_portrait: "9:16",
        size_landscape: "16:9",
        generate_btn: "Générer l'image",
        processing_title: "Création de votre chef-d'œuvre",
        processing_subtitle: "Cela peut prendre jusqu'à 60 secondes",
        step_analyzing: "Analyse du prompt",
        step_generating: "Génération de l'image",
        step_finalizing: "Finalisation du résultat",
        elapsed_time: "Temps écoulé :",
        cancel_btn: "Annuler",
        create_new: "Créer nouveau",
        view_history: "Voir l'historique",
        history_title: "Historique de génération",
        empty_history_title: "Pas encore de générations",
        empty_history_subtitle: "Créez votre première image IA pour la voir ici",
        generation_time: "Temps de génération",
        error_prompt_required: "Veuillez décrire votre image",
        error_prompt_too_short: "Prompt trop court (minimum 5 caractères)",
        error_webhook_not_configured: "URL du webhook non configurée",
        error_generation_failed: "Échec de la génération",
        error_timeout: "Temps de génération écoulé. Veuillez réessayer.",
        success_generated: "Image générée avec succès !",
        copied_to_clipboard: "Copié dans le presse-papiers",
        download_started: "Téléchargement démarré",
        limit_title: "Limite de génération atteinte",
        limit_message: "Vous avez atteint votre limite gratuite de générations. Passez à la version payante pour continuer à créer des images incroyables !",
        check_subsciption: "Vérifier l'abonnement",
        closeLimitModal: "Peut-être plus tard",
        upgradeBtn: "Mettre à niveau",
        remove_user_image: "Supprimer",
        reference_image: "Référence",
        upload_image: "Téléverser une image",
        please_upload_photo_session: "Veuillez téléverser la photo de votre visage pour le mode Session Photo. Ou choisissez un autre mode",
        upload_failed: "Échec du téléversement de l'image. Veuillez réessayer.",
        please_upload_for_upscale: "Veuillez téléverser une image pour l'amélioration.",
        please_upload_for_background_removal: "Veuillez téléverser une image pour la suppression de fond."
    },

    de: {
        loading: "Bitte, hab Spaß",
        app_title: "pixPLace",
        connecting: "Verbindung wird hergestellt...",
        connected: "Verbunden mit Telegram",
        welcome_title: "Erstelle erstaunliche Bilder",
        welcome_subtitle: "Beschreibe deine Vision und sieh zu, wie die KI sie zum Leben erweckt",
        prompt_label: "Prompt",
        prompt_placeholder: "Beschreibe deine Vision und sieh zu, wie die KI sie zum Leben erweckt...",
        style_label: "Stil",
        style_realistic: "Realistisch",
        style_artistic: "Künstlerisch",
        style_cartoon: "Cartoon",
        style_fantasy: "Fantasy",
        style_anime: "Anime",
        style_cyberpunk: "Cyberpunk",
        style_popart: "Pop Art",
        style_abstract: "Abstrakt",
        style_sketch: "Skizze",
        style_3d: "3D",
        style_sticker: "Sticker",
        style_vector: "Vektor",
        style_interior: "Innenraum",
        style_architecture: "Architektur",
        style_fashion: "Mode",
        style_tattoo: "Tattoo",
        style_print: "Druck",
        style_logo: "Logo",
        style_icon: "Icon",
        style_banner: "Banner",
        mode_label: "Modus",
        mode_background_removal: "Hintergrund entfernen | img2img | ~1cr",
        mode_upscale_image: "Bild hochskalieren | img2img | ~5cr",
        mode_print_maker: "Druck | Sticker | POD Helfer | txt2img | ~2cr",
        mode_photo_session: "Fotosession | Kontext-Modell | img2img | ~5cr",
        mode_fast_generation: "Schnellste | Einfache Bilder | txt2img | ~1cr",
        mode_pixplace_pro: "pixPLace Pro | Logo | Text | img2img | ~5cr",
        size_label: "Größe",
        size_square: "1:1",
        size_portrait: "9:16",
        size_landscape: "16:9",
        generate_btn: "Bild erzeugen",
        processing_title: "Dein Meisterwerk wird erstellt",
        processing_subtitle: "Das kann bis zu 60 Sekunden dauern",
        step_analyzing: "Prompt wird analysiert",
        step_generating: "Bild wird generiert",
        step_finalizing: "Ergebnis wird finalisiert",
        elapsed_time: "Verstrichene Zeit:",
        cancel_btn: "Abbrechen",
        create_new: "Neu erstellen",
        view_history: "Verlauf anzeigen",
        history_title: "Generierungsverlauf",
        empty_history_title: "Noch keine Generierungen",
        empty_history_subtitle: "Erstelle dein erstes KI-Bild, um es hier zu sehen",
        generation_time: "Generierungszeit",
        error_prompt_required: "Bitte beschreibe dein Bild",
        error_prompt_too_short: "Prompt zu kurz (mindestens 5 Zeichen)",
        error_webhook_not_configured: "Webhook-URL nicht konfiguriert",
        error_generation_failed: "Generierung fehlgeschlagen",
        error_timeout: "Generierungszeit überschritten. Bitte erneut versuchen.",
        success_generated: "Bild erfolgreich erstellt!",
        copied_to_clipboard: "In Zwischenablage kopiert",
        download_started: "Download gestartet",
        limit_title: "Generierungslimit erreicht",
        limit_message: "Du hast dein kostenloses Generierungslimit erreicht. Upgrade, um weiter erstaunliche Bilder zu erstellen!",
        check_subsciption: "Abonnement prüfen",
        closeLimitModal: "Vielleicht später",
        upgradeBtn: "Jetzt upgraden",
        remove_user_image: "Entfernen",
        reference_image: "Referenz",
        upload_image: "Bild hochladen",
        please_upload_photo_session: "Bitte lade dein Foto mit Gesicht für den Foto-Session-Modus hoch. Oder wähle einen anderen Modus",
        upload_failed: "Hochladen des Bildes fehlgeschlagen. Bitte erneut versuchen.",
        please_upload_for_upscale: "Bitte lade ein Bild zum Hochskalieren hoch.",
        please_upload_for_background_removal: "Bitte lade ein Bild zur Hintergrundentfernung hoch."
    },

    zh: {
        loading: "请尽情享受",
        app_title: "pixPLace",
        connecting: "连接中...",
        connected: "已连接到 Telegram",
        welcome_title: "创建惊艳的图片",
        welcome_subtitle: "描述你的设想，观看 AI 将其变为现实",
        prompt_label: "提示",
        prompt_placeholder: "描述你的设想，观看 AI 将其变为现实...",
        style_label: "风格",
        style_realistic: "写实",
        style_artistic: "艺术",
        style_cartoon: "卡通",
        style_fantasy: "奇幻",
        style_anime: "动漫",
        style_cyberpunk: "赛博朋克",
        style_popart: "波普艺术",
        style_abstract: "抽象",
        style_sketch: "速写",
        style_3d: "3D",
        style_sticker: "贴纸",
        style_vector: "矢量",
        style_interior: "室内",
        style_architecture: "建筑",
        style_fashion: "时尚",
        style_tattoo: "纹身",
        style_print: "印刷",
        style_logo: "标志",
        style_icon: "图标",
        style_banner: "横幅",
        mode_label: "模式",
        mode_background_removal: "去背 | img2img | ~1cr",
        mode_upscale_image: "放大图片 | img2img | ~5cr",
        mode_print_maker: "印刷 | 贴纸 | POD 助手 | txt2img | ~2cr",
        mode_photo_session: "拍照模式 | Kontext 模型 | img2img | ~5cr",
        mode_fast_generation: "最快 | 简单图片 | txt2img | ~1cr",
        mode_pixplace_pro: "pixPLace Pro | Logo | 文本 | img2img | ~5cr",
        size_label: "尺寸",
        size_square: "1:1",
        size_portrait: "9:16",
        size_landscape: "16:9",
        generate_btn: "生成图片",
        processing_title: "正在创作你的杰作",
        processing_subtitle: "这可能需要最多 60 秒",
        step_analyzing: "正在分析提示",
        step_generating: "正在生成图片",
        step_finalizing: "正在完成结果",
        elapsed_time: "已用时间：",
        cancel_btn: "取消",
        create_new: "创建新建",
        view_history: "查看历史",
        history_title: "生成历史",
        empty_history_title: "尚无生成记录",
        empty_history_subtitle: "创建你的第一张 AI 图片以在此查看",
        generation_time: "生成时间",
        error_prompt_required: "请描述你的图片",
        error_prompt_too_short: "提示过短（最少 5 个字符）",
        error_webhook_not_configured: "Webhook URL 未配置",
        error_generation_failed: "生成失败",
        error_timeout: "生成超时。请重试。",
        success_generated: "图片生成成功！",
        copied_to_clipboard: "已复制到剪贴板",
        download_started: "已开始下载",
        limit_title: "达到生成限制",
        limit_message: "你已达到免费生成限制。升级以继续创建惊艳图片！",
        check_subsciption: "检查订阅",
        closeLimitModal: "也许稍后",
        upgradeBtn: "立即升级",
        remove_user_image: "移除",
        reference_image: "参考",
        upload_image: "上传图片",
        please_upload_photo_session: "请为拍照模式上传你的面部照片。或选择其他模式",
        upload_failed: "图片上传失败。请重试。",
        please_upload_for_upscale: "请上传图片以进行放大。",
        please_upload_for_background_removal: "请上传图片以进行去背景。"
    },

    pt: {
        loading: "Por favor, divirta-se",
        app_title: "pixPLace",
        connecting: "Conectando...",
        connected: "Conectado ao Telegram",
        welcome_title: "Crie Imagens Incríveis",
        welcome_subtitle: "Descreva sua visão e veja a IA torná‑la realidade",
        prompt_label: "Prompt",
        prompt_placeholder: "Descreva sua visão e veja a IA torná‑la realidade...",
        style_label: "Estilo",
        style_realistic: "Realista",
        style_artistic: "Artístico",
        style_cartoon: "Cartoon",
        style_fantasy: "Fantasia",
        style_anime: "Anime",
        style_cyberpunk: "Cyberpunk",
        style_popart: "Pop Art",
        style_abstract: "Abstrato",
        style_sketch: "Esboço",
        style_3d: "3D",
        style_sticker: "Adesivo",
        style_vector: "Vetor",
        style_interior: "Interiores",
        style_architecture: "Arquitetura",
        style_fashion: "Moda",
        style_tattoo: "Tatuagem",
        style_print: "Impressão",
        style_logo: "Logo",
        style_icon: "Ícone",
        style_banner: "Banner",
        mode_label: "Modo",
        mode_background_removal: "Remoção de Fundo | img2img | ~1cr",
        mode_upscale_image: "Aprimorar Imagem | img2img | ~5cr",
        mode_print_maker: "Impressão | Adesivo | POD Helper | txt2img | ~2cr",
        mode_photo_session: "Sessão de Foto | Modelo Kontext | img2img | ~5cr",
        mode_fast_generation: "Mais Rápido | Imagens Simples | txt2img | ~1cr",
        mode_pixplace_pro: "pixPLace Pro | Logo | Texto | img2img | ~5cr",
        size_label: "Tamanho",
        size_square: "1:1",
        size_portrait: "9:16",
        size_landscape: "16:9",
        generate_btn: "Gerar Imagem",
        processing_title: "Criando sua obra-prima",
        processing_subtitle: "Isso pode levar até 60 segundos",
        step_analyzing: "Analisando prompt",
        step_generating: "Gerando imagem",
        step_finalizing: "Finalizando resultado",
        elapsed_time: "Tempo decorrido:",
        cancel_btn: "Cancelar",
        create_new: "Criar novo",
        view_history: "Ver histórico",
        history_title: "Histórico de gerações",
        empty_history_title: "Ainda sem gerações",
        empty_history_subtitle: "Crie sua primeira imagem AI para vê‑la aqui",
        generation_time: "Tempo de geração",
        error_prompt_required: "Por favor descreva sua imagem",
        error_prompt_too_short: "Prompt muito curto (mínimo 5 caracteres)",
        error_webhook_not_configured: "URL do webhook não configurada",
        error_generation_failed: "Geração falhou",
        error_timeout: "Tempo de geração esgotado. Por favor, tente novamente.",
        success_generated: "Imagem gerada com sucesso!",
        copied_to_clipboard: "Copiado para a área de transferência",
        download_started: "Download iniciado",
        limit_title: "Limite de geração atingido",
        limit_message: "Você atingiu seu limite gratuito de gerações. Faça upgrade para continuar criando imagens incríveis!",
        check_subsciption: "Verificar assinatura",
        closeLimitModal: "Talvez depois",
        upgradeBtn: "Fazer upgrade",
        remove_user_image: "Remover",
        reference_image: "Referência",
        upload_image: "Enviar imagem",
        please_upload_photo_session: "Por favor carregue sua foto de rosto para o modo Sessão de Foto. Ou escolha outro modo",
        upload_failed: "Falha ao enviar a imagem. Por favor, tente novamente.",
        please_upload_for_upscale: "Por favor envie uma imagem para aprimorar.",
        please_upload_for_background_removal: "Por favor envie uma imagem para remoção de fundo."
    },

    ar: {
        loading: "من فضلك استمتع",
        app_title: "pixPLace",
        connecting: "جارٍ الاتصال...",
        connected: "متصل بـ Telegram",
        welcome_title: "أنشئ صورًا مدهشة",
        welcome_subtitle: "وصف رؤيتك وشاهد الذكاء الاصطناعي يحققها",
        prompt_label: "المطالبة",
        prompt_placeholder: "وصف رؤيتك وشاهد الذكاء الاصطناعي يحققها...",
        style_label: "الأسلوب",
        style_realistic: "واقعي",
        style_artistic: "فني",
        style_cartoon: "رسوم متحركة",
        style_fantasy: "خيالي",
        style_anime: "أنمي",
        style_cyberpunk: "سايبر بانك",
        style_popart: "بوب آرت",
        style_abstract: "تجريدي",
        style_sketch: "سكيتش",
        style_3d: "3D",
        style_sticker: "ملصق",
        style_vector: "فيكتور",
        style_interior: "داخلي",
        style_architecture: "هندسة معمارية",
        style_fashion: "موضة",
        style_tattoo: "وشم",
        style_print: "طباعة",
        style_logo: "شعار",
        style_icon: "أيقونة",
        style_banner: "لافتة",
        mode_label: "الوضع",
        mode_background_removal: "إزالة الخلفية | img2img | ~1cr",
        mode_upscale_image: "تكبير الصورة | img2img | ~5cr",
        mode_print_maker: "طباعة | ملصق | POD مساعد | txt2img | ~2cr",
        mode_photo_session: "جلسة تصوير | نموذج Kontext | img2img | ~5cr",
        mode_fast_generation: "الأسرع | صور بسيطة | txt2img | ~1cr",
        mode_pixplace_pro: "pixPLace Pro | شعار | نص | img2img | ~5cr",
        size_label: "الحجم",
        size_square: "1:1",
        size_portrait: "9:16",
        size_landscape: "16:9",
        generate_btn: "إنشاء الصورة",
        processing_title: "نقوم بإنشاء تحفتك الفنية",
        processing_subtitle: "قد يستغرق هذا حتى 60 ثانية",
        step_analyzing: "جارٍ تحليل المطالبة",
        step_generating: "جارٍ توليد الصورة",
        step_finalizing: "جارٍ إنهاء النتيجة",
        elapsed_time: "الوقت المنقضي:",
        cancel_btn: "إلغاء",
        create_new: "إنشاء جديد",
        view_history: "عرض السجل",
        history_title: "سجل الإنشاء",
        empty_history_title: "لا توجد عمليات إنشاء بعد",
        empty_history_subtitle: "أنشئ صورتك الأولى بواسطة الذكاء الاصطناعي لتظهر هنا",
        generation_time: "زمن التوليد",
        error_prompt_required: "يرجى وصف صورتك",
        error_prompt_too_short: "المطالبة قصيرة جدًا (الحد الأدنى 5 أحرف)",
        error_webhook_not_configured: "عنوان Webhook غير مهيأ",
        error_generation_failed: "فشلت عملية التوليد",
        error_timeout: "انتهت مهلة التوليد. حاول مرة أخرى.",
        success_generated: "تم إنشاء الصورة بنجاح!",
        copied_to_clipboard: "تم النسخ إلى الحافظة",
        download_started: "تم بدء التنزيل",
        limit_title: "تم الوصول لحد التوليد",
        limit_message: "لقد وصلت إلى حد التوليد المجاني الخاص بك. قم بالترقية للاستمرار في إنشاء صور مذهلة!",
        check_subsciption: "التحقق من الاشتراك",
        closeLimitModal: "ربما لاحقًا",
        upgradeBtn: "الترقية الآن",
        remove_user_image: "إزالة",
        reference_image: "مرجع",
        upload_image: "تحميل صورة",
        please_upload_photo_session: "يرجى تحميل صورة وجهك لوضع جلسة التصوير. أو اختر وضعًا آخر",
        upload_failed: "فشل تحميل الصورة. حاول مرة أخرى.",
        please_upload_for_upscale: "يرجى تحميل صورة للتحسين.",
        please_upload_for_background_removal: "يرجى تحميل صورة لإزالة الخلفية."
    },

    hi: {
        loading: "कृपया, आनंद लें",
        app_title: "pixPLace",
        connecting: "कनेक्ट कर रहे हैं...",
        connected: "Telegram से जुड़ा हुआ",
        welcome_title: "अद्भुत चित्र बनायें",
        welcome_subtitle: "अपनी कल्पना का वर्णन करें और देखें कि AI इसे कैसे साकार करता है",
        prompt_label: "Prompt",
        prompt_placeholder: "अपनी कल्पना का वर्णन करें और देखें कि AI इसे कैसे साकार करता है...",
        style_label: "शैली",
        style_realistic: "यथार्थवादी",
        style_artistic: "कलात्मक",
        style_cartoon: "कार्टून",
        style_fantasy: "फैंटेसी",
        style_anime: "ऐनिमे",
        style_cyberpunk: "साइबरपंक",
        style_popart: "पॉप आर्ट",
        style_abstract: "अमूर्त",
        style_sketch: "स्केच",
        style_3d: "3D",
        style_sticker: "स्टिकर",
        style_vector: "वैक्टर",
        style_interior: "इंटीरियर",
        style_architecture: "वास्तुकला",
        style_fashion: "फैशन",
        style_tattoo: "टैटू",
        style_print: "प्रिंट",
        style_logo: "लोगो",
        style_icon: "आइकन",
        style_banner: "बैनर",
        mode_label: "मोड",
        mode_background_removal: "बैकग्राउंड हटाएं | img2img | ~1cr",
        mode_upscale_image: "इमेज अपस्केल | img2img | ~5cr",
        mode_print_maker: "प्रिंट | स्टिकर | POD हेल्पर | txt2img | ~2cr",
        mode_photo_session: "फोटो सत्र | Kontext मॉडल | img2img | ~5cr",
        mode_fast_generation: "सबसे तेज़ | साधारण चित्र | txt2img | ~1cr",
        mode_pixplace_pro: "pixPLace Pro | लोगो | टेक्स्ट | img2img | ~5cr",
        size_label: "आकार",
        size_square: "1:1",
        size_portrait: "9:16",
        size_landscape: "16:9",
        generate_btn: "चित्र बनाएं",
        processing_title: "आपकी मास्टरपीस बना रहे हैं",
        processing_subtitle: "इसमें अधिकतम 60 सेकंड लग सकते हैं",
        step_analyzing: "प्रॉम्प्ट का विश्लेषण कर रहे हैं",
        step_generating: "चित्र बना रहे हैं",
        step_finalizing: "परिणाम अंतिम कर रहे हैं",
        elapsed_time: "लगा हुआ समय:",
        cancel_btn: "रद्द करें",
        create_new: "नया बनाएं",
        view_history: "इतिहास देखें",
        history_title: "जनरेशन इतिहास",
        empty_history_title: "अभी तक कोई जनरेशन नहीं",
        empty_history_subtitle: "इसे देखने के लिए अपनी पहली AI इमेज बनाएं",
        generation_time: "जनरेशन समय",
        error_prompt_required: "कृपया अपने चित्र का वर्णन करें",
        error_prompt_too_short: "प्रॉम्प्ट बहुत छोटा (न्यूनतम 5 अक्षर)",
        error_webhook_not_configured: "Webhook URL कॉन्फ़िगर नहीं है",
        error_generation_failed: "जनरेशन विफल रहा",
        error_timeout: "जनरेशन का समय समाप्त। कृपया पुनः प्रयास करें।",
        success_generated: "चित्र सफलतापूर्वक बनाया गया!",
        copied_to_clipboard: "क्लिपबोर्ड पर कॉपी किया गया",
        download_started: "डाउनलोड शुरू हुआ",
        limit_title: "जनरेशन सीमा तक पहुँचा",
        limit_message: "आप अपनी मुफ्त जनरेशन सीमा तक पहुँच चुके हैं। अद्यतन करें ताकि आप और चित्र बना सकें!",
        check_subsciption: "सदस्यता देखें",
        closeLimitModal: "शायद बाद में",
        upgradeBtn: "अब अपग्रेड करें",
        remove_user_image: "हटाएं",
        reference_image: "संदर्भ",
        upload_image: "छवि अपलोड करें",
        please_upload_photo_session: "फोटो सत्र मोड के लिए कृपया अपना चेहरा अपलोड करें। या कोई अन्य मोड चुनें",
        upload_failed: "छवि अपलोड विफल। कृपया पुनः प्रयास करें।",
        please_upload_for_upscale: "कृपया अपस्केल के लिए छवि अपलोड करें।",
        please_upload_for_background_removal: "कृपया बैकग्राउंड हटाने के लिए छवि अपलोड करें।"
    },

    ja: {
        loading: "どうぞお楽しみください",
        app_title: "pixPLace",
        connecting: "接続中...",
        connected: "Telegram に接続されました",
        welcome_title: "驚くべき画像を作成",
        welcome_subtitle: "あなたのビジョンを説明し、AI がそれを実現する様子を見ましょう",
        prompt_label: "プロンプト",
        prompt_placeholder: "あなたのビジョンを説明し、AI がそれを実現する様子を見ましょう...",
        style_label: "スタイル",
        style_realistic: "リアル",
        style_artistic: "アーティスティック",
        style_cartoon: "カートゥーン",
        style_fantasy: "ファンタジー",
        style_anime: "アニメ",
        style_cyberpunk: "サイバーパンク",
        style_popart: "ポップアート",
        style_abstract: "抽象",
        style_sketch: "スケッチ",
        style_3d: "3D",
        style_sticker: "ステッカー",
        style_vector: "ベクター",
        style_interior: "インテリア",
        style_architecture: "建築",
        style_fashion: "ファッション",
        style_tattoo: "タトゥー",
        style_print: "プリント",
        style_logo: "ロゴ",
        style_icon: "アイコン",
        style_banner: "バナー",
        mode_label: "モード",
        mode_background_removal: "背景除去 | img2img | ~1cr",
        mode_upscale_image: "画像アップスケール | img2img | ~5cr",
        mode_print_maker: "印刷 | ステッカー | POD ヘルパー | txt2img | ~2cr",
        mode_photo_session: "フォトセッション | Kontext モデル | img2img | ~5cr",
        mode_fast_generation: "最速 | シンプル画像 | txt2img | ~1cr",
        mode_pixplace_pro: "pixPLace Pro | ロゴ | テキスト | img2img | ~5cr",
        size_label: "サイズ",
        size_square: "1:1",
        size_portrait: "9:16",
        size_landscape: "16:9",
        generate_btn: "画像を生成",
        processing_title: "あなたの傑作を作成中",
        processing_subtitle: "最大 60 秒かかる場合があります",
        step_analyzing: "プロンプトを解析中",
        step_generating: "画像を生成中",
        step_finalizing: "結果を最終化しています",
        elapsed_time: "経過時間：",
        cancel_btn: "キャンセル",
        create_new: "新規作成",
        view_history: "履歴を見る",
        history_title: "生成履歴",
        empty_history_title: "まだ生成はありません",
        empty_history_subtitle: "ここに表示するには最初の AI 画像を作成してください",
        generation_time: "生成時間",
        error_prompt_required: "画像を説明してください",
        error_prompt_too_short: "プロンプトが短すぎます（最小 5 文字）",
        error_webhook_not_configured: "Webhook URL が設定されていません",
        error_generation_failed: "生成に失敗しました",
        error_timeout: "生成のタイムアウト。再試行してください。",
        success_generated: "画像が正常に生成されました！",
        copied_to_clipboard: "クリップボードにコピーしました",
        download_started: "ダウンロードを開始しました",
        limit_title: "生成制限に達しました",
        limit_message: "無料生成の上限に達しました。アップグレードして引き続き素晴らしい画像を作成しましょう！",
        check_subsciption: "サブスクリプションを確認",
        closeLimitModal: "後で",
        upgradeBtn: "今すぐアップグレード",
        remove_user_image: "削除",
        reference_image: "参照",
        upload_image: "画像をアップロード",
        please_upload_photo_session: "フォトセッションモードには顔写真をアップロードしてください。他のモードを選ぶこともできます",
        upload_failed: "画像のアップロードに失敗しました。再試行してください。",
        please_upload_for_upscale: "アップスケールするための画像をアップロードしてください。",
        please_upload_for_background_removal: "背景除去用の画像をアップロードしてください。"
    },

    it: {
        loading: "Per favore, divertiti",
        app_title: "pixPLace",
        connecting: "Connessione in corso...",
        connected: "Connesso a Telegram",
        welcome_title: "Crea immagini sorprendenti",
        welcome_subtitle: "Descrivi la tua visione e guarda l'IA realizzarla",
        prompt_label: "Prompt",
        prompt_placeholder: "Descrivi la tua visione e guarda l'IA realizzarla...",
        style_label: "Stile",
        style_realistic: "Realistico",
        style_artistic: "Artistico",
        style_cartoon: "Cartoon",
        style_fantasy: "Fantasy",
        style_anime: "Anime",
        style_cyberpunk: "Cyberpunk",
        style_popart: "Pop Art",
        style_abstract: "Astratto",
        style_sketch: "Schizzo",
        style_3d: "3D",
        style_sticker: "Sticker",
        style_vector: "Vettoriale",
        style_interior: "Interni",
        style_architecture: "Architettura",
        style_fashion: "Moda",
        style_tattoo: "Tatuaggio",
        style_print: "Stampa",
        style_logo: "Logo",
        style_icon: "Icona",
        style_banner: "Banner",
        mode_label: "Modalità",
        mode_background_removal: "Rimozione sfondo | img2img | ~1cr",
        mode_upscale_image: "Upscale immagine | img2img | ~5cr",
        mode_print_maker: "Stampa | Sticker | POD Helper | txt2img | ~2cr",
        mode_photo_session: "Sessione foto | Modello Kontext | img2img | ~5cr",
        mode_fast_generation: "Più veloce | Immagini semplici | txt2img | ~1cr",
        mode_pixplace_pro: "pixPLace Pro | Logo | Testo | img2img | ~5cr",
        size_label: "Dimensione",
        size_square: "1:1",
        size_portrait: "9:16",
        size_landscape: "16:9",
        generate_btn: "Genera immagine",
        processing_title: "Creazione del tuo capolavoro",
        processing_subtitle: "Potrebbe richiedere fino a 60 secondi",
        step_analyzing: "Analisi del prompt",
        step_generating: "Generazione immagine",
        step_finalizing: "Finalizzazione risultato",
        elapsed_time: "Tempo trascorso:",
        cancel_btn: "Annulla",
        create_new: "Crea nuovo",
        view_history: "Visualizza cronologia",
        history_title: "Cronologia generazioni",
        empty_history_title: "Nessuna generazione ancora",
        empty_history_subtitle: "Crea la tua prima immagine AI per vederla qui",
        generation_time: "Tempo di generazione",
        error_prompt_required: "Per favore descrivi la tua immagine",
        error_prompt_too_short: "Prompt troppo corto (minimo 5 caratteri)",
        error_webhook_not_configured: "URL webhook non configurato",
        error_generation_failed: "Generazione fallita",
        error_timeout: "Timeout di generazione. Per favore riprova.",
        success_generated: "Immagine generata con successo!",
        copied_to_clipboard: "Copiato negli appunti",
        download_started: "Download avviato",
        limit_title: "Limite di generazione raggiunto",
        limit_message: "Hai raggiunto il limite gratuito di generazioni. Effettua l'upgrade per continuare a creare immagini straordinarie!",
        check_subsciption: "Verifica abbonamento",
        closeLimitModal: "Forse più tardi",
        upgradeBtn: "Aggiorna ora",
        remove_user_image: "Rimuovi",
        reference_image: "Riferimento",
        upload_image: "Carica immagine",
        please_upload_photo_session: "Per la modalità Photo Session carica la foto del tuo volto. Oppure scegli un'altra modalità",
        upload_failed: "Caricamento immagine fallito. Per favore riprova.",
        please_upload_for_upscale: "Per favore carica un'immagine per l'upscale.",
        please_upload_for_background_removal: "Per favore carica un'immagine per la rimozione dello sfondo."
    },

    ko: {
        loading: "즐겁게 이용하세요",
        app_title: "pixPLace",
        connecting: "연결 중...",
        connected: "Telegram에 연결됨",
        welcome_title: "놀라운 이미지를 만들어보세요",
        welcome_subtitle: "당신의 비전을 설명하면 AI가 그것을 구현하는 모습을 볼 수 있습니다",
        prompt_label: "프롬프트",
        prompt_placeholder: "당신의 비전을 설명하면 AI가 그것을 구현하는 모습을 볼 수 있습니다...",
        style_label: "스타일",
        style_realistic: "리얼리스틱",
        style_artistic: "아티스틱",
        style_cartoon: "카툰",
        style_fantasy: "판타지",
        style_anime: "애니메",
        style_cyberpunk: "사이버펑크",
        style_popart: "팝 아트",
        style_abstract: "추상",
        style_sketch: "스케치",
        style_3d: "3D",
        style_sticker: "스티커",
        style_vector: "벡터",
        style_interior: "인테리어",
        style_architecture: "건축",
        style_fashion: "패션",
        style_tattoo: "타투",
        style_print: "프린트",
        style_logo: "로고",
        style_icon: "아이콘",
        style_banner: "배너",
        mode_label: "모드",
        mode_background_removal: "배경 제거 | img2img | ~1cr",
        mode_upscale_image: "이미지 업스케일 | img2img | ~5cr",
        mode_print_maker: "프린트 | 스티커 | POD 도우미 | txt2img | ~2cr",
        mode_photo_session: "포토 세션 | Kontext 모델 | img2img | ~5cr",
        mode_fast_generation: "가장 빠름 | 단순 이미지 | txt2img | ~1cr",
        mode_pixplace_pro: "pixPLace Pro | 로고 | 텍스트 | img2img | ~5cr",
        size_label: "크기",
        size_square: "1:1",
        size_portrait: "9:16",
        size_landscape: "16:9",
        generate_btn: "이미지 생성",
        processing_title: "당신의 걸작을 생성 중",
        processing_subtitle: "최대 60초가 소요될 수 있습니다",
        step_analyzing: "프롬프트 분석 중",
        step_generating: "이미지 생성 중",
        step_finalizing: "결과 마무리 중",
        elapsed_time: "경과 시간:",
        cancel_btn: "취소",
        create_new: "새로 만들기",
        view_history: "기록 보기",
        history_title: "생성 기록",
        empty_history_title: "아직 생성된 항목이 없습니다",
        empty_history_subtitle: "여기에 표시하려면 첫 번째 AI 이미지를 생성하세요",
        generation_time: "생성 시간",
        error_prompt_required: "이미지를 설명해 주세요",
        error_prompt_too_short: "프롬프트가 너무 짧습니다 (최소 5자)",
        error_webhook_not_configured: "Webhook URL이 설정되지 않았습니다",
        error_generation_failed: "생성 실패",
        error_timeout: "생성 시간이 초과되었습니다. 다시 시도하세요.",
        success_generated: "이미지 생성 완료!",
        copied_to_clipboard: "클립보드에 복사됨",
        download_started: "다운로드 시작됨",
        limit_title: "생성 한도 도달",
        limit_message: "무료 생성 한도에 도달했습니다. 업그레이드하여 계속 놀라운 이미지를 만들어보세요!",
        check_subsciption: "구독 확인",
        closeLimitModal: "나중에",
        upgradeBtn: "지금 업그레이드",
        remove_user_image: "제거",
        reference_image: "참고 이미지",
        upload_image: "이미지 업로드",
        please_upload_photo_session: "포토 세션 모드에는 얼굴 사진을 업로드하세요. 또는 다른 모드를 선택하세요",
        upload_failed: "이미지 업로드 실패. 다시 시도하세요.",
        please_upload_for_upscale: "업스케일할 이미지를 업로드하세요.",
        please_upload_for_background_removal: "배경 제거할 이미지를 업로드하세요."
    },

    tr: {
        loading: "Lütfen, iyi eğlenceler",
        app_title: "pixPLace",
        connecting: "Bağlanıyor...",
        connected: "Telegram'e bağlı",
        welcome_title: "Muhteşem Görseller Oluşturun",
        welcome_subtitle: "Vizyonunuzu anlatın, AI'nin onu hayata geçirmesini izleyin",
        prompt_label: "Prompt",
        prompt_placeholder: "Vizyonunuzu anlatın, AI'nin onu hayata geçirmesini izleyin...",
        style_label: "Stil",
        style_realistic: "Gerçekçi",
        style_artistic: "Sanatsal",
        style_cartoon: "Çizgi",
        style_fantasy: "Fantastik",
        style_anime: "Anime",
        style_cyberpunk: "Siberpunk",
        style_popart: "Pop Art",
        style_abstract: "Soyut",
        style_sketch: "Eskiz",
        style_3d: "3D",
        style_sticker: "Sticker",
        style_vector: "Vektör",
        style_interior: "İç Mekan",
        style_architecture: "Mimari",
        style_fashion: "Moda",
        style_tattoo: "Dövme",
        style_print: "Baskı",
        style_logo: "Logo",
        style_icon: "Simge",
        style_banner: "Afiş",
        mode_label: "Mod",
        mode_background_removal: "Arka Plan Kaldırma | img2img | ~1cr",
        mode_upscale_image: "Görüntü Yükseltme | img2img | ~5cr",
        mode_print_maker: "Baskı | Sticker | POD Yardımcı | txt2img | ~2cr",
        mode_photo_session: "Fotoğraf Oturumu | Kontext Modeli | img2img | ~5cr",
        mode_fast_generation: "En Hızlı | Basit Görseller | txt2img | ~1cr",
        mode_pixplace_pro: "pixPLace Pro | Logo | Metin | img2img | ~5cr",
        size_label: "Boyut",
        size_square: "1:1",
        size_portrait: "9:16",
        size_landscape: "16:9",
        generate_btn: "Görsel Oluştur",
        processing_title: "Başyapıtınızı oluşturuyoruz",
        processing_subtitle: "Bu işlem 60 saniyeye kadar sürebilir",
        step_analyzing: "Prompt analiz ediliyor",
        step_generating: "Görsel oluşturuluyor",
        step_finalizing: "Sonuç tamamlanıyor",
        elapsed_time: "Geçen süre:",
        cancel_btn: "İptal",
        create_new: "Yeni oluştur",
        view_history: "Geçmişi görüntüle",
        history_title: "Oluşturma Geçmişi",
        empty_history_title: "Henüz oluşturma yok",
        empty_history_subtitle: "Burada görmek için ilk AI görselinizi oluşturun",
        generation_time: "Oluşturma süresi",
        error_prompt_required: "Lütfen görselinizi tanımlayın",
        error_prompt_too_short: "Prompt çok kısa (minimum 5 karakter)",
        error_webhook_not_configured: "Webhook URL yapılandırılmamış",
        error_generation_failed: "Oluşturma başarısız",
        error_timeout: "Oluşturma zaman aşımı. Lütfen tekrar deneyin.",
        success_generated: "Görsel başarıyla oluşturuldu!",
        copied_to_clipboard: "Panoya kopyalandı",
        download_started: "İndirme başladı",
        limit_title: "Oluşturma Limiti Aşıldı",
        limit_message: "Ücretsiz oluşturma limitinize ulaştınız. Devam etmek için yükseltin!",
        check_subsciption: "Aboneliği kontrol et",
        closeLimitModal: "Belki Sonra",
        upgradeBtn: "Şimdi yükselt",
        remove_user_image: "Kaldır",
        reference_image: "Referans",
        upload_image: "Görsel Yükle",
        please_upload_photo_session: "Fotoğraf Oturumu modu için lütfen yüz fotoğrafınızı yükleyin. Veya başka bir mod seçin",
        upload_failed: "Görsel yükleme başarısız. Lütfen tekrar deneyin.",
        please_upload_for_upscale: "Lütfen yükseltme için bir görsel yükleyin.",
        please_upload_for_background_removal: "Lütfen arka plan kaldırma için bir görsel yükleyin."
    },

    pl: {
        loading: "Proszę, baw się dobrze",
        app_title: "pixPLace",
        connecting: "Łączenie...",
        connected: "Połączono z Telegram",
        welcome_title: "Twórz niesamowite obrazy",
        welcome_subtitle: "Opisz swoją wizję i zobacz, jak AI ją realizuje",
        prompt_label: "Prompt",
        prompt_placeholder: "Opisz swoją wizję i zobacz, jak AI ją realizuje...",
        style_label: "Styl",
        style_realistic: "Realistyczny",
        style_artistic: "Artystyczny",
        style_cartoon: "Kreskówka",
        style_fantasy: "Fantazja",
        style_anime: "Anime",
        style_cyberpunk: "Cyberpunk",
        style_popart: "Pop Art",
        style_abstract: "Abstrakcja",
        style_sketch: "Szkic",
        style_3d: "3D",
        style_sticker: "Naklejka",
        style_vector: "Wektor",
        style_interior: "Wnętrze",
        style_architecture: "Architektura",
        style_fashion: "Moda",
        style_tattoo: "Tatuaż",
        style_print: "Druk",
        style_logo: "Logo",
        style_icon: "Ikona",
        style_banner: "Baner",
        mode_label: "Tryb",
        mode_background_removal: "Usuwanie tła | img2img | ~1cr",
        mode_upscale_image: "Skalowanie obrazu | img2img | ~5cr",
        mode_print_maker: "Druk | Naklejka | POD Pomocnik | txt2img | ~2cr",
        mode_photo_session: "Sesja zdjęciowa | Model Kontext | img2img | ~5cr",
        mode_fast_generation: "Najszybszy | Proste obrazy | txt2img | ~1cr",
        mode_pixplace_pro: "pixPLace Pro | Logo | Tekst | img2img | ~5cr",
        size_label: "Rozmiar",
        size_square: "1:1",
        size_portrait: "9:16",
        size_landscape: "16:9",
        generate_btn: "Generuj obraz",
        processing_title: "Tworzymy Twoje arcydzieło",
        processing_subtitle: "To może potrwać do 60 sekund",
        step_analyzing: "Analizowanie promptu",
        step_generating: "Generowanie obrazu",
        step_finalizing: "Finalizowanie wyniku",
        elapsed_time: "Upłynęło czasu:",
        cancel_btn: "Anuluj",
        create_new: "Utwórz nowe",
        view_history: "Zobacz historię",
        history_title: "Historia generacji",
        empty_history_title: "Brak wygenerowanych obrazów",
        empty_history_subtitle: "Stwórz swój pierwszy obraz AI, aby zobaczyć go tutaj",
        generation_time: "Czas generacji",
        error_prompt_required: "Proszę opisać obraz",
        error_prompt_too_short: "Prompt za krótki (minimum 5 znaków)",
        error_webhook_not_configured: "Adres webhook nie jest skonfigurowany",
        error_generation_failed: "Generowanie nie powiodło się",
        error_timeout: "Przekroczono czas generowania. Spróbuj ponownie.",
        success_generated: "Obraz został wygenerowany pomyślnie!",
        copied_to_clipboard: "Skopiowano do schowka",
        download_started: "Rozpoczęto pobieranie",
        limit_title: "Osiągnięto limit generacji",
        limit_message: "Osiągnąłeś swój darmowy limit generacji. Zaktualizuj konto, aby kontynuować tworzenie wspaniałych obrazów!",
        check_subsciption: "Sprawdź subskrypcję",
        closeLimitModal: "Może później",
        upgradeBtn: "Zaktualizuj teraz",
        remove_user_image: "Usuń",
        reference_image: "Referencja",
        upload_image: "Prześlij obraz",
        please_upload_photo_session: "Proszę przesłać zdjęcie twarzy do trybu Photo Session. Lub wybierz inny tryb",
        upload_failed: "Przesyłanie obrazu nie powiodło się. Spróbuj ponownie.",
        please_upload_for_upscale: "Proszę przesłać obraz do skalowania.",
        please_upload_for_background_removal: "Proszę przesłać obraz do usunięcia tła."
    }
};

class AppState {
    constructor() {
        this.tg = null;
        this.currentLanguage = CONFIG.DEFAULT_LANGUAGE;
        this.currentTheme = 'dark';
        this.selectedStyle = 'realistic';
        this.isGenerating = false;
        this.userId = null;
        this.userName = null;
        this.generationHistory = [];
        this.currentGeneration = null;
        this.startTime = null;
        this.timerInterval = null;
        // Добавлено отображение баланса пользователя
        this.userCredits = null; // текущий баланс кредитов
        this.lastBalanceUpdate = null; // время последнего обновления баланса
    }

    // Language methods
    setLanguage(lang) {
        if (CONFIG.LANGUAGES.includes(lang)) {
            this.currentLanguage = lang;
            document.body.setAttribute('data-lang', lang);
            this.updateTranslations();
            this.saveSettings();
        }
    }

    toggleLanguage() {
        const currentIndex = CONFIG.LANGUAGES.indexOf(this.currentLanguage);
        const nextIndex = (currentIndex + 1) % CONFIG.LANGUAGES.length;
        this.setLanguage(CONFIG.LANGUAGES[nextIndex]);
    }

    translate(key) {
        return TRANSLATIONS[this.currentLanguage]?.[key] || TRANSLATIONS[CONFIG.DEFAULT_LANGUAGE]?.[key] || key;
    }

    updateTranslations() {
        // Обычные элементы с data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.translate(key);
        });

        // Элементы с placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.translate(key);
        });

        // Элементы с data-i18n-price для ценовых данных
        document.querySelectorAll('[data-i18n-price]').forEach(element => {
            const key = element.getAttribute('data-i18n-price');
            element.textContent = this.translate(key);
        });
    }

    // Theme methods
    setTheme(theme) {
        this.currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        this.saveSettings();
    }

    toggleTheme() {
        const themes = ['light', 'dark', 'auto'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.setTheme(themes[nextIndex]);
    }
    // Storage methods
    saveSettings() {
        try {
            localStorage.setItem('appSettings', JSON.stringify({
                language: this.currentLanguage,
                theme: this.currentTheme
            }));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }

    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
            if (settings.language) this.setLanguage(settings.language);
            if (settings.theme) this.setTheme(settings.theme);
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    saveHistory() {
        try {
            localStorage.setItem('generationHistory', JSON.stringify(this.generationHistory));
        } catch (error) {
            console.error('Failed to save history:', error);
        }
    }

    loadHistory() {
        try {
            const history = localStorage.getItem('generationHistory');
            if (history) {
                this.generationHistory = JSON.parse(history);
            }
        } catch (error) {
            console.error('Failed to load history:', error);
            this.generationHistory = [];
        }
    }
}

// 🎯 Global state
const appState = new AppState();

// ⚡ Ultra-Fast Global Image Loading Manager - Max Performance
class GlobalHistoryLoader {
    constructor() {
        // Singleton pattern - only one Observer per app
        if (GlobalHistoryLoader.instance) {
            return GlobalHistoryLoader.instance;
        }

        this.imageObserver = new IntersectionObserver(
            this.handleIntersection.bind(this),
            {
                rootMargin: '100px', // уменьшен для точности (было 300px)
                threshold: 0.1, // повышен для точности (было 0.01)
                root: null, // viewport
            }
        );

        // Оптимизированные registry с Map для O(1) доступа
        this.observedImages = new Map();
        this.loadingQueue = new Set();
        this.maxConcurrent = 6; // ограничиваем одновременные загрузки (увеличено с 3)
        this.pendingQueue = []; // очередь ожидающих загрузки
        this.logout = false;

        GlobalHistoryLoader.instance = this;
        console.log('🚀 Ultra-Fast Global History Loader initialized with max performance');
    }

    handleIntersection(entries, observer) {
        if (this.logout) return;

        // Убираем спам - логируем только если много записей (предупреждение о перегрузке)
        if (entries.length > 10) {
            console.warn('⚡ IntersectionObserver triggered:', entries.length, 'entries - performance warning');
        }

        // Оптимизированная обработка с улучшенными порогами
        const highPriorityEntries = [];
        const normalPriorityEntries = [];
        const lowPriorityEntries = [];
        const invisibleEntries = [];

        for (const entry of entries) {
            // Убираем спам - логируем только в 2% случаев и только базовую информацию
            if (Math.random() < 0.02) {
                console.log('📊 Entry intersection:', entry.intersectionRatio.toFixed(2));
            }

            if (entry.isIntersecting) {
                // Высокий приоритет - изображения в центре экрана (40%+ видимости, снижен для скорости)
                if (entry.intersectionRatio >= 0.4) {
                    highPriorityEntries.push(entry);
                }
                // Нормальный приоритет - достаточная видимость (15%+ видимости, снижен для скорости)
                else if (entry.intersectionRatio >= 0.15) {
                    normalPriorityEntries.push(entry);
                }
                // Низкий приоритет - слабая видимость (для предзагрузки)
                else if (entry.intersectionRatio > 0.1) {
                    lowPriorityEntries.push(entry);
                }
            } else {
                invisibleEntries.push(entry);
            }
        }

        // Обрабатываем с высоким приоритетом вначале
        if (highPriorityEntries.length > 0 || normalPriorityEntries.length > 0) {
            console.log('🎯 Processing high/normal priority images:', highPriorityEntries.length + normalPriorityEntries.length);
            this.processVisibleImages([...highPriorityEntries, ...normalPriorityEntries]);
        }

        // Низкий приоритет обрабатываем с задержкой
        if (lowPriorityEntries.length > 0) {
            setTimeout(() => {
                console.log('🎯 Processing low priority images:', lowPriorityEntries.length);
                this.processVisibleImages(lowPriorityEntries);
            }, 200);
        }

        // Очищаем невидимые изображения (низкий приоритет)
        if (invisibleEntries.length > 0) {
            setTimeout(() => {
                this.cleanupInvisibleImages(invisibleEntries);
            }, 1000); // отложенная очистка
        }
    }

    processVisibleImages(entries) {
        console.log(`👁️ Processing ${entries.length} visible images`);

        for (const entry of entries) {
            const img = entry.target;

            // Быстрая проверка через Map
            if (!this.observedImages.has(img)) continue;

            // Уже загруженные пропускаем
            if (img.src && !img.dataset.src) {
                this.safeUnobserve(img);
                continue;
            }

            // Ленивая загрузка только если есть src для загрузки
            if (img.dataset.src && !this.loadingQueue.has(img)) {
                this.startLoading(img);
            }
        }
    }

    startLoading(img) {
        const container = img.closest('.history-mini');

        // Пропускаем загрузку если контейнер поврежден или еще загружается
        if (!container || container.classList.contains('history-loading')) {
            return;
        }

        // Если превышен лимит параллельных загрузок - добавляем в очередь
        if (this.loadingQueue.size >= this.maxConcurrent) {
            this.pendingQueue.push(img);
            return;
        }

        this.loadingQueue.add(img);

        // Установка src с обработкой ошибок
        const loadPromise = new Promise((resolve, reject) => {
            img.onload = () => {
                img.classList.add('loaded');
                delete img.dataset.src; // очищаем data-src
                console.log('✅ Image loaded successfully');
                resolve();
            };

            img.onerror = () => {
                console.warn('❌ Image load failed');
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+';
                resolve();
            };

            // Запуск загрузки
            img.src = img.dataset.src;
        });

        loadPromise.finally(() => {
            this.loadingQueue.delete(img);
            this.safeUnobserve(img);

            // Обработать следующий из очереди, если есть место
            if (this.pendingQueue.length > 0 && this.loadingQueue.size < this.maxConcurrent) {
                const nextImg = this.pendingQueue.shift();
                this.startLoading(nextImg);
            }
        });
    }

    cleanupInvisibleImages(entries) {
        for (const entry of entries) {
            const img = entry.target;

            // Оставляем наблюдаемыми если изображение еще не загрузилось
            if (img.dataset.src && !img.src) {
                continue;
            }

            // Оставляем наблюдаемыми если они в очереди загрузки
            if (this.loadingQueue.has(img)) {
                continue;
            }

            // Безопасное отключение наблюдения
            this.safeUnobserve(img);
        }
    }

    observe(img) {
        if (!img || img.nodeType !== 1) return; // проверка что элемент существует

        // Быстрая проверка через Map
        if (this.observedImages.has(img)) return;

        this.imageObserver.observe(img);
        this.observedImages.set(img, true);

        console.log(`👁️ Started observing image: ${img.src || img.dataset.src}`);
    }

    safeUnobserve(img) {
        if (!img || !this.observedImages.has(img)) return;

        try {
            this.imageObserver.unobserve(img);
            this.observedImages.delete(img);
        } catch (error) {
            console.warn('Failed to unobserve image:', error);
        }
    }

    // 🔧 ДОБАВЛЕНИЕ: Оптимизированная массовая очистка с улучшенной проверкой
    massCleanup() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;

        const currentImages = historyList.querySelectorAll('.history-mini img');
        const validImageSet = new WeakSet(Array.from(currentImages));

        let cleanupCount = 0;
        let maxObserversExceeded = 0;

        // 🔧 ИСПРАВЛЕНИЕ: Ограничение количества активных наблюдателей для производительности
        const MAX_ACTIVE_OBSERVERS = 40; // увеличено до 40 для больших страниц

        // Проходим по всем наблюдаемым элементам
        for (const [img] of this.observedImages) {
            // Удаляем если элемент больше не существует или не в истории
            if (!img || !img.isConnected || !validImageSet.has(img)) {
                this.safeUnobserve(img);
                cleanupCount++;
            } else if (this.observedImages.size > MAX_ACTIVE_OBSERVERS && !img.dataset.src) {
                // 🔧 ИСПРАВЛЕНИЕ: Уменьшаем количество активных наблюдателей для производительности (только загруженные)
                this.safeUnobserve(img);
                maxObserversExceeded++;
            }
        }

        // Очищаем очередь загрузки от несуществующих элементов
        for (const img of this.loadingQueue) {
            if (!img || !img.isConnected) {
                this.loadingQueue.delete(img);
                cleanupCount++;
            }
        }

        if (cleanupCount > 0 || maxObserversExceeded > 0) {
            console.log(`🧹 Enhanced Mass cleanup: ${cleanupCount} elements removed, ${maxObserversExceeded} observers trimmed (max: ${MAX_ACTIVE_OBSERVERS})`);
        }
    }

    // Полная очистка при завершении работы
    destroy() {
        this.logout = true;

        // Отключаем все наблюдения
        this.imageObserver.disconnect();

        // Очищаем все коллекции
        this.observedImages.clear();
        this.loadingQueue.clear();

        GlobalHistoryLoader.instance = null;
        console.log('💣 Ultra-Fast Global History Loader destroyed completely');
    }

    // Статистика работы
    getStats() {
        return {
            observedImages: this.observedImages.size,
            loadingQueue: this.loadingQueue.size,
            total: this.observedImages.size + this.loadingQueue.size
        };
    }
}

// Global instance
const globalHistoryLoader = new GlobalHistoryLoader();

// ⚡ Smart History Management with Virtualization
class HistoryManager {
    static PAGE_SIZE = 20; // количество элементов на страницу
    static CACHE_SIZE = 100; // размер кэша DOM элементов

    // Кэш DOM элементов для переиспользования
    static elementCache = new Map();
    static currentPage = 0;
    static maxLoadedPage = 0;
    static isLoadingPage = false;

    static getVisibleItems(limit = 15) {
        // Фильтруем только элементы с валидными результатами (исключаем undefined/null)
        const validItems = appState.generationHistory.filter(item =>
            item.result &&
            typeof item.result === 'string' &&
            item.result.trim() !== '' &&
            item.result !== 'undefined'
        );

        return validItems.slice(0, limit);
    }

    static getValidItemsOnly() {
        return appState.generationHistory.filter(item =>
            item.result &&
            typeof item.result === 'string' &&
            item.result.trim() !== '' &&
            item.result !== 'undefined'
        );
    }

    static getItemsForPage(page) {
        const validItems = this.getValidItemsOnly();
        const start = page * this.PAGE_SIZE;
        const end = start + this.PAGE_SIZE;
        return validItems.slice(start, end);
    }

    static getTotalPages() {
        const validCount = this.getValidItemsOnly().length;
        return Math.ceil(validCount / this.PAGE_SIZE);
    }

    static hasMorePages(page) {
        return page < this.getTotalPages() - 1;
    }

    static getTotalCount() {
        return appState.generationHistory.length;
    }

    static needsShowMore(limit = 15) {
        const validCount = this.getValidItemsOnly().length;
        return validCount > limit;
    }

    static getValidTotalCount() {
        return this.getValidItemsOnly().length;
    }

    // Метод для создания/получения кэшированного DOM элемента с защитой от утечек
    static createHistoryItemElement(item, forceNoCache = false) {
        // 🔧 ИСПРАВЛЕНИЕ: Упрощенная генерация cacheKey для избежания лишних промахов кеша
        // Используем только основные данные: ID и результат (без лишних параметров)
        const cacheKey = `hist_${item.id}_${item.result || 'no-result'}`;

        // Убираем спам логирования - логируем только в 1% случаев для отладки
        if (Math.random() < 0.01) {
            console.log(`🔑 Generated cacheKey: ${cacheKey} for item ${item.id}`);
        }

        // Сначала проверяем кэш (если кэширование не отключено)
        if (!forceNoCache && this.elementCache.has(cacheKey)) {
            // Убираем спам в консоль - логируем только в 1% случаев
            if (Math.random() < 0.01) {
                console.log(`✅ Cache hit for item ${item.id}`);
            }
            return this.elementCache.get(cacheKey).cloneNode(true);
        }

        // Убираем спам логирования - только в 5% случаев для отслеживания промахов
        if (Math.random() < 0.05) {
            console.log(`📦 Cache miss for item ${item.id}, creating new element`);
        }

        // Создаем новый элемент
        const element = this.createHistoryItemElementFromScratch(item);

        // Добавляем в кэш если статус финальный (success/error) и кэширование не отключено
        if (!forceNoCache && (item.status === 'success' || item.status === 'error')) {
            // 🔧 ИСПРАВЛЕНИЕ: Автоматическая очистка при 80% заполнения (раньше было > CACHE_SIZE)
            if (this.elementCache.size >= Math.floor(this.CACHE_SIZE * 0.8)) {
                this.autoCleanupCache();
            }

            this.elementCache.set(cacheKey, element.cloneNode(true));

            // 🔧 ИСПРАВЛЕНИЕ: Очищаем уже существующие кэшированные элементы чтобы избежать переполнения
            if (this.elementCache.size > this.CACHE_SIZE) {
                this.forceCleanupOldElements(5); // очищаем 5 самых старых элементов
            }

            console.log(`💾 Cached element for ${cacheKey}, cache size: ${this.elementCache.size}/${this.CACHE_SIZE}`);
        }

        return element;
    }

    // 🔧 ДОБАВЛЕНИЕ: Автоматическая очистка кэша элементов по LRU принципу
    static autoCleanupCache() {
        const currentSize = this.elementCache.size;
        if (currentSize < Math.floor(this.CACHE_SIZE * 0.7)) return; // не очищаем если меньше 70%

        const keysToRemove = Math.floor(currentSize * 0.2); // очищаем 20% самых старых
        this.forceCleanupOldElements(keysToRemove);

        console.log(`🧹 Auto-cleaned history cache: ${currentSize} → ${this.elementCache.size}`);
    }

    // 🔧 ДОБАВЛЕНИЕ: Принудительная очистка старых элементов кэша
    static forceCleanupOldElements(count = 1) {
        const keys = Array.from(this.elementCache.keys());
        for (let i = 0; i < Math.min(count, keys.length); i++) {
            this.elementCache.delete(keys[i]);
        }
    }

    static createHistoryItemElementFromScratch(item) {
        const element = document.createElement('div');
        element.className = 'history-mini';
        element.id = `history-${item.id}`;
        element.onclick = () => viewHistoryItem(item.id);

        element.innerHTML = `
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIj48L3JlY3Q+PC9zdmc+"
                 data-src="${item.result || ''}"
                 alt="Generated"
                 class="lazy-loading"
                 loading="lazy"
                 decoding="async"
                 ${item.result ? '' : 'style="opacity: 0.7;"'}
                 />
            <p class="history-caption">${new Date(item.timestamp).toLocaleDateString()} | ${appState.translate('style_' + item.style)} | ${appState.translate('mode_' + item.mode)}</p>
        `;

        return element;
    }

    // Метод для очистки кэша
    static clearCache() {
        this.elementCache.clear();
        this.currentPage = 0;
        this.maxLoadedPage = 0;
        this.isLoadingPage = false;
        console.log('🧹 History cache cleared');
    }
}



// 🎯 Utility Functions
function showStatus(type, message) {
    const statusBar = document.getElementById('statusBar');
    const statusText = document.querySelector('.status-text');

    if (statusBar && statusText) {
        statusText.textContent = message;
        statusBar.className = `status-bar ${type} show`;

        setTimeout(() => {
            statusBar.classList.remove('show');
        }, 3000);
    }
}

function showToast(type, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);

    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => container.removeChild(toast), 300);
    }, 3000);
}

function triggerHaptic(type) {
    if (appState.tg?.HapticFeedback) {
        switch (type) {
            case 'light':
                appState.tg.HapticFeedback.impactOccurred('light');
                break;
            case 'medium':
                appState.tg.HapticFeedback.impactOccurred('medium');
                break;
            case 'heavy':
                appState.tg.HapticFeedback.impactOccurred('heavy');
                break;
            case 'success':
                appState.tg.HapticFeedback.notificationOccurred('success');
                break;
            case 'error':
                appState.tg.HapticFeedback.notificationOccurred('error');
                break;
        }
    }
}


// 📊 Processing Animation
function updateProcessingSteps(activeStep) {
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index + 1 <= activeStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    // Update progress circle
    const progressCircle = document.querySelector('.progress-circle');
    if (progressCircle) {
        const progress = (activeStep / 3) * 283; // 283 is circumference
        progressCircle.style.strokeDashoffset = 283 - progress;
    }
}
function updateProgressBar(elapsed) {
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');

    if (progressBar && progressFill) {
        // Примерный прогресс на основе времени (0-100%)
        const maxTime = 60; // максимальное ожидаемое время в секундах
        const progress = Math.min((elapsed / maxTime) * 100, 100);
        progressFill.style.width = progress + '%';
    }

    // Обновить круговой прогресс, если есть
    const progressCircle = document.querySelector('.progress-circle');
    if (progressCircle) {
        const circumference = 283; // окружность круга
        const progress = Math.min((elapsed / 60) * 100, 100);
        const offset = circumference - (progress / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
    }
}
function startTimer() {
    const elapsedTimeElement = document.getElementById('elapsedTime');
    let step = 1;

    appState.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - appState.startTime) / 1000);
        if (elapsedTimeElement) {
            elapsedTimeElement.textContent = elapsed + 's';
        }
        updateProgressBar(elapsed);
        // Update steps based on time

    }, 1000);
}

function stopTimer() {
    if (appState.timerInterval) {
        clearInterval(appState.timerInterval);
        appState.timerInterval = null;
    }
}

// 📋 History Management

function showBackButton(show) {
    const body = document.body;
    if (show) {
        body.classList.add('show-back');
    } else {
        body.classList.remove('show-back');
    }
}

function toggleHistoryList() {
    const list = document.getElementById('historyList');
    const btn = document.getElementById('historyToggleBtn');
    if (list.classList.contains('hidden')) {
        list.classList.remove('hidden');
        btn.classList.add('active');
        updateHistoryDisplay();

        // Дополнительная быстрая прокрутка к последнему (нижнему) изображению после открытия истории
        setTimeout(async () => {
            await scrollToBottomImage();
        }, 150);
    } else {
        list.classList.add('hidden');
        btn.classList.remove('active');
    }
}

function updateHistoryDisplay(page = 0) {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    const validItems = HistoryManager.getValidItemsOnly();
    if (validItems.length === 0) {
        historyList.innerHTML = `
    <div class="empty-history">
    <div class="empty-icon">📋</div>
    <h3 data-i18n="empty_history_title">${appState.translate('empty_history_title')}</h3>
    <p data-i18n="empty_history_subtitle">${appState.translate('empty_history_subtitle')}</p>
    </div>
    `;
        return;
    }

    // Если это первая страница - очищаем список
    if (page === 0) {
        historyList.innerHTML = '';
        HistoryManager.clearCache();
        console.log('📋 Cleared history list for fresh display');
    }

    // Устанавливаем лимит загрузки в зависимости от страницы
    const itemsPerPage = page === 0 ? 8 : 15; // первый раз 8 изображений, потом 15

    // Загружаем элементы страницы
    if (HistoryManager.isLoadingPage) {
        console.log('⚡ Page already loading, skipping...');
        return;
    }

    HistoryManager.isLoadingPage = true;
    const pageItems = HistoryManager.getItemsForPage(page);

    if (pageItems.length > 0) {
        console.log(`📄 Loading page ${page} with ${pageItems.length} items`);

        // Добавляем элементы страницы
        pageItems.forEach(item => {
            const element = HistoryManager.createHistoryItemElement(item);
            if (element) {
                historyList.appendChild(element);
                // Подключаем к Observer для ленивой загрузки
                const img = element.querySelector('img[data-src]');
                if (img) globalHistoryLoader.observe(img);
            }
        });

        HistoryManager.maxLoadedPage = page;
        HistoryManager.currentPage = page;

        // Управляем кнопкой загрузки следующей страницы
        const existingBtn = document.getElementById('loadMoreHistoryBtn');

        if (HistoryManager.hasMorePages(page)) {
            if (existingBtn) {
                // Если кнопка уже существует - переносим её в конец списка
                historyList.appendChild(existingBtn);
            } else {
                // Создаём новую кнопку
                const loadMoreBtn = document.createElement('button');
                loadMoreBtn.className = 'load-more-btn';
                loadMoreBtn.id = 'loadMoreHistoryBtn';
                // Добавляем иконку стрелки вниз
                loadMoreBtn.innerHTML = `
                    <span>Загрузить ещё...</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="btn-icon">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                    <span class="btn-ripple"></span>
                `;

                // Исправляем обработчик: только загрузка истории, без генерации
                loadMoreBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    loadNextHistoryPage();
                };

                historyList.appendChild(loadMoreBtn);
            }
        } else {
            // Удаляем кнопку если достигли конца истории
            if (existingBtn) {
                existingBtn.remove();
            }
        }
    }

    HistoryManager.isLoadingPage = false;
}

// Функция для загрузки следующей страницы истории
function loadNextHistoryPage() {
    const nextPage = HistoryManager.currentPage + 1;
    if (!HistoryManager.hasMorePages(HistoryManager.currentPage)) {
        console.log('📄 No more pages to load');
        return;
    }

    console.log(`📄 Loading next history page: ${nextPage}`);
    updateHistoryDisplay(nextPage);

    // Обновляем текст кнопки загрузки
    setTimeout(() => {
        const btn = document.getElementById('loadMoreHistoryBtn');
        if (btn) {
            if (!HistoryManager.hasMorePages(nextPage)) {
                btn.textContent = 'Все загружено! 🎉';
                btn.disabled = true;
                btn.style.opacity = '0.5';
            } else {
                btn.textContent = 'Загрузить ещё...';
                btn.disabled = false;
            }
            // Прокрутка к новой кнопке для активации загрузки изображений
            btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 300);
}

// Функция для показа всей истории без виртуализации (для совместимости)
function showAllHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    // Отключаем виртуализацию для полного показа
    HistoryManager.clearCache();

    // Показываем все элементы
    historyList.innerHTML = HistoryManager.getValidItemsOnly().map(item => {
        const element = HistoryManager.createHistoryItemElement(item);
        return element.outerHTML;
    }).join('');

    // Подключаем Observer ко всем новым картинкам
    const newImages = historyList.querySelectorAll('img[data-src]');
    newImages.forEach(img => globalHistoryLoader.observe(img));

    console.log('📄 All history loaded without virtualization');
}

function getStatusText(status) {
    switch (status) {
        case 'processing': return '⏳';
        case 'success': return '✅';
        case 'error': return '❌';
        default: return status;
    }
}

function viewHistoryItem(id) {
    const item = appState.generationHistory.find(h => h.id == id);
    if (item && item.result) {
        appState.currentGeneration = item;
        showResult({ image_url: item.result });
    }
}

function clearHistory() {
    if (confirm('Clear all generation history?')) {
        appState.generationHistory = [];
        appState.saveHistory();
        if (!document.getElementById('historyList').classList.contains('hidden')) {
            updateHistoryDisplay();
        }
        triggerHaptic('medium');
    }
}

function showHistory() {
    toggleHistoryList();
}

window.toggleHistoryList = toggleHistoryList;

// Функция для полного экрана истории
function updateHistoryDisplayFullScreen() {
    const historyContent = document.getElementById('historyContent');
    if (!historyContent) return;

    if (appState.generationHistory.length === 0) {
        historyContent.innerHTML = `
    <div class="empty-history">
    <div class="empty-icon">📋</div>
    <h3 data-i18n="empty_history_title">${appState.translate('empty_history_title')}</h3>
    <p data-i18n="empty_history_subtitle">${appState.translate('empty_history_subtitle')}</p>
    </div>
    `;
        return;
    }

    historyContent.innerHTML = appState.generationHistory.map(item => `
    <div class="history-item" onclick="viewHistoryItem('${item.id}')">
    <div class="history-header">
    <span class="history-date">${new Date(item.timestamp).toLocaleString()}</span>
    <span class="history-status ${item.status}">${getStatusText(item.status)}</span>
    </div>
    <div class="history-prompt">${item.prompt}</div>
    <div class="history-details">
    <span class="info-pair">
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFF"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-220 40q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-518q0-121-92.5-201.5T488-800q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z"/></svg>
    ${appState.translate('style_' + item.style)}
    </span>
    <span class="info-pair">
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFF"><path d="M240-40v-329L110-580l185-300h370l185 300-130 211v329l-240-80-240 80Zm80-111 160-53 160 53v-129H320v129Zm20-649L204-580l136 220h280l136-220-136-220H340Zm98 383L296-558l57-57 85 85 169-170 57 56-226 227ZM320-280h320-320Z"/></svg>
    ${appState.translate('mode_' + item.mode)}
    </span>
    ${item.duration ? `<span> ⏱ ${Math.round(item.duration / 1000)}s</span>` : ''}
    </div>
    ${item.result ? `<img src="${item.result}" alt="Generated" class="history-image" loading="lazy" />` : ''}
    ${item.error ? `<p style="color: var(--error-500); font-size: var(--font-size-sm); margin-top: var(--space-2);">❌ ${item.error}</p>` : ''}
    </div>
    `).join('');
    showBackButton(true); // показать

}

function getStatusText(status) {
    switch (status) {
        case 'processing': return '⏳';
        case 'success': return '✅';
        case 'error': return '❌';
        default: return status;
    }
}

function viewHistoryItem(id) {
    const item = appState.generationHistory.find(h => h.id == id);
    if (item && item.result) {
        appState.currentGeneration = item;
        showResult({ image_url: item.result });
    }
}

function clearHistory() {
    if (confirm('Clear all generation history?')) {
        appState.generationHistory = [];
        appState.saveHistory();
        updateHistoryDisplay();
        triggerHaptic('medium');
    }
}
function showHistory() {
    showScreen('historyScreen');
    updateHistoryDisplay();
}

// Функция плавной прокрутки к истории и открытия списка
async function showHistoryWithScroll() {
    const historyBtn = document.getElementById('historyToggleBtn');
    const historyList = document.getElementById('historyList');

    if (historyBtn) {
        // Плавная прокрутка к кнопке истории - центрируем её
        historyBtn.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });
    }

    // Подождем завершения прокрутки
    await new Promise(resolve => setTimeout(resolve, 300));

    // Автоматически открываем список истории если он закрыт
    if (historyList && historyList.classList.contains('hidden')) {
        const btn = document.getElementById('historyToggleBtn');
        historyList.classList.remove('hidden');
        btn.classList.add('active');
        updateHistoryDisplay();

        // Ждем пока DOM обновится после открытия
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Дополнительная прокрутка к крайнему (новому) изображению после открытия истории
    await scrollToLatestImage();
}

// Функция быстрой прокрутки к крайнему (новому) изображению в истории
async function scrollToLatestImage() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    // Убираем излишнюю задержку - она только замедляет
    await new Promise(resolve => setTimeout(resolve, 50));

    // Ищем первый элемент истории (это будет крайнее/новое изображение)
    const firstHistoryItem = historyList.querySelector('.history-mini');
    if (firstHistoryItem) {
        // Убираем спам логирования - логируем только в 5% случаев
        if (Math.random() < 0.05) {
            console.log('🚀 Быстрая прокрутка к крайнему изображению');
        }

        // Быстрая прокрутка без плавности для мгновенного показа
        firstHistoryItem.scrollIntoView({
            behavior: 'instant', // 'instant' для быстрой прокрутки
            block: 'start', // scroll to top of the element instead of center
            inline: 'nearest'
        });

        // Убираем анимацию и подсветку - они бесполезны и замедляют
        if (Math.random() < 0.05) {
            console.log('✅ Прокрутка к крайнему изображению завершена');
        }
    } else {
        // Убираем спам логирования
        if (Math.random() < 0.01) {
            console.warn('⚠️ Не найдено крайнее изображение для прокрутки');
        }
    }
}

// Функция быстрой прокрутки к последнему (нижнему) изображению в истории
async function scrollToBottomImage() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    // Убираем задержку - она замедляет
    await new Promise(resolve => setTimeout(resolve, 50));

    // Ищем все элементы истории
    const historyItems = historyList.querySelectorAll('.history-mini');
    if (historyItems.length > 0) {
        // Берем последний элемент (самое нижнее изображение)
        const lastHistoryItem = historyItems[historyItems.length - 1];

        // Убираем спам логирования
        if (Math.random() < 0.05) {
            console.log('🚀 Быстрая прокрутка к последнему изображению');
        }

        // Быстрая прокрутка без плавности для мгновенного показа
        lastHistoryItem.scrollIntoView({
            behavior: 'instant', // 'instant' для быстрой прокрутки
            block: 'center',
            inline: 'nearest'
        });

        // Убираем анимацию и подсветку - они бесполезны
        if (Math.random() < 0.05) {
            console.log('✅ Прокрутка к последнему изображению завершена');
        }
    } else {
        // Убираем спам логирования
        if (Math.random() < 0.01) {
            console.warn('⚠️ Не найдены элементы истории для прокрутки');
        }
    }
}

// Функция для создания placeholder'а загрузки в истории
function createLoadingHistoryItem(generation) {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    // Создаём элемент нового изображения в истории
    const loadingItem = document.createElement('div');
    loadingItem.className = 'history-mini history-loading';
    loadingItem.id = `loading-${generation.id}`;
    // Добавляем onclick сразу
    loadingItem.onclick = () => console.log('Loading item clicked, but still processing...');

    // Создаём полупрозрачное изображение для анимации загрузки (без src - только placeholder)
    const loadingImage = document.createElement('img');
    loadingImage.className = 'loading-image-placeholder';
    // убираем src чтобы не было иконки
    loadingImage.alt = 'Generating...';

    // Добавляем анимацию пульсации
    loadingImage.style.animation = 'image-loading 2s infinite';

    // Создаём подпись для широких экранов - будем заполнять при готовности
    const loadingCaption = document.createElement('p');
    loadingCaption.classList.add('history-caption');
    loadingCaption.innerHTML = ` `; // Пусто, заполним позднее

    // Собираем элемент
    loadingItem.appendChild(loadingImage);
    loadingItem.appendChild(loadingCaption);

    // Вставляем новый элемент в начало списка
    const firstHistoryItem = historyList.querySelector('.history-mini');
    if (firstHistoryItem) {
        historyList.insertBefore(loadingItem, firstHistoryItem);
    } else {
        historyList.appendChild(loadingItem);
    }

    return loadingItem;
}

// Функция для обновления миниатюры после получения результата
function updateHistoryItemWithImage(generationId, imageUrl) {
    const loadingItem = document.getElementById(`loading-${generationId}`);
    if (!loadingItem) return;

    // Снимаем анимацию пульсации и обновляем изображение
    const loadingImage = loadingItem.querySelector('.loading-image-placeholder');
    if (loadingImage) {
        // Убираем анимацию
        loadingImage.style.animation = 'none';

        // Обновляем на готовое изображение
        loadingImage.src = imageUrl;
        loadingImage.alt = 'Generated image';

        // Добавляем эффект плавного появления
        loadingImage.style.opacity = '0';
        requestAnimationFrame(() => {
            loadingImage.style.opacity = '1';
            loadingImage.style.transition = 'opacity 0.3s ease-in-out';
        });
    }

    // Обновляем подпись - показываем завершение генерации
    const loadingCaption = loadingItem.querySelector('p');
    if (loadingCaption) {
        // Найдем объект генерации по ID
        const generation = appState.generationHistory.find(g => g.id == generationId);
        const mode = generation ? generation.mode : 'unknown';
        const style = generation ? generation.style : 'realistic';

        loadingCaption.innerHTML = `
    <span class="complete-status">✅ Complete</span><br>
    <small class="history-date">${new Date().toLocaleDateString()} | ${appState.translate('style_' + style)} | ${appState.translate('mode_' + mode)}</small>
`;

        // Добавляем мягкую анимацию изменения текста
        loadingCaption.style.opacity = '0';
        requestAnimationFrame(() => {
            loadingCaption.style.opacity = '1';
            loadingCaption.style.transition = 'opacity 0.2s ease-in-out';
        });
    }

    // Убираем loading класс через некоторое время для smooth эффекта
    setTimeout(() => {
        loadingItem.classList.remove('history-loading');
    }, 300);

    // Добавляем onclick для просмотра результата
    loadingItem.onclick = () => viewHistoryItem(generationId);

    console.log('🖼️ Updated history item with generated image:', generationId, imageUrl);
}

// 🖼️ UI Initialization
// 🎬 Screen Management with cleanup
let carouselCleanup = null;

function showLoadingScreen() {
    document.getElementById('loadingScreen').classList.add('active');
}

function hideLoadingScreen() {
    document.getElementById('loadingScreen').classList.remove('active');
}

// Cleanup function for memory leaks
function cleanupMemoryLeaks() {
    // Disconnect Global History Loader
    if (globalHistoryLoader) {
        globalHistoryLoader.destroy();
    }

    // Clear any pending timers
    if (appState.timerInterval) {
        clearInterval(appState.timerInterval);
        appState.timerInterval = null;
    }

    // Remove carousel event listeners
    if (carouselCleanup) {
        carouselCleanup();
        carouselCleanup = null;
    }

    console.log('🧹 Memory leaks cleaned up successfully - including global history loader');
}

// Call cleanup on page unload
window.addEventListener('beforeunload', cleanupMemoryLeaks);

function showApp() {
    document.getElementById('app').classList.add('loaded');
}
function getCurrentScreen() {
    const generationEl = document.getElementById('generationScreen');
    const processingEl = document.getElementById('processingScreen');
    const resultEl = document.getElementById('resultScreen');
    const historyEl = document.getElementById('historyScreen');

    const isVisible = el => {
        if (!el) return false;
        const cs = window.getComputedStyle(el);
        if (el.classList.contains('hidden')) return false;
        return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0';
    };

    if (isVisible(resultEl)) return 'result';
    if (isVisible(processingEl)) return 'processing';
    if (isVisible(historyEl)) return 'history';
    if (isVisible(generationEl)) return 'generation';
    return 'unknown';
}

/*
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
    if (!targetScreen) { console.error('Screen not found:', screenId); return; }

    // Update main button
    //updateMainButton(screenId);
}
*/

function showScreen(screenId) {
    // Сначала ищем нужный экран
    const targetScreen = document.getElementById(screenId);
    if (!targetScreen) {
        console.error('Screen not found:', screenId);
        return;
    }

    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden'); // гарантированно прячем
    });

    // Показываем нужный
    targetScreen.classList.remove('hidden');
    targetScreen.classList.add('active');
}


function showProcessing() {
    showScreen('processingScreen');
    updateProcessingSteps(1);
    console.log('--- Проверка processingScreen ---');
    const proc = document.getElementById('processingScreen');
    if (!proc) {
        console.error('❌ Нет блока #processingScreen в DOM');
    } else {
        console.log('✅ Нашёл processingScreen:', proc);
        console.log('Классы:', proc.className);
        console.log('display:', getComputedStyle(proc).display);
        console.log('opacity:', getComputedStyle(proc).opacity);
        console.log('transform:', getComputedStyle(proc).transform);
        console.log('innerHTML длина:', proc.innerHTML.length);
    }

    console.log('after showProcessing ->', getCurrentScreen());
}

function showResult(result) {
    showScreen('resultScreen');

    // Update result display
    const resultImage = document.getElementById('resultImage');
    const resultPrompt = document.getElementById('resultPrompt');
    const resultStyle = document.getElementById('resultStyle');
    const resultMode = document.getElementById('resultMode');
    const resultTime = document.getElementById('resultTime');

    if (resultImage) resultImage.src = result.image_url;
    if (resultPrompt) resultPrompt.textContent = appState.currentGeneration.prompt;
    if (resultStyle) resultStyle.textContent = appState.translate('style_' + appState.currentGeneration.style);
    if (resultMode) resultMode.textContent = appState.translate('mode_' + appState.currentGeneration.mode);

    // Обновлено: отображаем стоимость генерации вместо времени
    if (resultTime) {
        const cost = result.cost || result.generation_cost;
        if (cost && !isNaN(cost)) {
            const formattedCost = parseFloat(cost).toFixed(2);
            const currency = result.cost_currency || 'cr';
            resultTime.textContent = `${formattedCost} ${currency}`;
        } else {
            // Fallback если стоимость не пришла
            const duration = Math.round((appState.currentGeneration.duration || 0) / 1000);
            resultTime.textContent = `${duration}s`;
        }
    }

    console.log('after showResult ->', getCurrentScreen());
}

// Функция обновления баланса пользователя в header
function updateUserBalance(credits) {
    // Обновляем баланс в appState
    if (credits !== null && credits !== undefined) {
        appState.userCredits = parseFloat(credits);
        appState.lastBalanceUpdate = Date.now();
        appState.saveSettings(); // Сохраняем в localStorage

        // Обновляем отображение в header
        const balanceElement = document.getElementById('userCreditsDisplay');
        if (balanceElement) {
            if (!isNaN(credits) && credits !== null) {
                balanceElement.textContent = parseFloat(credits).toLocaleString('en-US');
            } else {
                balanceElement.textContent = '--';
            }
        }
    }
}

function showSubscriptionNotice(result) {
    console.log('🔗 Full result object:', result);
    console.log('🔗 Payment URLs from result:', result.payment_urls);

    const modal = document.getElementById('limitModal');
    if (!modal) {
        console.error('❌ Modal not found!');
        return;
    }

    // Показать модальное окно
    modal.classList.add('show');

    // Helper function for safe redirections with error handling
    const safeRedirect = (url, planName) => {
        modal.classList.remove('show');
        showGeneration();
        setTimeout(() => {
            try {
                console.log(`🔗 Redirecting to ${planName} payment URL: ${url}`);
                // Try modern way first
                if (appState.tg && appState.tg.openLink) {
                    appState.tg.openLink(url);
                } else {
                    // Fallback to regular navigation
                    window.open(url, '_blank');
                }
            } catch (error) {
                console.error(`❌ Error redirecting to ${planName} payment link:`, error);
                showToast('error', `Ошибка перехода к ${planName}. Попробуйте снова.`);
                // Fallback to popup
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        }, 100);
    };

    // Настроить обработчики для трех кнопок тарифов
    const upgradeBtn = document.getElementById('upgradeBtn'); // ЛИТЕ планируется как существующий
    const upgradeBtnPro = document.getElementById('upgradebtn_pro'); // ПРО новый
    const upgradeBtnStudio = document.getElementById('upgradebtn_studio'); // СТУДИО новый

    console.log('🔘 Upgrade buttons found:', !!upgradeBtn, !!upgradeBtnPro, !!upgradeBtnStudio);

    // Обработчик для ЛИТЕ тарифа (использует существующую кнопку upgradeBtn)
    if (upgradeBtn) {
        upgradeBtn.onclick = () => {
            console.log('🔘 LITE Upgrade button clicked');
            const paymentUrl = result.payment_urls?.lite || 'https://t.me/tribute/app?startapp=syDv';
            safeRedirect(paymentUrl, 'LITE');
        };
    }

    // Обработчик для ПРО тарифа (новая кнопка)
    if (upgradeBtnPro) {
        upgradeBtnPro.onclick = () => {
            console.log('🔘 PRO Upgrade button clicked');
            const paymentUrl = result.payment_urls?.pro || 'https://t.me/tribute/app?startapp=syDv';
            safeRedirect(paymentUrl, 'PRO');
        };
    }

    // Обработчик для СТУДИО тарифа (новая кнопка)
    if (upgradeBtnStudio) {
        upgradeBtnStudio.onclick = () => {
            console.log('🔘 STUDIO Upgrade button clicked');
            const paymentUrl = result.payment_urls?.studio || 'https://t.me/tribute/app?startapp=syDv';
            safeRedirect(paymentUrl, 'STUDIO');
        };
    }

    // Настроить кнопку закрытия
    const closeBtn = document.getElementById('closeLimitModal');
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.classList.remove('show');
            showGeneration(); // Показываем генератор после закрытия
        };
    }
}

/*function showGeneration() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById('generationScreen').classList.add('active');
    showBackButton(false);
*/
function showGeneration() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });

    const gen = document.getElementById('generationScreen');
    if (!gen) {
        console.warn('generationScreen не найден');
        return;
    }

    gen.classList.remove('hidden');
    gen.classList.add('active');

    showBackButton(false);
}


// 🎨 UI Initialization
function initializeUI() {
    // Character counter
    const promptInput = document.getElementById('promptInput');
    const charCounter = document.getElementById('charCounter');

    if (promptInput && charCounter) {
        promptInput.addEventListener('input', function () {
            charCounter.textContent = this.value.length;

            // Auto-resize
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }

    // Form submission
    const form = document.querySelector('.generation-form');
    if (form) {
        form.addEventListener('submit', generateImage);
    }

    // Update translations
    appState.updateTranslations();

    console.log('✅ UI initialized');
}

// ===== Пользовательское изображение: состояние =====
const userImageState = {
    file: null,        // File
    dataUrl: null,     // data:image/...;base64,...
    uploadedUrl: null, // публичный URL от imgbb
};


// ===== Инициализация UI загрузки =====
function initUserImageUpload() {
    const input = document.getElementById('userImage');
    const chooseBtn = document.getElementById('chooseUserImage');
    const removeBtn = document.getElementById('removeUserImage');

    chooseBtn?.addEventListener('click', () => input?.click());
    input?.addEventListener('change', onUserImageChange);
    removeBtn?.addEventListener('click', clearUserImage);
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
// ===== Обработчик выбора файла =====
async function onUserImageChange(e) {
    const file = e.target.files?.[0];
    const errorEl = document.getElementById('userImageError');
    const preview = document.getElementById('userImagePreview');
    const img = document.getElementById('userImagePreviewImg');

    const chooseBtn = document.getElementById('chooseUserImage');
    const optionalLabel = document.querySelector('.under-user-image-label');

    if (errorEl) errorEl.textContent = '';
    if (!file) return;

    // Валидация
    //if (!CONFIG.ALLOWED_TYPES.includes(file.type)) {
    if (!CONFIG.ALLOWED_TYPES.includes(file.type)) {
        if (errorEl) errorEl.textContent = 'formats Allowed to upload: JPG, PNG, WEBP, GIF.';
        e.target.value = '';
        return;
    }
    const maxBytes = CONFIG.MAX_IMAGE_MB * 2048 * 2048;
    if (file.size > maxBytes) {
        if (errorEl) errorEl.textContent = `Файл слишком большой. Максимум ${CONFIG.MAX_IMAGE_MB} MB.`;
        e.target.value = '';
        return;
    }

    try {
        const dataUrl = await readFileAsDataURL(file);
        const compressed = await maybeCompressImage(
            dataUrl,
            CONFIG.PREVIEW_MAX_W,
            CONFIG.PREVIEW_MAX_H,
            CONFIG.PREVIEW_JPEG_QUALITY
        );

        userImageState.file = file;
        userImageState.dataUrl = compressed;
        userImageState.uploadedUrl = null;

        if (img) img.src = compressed;
        if (preview) preview.classList.remove('hidden');
        const wrapper = document.getElementById('userImageWrapper');
        wrapper?.classList.add('has-image');
        wrapper?.classList.remove('need-image');

        // Скрыть кнопку и "(Optional)"
        if (chooseBtn) chooseBtn.style.display = 'none';
        if (optionalLabel) optionalLabel.style.display = 'none';

    } catch (err) {
        console.error(err);
        if (errorEl) errorEl.textContent = 'Не удалось прочитать/обработать изображение.';
        e.target.value = '';
    }
}

function clearUserImage() {
    const input = document.getElementById('userImage');
    const preview = document.getElementById('userImagePreview');
    const img = document.getElementById('userImagePreviewImg');
    const errorEl = document.getElementById('userImageError');

    const chooseBtn = document.getElementById('chooseUserImage');
    const optionalLabel = document.querySelector('.under-user-image-label');

    if (input) input.value = '';
    if (img) img.removeAttribute('src');
    if (preview) preview.classList.add('hidden');
    if (errorEl) errorEl.textContent = '';

    // Показать кнопку и "(Optional)" обратно
    if (chooseBtn) chooseBtn.style.display = '';
    if (optionalLabel) optionalLabel.style.display = '';

    userImageState.file = null;
    userImageState.dataUrl = null;
    userImageState.uploadedUrl = null;
    const wrapper = document.getElementById('userImageWrapper');
    wrapper?.classList.remove('has-image');
    wrapper?.classList.remove('need-image');
}

function maybeCompressImage(dataUrl, maxW = 1024, maxH = 1024, quality = 0.9) {
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

// ===== Загрузка на imgbb и получение публичного URL =====
// Мягкий аплоад: если ключа нет — пропускаем без throw
async function uploadToImgbb(dataUrl, apiKey) {
    const key = (apiKey || '').trim();
    if (!key) {
        console.warn('IMGBB API key missing — skipping user image upload');
        return null; // не ломаем генерацию
    }

    const base64 = String(dataUrl).split(',')[1];
    const form = new FormData();
    form.append('image', base64);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(key)}`, {
        method: 'POST',
        body: form
    });

    let json;
    try {
        json = await res.json();
    } catch (e) {
        console.error('IMGBB: failed to parse JSON', e);
        return null;
    }
    console.debug('imgbb status:', res.status, res.statusText, json);

    if (!res.ok || !json?.success) {
        console.warn('IMGBB upload failed:', json?.error || json);
        return null;
    }
    return json.data.url;
}

// Загружает только если выбрано и ещё не загружено
async function uploadUserImageIfAny() {
    if (!userImageState.dataUrl) return null;
    if (userImageState.uploadedUrl) return userImageState.uploadedUrl;

    const url = await uploadToImgbb(userImageState.dataUrl, CONFIG.IMGBB_API_KEY);
    userImageState.uploadedUrl = url || null;
    return userImageState.uploadedUrl;
}

// 📱 Telegram WebApp Integration

async function initTelegramApp() {
    console.log('🔍 Initializing Telegram WebApp...');

    // 🚀 ВАРИАНТ 3: Умное ожидание Telegram SDK
    const waitForTelegram = async (timeoutMs = 3000) => {
        return new Promise((resolve, reject) => {
            let elapsed = 0;
            const checkInterval = 100; // проверяем каждые 100мс

            const check = () => {
                if (typeof window.Telegram !== 'undefined') {
                    resolve(window.Telegram);
                    return;
                }

                elapsed += checkInterval;
                if (elapsed >= timeoutMs) {
                    resolve(null); // возвращаем null если не загрузился
                    return;
                }

                setTimeout(check, checkInterval);
            };

            check(); // первый запуск сразу
        });
    };

    const telegram = await waitForTelegram();
    const isAvailable = telegram?.WebApp;
    console.log('📱 Telegram SDK loaded:', !!isAvailable);

    console.log('📱 After waiting - Telegram available:', !!window.Telegram?.WebApp);

    if (typeof window.Telegram === 'undefined' || !window.Telegram.WebApp) {
        console.log('❌ Telegram WebApp still not available - using fallback');
        appState.userId = 'fallback_' + Date.now();
        appState.userName = 'Fallback User';
        showStatus('info', 'Running in fallback mode');
        return;
    }

    try {
        appState.tg = window.Telegram.WebApp;
        appState.tg.ready();
        appState.tg.expand();
        console.log('🧾 Full initDataUnsafe dump:', JSON.stringify(appState.tg.initDataUnsafe, null, 2));

        // ⚠️ ПРОВЕРКА: Есть ли пользователь?
        if (!appState.tg.initData || !appState.tg.initDataUnsafe?.user) {
            showStatus('error', '⚠️ WebApp не запущен из Telegram. Повторите запуск через бота.');
            return;
        }

        // ✅ УЛУЧШЕННАЯ ДИАГНОСТИКА:
        console.log('🔍 Telegram WebApp data:', {
            available: !!appState.tg,
            platform: appState.tg.platform,
            version: appState.tg.version,
            initDataUnsafe: appState.tg.initDataUnsafe,
            user: appState.tg.initDataUnsafe?.user,
            // НОВЫЕ ПРОВЕРКИ:
            initData: appState.tg.initData, // Сырые данные
            isExpanded: appState.tg.isExpanded,
            viewportHeight: appState.tg.viewportHeight,
            colorScheme: appState.tg.colorScheme,
            themeParams: appState.tg.themeParams
        });

        // ДОПОЛНИТЕЛЬНАЯ ДИАГНОСТИКА:
        console.log('🌍 Environment check:', {
            url: window.location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            isHTTPS: window.location.protocol === 'https:',
            hasInitData: !!appState.tg.initData,
            initDataLength: appState.tg.initData?.length || 0
        });

        console.log('👤 User data extracted:', {
            userId: appState.tg.initDataUnsafe?.user?.id,
            firstName: appState.tg.initDataUnsafe?.user?.first_name,
            lastName: appState.tg.initDataUnsafe?.user?.last_name,
            username: appState.tg.initDataUnsafe?.user?.username
        });

        // Get user data
        if (appState.tg.initDataUnsafe && appState.tg.initDataUnsafe.user) {
            const user = appState.tg.initDataUnsafe.user;

            // Основные данные
            appState.userId = user.id.toString();
            appState.userName = user.first_name + (user.last_name ? ' ' + user.last_name : '');

            // Дополнительные данные пользователя
            appState.userUsername = user.username || null;
            appState.userLanguage = user.language_code || 'en';
            appState.userIsPremium = user.is_premium || false;
            appState.userPhotoUrl = user.photo_url || null;
            appState.userAllowsWriteToPm = user.allows_write_to_pm || false;

            // Данные чата/сессии
            appState.chatInstance = appState.tg.initDataUnsafe.chat_instance || null;
            appState.chatType = appState.tg.initDataUnsafe.chat_type || null;
            appState.authDate = appState.tg.initDataUnsafe.auth_date || null;

            // Платформа и версия
            appState.telegramPlatform = appState.tg.platform || 'unknown';
            appState.telegramVersion = appState.tg.version || 'unknown';

            console.log('✅ REAL USER DATA SET:', {
                userId: appState.userId,
                userName: appState.userName,
                username: appState.userUsername,
                language: appState.userLanguage,
                isPremium: appState.userIsPremium,
                platform: appState.telegramPlatform,
                version: appState.telegramVersion,
                chatType: appState.chatType
            });
        } else {
            // ✅ УЛУЧШЕННАЯ ДИАГНОСТИКА:
            console.log('❌ NO USER DATA - detailed check:', {
                hasInitDataUnsafe: !!appState.tg.initDataUnsafe,
                initDataUnsafeKeys: Object.keys(appState.tg.initDataUnsafe || {}),
                hasInitData: !!appState.tg.initData,
                initDataPreview: appState.tg.initData?.substring(0, 100),
                launchedVia: appState.tg.initDataUnsafe?.start_param || 'unknown',
                currentURL: window.location.href,
                isDirectAccess: !document.referrer.includes('telegram')
            });

            // Разные fallback для разных случаев
            if (!appState.tg.initDataUnsafe) {
                appState.userId = 'fallback_no_unsafe_' + Date.now();
                appState.userName = 'No InitDataUnsafe';
            } else if (!appState.tg.initDataUnsafe.user) {
                appState.userId = 'fallback_no_user_' + Date.now();
                appState.userName = 'No User Data';
            } else {
                appState.userId = 'fallback_unknown_' + Date.now();
                appState.userName = 'Unknown Issue';
            }

            appState.userUsername = null;
            appState.userLanguage = 'en';
            appState.userIsPremium = false;
            appState.userPhotoUrl = null;
            appState.telegramPlatform = appState.tg?.platform || 'unknown';
            appState.telegramVersion = appState.tg?.version || 'unknown';
        }


        // Auto-detect language
        // Auto-detect language, но не перетирать вручную сохранённый
        const tgLangRaw = appState.tg.initDataUnsafe?.user?.language_code;
        const tgLang = tgLangRaw?.split('-')[0]; // "ru-RU" → "ru"
        const saved = JSON.parse(localStorage.getItem('appSettings') || '{}');
        if (!saved.language && tgLang && CONFIG.LANGUAGES.includes(tgLang)) {
            appState.setLanguage(tgLang);
        }

        showStatus('success', appState.translate('connected'));

    } catch (error) {
        console.error('❌ Telegram initialization error:', error);
        showStatus('error', 'Telegram connection error');
    }
}

function initLanguageDropdown() {
    const btn = document.getElementById('langBtn');
    const menu = document.getElementById('langMenu');
    if (!btn || !menu) return;

    // Заполнить меню языками
    menu.innerHTML = '';
    CONFIG.LANGUAGES.forEach(l => {
        const li = document.createElement('li');
        li.textContent = l; // можно заменить на красивое имя, если нужно
        li.addEventListener('click', (evt) => {
            evt.stopPropagation();
            appState.setLanguage(l);        // сохранится в localStorage через saveSettings()
            menu.style.display = 'none';    // скрыть после выбора
        });
        menu.appendChild(li);
    });

    // Изначально скрыто (дублируем CSS на случай задержки стилей)
    menu.style.display = 'none';

    // Открыть/закрыть по кнопке
    btn.addEventListener('click', (evt) => {
        evt.stopPropagation();
        menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
    });

    // Закрыть при клике вне
    document.addEventListener('click', (evt) => {
        if (!menu.contains(evt.target) && !btn.contains(evt.target)) {
            menu.style.display = 'none';
        }
    });

    // Закрыть по Esc
    document.addEventListener('keydown', (evt) => {
        if (evt.key === 'Escape') {
            menu.style.display = 'none';
        }
    });
}

// 🚀 App Initialization
document.addEventListener('DOMContentLoaded', async function () {
    console.log('🚀 pixPLace Creator starting...');


    showLoadingScreen();
    appState.loadSettings();
    appState.loadHistory();

    try {
        await loadTelegramSDK();    // 👉 дождаться загрузки SDK
        await initTelegramApp();    // 👉 только теперь можно обращаться к WebApp
    } catch (e) {
        console.error('❌ SDK load error:', e);
        showStatus('error', 'Telegram SDK load failed');
    }

    initializeUI();
    initUserImageUpload(); // ← добавь эту строку
    initLanguageDropdown();

    const carouselImages = document.querySelectorAll('.carousel-2d-item img');
    carouselImages.forEach(img => {
        img.loading = 'lazy';
        img.decoding = 'async';
    });

    setTimeout(() => {
        hideLoadingScreen();
        showApp();

        // Инициализируем баланс пользователя
        updateUserBalance(appState.userCredits);

        // AI Coach initialization
        initAICoach();
    }, 1500);
});



// 🖼️ Image Generation - ИСПРАВЛЕННАЯ ВЕРСИЯ
async function generateImage(event) {
    if (event) {
        event.preventDefault();
    }

    if (appState.isGenerating) return;

    const prompt = document.getElementById('promptInput').value.trim();
    const mode = document.getElementById('modeSelect').value;
    const size = document.getElementById('sizeSelect').value;

    console.log('🚀 Starting generation:', { prompt, style: appState.selectedStyle, mode, size });

    // Validation
    if (!prompt) {
        showToast('error', appState.translate('error_prompt_required'));
        triggerHaptic('error');
        return;
    }

    if (prompt.length < 5) {
        showToast('error', appState.translate('error_prompt_too_short'));
        triggerHaptic('error');
        return;
    }

    if (!CONFIG.WEBHOOK_URL || CONFIG.WEBHOOK_URL.includes('WEBHOOK')) {
        showToast('error', appState.translate('error_webhook_not_configured'));
        return;
    }



    // === GUARD: photo_session, upscale, background_removal требуют загруженного фото ===
    const requiresImage = ['photo_session', 'upscale_image', 'background_removal'].includes(mode);
    if (requiresImage) {
        const wrapper = document.getElementById('userImageWrapper');
        const hasLocalImage =
            !!userImageState?.file || !!userImageState?.dataUrl || !!userImageState?.uploadedUrl;

        if (!hasLocalImage) {
            wrapper?.classList.add('need-image');
            const messageKey = mode === 'upscale_image'
                ? 'please_upload_for_upscale'
                : mode === 'background_removal'
                    ? 'please_upload_for_background_removal'
                    : 'please_upload_photo_session';
            showToast('error', appState.translate(messageKey));
            triggerHaptic('error');
            return; // не начинаем процесс и НЕ отправляем webhook
        }
    }

    appState.isGenerating = true;
    appState.startTime = Date.now();

    // Create generation record
    // 👉 Берём активную карточку из карусели и обновляем стиль
    const activeCard = document.querySelector('.carousel-2d-item.active');
    const currentStyle = (activeCard?.dataset.style || '').toLowerCase();
    appState.selectedStyle = currentStyle || appState.selectedStyle;

    appState.currentGeneration = {
        id: Date.now(),
        prompt: prompt,
        style: appState.selectedStyle,
        mode: mode,
        size: size,
        timestamp: new Date().toISOString(),
        status: 'processing',
        startTime: appState.startTime
    };

    // Add to history
    appState.generationHistory.unshift(appState.currentGeneration);
    appState.saveHistory();

    // Комментируем показ экрана обработки для нового UX с прокруткой к истории
    // showProcessing();

    startTimer();

    // Добавляем плавную прокрутку к истории и автоматическое открытие
    setTimeout(async () => {
        await showHistoryWithScroll();
        createLoadingHistoryItem(appState.currentGeneration);
    }, 100);

    // 1) Если выбрано пользовательское изображение — загрузим на imgbb
    let userImageUrl = null;
    try {
        userImageUrl = await uploadUserImageIfAny();
    } catch (err) {
        console.warn('User image upload failed:', err);
        const errorEl = document.getElementById('userImageError');
        if (errorEl && !errorEl.textContent) {
            errorEl.textContent = 'Не удалось загрузить изображение. Сгенерируем без него.';
        }
    }
    // === Если режим photo_session — без валидного URL дальше не идём ===
    if (mode === 'photo_session' && !userImageUrl) {
        const wrapper = document.getElementById('userImageWrapper');
        wrapper?.classList.add('need-image');
        showToast('error', appState.translate('upload_failed'));
        triggerHaptic('error');
        // Откатываем состояние и возвращаем экран генерации
        appState.isGenerating = false;
        stopTimer();
        showGeneration();
        return; // НЕ отправляем webhook
    }
    try {
        console.log('📤 Sending to webhook...');

        // Send request to Make webhook
        const result = await sendToWebhook({
            action: 'Image Generation',
            prompt: prompt,
            style: appState.selectedStyle,
            mode: mode,
            size: size,
            user_image_url: userImageUrl,
            user_id: appState.userId,
            user_name: appState.userName,
            user_username: appState.userUsername,
            user_language: appState.userLanguage,
            user_is_premium: appState.userIsPremium,
            telegram_platform: appState.telegramPlatform,
            telegram_version: appState.telegramVersion,
            timestamp: new Date().toISOString(),
            generation_id: appState.currentGeneration.id
        });

        console.log('📥 Webhook response received:', result);

        // Обновляем данные генерации
        appState.currentGeneration.endTime = Date.now();
        appState.currentGeneration.duration = appState.currentGeneration.endTime - appState.currentGeneration.startTime;

        // Handle response
        if (!result || typeof result !== 'object') {
            throw new Error('Invalid response from webhook');
        }

        // Проверка на ошибку
        if (result.status === 'error' || result.error) {
            throw new Error(result.error || result.message || 'Unknown error from webhook');
        }

        /// Проверка лимитов (ПЕРВАЯ ПРОВЕРКА)
        console.log('🔍 Checking if limit reached...');
        const limitReached = result.limit_reached === true ||
            result.limit_reached === 'true' ||
            result.limit_reached === '1' ||
            result.limit_reached === 1;

        console.log('🔍 Limit reached result:', limitReached);

        if (limitReached) {
            console.log('⚠️ LIMIT REACHED - Opening modal');
            appState.currentGeneration.status = 'limit';
            appState.currentGeneration.result = result.image_url || null;
            appState.saveHistory();

            // Получаем URL для оплаты из ответа или используем дефолтный
            const paymentUrl = result.payment_url || 'https://t.me/tribute/app?startapp=syDv';
            console.log('🔗 Payment URL:', paymentUrl);

            // Вызываем функцию показа модального окна
            console.log('🔗 Calling showSubscriptionNotice...');
            showSubscriptionNotice(result);

            showToast('warning', result.message || 'Generation limit reached');
            triggerHaptic('warning');
            return;
        }
        // Успешная генерация
        if (result.status === 'success' && result.image_url) {
            console.log('✅ Generation successful');
            appState.currentGeneration.status = 'success';
            appState.currentGeneration.result = result.image_url;
            appState.saveHistory();

            // Обновляем баланс пользователя из ответа
            if (result.remaining_credits !== undefined || result.credit_balance !== undefined || result.cost_balance !== undefined) {
                const balance = result.remaining_credits || result.credit_balance || result.cost_balance;
                updateUserBalance(balance);
                console.log('💳 Updated user balance:', balance);
            }

            // Обновляем миниатюру в истории с новым изображением
            updateHistoryItemWithImage(appState.currentGeneration.id, result.image_url);

            // 🔧 ДОБАВЛЕНИЕ: Обновляем отображение истории, если она уже открыта
            // Это исправит проблему, когда история не прогружается до первой генерации
            const historyList = document.getElementById('historyList');
            if (historyList && !historyList.classList.contains('hidden')) {
                console.log('📋 History is open, updating display after generation');
                updateHistoryDisplay();
            }

            showResult(result);
            showToast('success', appState.translate('success_generated'));
            triggerHaptic('success');
            return;
        }

        // Если дошли сюда - неожиданный формат ответа
        console.error('❌ Unexpected response format:', result);
        throw new Error('Unexpected response format: ' + JSON.stringify(result));

    } catch (error) {
        console.error('❌ Generation error:', error);

        appState.currentGeneration.status = 'error';
        appState.currentGeneration.error = error.message;
        appState.currentGeneration.endTime = Date.now();
        appState.currentGeneration.duration = appState.currentGeneration.endTime - appState.currentGeneration.startTime;
        appState.saveHistory();

        showToast('error', appState.translate('error_generation_failed') + ': ' + error.message);
        triggerHaptic('error');
        showGeneration();
    } finally {
        appState.isGenerating = false;
        stopTimer();
    }
}
// 🌐 Webhook Communication
async function sendToWebhook(data) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);

    try {
        console.log('📤 Sending webhook request:', data);

        const response = await fetch(CONFIG.WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log('📥 Webhook response status:', response.status, response.statusText);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Проверяем Content-Type
        const contentType = response.headers.get('content-type');
        console.log('📄 Response content-type:', contentType);

        let result;
        try {
            if (contentType && contentType.includes('application/json')) {
                const jsonText = await response.text();
                result = JSON.parse(jsonText);
                console.log('✅ Parsed webhook response:', result);
            } else if (contentType && contentType.includes('text/')) {
                // Сервер вернул текст (например, ошибку)
                const textResponse = await response.text();
                console.log('📄 Server returned text:', textResponse);
                throw new Error('Server returned text instead of JSON: ' + textResponse);
            } else {
                // Неопределённый content-type — пытаемся парсить как JSON
                const textResponse = await response.text();
                console.log('📄 Unexpected content-type, trying to parse as JSON:', textResponse);
                try {
                    result = JSON.parse(textResponse);
                } catch (parseError) {
                    console.error('❌ Failed to parse response:', textResponse);
                    throw new Error('Server returned invalid format: ' + textResponse.substring(0, 100));
                }
            }
        } catch (error) {
            console.error('❌ Response parsing error:', error);
            if (error instanceof SyntaxError) {
                throw new Error('Server returned malformed JSON');
            }
            throw error;
        }

        console.log('✅ Parsed webhook response:', result);
        return result;

    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            throw new Error(appState.translate('error_timeout'));
        }

        console.error('❌ Webhook error:', error);
        throw error;
    }
}
// 🎨 Style Selection
//  2D Carousel (loop, Android-friendly)
(() => {
    // Находим трек по id или по классу
    const track = document.getElementById('carousel2d') || document.querySelector('.carousel-2d');
    if (!track) { console.warn('[carousel2d] трек не найден'); return; }
    if (track._carouselInited) return; // защита от двойной инициализации
    track._carouselInited = true;

    const cards = Array.from(track.querySelectorAll('.carousel-2d-item'));
    if (!cards.length) { console.warn('[carousel2d] карточки не найдены'); return; }

    let selectedStyle = (cards[0].dataset.style || '').toLowerCase();
    let isPointerDown = false;
    let moved = false;
    let startX = 0, startY = 0, startScroll = 0;

    // ===== helpers =====
    function updateGutters() {
        const cardW = cards[0]?.offsetWidth || 0;
        const viewport = track.clientWidth || 0;
        if (!cardW || !viewport) return;
        const gutter = Math.max(0, (viewport - cardW) / 2);
        track.style.paddingLeft = `${gutter}px`;
        track.style.paddingRight = `${gutter}px`;
    }

    function centerCard(card, smooth = true) {
        if (!card) return;
        const viewport = track.clientWidth;
        const left = card.offsetLeft - (viewport - card.offsetWidth) / 2;
        const maxScroll = track.scrollWidth - viewport;
        const clamped = Math.max(0, Math.min(left, maxScroll));
        track.scrollTo({ left: clamped, behavior: smooth ? 'smooth' : 'auto' });
    }

    function highlight(card, { scroll = false } = {}) {
        cards.forEach(c => c.classList.remove('active'));
        if (!card) return;
        card.classList.add('active');

        // Обновляем выбранный стиль
        selectedStyle = (card.dataset.style || '').toLowerCase();
        if (window.appState) window.appState.selectedStyle = selectedStyle;

        // Сообщаем наружу (если кто-то слушает)
        document.dispatchEvent(new CustomEvent('style:change', { detail: { style: selectedStyle } }));

        if (scroll) centerCard(card, true);
    }

    function nearestCard() {
        const trackRect = track.getBoundingClientRect();
        const centerX = trackRect.left + trackRect.width / 2;
        let best = null, bestDist = Infinity;
        for (const c of cards) {
            const r = c.getBoundingClientRect();
            const cardCenter = r.left + r.width / 2;
            const dist = Math.abs(cardCenter - centerX);
            if (dist < bestDist) { bestDist = dist; best = c; }
        }
        return best;
    }
    // ===== /helpers =====

    // Pointer-события (универсально для мыши/тача/пера)
    track.addEventListener('pointerdown', (e) => {
        isPointerDown = true;
        moved = false;
        startX = e.clientX;
        startY = e.clientY;
        startScroll = track.scrollLeft;
        track.setPointerCapture?.(e.pointerId);
    });

    track.addEventListener('pointermove', (e) => {
        if (!isPointerDown) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (!moved && Math.hypot(dx, dy) > 8) moved = true; // чуть больше порог «дрожания»
        track.scrollLeft = startScroll - dx;
    });

    function endPointer(e) {
        if (!isPointerDown) return;
        isPointerDown = false;

        if (moved) {
            // после свайпа — снэп к ближайшей
            requestAnimationFrame(() => {
                const c = nearestCard();
                if (c) highlight(c, { scroll: true });
            });
        } else {
            // это «тап»: возьмём элемент под пальцем/мышью
            const el = document.elementFromPoint(e.clientX, e.clientY);
            const card = el?.closest?.('.carousel-2d-item');
            if (card && track.contains(card)) {
                highlight(card, { scroll: true });
            }
        }
    }

    track.addEventListener('pointerup', endPointer);
    track.addEventListener('pointercancel', endPointer);
    track.addEventListener('pointerleave', endPointer);

    // Доп. фолбэк: явные клики по карточкам (на случай, если pointer события где-то перехватываются)
    cards.forEach(c => {
        c.addEventListener('click', (e) => {
            // если только что был свайп — не считаем это кликом
            if (moved) return;
            highlight(c, { scroll: true });
        });
    });

    // Публичный API (если где-то вызывается)
    window.getSelectedStyle = function () { return selectedStyle; };
    window.setCarouselStyle = function (style) {
        const target = String(style || '').toLowerCase();
        const card = cards.find(c => (c.dataset.style || '').toLowerCase() === target);
        if (card) highlight(card, { scroll: true });
    };

    // Инициализация
    updateGutters();
    highlight(cards[0], { scroll: false });

    window.addEventListener('resize', () => {
        updateGutters();
        const active = track.querySelector('.carousel-2d-item.active');
        if (active) centerCard(active, true);
    });
})();


/*(function () {
    const track = document.getElementById('carousel2d');
    const wrapper = track?.closest('.carousel-2d-wrapper');
    if (!track || !wrapper) return;

    const cards = Array.from(track.querySelectorAll('.carousel-2d-item'));
    if (!cards.length) return;

    let selectedStyle = (cards[0].dataset.style || '').toLowerCase();
    let isPointerDown = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    
function nearestCard() {
    const trackRect = track.getBoundingClientRect();
    const center = trackRect.left + trackRect.width / 2;
    let best = null, bestDist = Infinity;

    for (const c of cards) {
        const r = c.getBoundingClientRect();
        const cardCenter = r.left + r.width / 2;
        const dist = Math.abs(cardCenter - center);
        if (dist < bestDist) {
            bestDist = dist;
            best = c;
        }
    }
    return best;
}

function highlight(card, { scroll = false } = {}) {
    cards.forEach(c => c.classList.remove('active'));
    if (!card) return;
    card.classList.add('active');

    // Обновляем стиль
    selectedStyle = (card.dataset.style || '').toLowerCase();
    if (window.appState) {
        appState.selectedStyle = selectedStyle;
    }

    console.log('🎨 Highlighted style:', selectedStyle);
    console.log('🎨 appState.selectedStyle:', appState?.selectedStyle);

    // Прокручиваем только если явно сказано
    if (scroll) {
        card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
}

// Найти ближайшую карточку к текущему скроллу

// Снэпим к ближайшей карточке
function onCardClick(e) {
    if (moved) return; // свайп — не клик
    const card = e.currentTarget;
    highlight(card, { scroll: true });
}

function snapToNearest() {
    const card = nearestCard();
    if (card) highlight(card, { scroll: true });
}


// Pointer события на треке
track.addEventListener('pointerdown', (e) => {
    isPointerDown = true;
    moved = false;
    startX = e.clientX;
    startScroll = track.scrollLeft;
    track.setPointerCapture(e.pointerId);
});

track.addEventListener('pointermove', (e) => {
    if (!isPointerDown) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 5) moved = true;
    // инвертируем для скролла
    track.scrollLeft = startScroll - dx;
});

function endPointer(e) {
    if (!isPointerDown) return;
    isPointerDown = false;
    // после свайпа — снэп к ближайшей
    requestAnimationFrame(snapToNearest);
}

track.addEventListener('pointerup', endPointer);
track.addEventListener('pointercancel', endPointer);
track.addEventListener('pointerleave', endPointer);

// Публичные методы для внешней интеграции
window.getSelectedStyle = function () {
    return selectedStyle;
};
window.setCarouselStyle = function (style) {
    const target = String(style || '').toLowerCase();
    const card = cards.find(c => (c.dataset.style || '').toLowerCase() === target);
    if (card) highlight(card, { scroll: true });
};

// Инициализация — выделим первую видимую/первую по списку
// highlight(cards[0]);
highlight(cards[0], { scroll: false });

// На ресайз — удержать активную в видимой области
window.addEventListener('resize', () => {
    const active = track.querySelector('.carousel-2d-item.active');
    if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
});
}) ();
*/
// 🔄 Action Functions
function newGeneration() {
    showGeneration();
    // Clear form
    //  document.getElementById('promptInput').value = '';
    //  document.getElementById('charCounter').textContent = '0';
}

function cancelGeneration() {
    if (appState.currentGeneration) {
        appState.currentGeneration.status = 'cancelled';
        appState.currentGeneration.error = 'Cancelled by user';
        appState.saveHistory();
    }

    appState.isGenerating = false;
    stopTimer();
    showGeneration();
    triggerHaptic('medium');
}

// 📱 Device Integration
async function downloadImage() {
    if (!appState.currentGeneration?.result) return;

    try {
        const response = await fetch(appState.currentGeneration.result);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `ai-generated-${appState.currentGeneration.id}.png`; // лучше оставить .png
        document.body.appendChild(link); // иногда без этого не работает в Safari
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url); // чистим память

        showToast('info', appState.translate('download_started'));
        triggerHaptic('light');
    } catch (err) {
        console.error("Ошибка при скачивании:", err);
        showToast('error', 'Download failed');
    }
}
/*function downloadImage() {
    if (!appState.currentGeneration?.result) return;

    const link = document.createElement('a');
    link.href = appState.currentGeneration.result;
    link.download = `ai-generated-${appState.currentGeneration.id}.png`;
    link.click();

    showToast('info', appState.translate('download_started'));
    triggerHaptic('light');
}
*/

async function shareImage() {
    const gen = appState.currentGeneration;
    if (!gen?.result) return;

    const imageUrl = gen.result;
    const prompt = (gen.prompt || 'pixPLace Image').trim();
    const botUrl = CONFIG.TELEGRAM_BOT_URL || 'https://t.me/your_bot';
    const hashtags = CONFIG.SHARE_DEFAULT_HASHTAGS || '#pixPLace';

    // Заголовок + текст публикации
    const title = prompt.length > 100 ? (prompt.slice(0, 97) + '...') : prompt;
    const postText = `${prompt}\n\nCreated with pixPLace ✨\nTry it: ${botUrl}\n${hashtags}`;

    // Функция на случай фолбэка — открыть Pinterest composer и скопировать текст
    const openPinterestFallback = async () => {
        try {
            // Откроем Pinterest Pin Builder c медиа и ссылкой на бота
            const pinUrl = `https://www.pinterest.com/pin-builder/?` +
                `media=${encodeURIComponent(imageUrl)}` +
                `&url=${encodeURIComponent(botUrl)}` +
                `&description=${encodeURIComponent(postText)}`;
            window.open(pinUrl, '_blank', 'noopener,noreferrer');

            // Параллельно скопируем текст
            try {
                await navigator.clipboard.writeText(postText);
                showToast('info', appState.translate('copied_to_clipboard'));
            } catch { }
            triggerHaptic('light');
        } catch (e) {
            console.error('Pinterest fallback error:', e);
            // Крайний фолбэк — просто копируем ссылку на бота + текст
            try {
                await navigator.clipboard.writeText(`${postText}`);
                showToast('info', appState.translate('copied_to_clipboard'));
            } catch { }
        }
    };

    // Пытаемся зашарить файл (Web Share API Level 2)
    try {
        // Скачаем изображение как blob (может упасть из-за CORS — обработаем)
        const resp = await fetch(imageUrl, { mode: 'cors' });
        const blob = await resp.blob();

        const extByType = {
            'image/png': 'png',
            'image/jpeg': 'jpg',
            'image/webp': 'webp',
            'image/gif': 'gif'
        };
        const ext = extByType[blob.type] || 'png';

        // Имя файла из промпта
        const safeName = (prompt || 'pixplace-image')
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\-_. ]/gu, '') // оставить буквы/цифры/дефис/подчёркивание/точку/пробел
            .trim()
            .replace(/\s+/g, '-')
            .slice(0, 60) || 'pixplace-image';

        const file = new File([blob], `${safeName}.${ext}`, { type: blob.type || 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            const shareData = {
                title,
                text: postText,
                files: [file],
                // url можно добавить; некоторые шары игнорируют при наличии files
                url: botUrl
            };

            await navigator.share(shareData);
            triggerHaptic('light');
            return;
        }

        // Если canShare с файлами не поддерживается — Pinterest фолбэк
        await openPinterestFallback();
    } catch (err) {
        // Если не удалось скачать blob (часто из-за CORS) — уйдём в Pinterest фолбэк
        console.warn('Share with file failed (likely CORS). Fallback to Pinterest:', err);
        await openPinterestFallback();
    }
}



// 🌍 Global Functions
window.toggleLanguage = () => appState.toggleLanguage();
window.toggleTheme = () => appState.toggleTheme();
window.showHistory = showHistory;
window.showGeneration = showGeneration;
window.showProcessing = showProcessing;
//window.selectStyle = selectStyle;
window.selectStyle = (s) => window.setCarouselStyle(s);
window.generateImage = generateImage;
window.newGeneration = newGeneration;
window.cancelGeneration = cancelGeneration;
window.clearHistory = clearHistory;
window.downloadImage = downloadImage;
window.shareImage = shareImage;
window.showSubscriptionNotice = showSubscriptionNotice;

// 🎵 Music Functions
/*let currentWidget = null;
let isPlaying = false;

function toggleMusicDropdown() {
    const dropdown = document.getElementById('musicDropdown');
    const isVisible = dropdown.style.display === 'block';

    if (isVisible) {
    dropdown.style.display = 'none';
    } else {
    dropdown.style.display = 'block';
    }

    console.log('🎵 Music dropdown toggled:', !isVisible);
}

function playPlaylist(type) {
    const playlists = {
    lofi: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/330718027&color=%237a8fb5&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false',
    ambient: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/330718027&color=%237a8fb5&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false',
    jazz: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/330718027&color=%237a8fb5&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false',
    relax: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/330718027&color=%237a8fb5&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false'
    };

    const iframe = document.getElementById('musicPlayer');
    iframe.src = playlists[type];

    // Показать контролы
    const controls = document.getElementById('musicControls');
    if (controls) {
    controls.style.display = 'flex';
    }

    // Обновить кнопку
    const playBtn = document.getElementById('playPauseBtn');
    if (playBtn) {
    playBtn.textContent = '▶ Play';
    playBtn.onclick = function () {
    startMusicPlayback(type);
    };
    }

    console.log(`🎵 Loading ${type} playlist`);
}

function startMusicPlayback(type) {
    const playlists = {
    lofi: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/330718027&color=%237a8fb5&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false',
    ambient: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/330718027&color=%237a8fb5&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false',
    jazz: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/330718027&color=%237a8fb5&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false',
    relax: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/330718027&color=%237a8fb5&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false'
    };

    const iframe = document.getElementById('musicPlayer');
    iframe.src = playlists[type];

    const playBtn = document.getElementById('playPauseBtn');
    if (playBtn) {
    playBtn.textContent = '⏸';
    playBtn.onclick = togglePlayPause;
    }

    isPlaying = true;
    console.log(`🎵 Started ${type} playlist`);
}

function togglePlayPause() {
    const playBtn = document.getElementById('playPauseBtn');
    if (isPlaying) {
    playBtn.textContent = '▶';
    isPlaying = false;
    } else {
    playBtn.textContent = '⏸';
    isPlaying = true;
    }
}

function setVolume(value) {
    console.log(`🔊 Volume set to ${value}%`);
}

// Закрытие dropdown при клике вне его
document.addEventListener('click', function (event) {
    const musicWidget = document.querySelector('.music-widget');
    const dropdown = document.getElementById('musicDropdown');

    if (musicWidget && dropdown && !musicWidget.contains(event.target)) {
    dropdown.style.display = 'none';
    }
});*/
// 🔗 Telegram SDK Loader
async function loadTelegramSDK() {
    console.log('📱 Loading Telegram WebApp SDK...');

    // Если уже загружен - сразу возвращаем
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        console.log('✅ Telegram SDK already loaded');
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            console.warn('⚠️ Telegram SDK load timeout - using fallback mode');
            resolve(); // разрешаем продолжить без SDK
        }, 5000); // 5 секунд таймут

        // Проверяем наличие скрипта Telegram
        const existingScript = document.querySelector('script[src*="telegram-web-app.js"]');
        if (existingScript) {
            console.log('✅ Telegram script already exists');
            clearTimeout(timeout);
            resolve();
            return;
        }

        // Создаём и загружаем скрипт
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-web-app.js';
        script.async = true;
        script.defer = true;

        script.onload = () => {
            console.log('✅ Telegram SDK loaded successfully');
            clearTimeout(timeout);

            // Подождём небольшую задержку для инициализации SDK
            setTimeout(() => {
                resolve();
            }, 100);
        };

        script.onerror = (error) => {
            console.error('❌ Failed to load Telegram SDK:', error);
            clearTimeout(timeout);
            resolve(); // разрешаем продолжить без SDK
        };

        // Добавляем скрипт в head
        document.head.appendChild(script);
        console.log('📱 Telegram SDK loading started...');
    });
}

// 🧪 Debug Functions
window.getAppState = () => appState;
window.setWebhookUrl = (url) => {
    CONFIG.WEBHOOK_URL = url;
    console.log('✅ Webhook URL updated');
};

console.log('🎯 pixPLace App loaded!');
console.log('🔧 Debug commands:');
console.log('- getAppState() - get current app state');
console.log('- setWebhookUrl("url") - set webhook URL');
console.log('⚠️ Don\'t forget to set your webhook URL!');
// Добавьте в конец файла:
window.closeLimitModal = () => {
    const modal = document.getElementById('limitModal');
    if (modal) {
        modal.classList.remove('show');
        showGeneration();
    }
};

// ========== COGNITIVE ASSISTANT INTEGRATION ==========
function createCoachButton() {
    // Create button
    const coachButton = document.createElement('button');
    coachButton.textContent = 'AI Prompt Assistant';
    coachButton.className = 'ai-coach-btn';

    // Ванильные CSS стили вместо Tailwind классов (проект не использует Tailwind)
    Object.assign(coachButton.style, {
        position: 'fixed',
        top: '6rem',         // top-4 = 16px
        right: '1rem',       // right-4 = 16px
        zIndex: '40',        // z-40
        background: 'linear-gradient(135deg, #173565ff, #2f3032ff)', // blue-600 to blue-700
        color: 'white',
        padding: '0.5rem 1rem', // px-4 py-2
        borderRadius: '0.5rem',   // rounded-lg
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', // shadow-lg
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',   // text-sm
        fontWeight: '600',
        transition: 'all 0.2s ease' // transition-all duration-200
    });
    coachButton.onclick = () => {
        if (window.AICoach) {
            window.AICoach.show();
        } else {
            console.warn('AI Coach not loaded');
        }
    };

    // Add to body (fixed position for easy access)
    document.body.appendChild(coachButton);

    // Style injection for button (minimal)
    const style = document.createElement('style');
    style.textContent = `
        .ai-coach-btn {
            font-size: 14px;
            border: none;
            cursor: pointer;
        }
        .ai-coach-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
    `;
    document.head.appendChild(style);

    console.log('🧠 AI Coach button created');
}

async function initAICoach() {
    try {
        // Проверить, что AICoach доступен (уже загружен из HTML)
        if (!window.AICoach) {
            console.warn('AI Coach not loaded from HTML');
            return;
        }

        createCoachButton();
        // Дополнительно можно прослушать событие, если нужно
        window.addEventListener('ai-coach-ready', createCoachButton);
    } catch (error) {
        console.error('Failed to init AI Coach:', error);
    }
}

function createChatButton() {
    // Create floating chat button
    const chatBtn = document.createElement('button');
    chatBtn.id = 'ai-chat-float-btn';
    chatBtn.innerHTML = 'AI Chat';
    chatBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 20px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 8px;
    `;

    chatBtn.onmouseenter = () => {
        chatBtn.style.transform = 'scale(1.05)';
        chatBtn.style.boxShadow = '0 6px 25px rgba(99, 102, 241, 0.6)';
    };

    chatBtn.onmouseleave = () => {
        chatBtn.style.transform = 'scale(1)';
        chatBtn.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.4)';
    };

    chatBtn.onclick = () => {
        if (window.AICoach) {
            window.AICoach.show();
            triggerHaptic('light');
        }
    };

    document.body.appendChild(chatBtn);
    console.log('🧠 AI Chat floating button created');
}

// 🔥 КАРУСЕЛЬ ПЛАНОВ В ЛИМИТ МОДАЛ
// Глобальные переменные для управления каруселью планов
let planCarouselInterval = null;
let currentPlanSlide = 0;

function initPlansCarousel() {
    const carousel = document.querySelector('.plans-carousel');
    const indicators = document.querySelectorAll('.indicator');

    if (!carousel || !indicators.length) {
        console.log('Plans carousel not found, skipping init');
        return;
    }

    const cards = document.querySelectorAll('.plan-card');
    const totalSlides = Math.ceil(cards.length / 3); // 3 карточки на слайд

    // Функция для обновления индикаторов
    function updateIndicators(activeIndex) {
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === activeIndex);
        });
    }

    // Функция для прокрутки к слайду
    function scrollToSlide(slideIndex) {
        currentPlanSlide = slideIndex;
        const cardWidth = cards[0].offsetWidth;
        const gap = 16; // Расстояние между карточками в px
        const scrollLeft = slideIndex * (cardWidth * 3 + gap * 2);
        carousel.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
        updateIndicators(slideIndex);
    }

    // Автопрокрутка - только если пользователь не взаимодействует
    let userIsInteracting = false; // флаг взаимодействия пользователя

    function startAutoScroll() {
        stopAutoScroll(); // Остановка предыдущего интервала
        planCarouselInterval = setInterval(() => {
            // НЕ прокручиваем автоматически, если пользователь взаимодействует
            if (!userIsInteracting) {
                currentPlanSlide = (currentPlanSlide + 1) % totalSlides;
                scrollToSlide(currentPlanSlide);
            }
        }, 5000); // Увеличили интервал до 5 секунд для плавности
    }

    function stopAutoScroll() {
        if (planCarouselInterval) {
            clearInterval(planCarouselInterval);
            planCarouselInterval = null;
        }
    }

    // Пауза при наведении
    carousel.addEventListener('mouseenter', stopAutoScroll);
    carousel.addEventListener('mouseleave', startAutoScroll);

    // Клик по индикаторам
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            scrollToSlide(index);
            stopAutoScroll();
            setTimeout(startAutoScroll, 2000);
        });
    });

    // Свайпы для мобильных
    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoScroll();
    });

    carousel.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentPlanSlide < totalSlides - 1) {
                scrollToSlide(currentPlanSlide + 1);
            } else if (diff < 0 && currentPlanSlide > 0) {
                scrollToSlide(currentPlanSlide - 1);
            }
        }
        setTimeout(startAutoScroll, 3000);
    });

    // ИНИЦИАЛИЗАЦИЯ - ФОРСИРОВАННО ЦЕНТРИРУЕМ PRO КАРТУ (индекс 1)
    const centerCardIndex = 1; // Про = индекс 1 (для 3 карт: 0=LITE, 1=PRO, 2=STUDIO)
    const centerCard = cards[centerCardIndex];

    if (centerCard) {
        // Полностью центрируем PRO карту по центру экрана
        setTimeout(() => {
            const containerWidth = carousel.offsetWidth;
            const cardWidth = centerCard.offsetWidth;
            const cardLeft = centerCard.offsetLeft;
            const containerLeft = carousel.offsetLeft;
            const scrollPosition = cardLeft - (containerWidth / 2) + (cardWidth / 2);
            carousel.scrollLeft = Math.max(0, scrollPosition);

            // Второе центрирование через 100мс для точности
            setTimeout(() => {
                centerCard.scrollIntoView({
                    behavior: 'instant',
                    block: 'nearest',
                    inline: 'center'
                });
            }, 100);
        }, 50);
    }

    highlight(cards[centerCardIndex], { scroll: false });
    updateIndicators(centerCardIndex);
    startAutoScroll();
    console.log('🔥 🔥 Plans carousel initialized - forced center on PRO card (index', centerCardIndex, ')');
}

// 🎯 ОБРАБОТЧИКИ ДЛЯ КАРТОЧЕК ПЛАНОВ
function initPlanCards() {
    const cards = document.querySelectorAll('.plan-card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const planType = card.className.includes('lite') ? 'lite' :
                card.className.includes('pro') ? 'pro' : 'studio';

            // Анимация выбора
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            card.style.animation = 'pulse 0.6s ease-out';
            setTimeout(() => {
                card.style.animation = '';
            }, 600);

            console.log('Selected plan:', planType);
        });

        // Эффекты при наведении
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-12px) scale(1.03)';
        });

        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('selected')) {
                card.style.transform = '';
            }
        });
    });
}

// 🎨 ЭФФЕКТЫ СТЕКЛА
function initGlassmorphismEffects() {
    const cards = document.querySelectorAll('.plan-card');

    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';

        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// ИНИЦИАЛИЗАЦИЯ КАРУСЕЛИ ПРИ ПОКАЗЕ МОДАЛА
document.addEventListener('DOMContentLoaded', function () {
    // Наблюдатель за появлением модала лимита
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const modal = document.getElementById('limitModal');
                if (modal && modal.classList.contains('show')) {
                    // Модал появился - инициализируем карусель
                    setTimeout(() => {
                        initPlansCarousel();
                        initPlanCards();
                        initGlassmorphismEffects();
                    }, 100);
                }
            }
        });
    });

    const modal = document.getElementById('limitModal');
    if (modal) {
        observer.observe(modal, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
});

// Экспорт функций для использования
window.plansCarousel = {
    init: initPlansCarousel,
    stopAutoScroll: function () {
        if (planCarouselInterval) {
            clearInterval(planCarouselInterval);
            planCarouselInterval = null;
        }
    }
};
