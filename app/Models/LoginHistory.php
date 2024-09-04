<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class LoginHistory extends Model
{
    use HasFactory, Notifiable;
     /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'history_id';
    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    protected $table = 'login_history';
    public $incrementing = false;
    protected $fillable = [
        'history_id',
        'account_id',
        'login_time',
        'logout_time',
        'ip_address',
        'device_name',     
        'updated_at',
        'created_at',
        'status'
    ];
}
