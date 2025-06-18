<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthEmotionExpense extends Model
{
    protected $table = 'month_emotion_expenses';

    protected $with = [
        'emotionCategory',
    ];

    protected $appends = [
        'emotion_category_color',
        'emotion_category_name',
        'emotion_category_icon',
    ];

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
        // 月ごとの感情カテゴリー支出を取得
        $monthEmotionExpense = self::firstOrCreate(
            ['user_id' => $userId, 'year' => $year, 'month' => $month, 'emotion_category_id' => $emotionCategoryId],
        );
        return $monthEmotionExpense;
    }

    public static function deleteMonthEmotionExpense($userId, $year, $month, $emotionCategoryId, $expense)
    {
        // 月ごとの感情カテゴリー支出を取得
        $monthEmotionExpense = self::getMonthEmotionExpense($userId, $year, $month, $emotionCategoryId);
        if ($monthEmotionExpense) {
            // 支出の合計を更新
            $monthEmotionExpense->expense_total -= $expense;
            // 支出が0以下になった場合は削除
            if ($monthEmotionExpense->expense_total <= 0) {
                $monthEmotionExpense->delete();
            } else {
                $monthEmotionExpense->save();
            }
        }
    }

    public static function updateMonthEmotionExpense($userId, $year, $month, $pastYear, $pastMonth, $currentCategoryId, $pastCategoryId, $currentExpense, $pastExpense)
    {
        self::deleteMonthEmotionExpense($userId, $pastYear, $pastMonth, $pastCategoryId, $pastExpense);
        self::addMonthEmotionExpense($userId, $year, $month, $currentCategoryId, $currentExpense);
    }

    public function emotionCategory()
    {
        return $this->belongsTo(EmotionCategory::class, 'emotion_category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getEmotionCategoryColorAttribute(): ?string
    {
        return $this->emotionCategory?->color;
    }

    public function getEmotionCategoryNameAttribute(): ?string
    {
        return $this->emotionCategory?->name;
    }

    public function getEmotionCategoryIconAttribute(): ?string
    {
        return $this->emotionCategory?->icon;
    }

    public static function getAllMonthEmotionExpense($userId, $year, $month)
    {
        // ユーザーの特定の年月の感情カテゴリー支出を取得
        return self::where('user_id', $userId)
            ->where('year', $year)
            ->where('month', $month)
            ->get();
    }
}
