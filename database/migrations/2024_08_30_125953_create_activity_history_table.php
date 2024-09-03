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
        Schema::create('activity_history', function (Blueprint $table) {
            $table->string('activity_id',20)->primary();
            $table->string('activity_name',100);
            $table->string('activity_type',100);
            $table->string('activity_content',255);
            $table->string('account_id',20);
            $table->foreign('account_id')->references('account_id')->on('accounts');
            $table->string('username',20);
            $table->timestamps();
            $table->tinyInteger('status')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_history');
    }
};
