// ページの初期化処理
function initPage() {
    const path = window.location.pathname;
    const page = path.split("/").pop();

    if (page === "index.html" || page === "") {
        initHeroSlider();
        // initHeroSliderMove();
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
    const progressBar = document.querySelector(".hero__progressbar");

    if (!slides.length || !prev || !next || !dotsContainer || !progressBar) {
        console.warn("スライダー要素が見つかりません。");
        return;
    }

    let currentIndex = 0;
    let autoSlideTimer = null;


    // --------------------
    // スマホスワイプでのスライドショー制御
    // -------------------- 
    let startX = 0;
    let endX = 0;
    const swipeThreshold = 50; // XX px以上でスワイプと判定
    document.addEventListener("touchstart", (e) => {
        startX = e.changedTouches[0].clientX;
    });
    document.addEventListener("touchend", (e) => {
        endX = e.changedTouches[0].clientX;
        const diff = endX - startX;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                goToSlide(currentIndex - 1); // 右スワイプ → 前のスライド
            } else {
                goToSlide(currentIndex + 1); // 左スワイプ → 次のスライド
            }
            resetAutoSlide(); // スワイプしたら進行バーもリセット
        }
    });


    
    // --------------------
    // 進捗バー制御
    // --------------------
    function startProgress() {
        progressBar.classList.remove("hero__progressbar--animate");
        void progressBar.offsetWidth; // ← CSS アニメーションを再スタートするための裏技
        progressBar.classList.add("hero__progressbar--animate");
    }

    // --------------------
    // ドット生成
    // --------------------
    slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.classList.add("hero__dot");
        if (index === 0) dot.classList.add("hero__dot--active");
        dot.addEventListener("click", () => {
            goToSlide(index);
            resetAutoSlide();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".hero__dot");

    // --------------------
    // スライド表示処理
    // --------------------
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove("hero__slide--active"));
        dots.forEach(dot => dot.classList.remove("hero__dot--active"));

        slides[index].classList.add("hero__slide--active");
        dots[index].classList.add("hero__dot--active");

        startProgress();
    }

    function goToSlide(index) {
        currentIndex = (index + slides.length) % slides.length;
        showSlide(currentIndex);
    }

    // --------------------
    // 前後ボタン
    // --------------------
    prev.addEventListener("click", () => {
        goToSlide(currentIndex - 1);
        resetAutoSlide();
    });
    next.addEventListener("click", () => {
        goToSlide(currentIndex + 1);
        resetAutoSlide();
    });

    // --------------------
    // 自動スライド（XX秒）
    // --------------------
    function startAutoSlide() {
        autoSlideTimer = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideTimer);
        startAutoSlide();
    }

    // 初期表示
    showSlide(0);
    startAutoSlide();
}


// スクリプトロード完了時に即初期化
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});
revealElements.forEach(el => observer.observe(el));

initPage();


