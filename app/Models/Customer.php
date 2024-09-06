<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Customer extends Model
{
    use HasFactory, Notifiable;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */

     /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'customer_id';
    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    protected $table = 'customers';
    public $incrementing = false;
    protected $fillable = [
        'customer_id',
        'phone_number',
        'email',
        'full_name',
        'gender',
        'date_of_birth',
        'province',
        'town',
        'ward',
        'address',
        'customer_class',
        'customer_group',
        'customer_source',
        'account_id',      
        'updated_at',
        'created_at',
        'status'
    ];
}
