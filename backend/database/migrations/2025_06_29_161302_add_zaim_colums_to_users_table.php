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
        Schema::table('users', function (Blueprint $table) {
            $table->text('zaim_oauth_token')->nullable()->after('remember_token');
            $table->text('zaim_oauth_token_secret')->nullable()->after('zaim_oauth_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('zaim_oauth_token');
            $table->dropColumn('zaim_oauth_token_secret');
        });
    }
};
