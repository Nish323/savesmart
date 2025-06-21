<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class AiAdvice extends Model
{
    use HasFactory;

    protected $table = 'ai_advices';

    protected $fillable = [
        'user_id',
        'advice',
        'adviced_at',
    ];

    protected $casts = [
        'adviced_at' => 'date',
    ];

    /**
     * ユーザーに関連付けられた最新のAIアドバイスを取得
     *
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public static function getLatestAdvice($userId)
    {
        return self::where('user_id', $userId)
            ->orderBy('adviced_at', 'desc')
            ->first();
    }
}
