<?php
// app/Models/Category.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $fillable = [
        'name', 'slug', 'description', 'image', 'order', 'status'
    ];
    
    /**
     * Get the products for this category (using direct foreign key)
     */
    public function products()
    {
        return $this->hasMany(Product::class, 'category_id');
    }
    
    /**
     * Get the subcategories for this category
     */
    public function subcategories()
    {
        return $this->hasMany(Subcategory::class);
    }
    
    /**
     * Get the active products count
     */
    public function getActiveProductsCountAttribute()
    {
        return $this->products()
            ->where('status', 1)
            ->count();
    }
}