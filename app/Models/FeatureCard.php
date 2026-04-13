<?php
// app/Models/FeatureCard.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeatureCard extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'icon', 'order', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}