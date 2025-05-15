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
            'text-red-500',
            'text-pink-500',
            'text-purple-500',
            'text-indigo-500',
            'text-blue-500',
            'text-cyan-500',
            'text-teal-500',
            'text-green-500',
            'text-lime-500',
            'text-yellow-500',
            'text-amber-500',
            'text-orange-500',
            'text-rose-500',
            'text-violet-500',
            'text-gray-500',
        ];

        foreach ($colors as $color) {
            DB::table('colors')->insert([
                'color' => $color,
            ]);
        }
    }
}
