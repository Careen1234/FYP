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
        'service',
        'location',
         'status',
        'availability',
    
    ];

    protected $nullable=['user_id'];
  public function services()
{
    return $this->belongsTo(Service::class, 'provider_service', 'provider_id', 'service_id');
}



    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function category()
    {
        return $this->belongsTo(ServiceCategory::class, 'service', 'id');
    }
    public function ratings()
{
    return $this->hasMany(Ratings::class);
}

public function getAverageRatingAttribute()
{
    return $this->ratings()->avg('rating');
}

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    
}
