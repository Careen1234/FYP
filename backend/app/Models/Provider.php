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
        'bio',
        'profile_photo',
        'instagram',
        'price',
        'facebook',
        'website',
        'status',
        'latitude',
        'longitude',
        
    ];

    protected $nullable=['user_id'];
 
public function services()
{
    return $this->belongsToMany(Service::class, 'provider_services','provider_id');
}
public function bookings()
{
    return $this->hasMany(Booking::class, 'provider_id');

    
}

public function ratings()
{
return $this->hasMany(Rating::class, 'provider_id');
}


public function basicUser()
{
    return $this->belongsTo(User::class, 'user_id'); // only if providers reference users
}



}