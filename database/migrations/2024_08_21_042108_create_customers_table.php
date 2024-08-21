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
        Schema::create('customers', function (Blueprint $table) {
            $table->string('customer_id',20)->primary();
            $table->string('phone_number',10)->unique();
            $table->string('email',255)->unique();
            $table->tinyInteger('gender')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('province',50)->nullable();
            $table->string('town',50)->nullable();
            $table->string('ward',50)->nullable();
            $table->string('address',255)->nullable();
            $table->string('customer_class',100);
            $table->string('customer_group',100);
            $table->string('customer_source',100);
            $table->string('account_id',20);
            $table->foreign('account_id')->references('account_id')->on('accounts');
            $table->timestamps();
            $table->string('status',15);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
