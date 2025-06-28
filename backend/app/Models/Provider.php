<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;


class Provider extends Authenticatable
{
     use HasApiTokens, HasFactory, Notifiable;

     protected $fillable = [
    
        'name',
        'email',
        'phone',
        'service',
        'location',
        'status',
        'latitude',
        'longitude',
    ];

    protected $nullable=['user_id'];
 
public function services()
{
    return $this->belongsToMany(Service::class, 'provider_services');
}
public function bookings()
{
    return $this->hasMany(Booking::class, 'provider_id');

    
}

public function ratings()
{
return $this->hasMany(Rating::class, 'provider_id');
}


}