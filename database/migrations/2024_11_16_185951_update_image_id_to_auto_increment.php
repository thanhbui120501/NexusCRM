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
        Schema::table('product_images', function (Blueprint $table) {
            // Xóa khóa chính cũ nếu cần
            $table->dropPrimary('image_id'); 

            // Xóa cột image_id (nếu cần)
            $table->dropColumn('image_id');

            // Thêm cột mới với kiểu số nguyên tự tăng
            $table->id('image_id')->first();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_images', function (Blueprint $table) {
            $table->string('image_id')->primary()->change();
        });
    }
};
