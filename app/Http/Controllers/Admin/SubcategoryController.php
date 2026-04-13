<?php
// app/Http/Controllers/Admin/SubcategoryController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class SubcategoryController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax()) {
            $subcategories = Subcategory::with('category')
                ->withCount('products')
                ->orderBy('category_id')
                ->orderBy('order');
            
            return datatables()->of($subcategories)
                ->addColumn('image', function($subcategory) {
                    if ($subcategory->image && Storage::disk('public')->exists($subcategory->image)) {
                        return '<img src="' . asset('storage/' . $subcategory->image) . '" style="height: 50px; width: 50px; object-fit: cover; border-radius: 8px;">';
                    }
                    return '<div class="bg-light d-flex align-items-center justify-content-center" style="height: 50px; width: 50px; border-radius: 8px;">
                                <i class="ri-image-line" style="font-size: 20px;"></i>
                            </div>';
                })
                ->addColumn('category_name', function($subcategory) {
                    if ($subcategory->category) {
                        return '<span class="badge bg-primary">' . $subcategory->category->name . '</span>';
                    }
                    return '<span class="badge bg-danger">No Category</span>';
                })
                ->addColumn('products_count', function($subcategory) {
                    return '<span class="badge bg-info">' . $subcategory->products_count . '</span>';
                })
                ->addColumn('status', function($subcategory) {
                    $checked = $subcategory->status ? 'checked' : '';
                    return '<div class="form-check form-switch">
                        <input class="form-check-input toggle-status" type="checkbox" data-id="' . $subcategory->id . '" ' . $checked . '>
                    </div>';
                })
                ->addColumn('action', function($subcategory) {
                    $buttons = '';
                    if (auth('admin')->user()->canAny(['access-all','subcategory-edit'])) {
                        $buttons .= '<button class="btn btn-sm btn-primary me-2" onclick="editSubcategory(' . $subcategory->id . ')">
                                        <i class="ri-edit-line"></i>
                                    </button>';
                    }
                    if (auth('admin')->user()->canAny(['access-all','subcategory-delete'])) {
                        $buttons .= '<button class="btn btn-sm btn-danger" onclick="deleteSubcategory(' . $subcategory->id . ')">
                                        <i class="ri-delete-bin-line"></i>
                                    </button>';
                    }
                    return $buttons;
                })
                ->rawColumns(['image', 'category_name', 'products_count', 'status', 'action'])
                ->make(true);
        }
        
        $categories = Category::where('status', true)->orderBy('order')->get();
        return view('admin.subcategories.index', compact('categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|unique:subcategories,name|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'order' => 'nullable|integer|min:0',
            'status' => 'nullable',
        ]);

        $data = $request->all();
        $data['slug'] = Str::slug($request->name);
        $data['status'] = $request->has('status');

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('subcategories', 'public');
            $data['image'] = $path;
        }

        Subcategory::create($data);

        return response()->json([
            'success' => true, 
            'message' => 'Subcategory created successfully!'
        ]);
    }

    public function edit($id)
    {
        $subcategory = Subcategory::with('category')->findOrFail($id);
        return response()->json([
            'id' => $subcategory->id,
            'category_id' => $subcategory->category_id,
            'name' => $subcategory->name,
            'description' => $subcategory->description,
            'image' => $subcategory->image,
            'image_url' => $subcategory->image ? asset('storage/' . $subcategory->image) : null,
            'order' => $subcategory->order,
            'status' => $subcategory->status
        ]);
    }

    public function update(Request $request, $id)
    {
        $subcategory = Subcategory::findOrFail($id);
        
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|max:255|unique:subcategories,name,' . $id,
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'order' => 'nullable|integer|min:0',
            'status' => 'nullable',
        ]);

        $data = $request->all();
        $data['slug'] = Str::slug($request->name);
        $data['status'] = $request->has('status');

        if ($request->hasFile('image')) {
            if ($subcategory->image && Storage::disk('public')->exists($subcategory->image)) {
                Storage::disk('public')->delete($subcategory->image);
            }
            $path = $request->file('image')->store('subcategories', 'public');
            $data['image'] = $path;
        }

        $subcategory->update($data);

        return response()->json([
            'success' => true, 
            'message' => 'Subcategory updated successfully!'
        ]);
    }

    public function destroy($id)
    {
        $subcategory = Subcategory::findOrFail($id);
        
        if ($subcategory->image && Storage::disk('public')->exists($subcategory->image)) {
            Storage::disk('public')->delete($subcategory->image);
        }
        
        $subcategory->delete();
        
        return response()->json([
            'success' => true, 
            'message' => 'Subcategory deleted successfully!'
        ]);
    }

    public function toggleStatus($id)
    {
        $subcategory = Subcategory::findOrFail($id);
        $subcategory->status = !$subcategory->status;
        $subcategory->save();
        
        return response()->json([
            'success' => true, 
            'message' => 'Status updated successfully!'
        ]);
    }
    
    public function getByCategory($categoryId)
    {
        $subcategories = Subcategory::where('category_id', $categoryId)
            ->where('status', true)
            ->orderBy('order')
            ->get(['id', 'name']);
            
        return response()->json($subcategories);
    }
}