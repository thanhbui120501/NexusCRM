<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Warehouse extends Model
{
    use HasFactory, Notifiable;
     /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'warehouse_id';
    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    protected $table = 'warehouses';
    public $incrementing = false;
    protected $fillable = [
        'warehouse_id',
        'warehouse_name',
        'address',
        'distributor_id',
        'product_quantity',     
        'updated_at',
        'created_at',
        'status'
    ];
}
