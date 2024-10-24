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
        Schema::create('address', function (Blueprint $table) {
            $table->id('address_id');
            $table->string('customer_id',20);
            $table->foreign('customer_id')->references('customer_id')->on('customers'); 
            $table->string('address_line');
            $table->string('province')->nullable();
            $table->string('town')->nullable();
            $table->string('ward')->nullable();
            $table->string('country')->nullable();
            $table->boolean('deleted_status')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('address');
    }
};
