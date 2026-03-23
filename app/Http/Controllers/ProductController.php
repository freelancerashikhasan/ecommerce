<?php
// app/Http/Controllers/ProductController.php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function collections()
    {
        // Fetch all active categories with their products (limited to 6 per category)
        $collections = ProductCategory::where('status', true)
            ->with(['products' => function($query) {
                $query->where('status', true)
                    ->latest()
                    ->limit(6);
            }])
            ->orderBy('order')
            ->get()
            ->map(function($category) {
                return [
                    'id' => $category->id,
                    'title' => $category->name,
                    'description' => $category->description ?? "Don't miss this opportunity at a special discount just for this week.",
                    'products' => $category->products->map(function($product) {
                        // Determine badge
                        $badge = null;
                        if ($product->sale_price) {
                            $badge = 'Sale';
                        } elseif ($product->created_at->gt(now()->subDays(7))) {
                            $badge = 'New';
                        }

                        return [
                            'id' => $product->id,
                            'name' => $product->name,
                            'slug' => $product->slug,
                            'image' => $product->featured_image ? asset('storage/' . $product->featured_image) : null,
                            'price' => $product->sale_price ?? $product->regular_price,
                            'originalPrice' => $product->regular_price,
                            'rating' => $product->average_rating ?? 4.0, // You'll need to implement this
                            'badge' => $badge
                        ];
                    })
                ];
            });

        return Inertia::render('Home', [
            'collections' => $collections
        ]);
    }

    public function show($slug)
    {
        $product = Product::where('slug', $slug)
            ->where('status', true)
            ->with(['categories', 'images', 'variations'])
            ->firstOrFail();

        // Get related products from same categories
        $categoryIds = $product->categories->pluck('id')->toArray();

        $relatedProducts = Product::where('status', true)
            ->where('id', '!=', $product->id)
            ->whereHas('categories', function($query) use ($categoryIds) {
                $query->whereIn('product_categories.id', $categoryIds);
            })
            ->limit(4)
            ->get();

        return Inertia::render('Products/Show', [
            'product' => array_merge($product->toArray(), [
                'featured_image' => $product->featured_image,
                'images' => $product->images,
                'categories' => $product->categories,
                'related_products' => $relatedProducts,
                'average_rating' => 4.5, // You'll need to implement actual rating
                'reviews_count' => 12 // You'll need to implement actual count
            ])
        ]);
    }
}
