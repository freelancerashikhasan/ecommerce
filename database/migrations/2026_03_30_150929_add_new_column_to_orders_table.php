<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->string('customer_name');
            $table->string('customer_phone')->index();
            $table->string('customer_email')->nullable();
            $table->text('shipping_address');
            $table->text('billing_address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('zip_code')->nullable();
            $table->string('country')->nullable();
            
            // Order details
            $table->decimal('subtotal', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('shipping_cost', 10, 2)->default(0);
            $table->decimal('tax', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            
            // Payment
            $table->string('payment_method')->nullable();
            $table->string('payment_status')->default('pending'); // pending, paid, failed, refunded
            $table->string('transaction_id')->nullable();
            
            // Order status
            $table->string('order_status')->default('pending'); // pending, processing, confirmed, shipped, delivered, cancelled, returned
            
            // Courier details
            $table->string('courier_type')->nullable(); // pathao, steadfast
            $table->string('courier_consignment_id')->nullable();
            $table->json('courier_response')->nullable();
            
            // Tracking
            $table->json('tracking_history')->nullable();
            $table->string('tracking_code')->nullable();
            $table->text('tracking_notes')->nullable();
            
            // Conversation
            $table->json('conversations')->nullable();
            
            // User (admin who processed)
            $table->unsignedBigInteger('processed_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            
            // Additional
            $table->text('admin_notes')->nullable();
            $table->text('customer_notes')->nullable();
            $table->json('metadata')->nullable();
            
            $table->timestamp('order_date')->useCurrent();
            $table->timestamp('delivered_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
            
            $table->foreign('processed_by')->references('id')->on('admins');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};