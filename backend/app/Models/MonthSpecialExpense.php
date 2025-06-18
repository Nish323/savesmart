<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthSpecialExpense extends Model
{
    protected $table = 'month_special_expenses';

    protected $fillable = [
        'user_id',
        'year',
        'month',
        'special_category_id',
        'expense_total',
    ];

    protected $with = [
        'specialCategory',
    ];

    protected $appends = [
        'special_category_color',
        'special_category_name',
        'special_category_icon',
    ];

    public static function getMonthSpecialExpense($userId, $year, $month, $specialCategoryId)
    {
        return self::where('user_id', $userId)
            ->where('year', $year)
            ->where('month', $month)
            ->where('special_category_id', $specialCategoryId)
            ->first();
    }

    public static function addMonthSpecialExpense($userId, $year, $month, $specialCategoryId, $expense)
    {
        // 月ごとの特別カテゴリー支出を取得または作成
        $monthSpecialExpense = self::firstOrCreate(
            ['user_id' => $userId, 'year' => $year, 'month' => $month, 'special_category_id' => $specialCategoryId],
        );
        // 支出の合計を更新
        $monthSpecialExpense->expense_total += $expense;
        $monthSpecialExpense->save();
    }

    public static function deleteMonthSpecialExpense($userId, $year, $month, $specialCategoryId, $expense)
    {
        // 月ごとの特別カテゴリー支出を取得
        $monthSpecialExpense = self::getMonthSpecialExpense($userId, $year, $month, $specialCategoryId);
        if ($monthSpecialExpense) {
            // 支出の合計を更新
            $monthSpecialExpense->expense_total -= $expense;
            // 支出が0以下になった場合は削除
            if ($monthSpecialExpense->expense_total <= 0) {
                $monthSpecialExpense->delete();
            } else {
                $monthSpecialExpense->save();
            }
        }
    }

    public static function updateMonthSpecialExpense($userId, $year, $month, $pastYear, $pastMonth, $currentCategoryId, $pastCategoryId, $currentExpense, $pastExpense)
    {
        self::deleteMonthSpecialExpense($userId, $pastYear, $pastMonth, $pastCategoryId, $pastExpense);
        self::addMonthSpecialExpense($userId, $year, $month, $currentCategoryId, $currentExpense);
    }

    public function specialCategory()
    {
        return $this->belongsTo(SpecialCategory::class, 'special_category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getSpecialCategoryNameAttribute(): ?string
    {
        return $this->specialCategory?->name;
    }

    public function getSpecialCategoryColorAttribute(): ?string
    {
        return $this->specialCategory?->color;
    }

    public function getSpecialCategoryIconAttribute(): ?string
    {
        return $this->specialCategory?->icon;
    }

    public static function getAllMonthSpecialExpense($userId, $year, $month)
    {
        return self::where('user_id', $userId)
            ->where('year', $year)
            ->where('month', $month)
            ->get();
    }
}
