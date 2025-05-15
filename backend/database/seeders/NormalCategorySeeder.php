<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class NormalCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        DB::table('normal_categories')->insert([
            [
                'user_id'    => 1,
                'color_id'   => 1,
                'name'       => '食費',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'user_id'    => 1,
                'color_id'   => 2,
                'name'       => '交通費',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'user_id'    => 1,
                'color_id'   => 3,
                'name'       => '光熱費',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'user_id'    => 1,
                'color_id'   => 4,
                'name'       => '日用品',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'user_id'    => 1,
                'color_id'   => 5,
                'name'       => '娯楽費',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'user_id'    => 1,
                'color_id'   => 6,
                'name'       => '買い物',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'user_id'    => 1,
                'color_id'   => 7,
                'name'       => '医療',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'user_id'    => 1,
                'color_id'   => 8,
                'name'       => '教育',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
        ]);
    }
}
