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
        // ユーザーの貯金情報を取得または作成
        return self::firstOrCreate(['user_id' => $userId, 'year' => $year, 'month' => $month], ['amount' => 0]);

        $saving->amount -= $amount;
        $saving->save();
    }

    public static function addSaving($userId, $year, $month, $amount)
    {
        // ユーザーの貯金情報を取得または作成
        $saving = self::firstOrCreate(['user_id' => $userId, 'year' => $year,'month' => $month], ['amount' => 0]);
        
        // 貯金の合計を更新
        $saving->amount += $amount;
        $saving->save();
    }

    public static function getSaving($userId, $year, $month)
    {
        // ユーザーの貯金情報を取得
        return self::where('user_id', $userId)
            ->where('year', $year)
            ->where('month', $month)
            ->first();
    }

    public static function getCurrentSaving($userId)
    {
        // ユーザーの現在の貯金情報を取得
        return self::where('user_id', $userId)->first();
    }
    public static function getAllSavings($userId)
    {
        // ユーザーの全ての貯金情報を取得
        return self::where('user_id', $userId)->get();
    }

    public static function updateSaving($userId, $year, $month, $addAmount, $subtractAmount)
    {
        // ユーザーの貯金情報を取得
        $saving = self::getSaving($userId, $year, $month);
        if ($saving) {
            // 貯金の合計を更新
            $saving->amount += $addAmount - $subtractAmount;
            $saving->save();
        } else {
            // 存在しない場合は新規作成
            self::addSaving($userId, $year, $month, $currentAmount);
        }
    }
}
