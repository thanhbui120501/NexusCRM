<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
class AccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('accounts')->insert([
            'account_id' => 'AC'.Carbon::now()->format('dmyhis'),
            'username' => 'thanh',
            'email' => 'thanh@email.com',
            'password' => Hash::make('Thanh@123!?'),
            'role_id' => 'R040924011719'          
        ]);
    }
}
