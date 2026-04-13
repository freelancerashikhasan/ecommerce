<?php

namespace App\Http\Controllers\Admin;

use App\Services\Courier\CourierManager;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected $courierManager;
    
    public function __construct(CourierManager $courierManager)
    {
        $this->courierManager = $courierManager;
    }
    
    /**
     * Assign courier to order
     */
    public function assignCourier(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        
        $validated = $request->validate([
            'courier_type' => 'required|in:pathao,steadfast',
            'weight' => 'nullable|numeric|min:0.1',
        ]);
        
        // Get pricing first (optional)
        $pricing = $this->courierManager->getPricing($validated['courier_type'], [
            'total' => $order->total,
            'weight' => $validated['weight'] ?? $order->items->sum('quantity') * 0.5,
            'city' => $order->city,
        ]);
        
        if (!$pricing['success']) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get pricing: ' . $pricing['error']
            ], 400);
        }
        
        // Create consignment
        $response = $this->courierManager->createConsignment(
            $order, 
            $validated['courier_type'],
            ['weight' => $validated['weight'] ?? null]
        );
        
        if ($response['success']) {
            return response()->json([
                'success' => true,
                'message' => 'Courier assigned successfully',
                'data' => [
                    'consignment_id' => $response['consignment_id'],
                    'tracking_code' => $response['tracking_code'] ?? null,
                    'pricing' => $pricing
                ]
            ]);
        }
        
        return response()->json([
            'success' => false,
            'message' => 'Failed to assign courier: ' . $response['error']
        ], 400);
    }
    
    /**
     * Track order
     */
    public function trackOrder($id)
    {
        $order = Order::findOrFail($id);
        
        $response = $this->courierManager->trackConsignment($order);
        
        if ($response['success']) {
            return response()->json([
                'success' => true,
                'data' => $response
            ]);
        }
        
        return response()->json([
            'success' => false,
            'message' => $response['error']
        ], 400);
    }
    
    /**
     * Cancel courier consignment
     */
    public function cancelCourier($id)
    {
        $order = Order::findOrFail($id);
        
        $response = $this->courierManager->cancelConsignment($order);
        
        if ($response['success']) {
            return response()->json([
                'success' => true,
                'message' => 'Courier consignment cancelled successfully'
            ]);
        }
        
        return response()->json([
            'success' => false,
            'message' => $response['error']
        ], 400);
    }
    
    /**
     * Generate sticker for order
     */
    public function generateSticker($id)
    {
        $order = Order::findOrFail($id);
        
        $response = $this->courierManager->generateSticker($order);
        
        if ($response['success'] && isset($response['sticker_url'])) {
            // Redirect to sticker URL or return PDF
            return redirect($response['sticker_url']);
        }
        
        // Fallback to local sticker generation
        $pdf = Pdf::loadView('admin.orders.sticker', compact('order'));
        return $pdf->download('sticker-' . $order->order_number . '.pdf');
    }
    
    /**
     * Get courier pricing
     */
    public function getCourierPricing(Request $request)
    {
        $validated = $request->validate([
            'courier_type' => 'required|in:pathao,steadfast',
            'total' => 'required|numeric',
            'weight' => 'nullable|numeric|min:0.1',
            'city' => 'nullable|string',
        ]);
        
        $response = $this->courierManager->getPricing(
            $validated['courier_type'],
            $validated
        );
        
        return response()->json($response);
    }
    
    /**
     * Bulk assign courier to multiple orders
     */
    public function bulkAssignCourier(Request $request)
    {
        $validated = $request->validate([
            'order_ids' => 'required|array',
            'order_ids.*' => 'exists:orders,id',
            'courier_type' => 'required|in:pathao,steadfast',
        ]);
        
        $results = [];
        
        foreach ($validated['order_ids'] as $orderId) {
            $order = Order::find($orderId);
            if ($order && !$order->courier_consignment_id) {
                $response = $this->courierManager->createConsignment($order, $validated['courier_type']);
                $results[$orderId] = $response;
            }
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Bulk courier assignment completed',
            'results' => $results
        ]);
    }
    
    /**
     * Get available courier services
     */
    public function getCourierServices()
    {
        $services = $this->courierManager->getAvailableServices();
        
        return response()->json([
            'success' => true,
            'services' => $services
        ]);
    }
}