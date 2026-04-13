<?php
// app/Http/Controllers/ProductController.php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Collection;
use App\Models\Promotion;
use App\Models\FeatureCard;
use App\Models\Review;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // public function collections()
    // {
    //     // Fetch all active categories with their products
    //   $collections = Collection::where('status', true)
    //         ->with(['products' => function($query) {
    //             $query->where('status', true)
    //                 ->latest()
    //                 ->limit(6);
    //         }])
    //         ->orderBy('order')
    //         ->get()
    //         ->map(function($category) {
    //             return [
    //                 'id' => $category->id,
    //                 'title' => $category->name,
    //                 'description' => $category->description ?? "Don't miss this opportunity at a special discount just for this week.",
    //                 'products' => $category->products->map(function($product) {
    //                     // Determine badge
    //                     $badge = null;
    //                     if ($product->sale_price) {
    //                         $badge = 'Sale';
    //                     } elseif ($product->created_at->gt(now()->subDays(7))) {
    //                         $badge = 'New';
    //                     }

    //                     return [
    //                         'id' => $product->id,
    //                         'name' => $product->name,
    //                         'slug' => $product->slug,
    //                         'image' => $product->featured_image ? $product->featured_image : null,
    //                         'price' => $product->sale_price ?? $product->regular_price,
    //                         'originalPrice' => $product->regular_price,
    //                         'rating' => $product->average_rating ?? 4.0, // You'll need to implement this
    //                         'badge' => $badge
    //                     ];
    //                 })
    //             ];
    //         });

    //     // Get feature cards from database
    //     $featureCards = FeatureCard::where('is_active', true)
    //         ->orderBy('order')
    //         ->get()
    //         ->map(function($card) {
    //             return [
    //                 'id' => $card->id,
    //                 'icon' => $card->icon,
    //                 'title' => $card->title,
    //                 'description' => $card->description
    //             ];
    //         });

    //     // Get sliders
    //     $sliders = Promotion::active()
    //         ->where('type', 'slider')
    //         ->orderBy('order')
    //         ->get()
    //         ->map(function($slider) {
    //             return [
    //                 'id' => $slider->id,
    //                 'title' => $slider->title,
    //                 'description' => $slider->description,
    //                 'image' => $slider->image ? asset('storage/' . $slider->image) : '/assets/images/slider-01.png',
    //                 'price' => $slider->price,
    //                 'originalPrice' => $slider->original_price,
    //                 'offerText' => $slider->subtitle ?? $slider->badge_text,
    //                 'button_text' => $slider->button_text ?? 'Shop Now',
    //                 'button_link' => $slider->button_link ?? '/shop'
    //             ];
    //         });

    //     // Get feature products
    //     $featureProducts = Promotion::active()
    //         ->whereIn('type', ['feature_product','feature_card'])
    //         ->with('product')
    //         ->orderBy('order')
    //         ->limit(3)
    //         ->get()
    //         ->map(function($promo) {
    //             $product = $promo->product;
    //             return [
    //                 'id' => $promo->id,
    //                 'badge_text' => $promo->badge_text ?? ($product && $product->sale_price ? 'Sale' : 'Only This Week'),
    //                 'title' => $promo->title ?? ($product ? $product->name : 'Special Offer'),
    //                 'description' => $promo->description ?? ($product ? $product->short_description : 'Limited time offer'),
    //               'image' => $promo->image
    //                         ? asset('storage/' . $promo->image)
    //                         : ($product && $product->featured_image
    //                             ? asset('storage/' . $product->featured_image)
    //                             : null),
    //                 'button_text' => $promo->button_text ?? 'Shop Now',
    //                 'button_link' => $promo->button_link ?? ($product ? route('product.show', $product->slug) : '/shop'),
    //                 'price' => $promo->price ?? ($product ? ($product->sale_price ?? $product->regular_price) : null),
    //                 'original_price' => $promo->original_price ?? ($product ? $product->regular_price : null)
    //             ];
    //         })
    //         ->filter();

    //     return Inertia::render('Home', [
    //         'collections' => $collections,
    //         'sliders' => $sliders,
    //         'featureCards' => $featureCards,
    //         'featureProducts' => $featureProducts
    //     ]);
    // }
       public function collections()
    {
        // Fetch all active categories with their subcategories
        $categories = Category::where('status', 1)
            ->with(['subcategories' => function($query) {
                $query->where('status', 1)
                    ->orderBy('order');
            }])
            ->orderBy('order')
            ->get()
            ->map(function($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'subcategories' => $category->subcategories->map(function($subcategory) {
                        return [
                            'id' => $subcategory->id,
                            'name' => $subcategory->name,
                            'slug' => $subcategory->slug,
                            'category_id' => $subcategory->category_id
                        ];
                    })
                ];
            });

        // Fetch collections with products
        $collections = Collection::where('status', 1)
            ->with(['products' => function($query) {
                $query->where('status', 1)
                    ->latest()
                    ->limit(6);
            }])
            ->orderBy('order')
            ->get()
            ->map(function($collection) {
                return [
                    'id' => $collection->id,
                    'title' => $collection->name,
                    'slug' => $collection->slug,
                    'description' => $collection->description ?? "Don't miss this opportunity at a special discount just for this week.",
                    'products' => $collection->products->map(function($product) {
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
                            'image' => $product->featured_image ? '/storage/' . $product->featured_image : null,
                            'price' => $product->sale_price ?? $product->regular_price,
                            'originalPrice' => $product->regular_price,
                            'rating' => $product->average_rating ?? 4.0,
                            'badge' => $badge
                        ];
                    })
                ];
            });

        // Get feature cards from database
        $featureCards = FeatureCard::where('is_active', 1)
            ->orderBy('order')
            ->get()
            ->map(function($card) {
                return [
                    'id' => $card->id,
                    'icon' => $card->icon,
                    'title' => $card->title,
                    'description' => $card->description
                ];
            });

        // Get sliders
        $sliders = Promotion::where('is_active', 1)
            ->where('type', 'slider')
            ->orderBy('order')
            ->get()
            ->map(function($slider) {
                return [
                    'id' => $slider->id,
                    'title' => $slider->title,
                    'description' => $slider->description,
                    'image' => $slider->image ? asset('storage/' . $slider->image) : '/assets/images/slider-01.png',
                    'price' => $slider->price,
                    'originalPrice' => $slider->original_price,
                    'offerText' => $slider->subtitle ?? $slider->badge_text,
                    'button_text' => $slider->button_text ?? 'Shop Now',
                    'button_link' => $slider->button_link ?? '/shop'
                ];
            });

        // Get feature products
        $featureProducts = Promotion::where('is_active', 1)
            ->whereIn('type', ['feature_product','feature_card'])
            ->with('product')
            ->orderBy('order')
            ->limit(3)
            ->get()
            ->map(function($promo) {
                $product = $promo->product;
                return [
                    'id' => $promo->id,
                    'badge_text' => $promo->badge_text ?? ($product && $product->sale_price ? 'Sale' : 'Only This Week'),
                    'title' => $promo->title ?? ($product ? $product->name : 'Special Offer'),
                    'description' => $promo->description ?? ($product ? $product->short_description : 'Limited time offer'),
                    'image' => $promo->image
                            ? asset('storage/' . $promo->image)
                            : ($product && $product->featured_image
                                ? asset('storage/' . $product->featured_image)
                                : null),
                    'button_text' => $promo->button_text ?? 'Shop Now',
                    'button_link' => $promo->button_link ?? ($product ? route('product.show', $product->slug) : '/shop'),
                    'price' => $promo->price ?? ($product ? ($product->sale_price ?? $product->regular_price) : null),
                    'original_price' => $promo->original_price ?? ($product ? $product->regular_price : null)
                ];
            })
            ->filter();

        return Inertia::render('Home', [
            'categories' => $categories,
            'collections' => $collections,
            'sliders' => $sliders,
            'featureCards' => $featureCards,
            'featureProducts' => $featureProducts
        ]);
    }

        public function show($slug)
        {
            $product = Product::where('slug', $slug)
                ->where('status', true)
                ->with(['category', 'images', 'variations']) // Make sure variations is included
                ->firstOrFail();

            $relatedProducts = Product::where('status', true)
                ->where('id', '!=', $product->id)
                ->where('category_id', $product->category_id)
                ->limit(4)
                ->get();

            return Inertia::render('Products/Show', [
                'product' => array_merge($product->toArray(), [
                    'featured_image' => $product->featured_image,
                    'price' => $product->sale_price,
                    'images' => $product->images,
                    'variations' => $product->variations, // Ensure variations are included
                    'related_products' => $relatedProducts,
                    'average_rating' => 4.5,
                    'reviews_count' => 12,
                    'product_type' => $product->product_type // Add product type
                ])
            ]);
        }

     public function getHeaderCollections()
    {
        return Collection::active()
            ->ordered()
            ->select('id', 'name', 'slug', 'type')
            ->limit(10)
            ->get();
    }
}