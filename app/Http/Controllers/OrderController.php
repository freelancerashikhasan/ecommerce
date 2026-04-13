<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function guestCheckout(Request $request)
    {
        // Log incoming request for debugging
        
        // Decode cart_items if it's a JSON string
        $cartItems = $request->input('cart_items');
        if (is_string($cartItems)) {
            $cartItems = json_decode($cartItems, true);
            $request->merge(['cart_items' => $cartItems]);
        }
        
        // Validate the request
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'city' => 'required|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'delivery_area' => 'required|in:inside,outside',
            'delivery_charge' => 'required|numeric',
            'notes' => 'nullable|string',
            'payment_method' => 'required|string',
            'cart_items' => 'required|array|min:1',
            'cart_items.*.id' => 'required',
            'cart_items.*.name' => 'required|string',
            'cart_items.*.price' => 'required|numeric|min:0',
            'cart_items.*.quantity' => 'required|integer|min:1',
            'cart_items.*.image' => 'nullable|string',
            'cart_items.*.sku' => 'nullable|string',
            'subtotal' => 'required|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'total' => 'required|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();

            // Generate order number
            $orderNumber = $this->generateOrderNumber();

            // Create order
            $order = Order::create([
                'order_number' => $orderNumber,
                'customer_name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'customer_phone' => $validated['phone'],
                'customer_email' => $validated['email'],
                'shipping_address' => $validated['address'],
                'billing_address' => $validated['address'],
                'city' => $validated['city'],
                'zip_code' => $validated['postal_code'],
                'country' => 'Bangladesh',
                'subtotal' => $validated['subtotal'],
                'discount' => 0,
                'shipping_cost' => $validated['delivery_charge'],
                'tax' => $validated['tax'] ?? 0,
                'total' => $validated['total'],
                'payment_method' => $validated['payment_method'],
                'payment_status' => 'pending',
                'order_status' => 'pending',
                'admin_notes' => $validated['notes'],
                'order_date' => now(),
                'metadata' => [
                    'delivery_area' => $validated['delivery_area'],
                    'user_agent' => $request->userAgent(),
                    'ip_address' => $request->ip()
                ]
            ]);

            // Create order items - now cart_items is properly decoded as array
            foreach ($validated['cart_items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'product_name' => $item['name'],
                    'product_sku' => $item['sku'] ?? 'N/A',
                    'product_image' => $item['image'] ?? null,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'total_price' => $item['price'] * $item['quantity'],
                ]);
            }

            // Add initial tracking (check if method exists)
            if (method_exists($order, 'addTrackingUpdate')) {
                $order->addTrackingUpdate(
                    'pending',
                    'Order placed successfully. Waiting for confirmation.'
                );
            }
            // Add initial conversation (check if method exists)
            if (method_exists($order, 'addConversation')) {
                $order->addConversation(
                    "Order placed by {$order->customer_name} via website. Total: {$order->total} BDT. Payment: Cash on Delivery.",
                    'note'
                );
            }

            DB::commit();

            // Return JSON response for AJAX requests
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Order placed successfully',
                    'order_id' => $order->id,
                    'redirect' => route('order.success', ['order' => $order->id])
                ]);
            }

            return redirect()->route('order.success', ['order' => $order->id]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed: ' . $e->getMessage());
            Log::error('Request data: ' . json_encode($request->all()));
            
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to place order. Please try again.',
                    'error' => $e->getMessage()
                ], 422);
            }
            
            return back()->withErrors(['error' => 'Failed to place order. Please try again.'])->withInput();
        }
    }

    public function orderSuccess($id)
    {
        $order = Order::with('items')->findOrFail($id);
        
        return inertia('OrderSuccess', [
            'order' => $order
        ]);
    }

    public function trackOrder($orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();
        
        return inertia('TrackOrder', [
            'order' => $order
        ]);
    }

    private function generateOrderNumber()
    {
        $prefix = 'ORD';
        $year = date('Y');
        $month = date('m');
        $lastOrder = Order::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->orderBy('id', 'desc')
            ->first();
        
        if ($lastOrder) {
            $lastNumber = intval(substr($lastOrder->order_number, -4));
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '0001';
        }
        
        return $prefix . $year . $month . $newNumber;
    }
}