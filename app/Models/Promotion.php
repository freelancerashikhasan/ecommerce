<?php
// app/Models/Promotion.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'subtitle', 'description', 'image', 'type', 'position',
        'order', 'button_text', 'button_link', 'price', 'original_price',
        'badge_text', 'metadata', 'is_active', 'start_date', 'end_date', 'product_id'
    ];

    protected $casts = [
        'metadata' => 'array',
        'is_active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function($q) {
                $q->whereNull('start_date')
                    ->orWhere('start_date', '<=', now());
            })
            ->where(function($q) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', now());
            });
    }
}