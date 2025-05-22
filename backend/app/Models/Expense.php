<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Expense extends Model
{
    use HasFactory, SoftDeletes;

    protected $with = [
        'normalCategory.color',
        'specialCategory',
        'emotionCategory',
    ];

    protected $appends = [
        'normal_category_color',
        'special_category_color',
        'emotion_category_color',
    ];

    protected $fillable = [
        'user_id',
        'normal_category_id',
        'special_category_id',
        'emotion_category_id',
        'amount',
        'memo',
        'spent_at',
        'year',
        'month',
        'day',
    ];

    protected $casts = [
        'spent_at' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function normalCategory()
    {
        return $this->belongsTo(NormalCategory::class, 'normal_category_id', 'id');
    }

    public function specialCategory()
    {
        return $this->belongsTo(SpecialCategory::class, 'special_category_id', 'id');
    }

    public function emotionCategory()
    {
        return $this->belongsTo(EmotionCategory::class, 'emotion_category_id', 'id');
    }

    public function getNormalCategoryColorAttribute(): ?string
    {
        return $this->normalCategory?->color?->color;
    }

    public function getSpecialCategoryColorAttribute(): ?string
    {
        return $this->specialCategory?->color;
    }

    public function getEmotionCategoryColorAttribute(): ?string
    {
        return $this->emotionCategory?->color;
    }
}