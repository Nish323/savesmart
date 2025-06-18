<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthExpense extends Model
{
    protected $fillable = [
        'user_id',
        'expense_total',
        'year',
        'month',
    ];
    
    public static function addMonthExpense($userId, $year, $month, $expense)
    {
        // 月ごとの支出を取得または作成
        $monthExpense = self::firstOrCreate(
            ['user_id' => $userId, 'year' => $year, 'month' => $month],
        );
        // 支出の合計を更新
        $monthExpense->expense_total += $expense;
        $monthExpense->save();
    }

    public static function getMonthExpense($userId, $year, $month)
    {
        // 月ごとの支出を取得
        return self::firstOrCreate(
            ['user_id' => $userId, 'year' => $year, 'month' => $month],
        );
    }

    public static function deleteMonthExpense($userId, $year, $month, $expense)
    {
        // 月ごとの支出を取得
        $monthExpense = self::getMonthExpense($userId, $year, $month);
        if ($monthExpense) {
            // 支出の合計を更新
            $monthExpense->expense_total -= $expense;
            // 支出が0以下になった場合は削除
            if ($monthExpense->expense_total <= 0) {
                $monthExpense->delete();
            } else {
                // 変更を保存
                $monthExpense->save();
            }
        }
    }

    public static function updateMonthExpense($userId, $year, $month, $pastYear, $pastMonth, $currentExpense, $pastExpense)
    {
        self::deleteMonthExpense($userId, $pastYear, $pastMonth, $pastExpense);
        self::addMonthExpense($userId, $year, $month, $currentExpense);
    }

    public static function get6MonthsExpenses($userId)
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
     * Get the user that owns the MonthExpense.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
