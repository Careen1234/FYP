<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class UserBasic extends Model
{
    use HasFactory;
    protected $table = 'user';

    protected $fillable = [ 
        'name',
        'email',
        'phone',
        'service',
        'location',
         'status',
        'availability',
    ];



    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
}
