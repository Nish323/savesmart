<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Saving extends Model
{
    protected $fillable = [
        'user_id',
        'current_amount',
    ];

    public static function getOrCreateSaving($userId, $amount)
    {
        // ユーザーの貯金情報を取得または作成
        return self::firstOrCreate(['user_id' => $userId], ['current_amount' => 0]);

        $saving->current_amount -= $amount;
        $saving->save();
    }
}
