<?php

namespace App\Http\Controllers;

use App\Models\ManualOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\ManualOrderReceived;
use App\Models\MannualOrder;

class ManualOrderController extends Controller
{
    // Show the manual order form
    public function create()
    {
        return inertia('ManualOrder');
    }

    // Store manual order
    public function store(Request $request)
    {
        // Validation rules
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'nullable|email|max:255',
            'customer_phone' => 'required|string|max:20|regex:/^01[3-9]\d{8}$/',
            'shipping_address' => 'required|string|min:10|max:500',
            'delivery_area' => 'required|in:inside,outside',
            'product_name' => 'required|string|max:255',
            'product_link' => 'nullable|url|max:500',
            'product_details' => 'nullable|string|max:1000',
            'quantity' => 'required|integer|min:1|max:100',
            'expected_price' => 'nullable|numeric|min:0|max:999999',
            'preferred_payment' => 'required|in:cod,bkash,nagad,rocket',
            'special_instructions' => 'nullable|string|max:500'
        ], [
            'customer_phone.regex' => 'Please enter a valid Bangladeshi phone number (01XXXXXXXXX)',
            'shipping_address.min' => 'Please provide a complete shipping address',
            'quantity.min' => 'Quantity must be at least 1',
            'expected_price.numeric' => 'Please enter a valid price amount'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            // Create manual order
            $manualOrder = MannualOrder::create([
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'customer_phone' => $request->customer_phone,
                'shipping_address' => $request->shipping_address,
                'delivery_area' => $request->delivery_area,
                'product_name' => $request->product_name,
                'product_link' => $request->product_link,
                'product_details' => $request->product_details,
                'quantity' => $request->quantity,
                'expected_price' => $request->expected_price,
                'preferred_payment' => $request->preferred_payment,
                'special_instructions' => $request->special_instructions,
                'order_source' => 'manual',
                'status' => 'pending'
            ]);

            // Send email notification (optional)
            // Mail::to($request->customer_email)->send(new ManualOrderReceived($manualOrder));
            
            // You can also send SMS notification here
            // $this->sendSmsNotification($manualOrder);

            return redirect()->back()->with('success', 'Your manual order request has been submitted successfully! We will contact you within 24 hours.');
            
        } catch (\Exception $e) {
            \Log::error('Manual Order Creation Error: ' . $e->getMessage());
            return back()->with('error', 'Something went wrong. Please try again later.');
        }
    }

    // Admin: List all manual orders
    public function index()
    {
        $orders = MannualOrder::orderBy('created_at', 'desc')->paginate(20);
        return inertia('Admin/ManualOrders/Index', ['orders' => $orders]);
    }

    // Admin: View single manual order
    public function show($id)
    {
        $order = MannualOrder::findOrFail($id);
        return inertia('Admin/ManualOrders/Show', ['order' => $order]);
    }

    // Admin: Update order status
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,reviewing,approved,processing,completed,cancelled',
            'final_price' => 'nullable|numeric|min:0',
            'admin_notes' => 'nullable|string|max:500'
        ]);

        $order = MannualOrder::findOrFail($id);
        
        $updateData = ['status' => $request->status];
        
        if ($request->has('final_price')) {
            $updateData['final_price'] = $request->final_price;
        }
        
        if ($request->has('admin_notes')) {
            $updateData['admin_notes'] = $request->admin_notes;
        }
        
        if ($request->status === 'reviewing' && !$order->reviewed_at) {
            $updateData['reviewed_at'] = now();
        }
        
        if ($request->status === 'approved' && !$order->approved_at) {
            $updateData['approved_at'] = now();
        }
        
        $order->update($updateData);
        
        return back()->with('success', 'Order status updated successfully');
    }

    // Admin: Delete manual order
    public function destroy($id)
    {
        $order = MannualOrder::findOrFail($id);
        $order->delete();
        
        return redirect()->route('admin.manual-orders.index')
            ->with('success', 'Order deleted successfully');
    }
}