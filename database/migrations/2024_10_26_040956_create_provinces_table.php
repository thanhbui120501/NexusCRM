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
        Schema::create('provinces', function (Blueprint $table) {
            $table->id('province_id');  // Sử dụng 'province_id' làm khóa chính
            $table->string('name')->unique();
            $table->string('code')->unique()->nullable(); 
            $table->string('division_type')->unique()->nullable();
            $table->string('codename')->unique()->nullable();
            $table->integer('phone_code')->unique()->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('provinces');
    }
};
