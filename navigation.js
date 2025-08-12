// ナビゲーションメニュー制御スクリプト

class NavigationController {
    constructor() {
        this.sideNav = document.getElementById('sideNav');
        this.navOverlay = document.getElementById('navOverlay');
        this.mainContent = document.getElementById('mainContent');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.isOpen = false;
        this.isMobile = false;
        
        this.init();
    }

    init() {
        this.checkScreenSize();
        this.bindEvents();
        this.setActiveMenuItem();
        
        // 画面サイズ変更時の対応
        window.addEventListener('resize', () => {
            this.checkScreenSize();
        });
    }

    checkScreenSize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < 768;
        
        if (this.isMobile) {
            // モバイル: サイドメニュー非表示、グローバルナビ表示
            this.menuToggle.style.display = 'none';
            if (this.isOpen) {
                this.closeSideNav();
            }
        } else {
            // PC: メニュートグルボタン表示
            this.menuToggle.style.display = 'flex';
        }
        
        // デスクトップからモバイルに切り替わった場合の処理
        if (wasMobile !== this.isMobile && this.isMobile && this.isOpen) {
            this.closeSideNav();
        }
    }

    bindEvents() {
        // ESCキーでサイドメニューを閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeSideNav();
            }
        });

        // タッチ/スワイプでサイドメニューを閉じる（モバイル用）
        let startX = 0;
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            // 左スワイプでサイドメニューを閉じる
            if (diffX > 50 && this.isOpen) {
                this.closeSideNav();
            }
        });
    }

    toggleSideNav() {
        if (this.isOpen) {
            this.closeSideNav();
        } else {
            this.openSideNav();
        }
    }

    openSideNav() {
        if (!this.sideNav) return;
        
        this.isOpen = true;
        this.sideNav.classList.add('active');
        this.navOverlay.classList.add('active');
        
        if (!this.isMobile) {
            this.mainContent.classList.add('shifted');
        }
        
        // ボタンアイコンを×に変更
        const icon = this.menuToggle.querySelector('.material-icons');
        if (icon) {
            icon.textContent = 'close';
        }
    }

    closeSideNav() {
        if (!this.sideNav) return;
        
        this.isOpen = false;
        this.sideNav.classList.remove('active');
        this.navOverlay.classList.remove('active');
        this.mainContent.classList.remove('shifted');
        
        // ボタンアイコンをメニューに戻す
        const icon = this.menuToggle.querySelector('.material-icons');
        if (icon) {
            icon.textContent = 'menu';
        }
    }

    setActiveMenuItem() {
        const currentPage = this.getCurrentPageName();
        
        // サイドナビゲーションのアクティブ設定
        const sideNavItems = document.querySelectorAll('.side-nav-item');
        sideNavItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href && this.isCurrentPage(href, currentPage)) {
                item.classList.add('active');
            }
        });
        
        // グローバルナビゲーションのアクティブ設定
        const globalNavItems = document.querySelectorAll('.global-nav .nav-item');
        globalNavItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href && this.isCurrentPage(href, currentPage)) {
                item.classList.add('active');
            }
        });
    }

    getCurrentPageName() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename;
    }

    isCurrentPage(href, currentPage) {
        const linkPage = href.split('/').pop() || 'index.html';
        return linkPage === currentPage || 
               (currentPage === '' && linkPage === 'index.html') ||
               (currentPage === '/' && linkPage === 'index.html');
    }

    // ページ遷移時のアニメーション
    navigateWithAnimation(url) {
        // フェードアウトアニメーション
        document.body.style.opacity = '0.7';
        document.body.style.transition = 'opacity 0.2s ease';
        
        setTimeout(() => {
            window.location.href = url;
        }, 200);
    }
}

// グローバル関数（HTML onclick用）
function toggleSideNav() {
    if (window.navController) {
        window.navController.toggleSideNav();
    }
}

// ページ読み込み完了時に初期化
document.addEventListener('DOMContentLoaded', function() {
    window.navController = new NavigationController();
    
    // ナビゲーションリンクにアニメーション効果を追加
    const navLinks = document.querySelectorAll('.nav-item, .side-nav-item');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 外部リンクや#リンクの場合は通常動作
            const href = this.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('http')) {
                return;
            }
            
            // 現在のページと同じ場合は何もしない
            if (window.navController.isCurrentPage(href, window.navController.getCurrentPageName())) {
                e.preventDefault();
                return;
            }
            
            // アニメーション付きページ遷移
            e.preventDefault();
            window.navController.navigateWithAnimation(href);
        });
    });
});

// モバイルでのスクロール時にナビゲーションを隠す/表示する
let lastScrollTop = 0;
let scrollTimeout;

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // モバイルナビゲーションの表示制御
    if (window.navController && window.navController.isMobile) {
        const globalNav = document.querySelector('.global-nav');
        if (globalNav) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // 下スクロール時に隠す
                globalNav.style.transform = 'translateY(calc(100% + 32px))';
            } else {
                // 上スクロール時に表示
                globalNav.style.transform = 'translateY(0)';
            }
        }
    }
    
    lastScrollTop = scrollTop;
});

// タブの可視性変更時の処理（ページに戻った時にナビの状態をリセット）
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && window.navController) {
        window.navController.setActiveMenuItem();
    }
});