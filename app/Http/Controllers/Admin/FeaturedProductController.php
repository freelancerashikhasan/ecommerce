<?php
namespace App\Http\Controllers\Admin;

use App\DataTables\FeaturedProductDataTable;
use App\Http\Controllers\Controller;
use App\Models\FeaturedProduct;
use App\Models\Product;
use Illuminate\Http\Request;

class FeaturedProductController extends Controller
{
    public function index(FeaturedProductDataTable $dataTable)
    {
        return $dataTable->render('admin.featured-products.index');
    }

    public function create()
    {
        $products = Product::where('status', true)->orderBy('name')->get();
        return view('admin.featured-products.create', compact('products'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:featured,new_arrival,today_deal,best_seller',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'discount_amount' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'order' => 'nullable|integer'
        ]);

        // Check if product already has this type
        $exists = FeaturedProduct::where('product_id', $request->product_id)
            ->where('type', $request->type)
            ->exists();

        if ($exists) {
            return response()->json(['success' => false, 'message' => 'Product already has this feature type'], 400);
        }

        FeaturedProduct::create([
            'product_id' => $request->product_id,
            'type' => $request->type,
            'discount_percentage' => $request->discount_percentage,
            'discount_amount' => $request->discount_amount,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'order' => $request->order ?? 0,
            'status' => $request->has('status')
        ]);

        return response()->json(['success' => true, 'message' => 'Featured product created successfully']);
    }

    public function edit($id)
    {
        $featured = FeaturedProduct::with('product')->findOrFail($id);
        $products = Product::where('status', true)->orderBy('name')->get();
        
        return view('admin.featured-products.edit', compact('featured', 'products'));
    }

    public function update(Request $request, $id)
    {
        $featured = FeaturedProduct::findOrFail($id);

        $request->validate([
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:featured,new_arrival,today_deal,best_seller',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'discount_amount' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'order' => 'nullable|integer'
        ]);

        // Check if product already has this type (excluding current)
        $exists = FeaturedProduct::where('product_id', $request->product_id)
            ->where('type', $request->type)
            ->where('id', '!=', $id)
            ->exists();

        if ($exists) {
            return response()->json(['success' => false, 'message' => 'Product already has this feature type'], 400);
        }

        $featured->update([
            'product_id' => $request->product_id,
            'type' => $request->type,
            'discount_percentage' => $request->discount_percentage,
            'discount_amount' => $request->discount_amount,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'order' => $request->order ?? 0,
            'status' => $request->has('status')
        ]);

        return response()->json(['success' => true, 'message' => 'Featured product updated successfully']);
    }

    public function destroy($id)
    {
        $featured = FeaturedProduct::findOrFail($id);
        $featured->delete();

        return response()->json(['success' => true, 'message' => 'Featured product deleted successfully']);
    }
}