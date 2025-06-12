<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    use HasFactory;

     protected $fillable = [
        'name',
        'email',
        'service',
        'location',
         'status',
        'availability',
    
    ];
  public function services()
{
    return $this->belongsToMany(Service::class, 'provider_service', 'provider_id', 'service_id');
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

    
}
