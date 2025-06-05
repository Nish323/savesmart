<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthEmotionExpense extends Model
{
    protected $table = 'month_emotion_expenses';

    protected $fillable = [
        'user_id',
        'year',
        'month',
        'emotion_category_id',
        'expense_total',
    ];

    public function emotionCategory()
    {
        return $this->belongsTo(EmotionCategory::class, 'emotion_category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
