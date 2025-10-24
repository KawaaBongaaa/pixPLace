// 🔧 ПЛЭНИНГ МЕНЮ КАРУСЕЛИ ИЛИКАЦИЯ - НОВЫЙ МОДУЛЬ ДЛЯ МЕНЮ ПЛАНОВ
// Экспортируем функции в глобальную область видимости

window.initPlansCarousel = function() {
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

        // Убираем автопрокрутку полностью, оставляем только пользовательское управление

        // Клик по индикаторам (остался функционал)
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

        // Свайпы - чистое пользовательское управление (без задержек)
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
            if (Math.abs(diff) > 60 && touchDuration > 100) {
                if (diff > 0 && currentPlanSlide < totalSlides - 1) {
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
                const containerWidth = carousel.offsetWidth;
                const cardWidth = centerCard.offsetWidth;
                const cardLeft = centerCard.offsetLeft;
                const scrollPosition = cardLeft - (containerWidth / 2) + (cardWidth / 2);
                carousel.scrollLeft = Math.max(0, scrollPosition);

                // Простое центрирование одной строкой
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
        console.log('🔥 Plans carousel initialized - centered on PRO plan, auto-scroll REMOVED');
        resolve(true);
    });
};

window.initPlanCards = function() {
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
                card.style.transform = 'translateY(-12px) scale(1.03)';
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
let plansModalInitialized = false;

function lazyInitializePlansModal() {
    if (plansModalInitialized) return Promise.resolve();

    // Наблюдатель за появлением модала лимита - инициализируем карусель при показе
    console.log('🎭 Setting up plans modal lazy initialization');
    const observer = new MutationObserver(async function (mutations) {
        mutations.forEach(async function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const modal = document.getElementById('limitModal');
                if (modal && modal.classList.contains('show')) {
                    // Модал появился - инициализируем карусель с async/await
                    console.log('🎭 Limit modal shown - initializing plans carousel');
                    try {
                        await window.initPlansCarousel();
                        await window.initPlanCards();
                        await window.initGlassmorphismEffects();
                        console.log('✅ Plans modal initialization complete');
                        plansModalInitialized = true;
                        observer.disconnect(); // Больше не следим
                    } catch (error) {
                        console.error('❌ Error initializing plans modal:', error);
                    }
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

    return Promise.resolve();
}

// Настройка отложенной инициализации при загрузке DOM
document.addEventListener('DOMContentLoaded', function () {
    // Не инициализируем сразу, ждем когда понадобится
    console.log('🔧 Plans modal module loaded and ready (lazy load)');
});

// Экспортируем функцию отложенной инициализации
window.lazyInitializePlansModal = lazyInitializePlansModal;
