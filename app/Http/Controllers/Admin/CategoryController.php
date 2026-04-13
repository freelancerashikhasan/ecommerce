<?php
// app/Http/Controllers/Admin/CategoryController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax()) {
            $categories = Category::withCount('subcategories')
                ->orderBy('order')
                ->orderBy('id', 'desc');
            
            return datatables()->of($categories)
                ->addColumn('image', function($category) {
                    if ($category->image && Storage::disk('public')->exists($category->image)) {
                        return '<img src="' . asset('storage/' . $category->image) . '" style="height: 50px; width: 50px; object-fit: cover; border-radius: 8px;">';
                    }
                    return '<div class="bg-light d-flex align-items-center justify-content-center" style="height: 50px; width: 50px; border-radius: 8px;">
                                <i class="ri-image-line" style="font-size: 20px;"></i>
                            </div>';
                })
                ->addColumn('subcategories_count', function($category) {
                    return '<span class="badge bg-info">' . $category->subcategories_count . '</span>';
                })
                ->addColumn('status', function($category) {
                    $checked = $category->status ? 'checked' : '';
                    return '<div class="form-check form-switch">
                        <input class="form-check-input toggle-status" type="checkbox" data-id="' . $category->id . '" ' . $checked . '>
                    </div>';
                })
                ->addColumn('action', function($category) {
                    $buttons = '';
                    if (auth('admin')->user()->canAny(['access-all','category-edit'])) {
                        $buttons .= '<button class="btn btn-sm btn-primary me-2" onclick="editCategory(' . $category->id . ')">
                                        <i class="ri-edit-line"></i>
                                    </button>';
                    }
                    if (auth('admin')->user()->canAny(['access-all','category-delete'])) {
                        $buttons .= '<button class="btn btn-sm btn-danger" onclick="deleteCategory(' . $category->id . ')">
                                        <i class="ri-delete-bin-line"></i>
                                    </button>';
                    }
                    return $buttons;
                })
                ->rawColumns(['image', 'subcategories_count', 'status', 'action'])
                ->make(true);
        }
        
        return view('admin.categories.index');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:categories,name|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'order' => 'nullable|integer|min:0',
            'status' => 'nullable',
        ]);

        $data = $request->all();
        $data['slug'] = Str::slug($request->name);
        $data['status'] = $request->has('status');

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('categories', 'public');
            $data['image'] = $path;
        }

        Category::create($data);

        return response()->json([
            'success' => true, 
            'message' => 'Category created successfully!'
        ]);
    }

    public function edit($id)
    {
        $category = Category::findOrFail($id);
        return response()->json([
            'id' => $category->id,
            'name' => $category->name,
            'description' => $category->description,
            'image' => $category->image,
            'image_url' => $category->image ? asset('storage/' . $category->image) : null,
            'order' => $category->order,
            'status' => $category->status
        ]);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        
        $request->validate([
            'name' => 'required|max:255|unique:categories,name,' . $id,
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'order' => 'nullable|integer|min:0',
            'status' => 'nullable',
        ]);

        $data = $request->all();
        $data['slug'] = Str::slug($request->name);
        $data['status'] = $request->has('status');

        if ($request->hasFile('image')) {
            if ($category->image && Storage::disk('public')->exists($category->image)) {
                Storage::disk('public')->delete($category->image);
            }
            $path = $request->file('image')->store('categories', 'public');
            $data['image'] = $path;
        }

        $category->update($data);

        return response()->json([
            'success' => true, 
            'message' => 'Category updated successfully!'
        ]);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        
        if ($category->image && Storage::disk('public')->exists($category->image)) {
            Storage::disk('public')->delete($category->image);
        }
        
        $category->delete();
        
        return response()->json([
            'success' => true, 
            'message' => 'Category deleted successfully!'
        ]);
    }

    public function toggleStatus($id)
    {
        $category = Category::findOrFail($id);
        $category->status = !$category->status;
        $category->save();
        
        return response()->json([
            'success' => true, 
            'message' => 'Status updated successfully!'
        ]);
    }
}