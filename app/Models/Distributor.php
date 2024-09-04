<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Distributor extends Model
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
    protected $primaryKey = 'distributor_id';
    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    protected $table = 'distributors';
    public $incrementing = false;
    protected $fillable = [
        'distributor_id',
        'distributor_name',
        'address',
        'representative_name',
        'phone_number',
        'business_sector',
        'updated_at',
        'created_at',
        'status'
    ];
  
}
