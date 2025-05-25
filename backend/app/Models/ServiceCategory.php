<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceCategory extends Model
{
    use HasFactory;

    protected $fillable=['name'];

    public function service()
    {
        return $this->hasMany(Service::class);
    }
    public function bookings()
    {
        return $this->hasManyThrough(Booking::class, Service::class);
    }
}
