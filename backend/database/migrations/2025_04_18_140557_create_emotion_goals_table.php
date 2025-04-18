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
        Schema::create('emotion_goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('emotion_category_id')->constrained();
            $table->string('type')->default('emotion');
            $table->string('title');
            $table->bigInteger('target_count');
            $table->bigInteger('current_count');
            $table->date('deadline');
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
        Schema::dropIfExists('emotion_goals');
    }
};
