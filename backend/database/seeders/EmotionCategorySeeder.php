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
                'color'      => 'green',
            ],
            [
                'name'       => '不満',
                'icon'       => 'ThumbsDown',
                'color'      => 'blue',
            ],
            [
                'name'       => '後悔',
                'icon'       => 'Frown',
                'color'      => 'red',
            ],
            [
                'name'       => '衝動的',
                'icon'       => 'Zap',
                'color'      => 'yellow',
            ],
            [
                'name'       => '計画的',
                'icon'       => 'Target',
                'color'      => 'blue',
            ],
        ]);
    }
}
