<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MannualOrder extends Model
{
    use HasFactory;

    protected $table = 'manual_orders';

    protected $fillable = [
        'customer_name',
        'customer_email',
        'customer_phone',
        'shipping_address',
        'delivery_area',
        'product_name',
        'product_link',
        'product_details',
        'quantity',
        'expected_price',
        'preferred_payment',
        'special_instructions',
        'order_source',
        'status',
        'final_price',
        'admin_notes',
        'reviewed_at',
        'approved_at'
    ];

    protected $casts = [
        'quantity' => 'integer',
        'expected_price' => 'decimal:2',
        'final_price' => 'decimal:2',
        'reviewed_at' => 'datetime',
        'approved_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Accessor for delivery charge
    public function getDeliveryChargeAttribute()
    {
        return $this->delivery_area === 'inside' ? 60 : 120;
    }

    // Scope for pending orders
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    // Check if order is reviewable
    public function isReviewable()
    {
        return in_array($this->status, ['pending', 'reviewing']);
    }
}