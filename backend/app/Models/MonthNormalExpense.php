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

    public function normalCategory()
    {
        return $this->belongsTo(NormalCategory::class, 'normal_category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
