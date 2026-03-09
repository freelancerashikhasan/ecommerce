<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')
            ->filter(request(['search', 'category']))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $categories = Category::all();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => request()->only(['search', 'category'])
        ]);
    }

    public function show(Product $product)
    {
        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get();

        return Inertia::render('Products/ProductDetail', [
            'product' => $product->load('category'),
            'relatedProducts' => $relatedProducts
        ]);
    }

    public function featured()
    {
        $products = Product::with('category')
            ->where('featured', true)
            ->limit(8)
            ->get();

        return Inertia::render('Home', [
            'featuredProducts' => $products
        ]);
    }
 
}