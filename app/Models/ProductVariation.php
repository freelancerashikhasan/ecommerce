<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductVariation extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'product_id', 'sku', 'regular_price', 'sale_price',
        'stock_quantity', 'image', 'is_default', 'attributes'
    ];

    protected $casts = [
        'attributes' => 'array',
        'is_default' => 'boolean'
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getDisplayPriceAttribute()
    {
        return $this->sale_price ?? $this->regular_price;
    }
}