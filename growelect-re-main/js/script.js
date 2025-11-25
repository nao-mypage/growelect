// ページの初期化処理
function initPage() {
    const path = window.location.pathname;
    const page = path.split("/").pop();

    if (page === "index.html" || page === "") {
        initHeroSlider();
    }
    initHamburgerMenu();
}


/* ---------------------------
   ハンバーガーメニュー制御
--------------------------- */
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const overlay = document.querySelector('.header__overlay');

    if (!hamburger || !navMenu || !overlay) {
        console.warn("ハンバーガーメニューの要素が見つかりません。");
        return;
    }

    // ハンバーガーメニュー
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active'); 

        if (navMenu.classList.contains('active')) {
            // メニューを順番に表示
            const menuItems = navMenu.querySelectorAll('a');
            menuItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('show');
                }, 250 + (index * 150));
            });
        } else {
            // メニューを非表示
            const menuItems = navMenu.querySelectorAll('a');
            menuItems.forEach(item => {
                item.classList.remove('show');
            });
        }
    });

    // オーバーレイをクリックしたら閉じる
    overlay.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');

        const menuItems = navMenu.querySelectorAll('a');
        menuItems.forEach(item => {
            item.classList.remove('show');
        });
    });
}


/* ---------------------------
   ヒーロースライダー制御
--------------------------- */
function initHeroSlider() {
    const slides = document.querySelectorAll(".hero__slide");
    const prev = document.querySelector(".hero__prev");
    const next = document.querySelector(".hero__next");
    const dotsContainer = document.querySelector(".hero__dots");

    if (!slides.length || !prev || !next || !dotsContainer) {
        console.warn("スライダー要素が見つかりません。");
        console.warn(slides.length, prev, next, dotsContainer);
        return;
    }

    let currentIndex = 0;

    // ドットを生成
    slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.classList.add("hero__dot");
        if(index === 0) dot.classList.add("hero__dot--active");
        dot.addEventListener("click", () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll(".hero__dot");

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove("hero__slide--active"));
        dots.forEach(dot => dot.classList.remove("hero__dot--active"));
        slides[index].classList.add("hero__slide--active");
        dots[index].classList.add("hero__dot--active");
    }

    function goToSlide(index) {
        currentIndex = (index + slides.length) % slides.length;
        showSlide(currentIndex);
    }

    prev.addEventListener("click", () => goToSlide(currentIndex - 1));
    next.addEventListener("click", () => goToSlide(currentIndex + 1));
}




// スクリプトロード完了時に即初期化
initPage();