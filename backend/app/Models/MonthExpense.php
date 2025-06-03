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

    /**
     * Get the user that owns the MonthExpense.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
