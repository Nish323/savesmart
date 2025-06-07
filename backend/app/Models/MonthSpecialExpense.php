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

    public function specialCategory()
    {
        return $this->belongsTo(SpecialCategory::class, 'special_category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
