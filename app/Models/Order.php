<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'order_number', 'customer_name', 'customer_phone', 'customer_email',
        'shipping_address', 'billing_address', 'city', 'state', 'zip_code', 'country',
        'subtotal', 'discount', 'shipping_cost', 'tax', 'total',
        'payment_method', 'payment_status', 'transaction_id',
        'order_status', 'courier_type', 'courier_consignment_id', 'courier_response',
        'tracking_history', 'tracking_code', 'tracking_notes',
        'conversations', 'processed_by', 'created_by', 'updated_by', 'deleted_by',
        'admin_notes', 'customer_notes', 'metadata', 'order_date', 'delivered_at'
    ];

    protected $casts = [
        'courier_response' => 'array',
        'tracking_history' => 'array',
        'conversations' => 'array',
        'metadata' => 'array',
        'order_date' => 'datetime',
        'delivered_at' => 'datetime',
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'tax' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function processedBy()
    {
        return $this->belongsTo(Admin::class, 'processed_by');
    }

    public function createdBy()
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    // Get order count by phone number
    public static function getOrderCountByPhone($phone)
    {
        return self::where('customer_phone', $phone)->count();
    }

    // Add conversation
    public function addConversation($message, $type = 'note')
    {
        $conversations = $this->conversations ?? [];
        $conversations[] = [
            'id' => uniqid(),
            'message' => $message,
            'type' => $type, // note, call, email, whatsapp
            'admin_id' => auth('admin')->id(),
            'admin_name' => auth('admin')->user()->name ?? 'Default',
            'created_at' => now(),
        ];
        $this->conversations = $conversations;
        $this->save();
        
        return $this;
    }

    // Update tracking
    public function addTrackingUpdate($status, $description, $location = null)
    {
        $trackingHistory = $this->tracking_history ?? [];
        $trackingHistory[] = [
            'status' => $status,
            'description' => $description,
            'location' => $location,
            'created_at' => now(),
            'admin_id' => auth('admin')->id(),
        ];
        $this->tracking_history = $trackingHistory;
        $this->order_status = $status;
        $this->save();
        
        return $this;
    }

    // Generate invoice number
    public static function generateOrderNumber()
    {
        $prefix = 'ORD';
        $year = date('Y');
        $month = date('m');
        $lastOrder = self::whereYear('created_at', $year)
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