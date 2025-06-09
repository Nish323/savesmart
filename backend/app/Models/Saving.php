<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Saving extends Model
{
    protected $fillable = [
        'user_id',
        'current_amount',
    ];

    public static function subtractSaving($userId, $amount)
    {
        // ユーザーの貯金情報を取得または作成
        return self::firstOrCreate(['user_id' => $userId], ['current_amount' => 0]);

        $saving->current_amount -= $amount;
        $saving->save();
    }

    public static function addSaving($userId, $amount)
    {
        // ユーザーの貯金情報を取得または作成
        $saving = self::firstOrCreate(['user_id' => $userId], ['current_amount' => 0]);
        
        // 貯金の合計を更新
        $saving->current_amount += $amount;
        $saving->save();
    }

    public static function getSaving($userId)
    {
        // ユーザーの貯金情報を取得
        return self::where('user_id', $userId)->first();
    }

    public static function updateSaving($userId, $addAmount, $subtractAmount)
    {
        // ユーザーの貯金情報を取得
        $saving = self::getSaving($userId);
        if ($saving) {
            // 貯金の合計を更新
            $saving->current_amount += $addAmount - $subtractAmount;
            $saving->save();
        } else {
            // 存在しない場合は新規作成
            self::addSaving($userId, $currentAmount);
        }
    }
}
