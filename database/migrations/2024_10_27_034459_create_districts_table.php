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
        // Schema::table('provinces', function (Blueprint $table) {           
        //     // Thêm khóa chính mới
        //     $table->string('id')->primary()->change();  // Thiết lập lại trường id làm khóa chính
        // });
        Schema::create('districts', function (Blueprint $table) {
            $table->string('id')->primary();  // Sử dụng 'province_id' làm khóa chính
            $table->string('province_id');
            $table->foreign('province_id')->references('id')->on('provinces')->onDelete('cascade');
            $table->string('name');
            $table->string('name_en');
            $table->string('full_name');
            $table->string('full_name_en');            
            $table->string('latitude');             
            $table->string('longitude');            
            $table->timestamps();
        });

        Schema::create('wards', function (Blueprint $table) {
            $table->string('id')->primary();  // Sử dụng 'province_id' làm khóa chính
            $table->string('district_id');
            $table->foreign('district_id')->references('id')->on('districts')->onDelete('cascade');
            $table->string('name');
            $table->string('name_en');
            $table->string('full_name');
            $table->string('full_name_en');            
            $table->string('latitude');             
            $table->string('longitude');            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('districts');
    }
};
