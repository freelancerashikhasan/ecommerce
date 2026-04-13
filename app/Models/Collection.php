<?php
// app/Models/Collection.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Collection extends Model
{
    use SoftDeletes;

    protected $table = 'collections';

    protected $fillable = [
        'name', 'slug', 'description', 'image', 'order', 'status', 'type', 'metadata'
    ];

    protected $casts = [
        'status' => 'boolean',
        'order' => 'integer',
        'metadata' => 'array',
    ];

    // If product belongs to one collection
    public function products()
    {
        return $this->hasMany(Product::class);
    }
    
    // If product can belong to multiple collections
    public function productsMany()
    {
        return $this->belongsToMany(Product::class, 'product_collection');
    }

    public function getImageUrlAttribute()
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }
}