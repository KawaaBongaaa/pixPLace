// 🚀 Modern AI Image Generator WebApp

// Configuration
const CONFIG = {
    WEBHOOK_URL: 'https://hook.us2.make.com/x2hgl6ocask8hearbpwo3ch7pdwpdlrk', // ⚠️ ЗАМЕНИТЕ НА ВАШ WEBHOOK!
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
};
// 🌍 Translations
const TRANSLATIONS = {
    en: {
        loading: 'Please, Have a Fun',
        app_title: 'pixPLace',
        connecting: 'Connecting...',
        connected: 'Connected to Telegram',
        welcome_title: 'Create Amazing Images',
        welcome_subtitle: 'Describe your vision and watch AI bring it to life',
        prompt_label: 'Prompt',
        prompt_placeholder: 'A beautiful sunset over the ocean...',
        style_label: 'Style',
        style_realistic: 'Realistic',
        style_artistic: 'Artistic',
        style_cartoon: 'Cartoon',
        style_fantasy: 'Fantasy',
        style_anime: 'Anime',
        style_cyberpunk: 'Cyberpunk',
        style_popart: 'Pop Art',
        style_abstract: 'Abstract',
        style_sketch: 'Sketch',
        style_3d: '3d',
        style_sticker: 'Sticker',
        style_vector: 'Vector',
        style_interior: 'Interior',
        style_architecture: 'Architecture',
        style_fashion: 'Fashion',
        style_tattoo: 'Tattoo',
        style_print: 'Print',
        style_logo: 'Logo',
        style_icon: 'Icon',
        style_banner: 'Banner',
        mode_label: 'Mode',
        mode_print_maker: 'Print/Stickers',
        mode_photo_session: 'Photo Session',
        mode_fast_generation: 'Fast Generation',
        mode_pixplace_pro: 'pixPLace Pro (Logo/Text/Photo Supported)',
        size_label: 'Size',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: 'Generate Image',
        processing_title: 'Creating Your Masterpiece',
        processing_subtitle: 'This may take up to 60 seconds',
        step_analyzing: 'Analyzing prompt',
        step_generating: 'Generating image',
        step_finalizing: 'Finalizing result',
        elapsed_time: 'Elapsed time:',
        cancel_btn: 'Cancel',
        create_new: 'Create New',
        view_history: 'View History',
        history_title: 'Generation History',
        empty_history_title: 'No generations yet',
        empty_history_subtitle: 'Create your first AI image to see it here',
        generation_time: 'Generation time',
        error_prompt_required: 'Please describe your image',
        error_prompt_too_short: 'Prompt too short (minimum 5 characters)',
        error_webhook_not_configured: 'Webhook URL not configured',
        error_generation_failed: 'Generation failed',
        error_timeout: 'Generation timeout. Please try again.',
        success_generated: 'Image generated successfully!',
        copied_to_clipboard: 'Copied to clipboard',
        download_started: 'Download started',
        limit_title: 'Generation Limit Reached',
        limit_message: 'You\'ve reached your free generation limit. Upgrade to continue creating amazing images!',
        check_subsciption: 'Check Subsciption',
        closeLimitModal: 'Maybe Later',
        upgradeBtn: 'Upgrade Now',
        remove_user_image: 'Remove',
        reference_image: 'Reference',
        optional_choice: '(optional)',
        upload_image: 'Upload Img'

    },
    ru: {
        loading: 'Творите с Удовольствием!',
        app_title: 'pixPLace',
        connecting: 'Подключение...',
        connected: 'Подключено к Telegram',
        welcome_title: 'Создавайте Потрясающие Изображения',
        welcome_subtitle: 'Опишите свое видение и наблюдайте, как pixPLace воплощает его в жизнь',
        prompt_label: 'Prompt',
        prompt_placeholder: 'Красивый закат над океаном...',
        style_label: 'Стиль',
        style_realistic: 'Реализм',
        style_artistic: 'Арт',
        style_cartoon: 'Мульт',
        style_sketch: 'Скетч',
        style_fantasy: 'Фэнтэзи',
        style_anime: 'Анимэ',
        style_cyberpunk: 'CyberPunk',
        mode_label: 'Режим генерации',
        mode_print_maker: 'Принты/Стикеры',
        mode_fast_generation: 'Быстрая генерация',
        mode_pixplace_pro: 'pixPLace Pro (Logo/Text/Photo)',
        size_label: 'Размер',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: 'Создать Изображение',
        processing_title: 'Создаем Ваш Шедевр',
        processing_subtitle: 'Это может занять до 60 секунд',
        step_analyzing: 'Анализируем промпт',
        step_generating: 'Генерируем изображение',
        step_finalizing: 'Завершаем результат',
        elapsed_time: 'Прошло времени:',
        cancel_btn: 'Отменить',
        create_new: 'Создать Новое',
        view_history: 'Посмотреть Историю',
        history_title: 'История Генераций',
        empty_history_title: 'Пока нет генераций',
        empty_history_subtitle: 'Создайте первое ИИ изображение, чтобы увидеть его здесь',
        generation_time: 'Время генерации',
        error_prompt_required: 'Пожалуйста, опишите изображение',
        error_prompt_too_short: 'Описание слишком короткое (минимум 5 символов)',
        error_webhook_not_configured: 'Webhook URL не настроен',
        error_generation_failed: 'Генерация не удалась',
        error_timeout: 'Превышено время ожидания. Попробуйте еще раз.',
        success_generated: 'Изображение успешно создано!',
        copied_to_clipboard: 'Скопировано в буфер обмена',
        download_started: 'Загрузка началась',
        limit_title: 'Лимит Генераций Исчерпан',
        limit_message: 'Токены для генерации Закончились! Вы можете получить Больше Токенов, оплатив подписку на канал pixPLace',
        check_subsciption: 'проверить Подписку',
        closeLimitModal: 'Может Позже',
        upgradeBtn: 'Оплатить Сейчас'

    },
    es: {
        loading: '¡Crea con diversión!',
        app_title: 'pixPLace',
        connecting: 'Conectando...',
        connected: 'Conectado a Telegram',
        welcome_title: 'Crea Imágenes Asombrosas',
        welcome_subtitle: 'Describe tu visión y observa cómo la IA la hace realidad',
        prompt_label: 'Prompt',
        prompt_placeholder: 'Una hermosa puesta de sol sobre el océano...',
        style_label: 'Estilo',
        style_realistic: 'Realista',
        style_artistic: 'Artístico',
        style_cartoon: 'Dibujo animado',
        style_fantasy: 'Fantasía',
        style_anime: 'Anime',
        style_cyberpunk: 'Cyberpunk',
        mode_label: 'Modo',
        mode_print_maker: 'Impresiones/Stickers',
        mode_fast_generation: 'Generación rápida',
        mode_pixplace_pro: 'pixPLace Pro (Logo/Texto/Photo Soportado)',
        size_label: 'Tamaño',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: 'Generar Imagen',
        processing_title: 'Creando Tu Obra Maestra',
        processing_subtitle: 'Esto puede tardar hasta 60 segundos',
        step_analyzing: 'Analizando prompt',
        step_generating: 'Generando imagen',
        step_finalizing: 'Finalizando resultado',
        elapsed_time: 'Tiempo transcurrido:',
        cancel_btn: 'Cancelar',
        create_new: 'Crear Nuevo',
        view_history: 'Ver Historial',
        history_title: 'Historial de Generaciones',
        empty_history_title: 'Aún no hay generaciones',
        empty_history_subtitle: 'Crea tu primera imagen con IA para verla aquí',
        generation_time: 'Tiempo de generación',
        error_prompt_required: 'Por favor describe tu imagen',
        error_prompt_too_short: 'El prompt es demasiado corto (mínimo 5 caracteres)',
        error_webhook_not_configured: 'Webhook no configurado',
        error_generation_failed: 'Fallo en la generación',
        error_timeout: 'Tiempo de espera agotado. Inténtalo de nuevo.',
        success_generated: '¡Imagen generada con éxito!',
        copied_to_clipboard: 'Copiado al portapapeles',
        download_started: 'Descarga iniciada',
        limit_title: 'Límite de Generaciones Alcanzado',
        limit_message: 'Has alcanzado tu límite gratuito. ¡Actualiza para seguir creando imágenes increíbles!',
        check_subsciption: 'Comprobar Suscripción',
        closeLimitModal: 'Quizás más tarde',
        upgradeBtn: 'Actualizar ahora'
    },
    fr: {
        loading: 'Créez avec plaisir !',
        app_title: 'pixPLace',
        connecting: 'Connexion...',
        connected: 'Connecté à Telegram',
        welcome_title: 'Créez des Images Incroyables',
        welcome_subtitle: 'Décrivez votre vision et laissez l’IA lui donner vie',
        prompt_label: 'Prompt',
        prompt_placeholder: 'Un magnifique coucher de soleil sur l’océan...',
        style_label: 'Style',
        style_realistic: 'Réaliste',
        style_artistic: 'Artistique',
        style_cartoon: 'Dessin animé',
        style_fantasy: 'Fantaisie',
        style_anime: 'Anime',
        style_cyberpunk: 'Cyberpunk',
        mode_label: 'Mode',
        mode_print_maker: 'Impressions/Autocollants',
        mode_fast_generation: 'Génération rapide',
        mode_pixplace_pro: 'pixPLace Pro (Logo/Texte Supporté)',
        size_label: 'Taille',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: 'Générer Image',
        processing_title: 'Création de Votre Chef-d’œuvre',
        processing_subtitle: 'Cela peut prendre jusqu’à 60 secondes',
        step_analyzing: 'Analyse du prompt',
        step_generating: 'Génération de l’image',
        step_finalizing: 'Finalisation du résultat',
        elapsed_time: 'Temps écoulé :',
        cancel_btn: 'Annuler',
        create_new: 'Créer Nouveau',
        view_history: 'Voir l’Historique',
        history_title: 'Historique des Générations',
        empty_history_title: 'Aucune génération pour le moment',
        empty_history_subtitle: 'Créez votre première image IA pour la voir ici',
        generation_time: 'Temps de génération',
        error_prompt_required: 'Veuillez décrire votre image',
        error_prompt_too_short: 'Prompt trop court (minimum 5 caractères)',
        error_webhook_not_configured: 'Webhook non configuré',
        error_generation_failed: 'Échec de la génération',
        error_timeout: 'Délai dépassé. Réessayez.',
        success_generated: 'Image générée avec succès !',
        copied_to_clipboard: 'Copié dans le presse-papiers',
        download_started: 'Téléchargement démarré',
        limit_title: 'Limite de Générations Atteinte',
        limit_message: 'Vous avez atteint votre limite gratuite. Passez à l’abonnement pour continuer à créer des images incroyables !',
        check_subsciption: 'Vérifier Abonnement',
        closeLimitModal: 'Peut-être plus tard',
        upgradeBtn: 'Mettre à niveau maintenant'
    },
    de: {
        loading: 'Viel Spaß beim Erstellen!',
        app_title: 'pixPLace',
        connecting: 'Verbinde...',
        connected: 'Mit Telegram verbunden',
        welcome_title: 'Erstelle Erstaunliche Bilder',
        welcome_subtitle: 'Beschreibe deine Vision und beobachte, wie die KI sie zum Leben erweckt',
        prompt_label: 'Prompt',
        prompt_placeholder: 'Ein schöner Sonnenuntergang über dem Ozean...',
        style_label: 'Stil',
        style_realistic: 'Realistisch',
        style_artistic: 'Künstlerisch',
        style_cartoon: 'Cartoon',
        style_fantasy: 'Fantasie',
        style_anime: 'Anime',
        style_cyberpunk: 'Cyberpunk',
        mode_label: 'Modus',
        mode_print_maker: 'Drucke/Sticker',
        mode_fast_generation: 'Schnelle Generierung',
        mode_pixplace_pro: 'pixPLace Pro (Logo/Text unterstützt)',
        size_label: 'Größe',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: 'Bild generieren',
        processing_title: 'Dein Meisterwerk wird erstellt',
        processing_subtitle: 'Dies kann bis zu 60 Sekunden dauern',
        step_analyzing: 'Prompt analysieren',
        step_generating: 'Bild wird generiert',
        step_finalizing: 'Ergebnis wird finalisiert',
        elapsed_time: 'Verstrichene Zeit:',
        cancel_btn: 'Abbrechen',
        create_new: 'Neu Erstellen',
        view_history: 'Verlauf anzeigen',
        history_title: 'Generationsverlauf',
        empty_history_title: 'Noch keine Generierungen',
        empty_history_subtitle: 'Erstelle dein erstes KI-Bild, um es hier zu sehen',
        generation_time: 'Generierungszeit',
        error_prompt_required: 'Bitte beschreibe dein Bild',
        error_prompt_too_short: 'Prompt zu kurz (mindestens 5 Zeichen)',
        error_webhook_not_configured: 'Webhook nicht konfiguriert',
        error_generation_failed: 'Generierung fehlgeschlagen',
        error_timeout: 'Zeitüberschreitung. Bitte erneut versuchen.',
        success_generated: 'Bild erfolgreich generiert!',
        copied_to_clipboard: 'In die Zwischenablage kopiert',
        download_started: 'Download gestartet',
        limit_title: 'Generierungslimit erreicht',
        limit_message: 'Du hast dein kostenloses Limit erreicht. Upgrade, um weiterhin tolle Bilder zu erstellen!',
        check_subsciption: 'Abonnement prüfen',
        closeLimitModal: 'Vielleicht später',
        upgradeBtn: 'Jetzt upgraden'
    },
    zh: {
        loading: '尽情创作吧！',
        app_title: 'pixPLace',
        connecting: '连接中...',
        connected: '已连接到 Telegram',
        welcome_title: '创造惊艳的图像',
        welcome_subtitle: '描述你的愿景，看AI将其变为现实',
        prompt_label: '提示词',
        prompt_placeholder: '美丽的海上日落...',
        style_label: '风格',
        style_realistic: '写实',
        style_artistic: '艺术',
        style_cartoon: '卡通',
        style_fantasy: '幻想',
        style_anime: '动漫',
        style_cyberpunk: '赛博朋克',
        mode_label: '模式',
        mode_print_maker: '打印/贴纸',
        mode_fast_generation: '快速生成',
        mode_pixplace_pro: 'pixPLace Pro (支持文本)',
        size_label: '尺寸',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: '生成图像',
        processing_title: '正在创造你的杰作',
        processing_subtitle: '这可能需要长达 60 秒',
        step_analyzing: '分析提示词',
        step_generating: '生成图像',
        step_finalizing: '完成结果',
        elapsed_time: '已用时间：',
        cancel_btn: '取消',
        create_new: '创建新图像',
        view_history: '查看历史',
        history_title: '生成历史',
        empty_history_title: '暂无生成记录',
        empty_history_subtitle: '创建你的第一张AI图像后可在此查看',
        generation_time: '生成时间',
        error_prompt_required: '请描述你的图像',
        error_prompt_too_short: '提示词过短（至少 5 个字符）',
        error_webhook_not_configured: 'Webhook 未配置',
        error_generation_failed: '生成失败',
        error_timeout: '超时，请重试。',
        success_generated: '图像生成成功！',
        copied_to_clipboard: '已复制到剪贴板',
        download_started: '下载已开始',
        limit_title: '生成次数已达上限',
        limit_message: '已达到免费生成上限。升级以继续创造惊艳的图像！',
        check_subsciption: '检查订阅',
        closeLimitModal: '稍后再说',
        upgradeBtn: '立即升级'
    },
    pt: {
        loading: 'Crie com prazer!',
        app_title: 'pixPLace',
        connecting: 'Conectando...',
        connected: 'Conectado ao Telegram',
        welcome_title: 'Crie Imagens Incríveis',
        welcome_subtitle: 'Descreva sua visão e veja a IA torná-la realidade',
        prompt_label: 'Prompt',
        prompt_placeholder: 'Um lindo pôr do sol sobre o oceano...',
        style_label: 'Estilo',
        style_realistic: 'Realista',
        style_artistic: 'Artístico',
        style_cartoon: 'Desenho animado',
        style_fantasy: 'Fantasia',
        style_anime: 'Anime',
        style_cyberpunk: 'Cyberpunk',
        mode_label: 'Modo',
        mode_print_maker: 'Impressões/Adesivos',
        mode_fast_generation: 'Geração rápida',
        mode_pixplace_pro: 'pixPLace Pro (Logo/Texto Suportado)',
        size_label: 'Tamanho',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: 'Gerar Imagem',
        processing_title: 'Criando Sua Obra-prima',
        processing_subtitle: 'Isso pode levar até 60 segundos',
        step_analyzing: 'Analisando prompt',
        step_generating: 'Gerando imagem',
        step_finalizing: 'Finalizando resultado',
        elapsed_time: 'Tempo decorrido:',
        cancel_btn: 'Cancelar',
        create_new: 'Criar Novo',
        view_history: 'Ver Histórico',
        history_title: 'Histórico de Gerações',
        empty_history_title: 'Nenhuma geração ainda',
        empty_history_subtitle: 'Crie sua primeira imagem IA para vê-la aqui',
        generation_time: 'Tempo de geração',
        error_prompt_required: 'Por favor descreva sua imagem',
        error_prompt_too_short: 'Prompt muito curto (mínimo 5 caracteres)',
        error_webhook_not_configured: 'Webhook não configurado',
        error_generation_failed: 'Falha na geração',
        error_timeout: 'Tempo limite excedido. Tente novamente.',
        success_generated: 'Imagem gerada com sucesso!',
        copied_to_clipboard: 'Copiado para a área de transferência',
        download_started: 'Download iniciado',
        limit_title: 'Limite de Gerações Atingido',
        limit_message: 'Você atingiu seu limite gratuito. Atualize para continuar criando imagens incríveis!',
        check_subsciption: 'Verificar Assinatura',
        closeLimitModal: 'Talvez depois',
        upgradeBtn: 'Atualizar agora'
    },
    ar: {
        loading: 'ابتكر بمتعة!',
        app_title: 'pixPLace',
        connecting: 'جارٍ الاتصال...',
        connected: 'تم الاتصال بـ Telegram',
        welcome_title: 'أنشئ صوراً مذهلة',
        welcome_subtitle: 'صف رؤيتك وشاهد كيف يحولها الذكاء الاصطناعي إلى حقيقة',
        prompt_label: 'الوصف',
        prompt_placeholder: 'غروب جميل فوق المحيط...',
        style_label: 'النمط',
        style_realistic: 'واقعي',
        style_artistic: 'فني',
        style_cartoon: 'كرتوني',
        style_fantasy: 'خيالي',
        style_anime: 'أنمي',
        style_cyberpunk: 'سايبربانك',
        mode_label: 'الوضع',
        mode_print_maker: 'طباعة/ملصقات',
        mode_fast_generation: 'توليد سريع',
        mode_pixplace_pro: 'pixPLace Pro (يدعم النصوص)',
        size_label: 'الحجم',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: 'إنشاء صورة',
        processing_title: 'جاري إنشاء تحفتك',
        processing_subtitle: 'قد يستغرق ذلك ما يصل إلى 60 ثانية',
        step_analyzing: 'تحليل الوصف',
        step_generating: 'جارٍ التوليد',
        step_finalizing: 'جارٍ الإنهاء',
        elapsed_time: 'الوقت المنقضي:',
        cancel_btn: 'إلغاء',
        create_new: 'إنشاء جديد',
        view_history: 'عرض السجل',
        history_title: 'سجل التوليد',
        empty_history_title: 'لا توجد توليدات بعد',
        empty_history_subtitle: 'أنشئ أول صورة بالذكاء الاصطناعي لعرضها هنا',
        generation_time: 'وقت التوليد',
        error_prompt_required: 'يرجى وصف الصورة',
        error_prompt_too_short: 'الوصف قصير جدًا (5 أحرف على الأقل)',
        error_webhook_not_configured: 'لم يتم تكوين Webhook',
        error_generation_failed: 'فشل التوليد',
        error_timeout: 'انتهت المهلة. حاول مرة أخرى.',
        success_generated: 'تم إنشاء الصورة بنجاح!',
        copied_to_clipboard: 'تم النسخ إلى الحافظة',
        download_started: 'بدأ التنزيل',
        limit_title: 'تم بلوغ الحد الأقصى',
        limit_message: 'لقد وصلت إلى الحد المجاني. قم بالترقية لمواصلة إنشاء صور مذهلة!',
        check_subsciption: 'تحقق من الاشتراك',
        closeLimitModal: 'ربما لاحقًا',
        upgradeBtn: 'قم بالترقية الآن'
    },
    hi: {
        loading: 'मज़े के साथ बनाएँ!',
        app_title: 'pixPLace',
        connecting: 'कनेक्ट हो रहा है...',
        connected: 'Telegram से जुड़ गया',
        welcome_title: 'शानदार छवियाँ बनाएँ',
        welcome_subtitle: 'अपनी कल्पना का वर्णन करें और देखें कि AI उसे जीवन में कैसे लाता है',
        prompt_label: 'प्रॉम्प्ट',
        prompt_placeholder: 'समुद्र पर एक सुंदर सूर्यास्त...',
        style_label: 'शैली',
        style_realistic: 'यथार्थवादी',
        style_artistic: 'कलात्मक',
        style_cartoon: 'कार्टून',
        style_fantasy: 'फैंटेसी',
        style_anime: 'ऐनिमे',
        style_cyberpunk: 'साइबरपंक',
        mode_label: 'मोड',
        mode_print_maker: 'प्रिंट/स्टिकर',
        mode_fast_generation: 'तेज़ जनरेशन',
        mode_pixplace_pro: 'pixPLace Pro (टेक्स्ट समर्थित)',
        size_label: 'आकार',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: 'छवि बनाएँ',
        processing_title: 'आपकी उत्कृष्ट कृति बना रहे हैं',
        processing_subtitle: 'इसमें 60 सेकंड तक लग सकते हैं',
        step_analyzing: 'प्रॉम्प्ट का विश्लेषण',
        step_generating: 'छवि बना रहे हैं',
        step_finalizing: 'परिणाम अंतिम कर रहे हैं',
        elapsed_time: 'बीता हुआ समय:',
        cancel_btn: 'रद्द करें',
        create_new: 'नया बनाएँ',
        view_history: 'इतिहास देखें',
        history_title: 'जनरेशन इतिहास',
        empty_history_title: 'अभी तक कोई जनरेशन नहीं',
        empty_history_subtitle: 'अपनी पहली AI छवि बनाएँ और उसे यहाँ देखें',
        generation_time: 'जनरेशन समय',
        error_prompt_required: 'कृपया छवि का वर्णन करें',
        error_prompt_too_short: 'प्रॉम्प्ट बहुत छोटा है (न्यूनतम 5 अक्षर)',
        error_webhook_not_configured: 'Webhook कॉन्फ़िगर नहीं है',
        error_generation_failed: 'जनरेशन विफल रहा',
        error_timeout: 'समय सीमा समाप्त। कृपया पुनः प्रयास करें।',
        success_generated: 'छवि सफलतापूर्वक बनाई गई!',
        copied_to_clipboard: 'क्लिपबोर्ड पर कॉपी किया गया',
        download_started: 'डाउनलोड शुरू हुआ',
        limit_title: 'सीमा पूरी हो गई',
        limit_message: 'आपकी मुफ़्त सीमा समाप्त हो गई है। अद्भुत छवियाँ बनाने के लिए अपग्रेड करें!',
        check_subsciption: 'सदस्यता जाँचें',
        closeLimitModal: 'शायद बाद में',
        upgradeBtn: 'अभी अपग्रेड करें'
    },
    ja: {
        loading: '楽しく作りましょう！',
        app_title: 'pixPLace',
        connecting: '接続中...',
        connected: 'Telegramに接続しました',
        welcome_title: '驚くべき画像を作成',
        welcome_subtitle: 'あなたのビジョンを説明し、AIがそれを実現するのを見ましょう',
        prompt_label: 'プロンプト',
        prompt_placeholder: '海に沈む美しい夕日...',
        style_label: 'スタイル',
        style_realistic: 'リアル',
        style_artistic: 'アート',
        style_cartoon: 'カートゥーン',
        style_fantasy: 'ファンタジー',
        style_anime: 'アニメ',
        style_cyberpunk: 'サイバーパンク',
        mode_label: 'モード',
        mode_print_maker: 'プリント/ステッカー',
        mode_fast_generation: '高速生成',
        mode_pixplace_pro: 'pixPLace Pro (テキスト対応)',
        size_label: 'サイズ',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: '画像を生成',
        processing_title: 'あなたの傑作を作成中',
        processing_subtitle: '最大60秒かかる場合があります',
        step_analyzing: 'プロンプトを分析中',
        step_generating: '画像を生成中',
        step_finalizing: '結果を仕上げています',
        elapsed_time: '経過時間：',
        cancel_btn: 'キャンセル',
        create_new: '新しく作成',
        view_history: '履歴を見る',
        history_title: '生成履歴',
        empty_history_title: 'まだ生成はありません',
        empty_history_subtitle: '最初のAI画像を作成してここに表示しましょう',
        generation_time: '生成時間',
        error_prompt_required: '画像を説明してください',
        error_prompt_too_short: 'プロンプトが短すぎます（最小5文字）',
        error_webhook_not_configured: 'Webhookが未設定です',
        error_generation_failed: '生成に失敗しました',
        error_timeout: 'タイムアウトしました。再試行してください。',
        success_generated: '画像が正常に生成されました！',
        copied_to_clipboard: 'クリップボードにコピーしました',
        download_started: 'ダウンロードを開始しました',
        limit_title: '生成制限に達しました',
        limit_message: '無料制限に達しました。アップグレードしてさらに素晴らしい画像を作成しましょう！',
        check_subsciption: 'サブスクリプションを確認',
        closeLimitModal: '後で',
        upgradeBtn: '今すぐアップグレード'
    },
    it: {
        loading: 'Crea con piacere!',
        app_title: 'pixPLace',
        connecting: 'Connessione...',
        connected: 'Connesso a Telegram',
        welcome_title: 'Crea Immagini Straordinarie',
        welcome_subtitle: 'Descrivi la tua visione e guarda l’IA darle vita',
        prompt_label: 'Prompt',
        prompt_placeholder: 'Un bellissimo tramonto sull’oceano...',
        style_label: 'Stile',
        style_realistic: 'Realistico',
        style_artistic: 'Artistico',
        style_cartoon: 'Cartone animato',
        style_fantasy: 'Fantasy',
        style_anime: 'Anime',
        style_cyberpunk: 'Cyberpunk',
        mode_label: 'Modalità',
        mode_print_maker: 'Stampe/Sticker',
        mode_fast_generation: 'Generazione veloce',
        mode_pixplace_pro: 'pixPLace Pro (Supporto Testo/Logos)',
        size_label: 'Dimensione',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: 'Genera Immagine',
        processing_title: 'Creazione del tuo capolavoro',
        processing_subtitle: 'Può richiedere fino a 60 secondi',
        step_analyzing: 'Analisi del prompt',
        step_generating: 'Generazione immagine',
        step_finalizing: 'Finalizzazione risultato',
        elapsed_time: 'Tempo trascorso:',
        cancel_btn: 'Annulla',
        create_new: 'Crea Nuovo',
        view_history: 'Vedi Cronologia',
        history_title: 'Cronologia Generazioni',
        empty_history_title: 'Ancora nessuna generazione',
        empty_history_subtitle: 'Crea la tua prima immagine AI per vederla qui',
        generation_time: 'Tempo di generazione',
        error_prompt_required: 'Per favore descrivi la tua immagine',
        error_prompt_too_short: 'Prompt troppo breve (minimo 5 caratteri)',
        error_webhook_not_configured: 'Webhook non configurato',
        error_generation_failed: 'Generazione fallita',
        error_timeout: 'Timeout. Riprova.',
        success_generated: 'Immagine generata con successo!',
        copied_to_clipboard: 'Copiato negli appunti',
        download_started: 'Download avviato',
        limit_title: 'Limite Generazioni Raggiunto',
        limit_message: 'Hai raggiunto il limite gratuito. Aggiorna per continuare a creare immagini straordinarie!',
        check_subsciption: 'Controlla Abbonamento',
        closeLimitModal: 'Forse più tardi',
        upgradeBtn: 'Aggiorna ora'
    },
    ko: {
        loading: '즐겁게 창작하세요!',
        app_title: 'pixPLace',
        connecting: '연결 중...',
        connected: 'Telegram에 연결됨',
        welcome_title: '놀라운 이미지를 생성하세요',
        welcome_subtitle: '비전을 설명하면 AI가 현실로 만들어 드립니다',
        prompt_label: '프롬프트',
        prompt_placeholder: '바다 위의 아름다운 석양...',
        style_label: '스타일',
        style_realistic: '리얼리즘',
        style_artistic: '아트',
        style_cartoon: '만화',
        style_fantasy: '판타지',
        style_anime: '애니메이션',
        style_cyberpunk: '사이버펑크',
        mode_label: '모드',
        mode_print_maker: '프린트/스티커',
        mode_fast_generation: '빠른 생성',
        mode_pixplace_pro: 'pixPLace Pro (텍스트 지원)',
        size_label: '크기',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: '이미지 생성',
        processing_title: '걸작을 만드는 중',
        processing_subtitle: '최대 60초가 걸릴 수 있습니다',
        step_analyzing: '프롬프트 분석 중',
        step_generating: '이미지 생성 중',
        step_finalizing: '결과 마무리 중',
        elapsed_time: '경과 시간:',
        cancel_btn: '취소',
        create_new: '새로 만들기',
        view_history: '기록 보기',
        history_title: '생성 기록',
        empty_history_title: '아직 생성된 이미지가 없습니다',
        empty_history_subtitle: '첫 번째 AI 이미지를 생성하여 여기에서 확인하세요',
        generation_time: '생성 시간',
        error_prompt_required: '이미지를 설명해 주세요',
        error_prompt_too_short: '프롬프트가 너무 짧습니다 (최소 5자)',
        error_webhook_not_configured: 'Webhook이 설정되지 않음',
        error_generation_failed: '생성 실패',
        error_timeout: '시간 초과. 다시 시도하세요.',
        success_generated: '이미지가 성공적으로 생성되었습니다!',
        copied_to_clipboard: '클립보드에 복사됨',
        download_started: '다운로드 시작됨',
        limit_title: '생성 한도 도달',
        limit_message: '무료 한도에 도달했습니다. 업그레이드하여 계속 멋진 이미지를 만드세요!',
        check_subsciption: '구독 확인',
        closeLimitModal: '나중에',
        upgradeBtn: '지금 업그레이드'
    },
    tr: {
        loading: 'Eğlenerek oluşturun!',
        app_title: 'pixPLace',
        connecting: 'Bağlanıyor...',
        connected: 'Telegram’a bağlandı',
        welcome_title: 'Harika Görseller Yaratın',
        welcome_subtitle: 'Vizyonunuzu açıklayın ve yapay zekânın onu gerçeğe dönüştürmesini izleyin',
        prompt_label: 'Prompt',
        prompt_placeholder: 'Okyanus üzerinde güzel bir gün batımı...',
        style_label: 'Stil',
        style_realistic: 'Gerçekçi',
        style_artistic: 'Sanatsal',
        style_cartoon: 'Çizgi film',
        style_fantasy: 'Fantastik',
        style_anime: 'Anime',
        style_cyberpunk: 'Siberpunk',
        mode_label: 'Mod',
        mode_print_maker: 'Baskı/Sticker',
        mode_fast_generation: 'Hızlı Üretim',
        mode_pixplace_pro: 'pixPLace Pro (Metin Destekli)',
        size_label: 'Boyut',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: 'Görsel Üret',
        processing_title: 'Baş Yapıtınız Oluşturuluyor',
        processing_subtitle: 'Bu işlem 60 saniyeye kadar sürebilir',
        step_analyzing: 'Prompt analiz ediliyor',
        step_generating: 'Görsel üretiliyor',
        step_finalizing: 'Sonuç tamamlanıyor',
        elapsed_time: 'Geçen süre:',
        cancel_btn: 'İptal',
        create_new: 'Yeni Oluştur',
        view_history: 'Geçmişi Gör',
        history_title: 'Üretim Geçmişi',
        empty_history_title: 'Henüz üretim yok',
        empty_history_subtitle: 'İlk yapay zekâ görselinizi oluşturun ve burada görün',
        generation_time: 'Üretim süresi',
        error_prompt_required: 'Lütfen görselinizi tanımlayın',
        error_prompt_too_short: 'Prompt çok kısa (en az 5 karakter)',
        error_webhook_not_configured: 'Webhook yapılandırılmadı',
        error_generation_failed: 'Üretim başarısız',
        error_timeout: 'Zaman aşımı. Tekrar deneyin.',
        success_generated: 'Görsel başarıyla üretildi!',
        copied_to_clipboard: 'Panoya kopyalandı',
        download_started: 'İndirme başladı',
        limit_title: 'Üretim Limiti Aşıldı',
        limit_message: 'Ücretsiz limitinize ulaştınız. Harika görseller oluşturmaya devam etmek için yükseltin!',
        check_subsciption: 'Aboneliği Kontrol Et',
        closeLimitModal: 'Belki Sonra',
        upgradeBtn: 'Şimdi Yükselt'
    },
    pl: {
        loading: 'Twórz z Przyjemnością!',
        app_title: 'pixPLace',
        connecting: 'Łączenie...',
        connected: 'Połączono z Telegramem',
        welcome_title: 'Twórz Niesamowite Obrazy',
        welcome_subtitle: 'Opisz swoją wizję i obserwuj, jak pixPLace ożywia ją dzięki AI',
        prompt_label: 'Prompt',
        prompt_placeholder: 'Piękny zachód słońca nad oceanem...',
        style_label: 'Styl',
        style_realistic: 'Realistyczny',
        style_artistic: 'Artystyczny',
        style_cartoon: 'Kreskówkowy',
        style_fantasy: 'Fantasy',
        style_anime: 'Anime',
        style_cyberpunk: 'Cyberpunk',
        mode_label: 'Tryb',
        mode_print_maker: 'Druki/Naklejki',
        mode_fast_generation: 'Szybka Generacja',
        mode_pixplace_pro: 'pixPLace Pro (Logo/Tekst/Zdjęcie)',
        size_label: 'Rozmiar',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: 'Wygeneruj Obraz',
        processing_title: 'Tworzymy Twój Arcydzieło',
        processing_subtitle: 'Może to potrwać do 60 sekund',
        step_analyzing: 'Analizujemy prompt',
        step_generating: 'Generujemy obraz',
        step_finalizing: 'Finalizujemy wynik',
        elapsed_time: 'Upłynęło czasu:',
        cancel_btn: 'Anuluj',
        create_new: 'Stwórz Nowy',
        view_history: 'Zobacz Historię',
        history_title: 'Historia Generacji',
        empty_history_title: 'Brak wygenerowanych obrazów',
        empty_history_subtitle: 'Stwórz swój pierwszy obraz AI, aby zobaczyć go tutaj',
        generation_time: 'Czas generacji',
        error_prompt_required: 'Proszę opisać obraz',
        error_prompt_too_short: 'Opis za krótki (minimum 5 znaków)',
        error_webhook_not_configured: 'Adres URL webhooka nie jest skonfigurowany',
        error_generation_failed: 'Generacja nie powiodła się',
        error_timeout: 'Przekroczono limit czasu. Spróbuj ponownie.',
        success_generated: 'Obraz został wygenerowany pomyślnie!',
        copied_to_clipboard: 'Skopiowano do schowka',
        download_started: 'Rozpoczęto pobieranie',
        limit_title: 'Limit Generacji Wyczerpany',
        limit_message: 'Skończyły Ci się darmowe generacje! Możesz zdobyć więcej, kupując subskrypcję pixPLace.',
        check_subsciption: 'Sprawdź Subskrypcję',
        closeLimitModal: 'Może Później',
        upgradeBtn: 'Ulepsz Teraz'
    }
};

// 🎯 App State
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
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.translate(key);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.translate(key);
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
function updateHistoryDisplay() {
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

// 🖼️ UI Initialization
// 🎬 Screen Management
function showLoadingScreen() {
    document.getElementById('loadingScreen').classList.add('active');
}

function hideLoadingScreen() {
    document.getElementById('loadingScreen').classList.remove('active');
}

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
    if (resultTime) {
        const duration = Math.round((appState.currentGeneration.duration || 0) / 1000);
        resultTime.textContent = duration + 's';
    }

    console.log('after showResult ->', getCurrentScreen());
}

function showSubscriptionNotice(result) {
    console.log('🔗 Full result object:', result);
    const paymentUrl = result.payment_url || 'https://t.me/tribute/app?startapp=syDv';
    console.log('🔗 Payment URL from result:', paymentUrl);

    const modal = document.getElementById('limitModal');
    if (!modal) {
        console.error('❌ Modal not found!');
        return;
    }

    // Показать модальное окно
    modal.classList.add('show');

    // Настроить кнопку оплаты
    const upgradeBtn = document.getElementById('upgradeBtn');
    console.log('🔘 Upgrade button found:', !!upgradeBtn);
    if (upgradeBtn) {
        console.log('🔘 Setting up button click handler');
        upgradeBtn.onclick = () => {
            console.log('🔘 Upgrade button clicked');

            // Сначала закрываем модальное окно
            modal.classList.remove('show');
            showGeneration();
            // Затем с небольшой задержкой открываем ссылку
            setTimeout(() => {
                try {
                    console.log('🔗 Redirecting to payment URL...');
                    window.location.href = paymentUrl;
                } catch (error) {
                    console.error('❌ Error redirecting to payment link:', error);
                    alert('Error opening payment link. Please try again.');
                }
            }, 100); // 100 мс для плавности UI
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
        if (errorEl) errorEl.textContent = 'Недопустимый формат: JPG, PNG, WEBP, GIF.';
        e.target.value = '';
        return;
    }
    const maxBytes = CONFIG.MAX_IMAGE_MB * 1024 * 1024;
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

    // Ждем загрузки Telegram SDK дольше
    let attempts = 0;
    while (typeof window.Telegram === 'undefined' && attempts < 100) {
        await new Promise(resolve => setTimeout(resolve, 50)); // ждем 50мс
        attempts++;
    }

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
        const tgLang = appState.tg.initDataUnsafe?.user?.language_code;
        if (tgLang && CONFIG.LANGUAGES.includes(tgLang)) {
            appState.setLanguage(tgLang);
        }

        showStatus('success', appState.translate('connected'));

    } catch (error) {
        console.error('❌ Telegram initialization error:', error);
        showStatus('error', 'Telegram connection error');
    }
}

// 🚀 App Initialization
document.addEventListener('DOMContentLoaded', async function () {
    console.log('🚀 pixPLace Creator starting...');

    // ✅ Проверка наличия processingScreen
    const ps = document.getElementById('processingScreen');
    if (ps) {
        console.log('✅ Нашёл processingScreen:', ps);
        console.log('➡️ Дети processingScreen:', ps.children.length);
    } else {
        console.error('❌ processingScreen не найден в DOM');
    }

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
    setTimeout(() => {
        hideLoadingScreen();
        showApp();
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

    if (CONFIG.WEBHOOK_URL === 'YOUR_MAKE_WEBHOOK_URL_HERE') {
        showToast('error', appState.translate('error_webhook_not_configured'));
        return;
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

    // Show processing screen
    showProcessing();
    startTimer();
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
        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
            // Если не JSON, пробуем получить как текст
            const text = await response.text();
            console.log('📄 Response text:', text);

            // Пробуем парсить как JSON
            try {
                result = JSON.parse(text);
            } catch (e) {
                throw new Error('Response is not valid JSON: ' + text);
            }
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

function shareImage() {
    if (!appState.currentGeneration?.result) return;

    if (navigator.share) {
        navigator.share({
            title: 'Image generated by pixPLace App',
            text: appState.currentGeneration.prompt,
            url: appState.currentGeneration.result
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(appState.currentGeneration.result).then(() => {
            showToast('info', appState.translate('copied_to_clipboard'));
        });
    }

    triggerHaptic('light');
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
