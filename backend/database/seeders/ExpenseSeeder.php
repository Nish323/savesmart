<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ExpenseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        DB::table('expenses')->insert([
            [
                'user_id'             => 1,
                'normal_category_id'  => 1,    
                'special_category_id' => 3,   
                'emotion_category_id' => 2,   
                'amount'              => 1200,
                'memo'                => 'ランチ代',
                'spent_at'            => '2025-03-01',
                'year'                => 2025,
                'month'               => 3,
                'day'                 => 1,
                'created_at'          => $now,
                'updated_at'          => $now,
                'deleted_at'          => null,
            ],
            [
                'user_id'             => 1,
                'normal_category_id'  => 5,   
                'special_category_id' => 1,    
                'emotion_category_id' => 3,   
                'amount'              => 4500,
                'memo'                => '映画鑑賞',
                'spent_at'            => '2025-03-05',
                'year'                => 2025,
                'month'               => 3,
                'day'                 => 5,
                'created_at'          => $now,
                'updated_at'          => $now,
                'deleted_at'          => null,
            ],
            [
                'user_id'             => 1,
                'normal_category_id'  => 3,   
                'special_category_id' => 3,  
                'emotion_category_id' => 4,    
                'amount'              => 8300,
                'memo'                => '電気代',
                'spent_at'            => '2025-02-28',
                'year'                => 2025,
                'month'               => 2,
                'day'                 => 28,
                'created_at'          => $now,
                'updated_at'          => $now,
                'deleted_at'          => null,
            ],
            [
                'user_id'             => 1,
                'normal_category_id'  => 4,    
                'special_category_id' => 3,  
                'emotion_category_id' => 1,  
                'amount'              => 2500,
                'memo'                => '洗剤購入',
                'spent_at'            => '2025-03-10',
                'year'                => 2025,
                'month'               => 3,
                'day'                 => 10,
                'created_at'          => $now,
                'updated_at'          => $now,
                'deleted_at'          => null,
            ],
            [
                'user_id'             => 1,
                'normal_category_id'  => 8,    
                'special_category_id' => 2,  
                'emotion_category_id' => 1,  
                'amount'              => 3000,
                'memo'                => '教材購入',
                'spent_at'            => '2025-03-10',
                'year'                => 2025,
                'month'               => 3,
                'day'                 => 10,
                'created_at'          => $now,
                'updated_at'          => $now,
                'deleted_at'          => null,
            ],
        ]);
    }
}
