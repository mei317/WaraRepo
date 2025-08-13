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
        const user = localStorage.getItem('wwwrepo_user');
        if (user) {
            this.currentUser = JSON.parse(user);
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
    }

    handleLoginSubmit(e) {
        e.preventDefault();
        handleLogin();
    }

    handleCreateLiveSubmit(e) {
        e.preventDefault();
        
        const liveName = document.getElementById('liveName').value;
        const liveDate = document.getElementById('liveDate').value;
        const venue = document.getElementById('venue').value;
        
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
        closeModal();
        
        // 作成したライブの詳細画面に遷移
        setTimeout(() => {
            goToLiveDetail(live.id);
        }, 1000);
    }

    handleAddPerformerSubmit(e) {
        e.preventDefault();
        
        const performerName = document.getElementById('performerName').value;
        const performerGenre = document.getElementById('performerGenre').value;
        
        if (!performerName) {
            alert('芸人名は必須です。');
            return;
        }
        
        alert(`「${performerName}」（${performerGenre}）を追加しました！`);
        closeModal();
        
        // 芸人リストを更新（実際の実装では動的に追加）
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

// インスタンスの作成
const app = new WWWRepo();

// ナビゲーション関数
function goToLogin() {
    window.location.href = 'login.html';
}

function goToAdmin() {
    window.location.href = 'admin.html';
}

function goToLiveDetail(liveId) {
    window.location.href = `live-detail.html?id=${liveId}`;
}

function goToResults(liveId) {
    window.location.href = `results.html?id=${liveId}`;
}

function showQRInfo() {
    alert('QRコードは各ライブの管理画面で生成されます。\n主催者の方はまずログインしてライブを作成してください。');
}

// ログイン関連
function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
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
    } else {
        alert('パスワードは6文字以上で入力してください。');
    }
}

function loginWithGoogle() {
    // モックアップ用
    alert('Googleログイン機能は実装予定です。');
}

function loginWithFacebook() {
    // モックアップ用
    alert('Facebookログイン機能は実装予定です。');
}

function showSignup() {
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
    } else {
        alert('すべての項目を正しく入力してください。');
    }
}

function handleLogout() {
    if (confirm('ログアウトしますか？')) {
        localStorage.removeItem('wwwrepo_user');
        window.location.href = 'index.html';
    }
}

// ライブ作成関連
function showCreateLiveModal() {
    const modal = document.getElementById('createLiveModal');
    modal.classList.add('show');
    
    // 現在日時を設定
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString().slice(0, 16);
    document.getElementById('liveDate').value = localDateTime;
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.classList.remove('show'));
}

// タブ切り替え
function showTab(tabName) {
    // すべてのタブを非アクティブに
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 選択されたタブをアクティブに
    event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
}

// 芸人管理
function showAddPerformerModal() {
    const modal = document.getElementById('addPerformerModal');
    modal.classList.add('show');
}

function editPerformer(performerId) {
    alert(`芸人ID: ${performerId} の編集機能は実装予定です。`);
}

function removePerformer(performerId) {
    if (confirm('この芸人を削除しますか？')) {
        alert(`芸人ID: ${performerId} を削除しました。`);
    }
}

function previousPerformer() {
    alert('前の芸人に切り替えました。観客のアンケート画面も自動更新されます。');
}

function nextPerformer() {
    alert('次の芸人に切り替えました。観客のアンケート画面も自動更新されます。');
}

// 集計結果
function showComments(performerId) {
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

function exportCSV() {
    alert('CSV形式でのエクスポート機能は実装予定です。');
}

function exportPDF() {
    alert('PDF形式でのエクスポート機能は実装予定です。');
}

function copyURL() {
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

// フォーム送信ハンドラはクラス内に移動済み

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', function() {
    // 管理者ダッシュボードの場合、認証チェック
    if (window.location.pathname.includes('admin')) {
        const user = localStorage.getItem('wwwrepo_user');
        if (!user && !window.location.pathname.includes('login')) {
            alert('ログインが必要です。');
            goToLogin();
            return;
        }
        
        // ユーザー名を表示
        if (user) {
            const userData = JSON.parse(user);
            const userNameElement = document.getElementById('userName');
            if (userNameElement) {
                userNameElement.textContent = userData.name;
            }
        }
    }
    
    // モーダルの外側クリックで閉じる
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });
    
    // ESCキーでモーダルを閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

// パスワード表示切り替え（オプション）
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
}