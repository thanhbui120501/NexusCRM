<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
class ActivityHistory extends Model
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
    protected $primaryKey = 'activity_id';
    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    protected $table = 'activity_history';
    public $incrementing = false;
    protected $fillable = [
        'activity_id',
        'activity_name',
        'activity_content',
        'activity_type',
        'account_id',
        'username',
        'created_at',
        'updated_at',
        'status',
    ];
}
