// アンケート用スクリプト
class SurveyApp {
    constructor() {
        this.currentRating = 0;
        this.liveId = null;
        this.currentPerformer = null;
        this.responses = [];
        this.init();
    }

    init() {
        // URLからライブIDを取得
        this.liveId = new URLSearchParams(window.location.search).get('liveId') || 'sample';
        this.loadCurrentPerformer();
        this.bindEvents();
        this.loadResponses();
    }

    loadCurrentPerformer() {
        // 実際の実装では、APIから現在評価中の芸人情報を取得
        // モックアップでは固定データを使用
        this.currentPerformer = {
            id: 'performer1',
            name: 'サンプル芸人A',
            genre: 'コント・漫才',
            order: 1
        };
        
        this.updatePerformerDisplay();
    }

    updatePerformerDisplay() {
        if (this.currentPerformer) {
            document.getElementById('surveyLiveName').textContent = 'サンプルライブ';
            document.querySelector('.current-performer-info h3').textContent = this.currentPerformer.name;
            document.querySelector('.current-performer-info p').textContent = this.currentPerformer.genre;
        }
    }

    loadResponses() {
        // ローカルストレージから過去の回答を読み込み
        const saved = localStorage.getItem(`survey_${this.liveId}`);
        if (saved) {
            this.responses = JSON.parse(saved);
        }
        
        // 現在の芸人に対する回答があるかチェック
        if (this.currentPerformer && this.hasResponseForPerformer(this.currentPerformer.id)) {
            this.showAlreadyRated();
        }
    }

    hasResponseForPerformer(performerId) {
        return this.responses.some(response => response.performerId === performerId);
    }

    bindEvents() {
        // 星評価のイベント
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.addEventListener('click', () => this.setRating(index + 1));
            star.addEventListener('mouseenter', () => this.previewRating(index + 1));
            star.addEventListener('mouseleave', () => this.resetPreview());
        });

        // コメント文字数カウント
        const commentTextarea = document.getElementById('comment');
        if (commentTextarea) {
            commentTextarea.addEventListener('input', this.updateCharCount);
        }

        // フォーム送信
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitRating());
        }

        // 自動更新チェック
        this.startAutoRefresh();
    }

    setRating(rating) {
        this.currentRating = rating;
        this.updateStarDisplay();
        this.updateRatingText();
        this.toggleSubmitButton();
    }

    previewRating(rating) {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.classList.toggle('active', index < rating);
        });
    }

    resetPreview() {
        this.updateStarDisplay();
    }

    updateStarDisplay() {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.classList.toggle('active', index < this.currentRating);
        });
    }

    updateRatingText() {
        const ratingTexts = [
            '',
            '★ いまいち',
            '★★ 普通',
            '★★★ 面白い',
            '★★★★ とても面白い',
            '★★★★★ 最高！'
        ];
        
        document.getElementById('ratingText').textContent = ratingTexts[this.currentRating];
    }

    updateCharCount() {
        const textarea = document.getElementById('comment');
        const charCount = document.getElementById('charCount');
        if (textarea && charCount) {
            const count = textarea.value.length;
            charCount.textContent = count;
            
            // 文字数制限の視覚的フィードバック
            if (count > 200) {
                charCount.style.color = '#dc3545';
                textarea.value = textarea.value.substring(0, 200);
                charCount.textContent = '200';
            } else {
                charCount.style.color = '#6c757d';
            }
        }
    }

    toggleSubmitButton() {
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = this.currentRating === 0;
        }
    }

    submitRating() {
        if (this.currentRating === 0) {
            alert('評価を選択してください。');
            return;
        }

        const comment = document.getElementById('comment').value;
        
        // 回答データを作成
        const response = {
            liveId: this.liveId,
            performerId: this.currentPerformer.id,
            performerName: this.currentPerformer.name,
            rating: this.currentRating,
            comment: comment.trim(),
            timestamp: new Date().toISOString()
        };

        // ローカルストレージに保存
        this.responses.push(response);
        localStorage.setItem(`survey_${this.liveId}`, JSON.stringify(this.responses));

        // 実際の実装では、ここでAPIにデータを送信
        console.log('送信するデータ:', response);

        // 成功表示
        this.showSuccess();
    }

    showSuccess() {
        document.getElementById('surveyForm').style.display = 'none';
        document.getElementById('surveySuccess').style.display = 'block';
    }

    showAlreadyRated() {
        document.getElementById('surveyForm').style.display = 'none';
        document.getElementById('alreadyRated').style.display = 'block';
    }

    showComplete() {
        document.getElementById('surveyForm').style.display = 'none';
        document.getElementById('surveySuccess').style.display = 'none';
        document.getElementById('alreadyRated').style.display = 'none';
        document.getElementById('surveyComplete').style.display = 'block';
    }

    checkForNextPerformer() {
        // 実際の実装では、APIで次の芸人がいるかチェック
        // モックアップでは簡単なシミュレーション
        const nextPerformers = [
            { id: 'performer2', name: 'サンプル芸人B', genre: '漫才', order: 2 },
            { id: 'performer3', name: 'サンプル芸人C', genre: 'ピン芸', order: 3 }
        ];
        
        const currentOrder = this.currentPerformer ? this.currentPerformer.order : 0;
        const nextPerformer = nextPerformers.find(p => p.order === currentOrder + 1);
        
        if (nextPerformer) {
            // 次の芸人がいる場合
            if (!this.hasResponseForPerformer(nextPerformer.id)) {
                this.currentPerformer = nextPerformer;
                this.currentRating = 0;
                document.getElementById('comment').value = '';
                this.updatePerformerDisplay();
                this.resetForm();
                document.getElementById('surveyForm').style.display = 'block';
                document.getElementById('surveySuccess').style.display = 'none';
                document.getElementById('alreadyRated').style.display = 'none';
            } else {
                // 既に評価済み
                this.currentPerformer = nextPerformer;
                this.updatePerformerDisplay();
                this.showAlreadyRated();
            }
        } else {
            // 全ての芸人の評価が完了
            this.showComplete();
        }
    }

    resetForm() {
        this.currentRating = 0;
        this.updateStarDisplay();
        this.updateRatingText();
        this.toggleSubmitButton();
        this.updateCharCount();
    }

    startAutoRefresh() {
        // 30秒ごとに現在の芸人情報をチェック（実際の実装用）
        setInterval(() => {
            // 実際の実装では、APIで現在の芸人情報を取得して更新
            console.log('自動更新チェック...');
        }, 30000);
    }
}

// グローバル関数（HTML内のonclick用）
function submitRating() {
    surveyApp.submitRating();
}

function checkForNextPerformer() {
    surveyApp.checkForNextPerformer();
}

// アプリケーション開始
let surveyApp;

document.addEventListener('DOMContentLoaded', function() {
    surveyApp = new SurveyApp();
    
    // ページを離れる前の確認（評価途中の場合）
    window.addEventListener('beforeunload', function(e) {
        if (surveyApp.currentRating > 0 && document.getElementById('surveyForm').style.display !== 'none') {
            e.preventDefault();
            e.returnValue = '評価を送信していません。ページを離れますか？';
            return e.returnValue;
        }
    });
    
    // ページの可視性が変わった時の処理（タブ切り替えなど）
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            // ページが再度表示された時、最新の芸人情報をチェック
            console.log('ページが再表示されました。最新情報をチェック中...');
        }
    });
});

// デバッグ用：ローカルストレージをクリア
function clearSurveyData() {
    if (confirm('保存されているアンケートデータを全て削除しますか？')) {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('survey_')) {
                localStorage.removeItem(key);
            }
        });
        alert('アンケートデータを削除しました。ページを再読み込みします。');
        location.reload();
    }
}

// スワイプジェスチャー対応（モバイル用）
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // 水平方向のスワイプの方が大きい場合
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > 50) { // 50px以上のスワイプ
            if (diffX > 0) {
                // 左スワイプ
                console.log('左スワイプ検出');
            } else {
                // 右スワイプ
                console.log('右スワイプ検出');
            }
        }
    }
    
    touchStartX = 0;
    touchStartY = 0;
});