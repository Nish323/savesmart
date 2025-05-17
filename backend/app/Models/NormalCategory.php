<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NormalCategory extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        'user_id',
        'color_id',
        'name',
    ];
    
    /**
     * このカテゴリに関連するカラー
     */
    public function color()
    {
        return $this->belongsTo(Color::class);
    }
}
