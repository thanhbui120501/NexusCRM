<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\Account as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens as SanctumHasApiTokens;


//use Illuminate\Foundation\Auth\Account as Authenticatable;
class Account extends Authenticatable
{
    use  HasFactory, Notifiable, SanctumHasApiTokens;
    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'account_id';
    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;
    protected $fillable = [
        'account_id',
        'username',
        'password',
        'user_token',
        'email',
        'phone_number',
        'first_name',
        'last_name',
        'date_of_birth',
        'role_id',
        'created_at',
        'updated_at',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',             
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [           
            'password' => 'hashed',        
        ];
    }
}
