// 🔧 ПЛЭНИНГ МЕНЮ КАРУСЕЛИ ИЛИКАЦИЯ - НОВЫЙ МОДУЛЬ ДЛЯ МЕНЮ ПЛАНОВ
// Экспортируем функции в глобальную область видимости

// Динамическая загрузка стилей для модуля
const loadPlansModalStyles = () => {
    // Загружаем modals.css
    if (!document.querySelector('link[href="./css/shared/modals.css"]')) {
        const linkModals = document.createElement('link');
        linkModals.rel = 'stylesheet';
        linkModals.href = './css/shared/modals.css';
        document.head.appendChild(linkModals);
    }

    if (!document.querySelector('link[href="./css/shared/credit-packs.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './css/shared/credit-packs.css';
        document.head.appendChild(link);
    }

    console.log('✅ Plans modal CSS (modals & credit-packs) loaded dynamically');
};

// Функция для динамической загрузки limitModal
async function loadLimitModal() {
    // 🔥 Загружаем стили первым делом
    loadPlansModalStyles();

    // Проверяем, не загружен ли уже модал
    let modal = document.getElementById('limitModal');
    if (modal) {
        // 🔥 INTEGRITY CHECK: Ensure modal has content
        const hasContent = modal.querySelector('.limit-modal-content');
        const hasButtons = modal.querySelector('.plan-btn') || modal.querySelector('#upgradeBtn');

        if (!hasContent || !hasButtons) {
            console.warn('⚠️ Found empty/corrupt limitModal, removing and reloading...', { hasContent: !!hasContent, hasButtons: !!hasButtons });
            modal.remove();
            modal = null;
        } else {
            console.log('✅ Used existing limitModal from DOM');
            return modal;
        }
    }

    try {
        console.log('🔄 Fetching limit-modal.html with cache busting...');
        // Загружаем HTML модала с cache-busting
        const response = await fetch(`./modals/limit-modal.html?t=${Date.now()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();

        // Создаем временный контейнер для парсинга HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Извлекаем модал и добавляем в body
        modal = tempDiv.firstElementChild;

        // 🔥 VALIDATION BEFORE APPENDING
        if (!modal || !modal.querySelector('.limit-modal-content')) {
            throw new Error('Loaded HTML does not contain valid modal content');
        }

        document.body.appendChild(modal);

        console.log('✅ Limit modal loaded dynamically with validated content');

        // Инициализируем обработчики событий для модала
        initLimitModalHandlers(modal);

        // 🔥 Запускаем отложенную инициализацию карусели
        if (window.lazyInitializePlansModal) {
            window.lazyInitializePlansModal();
        }

        return modal;
    } catch (error) {
        console.error('❌ Failed to load limit modal:', error);
        return null;
    }
}

// Функция для инициализации обработчиков событий limitModal
function initLimitModalHandlers(modal) {
    if (!modal) return;

    // Обработчик закрытия модала
    const closeBtn = modal.querySelector('#closeLimitModal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }

    // Обработчик клика по backdrop
    const backdrop = modal.querySelector('.limit-modal-backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }

    // Обработчики для кнопок планов
    const planButtons = modal.querySelectorAll('.plan-btn');
    planButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const planType = btn.id.includes('lite') ? 'lite' :
                btn.id.includes('pro') ? 'pro' : 'studio';
            console.log(`Selected plan: ${planType}`);

            // Здесь можно добавить логику оплаты/редиректа
            if (typeof showToast !== 'undefined') {
                showToast('info', `Redirecting to ${planType} payment...`);
            }
        });
    });

    console.log('✅ Limit modal handlers initialized');
}

// Загружаем стили при инициализации модуля
loadPlansModalStyles();


window.initPlansCarousel = function () {
    const carousel = document.querySelector('.plans-carousel');
    const indicators = document.querySelectorAll('.indicator');

    return new Promise((resolve) => {
        // Добавляем функцию highlight для работы с карточками планов
        function highlight(card, options = {}) {
            if (!card) return;

            // Убираем активный класс со всех карточек планов
            document.querySelectorAll('.plan-card').forEach(c => {
                c.classList.remove('active');
            });

            // Добавляем активный класс выбранной карточке
            if (card && typeof card.classList !== 'undefined') {
                card.classList.add('active');
            }

            console.log('Карточка плана выделена:', card ? 'OK' : 'null');
        }

        if (!carousel || !indicators.length) {
            console.log('Plans carousel not found, skipping init');
            resolve(false);
            return;
        }

        const cards = document.querySelectorAll('.plan-card');
        const totalSlides = Math.ceil(cards.length / 3); // 3 карточки на слайд
        let currentPlanSlide = 0;

        // Функция для обновления индикаторов
        function updateIndicators(activeIndex) {
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === activeIndex);
            });
        }

        // Функция для прокрутки к слайду (per-card)
        function scrollToSlide(slideIndex) {
            currentPlanSlide = slideIndex;
            const targetCard = cards[slideIndex];
            if (targetCard) {
                targetCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
            updateIndicators(slideIndex);
        }

        // Клик по индикаторам
        indicators.forEach((indicator, index) => {
            let lastClickTime = 0;

            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                const now = Date.now();
                if (now - lastClickTime < 800) return; // предотвращаем спам клики
                lastClickTime = now;

                scrollToSlide(index);
            });
        });

        // Свайпы - чистое пользовательское управление
        let touchStartX = 0;
        let touchStartTime = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchStartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            // Простая обработка свайпа
            if (Math.abs(diff) > 60 && touchDuration < 500) {
                if (diff > 0 && currentPlanSlide < cards.length - 1) {
                    scrollToSlide(currentPlanSlide + 1);
                } else if (diff < 0 && currentPlanSlide > 0) {
                    scrollToSlide(currentPlanSlide - 1);
                }
            }
        });

        // ИНИЦИАЛИЗАЦИЯ - ПРОСТО ЦЕНТРИРУЕМ PRO КАРТУ (индекс 1)
        const centerCardIndex = 1; // Про = индекс 1 (самый популярный план)
        const centerCard = cards[centerCardIndex];

        if (centerCard) {
            setTimeout(() => {
                try {
                    const containerWidth = carousel.offsetWidth;
                    const cardWidth = centerCard.offsetWidth;
                    const cardLeft = centerCard.offsetLeft;
                    const scrollPosition = cardLeft - (containerWidth / 2) + (cardWidth / 2);
                    carousel.scrollLeft = Math.max(0, scrollPosition);
                } catch (e) {
                    console.warn('Error calculating scroll center:', e);
                }

                // Простое центрирование одной строкой
                setTimeout(() => {
                    try {
                        centerCard.scrollIntoView({
                            behavior: 'instant',
                            block: 'nearest',
                            inline: 'center'
                        });
                    } catch (e) {
                        // ignore scrollIntoView errors in incompatible browsers
                    }
                }, 100);
            }, 50);
        }

        highlight(cards[centerCardIndex], { scroll: false });
        updateIndicators(centerCardIndex);
        console.log('🔥 Plans carousel initialized - centered on PRO plan, auto-scroll REMOVED');
        resolve(true);
    });
};

window.initPlanCards = function () {
    const cards = document.querySelectorAll('.plan-card');

    return new Promise((resolve) => {
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
                card.style.transform = 'translateY(-8px) scale(1.03)';
            });

            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('selected')) {
                    card.style.transform = '';
                }
            });
        });

        console.log('🔧 Plan cards initialized with click handlers');
        resolve(true);
    });
};



// Отложенная инициализация - модуль загружен, инициализация будет при первом показе модала
// Отложенная инициализация - модуль загружен, инициализация будет при первом показе модала
let plansModalInitialized = false;

async function lazyInitializePlansModal() {
    if (plansModalInitialized) return Promise.resolve();

    console.log('🎭 Setting up plans modal lazy initialization');

    // Наблюдатель за появлением модала лимита
    const observer = new MutationObserver(async function (mutations) {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const modal = mutation.target;
                if (modal.classList.contains('show')) {
                    console.log('🎭 Limit modal shown - initializing plans carousel');
                    try {
                        await window.initPlansCarousel();
                        await window.initPlanCards();
                        console.log('✅ Plans modal initialization complete');
                        plansModalInitialized = true;
                        observer.disconnect();
                    } catch (error) {
                        console.error('❌ Error initializing plans modal:', error);
                    }
                }
            }
        }
    });

    // Пытаемся найти модал в DOM (он может быть уже загружен или загрузится позже)
    const modal = document.getElementById('limitModal');
    if (modal) {
        observer.observe(modal, {
            attributes: true,
            attributeFilter: ['class']
        });

        // Если уже открыт - инициализируем сразу
        if (modal.classList.contains('show') && !plansModalInitialized) {
            console.log('🎭 Limit modal already shown - initializing immediately');
            try {
                await window.initPlansCarousel();
                await window.initPlanCards();
                console.log('✅ Plans modal initialization complete (immediate)');
                plansModalInitialized = true;
            } catch (error) {
                console.error('❌ Error initializing plans modal immediately:', error);
            }
        }
    } else {
        // Если модала нет, можно повесить observer на body или ждать события, 
        // но так как loadLimitModal создает модал и вызывает lazyInitializePlansModal,
        // этот блок else скорее всего не нужен, но оставим событие как fallback
    }

    // Fallback: событие custom event, если кто-то вызовет
    document.addEventListener('limitModal:shown', async () => {
        if (!plansModalInitialized) {
            console.log('🎭 Limit modal shown via event - fallback initialization');
            try {
                await window.initPlansCarousel();
                await window.initPlanCards();
                plansModalInitialized = true;
            } catch (error) {
                console.error('❌ Error in fallback plans modal initialization:', error);
            }
        }
    });

    return Promise.resolve();
}

// Настройка отложенной инициализации при загрузке DOM
document.addEventListener('DOMContentLoaded', function () {
    console.log('🔧 Plans modal module loaded (lazy load)');
});

// Экспортируем функцию отложенной инициализации
window.lazyInitializePlansModal = lazyInitializePlansModal;

// Экспорт функции динамической загрузки limitModal 
window.loadLimitModal = loadLimitModal;

export { loadLimitModal, lazyInitializePlansModal };
