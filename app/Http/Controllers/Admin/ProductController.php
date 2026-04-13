<?php
// app/Http/Controllers/Admin/ProductController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Collection;
use App\Models\Attribute;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax()) {
            $products = Product::with(['category', 'collection'])
                ->orderBy('id', 'desc');
            
            return datatables()->of($products)
                ->addColumn('image', function($product) {
                    if ($product->featured_image && Storage::disk('public')->exists($product->featured_image)) {
                        return '<img src="' . asset('storage/' . $product->featured_image) . '" style="height: 50px; width: 50px; object-fit: cover; border-radius: 8px;">';
                    }
                    return '<div class="bg-light d-flex align-items-center justify-content-center" style="height: 50px; width: 50px; border-radius: 8px;">
                                <i class="ri-image-line" style="font-size: 20px;"></i>
                            </div>';
                })
                ->addColumn('price', function($product) {
                    $price = '<div class="fw-bold">৳' . number_format($product->regular_price, 2) . '</div>';
                    if ($product->sale_price) {
                        $price .= '<small class="text-muted text-decoration-line-through">৳' . number_format($product->sale_price, 2) . '</small>';
                    }
                    return $price;
                })
                ->addColumn('stock', function($product) {
                    if ($product->manage_stock) {
                        $badgeClass = $product->stock_quantity > 0 ? 'success' : 'danger';
                        return '<span class="badge bg-' . $badgeClass . '">' . $product->stock_quantity . ' in stock</span>';
                    }
                    return '<span class="badge bg-info">Unlimited</span>';
                })
                ->addColumn('status', function($product) {
                    $checked = $product->status ? 'checked' : '';
                    return '<div class="form-check form-switch">
                        <input class="form-check-input toggle-status" type="checkbox" data-id="' . $product->id . '" ' . $checked . '>
                    </div>';
                })
                ->addColumn('action', function($product) {
                    $buttons = '<a href="' . route('admin.products.edit', $product->id) . '" class="btn btn-sm btn-primary me-2">
                                    <i class="ri-edit-line"></i>
                                </a>';
                    $buttons .= '<button class="btn btn-sm btn-danger" onclick="deleteProduct(' . $product->id . ')">
                                    <i class="ri-delete-bin-line"></i>
                                </button>';
                    return $buttons;
                })
                ->rawColumns(['image', 'price', 'stock', 'status', 'action'])
                ->make(true);
        }
        
        return view('admin.products.index');
    }
    
    public function create()
    {
        $categories = Category::where('status', true)->orderBy('order')->get();
        $collections = Collection::where('status', true)->orderBy('order')->get();
        $attributes = Attribute::all();
        
        return view('admin.products.create', compact('categories', 'collections', 'attributes'));
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'nullable|exists:subcategories,id',
            'collection_id' => 'nullable|exists:collections,id',
            'regular_price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:regular_price',
            'purchase_price' => 'nullable|numeric|min:0',
            'featured_image' => 'nullable|image|max:2048',
            'images.*' => 'nullable|image|max:2048',
            'video_link' => 'nullable|url',
            'product_type' => 'required|in:simple,variable',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
        ]);
        
        $data = $request->all();
        $data['slug'] = Str::slug($request->name);
        $data['status'] = $request->has('status');
        $data['manage_stock'] = $request->has('manage_stock');
        $data['in_stock'] = $request->has('in_stock');
        
        // Handle specifications
        if ($request->has('spec_keys') && $request->has('spec_values')) {
            $specifications = [];
            foreach ($request->spec_keys as $index => $key) {
                if (!empty($key) && isset($request->spec_values[$index])) {
                    $specifications[$key] = $request->spec_values[$index];
                }
            }
            $data['specifications'] = $specifications;
        }
        
        // Handle additional info
        if ($request->has('info_keys') && $request->has('info_values')) {
            $additionalInfo = [];
            foreach ($request->info_keys as $index => $key) {
                if (!empty($key) && isset($request->info_values[$index])) {
                    $additionalInfo[$key] = $request->info_values[$index];
                }
            }
            $data['additional_info'] = $additionalInfo;
        }
        
        // Handle featured image
        if ($request->hasFile('featured_image')) {
            $path = $request->file('featured_image')->store('products', 'public');
            $data['featured_image'] = $path;
        }
        
        // Create product
        $product = Product::create($data);
        
        // Handle gallery images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products/gallery', 'public');
                $product->images()->create(['image_path' => $path]);
            }
        }
        
        // Handle variations for variable products
        if ($request->product_type == 'variable' && $request->has('variations')) {
            foreach ($request->variations as $variationData) {
                if (isset($variationData['sku']) && !empty($variationData['sku'])) {
                    $variationData['product_id'] = $product->id;
                    $variationData['is_default'] = isset($variationData['is_default']);
                    
                    if (isset($variationData['image']) && $variationData['image'] instanceof \Illuminate\Http\UploadedFile) {
                        $path = $variationData['image']->store('products/variations', 'public');
                        $variationData['image'] = $path;
                    }
                    
                    $product->variations()->create($variationData);
                }
            }
        }
        
        return response()->json([
            'success' => true, 
            'message' => 'Product created successfully!',
            'redirect' => route('admin.products.index')
        ]);
    }
    
    public function edit($id)
    {
        $product = Product::with(['images', 'variations', 'category', 'subcategory', 'collection'])->findOrFail($id);
        $categories = Category::where('status', true)->orderBy('order')->get();
        $subcategories = Subcategory::where('status', true)->orderBy('order')->get();
        $collections = Collection::where('status', true)->orderBy('order')->get();
        $attributes = Attribute::all();
        
        return view('admin.products.edit', compact('product', 'categories', 'collections', 'attributes','subcategories'));
    }
    
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku,' . $id,
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'nullable|exists:subcategories,id',
            'collection_id' => 'nullable|exists:collections,id',
            'regular_price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:regular_price',
            'purchase_price' => 'nullable|numeric|min:0',
            'featured_image' => 'nullable|image|max:2048',
            'images.*' => 'nullable|image|max:2048',
            'video_link' => 'nullable|url',
            'product_type' => 'required|in:simple,variable',
        ]);
        
        $data = $request->all();
        $data['slug'] = Str::slug($request->name);
        $data['status'] = $request->has('status');
        $data['manage_stock'] = $request->has('manage_stock');
        $data['in_stock'] = $request->has('in_stock');
        
        // Handle specifications
        if ($request->has('spec_keys') && $request->has('spec_values')) {
            $specifications = [];
            foreach ($request->spec_keys as $index => $key) {
                if (!empty($key) && isset($request->spec_values[$index])) {
                    $specifications[$key] = $request->spec_values[$index];
                }
            }
            $data['specifications'] = $specifications;
        } else {
            $data['specifications'] = null;
        }
        
        // Handle additional info
        if ($request->has('info_keys') && $request->has('info_values')) {
            $additionalInfo = [];
            foreach ($request->info_keys as $index => $key) {
                if (!empty($key) && isset($request->info_values[$index])) {
                    $additionalInfo[$key] = $request->info_values[$index];
                }
            }
            $data['additional_info'] = $additionalInfo;
        } else {
            $data['additional_info'] = null;
        }
        
        // Handle featured image
        if ($request->hasFile('featured_image')) {
            if ($product->featured_image && Storage::disk('public')->exists($product->featured_image)) {
                Storage::disk('public')->delete($product->featured_image);
            }
            $path = $request->file('featured_image')->store('products', 'public');
            $data['featured_image'] = $path;
        }
        
        $product->update($data);
        
        // Handle deleted gallery images
        if ($request->has('deleted_images')) {
            $deletedIds = explode(',', $request->deleted_images);
            foreach ($deletedIds as $imageId) {
                $image = $product->images()->find($imageId);
                if ($image) {
                    if (Storage::disk('public')->exists($image->image_path)) {
                        Storage::disk('public')->delete($image->image_path);
                    }
                    $image->delete();
                }
            }
        }
        
        // Handle new gallery images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products/gallery', 'public');
                $product->images()->create(['image_path' => $path]);
            }
        }
        
        // Handle variations
        if ($request->product_type == 'variable') {
            // Track existing variation IDs to delete removed ones
            $existingVariationIds = $product->variations()->pluck('id')->toArray();
            $updatedVariationIds = [];
            
            if ($request->has('variations')) {
                foreach ($request->variations as $variationData) {
                    if (isset($variationData['sku']) && !empty($variationData['sku'])) {
                        $variationData['product_id'] = $product->id;
                        $variationData['is_default'] = isset($variationData['is_default']);
                        
                        if (isset($variationData['image']) && $variationData['image'] instanceof \Illuminate\Http\UploadedFile) {
                            $path = $variationData['image']->store('products/variations', 'public');
                            $variationData['image'] = $path;
                        }
                        
                        if (isset($variationData['id']) && $variationData['id']) {
                            $variation = $product->variations()->find($variationData['id']);
                            if ($variation) {
                                $variation->update($variationData);
                                $updatedVariationIds[] = $variation->id;
                            }
                        } else {
                            $newVariation = $product->variations()->create($variationData);
                            $updatedVariationIds[] = $newVariation->id;
                        }
                    }
                }
            }
            
            // Delete variations that were removed
            $variationsToDelete = array_diff($existingVariationIds, $updatedVariationIds);
            foreach ($variationsToDelete as $variationId) {
                $variation = $product->variations()->find($variationId);
                if ($variation) {
                    if ($variation->image && Storage::disk('public')->exists($variation->image)) {
                        Storage::disk('public')->delete($variation->image);
                    }
                    $variation->delete();
                }
            }
        }
        
        return response()->json([
            'success' => true, 
            'message' => 'Product updated successfully!',
            'redirect' => route('admin.products.index')
        ]);
    }
    
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        // Delete featured image
        if ($product->featured_image && Storage::disk('public')->exists($product->featured_image)) {
            Storage::disk('public')->delete($product->featured_image);
        }
        
        // Delete gallery images
        foreach ($product->images as $image) {
            if (Storage::disk('public')->exists($image->image_path)) {
                Storage::disk('public')->delete($image->image_path);
            }
        }
        
        // Delete variation images
        foreach ($product->variations as $variation) {
            if ($variation->image && Storage::disk('public')->exists($variation->image)) {
                Storage::disk('public')->delete($variation->image);
            }
        }
        
        $product->delete();
        
        return response()->json([
            'success' => true, 
            'message' => 'Product deleted successfully!'
        ]);
    }
    
    public function toggleStatus($id)
    {
        $product = Product::findOrFail($id);
        $product->status = !$product->status;
        $product->save();
        
        return response()->json([
            'success' => true, 
            'message' => 'Product status updated successfully!'
        ]);
    }
    
    public function getSubcategories($categoryId)
    {
        $subcategories = Subcategory::where('category_id', $categoryId)
            ->where('status', true)
            ->orderBy('order')
            ->get(['id', 'name']);
            
        return response()->json($subcategories);
    }
}