// ナビゲーションメニュー制御スクリプト

// グローバル変数の型定義
export {};
declare global {
    interface Window {
        navController: NavigationController;
    }
}

class NavigationController {
    private sideNav: HTMLElement | null;
    private navOverlay: HTMLElement | null;
    private mainContent: HTMLElement | null;
    private menuToggle: HTMLElement | null;
    private isOpen: boolean = false;
    private isMobile: boolean = false;

    constructor() {
        this.sideNav = document.getElementById('sideNav');
        this.navOverlay = document.getElementById('navOverlay');
        this.mainContent = document.getElementById('mainContent');
        this.menuToggle = document.querySelector('.menu-toggle');

        this.init();
    }

    private init(): void {
        this.checkScreenSize();
        this.bindEvents();
        this.setActiveMenuItem();

        // 画面サイズ変更時の対応
        window.addEventListener('resize', () => {
            this.checkScreenSize();
        });
    }

    private checkScreenSize(): void {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < 768;

        // ハンバーガーメニューは常時表示
        if (this.menuToggle) {
            (this.menuToggle as HTMLElement).style.display = 'flex';
        }

        // デスクトップからモバイルに切り替わった場合の処理
        if (wasMobile !== this.isMobile && this.isMobile && this.isOpen) {
            this.closeSideNav();
        }
    }

    private bindEvents(): void {
        // data-action属性を使ったイベント委譲
        document.addEventListener('click', (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const actionElement = target.closest('[data-action]') as HTMLElement;

            if (actionElement) {
                const action = actionElement.getAttribute('data-action');
                this.handleAction(action, e);
            }
        });

        // オーバーレイとナビゲーション要素のクリックイベント
        if (this.navOverlay) {
            this.navOverlay.addEventListener('click', () => this.closeSideNav());
        }

        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleSideNav());
        }

        const navCloseBtns = document.querySelectorAll('.l-navCloseBtn, .nav-close-btn');
        navCloseBtns.forEach(btn => {
            btn.addEventListener('click', () => this.closeSideNav());
        });

        // ESCキーでサイドメニューを閉じる
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeSideNav();
            }
        });

        // タッチ/スワイプでサイドメニューを閉じる（モバイル用）
        let startX: number = 0;
        document.addEventListener('touchstart', (e: TouchEvent) => {
            startX = e.touches[0].clientX;
        });

        document.addEventListener('touchend', (e: TouchEvent) => {
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;

            // 右スワイプでサイドメニューを閉じる（右からスライドするため）
            if (diffX < -50 && this.isOpen) {
                this.closeSideNav();
            }
        });
    }

    private handleAction(action: string | null, e: MouseEvent): void {
        if (!action) return;

        switch (action) {
            case 'toggle-nav':
                e.preventDefault();
                this.toggleSideNav();
                break;
            case 'close-nav':
                e.preventDefault();
                this.closeSideNav();
                break;
            case 'back':
                e.preventDefault();
                history.back();
                break;
        }
    }

    public toggleSideNav(): void {
        if (this.isOpen) {
            this.closeSideNav();
        } else {
            this.openSideNav();
        }
    }

    private openSideNav(): void {
        if (!this.sideNav) return;

        this.isOpen = true;
        this.sideNav.classList.add('active');
        if (this.navOverlay) {
            this.navOverlay.classList.add('active');
        }

        // PCでのみコンテンツをシフト
        if (!this.isMobile && this.mainContent) {
            this.mainContent.classList.add('shifted');
        }

        // ハンバーガーボタンを×に変形
        if (this.menuToggle) {
            this.menuToggle.classList.add('active');
        }
    }

    private closeSideNav(): void {
        if (!this.sideNav) return;

        this.isOpen = false;
        this.sideNav.classList.remove('active');
        if (this.navOverlay) {
            this.navOverlay.classList.remove('active');
        }

        // コンテンツシフトを解除
        if (this.mainContent) {
            this.mainContent.classList.remove('shifted');
        }

        // ハンバーガーボタンを元に戻す
        if (this.menuToggle) {
            this.menuToggle.classList.remove('active');
        }
    }

    public setActiveMenuItem(): void {
        const currentPage = this.getCurrentPageName();

        // サイドナビゲーションのアクティブ設定
        const sideNavItems = document.querySelectorAll<HTMLElement>('.side-nav-item');
        sideNavItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href && this.isCurrentPage(href, currentPage)) {
                item.classList.add('active');
            }
        });
    }

    public getCurrentPageName(): string {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename;
    }

    public isCurrentPage(href: string, currentPage: string): boolean {
        const linkPage = href.split('/').pop() || 'index.html';
        return linkPage === currentPage ||
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === '/' && linkPage === 'index.html');
    }

    // ページ遷移時のアニメーション
    public navigateWithAnimation(url: string): void {
        // フェードアウトアニメーション
        document.body.style.opacity = '0.7';
        document.body.style.transition = 'opacity 0.2s ease';

        setTimeout(() => {
            window.location.href = url;
        }, 200);
    }
}

// ページ読み込み完了時に初期化
document.addEventListener('DOMContentLoaded', function(): void {
    window.navController = new NavigationController();

    // サイドナビゲーションリンクにアニメーション効果を追加
    const navLinks = document.querySelectorAll<HTMLAnchorElement>('.side-nav-item');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e: MouseEvent): void {
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

// タブの可視性変更時の処理（ページに戻った時にナビの状態をリセット）
document.addEventListener('visibilitychange', function(): void {
    if (!document.hidden && window.navController) {
        window.navController.setActiveMenuItem();
    }
});
