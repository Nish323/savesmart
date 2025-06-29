<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\modelds\NormalCategory;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'zaim_oauth_token',
        'zaim_oauth_token_secret',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'zaim_oauth_token',
        'zaim_oauth_token_secret',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Zaimと連携済みかどうかを判定するアクセサ
     *
     * @return bool
     */
    public function getIsZaimLinkedAttribute(): bool
    {
        return !empty($this->zaim_oauth_token) && !empty($this->zaim_oauth_token_secret);
    }

    protected static function booted()
    {
        static::created(function (User $user) {
            // NormalCategoryの自動生成
            NormalCategory::create([
                'user_id'    => $user->id,
                'color_id'   => 1,
                'name'       => '食費',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'user_id'    => $user->id,
                'color_id'   => 2,
                'name'       => '交通費',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'user_id'    => $user->id,
                'color_id'   => 3,
                'name'       => '光熱費',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'user_id'    => $user->id,
                'color_id'   => 4,
                'name'       => '日用品',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'user_id'    => $user->id,
                'color_id'   => 5,
                'name'       => '娯楽費',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'user_id'    => $user->id,
                'color_id'   => 6,
                'name'       => '買い物',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'user_id'    => $user->id,
                'color_id'   => 7,
                'name'       => '医療',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'user_id'    => $user->id,
                'color_id'   => 8,
                'name'       => '教育',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],);
        });
    }
}
