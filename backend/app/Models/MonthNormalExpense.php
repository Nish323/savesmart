<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthNormalExpense extends Model
{
    protected $table = 'month_normal_expenses';

    protected $fillable = [
        'user_id',
        'year',
        'month',
        'normal_category_id',
        'expense_total',
    ];

    protected $with = [
        'normalCategory.color',
        'normalCategory',
    ];

    protected $appends = [
        'normal_category_color',
        'normal_category_name',
    ];

    public static function getMonthNormalExpense($userId, $year, $month, $normalCategoryId)
    {
        return self::where('user_id', $userId)
            ->where('year', $year)
            ->where('month', $month)
            ->where('normal_category_id', $normalCategoryId)
            ->first();
    }

    public static function addMonthNormalExpense($userId, $year, $month, $normalCategoryId, $expense)
    {
        // 月ごとの通常カテゴリー支出を取得または作成
        $monthNormalExpense = self::firstOrCreate(
            ['user_id' => $userId, 'year' => $year, 'month' => $month, 'normal_category_id' => $normalCategoryId],
        );
        // 支出の合計を更新
        $monthNormalExpense->expense_total += $expense;
        $monthNormalExpense->save();
    }

    public static function deleteMonthNormalExpense($userId, $year, $month, $normalCategoryId, $expense)
    {
        // 月ごとの通常カテゴリー支出を取得
        $monthNormalExpense = self::getMonthNormalExpense($userId, $year, $month, $normalCategoryId);
        if ($monthNormalExpense) {
            // 支出の合計を更新
            $monthNormalExpense->expense_total -= $expense;
            // 支出が0以下になった場合は削除
            if ($monthNormalExpense->expense_total <= 0) {
                $monthNormalExpense->delete();
            } else {
                // 変更を保存
                $monthNormalExpense->save();
            }
        }
    }

    public static function updateMonthNormalExpense($userId, $year, $month, $pastYear, $pastMonth, $currentCategoryId, $pastCategoryId, $currentExpense, $pastExpense)
    {
        self::deleteMonthNormalExpense($userId, $pastYear, $pastMonth, $pastCategoryId, $pastExpense);
        self::addMonthNormalExpense($userId, $year, $month, $currentCategoryId, $currentExpense);
    }



    public function normalCategory()
    {
        return $this->belongsTo(NormalCategory::class, 'normal_category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getNormalCategoryColorAttribute(): ?string
    {
        return $this->normalCategory?->color?->color;
    }

    public function getNormalCategoryNameAttribute(): ?string
    {
        return $this->normalCategory?->name;
    }

    public static function getAllMonthNormalExpense($userId, $year, $month)
    {
        return self::where('user_id', $userId)
            ->where('year', $year)
            ->where('month', $month)
            ->get();
    }
}
