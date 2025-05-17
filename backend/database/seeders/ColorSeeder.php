<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class ColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $colors = [
            'red',
            'pink',
            'purple',
            'indigo',
            'blue',
            'cyan',
            'teal',
            'green',
            'lime',
            'yellow',
            'amber',
            'orange',
            'rose',
            'violet',
            'gray',
        ];

        foreach ($colors as $color) {
            DB::table('colors')->insert([
                'color' => $color,
            ]);
        }
    }
}
