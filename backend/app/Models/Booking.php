<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'service_id', 'booking_date', 'status', 'address', 'latitude', 'longitude', 'provider_id', 'is_paid', 'payment_method', 'provider_service_id'];
    


public function user1()
{
    return $this->belongsTo(\App\Models\Userbasic::class, 'user_id'); 
}

public function provider()
{
    return $this->belongsTo(\App\Models\Provider::class, 'provider_id');
}

public function service()
{
    return $this->belongsTo(\App\Models\Service::class);
}

public function providerService()
{
    return $this->belongsTo(\App\Models\ProviderService::class, 'provider_service_id','service_id');
}
 public function user()
{
    return $this->belongsTo(UserBasic::class, 'user_id');
}

// Booking.php
public function generalUser()
{
    return $this->belongsTo(User::class, 'user_id');
}

public function category()
    {
        return $this->belongsToThrough(ServiceCategory::class, Service::class);
    }
    
}


