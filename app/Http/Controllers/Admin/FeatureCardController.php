<?php
// app/Http/Controllers/Admin/FeatureCardController.php

namespace App\Http\Controllers\Admin;

use App\DataTables\FeatureCardDataTable;
use App\Http\Controllers\Controller;
use App\Models\FeatureCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FeatureCardController extends Controller
{
    public function index(FeatureCardDataTable $dataTable)
    {
        return $dataTable->render('admin.feature-cards.index');
    }

    public function create()
    {
        return view('admin.feature-cards.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'nullable|string|max:100',
            'order' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        FeatureCard::create($validated);

        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Feature card created successfully'
            ]);
        }

        return redirect()->route('admin.feature-cards.index')
            ->with('success', 'Feature card created successfully');
    }

    public function edit($id)
    {
        $card = FeatureCard::findOrFail($id);
        return view('admin.feature-cards.edit', compact('card'));
    }

    public function update(Request $request, $id)
    {
        $card = FeatureCard::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'nullable|string|max:100',
            'order' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $card->update($validated);

        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Feature card updated successfully'
            ]);
        }

        return redirect()->route('admin.feature-cards.index')
            ->with('success', 'Feature card updated successfully');
    }

    public function destroy($id)
    {
        $card = FeatureCard::findOrFail($id);
        $card->delete();

        return response()->json([
            'success' => true,
            'message' => 'Feature card deleted successfully'
        ]);
    }
}