<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SpecialCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        DB::table('special_categories')->insert([
            [
                'name'       => '無駄遣い',
                'icon'       => 'AlertTriangle',
                'color'      => 'text-red-500',
            ],
            [
                'name'       => '自己投資',
                'icon'       => 'Rocket',
                'color'      => 'text-blue-500',
            ],
            [
                'name'       => '通常',
                'icon'       => 'CircleDot',
                'color'      => 'text-gray-500',
            ],
        ]);
    }
}
