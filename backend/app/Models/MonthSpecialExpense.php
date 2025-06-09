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

    public static function updateMonthSpecialExpense($userId, $year, $month, $currentCategoryId, $pastCategoryId, $currentExpense, $pastExpense)
    {
        $pastMonthSpecialExpense = self::getMonthSpecialExpense($userId, $year, $month, $pastCategoryId);
        // 支出の合計を更新
        $pastMonthSpecialExpense->expense_total -= $pastExpense;
        $pastMonthSpecialExpense->save();

        // 新しいカテゴリーの支出を追加
        $currentMonthSpecialExpense = self::getMonthSpecialExpense($userId, $year, $month, $currentCategoryId);
        if ($currentMonthSpecialExpense) {
            // 支出合計を更新
            $currentMonthSpecialExpense->expense_total += $currentExpense;
            $currentMonthSpecialExpense->save();
        } else {
            // 存在しない場合は新規作成
            self::addMonthSpecialExpense($userId, $year, $month, $currentCategoryId, $currentExpense);
        }
    }

    public function specialCategory()
    {
        return $this->belongsTo(SpecialCategory::class, 'special_category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
