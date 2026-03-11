<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\AttributeValue;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AttributeController extends Controller
{
    public function index()
    {
        $attributes = Attribute::with('values')->get();
        return view('admin.attributes.index', compact('attributes'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:attributes,name'
        ]);

        Attribute::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name)
        ]);

        return response()->json(['success' => true, 'message' => 'Attribute created successfully']);
    }

    public function update(Request $request, $id)
    {
        $attribute = Attribute::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:attributes,name,' . $id
        ]);

        $attribute->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name)
        ]);

        return response()->json(['success' => true, 'message' => 'Attribute updated successfully']);
    }

    public function destroy($id)
    {
        $attribute = Attribute::findOrFail($id);
        
        // Check if attribute has values
        if ($attribute->values()->count() > 0) {
            return response()->json(['success' => false, 'message' => 'Cannot delete attribute with associated values'], 400);
        }

        $attribute->delete();

        return response()->json(['success' => true, 'message' => 'Attribute deleted successfully']);
    }

    public function storeValue(Request $request, $attributeId)
    {
        $attribute = Attribute::findOrFail($attributeId);

        $request->validate([
            'value' => 'required|string|max:255',
            'color_code' => 'nullable|string|max:7'
        ]);

        $attribute->values()->create([
            'value' => $request->value,
            'color_code' => $request->color_code
        ]);

        return response()->json(['success' => true, 'message' => 'Value added successfully']);
    }

    public function updateValue(Request $request, $id)
    {
        $value = AttributeValue::findOrFail($id);

        $request->validate([
            'value' => 'required|string|max:255',
            'color_code' => 'nullable|string|max:7'
        ]);

        $value->update([
            'value' => $request->value,
            'color_code' => $request->color_code
        ]);

        return response()->json(['success' => true, 'message' => 'Value updated successfully']);
    }

    public function destroyValue($id)
    {
        $value = AttributeValue::findOrFail($id);
        $value->delete();

        return response()->json(['success' => true, 'message' => 'Value deleted successfully']);
    }
}