<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ColorSeeder::class,
            IncomeSeeder::class,
            MonthIncomeSeeder::class,
            NormalCategorySeeder::class,
            SpecialCategorySeeder::class,
            EmotionCategorySeeder::class,
            ExpenseSeeder::class,  // ← ここを追加
        ]);
    }
}
