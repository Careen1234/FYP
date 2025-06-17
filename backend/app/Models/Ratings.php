<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ratings extends Model
{
    use HasFactory;

    protected $fillable = ['user_id','provider_id','service_id', 'rating', 'reviews'];

    public function user()
{
    return $this->belongsTo(User::class);
}

public function provider()
{
    return $this->belongsTo(User::class); 
}

public function service()
{
    return $this->belongsTo(Service::class);
}

}