<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class EmotionCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        DB::table('emotion_categories')->insert([
            [
                'name'       => '満足',
                'icon'       => 'Smile',
                'color'      => 'text-green-500',
            ],
            [
                'name'       => '後悔',
                'icon'       => 'Frown',
                'color'      => 'text-red-500',
            ],
            [
                'name'       => '衝動的',
                'icon'       => 'Zap',
                'color'      => 'text-yellow-500',
            ],
            [
                'name'       => '計画的',
                'icon'       => 'Target',
                'color'      => 'text-blue-500',
            ],
        ]);
    }
}
