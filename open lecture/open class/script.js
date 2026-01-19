/**
 * ========================================
 * ПРЕЗЕНТАЦІЯ: ОСНОВИ WEB-РОЗРОБКИ
 * Скрипт для управління слайдами та інтерактивності
 * ========================================
 */

// ========================================
// ІНІЦІАЛІЗАЦІЯ ЗМІННИХ
// ========================================

// Поточний номер слайда (починаємо з 1)
let currentSlideIndex = 1;

// Загальна кількість слайдів
const totalSlides = document.querySelectorAll('.slide').length;

// DOM елементи
const slidesContainer = document.getElementById('slidesContainer');
const progressBar = document.getElementById('progressBar');
const currentSlideDisplay = document.getElementById('currentSlide');
const totalSlidesDisplay = document.getElementById('totalSlides');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// ========================================
// ФУНКЦІЇ НАВІГАЦІЇ
// ========================================

/**
 * Перехід до конкретного слайда
 * @param {number} slideNumber - номер слайда (1-based)
 */
function goToSlide(slideNumber) {
    // Перевірка меж
    if (slideNumber < 1 || slideNumber > totalSlides) {
        return;
    }
    
    // Отримуємо всі слайди
    const slides = document.querySelectorAll('.slide');
    
    // Визначаємо напрямок переходу
    const direction = slideNumber > currentSlideIndex ? 'forward' : 'backward';
    
    // Деактивуємо поточний слайд
    slides.forEach((slide, index) => {
        const slideNum = index + 1;
        
        if (slideNum === currentSlideIndex) {
            // Поточний слайд виходить
            slide.classList.remove('active');
            slide.classList.add('exit');
            
            // Видаляємо клас exit після анімації
            setTimeout(() => {
                slide.classList.remove('exit');
            }, 600);
        }
        
        if (slideNum === slideNumber) {
            // Новий слайд входить
            setTimeout(() => {
                slide.classList.add('active');
                // Перезапускаємо анімації елементів
                restartAnimations(slide);
            }, 100);
        }
    });
    
    // Оновлюємо індекс
    currentSlideIndex = slideNumber;
    
    // Оновлюємо UI
    updateUI();
}

/**
 * Перехід до наступного слайда
 */
function nextSlide() {
    if (currentSlideIndex < totalSlides) {
        goToSlide(currentSlideIndex + 1);
    }
}

/**
 * Перехід до попереднього слайда
 */
function prevSlide() {
    if (currentSlideIndex > 1) {
        goToSlide(currentSlideIndex - 1);
    }
}

/**
 * Перехід до першого слайда
 */
function goToFirst() {
    goToSlide(1);
}

/**
 * Перехід до останнього слайда
 */
function goToLast() {
    goToSlide(totalSlides);
}

// ========================================
// ФУНКЦІЇ ОНОВЛЕННЯ UI
// ========================================

/**
 * Оновлення всіх елементів інтерфейсу
 */
function updateUI() {
    // Оновлюємо лічильник слайдів
    currentSlideDisplay.textContent = currentSlideIndex;
    
    // Оновлюємо прогрес-бар
    const progress = (currentSlideIndex / totalSlides) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Оновлюємо стан кнопок
    prevBtn.disabled = currentSlideIndex === 1;
    nextBtn.disabled = currentSlideIndex === totalSlides;
    
    // Додаємо/видаляємо візуальний стиль для disabled кнопок
    prevBtn.style.opacity = currentSlideIndex === 1 ? '0.5' : '1';
    nextBtn.style.opacity = currentSlideIndex === totalSlides ? '0.5' : '1';
}

/**
 * Перезапуск анімацій на слайді
 * @param {HTMLElement} slide - DOM елемент слайда
 */
function restartAnimations(slide) {
    const animatedElements = slide.querySelectorAll('.animate-in');
    
    animatedElements.forEach(element => {
        // Видаляємо клас анімації
        element.classList.remove('animate-in');
        
        // Форсуємо reflow
        void element.offsetWidth;
        
        // Додаємо клас назад
        element.classList.add('animate-in');
    });
}

// ========================================
// ОБРОБНИКИ ПОДІЙ
// ========================================

/**
 * Обробка натискання клавіш
 */
function handleKeyDown(event) {
    switch (event.key) {
        case 'ArrowRight':
        case ' ':  // Пробіл
            event.preventDefault();
            nextSlide();
            break;
            
        case 'ArrowLeft':
            event.preventDefault();
            prevSlide();
            break;
            
        case 'Home':
            event.preventDefault();
            goToFirst();
            break;
            
        case 'End':
            event.preventDefault();
            goToLast();
            break;
            
        case 'ArrowUp':
            event.preventDefault();
            prevSlide();
            break;
            
        case 'ArrowDown':
            event.preventDefault();
            nextSlide();
            break;
    }
}

/**
 * Обробка кліків по кнопках навігації
 */
function setupNavigationButtons() {
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
}

/**
 * Обробка свайпів на мобільних пристроях
 */
function setupTouchNavigation() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    const minSwipeDistance = 50;
    
    document.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].screenX;
        touchStartY = event.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', (event) => {
        touchEndX = event.changedTouches[0].screenX;
        touchEndY = event.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        // Перевіряємо, чи горизонтальний свайп більший за вертикальний
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > minSwipeDistance) {
                if (diffX > 0) {
                    // Свайп вліво - наступний слайд
                    nextSlide();
                } else {
                    // Свайп вправо - попередній слайд
                    prevSlide();
                }
            }
        }
    }
}

/**
 * Обробка скролу колесом миші
 */
function setupWheelNavigation() {
    let lastWheelTime = 0;
    const wheelDelay = 800; // Затримка між переходами
    
    document.addEventListener('wheel', (event) => {
        const currentTime = Date.now();
        
        if (currentTime - lastWheelTime < wheelDelay) {
            return;
        }
        
        if (event.deltaY > 0) {
            // Скрол вниз - наступний слайд
            nextSlide();
        } else if (event.deltaY < 0) {
            // Скрол вверх - попередній слайд
            prevSlide();
        }
        
        lastWheelTime = currentTime;
    }, { passive: true });
}

// ========================================
// ДЕМО ФУНКЦІОНАЛЬНІСТЬ
// ========================================

/**
 * Налаштування демо-лічильника кліків
 */
function setupDemoCounter() {
    const counterBtn = document.getElementById('demoCounter');
    
    if (counterBtn) {
        let count = 0;
        const countDisplay = counterBtn.querySelector('span');
        
        counterBtn.addEventListener('click', () => {
            count++;
            countDisplay.textContent = count;
            
            // Додаємо ефект анімації
            counterBtn.style.transform = 'scale(1.1)';
            setTimeout(() => {
                counterBtn.style.transform = 'scale(1)';
            }, 100);
        });
    }
}

/**
 * Налаштування демо-кнопки CSS
 */
function setupCSSDemo() {
    const demoBtn = document.querySelector('.demo-btn');
    
    if (demoBtn) {
        demoBtn.addEventListener('mouseenter', () => {
            demoBtn.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
        });
        
        demoBtn.addEventListener('mouseleave', () => {
            demoBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        });
    }
}

// ========================================
// ІНІЦІАЛІЗАЦІЯ
// ========================================

/**
 * Головна функція ініціалізації
 */
function init() {
    // Встановлюємо загальну кількість слайдів
    totalSlidesDisplay.textContent = totalSlides;
    
    // Оновлюємо UI
    updateUI();
    
    // Налаштовуємо обробники подій
    document.addEventListener('keydown', handleKeyDown);
    setupNavigationButtons();
    setupTouchNavigation();
    setupWheelNavigation();
    
    // Налаштовуємо демо елементи
    setupDemoCounter();
    setupCSSDemo();
    
    // Виводимо інформацію в консоль
    console.log('🎨 Презентація "Основи Web-розробки" завантажена');
    console.log(`📊 Всього слайдів: ${totalSlides}`);
    console.log('⌨️ Керування: ← → стрілки, Space, Home, End');
    console.log('📱 На мобільних: свайпи вліво/вправо');
}

// Запускаємо ініціалізацію після завантаження DOM
document.addEventListener('DOMContentLoaded', init);

// ========================================
// ДОДАТКОВІ УТИЛІТИ
// ========================================

/**
 * Функція для друку презентації (можна викликати з консолі)
 */
window.printPresentation = function() {
    // Показуємо всі слайди для друку
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.style.position = 'relative';
        slide.style.opacity = '1';
        slide.style.visibility = 'visible';
        slide.style.transform = 'none';
        slide.style.pageBreakAfter = 'always';
    });
    
    window.print();
    
    // Повертаємо стилі назад
    setTimeout(() => {
        slides.forEach((slide, index) => {
            slide.style.position = 'absolute';
            slide.style.pageBreakAfter = '';
            
            if (index + 1 !== currentSlideIndex) {
                slide.style.opacity = '0';
                slide.style.visibility = 'hidden';
            }
        });
    }, 1000);
};

/**
 * Функція для переходу до слайда (можна викликати з консолі)
 * @param {number} n - номер слайда
 */
window.slide = function(n) {
    goToSlide(n);
};
