<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

     protected $fillable = ['name', 'description',  'service_category_id'];

    public function category()
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
}
public function providers()
{
    return $this->belongsToMany(Provider::class, 'provider_services', 'service_id', 'provider_id');
}

public function providerServices()
{
    return $this->hasMany(ProviderService::class);

}
}