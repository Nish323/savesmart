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
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('normal_category_id')->constrained();
            $table->foreignId('special_category_id')->constrained();
            $table->foreignId('emotion_category_id')->constrained();
            $table->bigInteger('amount');
            $table->string('memo')->nullable();
            $table->date('spent_at');
            $table->integer('year');
            $table->tinyInteger('month');
            $table->tinyInteger('day');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
