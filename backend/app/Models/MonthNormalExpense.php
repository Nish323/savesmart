<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthNormalExpense extends Model
{
    protected $table = 'month_normal_expenses';

    protected $fillable = [
        'user_id',
        'year',
        'month',
        'normal_category_id',
        'expense_total',
    ];

    public function normalCategory()
    {
        return $this->belongsTo(NormalCategory::class, 'normal_category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
