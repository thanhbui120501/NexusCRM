<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Role extends Model
{
    use HasFactory,  Notifiable;
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
    protected $primaryKey = 'role_id';
    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    protected $table = 'roles';
    public $incrementing = false;
    protected $fillable = [
        'role_id',
        'role_name',
        'role_another_name',
        'role_level',
        'description',
        'created_at',
        'updated_at',
        'status'
    ];
    public function accounts()
    {
        return $this->hasMany(Account::class, 'role_id');
    }
}
