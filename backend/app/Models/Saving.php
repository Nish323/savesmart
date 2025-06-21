<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\DB; // DBトランザクションのために追加

class Saving extends Model
{
    protected $fillable = [
        'user_id',
        'amount',
        'year',
        'month',
    ];

    /**
     * 特定の月の貯金情報を取得します。
     */
    public static function getSaving($userId, $year, $month)
    {
        return self::where('user_id', $userId)
            ->where('year', $year)
            ->where('month', $month)
            ->get();
    }

    /**
     * 指定された月から現在月までの貯金を減算します。
     * 途中にレコードが存在しない月があれば作成し、前の月の残高を引き継ぎます。
     */
    public static function subtractSaving($userId, $year, $month, $amount)
    {
        // 処理範囲の開始日と、終点となる「今月」の日付を定義
        $startDate = Carbon::create($year, $month, 1)->startOfMonth();
        $currentMonthDate = Carbon::now()->startOfMonth();
        $endDate = $startDate->isAfter($currentMonthDate) ? $startDate : $currentMonthDate;
        
        // 間の月が存在しない場合に作成
        self::ensureMonthlyRecordsExist($userId, $startDate, $endDate);

        // 範囲内のすべての月の残高を一括で減算
        return self::applyChangeToRange($userId, $startDate, $endDate, -$amount);
    }

    /**
     * 指定された月から現在月までの貯金を加算します。
     * 途中にレコードが存在しない月があれば作成し、前の月の残高を引き継ぎます。
     */
    public static function addSaving($userId, $year, $month, $amount)
    {
        // 処理範囲の開始日と、終点となる「今月」の日付を定義
        $startDate = Carbon::create($year, $month, 1)->startOfMonth();
        $currentMonthDate = Carbon::now()->startOfMonth();
        $endDate = $startDate->isAfter($currentMonthDate) ? $startDate : $currentMonthDate;
        
        // 間の月が存在しない場合に作成
        self::ensureMonthlyRecordsExist($userId, $startDate, $endDate);

        // 範囲内のすべての月の残高を一括で加算
        return self::applyChangeToRange($userId, $startDate, $endDate, $amount);
    }

    /**
     * 指定された範囲内の月次貯金レコードが存在しない場合に作成します。
     * @param int $userId ユーザーID
     * @param Carbon $startDate 開始日 (月の初め)
     * @param Carbon $endDate 終了日 (月の初め)
     */
    private static function ensureMonthlyRecordsExist($userId, Carbon $startDate, Carbon $endDate)
    {
        // 基準となる「前の月」の残高を取得
        $prevDate = (clone $startDate)->subMonth();
        $lastKnownAmount = self::where('user_id', $userId)
                            ->where('year', $prevDate->year)
                            ->where('month', $prevDate->month)
                            ->value('amount') ?? 0;

        // 処理期間をループして、存在しない月を作成
        $period = CarbonPeriod::create($startDate, '1 month', $endDate);
        foreach ($period as $date) {
            $currentMonthSaving = self::where('user_id', $userId)
                                    ->where('year', $date->year)
                                    ->where('month', $date->month)
                                    ->first();

            if (!$currentMonthSaving) {
                // レコードが存在しない場合のみ作成し、前の月の残高を引き継ぐ
                self::create([
                    'user_id' => $userId,
                    'year' => $date->year,
                    'month' => $date->month,
                    'amount' => $lastKnownAmount,
                ]);
            } else {
                // 既に存在する場合は、その月の残高を次の月の引き継ぎ値とする
                $lastKnownAmount = $currentMonthSaving->amount;
            }
        }
    }

    /**
     * 指定された範囲内の月次貯金に一括で金額変更を適用します。
     * @param int $userId ユーザーID
     * @param Carbon $startDate 開始日 (月の初め)
     * @param Carbon $endDate 終了日 (月の初め)
     * @param int $amountChange 変更量 (正の値で加算、負の値で減算)
     */
    private static function applyChangeToRange($userId, Carbon $startDate, Carbon $endDate, $amountChange)
    {
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
            ->increment('amount', $amountChange); // ここで増減処理
    }


    /**
     * 過去6ヶ月分の貯金情報を取得します。
     */
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

    /**
     * 最新の貯金情報を取得します。
     */
    public static function getMostRecentSaving($userId)
    {
        return self::where('user_id', $userId)
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->first();
    }

    /**
     * 全ての貯金情報を年月で昇順に取得します。
     */
    public static function getAllSavings($userId)
    {
        return self::where('user_id', $userId)
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();
    }

    /**
     * 貯金情報を更新します。
     * 古い取引を取り消し、新しい取引を適用することで、期間全体の残高を調整します。
     * Controller でトランザクションを管理する場合、ここでは DB::transaction は使用しません。
     */
    public static function updateSaving($userId, $newYear, $newMonth, $oldYear, $oldMonth, $addAmount, $subtractAmount)
    {
        // 1. 元の取引を、元の年月から取り消す（subtractAmount は減算なのでそのまま渡す）
        self::subtractSaving($userId, $oldYear, $oldMonth, $subtractAmount);

        // 2. 新しい取引を、新しい年月から適用する（addAmount は加算なのでそのまま渡す）
        self::addSaving($userId, $newYear, $newMonth, $addAmount);
    }
}