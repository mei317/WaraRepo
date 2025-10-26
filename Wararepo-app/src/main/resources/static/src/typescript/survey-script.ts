// アンケート用スクリプト

// 型定義
interface CurrentPerformer {
    id: string;
    name: string;
    genre: string;
    order: number;
}

interface SurveyResponse {
    liveId: string;
    performerId: string;
    performerName: string;
    rating: number;
    comment: string;
    timestamp: string;
}

// グローバル変数の型定義
declare global {
    interface Window {
        surveyApp: SurveyApp;
    }
}

// モジュールとして扱う
export {};

class SurveyApp {
    private currentRating: number = 0;
    private liveId: string | null = null;
    private currentPerformer: CurrentPerformer | null = null;
    private responses: SurveyResponse[] = [];

    constructor() {
        this.init();
    }

    private init(): void {
        // URLからライブIDを取得
        this.liveId = new URLSearchParams(window.location.search).get('liveId') || 'sample';
        this.loadCurrentPerformer();
        this.bindEvents();
        this.loadResponses();
    }

    private loadCurrentPerformer(): void {
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

    private updatePerformerDisplay(): void {
        if (this.currentPerformer) {
            const liveNameElement = document.getElementById('surveyLiveName');
            if (liveNameElement) {
                liveNameElement.textContent = 'サンプルライブ';
            }

            const performerNameElement = document.querySelector('.current-performer-info h3');
            if (performerNameElement) {
                performerNameElement.textContent = this.currentPerformer.name;
            }

            const performerGenreElement = document.querySelector('.current-performer-info p');
            if (performerGenreElement) {
                performerGenreElement.textContent = this.currentPerformer.genre;
            }
        }
    }

    private loadResponses(): void {
        // ローカルストレージから過去の回答を読み込み
        const saved = localStorage.getItem(`survey_${this.liveId}`);
        if (saved) {
            this.responses = JSON.parse(saved) as SurveyResponse[];
        }

        // 現在の芸人に対する回答があるかチェック
        if (this.currentPerformer && this.hasResponseForPerformer(this.currentPerformer.id)) {
            this.showAlreadyRated();
        }
    }

    private hasResponseForPerformer(performerId: string): boolean {
        return this.responses.some(response => response.performerId === performerId);
    }

    private bindEvents(): void {
        // 星評価のイベント
        const stars = document.querySelectorAll<HTMLButtonElement>('.star');
        stars.forEach((star, index) => {
            star.addEventListener('click', () => this.setRating(index + 1));
            star.addEventListener('mouseenter', () => this.previewRating(index + 1));
            star.addEventListener('mouseleave', () => this.resetPreview());
        });

        // コメント文字数カウント
        const commentTextarea = document.getElementById('comment') as HTMLTextAreaElement | null;
        if (commentTextarea) {
            commentTextarea.addEventListener('input', () => this.updateCharCount());
        }

        // data-action属性を使ったイベント委譲
        document.addEventListener('click', (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const actionElement = target.closest('[data-action]') as HTMLElement;

            if (actionElement) {
                const action = actionElement.getAttribute('data-action');
                this.handleAction(action, e);
            }
        });

        // 自動更新チェック
        this.startAutoRefresh();
    }

    private handleAction(action: string | null, e: MouseEvent): void {
        if (!action) return;

        switch (action) {
            case 'submit-rating':
                e.preventDefault();
                this.submitRating();
                break;
            case 'check-next-performer':
                e.preventDefault();
                this.checkForNextPerformer();
                break;
            case 'clear-survey-data':
                e.preventDefault();
                this.clearSurveyData();
                break;
        }
    }

    private setRating(rating: number): void {
        this.currentRating = rating;
        this.updateStarDisplay();
        this.updateRatingText();
        this.toggleSubmitButton();
    }

    private previewRating(rating: number): void {
        const stars = document.querySelectorAll<HTMLButtonElement>('.star');
        stars.forEach((star, index) => {
            star.classList.toggle('active', index < rating);
        });
    }

    private resetPreview(): void {
        this.updateStarDisplay();
    }

    private updateStarDisplay(): void {
        const stars = document.querySelectorAll<HTMLButtonElement>('.star');
        stars.forEach((star, index) => {
            star.classList.toggle('active', index < this.currentRating);
        });
    }

    private updateRatingText(): void {
        const ratingTexts: string[] = [
            '',
            '★ いまいち',
            '★★ 普通',
            '★★★ 面白い',
            '★★★★ とても面白い',
            '★★★★★ 最高！'
        ];

        const ratingTextElement = document.getElementById('ratingText');
        if (ratingTextElement) {
            ratingTextElement.textContent = ratingTexts[this.currentRating];
        }
    }

    private updateCharCount(): void {
        const textarea = document.getElementById('comment') as HTMLTextAreaElement | null;
        const charCount = document.getElementById('charCount');

        if (textarea && charCount) {
            const count = textarea.value.length;
            charCount.textContent = count.toString();

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

    private toggleSubmitButton(): void {
        const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement | null;
        if (submitBtn) {
            submitBtn.disabled = this.currentRating === 0;
        }
    }

    public submitRating(): void {
        if (this.currentRating === 0) {
            alert('評価を選択してください。');
            return;
        }

        const commentElement = document.getElementById('comment') as HTMLTextAreaElement;
        const comment = commentElement.value;

        if (!this.currentPerformer || !this.liveId) {
            alert('エラーが発生しました。');
            return;
        }

        // 回答データを作成
        const response: SurveyResponse = {
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

    private showSuccess(): void {
        const surveyForm = document.getElementById('surveyForm');
        const surveySuccess = document.getElementById('surveySuccess');

        if (surveyForm) {
            surveyForm.style.display = 'none';
        }
        if (surveySuccess) {
            surveySuccess.style.display = 'block';
        }
    }

    private showAlreadyRated(): void {
        const surveyForm = document.getElementById('surveyForm');
        const alreadyRated = document.getElementById('alreadyRated');

        if (surveyForm) {
            surveyForm.style.display = 'none';
        }
        if (alreadyRated) {
            alreadyRated.style.display = 'block';
        }
    }

    private showComplete(): void {
        const surveyForm = document.getElementById('surveyForm');
        const surveySuccess = document.getElementById('surveySuccess');
        const alreadyRated = document.getElementById('alreadyRated');
        const surveyComplete = document.getElementById('surveyComplete');

        if (surveyForm) {
            surveyForm.style.display = 'none';
        }
        if (surveySuccess) {
            surveySuccess.style.display = 'none';
        }
        if (alreadyRated) {
            alreadyRated.style.display = 'none';
        }
        if (surveyComplete) {
            surveyComplete.style.display = 'block';
        }
    }

    public checkForNextPerformer(): void {
        // 実際の実装では、APIで次の芸人がいるかチェック
        // モックアップでは簡単なシミュレーション
        const nextPerformers: CurrentPerformer[] = [
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
                const commentElement = document.getElementById('comment') as HTMLTextAreaElement;
                if (commentElement) {
                    commentElement.value = '';
                }
                this.updatePerformerDisplay();
                this.resetForm();

                const surveyForm = document.getElementById('surveyForm');
                const surveySuccess = document.getElementById('surveySuccess');
                const alreadyRated = document.getElementById('alreadyRated');

                if (surveyForm) {
                    surveyForm.style.display = 'block';
                }
                if (surveySuccess) {
                    surveySuccess.style.display = 'none';
                }
                if (alreadyRated) {
                    alreadyRated.style.display = 'none';
                }
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

    private resetForm(): void {
        this.currentRating = 0;
        this.updateStarDisplay();
        this.updateRatingText();
        this.toggleSubmitButton();
        this.updateCharCount();
    }

    private startAutoRefresh(): void {
        // 30秒ごとに現在の芸人情報をチェック（実際の実装用）
        setInterval(() => {
            // 実際の実装では、APIで現在の芸人情報を取得して更新
            console.log('自動更新チェック...');
        }, 30000);
    }

    // デバッグ用：ローカルストレージをクリア
    private clearSurveyData(): void {
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
}

// アプリケーション開始
document.addEventListener('DOMContentLoaded', function(): void {
    window.surveyApp = new SurveyApp();

    // ページを離れる前の確認（評価途中の場合）
    window.addEventListener('beforeunload', function(e: BeforeUnloadEvent): string | undefined {
        const surveyForm = document.getElementById('surveyForm');
        if (window.surveyApp && surveyForm && surveyForm.style.display !== 'none') {
            e.preventDefault();
            const message = '評価を送信していません。ページを離れますか？';
            e.returnValue = message;
            return message;
        }
    });

    // ページの可視性が変わった時の処理（タブ切り替えなど）
    document.addEventListener('visibilitychange', function(): void {
        if (!document.hidden) {
            // ページが再度表示された時、最新の芸人情報をチェック
            console.log('ページが再表示されました。最新情報をチェック中...');
        }
    });
});

// スワイプジェスチャー対応（モバイル用）
let touchStartX: number = 0;
let touchStartY: number = 0;

document.addEventListener('touchstart', function(e: TouchEvent): void {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e: TouchEvent): void {
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
