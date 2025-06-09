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

    public static function updateMonthNormalExpense($userId, $year, $month, $currentCategoryId, $pastCategoryId, $currentExpense, $pastExpense)
    {
        $pastMonthNormalExpense = self::getMonthNormalExpense($userId, $year, $month, $pastCategoryId);
        // 支出の合計を更新
        $pastMonthNormalExpense->expense_total -= $pastExpense;
        $pastMonthNormalExpense->save();

        // 新しいカテゴリーの支出を追加
        $currentMonthNormalExpense = self::getMonthNormalExpense($userId, $year, $month, $currentCategoryId);
        if ($currentMonthNormalExpense) {
            // 支出合計を更新
            $currentMonthNormalExpense->expense_total += $currentExpense;
            $currentMonthNormalExpense->save();
        } else {
            // 存在しない場合は新規作成
            self::addMonthNormalExpense($userId, $year, $month, $currentCategoryId, $currentExpense);
        }
    }

    public function normalCategory()
    {
        return $this->belongsTo(NormalCategory::class, 'normal_category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
