<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use App\Models\Address;
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
        'image_name',
        'town',
        'ward',
        'address',
        'customer_class',
        'customer_group',
        'customer_source',
        'account_id',      
        'updated_at',
        'created_at',
        'deleted_status',
        'status'
    ];

    public function address(){
        return $this->hasMany(Address::class, 'customer_id');
    }
}
