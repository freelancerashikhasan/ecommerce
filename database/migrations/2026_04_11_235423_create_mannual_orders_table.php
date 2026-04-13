// database/migrations/2024_01_01_000001_create_manual_orders_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('manual_orders', function (Blueprint $table) {
            $table->id();
            
            // Customer Information
            $table->string('customer_name');
            $table->string('customer_email')->nullable();
            $table->string('customer_phone');
            $table->text('shipping_address');
            $table->enum('delivery_area', ['inside', 'outside'])->default('inside');
            
            // Product Information
            $table->string('product_name');
            $table->string('product_link')->nullable();
            $table->text('product_details')->nullable();
            $table->integer('quantity')->default(1);
            $table->decimal('expected_price', 10, 2)->nullable();
            
            // Order Information
            $table->enum('preferred_payment', ['cod', 'bkash', 'nagad', 'rocket'])->default('cod');
            $table->text('special_instructions')->nullable();
            $table->string('order_source')->default('manual');
            
            // Status Tracking
            $table->enum('status', ['pending', 'reviewing', 'approved', 'processing', 'completed', 'cancelled'])->default('pending');
            $table->decimal('final_price', 10, 2)->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('status');
            $table->index('customer_phone');
            $table->index('created_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('manual_orders');
    }
};