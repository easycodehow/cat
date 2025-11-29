// 메인 슬라이더 기능 - 진정한 무한 루프
let currentIndex = 0;
let slideInterval;
let isTransitioning = false;

document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.querySelector('.slider-container');
    const slides = Array.from(document.querySelectorAll('.slide'));
    const indicators = document.querySelectorAll('.indicator');
    const totalSlides = slides.length;

    // 첫 번째 슬라이드를 복제해서 끝에 추가 (무한 루프용)
    const firstClone = slides[0].cloneNode(true);
    sliderContainer.appendChild(firstClone);

    // 슬라이드 이동 함수
    function moveSlide(index, animate = true) {
        const container = document.querySelector('.slider-container');

        if (animate) {
            container.style.transition = 'transform 1s ease-in-out';
        } else {
            container.style.transition = 'none';
        }

        container.style.transform = `translateX(-${index * 100}%)`;

        // 인디케이터 업데이트
        const realIndex = index % totalSlides;
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === realIndex);
        });
    }

    // 다음 슬라이드
    function nextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;

        currentIndex++;
        moveSlide(currentIndex, true);

        // 복제본에 도달했을 때
        if (currentIndex === totalSlides) {
            setTimeout(() => {
                currentIndex = 0;
                moveSlide(0, false);
                // 다음 프레임에서 transition 재활성화
                setTimeout(() => {
                    isTransitioning = false;
                }, 50);
            }, 1000);
        } else {
            setTimeout(() => {
                isTransitioning = false;
            }, 1000);
        }
    }

    // 인디케이터 클릭 시 특정 슬라이드로 이동
    window.goToSlide = function(index) {
        if (isTransitioning) return;

        clearInterval(slideInterval);
        currentIndex = index;
        moveSlide(index, true);

        setTimeout(() => {
            startAutoSlide();
        }, 3000);
    };

    // 자동 슬라이드 시작
    function startAutoSlide() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 3000);
    }

    // 초기화
    moveSlide(0, false);
    startAutoSlide();

    // 마우스 호버 시 일시정지
    const sliderWrapper = document.querySelector('.slider-wrapper');

    sliderWrapper.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    sliderWrapper.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
});
