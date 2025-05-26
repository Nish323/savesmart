<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Income extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'category',
        'amount',
        'memo',
        'received_at',
        'year',
        'month',
        'day',
    ];

    protected $casts = [
        'received_at' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
