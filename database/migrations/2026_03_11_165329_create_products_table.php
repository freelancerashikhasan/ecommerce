
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->string('video_link')->nullable();
            $table->string('sku')->unique();
            $table->decimal('regular_price', 10, 2);
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->decimal('purchase_price', 10, 2)->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->boolean('manage_stock')->default(false);
            $table->boolean('in_stock')->default(true);
            $table->string('featured_image')->nullable();
            $table->enum('product_type', ['simple', 'variable'])->default('simple');
            $table->json('specifications')->nullable(); 
            $table->json('additional_info')->nullable(); 
            $table->boolean('status')->default(true);
           $table->softDeletes();
            $table->string('created_by')->nullable();
            $table->string('updated_by')->nullable();
            $table->string('deleted_by')->nullable();
            $table->timestamps();

        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
};