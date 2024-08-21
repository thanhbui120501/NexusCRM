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
        Schema::create('promotions', function (Blueprint $table) {
            $table->string('promotion_id',20)->primary();
            $table->string('promotion_name',100);
            $table->string('description',255)->nullable();
            $table->string('type',255);
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->string('comdition',100)->nullable();
            $table->float('amount');
            $table->integer('percentage');
            $table->integer('maximum_limit');
            $table->string('status',50);
            $table->string('promotion_type_id',20);
            $table->foreign('promotion_type_id')->references('promotion_type_id')->on('promotion_types');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
