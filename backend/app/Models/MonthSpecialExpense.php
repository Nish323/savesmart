<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthSpecialExpense extends Model
{
    protected $table = 'month_special_expenses';

    protected $fillable = [
        'user_id',
        'year',
        'month',
        'special_category_id',
        'expense_total',
    ];

    public function specialCategory()
    {
        return $this->belongsTo(SpecialCategory::class, 'special_category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
