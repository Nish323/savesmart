<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('waste_goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->string('type')->default('waste');
            $table->string('title');
            $table->bigInteger('target_amount');
            $table->bigInteger('current_amount');
            $table->date('deadline');
            $table->string('icon')->default('TbAlertSquare');
            $table->string('color')->default('text-red-500');
            $table->boolean('achieved')->default(false);
            $table->boolean('failed')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('waste_goals');
    }
};
