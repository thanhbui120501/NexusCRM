<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Province extends Model
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
    protected $primaryKey = 'id';
    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    protected $table = 'provinces';
    public $incrementing = false;
    protected $fillable = [
        'id',
        'name',
        'name_en',
        'full_name',
        'full_name_en',
        'latitude',
        'longitude',
        'created_at',
        'updated_at',               
    ];
    public function districts()
    {
        return $this->hasMany(District::class, 'province_id', 'id');
    }
}
