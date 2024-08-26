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
            'account_id' => 'AC'.Carbon::now()->format('d.m.y.h.i.s'),
            'username' => Str::random(10),
            'email' => Str::random(5).'@email.com',
            'password' => Hash::make('password'),
            'role_id' => 'R23.08.24.06.21.30'          
        ]);
    }
}
