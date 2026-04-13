<?php
// app/Http/Controllers/ProductFilterController.php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Collection;
use App\Models\ProductVariation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ProductFilterController extends Controller
{
    public function index(Request $request, $slug = null)
    {
        $query = Product::where('status', 1)
            ->with(['category', 'subcategory', 'collection', 'images' => function($q) {
                $q->orderBy('order', 'asc');
            }]);

        // Check if we're on a collection route
        $currentCollection = null;
        if ($slug && request()->route()->getName() === 'products.collection') {
            $currentCollection = Collection::where('slug', $slug)->where('status', 1)->firstOrFail();
            $query->where('collection_id', $currentCollection->id);
            // Merge the collection slug into request for active filters
            $request->merge(['collection' => $slug]);
        }
        
        // Apply category filter (using direct category_id)
        if ($request->has('category') && !empty($request->category)) {
            $category = Category::where('slug', $request->category)->first();
            if ($category) {
                $query->where('category_id', $category->id);
            }
        }
        
        // Apply subcategory filter (using direct subcategory_id)
        if ($request->has('subcategory') && !empty($request->subcategory)) {
            $subcategory = Subcategory::where('slug', $request->subcategory)->first();
            if ($subcategory) {
                $query->where('subcategory_id', $subcategory->id);
            }
        }
        
        // Apply multiple categories filter
        if ($request->has('categories') && !empty($request->categories)) {
            $categoryIds = explode(',', $request->categories);
            $query->whereIn('category_id', $categoryIds);
        }
        
        // Apply collection filter (using direct collection_id)
        if ($request->has('collection') && !empty($request->collection)) {
            $collection = Collection::where('slug', $request->collection)->first();
            if ($collection) {
                $query->where('collection_id', $collection->id);
            }
        }
        
        // Apply multiple collections filter
        if ($request->has('collections') && !empty($request->collections)) {
            $collectionIds = explode(',', $request->collections);
            $query->whereIn('collection_id', $collectionIds);
        }
        
        // Apply search filter
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('short_description', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%")
                  ->orWhere('sku', 'like', "%{$searchTerm}%");
            });
        }
        
        // Apply price range filter
        if ($request->has('min_price') && $request->min_price !== null && $request->min_price > 0) {
            $query->where(function($q) use ($request) {
                $q->where(function($sub) use ($request) {
                    $sub->whereNotNull('sale_price')
                        ->where('sale_price', '>=', $request->min_price);
                })->orWhere(function($sub) use ($request) {
                    $sub->whereNull('sale_price')
                        ->where('regular_price', '>=', $request->min_price);
                });
            });
        }
        
        if ($request->has('max_price') && $request->max_price !== null && $request->max_price > 0) {
            $query->where(function($q) use ($request) {
                $q->where(function($sub) use ($request) {
                    $sub->whereNotNull('sale_price')
                        ->where('sale_price', '<=', $request->max_price);
                })->orWhere(function($sub) use ($request) {
                    $sub->whereNull('sale_price')
                        ->where('regular_price', '<=', $request->max_price);
                });
            });
        }
        
        // Apply in stock filter
        if ($request->has('in_stock') && $request->in_stock == '1') {
            $query->where('in_stock', 1)->where('stock_quantity', '>', 0);
        }
        
        // Apply on sale filter
        if ($request->has('on_sale') && $request->on_sale == '1') {
            $query->whereNotNull('sale_price')->whereRaw('sale_price < regular_price');
        }
        
        // Apply variation filters
        $variationFilters = collect($request->all())->filter(function($value, $key) {
            return strpos($key, 'variation_') === 0 && !empty($value);
        });
        
        foreach ($variationFilters as $key => $value) {
            $attributeName = str_replace('variation_', '', $key);
            $query->whereHas('variations', function($q) use ($attributeName, $value) {
                $q->where('attributes', 'like', '%"' . $attributeName . '":"' . $value . '"%');
            });
        }
        
        // Apply sorting
        switch ($request->get('sort', 'newest')) {
            case 'price_low':
                $query->orderByRaw('COALESCE(sale_price, regular_price) ASC');
                break;
            case 'price_high':
                $query->orderByRaw('COALESCE(sale_price, regular_price) DESC');
                break;
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('name', 'desc');
                break;
            case 'popular':
                $query->orderBy('views_count', 'desc');
                break;
            case 'rating':
                $query->orderBy('average_rating', 'desc');
                break;
            default:
                $query->latest();
        }
        
        // Get products with pagination
        $products = $query->paginate(12);
        
        // Format products
        $formattedProducts = $products->getCollection()->map(function($product) {
            $badge = null;
            $discount = null;
            
            if ($product->sale_price && $product->sale_price < $product->regular_price) {
                $badge = 'Sale';
                $discount = round((($product->regular_price - $product->sale_price) / $product->regular_price) * 100);
            } elseif ($product->created_at && $product->created_at->gt(now()->subDays(7))) {
                $badge = 'New';
            }
            
            $firstImage = $product->images->first();
            
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'featured_image' => $product->featured_image 
                    ? '/storage/' . $product->featured_image 
                    : ($firstImage ? '/storage/' . $firstImage->image_path : null),
                'regular_price' => $product->regular_price,
                'sale_price' => $product->sale_price,
                'price' => $product->sale_price ?? $product->regular_price,
                'short_description' => $product->short_description,
                'average_rating' => $product->average_rating ?? 0,
                'reviews_count' => $product->reviews_count ?? 0,
                'badge' => $badge,
                'discount' => $discount,
                'in_stock' => $product->in_stock && $product->stock_quantity > 0,
                'stock_quantity' => $product->stock_quantity,
                'category' => $product->category ? [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                    'slug' => $product->category->slug
                ] : null,
                'subcategory' => $product->subcategory ? [
                    'id' => $product->subcategory->id,
                    'name' => $product->subcategory->name,
                    'slug' => $product->subcategory->slug
                ] : null,
                'collection' => $product->collection ? [
                    'id' => $product->collection->id,
                    'name' => $product->collection->name,
                    'slug' => $product->collection->slug
                ] : null,
            ];
        });
        
        $products->setCollection($formattedProducts);
        
        // Get all categories with product counts
        $categories = Category::where('status', 1)
            ->withCount('products')
            ->orderBy('order')
            ->get()
            ->map(function($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'products_count' => $category->products_count,
                    'image' => $category->image ? '/storage/' . $category->image : null,
                ];
            });
        
        // Get all subcategories
        $subcategories = Subcategory::where('status', 1)
            ->withCount('products')
            ->orderBy('order')
            ->get()
            ->map(function($subcategory) {
                return [
                    'id' => $subcategory->id,
                    'name' => $subcategory->name,
                    'slug' => $subcategory->slug,
                    'category_id' => $subcategory->category_id,
                    'products_count' => $subcategory->products_count,
                ];
            });
        
        // Get all collections with product counts
        $collections = Collection::where('status', 1)
            ->withCount('products')
            ->orderBy('order')
            ->get()
            ->map(function($collection) {
                return [
                    'id' => $collection->id,
                    'name' => $collection->name,
                    'slug' => $collection->slug,
                    'description' => $collection->description,
                    'image' => $collection->image ? '/storage/' . $collection->image : null,
                    'products_count' => $collection->products_count,
                    'type' => $collection->type,
                ];
            });
        
        // Get min and max prices
        $minPrice = Product::where('status', 1)
            ->min(DB::raw('COALESCE(sale_price, regular_price)')) ?? 0;
        $maxPrice = Product::where('status', 1)
            ->max(DB::raw('COALESCE(sale_price, regular_price)')) ?? 1000;
        
        // Get variations
        $variations = $this->extractVariationsFromProducts();
        
        // Get active filters
        $activeFilters = [];
        
        if ($request->has('category') && !empty($request->category)) {
            $category = Category::where('slug', $request->category)->first();
            if ($category) {
                $activeFilters['category'] = [
                    'type' => 'category',
                    'label' => $category->name,
                    'value' => $category->slug,
                ];
            }
        }
        
        if ($request->has('subcategory') && !empty($request->subcategory)) {
            $subcategory = Subcategory::where('slug', $request->subcategory)->first();
            if ($subcategory) {
                $activeFilters['subcategory'] = [
                    'type' => 'subcategory',
                    'label' => $subcategory->name,
                    'value' => $subcategory->slug,
                ];
            }
        }
        
        // Add collections to active filters
        if ($request->has('collection') && !empty($request->collection)) {
            $collection = Collection::where('slug', $request->collection)->first();
            if ($collection) {
                $activeFilters['collection'] = [
                    'type' => 'collection',
                    'label' => $collection->name,
                    'value' => $collection->slug,
                ];
            }
        }
        
        if ($request->has('collections') && !empty($request->collections)) {
            $collectionIds = explode(',', $request->collections);
            $collectionsFiltered = Collection::whereIn('id', $collectionIds)->get();
            foreach ($collectionsFiltered as $collection) {
                $activeFilters['collection_' . $collection->id] = [
                    'type' => 'collection',
                    'label' => $collection->name,
                    'value' => $collection->id,
                ];
            }
        }
        
        if ($request->has('search') && !empty($request->search)) {
            $activeFilters['search'] = [
                'type' => 'search',
                'label' => 'Search: ' . $request->search,
                'value' => $request->search,
            ];
        }
        
        if ($request->has('min_price') && $request->min_price > 0) {
            $activeFilters['min_price'] = [
                'type' => 'price',
                'label' => 'Min Price: $' . $request->min_price,
                'value' => $request->min_price,
            ];
        }
        
        if ($request->has('max_price') && $request->max_price < $maxPrice) {
            $activeFilters['max_price'] = [
                'type' => 'price',
                'label' => 'Max Price: $' . $request->max_price,
                'value' => $request->max_price,
            ];
        }
        
        if ($request->has('in_stock') && $request->in_stock == '1') {
            $activeFilters['in_stock'] = [
                'type' => 'in_stock',
                'label' => 'In Stock Only',
                'value' => '1',
            ];
        }
        
        if ($request->has('on_sale') && $request->on_sale == '1') {
            $activeFilters['on_sale'] = [
                'type' => 'on_sale',
                'label' => 'On Sale',
                'value' => '1',
            ];
        }
        
        // Prepare filters data
        $filters = [
            'products' => $products,
            'activeFilters' => $activeFilters,
            'selectedCategory' => $request->category,
            'selectedSubcategory' => $request->subcategory,
            'selectedCategories' => $request->categories ? explode(',', $request->categories) : [],
            'selectedCollection' => $request->collection,
            'selectedCollections' => $request->collections ? explode(',', $request->collections) : [],
            'priceRange' => [
                'min' => (float)($request->min_price ?: $minPrice),
                'max' => (float)($request->max_price ?: $maxPrice),
                'globalMin' => (float)$minPrice,
                'globalMax' => (float)$maxPrice,
            ],
            'selectedVariations' => $variationFilters->toArray(),
            'sortBy' => $request->get('sort', 'newest'),
            'search' => $request->search,
            'inStock' => $request->in_stock == '1',
            'onSale' => $request->on_sale == '1',
            'currentCollection' => $currentCollection ? [
                'id' => $currentCollection->id,
                'slug' => $currentCollection->slug,
                'name' => $currentCollection->name
            ] : null,
        ];
        
        return Inertia::render('Products/Index', [
            'filters' => $filters,
            'categories' => $categories,
            'subcategories' => $subcategories,
            'collections' => $collections,
            'variations' => $variations,
            'totalProducts' => $products->total(),
            'minPrice' => $minPrice,
            'maxPrice' => $maxPrice,
        ]);
    }
    
    private function extractVariationsFromProducts()
    {
        $variations = ProductVariation::whereHas('product', function($q) {
            $q->where('status', 1);
        })->get();
        
        $variationGroups = [];
        
        foreach ($variations as $variation) {
            $attributes = json_decode($variation->attributes, true);
            if (is_array($attributes)) {
                foreach ($attributes as $type => $value) {
                    if (!isset($variationGroups[$type])) {
                        $variationGroups[$type] = [];
                    }
                    
                    $exists = false;
                    foreach ($variationGroups[$type] as &$existing) {
                        if ($existing['value'] === $value) {
                            $existing['count']++;
                            $exists = true;
                            break;
                        }
                    }
                    
                    if (!$exists) {
                        $variationGroups[$type][] = [
                            'value' => $value,
                            'count' => 1,
                        ];
                    }
                }
            }
        }
        
        $result = [];
        foreach ($variationGroups as $type => $options) {
            $result[] = [
                'type' => $type,
                'options' => $options,
            ];
        }
        
        return $result;
    }
    
    public function byCategory($slug)
    {
        $category = Category::where('slug', $slug)->where('status', 1)->firstOrFail();
        
        $products = Product::where('status', 1)
            ->where('category_id', $category->id)
            ->with(['images' => function($q) {
                $q->orderBy('order', 'asc');
            }])
            ->paginate(12);
            
        return Inertia::render('Products/Index', [
            'category' => $category,
            'products' => $products,
            'title' => $category->name . ' Products'
        ]);
    }
    
    public function bySubcategory($slug)
    {
        $subcategory = Subcategory::where('slug', $slug)->where('status', 1)->firstOrFail();
        
        $products = Product::where('status', 1)
            ->where('subcategory_id', $subcategory->id)
            ->with(['images' => function($q) {
                $q->orderBy('order', 'asc');
            }])
            ->paginate(12);
            
        return Inertia::render('Products/Index', [
            'subcategory' => $subcategory,
            'products' => $products,
            'title' => $subcategory->name . ' Products'
        ]);
    }
    
    public function byCollection($slug)
    {
        // Just redirect to the main index with the collection parameter
        return redirect()->route('products.index', ['collection' => $slug]);
    }
}