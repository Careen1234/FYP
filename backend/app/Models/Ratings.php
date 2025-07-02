<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ratings extends Model
{
    use HasFactory;

   

    protected $fillable = ['user_id','provider_id', 'rating', 'reviews'];

    public function user()
{
    return $this->belongsTo(UserBasic::class);
}

public function provider()
{
    return $this->belongsTo(Provider::class); 
}

public function service()
{
    return $this->belongsTo(Service::class);
}

}