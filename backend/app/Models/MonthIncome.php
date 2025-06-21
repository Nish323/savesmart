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

    public static function get2MonthsIncomes($userId, $year, $month)
    {
        // 2ヶ月分の収入を取得
        $monthIncomes = self::where('user_id', $userId)
            ->where(function ($query) use ($year, $month) {
                $query->where('year', $year)
                      ->where('month', $month)
                      ->orWhere(function ($query) use ($year, $month) {
                          $query->where('year', $year)
                                ->where('month', $month - 1);
                      });
            })
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get();
        return $monthIncomes;
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

    public static function updateMonthIncome($userId, $year, $month, $pastYear, $pastMonth, $currentIncome, $pastIncome)
    {
        // 月ごとの収入を取得
        self::deleteMonthIncome($userId, $pastYear, $pastMonth, $pastIncome);
        self::addMonthIncome($userId, $year, $month, $currentIncome);
    }

    public static function getMonthIncome($userId, $year, $month)
    {
        // 月ごとの収入を取得
        return self::where('user_id', $userId)
            ->where('year', $year)
            ->where('month', $month)
            ->get();
    }
}
