<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthIncome extends Model
{
    protected $fillable = [
        'user_id',
        'year',
        'month',
        'income_total',
    ];

}
