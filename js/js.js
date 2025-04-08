document.addEventListener("DOMContentLoaded", () => {
    // ==============================================
    // 🔹 기존 슬라이드 초기화 함수
    // ==============================================
    function initializeSlider(sliderContainer) {
        const slider = sliderContainer.querySelector(".additional-slider");
        const slides = sliderContainer.querySelectorAll(".slide");
        const prevBtn = sliderContainer.querySelector(".prev-btn");
        const nextBtn = sliderContainer.querySelector(".next-btn");

        if (!slider || slides.length === 0) return;

        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let currentIndex = 0;
        let slidesPerView = getSlidesPerView();

        // 🔹 슬라이드 너비 계산
        function getSlideWidth() {
            return slides[0].getBoundingClientRect().width;
        }

        // 🔹 화면 크기에 따른 콘텐츠 개수 설정
        function getSlidesPerView() {
            const screenWidth = window.innerWidth;
            if (screenWidth >= 1200) return 4;
            if (screenWidth >= 900) return 3.5;
            if (screenWidth >= 600) return 3;
            if (screenWidth >= 500) return 2;
            return 1;
        }

        // 🔹 슬라이드 이동 기능
        function moveToSlide(index) {
            const slideWidth = getSlideWidth();
            const maxIndex = slides.length - slidesPerView;

            currentIndex = Math.max(0, Math.min(index, maxIndex));
            currentTranslate = -currentIndex * slideWidth;

            slider.style.transform = `translateX(${currentTranslate}px)`;
            slider.style.transition = 'transform 0.5s ease';
        }

        if (nextBtn) nextBtn.addEventListener("click", () => moveToSlide(currentIndex + 1));
        if (prevBtn) prevBtn.addEventListener("click", () => moveToSlide(currentIndex - 1));

        // 🔹 드래그 이벤트
        slider.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            prevTranslate = currentTranslate;
            slider.style.transition = 'none';
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const currentPosition = e.clientX;
            const moveX = currentPosition - startX;
            currentTranslate = prevTranslate + moveX;
            slider.style.transform = `translateX(${currentTranslate}px)`;
        });

        slider.addEventListener('mouseup', () => {
            isDragging = false;
            snapToSlide();
        });

        slider.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                snapToSlide();
            }
        });

        function snapToSlide() {
            const slideWidth = getSlideWidth();
            const nearestIndex = Math.round(Math.abs(currentTranslate) / slideWidth);

            currentIndex = Math.max(0, Math.min(nearestIndex, slides.length - slidesPerView));
            currentTranslate = -currentIndex * slideWidth;

            slider.style.transform = `translateX(${currentTranslate}px)`;
            slider.style.transition = 'transform 0.5s ease';
        }

        window.addEventListener('resize', () => {
            slidesPerView = getSlidesPerView();
            const slideWidth = getSlideWidth();
            currentTranslate = -currentIndex * slideWidth;
            slider.style.transform = `translateX(${currentTranslate}px)`;
        });
    }

    document.querySelectorAll(".slider-container").forEach((sliderContainer) => {
        initializeSlider(sliderContainer);
    });

    // ==============================================
    // 🔹 새로운 슬라이드 기능 (950px 이하 대응)
    // ==============================================
    const customSlider = document.querySelector("#section_4_custom .custom-swiper-wrapper");
    const customSlides = document.querySelectorAll("#section_4_custom .custom-swiper-slide");
    const paginationContainer = document.querySelector(".custom-swiper-pagination");

    let customIndex = 0;
    let customSlidesPerView = window.innerWidth <= 950 ? 1 : 2;

    // 🔹 Pagination 동적 생성
    function createPagination() {
        paginationContainer.innerHTML = "";  // 기존 점 제거
        const pageCount = Math.ceil(customSlides.length / customSlidesPerView);

        for (let i = 0; i < pageCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            paginationContainer.appendChild(dot);

            dot.addEventListener('click', () => {
                customIndex = i * customSlidesPerView;
                moveToCustomSlide(customIndex);
            });
        }
    }

    // 🔹 슬라이드 이동
    function moveToCustomSlide(index) {
        const translateX = -index * (100 / customSlidesPerView);
        customSlider.style.transform = `translateX(${translateX}%)`;

        const dots = document.querySelectorAll("#section_4_custom .dot");
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === Math.floor(index / customSlidesPerView));
        });
    }

    function autoCustomSlide() {
        customIndex += customSlidesPerView;
        if (customIndex >= customSlides.length) {
            customIndex = 0;
        }
        moveToCustomSlide(customIndex);
    }

    function initSwiper() {
        customSlidesPerView = window.innerWidth <= 950 ? 1 : 2;  // 🔹 950px 이하에서 1개씩 표시
        createPagination();   // Pagination(dot) 자동 생성
        moveToCustomSlide(0);
    }

    initSwiper();
    setInterval(autoCustomSlide, 2000);

    window.addEventListener("resize", initSwiper);
});
