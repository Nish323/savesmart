<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MonthIncomeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        DB::table('month_incomes')->insert([
            [
                'user_id'      => 1,
                'year'         => 2025,
                'month'        => 1,
                'income_total' => 430000,
                'created_at'   => $now,
                'updated_at' => $now,
            ],
            [
                'user_id'      => 1,
                'year'         => 2025,
                'month'        => 2,
                'income_total' => 380000,
                'created_at'   => $now,
                'updated_at' => $now,
            ],
            [
                'user_id'      => 1,
                'year'         => 2025,
                'month'        => 4,
                'income_total' => 320000,
                'created_at'   => $now,
                'updated_at' => $now,
            ],
            [
                'user_id'      => 1,
                'year'         => 2025,
                'month'        => 5,
                'income_total' => 210000,
                'created_at'   => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}
