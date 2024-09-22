<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
class AccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'account_id' => substr((string) Str::uuid(), 0, 20),
            'username' => $this->faker->userName,
            'password' => Hash::make('Thanh@123!?'),
            'email' => $this->faker->unique()->safeEmail,
            'phone_number' => $this->faker->numerify('##########'),
            'full_name' => $this->faker->name,
            'image_name' => $this->faker->imageUrl(),
            'date_of_birth' => $this->faker->date(),
            'role_id' => "R150924031055",
            'created_at' => now(),
            'updated_at' => now(),
            'status' => 1,
            'deleted_status' => 0
        ];
    }
}