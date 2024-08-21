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
        Schema::create('orders', function (Blueprint $table) {
            $table->string('order_id',20)->primary();
            $table->dateTime('order_date');
            $table->string('customer_id',20);
            $table->foreign('customer_id')->references('customer_id')->on('customers');
            $table->string('shipping_address',100);
            $table->integer('tax');
            $table->float('shipping_fee');           
            $table->boolean('payment_status',50);
            $table->string('payment_menthod',50);
            $table->string('account_id',20);
            $table->foreign('account_id')->references('account_id')->on('accounts');
            $table->string('diliver_status',100);
            $table->timestamps();
            $table->tinyInteger('status')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
