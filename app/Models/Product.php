<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory, SoftDeletes;
    

    protected $fillable = [
        'name', 'slug', 'short_description', 'description', 'video_link', 'sku',
        'regular_price', 'sale_price', 'purchase_price', 'stock_quantity',
        'manage_stock', 'in_stock', 'featured_image', 'product_type',
        'specifications', 'additional_info', 'status', 'category_id', 'subcategory_id', 'collection_id'
    ];

    protected $casts = [
        'specifications' => 'array',
        'additional_info' => 'array',
        'manage_stock' => 'boolean',
        'in_stock' => 'boolean',
        'status' => 'boolean',
        'regular_price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'purchase_price' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class);
    }

  public function collection()
    {
        return $this->belongsTo(Collection::class);
    }
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('order');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_product');
    }
   

    public function variations(): HasMany
    {
        return $this->hasMany(ProductVariation::class);
    }

    public function featuredProducts(): HasMany
    {
        return $this->hasMany(FeaturedProduct::class);
    }

    public function getDisplayPriceAttribute()
    {
        return $this->sale_price ?? $this->regular_price;
    }

    public function getDiscountPercentageAttribute()
    {
        if ($this->sale_price && $this->regular_price > 0) {
            return round((($this->regular_price - $this->sale_price) / $this->regular_price) * 100);
        }
        return 0;
    }
}