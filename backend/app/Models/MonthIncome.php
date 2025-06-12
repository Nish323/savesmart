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

    public static function getMonthIncome($userId, $year, $month)
    {
        // 月ごとの収入を取得
        $monthIncome = self::firstOrCreate(
            ['user_id' => $userId, 'year' => $year, 'month' => $month],
        );
        return $monthIncome;
    }

    public static function updateMonthIncome($userId, $year, $month, $currentIncome, $pastIncome)
    {
        // 月ごとの収入を取得
        $monthIncome = self::getMonthIncome($userId, $year, $month);
        if ($monthIncome) {
            // 収入の合計を更新
            $monthIncome->income_total += $currentIncome - $pastIncome;
            $monthIncome->save();
        } else {
            // 存在しない場合は新規作成
            self::addMonthIncome($userId, $year, $month, $income);
        }
    }

    public static function deleteMonthIncome($userId, $year, $month, $income)
    {
        // 月ごとの収入を取得
        $monthIncome = self::getMonthIncome($userId, $year, $month);
        if ($monthIncome) {
            // 収入の合計を更新
            $monthIncome->income_total -= $income;
            // 収入が0以下になった場合は削除
            if ($monthIncome->income_total <= 0) {
                $monthIncome->delete();
            } else {
                $monthIncome->save();
            }
        }
    }
}
