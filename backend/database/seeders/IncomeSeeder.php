<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class IncomeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        DB::table('incomes')->insert([
            [
                'user_id'    => 1,
                'income'     => 250000,
                'saved_at'   => '2025-01-10',
                'memo'       => 'memo',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'user_id'    => 1,
                'income'     => 180000,
                'saved_at'   => '2025-02-10',
                'memo'       => 'memo',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'user_id'    => 1,
                'income'     => 320000,
                'saved_at'   => '2025-01-15',
                'memo'       => 'memo',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'user_id'    => 1,
                'income'     => 210000,
                'saved_at'   => '2025-03-05',
                'memo'       => 'memo',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
        ]);
    }
}
