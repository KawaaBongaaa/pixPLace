// 🚀 Modern AI Image Generator WebApp
// ВРЕМЕННОЕ ОТКЛЮЧЕНИЕ TELEGRAM MAINBUTTON
// ПОЛНОЕ ОТКЛЮЧЕНИЕ TELEGRAM MAINBUTTON
window.Telegram = window.Telegram || {};
window.Telegram.WebApp = window.Telegram.WebApp || {};
window.Telegram.WebApp.MainButton = {
    setText: () => console.log('MainButton.setText disabled'),
    show: () => console.log('MainButton.show disabled'),
    hide: () => console.log('MainButton.hide disabled'),
    onClick: () => console.log('MainButton.onClick disabled')
};

// Также отключим другие методы Telegram
window.Telegram.WebApp.ready = () => console.log('Telegram.WebApp.ready disabled');
window.Telegram.WebApp.expand = () => console.log('Telegram.WebApp.expand disabled');
window.Telegram.WebApp.close = () => console.log('Telegram.WebApp.close disabled');
// Configuration
const CONFIG = {
    WEBHOOK_URL: 'https://hook.us2.make.com/x2hgl6ocask8hearbpwo3ch7pdwpdlrk', // ⚠️ ЗАМЕНИТЕ НА ВАШ WEBHOOK!
    TIMEOUT: 120000, // 120 секунд
    LANGUAGES: ['en', 'ru', 'es', 'fr', 'de', 'zh', 'pt-br', 'ar', 'hi', 'ja', 'it', 'ko', 'tr', 'pl'],
    DEFAULT_LANGUAGE: 'en',
    DEFAULT_THEME: 'dark', // 'light', 'dark', 'auto'
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
        quality_label: 'Quality',
        quality_standard: 'Standard',
        quality_hd: 'HD',
        quality_ultra: 'Ultra HD',
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
        limit_message: 'You\'ve reached your free generation limit. Upgrade to continue creating amazing images!'
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
        style_realistic: 'Реалистичный',
        style_artistic: 'Артистичный',
        style_cartoon: 'Мультяшный',
        style_fantasy: 'Фэнтези',
        style_anime: 'Анимэ',
        style_cyberpunk: 'Киберпанк',
        quality_label: 'Качество',
        quality_standard: 'Standard',
        quality_hd: 'HD',
        quality_ultra: 'Ultra HD',
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
        limit_message: 'Вы достигли лимита бесплатных генераций. Обновите подписку, чтобы продолжить создавать потрясающие изображения!'
    },
    es: {
        loading: 'Cargando...',
        app_title: 'pixPLace',
        connecting: 'Conectando...',
        connected: 'Conectado a Telegram',
        welcome_title: 'Crea Imágenes Increíbles',
        welcome_subtitle: 'Describe tu visión y observa cómo la IA la hace realidad',
        prompt_label: 'Describe tu imagen',
        prompt_placeholder: 'Una hermosa puesta de sol sobre el océano...',
        style_label: 'Estilo',
        style_realistic: 'Realista',
        style_artistic: 'Artístico',
        style_cartoon: 'Caricatura',
        style_fantasy: 'Fantasía',
        style_anime: 'Anime',
        style_cyberpunk: 'Cyberpunk',
        quality_label: 'Calidad',
        quality_standard: 'Estándar',
        quality_hd: 'HD',
        quality_ultra: 'Ultra HD',
        size_label: 'Tamaño',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: 'Generar Imagen',
        processing_title: 'Creando Tu Obra Maestra',
        processing_subtitle: 'Esto puede tomar hasta 60 segundos',
        step_analyzing: 'Analizando prompt',
        step_generating: 'Generando imagen',
        step_finalizing: 'Finalizando resultado',
        elapsed_time: 'Tiempo transcurrido:',
        cancel_btn: 'Cancelar',
        create_new: 'Crear Nueva',
        view_history: 'Ver Historial',
        history_title: 'Historial de Generaciones',
        empty_history_title: 'Aún no hay generaciones',
        empty_history_subtitle: 'Crea tu primera imagen IA para verla aquí',
        generation_time: 'Tiempo de generación',
        error_prompt_required: 'Por favor describe tu imagen',
        error_prompt_too_short: 'Descripción muy corta (mínimo 5 caracteres)',
        error_webhook_not_configured: 'URL de webhook no configurada',
        error_generation_failed: 'Generación fallida',
        error_timeout: 'Tiempo de espera agotado. Inténtalo de nuevo.',
        success_generated: '¡Imagen generada exitosamente!',
        copied_to_clipboard: 'Copiado al portapapeles',
        download_started: 'Descarga iniciada'
    },
    fr: {
        loading: 'Chargement...',
        app_title: 'pixPLace',
        connecting: 'Connexion...',
        connected: 'Connecté à Telegram',
        welcome_title: 'Créez des images incroyables',
        welcome_subtitle: 'Décrivez votre vision et regardez l’IA la prendre vie',
        prompt_label: 'Décrivez votre image',
        prompt_placeholder: 'Un magnifique coucher de soleil sur l’océan...',
        style_label: 'Style artistique',
        style_realistic: 'Réaliste',
        style_artistic: 'Artistique',
        style_cartoon: 'Dessin animé',
        style_fantasy: 'Fantastique',
        style_anime: 'Anime',
        style_cyberpunk: 'Cyberpunk',
        quality_label: 'Qualité',
        quality_standard: 'Standard',
        quality_hd: 'HD',
        quality_ultra: 'Ultra HD',
        size_label: 'Taille',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: 'Générer l’image',
        processing_title: 'Création de votre chef-d’œuvre',
        processing_subtitle: 'Cela peut prendre jusqu’à 60 secondes',
        step_analyzing: 'Analyse de la description',
        step_generating: 'Génération de l’image',
        step_finalizing: 'Finalisation du résultat',
        elapsed_time: 'Temps écoulé :',
        cancel_btn: 'Annuler',
        create_new: 'Créer une nouvelle',
        view_history: 'Voir l’historique',
        history_title: 'Historique des générations',
        empty_history_title: 'Aucune génération pour le moment',
        empty_history_subtitle: 'Créez votre première image IA pour la voir ici',
        generation_time: 'Temps de génération',
        error_prompt_required: 'Veuillez décrire votre image',
        error_prompt_too_short: 'Description trop courte (minimum 5 caractères)',
        error_webhook_not_configured: 'URL du webhook non configurée',
        error_generation_failed: 'Échec de la génération',
        error_timeout: 'Temps d’attente dépassé. Veuillez réessayer.',
        success_generated: 'Image générée avec succès !',
        copied_to_clipboard: 'Copié dans le presse-papiers',
        download_started: 'Téléchargement lancé'
    },
    de: {
        loading: 'Lade...',
        app_title: 'pixPLace',
        connecting: 'Verbinden...',
        connected: 'Mit Telegram verbunden',
        welcome_title: 'Erstelle erstaunliche Bilder',
        welcome_subtitle: 'Beschreibe deine Vision und sieh zu, wie die KI sie zum Leben erweckt',
        prompt_label: 'Beschreibe dein Bild',
        prompt_placeholder: 'Ein schöner Sonnenuntergang über dem Ozean...',
        style_label: 'Kunststil',
        style_realistic: 'Realistisch',
        style_artistic: 'Künstlerisch',
        style_cartoon: 'Comic',
        style_fantasy: 'Fantasie',
        style_anime: 'Anime',
        style_cyberpunk: 'Cyberpunk',
        quality_label: 'Qualität',
        quality_standard: 'Standard',
        quality_hd: 'HD',
        quality_ultra: 'Ultra HD',
        size_label: 'Größe',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: 'Bild generieren',
        processing_title: 'Dein Meisterwerk wird erstellt',
        processing_subtitle: 'Dies kann bis zu 60 Sekunden dauern',
        step_analyzing: 'Eingabe analysieren',
        step_generating: 'Bild wird generiert',
        step_finalizing: 'Ergebnis finalisieren',
        elapsed_time: 'Vergangene Zeit:',
        cancel_btn: 'Abbrechen',
        create_new: 'Neu erstellen',
        view_history: 'Verlauf anzeigen',
        history_title: 'Generierungsverlauf',
        empty_history_title: 'Noch keine Generierungen',
        empty_history_subtitle: 'Erstelle dein erstes KI-Bild, um es hier zu sehen',
        generation_time: 'Generierungszeit',
        error_prompt_required: 'Bitte beschreibe dein Bild',
        error_prompt_too_short: 'Beschreibung zu kurz (mindestens 5 Zeichen)',
        error_webhook_not_configured: 'Webhook-URL nicht konfiguriert',
        error_generation_failed: 'Generierung fehlgeschlagen',
        error_timeout: 'Zeitüberschreitung bei der Generierung. Bitte versuche es erneut.',
        success_generated: 'Bild erfolgreich generiert!',
        copied_to_clipboard: 'In die Zwischenablage kopiert',
        download_started: 'Download gestartet'
    },
    zh: {
        loading: '加载中...',
        app_title: 'pixPLace',
        connecting: '连接中...',
        connected: '已连接到 Telegram',
        welcome_title: '创作令人惊叹的图像',
        welcome_subtitle: '描述你的想法，让 AI 将其变为现实',
        prompt_label: '描述你的图像',
        prompt_placeholder: '一幅美丽的海上日落...',
        style_label: '艺术风格',
        style_realistic: '写实',
        style_artistic: '艺术',
        style_cartoon: '卡通',
        style_fantasy: '奇幻',
        style_anime: '动漫',
        style_cyberpunk: '赛博朋克',
        quality_label: '质量',
        quality_standard: '标准',
        quality_hd: '高清',
        quality_ultra: '超高清',
        size_label: '尺寸',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: '生成图像',
        processing_title: '正在创作你的杰作',
        processing_subtitle: '可能需要长达 60 秒',
        step_analyzing: '分析描述中',
        step_generating: '生成图像中',
        step_finalizing: '正在完成结果',
        elapsed_time: '已用时间：',
        cancel_btn: '取消',
        create_new: '创建新的',
        view_history: '查看历史',
        history_title: '生成历史',
        empty_history_title: '尚未生成图像',
        empty_history_subtitle: '创建你的第一张 AI 图像后将在此显示',
        generation_time: '生成时间',
        error_prompt_required: '请描述你的图像',
        error_prompt_too_short: '描述太短（最少 5 个字符）',
        error_webhook_not_configured: '未配置 Webhook URL',
        error_generation_failed: '生成失败',
        error_timeout: '生成超时。请重试。',
        success_generated: '图像生成成功！',
        copied_to_clipboard: '已复制到剪贴板',
        download_started: '开始下载'
    },
    pt: {
        loading: 'Carregando...',
        app_title: 'pixPLace',
        connecting: 'Conectando...',
        connected: 'Conectado ao Telegram',
        welcome_title: 'Crie Imagens Incríveis',
        welcome_subtitle: 'Descreva sua visão e veja a IA trazê-la à vida',
        prompt_label: 'Descreva sua imagem',
        prompt_placeholder: 'Um belo pôr do sol sobre o oceano...',
        style_label: 'Estilo artístico',
        style_realistic: 'Realista',
        style_artistic: 'Artístico',
        style_cartoon: 'Desenho animado',
        style_fantasy: 'Fantasia',
        style_anime: 'Anime',
        style_cyberpunk: 'Cyberpunk',
        quality_label: 'Qualidade',
        quality_standard: 'Padrão',
        quality_hd: 'HD',
        quality_ultra: 'Ultra HD',
        size_label: 'Tamanho',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: 'Gerar imagem',
        processing_title: 'Criando sua obra-prima',
        processing_subtitle: 'Isso pode levar até 60 segundos',
        step_analyzing: 'Analisando a descrição',
        step_generating: 'Gerando imagem',
        step_finalizing: 'Finalizando resultado',
        elapsed_time: 'Tempo decorrido:',
        cancel_btn: 'Cancelar',
        create_new: 'Criar nova',
        view_history: 'Ver histórico',
        history_title: 'Histórico de gerações',
        empty_history_title: 'Nenhuma geração ainda',
        empty_history_subtitle: 'Crie sua primeira imagem com IA para vê-la aqui',
        generation_time: 'Tempo de geração',
        error_prompt_required: 'Por favor, descreva sua imagem',
        error_prompt_too_short: 'Descrição muito curta (mínimo de 5 caracteres)',
        error_webhook_not_configured: 'URL do webhook não configurado',
        error_generation_failed: 'Falha na geração',
        error_timeout: 'Tempo esgotado. Tente novamente.',
        success_generated: 'Imagem gerada com sucesso!',
        copied_to_clipboard: 'Copiado para a área de transferência',
        download_started: 'Download iniciado'
    },
    ar: {
        loading: 'جارٍ التحميل...',
        app_title: 'pixPLace',
        connecting: 'جارٍ الاتصال...',
        connected: 'تم الاتصال بـ Telegram',
        welcome_title: 'أنشئ صورًا مذهلة',
        welcome_subtitle: 'صف رؤيتك وشاهد الذكاء الاصطناعي يحققها',
        prompt_label: 'صف صورتك',
        prompt_placeholder: 'غروب جميل فوق المحيط...',
        style_label: 'النمط الفني',
        style_realistic: 'واقعي',
        style_artistic: 'فني',
        style_cartoon: 'كرتوني',
        style_fantasy: 'خيالي',
        style_anime: 'أنمي',
        style_cyberpunk: 'سايبربانك',
        quality_label: 'الجودة',
        quality_standard: 'عادي',
        quality_hd: 'عالي الدقة',
        quality_ultra: 'فائق الدقة',
        size_label: 'الحجم',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: 'إنشاء صورة',
        processing_title: 'يتم إنشاء تحفتك الفنية',
        processing_subtitle: 'قد يستغرق ذلك حتى 60 ثانية',
        step_analyzing: 'تحليل الوصف',
        step_generating: 'إنشاء الصورة',
        step_finalizing: 'إتمام النتيجة',
        elapsed_time: 'الوقت المنقضي:',
        cancel_btn: 'إلغاء',
        create_new: 'إنشاء جديد',
        view_history: 'عرض السجل',
        history_title: 'سجل الإنشاءات',
        empty_history_title: 'لا توجد صور حتى الآن',
        empty_history_subtitle: 'أنشئ أول صورة بالذكاء الاصطناعي لتظهر هنا',
        generation_time: 'وقت الإنشاء',
        error_prompt_required: 'يرجى وصف صورتك',
        error_prompt_too_short: 'الوصف قصير جدًا (5 أحرف على الأقل)',
        error_webhook_not_configured: 'رابط webhook غير مهيأ',
        error_generation_failed: 'فشل في الإنشاء',
        error_timeout: 'انتهت المهلة. يرجى المحاولة مرة أخرى.',
        success_generated: 'تم إنشاء الصورة بنجاح!',
        copied_to_clipboard: 'تم النسخ إلى الحافظة',
        download_started: 'بدأ التحميل'
    },
    hi: {
        loading: 'लोड हो रहा है...',
        app_title: 'pixPLace',
        connecting: 'कनेक्ट हो रहा है...',
        connected: 'Telegram से जुड़ा हुआ है',
        welcome_title: 'शानदार चित्र बनाएं',
        welcome_subtitle: 'अपनी कल्पना बताएं और AI को उसे जीवंत बनाते देखें',
        prompt_label: 'अपने चित्र का विवरण दें',
        prompt_placeholder: 'समुद्र के ऊपर एक सुंदर सूर्यास्त...',
        style_label: 'कला शैली',
        style_realistic: 'यथार्थवादी',
        style_artistic: 'कलात्मक',
        style_cartoon: 'कार्टून',
        style_fantasy: 'काल्पनिक',
        style_anime: 'एनीमे',
        style_cyberpunk: 'साइबरपंक',
        quality_label: 'गुणवत्ता',
        quality_standard: 'STANDARD',
        quality_hd: 'HD',
        quality_ultra: 'ULTRA HD',
        size_label: 'आकार',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: 'चित्र बनाएँ',
        processing_title: 'आपकी उत्कृष्ट कृति बनाई जा रही है',
        processing_subtitle: 'इसमें 60 सेकंड तक का समय लग सकता है',
        step_analyzing: 'विवरण का विश्लेषण',
        step_generating: 'चित्र बना रहा है',
        step_finalizing: 'परिणाम अंतिम रूप दे रहा है',
        elapsed_time: 'बीता हुआ समय:',
        cancel_btn: 'रद्द करें',
        create_new: 'नया बनाएँ',
        view_history: 'इतिहास देखें',
        history_title: 'जनरेशन इतिहास',
        empty_history_title: 'अभी तक कोई जनरेशन नहीं',
        empty_history_subtitle: 'AI से अपनी पहली छवि बनाएं और यहाँ देखें',
        generation_time: 'जनरेशन समय',
        error_prompt_required: 'कृपया चित्र का विवरण दें',
        error_prompt_too_short: 'विवरण बहुत छोटा है (न्यूनतम 5 अक्षर)',
        error_webhook_not_configured: 'Webhook URL कॉन्फ़िगर नहीं है',
        error_generation_failed: 'चित्र निर्माण विफल हुआ',
        error_timeout: 'समय समाप्त। कृपया पुनः प्रयास करें।',
        success_generated: 'चित्र सफलतापूर्वक बनाया गया!',
        copied_to_clipboard: 'क्लिपबोर्ड में कॉपी किया गया',
        download_started: 'डाउनलोड शुरू हुआ'
    },
    ja: {
        loading: '読み込み中...',
        app_title: 'pixPLace',
        connecting: '接続中...',
        connected: 'Telegramに接続されました',
        welcome_title: '驚くほど美しい画像を作成',
        welcome_subtitle: 'あなたのイメージを言葉で伝え、AIがそれを形にします',
        prompt_label: '画像を説明してください',
        prompt_placeholder: '海の上に美しい夕日...',
        style_label: 'アートスタイル',
        style_realistic: 'リアル',
        style_artistic: 'アーティスティック',
        style_cartoon: 'カートゥーン',
        style_fantasy: 'ファンタジー',
        style_anime: 'アニメ',
        style_cyberpunk: 'サイバーパンク',
        quality_label: '画質',
        quality_standard: '標準',
        quality_hd: 'HD',
        quality_ultra: 'ウルトラHD',
        size_label: 'サイズ',
        size_square: 'スクエア',
        size_portrait: 'ポートレート',
        size_landscape: 'ランドスケープ',
        generate_btn: '画像を生成',
        processing_title: 'あなたの作品を生成中',
        processing_subtitle: '最大60秒かかる場合があります',
        step_analyzing: 'プロンプトを解析中',
        step_generating: '画像を生成中',
        step_finalizing: '結果を仕上げています',
        elapsed_time: '経過時間：',
        cancel_btn: 'キャンセル',
        create_new: '新規作成',
        view_history: '履歴を見る',
        history_title: '生成履歴',
        empty_history_title: 'まだ画像がありません',
        empty_history_subtitle: '最初のAI画像を作成するとここに表示されます',
        generation_time: '生成時間',
        error_prompt_required: '画像の説明を入力してください',
        error_prompt_too_short: '説明が短すぎます（最低5文字）',
        error_webhook_not_configured: 'Webhook URLが設定されていません',
        error_generation_failed: '生成に失敗しました',
        error_timeout: 'タイムアウトしました。もう一度お試しください。',
        success_generated: '画像の生成が完了しました！',
        copied_to_clipboard: 'クリップボードにコピーしました',
        download_started: 'ダウンロードを開始しました'
    },
    it: {
        loading: 'Caricamento...',
        app_title: 'pixPLace',
        connecting: 'Connessione in corso...',
        connected: 'Connesso a Telegram',
        welcome_title: 'Crea Immagini Straordinarie',
        welcome_subtitle: 'Descrivi la tua visione e guarda l’IA darle vita',
        prompt_label: 'Descrivi la tua immagine',
        prompt_placeholder: 'Un bellissimo tramonto sull’oceano...',
        style_label: 'Stile artistico',
        style_realistic: 'Realistico',
        style_artistic: 'Artistico',
        style_cartoon: 'Cartone animato',
        style_fantasy: 'Fantastico',
        style_anime: 'Anime',
        style_cyberpunk: 'Cyberpunk',
        quality_label: 'Qualità',
        quality_standard: 'Standard',
        quality_hd: 'HD',
        quality_ultra: 'Ultra HD',
        size_label: 'Dimensione',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: 'Genera immagine',
        processing_title: 'Creazione del tuo capolavoro',
        processing_subtitle: 'Questo può richiedere fino a 60 secondi',
        step_analyzing: 'Analisi della descrizione',
        step_generating: 'Generazione immagine',
        step_finalizing: 'Finalizzazione del risultato',
        elapsed_time: 'Tempo trascorso:',
        cancel_btn: 'Annulla',
        create_new: 'Crea nuova',
        view_history: 'Vedi cronologia',
        history_title: 'Cronologia generazioni',
        empty_history_title: 'Nessuna generazione disponibile',
        empty_history_subtitle: 'Crea la tua prima immagine AI per visualizzarla qui',
        generation_time: 'Tempo di generazione',
        error_prompt_required: 'Descrivi la tua immagine',
        error_prompt_too_short: 'Descrizione troppo corta (minimo 5 caratteri)',
        error_webhook_not_configured: 'URL del webhook non configurato',
        error_generation_failed: 'Generazione fallita',
        error_timeout: 'Timeout della generazione. Riprova.',
        success_generated: 'Immagine generata con successo!',
        copied_to_clipboard: 'Copiato negli appunti',
        download_started: 'Download avviato'
    },
    ko: {
        loading: '로딩 중...',
        app_title: 'pixPLace',
        connecting: '연결 중...',
        connected: 'Telegram에 연결됨',
        welcome_title: '놀라운 이미지를 만들어보세요',
        welcome_subtitle: '당신의 아이디어를 설명하면 AI가 현실로 만들어 드립니다',
        prompt_label: '이미지를 설명하세요',
        prompt_placeholder: '바다 위의 아름다운 일몰...',
        style_label: '예술 스타일',
        style_realistic: '사실적',
        style_artistic: '예술적',
        style_cartoon: '만화 스타일',
        style_fantasy: '판타지',
        style_anime: '애니메이션',
        style_cyberpunk: '사이버펑크',
        quality_label: '품질',
        quality_standard: '표준',
        quality_hd: 'HD',
        quality_ultra: '울트라 HD',
        size_label: '크기',
        size_square: '정사각형',
        size_portrait: '세로',
        size_landscape: '가로',
        generate_btn: '이미지 생성',
        processing_title: '작품을 생성하는 중',
        processing_subtitle: '최대 60초가 소요될 수 있습니다',
        step_analyzing: '설명 분석 중',
        step_generating: '이미지 생성 중',
        step_finalizing: '결과 마무리 중',
        elapsed_time: '소요 시간:',
        cancel_btn: '취소',
        create_new: '새로 만들기',
        view_history: '기록 보기',
        history_title: '생성 기록',
        empty_history_title: '아직 생성된 이미지가 없습니다',
        empty_history_subtitle: 'AI 이미지 생성을 시작하면 이곳에 표시됩니다',
        generation_time: '생성 시간',
        error_prompt_required: '이미지를 설명해주세요',
        error_prompt_too_short: '설명이 너무 짧습니다 (최소 5자)',
        error_webhook_not_configured: 'Webhook URL이 설정되지 않았습니다',
        error_generation_failed: '이미지 생성 실패',
        error_timeout: '생성 시간이 초과되었습니다. 다시 시도하세요.',
        success_generated: '이미지가 성공적으로 생성되었습니다!',
        copied_to_clipboard: '클립보드에 복사됨',
        download_started: '다운로드 시작됨'
    },
    tr: {
        loading: 'Yükleniyor...',
        app_title: 'pixPLace',
        connecting: 'Bağlanıyor...',
        connected: 'Telegram’a bağlandı',
        welcome_title: 'Harika Görseller Oluşturun',
        welcome_subtitle: 'Hayalinizdekini tanımlayın, yapay zeka onu hayata geçirsin',
        prompt_label: 'Görselinizi tanımlayın',
        prompt_placeholder: 'Okyanus üzerinde güzel bir gün batımı...',
        style_label: 'Sanat Tarzı',
        style_realistic: 'Gerçekçi',
        style_artistic: 'Sanatsal',
        style_cartoon: 'Çizgi Film',
        style_fantasy: 'Fantastik',
        style_anime: 'Anime',
        style_cyberpunk: 'Siberpunk',
        quality_label: 'Kalite',
        quality_standard: 'Standart',
        quality_hd: 'HD',
        quality_ultra: 'Ultra HD',
        size_label: 'Boyut',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: 'Görsel Oluştur',
        processing_title: 'Başyapıtınız Oluşturuluyor',
        processing_subtitle: 'Bu işlem 60 saniye kadar sürebilir',
        step_analyzing: 'Açıklama analiz ediliyor',
        step_generating: 'Görsel oluşturuluyor',
        step_finalizing: 'Sonuç hazırlanıyor',
        elapsed_time: 'Geçen süre:',
        cancel_btn: 'İptal',
        create_new: 'Yeni Oluştur',
        view_history: 'Geçmişi Görüntüle',
        history_title: 'Oluşturma Geçmişi',
        empty_history_title: 'Henüz bir görsel oluşturulmadı',
        empty_history_subtitle: 'İlk AI görselinizi oluşturduğunuzda burada görünecek',
        generation_time: 'Oluşturma süresi',
        error_prompt_required: 'Lütfen görselinizi tanımlayın',
        error_prompt_too_short: 'Tanım çok kısa (en az 5 karakter)',
        error_webhook_not_configured: 'Webhook URL yapılandırılmadı',
        error_generation_failed: 'Oluşturma başarısız oldu',
        error_timeout: 'Zaman aşımı. Lütfen tekrar deneyin.',
        success_generated: 'Görsel başarıyla oluşturuldu!',
        copied_to_clipboard: 'Panoya kopyalandı',
        download_started: 'İndirme başlatıldı'
    },
    pl: {
        loading: 'Ładowanie...',
        app_title: 'pixPLace',
        connecting: 'Łączenie...',
        connected: 'Połączono z Telegramem',
        welcome_title: 'Twórz niesamowite obrazy',
        welcome_subtitle: 'Opisz swoją wizję, a AI ją ożywi',
        prompt_label: 'Opisz swój obraz',
        prompt_placeholder: 'Piękny zachód słońca nad oceanem...',
        style_label: 'Styl artystyczny',
        style_realistic: 'Realistyczny',
        style_artistic: 'Artystyczny',
        style_cartoon: 'Kreskówkowy',
        style_fantasy: 'Fantastyczny',
        style_anime: 'Anime',
        style_cyberpunk: 'Cyberpunk',
        quality_label: 'Jakość',
        quality_standard: 'Standardowa',
        quality_hd: 'HD',
        quality_ultra: 'Ultra HD',
        size_label: 'Rozmiar',
        size_square: '1:1',
        size_portrait: '9:16',
        size_landscape: '16:9',
        generate_btn: 'Generuj obraz',
        processing_title: 'Tworzenie arcydzieła',
        processing_subtitle: 'Może to potrwać do 60 sekund',
        step_analyzing: 'Analiza opisu',
        step_generating: 'Generowanie obrazu',
        step_finalizing: 'Finalizowanie wyniku',
        elapsed_time: 'Czas:',
        cancel_btn: 'Anuluj',
        create_new: 'Utwórz nowy',
        view_history: 'Zobacz historię',
        history_title: 'Historia generacji',
        empty_history_title: 'Brak wygenerowanych obrazów',
        empty_history_subtitle: 'Stwórz pierwszy obraz AI, aby pojawił się tutaj',
        generation_time: 'Czas generacji',
        error_prompt_required: 'Opisz swój obraz',
        error_prompt_too_short: 'Opis jest zbyt krótki (min. 5 znaków)',
        error_webhook_not_configured: 'Webhook URL nie jest skonfigurowany',
        error_generation_failed: 'Nie udało się wygenerować',
        error_timeout: 'Przekroczono limit czasu. Spróbuj ponownie.',
        success_generated: 'Obraz wygenerowany pomyślnie!',
        copied_to_clipboard: 'Skopiowano do schowka',
        download_started: 'Rozpoczęto pobieranie'
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
                <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-220 40q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-518q0-121-92.5-201.5T488-800q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z"/></svg> ${appState.translate('style_' + item.style)}</span>
                <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M240-40v-329L110-580l185-300h370l185 300-130 211v329l-240-80-240 80Zm80-111 160-53 160 53v-129H320v129Zm20-649L204-580l136 220h280l136-220-136-220H340Zm98 383L296-558l57-57 85 85 169-170 57 56-226 227ZM320-280h320-320Z"/></svg> ${appState.translate('quality_' + item.quality)}</span>
                ${item.duration ? `<span> ⏱ ${Math.round(item.duration / 1000)}s</span>` : ''}
            </div>
            ${item.result ? `<img src="${item.result}" alt="Generated" class="history-image" loading="lazy" />` : ''}
            ${item.error ? `<p style="color: var(--error-500); font-size: var(--font-size-sm); margin-top: var(--space-2);">❌ ${item.error}</p>` : ''}
        </div>
    `).join('');
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
    const activeScreen = document.querySelector('.screen.active');
    return activeScreen ? activeScreen.id : null;
}

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

    // Update main button
    //updateMainButton(screenId);
}

/*function updateMainButton(screenId) {
    if (!appState.tg?.MainButton) return;

    switch (screenId) {
        case 'generationScreen':
            appState.tg.MainButton.setText(appState.translate('generate_btn'));
            appState.tg.MainButton.show();
            break;
        case 'processingScreen':
            appState.tg.MainButton.hide();
            break;
        case 'resultScreen':
            appState.tg.MainButton.setText(appState.translate('create_new'));
            appState.tg.MainButton.show();
            break;
        case 'historyScreen':
            appState.tg.MainButton.setText('← ' + appState.translate('create_new'));
            appState.tg.MainButton.show();
            break;
    }
}*/


function showProcessing() {
    showScreen('processingScreen');
    updateProcessingSteps(1);
}

function showResult(result) {
    showScreen('resultScreen');

    // Update result display
    const resultImage = document.getElementById('resultImage');
    const resultPrompt = document.getElementById('resultPrompt');
    const resultStyle = document.getElementById('resultStyle');
    const resultQuality = document.getElementById('resultQuality');
    const resultTime = document.getElementById('resultTime');

    if (resultImage) resultImage.src = result.image_url;
    if (resultPrompt) resultPrompt.textContent = appState.currentGeneration.prompt;
    if (resultStyle) resultStyle.textContent = appState.translate('style_' + appState.currentGeneration.style);
    if (resultQuality) resultQuality.textContent = appState.translate('quality_' + appState.currentGeneration.quality);
    if (resultTime) {
        const duration = Math.round((appState.currentGeneration.duration || 0) / 1000);
        resultTime.textContent = duration + 's';
    }
}
function showSubscriptionScreen(paymentUrl) {
    // Скрыть все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Показать экран подписки
    const subscriptionScreen = document.getElementById('subscriptionScreen');
    subscriptionScreen.classList.add('active');

    // Настроить кнопку оплаты
    const upgradeBtn = document.getElementById('upgradeBtn');
    upgradeBtn.onclick = () => {
        if (window.Telegram?.WebApp?.openLink) {
            window.Telegram.WebApp.openLink(paymentUrl);
        } else {
            window.open(paymentUrl, '_blank');
        }
    };
}
function showGeneration() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById('generationScreen').classList.add('active');

    // Восстановить главную кнопку Telegram
    //if (appState.tg && appState.tg.MainButton) {
    //    appState.tg.MainButton.setText(appState.translate('generate_btn'));
    //    appState.tg.MainButton.show();
    //}
}

function showSubscriptionNotice(result) {
    console.log('🔗 Full result object:', result);
    const paymentUrl = result.payment_url || 'https://t.me/tribute/app?startapp=swcr';
    console.log('🔗 Payment URL from result:', result.payment_url);

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
            console.log('🔘 Button clicked! Opening:', paymentUrl);
            try {
                if (window.Telegram?.WebApp?.openLink) {
                    console.log('🔗 Using Telegram.WebApp.openLink');
                    window.Telegram.WebApp.openLink(paymentUrl);
                } else {
                    console.log('🔗 Using window.open (fallback)');
                    window.open(paymentUrl, '_blank');
                }
                console.log('✅ Link opening attempted');

                // Закрыть модальное окно ПОСЛЕ успешного открытия ссылки
                setTimeout(() => {
                    modal.classList.remove('show');
                }, 500);

            } catch (error) {
                console.error('❌ Error opening payment link:', error);
                alert('Error opening payment link. Please try again.');
            }
        };
    }

    // Настроить кнопку закрытия
    const closeBtn = document.getElementById('closeLimitModal');
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.classList.remove('show');
            showGeneration();
        };
    }
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

        console.log('🔍 Telegram WebApp data:', {
            available: !!appState.tg,
            platform: appState.tg.platform,
            version: appState.tg.version,
            initDataUnsafe: appState.tg.initDataUnsafe,
            user: appState.tg.initDataUnsafe?.user
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
            console.log('❌ NO USER DATA - using fallback:', {
                initDataUnsafe: appState.tg.initDataUnsafe,
                platform: appState.tg.platform
            });

            // Fallback данные
            appState.userId = 'tg_user_' + Date.now();
            appState.userName = 'Telegram User';
            appState.userUsername = null;
            appState.userLanguage = 'en';
            appState.userIsPremium = false;
            appState.userPhotoUrl = null;
            appState.telegramPlatform = appState.tg?.platform || 'unknown';
            appState.telegramVersion = appState.tg?.version || 'unknown';
        }
        // Setup main button
        /*if (appState.tg.MainButton) {
            appState.tg.MainButton.setText(appState.translate('generate_btn'));
            appState.tg.MainButton.onClick(() => {
                if (getCurrentScreen() === 'generationScreen') {
                    generateImage();
                } else if (getCurrentScreen() === 'resultScreen') {
                    showGeneration();
                } else if (getCurrentScreen() === 'historyScreen') {
                    showGeneration();
                }
            });
            appState.tg.MainButton.show();
        }*/

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

    // Show loading screen
    showLoadingScreen();

    // Load settings and history
    appState.loadSettings();
    appState.loadHistory();

    // Initialize Telegram WebApp
    await initTelegramApp();

    // Initialize UI
    initializeUI();

    // Hide loading screen and show app
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
    const quality = document.getElementById('qualitySelect').value;
    const size = document.getElementById('sizeSelect').value;

    console.log('🚀 Starting generation:', { prompt, style: appState.selectedStyle, quality, size });

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
    appState.currentGeneration = {
        id: Date.now(),
        prompt: prompt,
        style: appState.selectedStyle,
        quality: quality,
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

    try {
        console.log('📤 Sending to webhook...');

        // Send request to Make webhook
        const result = await sendToWebhook({
            action: 'Image Generation',
            prompt: prompt,
            style: appState.selectedStyle,
            quality: quality,
            size: size,
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

        // Проверка лимитов (ПЕРВАЯ ПРОВЕРКА)
        if (result.limit_reached === true || result.limit_reached === 'true' || result.limit_reached === '1') {
            console.log('⚠️ Limit reached');
            appState.currentGeneration.status = 'limit';
            appState.currentGeneration.result = result.image_url || null;
            appState.saveHistory();

            // Получаем URL для оплаты из ответа или используем дефолтный
            const paymentUrl = result.payment_url || 'https://t.me/tribute/app?startapp=swcr';

            // Вызываем правильную функцию с URL
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
function selectStyle(button) {
    // Remove active class from all style buttons
    document.querySelectorAll('.style-card').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active class to clicked button
    button.classList.add('active');

    // Update selected style
    appState.selectedStyle = button.dataset.style;

    triggerHaptic('light');
    console.log('🎨 Style selected:', appState.selectedStyle);
}

// 🔄 Action Functions
function newGeneration() {
    showGeneration();
    // Clear form
    document.getElementById('promptInput').value = '';
    document.getElementById('charCounter').textContent = '0';
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
function downloadImage() {
    if (!appState.currentGeneration?.result) return;

    const link = document.createElement('a');
    link.href = appState.currentGeneration.result;
    link.download = `ai-generated-${appState.currentGeneration.id}.jpg`;
    link.click();

    showToast('info', appState.translate('download_started'));
    triggerHaptic('light');
}

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
window.selectStyle = selectStyle;
window.generateImage = generateImage;
window.newGeneration = newGeneration;
window.cancelGeneration = cancelGeneration;
window.clearHistory = clearHistory;
window.downloadImage = downloadImage;
window.shareImage = shareImage;

// 🎵 Music Functions
let currentWidget = null;
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
});
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

