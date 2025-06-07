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

    public function emotionCategory()
    {
        return $this->belongsTo(EmotionCategory::class, 'emotion_category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
