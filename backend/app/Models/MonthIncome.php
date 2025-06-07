<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthIncome extends Model
{
    protected $fillable = [
        'user_id',
        'year',
        'month',
        'income_total',
    ];

    public static function addMonthIncome($userId, $year, $month, $income)
    {
        // 月ごとの収入を取得または作成
        $monthIncome = self::firstOrCreate(
            ['user_id' => $userId, 'year' => $year, 'month' => $month],
        );
        // 収入の合計を更新
        $monthIncome->income_total += $income;
        $monthIncome->save();
    }

}
