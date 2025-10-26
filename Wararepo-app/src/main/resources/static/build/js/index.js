"use strict";
// メインスクリプト - 管理者側の機能
class WWWRepo {
    constructor() {
        this.currentUser = null;
        this.currentLive = null;
        this.performers = [];
        this.currentPerformerIndex = 0;
        this.init();
    }
    init() {
        // ページ読み込み時の初期化
        this.checkAuthState();
        this.bindEvents();
    }
    checkAuthState() {
        // ローカルストレージから認証状態を確認
        const userString = localStorage.getItem('wwwrepo_user');
        if (userString) {
            this.currentUser = JSON.parse(userString);
        }
    }
    bindEvents() {
        // フォームイベントの設定
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLoginSubmit.bind(this));
        }
        const createLiveForm = document.getElementById('createLiveForm');
        if (createLiveForm) {
            createLiveForm.addEventListener('submit', this.handleCreateLiveSubmit.bind(this));
        }
        const addPerformerForm = document.getElementById('addPerformerForm');
        if (addPerformerForm) {
            addPerformerForm.addEventListener('submit', this.handleAddPerformerSubmit.bind(this));
        }
        // data-action属性を使ったイベント委譲
        document.addEventListener('click', (e) => {
            const target = e.target;
            const actionElement = target.closest('[data-action]');
            if (actionElement) {
                const action = actionElement.getAttribute('data-action');
                const param = actionElement.getAttribute('data-param');
                this.handleAction(action, param, e);
            }
        });
        // モーダルの外側クリックで閉じる
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('modal')) {
                this.closeModal();
            }
        });
        // ESCキーでモーダルを閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }
    handleAction(action, param, e) {
        if (!action)
            return;
        switch (action) {
            case 'go-to-login':
                e.preventDefault();
                this.goToLogin();
                break;
            case 'go-to-admin':
                e.preventDefault();
                this.goToAdmin();
                break;
            case 'go-to-live-detail':
                e.preventDefault();
                if (param)
                    this.goToLiveDetail(param);
                break;
            case 'go-to-results':
                e.preventDefault();
                if (param)
                    this.goToResults(param);
                break;
            case 'show-qr-info':
                e.preventDefault();
                this.showQRInfo();
                break;
            case 'handle-login':
                e.preventDefault();
                this.handleLogin();
                break;
            case 'login-google':
                e.preventDefault();
                this.loginWithGoogle();
                break;
            case 'login-facebook':
                e.preventDefault();
                this.loginWithFacebook();
                break;
            case 'show-signup':
                e.preventDefault();
                this.showSignup();
                break;
            case 'handle-logout':
                e.preventDefault();
                this.handleLogout();
                break;
            case 'show-create-live-modal':
                e.preventDefault();
                this.showCreateLiveModal();
                break;
            case 'close-modal':
                e.preventDefault();
                this.closeModal();
                break;
            case 'show-add-performer-modal':
                e.preventDefault();
                this.showAddPerformerModal();
                break;
            case 'edit-performer':
                e.preventDefault();
                if (param)
                    this.editPerformer(param);
                break;
            case 'remove-performer':
                e.preventDefault();
                if (param)
                    this.removePerformer(param);
                break;
            case 'previous-performer':
                e.preventDefault();
                this.previousPerformer();
                break;
            case 'next-performer':
                e.preventDefault();
                this.nextPerformer();
                break;
            case 'show-comments':
                e.preventDefault();
                if (param)
                    this.showComments(param);
                break;
            case 'export-csv':
                e.preventDefault();
                this.exportCSV();
                break;
            case 'export-pdf':
                e.preventDefault();
                this.exportPDF();
                break;
            case 'copy-url':
                e.preventDefault();
                this.copyURL();
                break;
            case 'toggle-fab-menu':
                e.preventDefault();
                this.toggleFabMenu();
                break;
            case 'toggle-dropdown':
                e.preventDefault();
                this.toggleDropdown();
                break;
            case 'select-live':
                e.preventDefault();
                if (param)
                    this.selectLive(param);
                break;
            case 'switch-tab':
                e.preventDefault();
                if (param)
                    this.switchTab(parseInt(param));
                break;
            case 'save-live-draft':
                e.preventDefault();
                this.saveLiveDraft();
                break;
            case 'next-step':
                e.preventDefault();
                this.nextStep();
                break;
            case 'prev-step':
                e.preventDefault();
                this.prevStep();
                break;
            case 'create-live':
                e.preventDefault();
                this.createLive();
                break;
            case 'filter-by-selection':
                e.preventDefault();
                if (param)
                    this.filterBySelection(param);
                break;
            case 'remove-selected-performer':
                e.preventDefault();
                if (param)
                    this.removeSelectedPerformer(param);
                break;
            case 'open-template-modal':
                e.preventDefault();
                this.openTemplateModal();
                break;
            case 'close-template-modal':
                e.preventDefault();
                this.closeTemplateModal();
                break;
            case 'clear-template':
                e.preventDefault();
                this.clearTemplate();
                break;
            case 'save-as-template':
                e.preventDefault();
                this.saveAsTemplate();
                break;
            case 'save-draft':
                e.preventDefault();
                this.saveDraft();
                break;
            case 'create-survey':
                e.preventDefault();
                this.createSurvey();
                break;
            case 'copy-url':
                e.preventDefault();
                this.copyUrl();
                break;
            case 'download-qr':
                e.preventDefault();
                this.downloadQR();
                break;
            case 'go-to-live-management':
                e.preventDefault();
                this.goToLiveManagement();
                break;
            case 'create-another-survey':
                e.preventDefault();
                this.createAnotherSurvey();
                break;
            case 'select-template':
                e.preventDefault();
                if (param)
                    this.selectTemplate(param);
                break;
            case 'delete-template':
                e.preventDefault();
                if (param)
                    this.deleteTemplate(param);
                break;
        }
    }
    handleLoginSubmit(e) {
        e.preventDefault();
        this.handleLogin();
    }
    handleCreateLiveSubmit(e) {
        e.preventDefault();
        const liveNameInput = document.getElementById('liveName');
        const liveDateInput = document.getElementById('liveDate');
        const venueInput = document.getElementById('venue');
        const liveName = liveNameInput.value;
        const liveDate = liveDateInput.value;
        const venue = venueInput.value;
        if (!liveName || !liveDate) {
            alert('ライブ名と開催日時は必須です。');
            return;
        }
        // ライブを作成（モックアップ）
        const live = {
            id: Date.now().toString(),
            name: liveName,
            date: liveDate,
            venue: venue,
            performers: [],
            responses: []
        };
        alert(`「${liveName}」を作成しました！`);
        this.closeModal();
        // 作成したライブの詳細画面に遷移
        setTimeout(() => {
            this.goToLiveDetail(live.id);
        }, 1000);
    }
    handleAddPerformerSubmit(e) {
        e.preventDefault();
        const performerNameInput = document.getElementById('performerName');
        const performerGenreInput = document.getElementById('performerGenre');
        const performerName = performerNameInput.value;
        const performerGenre = performerGenreInput.value;
        if (!performerName) {
            alert('芸人名は必須です。');
            return;
        }
        alert(`「${performerName}」（${performerGenre}）を追加しました！`);
        this.closeModal();
        // 芸人リストを更新（実際の実装では動的に追加）
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
    // ナビゲーション関数
    goToLogin() {
        window.location.href = 'login.html';
    }
    goToAdmin() {
        window.location.href = 'admin.html';
    }
    goToLiveDetail(liveId) {
        window.location.href = `live-detail.html?id=${liveId}`;
    }
    goToResults(liveId) {
        window.location.href = `results.html?id=${liveId}`;
    }
    showQRInfo() {
        alert('QRコードは各ライブの管理画面で生成されます。\n主催者の方はまずログインしてライブを作成してください。');
    }
    // ログイン関連
    handleLogin() {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const email = emailInput.value;
        const password = passwordInput.value;
        if (!email || !password) {
            alert('メールアドレスとパスワードを入力してください。');
            return;
        }
        // モックアップなので簡単な認証
        if (email && password.length >= 6) {
            const user = {
                email: email,
                name: email.split('@')[0]
            };
            localStorage.setItem('wwwrepo_user', JSON.stringify(user));
            alert('ログインしました！');
            window.location.href = 'index.html';
        }
        else {
            alert('パスワードは6文字以上で入力してください。');
        }
    }
    loginWithGoogle() {
        // モックアップ用
        alert('Googleログイン機能は実装予定です。');
    }
    loginWithFacebook() {
        // モックアップ用
        alert('Facebookログイン機能は実装予定です。');
    }
    showSignup() {
        const name = prompt('お名前を入力してください:');
        const email = prompt('メールアドレスを入力してください:');
        const password = prompt('パスワードを入力してください（6文字以上）:');
        if (name && email && password && password.length >= 6) {
            const user = {
                email: email,
                name: name
            };
            localStorage.setItem('wwwrepo_user', JSON.stringify(user));
            alert('アカウントを作成しました！');
            window.location.href = 'index.html';
        }
        else {
            alert('すべての項目を正しく入力してください。');
        }
    }
    handleLogout() {
        if (confirm('ログアウトしますか？')) {
            localStorage.removeItem('wwwrepo_user');
            window.location.href = 'index.html';
        }
    }
    // ライブ作成関連
    showCreateLiveModal() {
        const modal = document.getElementById('createLiveModal');
        if (modal) {
            modal.classList.add('show');
        }
        // 現在日時を設定
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString().slice(0, 16);
        const liveDateInput = document.getElementById('liveDate');
        if (liveDateInput) {
            liveDateInput.value = localDateTime;
        }
    }
    closeModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => modal.classList.remove('show'));
    }
    // 芸人管理
    showAddPerformerModal() {
        const modal = document.getElementById('addPerformerModal');
        if (modal) {
            modal.classList.add('show');
        }
    }
    editPerformer(performerId) {
        alert(`芸人ID: ${performerId} の編集機能は実装予定です。`);
    }
    removePerformer(performerId) {
        if (confirm('この芸人を削除しますか？')) {
            alert(`芸人ID: ${performerId} を削除しました。`);
        }
    }
    previousPerformer() {
        alert('前の芸人に切り替えました。観客のアンケート画面も自動更新されます。');
    }
    nextPerformer() {
        alert('次の芸人に切り替えました。観客のアンケート画面も自動更新されます。');
    }
    // 集計結果
    showComments(performerId) {
        // モックアップデータ
        const comments = [
            'とても面白かったです！',
            '次回も期待しています',
            'ネタのテンポが良かった',
            'もう少し声が大きいと良いかも'
        ];
        let commentText = `芸人ID: ${performerId} のコメント一覧:\n\n`;
        comments.forEach((comment, index) => {
            commentText += `${index + 1}. ${comment}\n`;
        });
        alert(commentText);
    }
    exportCSV() {
        alert('CSV形式でのエクスポート機能は実装予定です。');
    }
    exportPDF() {
        alert('PDF形式でのエクスポート機能は実装予定です。');
    }
    copyURL() {
        // 現在のページURLを基にアンケートURLを生成
        const baseURL = window.location.origin;
        const liveId = new URLSearchParams(window.location.search).get('id') || 'sample';
        const surveyURL = `${baseURL}/survey.html?liveId=${liveId}`;
        // クリップボードにコピー
        navigator.clipboard.writeText(surveyURL).then(() => {
            alert('アンケートURLをクリップボードにコピーしました！\n' + surveyURL);
        }).catch(() => {
            // フォールバック
            prompt('アンケートURL（コピーしてください）:', surveyURL);
        });
    }
    toggleFabMenu() {
        const fabMenu = document.querySelector('.fab-menu');
        const fabBackdrop = document.querySelector('.fab-backdrop');
        if (fabMenu) {
            fabMenu.classList.toggle('open');
        }
        if (fabBackdrop) {
            fabBackdrop.classList.toggle('show');
        }
    }
    // ドロップダウン関連
    toggleDropdown() {
        const dropdown = document.querySelector('.dropdown-options');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }
    selectLive(liveId) {
        alert(`ライブID: ${liveId} を選択しました。`);
        this.toggleDropdown();
        // 実際の実装では、選択されたライブのデータを読み込む
    }
    // ライブ作成関連の追加機能
    switchTab(tabNumber) {
        alert(`タブ ${tabNumber} に切り替えました。`);
        // 実際の実装では、タブの切り替え処理を行う
    }
    saveLiveDraft() {
        alert('下書きを保存しました。');
    }
    nextStep() {
        alert('次のステップに進みます。');
    }
    prevStep() {
        alert('前のステップに戻ります。');
    }
    createLive() {
        alert('ライブを作成します。');
    }
    filterBySelection(filter) {
        alert(`フィルター: ${filter}`);
    }
    removeSelectedPerformer(performerId) {
        if (confirm(`芸人ID: ${performerId} を削除しますか？`)) {
            alert('削除しました。');
        }
    }
    // アンケート作成関連
    openTemplateModal() {
        const modal = document.getElementById('templateModal');
        if (modal)
            modal.classList.add('show');
    }
    closeTemplateModal() {
        const modal = document.getElementById('templateModal');
        if (modal)
            modal.classList.remove('show');
    }
    clearTemplate() {
        if (confirm('テンプレートをクリアしますか？')) {
            alert('テンプレートをクリアしました。');
        }
    }
    saveAsTemplate() {
        alert('テンプレートとして保存しました。');
    }
    saveDraft() {
        alert('下書きを保存しました。');
    }
    createSurvey() {
        alert('アンケートを作成しました。');
    }
    copyUrl() {
        alert('URLをクリップボードにコピーしました。');
    }
    downloadQR() {
        alert('QRコードをダウンロードしました。');
    }
    goToLiveManagement() {
        window.location.href = 'live-detail.html';
    }
    createAnotherSurvey() {
        location.reload();
    }
    selectTemplate(templateId) {
        alert(`テンプレート ${templateId} を選択しました。`);
        this.closeTemplateModal();
    }
    deleteTemplate(templateId) {
        if (confirm(`テンプレート ${templateId} を削除しますか？`)) {
            alert('削除しました。');
        }
    }
}
// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', function () {
    // アプリケーションのインスタンスを作成
    new WWWRepo();
});
