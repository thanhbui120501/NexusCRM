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
        Schema::create('warehouses', function (Blueprint $table) {
            $table->string('warehouse_id',20)->primary();
            $table->string('warehouse_name',255);
            $table->string('address',255)->nullable();
            $table->string('distributor_id',20);
            $table->foreign('distributor_id')->references('distributor_id')->on('distributors');
            $table->integer('product_quantity');
            $table->tinyInteger('status')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('warehouses');
    }
};
