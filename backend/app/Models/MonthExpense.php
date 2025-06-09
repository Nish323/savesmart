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

    public static function updateMonthExpense($userId, $year, $month, $currentExpense, $pastExpense)
    {
        $monthExpense = self::where('user_id', $userId)
            ->where('year', $year)
            ->where('month', $month)
            ->first();

        if ($monthExpense) {
            // 支出の合計を更新
            $monthExpense->expense_total += $currentExpense - $pastExpense;
            // 変更を保存
            $monthExpense->save();
        } else {
            // 存在しない場合は新規作成
            self::addMonthExpense($userId, $year, $month, $currentExpense);
        }
    }

    /**
     * Get the user that owns the MonthExpense.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
