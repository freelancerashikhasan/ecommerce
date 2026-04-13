<?php
// app/Http/Controllers/Admin/PromotionController.php

namespace App\Http\Controllers\Admin;

use App\DataTables\PromotionDataTable;
use App\Http\Controllers\Controller;
use App\Models\Promotion;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PromotionController extends Controller
{
    public function index(PromotionDataTable $dataTable)
    {
        return $dataTable->render('admin.promotions.index');
    }

    public function create()
    {
        $products = Product::where('status', 1)->get();
        return view('admin.promotions.create', compact('products'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'type' => 'required|in:slider,feature_card,feature_product',
            'position' => 'required|in:top,middle,bottom',
            'order' => 'required|integer|min:0',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:255',
            'price' => 'nullable|numeric',
            'original_price' => 'nullable|numeric',
            'badge_text' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'product_id' => 'nullable|exists:products,id',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('promotions', 'public');
            $validated['image'] = $path;
        }

        Promotion::create($validated);

        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Promotion created successfully'
            ]);
        }

        return redirect()->route('admin.promotions.index')
            ->with('success', 'Promotion created successfully');
    }

    public function edit($id)
    {
        $promotion = Promotion::findOrFail($id);
        $products = Product::where('status', 1)->get();
        return view('admin.promotions.edit', compact('promotion', 'products'));
    }

    public function update(Request $request, $id)
    {
        $promotion = Promotion::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'type' => 'required|in:slider,feature_card,feature_product',
            'position' => 'required|in:top,middle,bottom',
            'order' => 'required|integer|min:0',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:255',
            'price' => 'nullable|numeric',
            'original_price' => 'nullable|numeric',
            'badge_text' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'product_id' => 'nullable|exists:products,id',
        ]);

        if ($request->hasFile('image')) {
            if ($promotion->image) {
                Storage::disk('public')->delete($promotion->image);
            }
            $path = $request->file('image')->store('promotions', 'public');
            $validated['image'] = $path;
        }

        $promotion->update($validated);

        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Promotion updated successfully'
            ]);
        }

        return redirect()->route('admin.promotions.index')
            ->with('success', 'Promotion updated successfully');
    }

    public function destroy($id)
    {
        $promotion = Promotion::findOrFail($id);
        if ($promotion->image) {
            Storage::disk('public')->delete($promotion->image);
        }
        $promotion->delete();

        return response()->json([
            'success' => true,
            'message' => 'Promotion deleted successfully'
        ]);
    }
}