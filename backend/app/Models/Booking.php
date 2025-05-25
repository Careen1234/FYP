<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'service_id', 'booking_date', 'status', 'address', 'latitude', 'longitude', 'provider_id', 'is_paid'];
    public function user()
    {
        return $this->belongsTo(User::class,);
    }
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
    public function category()
    {
        return $this->belongsToThrough(ServiceCategory::class, Service::class);
    }
    public function provider(){
        return $this->belongsTo(Provider::class);
    }
 
}
