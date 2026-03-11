<?php
namespace App\Http\Controllers\Admin;

use App\DataTables\ProductDataTable;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Attribute;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(ProductDataTable $dataTable)
    {
        return $dataTable->render('admin.products.index');
    }

    public function create()
    {
        $categories = ProductCategory::where('status', true)->orderBy('name')->get();
        $attributes = Attribute::with('values')->get();
        
        return view('admin.products.create', compact('categories', 'attributes'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku',
            'regular_price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:regular_price',
            'purchase_price' => 'nullable|numeric|min:0',
            'categories' => 'array',
            'categories.*' => 'exists:product_categories,id',
            'featured_image' => 'nullable|image|max:2048',
            'images.*' => 'nullable|image|max:2048',
            'video_link' => 'nullable|url',
            'product_type' => 'required|in:simple,variable'
        ]);

        $data = $request->except(['featured_image', 'images', '_token', 'categories', 'variations']);
        
        // Handle specifications
        if ($request->has('spec_keys') && $request->has('spec_values')) {
            $specifications = [];
            foreach ($request->spec_keys as $index => $key) {
                if (!empty($key) && !empty($request->spec_values[$index])) {
                    $specifications[$key] = $request->spec_values[$index];
                }
            }
            $data['specifications'] = $specifications;
        }

        // Handle additional info
        if ($request->has('info_keys') && $request->has('info_values')) {
            $additionalInfo = [];
            foreach ($request->info_keys as $index => $key) {
                if (!empty($key) && !empty($request->info_values[$index])) {
                    $additionalInfo[$key] = $request->info_values[$index];
                }
            }
            $data['additional_info'] = $additionalInfo;
        }

        // Handle featured image
        if ($request->hasFile('featured_image')) {
            $path = $request->file('featured_image')->store('products/featured', 'public');
            $data['featured_image'] = $path;
        }

        $data['slug'] = Str::slug($request->name);
        $data['status'] = $request->has('status');
        $data['manage_stock'] = $request->has('manage_stock');
        $data['in_stock'] = $request->has('in_stock');

        $product = Product::create($data);

        // Attach categories
        if ($request->has('categories')) {
            $product->categories()->attach($request->categories);
        }

        // Handle multiple images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('products/gallery', 'public');
                $product->images()->create([
                    'image_path' => $path,
                    'order' => $index
                ]);
            }
        }

        // Handle variations for variable products
        if ($request->product_type == 'variable' && $request->has('variations')) {
            foreach ($request->variations as $variationData) {
                if (!empty($variationData['sku'])) {
                    $variation = $product->variations()->create([
                        'sku' => $variationData['sku'],
                        'regular_price' => $variationData['regular_price'],
                        'sale_price' => $variationData['sale_price'] ?? null,
                        'stock_quantity' => $variationData['stock_quantity'] ?? 0,
                        'attributes' => $variationData['attributes'] ?? [],
                        'is_default' => isset($variationData['is_default'])
                    ]);

                    if (isset($variationData['image']) && $variationData['image'] instanceof \Illuminate\Http\UploadedFile) {
                        $path = $variationData['image']->store('products/variations', 'public');
                        $variation->update(['image' => $path]);
                    }
                }
            }
        }

        return response()->json(['success' => true, 'message' => 'Product created successfully']);
    }

    public function edit($id)
    {
        $product = Product::with(['categories', 'images', 'variations'])->findOrFail($id);
        $categories = ProductCategory::where('status', true)->orderBy('name')->get();
        $attributes = Attribute::with('values')->get();
        
        return view('admin.products.edit', compact('product', 'categories', 'attributes'));
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku,' . $id,
            'regular_price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:regular_price',
            'purchase_price' => 'nullable|numeric|min:0',
            'categories' => 'array',
            'categories.*' => 'exists:product_categories,id',
            'featured_image' => 'nullable|image|max:2048',
            'images.*' => 'nullable|image|max:2048',
            'video_link' => 'nullable|url',
            'product_type' => 'required|in:simple,variable'
        ]);

        $data = $request->except(['featured_image', 'images', '_token', '_method', 'categories', 'variations', 'deleted_images']);
        
        // Handle specifications
        if ($request->has('spec_keys') && $request->has('spec_values')) {
            $specifications = [];
            foreach ($request->spec_keys as $index => $key) {
                if (!empty($key) && !empty($request->spec_values[$index])) {
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
                if (!empty($key) && !empty($request->info_values[$index])) {
                    $additionalInfo[$key] = $request->info_values[$index];
                }
            }
            $data['additional_info'] = $additionalInfo;
        } else {
            $data['additional_info'] = null;
        }

        // Handle featured image
        if ($request->hasFile('featured_image')) {
            // Delete old image
            if ($product->featured_image) {
                Storage::disk('public')->delete($product->featured_image);
            }
            $path = $request->file('featured_image')->store('products/featured', 'public');
            $data['featured_image'] = $path;
        }

        $data['slug'] = Str::slug($request->name);
        $data['status'] = $request->has('status');
        $data['manage_stock'] = $request->has('manage_stock');
        $data['in_stock'] = $request->has('in_stock');

        $product->update($data);

        // Sync categories
        $product->categories()->sync($request->categories ?? []);

        // Handle deleted images
        if ($request->has('deleted_images')) {
            $deletedIds = explode(',', $request->deleted_images);
            $deletedImages = $product->images()->whereIn('id', $deletedIds)->get();
            foreach ($deletedImages as $image) {
                Storage::disk('public')->delete($image->image_path);
                $image->delete();
            }
        }

        // Handle new images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('products/gallery', 'public');
                $product->images()->create([
                    'image_path' => $path,
                    'order' => $product->images()->count() + $index
                ]);
            }
        }

        // Handle variations
        if ($request->product_type == 'variable') {
            // Delete removed variations
            $existingIds = $product->variations()->pluck('id')->toArray();
            $submittedIds = collect($request->variations ?? [])->pluck('id')->filter()->toArray();
            $toDelete = array_diff($existingIds, $submittedIds);
            
            if (!empty($toDelete)) {
                $deletedVariations = $product->variations()->whereIn('id', $toDelete)->get();
                foreach ($deletedVariations as $variation) {
                    if ($variation->image) {
                        Storage::disk('public')->delete($variation->image);
                    }
                    $variation->delete();
                }
            }

            // Update or create variations
            if ($request->has('variations')) {
                foreach ($request->variations as $variationData) {
                    if (!empty($variationData['sku'])) {
                        $variationData['is_default'] = isset($variationData['is_default']);
                        
                        if (isset($variationData['id'])) {
                            $variation = $product->variations()->find($variationData['id']);
                            if ($variation) {
                                $variation->update([
                                    'sku' => $variationData['sku'],
                                    'regular_price' => $variationData['regular_price'],
                                    'sale_price' => $variationData['sale_price'] ?? null,
                                    'stock_quantity' => $variationData['stock_quantity'] ?? 0,
                                    'attributes' => $variationData['attributes'] ?? [],
                                    'is_default' => $variationData['is_default']
                                ]);

                                if (isset($variationData['image']) && $variationData['image'] instanceof \Illuminate\Http\UploadedFile) {
                                    if ($variation->image) {
                                        Storage::disk('public')->delete($variation->image);
                                    }
                                    $path = $variationData['image']->store('products/variations', 'public');
                                    $variation->update(['image' => $path]);
                                }
                            }
                        } else {
                            $variation = $product->variations()->create([
                                'sku' => $variationData['sku'],
                                'regular_price' => $variationData['regular_price'],
                                'sale_price' => $variationData['sale_price'] ?? null,
                                'stock_quantity' => $variationData['stock_quantity'] ?? 0,
                                'attributes' => $variationData['attributes'] ?? [],
                                'is_default' => $variationData['is_default']
                            ]);

                            if (isset($variationData['image']) && $variationData['image'] instanceof \Illuminate\Http\UploadedFile) {
                                $path = $variationData['image']->store('products/variations', 'public');
                                $variation->update(['image' => $path]);
                            }
                        }
                    }
                }
            }
        }

        return response()->json(['success' => true, 'message' => 'Product updated successfully']);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        // Delete featured image
        if ($product->featured_image) {
            Storage::disk('public')->delete($product->featured_image);
        }
        
        // Delete gallery images
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }
        
        // Delete variation images
        foreach ($product->variations as $variation) {
            if ($variation->image) {
                Storage::disk('public')->delete($variation->image);
            }
        }
        
        $product->delete();
        
        return response()->json(['success' => true, 'message' => 'Product deleted successfully']);
    }

    public function toggleStatus(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->status = !$product->status;
        $product->save();

        return response()->json(['success' => true, 'message' => 'Status updated successfully']);
    }
}