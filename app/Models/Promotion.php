<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Promotion extends Model
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
    protected $primaryKey = 'promotion_id';
    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    protected $table = 'promotions';
    public $incrementing = false;
    protected $fillable = [
        'promotion_id',
        'promotion_name',  
        'description',
        'type',
        'start_date',
        'end_date',
        'condition',
        'amount',
        'percentage',
        'maximum_limit',
        'promotion_type_id',
        'created_at',
        'updated_at',
        'status'
    ];
}
