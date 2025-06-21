<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Saving;
use Illuminate\Support\Facades\Auth;
use App\Models\MonthIncome;
use App\Models\MonthExpense;
use App\Models\MonthNormalExpense;
use App\Models\MonthSpecialExpense;
use App\Models\MonthEmotionExpense;
use App\Models\Expense;
use App\Models\AiAdvice;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getData()
    {
        // ユーザーのIDを取得
        $userId = Auth::user()->id;
        // 日付の取得
        $currentYear = date('Y');
        $currentMonth = date('m');
        // 各データの取得
        $savings = Saving::get6MonthsSavings($userId);      
        $monthIncomes = MonthIncome::get2MonthsIncomes($userId, $currentYear, $currentMonth);
        $monthExpenses = MonthExpense::get6MonthsExpenses($userId, $currentYear, $currentMonth);
        $monthNormalExpenses = MonthNormalExpense::getAllMonthNormalExpense($userId, $currentYear, $currentMonth);
        $monthSpecialExpenses = MonthSpecialExpense::getAll6MonthsSpecialExpense($userId, $currentYear, $currentMonth);
        $monthEmotionExpenses = MonthEmotionExpense::getAllMonthEmotionExpense($userId, $currentYear, $currentMonth);
        $currentMonthExpenses = Expense::getCurrentMonthExpenses($userId, $currentYear, $currentMonth);
        
        // 最新のAIアドバイスを取得
        $aiAdvice = AiAdvice::getLatestAdvice($userId);

        return response()->json([
            'savings' => $savings,
            'monthIncomes' => $monthIncomes,
            'monthExpenses' => $monthExpenses,
            'monthNormalExpenses' => $monthNormalExpenses,
            'monthSpecialExpenses' => $monthSpecialExpenses,
            'monthEmotionExpenses' => $monthEmotionExpenses,
            'currentMonthExpenses' => $currentMonthExpenses,
            'aiAdvice' => $aiAdvice,
        ]);
    }

    public function analyze(Request $request)
    {
        // ユーザーのIDを取得
        $userId = Auth::user()->id;
        // 日付の取得
        $currentYear = date('Y');
        $currentMonth = date('m');
        $currentDay = date('d');
        
        // 分析に必要なデータを取得
        $savings = Saving::getSaving($userId, $currentYear, $currentMonth);
        $monthIncomes = MonthIncome::getMonthIncome($userId, $currentYear, $currentMonth);
        $monthExpenses = MonthExpense::getMonthExpense($userId, $currentYear, $currentMonth);
        $monthNormalExpenses = MonthNormalExpense::getAllMonthNormalExpense($userId, $currentYear, $currentMonth);
        $monthSpecialExpenses = MonthSpecialExpense::getAllMonthSpecialExpense($userId, $currentYear, $currentMonth);
        $monthEmotionExpenses = MonthEmotionExpense::getAllMonthEmotionExpense($userId, $currentYear, $currentMonth);
        $currentMonthExpenses = Expense::getCurrentMonthExpenses($userId, $currentYear, $currentMonth);
        
        // データを整形してプロンプトを作成
        $prompt = $this->createAnalysisPrompt($savings, $monthIncomes, $monthExpenses, $monthNormalExpenses, $monthSpecialExpenses, $monthEmotionExpenses, $currentMonthExpenses);
        
        // Gemini APIを呼び出す
        $apiKey = config('services.gemini.api_key');
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key={$apiKey}", [
            "contents" => [
                [
                    "parts" => [
                        ["text" => $prompt]
                    ]
                ]
            ],
            "generationConfig" => [
                "temperature" => 0.7,
                "maxOutputTokens" => 2048
            ]
        ]);
        
        // レスポンス処理
        try {
            $result = $response->json();
            $advice = $result['candidates'][0]['content']['parts'][0]['text'] ?? '分析結果を生成できませんでした。';
            
            // AIアドバイスをデータベースに保存
            $aiAdvice = AiAdvice::updateOrCreate(
                ['user_id' => $userId], // この条件でレコードを検索
                [
                    'advice'     => $advice, // 以下の内容でデータを更新または作成
                    'adviced_at' => "{$currentYear}-{$currentMonth}-{$currentDay} 00:00:00" // 日付は現在の年月日に設定
                ]
            );

            return response()->json([
                'success' => true,
                'advice' => $aiAdvice
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'AIアドバイスの生成中にエラーが発生しました: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * 収支データを分析するためのプロンプトを作成
     *
     * @param array $savings 貯金データ
     * @param array $monthIncomes 月収データ
     * @param array $monthExpenses 月支出データ
     * @param array $monthNormalExpenses 通常カテゴリーの月支出データ
     * @param array $monthSpecialExpenses 特別カテゴリーの月支出データ
     * @param array $monthEmotionExpenses 感情カテゴリーの月支出データ
     * @param array $currentMonthExpenses 現在の月の支出データ
     * @return string
     */
    private function createAnalysisPrompt($savings, $monthIncomes, $monthExpenses, $monthNormalExpenses, $monthSpecialExpenses, $monthEmotionExpenses, $currentMonthExpenses)
    {
        // 現在の年月を取得
        $currentYear = date('Y');
        $currentMonth = date('m');
        
        // 基本プロンプト
        $prompt = "あなたはプロのファイナンシャル・アドバイザーです。以下の私の今月の収支データを分析し、私の金銭感覚の強み、弱み、そして来月以降に実行すべき具体的な改善アクションを3つ提案してください。また、私は既に家計簿アプリを使用しています。\n\n";
        
        // 今月の貯金データの追加
        $prompt .= "【今月の貯金データ】\n";
        $currentSaving = collect($savings)->where('year', $currentYear)->where('month', $currentMonth)->first();
        if ($currentSaving) {
            $prompt .= "{$currentSaving['year']}年{$currentSaving['month']}月: {$currentSaving['amount']}円\n";
        } else {
            $prompt .= "今月の貯金データはありません。\n";
        }
        $prompt .= "\n";
        
        // 今月の収入データの追加
        $prompt .= "【今月の収入データ】\n";
        $currentIncome = collect($monthIncomes)->where('year', $currentYear)->where('month', $currentMonth)->first();
        if ($currentIncome) {
            $prompt .= "{$currentIncome['year']}年{$currentIncome['month']}月: {$currentIncome['incomeTotal']}円\n";
        } else {
            $prompt .= "今月の収入データはありません。\n";
        }
        $prompt .= "\n";
        
        // 今月の支出データの追加
        $prompt .= "【今月の支出データ】\n";
        $currentExpense = collect($monthExpenses)->where('year', $currentYear)->where('month', $currentMonth)->first();
        if ($currentExpense) {
            $prompt .= "{$currentExpense['year']}年{$currentExpense['month']}月: {$currentExpense['expenseTotal']}円\n";
        } else {
            $prompt .= "今月の支出データはありません。\n";
        }
        $prompt .= "\n";
        
        // 今月のカテゴリー別支出データの追加
        $prompt .= "【今月のカテゴリー別支出データ】\n";
        foreach ($monthNormalExpenses as $expense) {
            $prompt .= "{$expense['normalCategoryName']}: {$expense['expenseTotal']}円\n";
        }
        $prompt .= "\n";
        
        // 今月の特別カテゴリー別支出データの追加
        $prompt .= "【今月の特別カテゴリー別支出データ】\n";
        $currentSpecialExpenses = collect($monthSpecialExpenses)->where('year', $currentYear)->where('month', $currentMonth);
        if ($currentSpecialExpenses->count() > 0) {
            foreach ($currentSpecialExpenses as $expense) {
                $prompt .= "{$expense['specialCategoryName']}: {$expense['expenseTotal']}円\n";
            }
        } else {
            $prompt .= "今月の特別カテゴリー別支出データはありません。\n";
        }
        $prompt .= "\n";
        
        // 今月の感情カテゴリー別支出データの追加
        $prompt .= "【今月の感情カテゴリー別支出データ】\n";
        foreach ($monthEmotionExpenses as $expense) {
            $prompt .= "{$expense['emotionCategoryName']}: {$expense['expenseTotal']}円\n";
        }
        $prompt .= "\n";
        
        // 今月の支出詳細の追加
        $prompt .= "【今月の主な支出（上位10件）】\n";
        if (count($currentMonthExpenses) > 0) {
            $sortedExpenses = collect($currentMonthExpenses)->sortByDesc('amount')->take(10);
            foreach ($sortedExpenses as $expense) {
                $date = date('n/j', strtotime($expense['date']));
                $category = $expense['normalCategoryName'] ?? '未分類';
                $emotion = $expense['emotionCategoryName'] ?? '未分類';
                $special = $expense['specialCategoryName'] ?? '未分類';
                $prompt .= "{$date} {$expense['description']} {$expense['amount']}円 (カテゴリ: {$category}, 感情: {$emotion}, 特別: {$special})\n";
            }
        } else {
            $prompt .= "今月の支出データはありません。\n";
        }
        $prompt .= "\n";
        
        // 分析指示の追加
        $prompt .= "以上のデータを分析して、以下の内容を含むアドバイスを作成してください：\n";
        $prompt .= "1. 私の支出パターンの特徴と傾向\n";
        $prompt .= "2. 金銭管理における強みと弱み\n";
        $prompt .= "3. 改善すべき点と具体的なアクション（3つ）\n";
        $prompt .= "4. 貯金を増やすための具体的なアドバイス\n\n";
        $prompt .= "回答は日本語で、わかりやすく具体的に、箇条書きも活用して作成してください。";
        
        return $prompt;
    }
}
