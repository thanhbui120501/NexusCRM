<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Address extends Model
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
    protected $primaryKey = 'address_id';
    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    protected $table = 'address';
    public $incrementing = false;
    protected $fillable = [
        'address_id',
        'customer_id',
        'address_line',
        'province',
        'town',
        'ward',
        'country',      
        'updated_at',
        'created_at',
        'deleted_status',        
    ];
}
