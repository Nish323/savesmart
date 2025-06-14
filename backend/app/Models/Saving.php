<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Saving extends Model
{
    protected $fillable = [
        'user_id',
        'amount',
        'year',
        'month',
    ];

    public static function subtractSaving($userId, $year, $month, $amount)
    {
        // 処理の起点となる月のレコードが存在しない場合に備え、なければ作成します。
        self::firstOrCreate(
            ['user_id' => $userId, 'year' => $year, 'month' => $month],
            ['amount' => 0]
        );

        // 指定された年月以降のすべてのレコードの amount を減額
        return self::where('user_id', $userId)
            ->where(function ($q) use ($year, $month) {
                $q->where('year', '>', $year)
                ->orWhere(function ($q) use ($year, $month) {
                    $q->where('year', $year)
                        ->where('month', '>=', $month);
                });
            })
            ->decrement('amount', $amount);
    }

    public static function addSaving($userId, $year, $month, $amount)
    {
        // 処理の起点となる月のレコードが存在しない場合に備え、なければ作成
        self::firstOrCreate(
            ['user_id' => $userId, 'year' => $year, 'month' => $month],
            ['amount' => 0]
        );

        // 指定された年月以降のすべてのレコードの amount を増額
        return self::where('user_id', $userId)
            ->where(function ($q) use ($year, $month) {
                $q->where('year', '>', $year)
                  ->orWhere(function ($q) use ($year, $month) {
                      $q->where('year', $year)->where('month', '>=', $month);
                  });
            })
            ->increment('amount', $amount);
    }

    public static function getSaving($userId, $year, $month)
    {
        // ユーザーの貯金情報を取得
        return self::where('user_id', $userId)
            ->where('year', $year)
            ->where('month', $month)
            ->first();
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
