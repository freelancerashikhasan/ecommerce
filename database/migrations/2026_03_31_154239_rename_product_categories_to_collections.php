<?php
// database/migrations/2026_03_31_000003_rename_product_categories_to_collections.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameProductCategoriesToCollections extends Migration
{
    public function up()
    {
        Schema::rename('product_categories', 'collections');
        
        Schema::table('collections', function (Blueprint $table) {
            $table->string('type')->default('collection');
            $table->json('metadata')->nullable();
        });
    }

    public function down()
    {
        Schema::table('collections', function (Blueprint $table) {
            $table->dropColumn(['type', 'metadata']);
        });
        
        Schema::rename('collections', 'product_categories');
    }
}