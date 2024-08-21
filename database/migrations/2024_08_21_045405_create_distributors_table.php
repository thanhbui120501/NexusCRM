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
        Schema::create('distributors', function (Blueprint $table) {
            $table->string('distributor_id',20)->primary();
            $table->string('distributor_name',100);
            $table->string('address',70)->nullable();
            $table->string('representative_name',70)->nullable();
            $table->string('phone_number',10)->unique()->nullable();
            $table->string('email',10)->unique()->nullable();
            $table->string('business_sector',10)->nullable();
            $table->timestamps();
            $table->tinyInteger('status')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('distributors');
    }
};
