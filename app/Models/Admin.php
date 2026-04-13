<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class Admin extends Authenticatable
{
    use Notifiable,HasRoles, SoftDeletes;

    protected $guard_name = 'admin'; 
    protected $guard = 'admin'; 

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'show_password',
    ];

    protected $hidden = [
        'password',
        'show_password',
        'remember_token',
    ];
}