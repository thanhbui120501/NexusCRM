<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;

class PromotionType extends Model
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
    protected $primaryKey = 'promotion_type_id';
    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    protected $table = 'promotion_types';
    public $incrementing = false;
    protected $fillable = [
        'promotion_type_id',
        'promotion_type_name',  
        'created_at',
        'updated_at',
        'status'
    ];

}
