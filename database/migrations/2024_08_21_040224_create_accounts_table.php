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
        Schema::create('accounts', function (Blueprint $table) {
            $table->string('account_id',20)->primary();
            $table->string('username',20);
            $table->string('password',255);
            $table->string('user_token',20)->nullable();
            $table->string('email',255)->unique()->nullable();
            $table->string('phone_number',10)->unique()->nullable();
            $table->string('first_name',50)->nullable();
            $table->string('last_name',50)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('role_id',20);
            $table->foreign('role_id',20)->references('role_id')->on('roles');
            $table->rememberToken();
            $table->timestamps();
            $table->tinyInteger('status')->default(1);
        });

        Schema::create('login_history',function(Blueprint $table){
            $table->string('history_id',20);
            $table->string('account_id',20);
            $table->foreign('account_id')->references('account_id')->on('accounts');
            $table->dateTime('login_time');
            $table->dateTime('loout_time');
            $table->string('ip_address',50);
            $table->string('device_name',50);
            $table->timestamps();
            $table->tinyInteger('status')->default(1);
        });

        Schema::create('password_reset',function(Blueprint $table){
            $table->string('reset_id',20);
            $table->string('account_id',20);
            $table->foreign('account_id')->references('account_id')->on('accounts');
            $table->string('token',255);         
            $table->timestamps();
            $table->tinyInteger('status')->default(1);
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
        Schema::dropIfExists('login_history');
        Schema::dropIfExists('password_reset');
        Schema::dropIfExists('sessions');
    }
};
