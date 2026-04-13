<?php

namespace App\Http\Controllers\Admin;

use App\DataTables\OrderDataTable;
use App\Helpers\PdfHelper;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(OrderDataTable $dataTable)
    {
        return $dataTable->render('admin.orders.index');
    }

    public function show($id)
    {
        $order = Order::with('items', 'processedBy')->findOrFail($id);
        $orderCount = Order::where('customer_phone', $order->customer_phone)->count();
        
        return view('admin.orders.show', compact('order', 'orderCount'));
    }

    public function create()
    {
        $products = Product::where('status', 1)->get();
        return view('admin.orders.create', compact('products'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'nullable|email',
            'shipping_address' => 'required|string',
            'billing_address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'zip_code' => 'nullable|string',
            'country' => 'nullable|string',
            'payment_method' => 'nullable|string',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_cost' => 'nullable|numeric',
            'discount' => 'nullable|numeric',
            'tax' => 'nullable|numeric',
            'admin_notes' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $subtotal = 0;
            $items = [];

            foreach ($validated['items'] as $itemData) {
                $product = Product::find($itemData['product_id']);
                $price = $product->sale_price ?? $product->regular_price;
                $total = $price * $itemData['quantity'];
                $subtotal += $total;

                $items[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'product_image' => $product->featured_image,
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $price,
                    'total_price' => $total,
                ];
            }

            $total = $subtotal + ($validated['shipping_cost'] ?? 0) + ($validated['tax'] ?? 0) - ($validated['discount'] ?? 0);

            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $validated['customer_phone'],
                'customer_email' => $validated['customer_email'],
                'shipping_address' => $validated['shipping_address'],
                'billing_address' => $validated['billing_address'],
                'city' => $validated['city'],
                'state' => $validated['state'],
                'zip_code' => $validated['zip_code'],
                'country' => $validated['country'],
                'subtotal' => $subtotal,
                'discount' => $validated['discount'] ?? 0,
                'shipping_cost' => $validated['shipping_cost'] ?? 0,
                'tax' => $validated['tax'] ?? 0,
                'total' => $total,
                'payment_method' => $validated['payment_method'],
                'order_status' => 'pending',
                'payment_status' => 'pending',
                'admin_notes' => $validated['admin_notes'],
                'processed_by' => auth('admin')->id(),
                'created_by' => auth('admin')->id(),
                'order_date' => now(),
            ]);

            foreach ($items as $item) {
                $item['order_id'] = $order->id;
                OrderItem::create($item);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'order_id' => $order->id
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    public function edit($id)
    {
        $order = Order::with('items')->findOrFail($id);
        $products = Product::where('status', 1)->get();
        return response()->json([
            'order' => $order,
            'products' => $products
        ]);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'nullable|email',
            'shipping_address' => 'required|string',
            'order_status' => 'required|string',
            'payment_status' => 'required|string',
            'admin_notes' => 'nullable|string',
        ]);

        $order->update([
            'customer_name' => $validated['customer_name'],
            'customer_phone' => $validated['customer_phone'],
            'customer_email' => $validated['customer_email'],
            'shipping_address' => $validated['shipping_address'],
            'order_status' => $validated['order_status'],
            'payment_status' => $validated['payment_status'],
            'admin_notes' => $validated['admin_notes'],
            'updated_by' => auth('admin')->id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Order updated successfully'
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        
        $validated = $request->validate([
            'order_status' => 'required|string',
            'status_note' => 'nullable|string',
        ]);

        $order->addTrackingUpdate(
            $validated['order_status'],
            $validated['status_note'] ?? 'Order status updated to ' . $validated['order_status']
        );

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully'
        ]);
    }

    public function addConversation(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        
        $validated = $request->validate([
            'message' => 'required|string',
            'type' => 'required|in:note,call,email,whatsapp',
        ]);

        $order->addConversation($validated['message'], $validated['type']);

        return response()->json([
            'success' => true,
            'message' => 'Conversation added successfully'
        ]);
    }

    public function assignCourier(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        
        $validated = $request->validate([
            'courier_type' => 'required|in:pathao,steadfast',
            'courier_consignment_id' => 'required|string',
            'courier_response' => 'nullable|array',
        ]);

        $order->update([
            'courier_type' => $validated['courier_type'],
            'courier_consignment_id' => $validated['courier_consignment_id'],
            'courier_response' => $validated['courier_response'] ?? null,
            'order_status' => 'shipped',
        ]);

        $order->addTrackingUpdate(
            'shipped',
            'Order assigned to ' . ucfirst($validated['courier_type']) . ' with consignment ID: ' . $validated['courier_consignment_id']
        );

        return response()->json([
            'success' => true,
            'message' => 'Courier assigned successfully'
        ]);
    }

    public function generateInvoice($id)
    {
        try {
            $order = Order::with('items')->findOrFail($id);
            $orderCount = Order::where('customer_phone', $order->customer_phone)->count();
            
            $pdf = PdfHelper::generateInvoice($order, $orderCount);
            return $pdf->Output('invoice-' . $order->order_number . '.pdf', 'D');
            
        } catch (\Exception $e) {
            \Log::error('Invoice generation failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to generate invoice: ' . $e->getMessage());
        }
    }

    public function generateSticker($id)
    {
        try {
            $order = Order::findOrFail($id);
            
            if (!$order->courier_type || !$order->courier_consignment_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Courier not assigned to this order'
                ], 400);
            }
            
            $pdf = PdfHelper::generateSticker($order);
            return $pdf->Output('sticker-' . $order->order_number . '.pdf', 'D');
            
        } catch (\Exception $e) {
            \Log::error('Sticker generation failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to generate sticker: ' . $e->getMessage());
        }
    }
    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Order deleted successfully'
        ]);
    }
}