<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Monolog\Level;

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
    public function getRoleFunction($level){
        if($level>=4){
            return ['Chức năng nv','Chức năng nv','Chức năng nv','Chức năng nv'];
        }else{
            if($level === 3){
                return ['Chức năng admin','Chức năng admin','Chức năng admin','Chức năng admin'];
            }else if($level === 2){
                return ['Chức năng gd','Chức năng gd','Chức năng gd','Chức năng gd'];
            }
            return ['Chức năng it','Chức năng it','Chức năng it','Chức năng it'];
        }
    }
}
