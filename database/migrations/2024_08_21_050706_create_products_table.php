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
        Schema::create('products', function (Blueprint $table) {
            $table->string('product_id',20)->primary();
            $table->string('product_name',20);
            $table->integer('product_quantity');
            $table->string('description',255)->nullable();
            $table->float('selling_price');
            $table->float('list_price')->nullable();
            $table->float('import_price')->nullable();
            $table->string('promotion_id',20);
            $table->foreign('promotion_id')->references('promotion_id')->on('promotions');
            $table->string('unit_of_measure',30)->nullable();
            $table->string('weight',10);
            $table->integer('product_images');
            $table->string('product_catalog',255)->nullable();
            $table->integer('inventory');
            $table->string('status',50);
            $table->string('warehouse_id',20);
            $table->foreign('warehouse_id')->references('warehouse_id')->on('warehouses');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
