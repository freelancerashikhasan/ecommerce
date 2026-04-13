<?php
// app/Http/Controllers/Admin/CollectionController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class CollectionController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax()) {
            $collections = Collection::withCount('products')
                ->orderBy('order')
                ->orderBy('id', 'desc');
            
            return datatables()->of($collections)
                ->addColumn('image', function($collection) {
                    if ($collection->image && Storage::disk('public')->exists($collection->image)) {
                        return '<img src="' . asset('storage/' . $collection->image) . '" style="height: 50px; width: 50px; object-fit: cover; border-radius: 8px;">';
                    }
                    return '<div class="bg-light d-flex align-items-center justify-content-center" style="height: 50px; width: 50px; border-radius: 8px;">
                                <i class="ri-image-line" style="font-size: 20px;"></i>
                            </div>';
                })
                ->addColumn('products_count', function($collection) {
                    return '<span class="badge bg-primary">' . $collection->products_count . '</span>';
                })
                ->addColumn('status', function($collection) {
                    $checked = $collection->status ? 'checked' : '';
                    return '<div class="form-check form-switch">
                        <input class="form-check-input toggle-status" type="checkbox" data-id="' . $collection->id . '" ' . $checked . '>
                    </div>';
                })
                ->addColumn('action', function($collection) {
                    $buttons = '';
                    if (auth('admin')->user()->canAny(['access-all','collection-edit'])) {
                        $buttons .= '<button class="btn btn-sm btn-primary me-2" onclick="editCollection(' . $collection->id . ')">
                                        <i class="ri-edit-line"></i>
                                    </button>';
                    }
                    if (auth('admin')->user()->canAny(['access-all','collection-delete'])) {
                        $buttons .= '<button class="btn btn-sm btn-danger" onclick="deleteCollection(' . $collection->id . ')">
                                        <i class="ri-delete-bin-line"></i>
                                    </button>';
                    }
                    return $buttons;
                })
                ->rawColumns(['image', 'products_count', 'status', 'action'])
                ->make(true);
        }
        
        return view('admin.collections.index');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:collections,name|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'order' => 'nullable|integer|min:0',
            'status' => 'nullable|boolean',
        ]);

        $data = $request->all();
        $data['slug'] = Str::slug($request->name);
        $data['status'] = $request->has('status');
        $data['type'] = 'collection';

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('collections', 'public');
            $data['image'] = $path;
        }

        Collection::create($data);

        return response()->json([
            'success' => true, 
            'message' => 'Collection created successfully!'
        ]);
    }

    public function edit($id)
    {
        $collection = Collection::findOrFail($id);
        return response()->json([
            'id' => $collection->id,
            'name' => $collection->name,
            'description' => $collection->description,
            'image' => $collection->image,
            'image_url' => $collection->image ? asset('storage/' . $collection->image) : null,
            'order' => $collection->order,
            'status' => $collection->status
        ]);
    }

    public function update(Request $request, $id)
    {
        $collection = Collection::findOrFail($id);
        
        $request->validate([
            'name' => 'required|max:255|unique:collections,name,' . $id,
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'order' => 'nullable|integer|min:0',
            'status' => 'nullable|boolean',
        ]);

        $data = $request->all();
        $data['slug'] = Str::slug($request->name);
        $data['status'] = $request->has('status');

        if ($request->hasFile('image')) {
            if ($collection->image && Storage::disk('public')->exists($collection->image)) {
                Storage::disk('public')->delete($collection->image);
            }
            $path = $request->file('image')->store('collections', 'public');
            $data['image'] = $path;
        }

        $collection->update($data);

        return response()->json([
            'success' => true, 
            'message' => 'Collection updated successfully!'
        ]);
    }

    public function destroy($id)
    {
        $collection = Collection::findOrFail($id);
        
        if ($collection->image && Storage::disk('public')->exists($collection->image)) {
            Storage::disk('public')->delete($collection->image);
        }
        
        $collection->delete();
        
        return response()->json([
            'success' => true, 
            'message' => 'Collection deleted successfully!'
        ]);
    }

    public function toggleStatus($id)
    {
        $collection = Collection::findOrFail($id);
        $collection->status = !$collection->status;
        $collection->save();
        
        return response()->json([
            'success' => true, 
            'message' => 'Status updated successfully!'
        ]);
    }
}