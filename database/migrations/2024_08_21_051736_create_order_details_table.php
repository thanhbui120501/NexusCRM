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
        Schema::create('order_details', function (Blueprint $table) {
            $table->string('order_detail_id',20)->primary();
            $table->string('product_id',20);
            $table->foreign('product_id')->references('product_id')->on('products');
            $table->string('order_id',20);
            $table->foreign('order_id')->references('order_id')->on('orders');
            $table->integer('quantity');
            $table->float('discount');
            $table->float('total_order_value');
            $table->timestamps();
            $table->tinyInteger('status')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_details');
    }
};
