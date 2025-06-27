<?php

namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Hash;
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
       protected $fillable = ['role', 'password', 'provider_id', 'user_id'];


    

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function userInfo()
    {
        return $this->belongsTo(UserBasic::class, 'user_id');
    }

    public function providerInfo()
    {
        return $this->belongsTo(Provider::class, 'provider_id');
    }




   
}
