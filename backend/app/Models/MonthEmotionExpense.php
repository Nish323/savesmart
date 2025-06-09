<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthEmotionExpense extends Model
{
    protected $table = 'month_emotion_expenses';

    protected $fillable = [
        'user_id',
        'year',
        'month',
        'emotion_category_id',
        'expense_total',
    ];

    public static function addMonthEmotionExpense($userId, $year, $month, $emotionCategoryId, $expense)
    {
        // 月ごとの感情カテゴリー支出を取得または作成
        $monthEmotionExpense = self::firstOrCreate(
            ['user_id' => $userId, 'year' => $year, 'month' => $month, 'emotion_category_id' => $emotionCategoryId],
        );
        // 支出の合計を更新
        $monthEmotionExpense->expense_total += $expense;
        $monthEmotionExpense->save();
    }

    public static function getMonthEmotionExpense($userId, $year, $month, $emotionCategoryId)
    {
        return self::where('user_id', $userId)
            ->where('year', $year)
            ->where('month', $month)
            ->where('emotion_category_id', $emotionCategoryId)
            ->first();
    }

    public static function updateMonthEmotionExpense($userId, $year, $month, $currentCategoryId, $pastCategoryId, $currentExpense, $pastExpense)
    {
        $pastMonthEmotionExpense = self::getMonthEmotionExpense($userId, $year, $month, $pastCategoryId);
        // 支出の合計を更新
        $pastMonthEmotionExpense->expense_total -= $pastExpense;
        $pastMonthEmotionExpense->save();

        // 新しいカテゴリーの支出を追加
        $currentMonthEmotionExpense = self::getMonthEmotionExpense($userId, $year, $month, $currentCategoryId);
        if ($currentMonthEmotionExpense) {
            // 支出合計を更新
            $currentMonthEmotionExpense->expense_total += $currentExpense;
            $currentMonthEmotionExpense->save();
        } else {
            // 存在しない場合は新規作成
            self::addMonthEmotionExpense($userId, $year, $month, $currentCategoryId, $currentExpense);
        }
    }

    public function emotionCategory()
    {
        return $this->belongsTo(EmotionCategory::class, 'emotion_category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
