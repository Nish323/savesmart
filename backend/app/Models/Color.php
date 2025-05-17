<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Color extends Model
{
    public $timestamps = false; // このテーブルはcreated_at, updated_atを持っていない
    
    protected $fillable = [
        'color'
    ];
}
