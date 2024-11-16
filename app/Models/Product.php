<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Product extends Model
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
    protected $primaryKey = 'product_id';
    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    protected $table = 'products';
    public $incrementing = false;
    protected $fillable = [
        'product_id',
        'product_name',  
        'product_quantity',
        'description',
        'start_date',
        'selling_price',
        'import_price',
        'promotion_id',
        'unit_of_measure',
        'weight',
        'product_images',
        'product_catalog',
        'inventory',
        'status',
        'warehouse_id',
        'created_at',
        'updated_at'
    ];


}
