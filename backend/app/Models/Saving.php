<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class Saving extends Model
{
    protected $fillable = [
        'user_id',
        'amount',
        'year',
        'month',
    ];

    public static function getSaving($userId, $year, $month)
    {
        // ユーザーの貯金情報を取得
        return self::where('user_id', $userId)
            ->where('year', $year)
            ->where('month', $month)
            ->first();
    }

    public static function subtractSaving($userId, $year, $month, $amount)
    {
        // === ステップ1: 間の月が存在しない場合に作成する ===
    
        // 処理範囲の開始日と、終点となる「今月」の日付を定義
        $startDate = Carbon::create($year, $month, 1);
        $currentMonthDate = Carbon::now()->startOfMonth();
    
        $endDate = $startDate->isAfter($currentMonthDate) ? $startDate : $currentMonthDate;
        
        // 基準となる「前の月」の残高を取得
        $prevDate = (clone $startDate)->subMonth();
        $lastKnownAmount = self::where('user_id', $userId)
                            ->where('year', $prevDate->year)
                            ->where('month', $prevDate->month)
                            ->value('amount') ?? 0;
    
        // 処理期間をループして、存在しない月を作成
        $period = CarbonPeriod::create($startDate, '1 month', $endDate);
        foreach ($period as $date) {
            // firstOrCreateを使い、なければ作成、あれば何もしない
            self::firstOrCreate(
                ['user_id' => $userId, 'year' => $date->year, 'month' => $date->month],
                ['amount' => $lastKnownAmount] // 新規作成時は前の月の残高を引き継ぐ
            );
            // 次のループのために、今処理した月の残高を取得し直す
            $lastKnownAmount = self::where('user_id', $userId)
                                ->where('year', 'year', $date->year)
                                ->where('month', 'month', $date->month)
                                ->value('amount');
        }
    
        // === ステップ2: 範囲内のすべての月の残高を一括で減算する ===
    
        return self::where('user_id', $userId)
            // 処理の開始日以降
            ->where(function ($q) use ($startDate) {
                $q->where('year', '>', $startDate->year)
                  ->orWhere(function ($q) use ($startDate) {
                      $q->where('year', $startDate->year)
                        ->where('month', '>=', $startDate->month);
                  });
            })
            // 処理の終了日（今月）以前
            ->where(function ($q) use ($endDate) {
                $q->where('year', '<', $endDate->year)
                  ->orWhere(function ($q) use ($endDate) {
                      $q->where('year', $endDate->year)
                        ->where('month', '<=', $endDate->month);
                  });
            })
            ->decrement('amount', $amount); // ここが減算処理
    }

    public static function addSaving($userId, $year, $month, $amount)
    {
        // === ステップ1: 間の月が存在しない場合に作成する ===

        // 処理範囲の開始日と、終点となる「今月」の日付を定義
        $startDate = Carbon::create($year, $month, 1);
        $currentMonthDate = Carbon::now()->startOfMonth();

        $endDate = $startDate->isAfter($currentMonthDate) ? $startDate : $currentMonthDate;
        
        // 基準となる「前の月」の残高を取得
        $prevDate = (clone $startDate)->subMonth();
        $lastKnownAmount = self::where('user_id', $userId)
                            ->where('year', $prevDate->year)
                            ->where('month', $prevDate->month)
                            ->value('amount') ?? 0;

        // 処理期間をループして、存在しない月を作成
        $period = CarbonPeriod::create($startDate, '1 month', $endDate);
        foreach ($period as $date) {
            // firstOrCreateを使い、なければ作成、あれば何もしない
            self::firstOrCreate(
                ['user_id' => $userId, 'year' => $date->year, 'month' => $date->month],
                ['amount' => $lastKnownAmount] // 新規作成時は前の月の残高を引き継ぐ
            );
            // 次のループのために、今処理した月の残高を取得し直す
            $lastKnownAmount = self::where('user_id', $userId)
                                ->where('year', $date->year)
                                ->where('month', $date->month)
                                ->value('amount');
        }

        // === ステップ2: 範囲内のすべての月の残高を一括で加算する ===

        return self::where('user_id', $userId)
            // 処理の開始日以降
            ->where(function ($q) use ($startDate) {
                $q->where('year', '>', $startDate->year)
                ->orWhere(function ($q) use ($startDate) {
                    $q->where('year', $startDate->year)
                        ->where('month', '>=', $startDate->month);
                });
            })
            // 処理の終了日（今月）以前
            ->where(function ($q) use ($endDate) {
                $q->where('year', '<', $endDate->year)
                ->orWhere(function ($q) use ($endDate) {
                    $q->where('year', $endDate->year)
                        ->where('month', '<=', $endDate->month);
                });
            })
            ->increment('amount', $amount);
    }

    public static function get6MonthsSavings($userId)
    {
        // 現在の年月の Carbon を取得
        $end = \Carbon\Carbon::now()->startOfMonth(); // 今月の初め
        $start = (clone $end)->subMonths(5);          // 6ヶ月前の月初

        // 年と月のカラムを対象にした絞り込み
        return self::where('user_id', $userId)
            ->where(function ($query) use ($start, $end) {
                $query->whereRaw("STR_TO_DATE(CONCAT(year, '-', LPAD(month, 2, '0'), '-01'), '%Y-%m-%d') BETWEEN ? AND ?", [
                    $start->toDateString(),
                    $end->toDateString()
                ]);
            })
            ->orderBy('year')
            ->orderBy('month')
            ->get();
    }

    public static function getMostRecentSaving($userId)
    {
        return self::where('user_id', $userId)
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->first();
    }

    public static function getAllSavings($userId)
    {
        // 年月で昇順
        return self::where('user_id', $userId)
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();
    }

    public static function updateSaving($userId, $newYear, $newMonth, $oldYear, $oldMonth, $addAmount, $subtractAmount)
    {
        // 1. 元の取引を、元の年月から取り消す
        self::subtractSaving($userId, $oldYear, $oldMonth, $subtractAmount);

        // 2. 新しい取引を、新しい年月から適用する
        self::addSaving($userId, $newYear, $newMonth, $addAmount);
    }
}
