<?php

use App\Http\Controllers\Admin\AttributeController;
use App\Http\Controllers\Admin\Auth\LoginController;
use App\Http\Controllers\Admin\Auth\RegisterController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ChangePasswordController;
use App\Http\Controllers\Admin\CollectionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FeatureCardController;
use App\Http\Controllers\Admin\FeaturedProductController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductCategoryController;
use App\Http\Controllers\Admin\ReceiveCategoryController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\PromotionController;
use App\Http\Controllers\Admin\SubcategoryController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware(['admin.guest'])->group(function () {
        Route::get('login', [LoginController::class, 'showLoginForm'])->name('login');
        Route::post('login', [LoginController::class, 'login'])->name('login.submit');
        
        Route::get('register', [RegisterController::class, 'showRegistrationForm'])->name('register');
        Route::post('register', [RegisterController::class, 'register'])->name('register.submit');
    });
    Route::middleware(['admin.auth'])->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::post('logout', [LoginController::class, 'logout'])->name('logout');

        Route::get('/change-password', [ChangePasswordController::class, 'showChangePasswordForm'])->name('password.change');
        Route::post('/change-password', [ChangePasswordController::class, 'updatePassword'])->name('password.update');

         Route::prefix('receive_category')->as('receive_category.')->group(function () {
            Route::get('/', [ReceiveCategoryController::class, 'index'])->name('index')->middleware(['permission:access-all|receive_category-visibility']);
            Route::post('store', [ReceiveCategoryController::class, 'store'])->name('store')->middleware(['permission:access-all|receive_category-create']);
            Route::get('/edit/{id}', [ReceiveCategoryController::class, 'edit'])->name('edit')->middleware(['permission:access-all|receive_category-edit']);
            Route::put('/update/{id}', [ReceiveCategoryController::class, 'update'])->name('update')->middleware(['permission:access-all|receive_category-edit']);
            Route::get('/delete/{id}', [ReceiveCategoryController::class, 'destroy'])->name('destroy')->middleware(['permission:access-all|receive_category-delete']);
        });

        Route::prefix('staff')->as('staff.')->group(function () {
            Route::get('/', [StaffController::class, 'index'])->name('index')->middleware(['permission:access-all|staff-visibility']);
            Route::get('create', [StaffController::class, 'create'])->name('create')->middleware(['permission:access-all|staff-create']);
            Route::post('store', [StaffController::class, 'store'])->name('store')->middleware(['permission:access-all|staff-create']);
            Route::get('view/{id}', [StaffController::class, 'show'])->name('view')->middleware(['permission:access-all|staff-visibility']);
            Route::get('edit/{id}', [StaffController::class, 'edit'])->name('edit')->middleware(['permission:access-all|edit-visibility']);
            Route::put('update/{id}', [StaffController::class, 'update'])->name('update')->middleware(['permission:access-all|staff-edit']);
            Route::get('delete/{id}', [StaffController::class, 'destroy'])->name('destroy')->middleware(['permission:access-all|staff-delete']);

            Route::get('assign/role/{userId}', [StaffController::class, 'assignRole'])->name('assing.role')->middleware(['permission:access-all|roles-create']);
            Route::post('assign/role/{userId}', [StaffController::class, 'saveAssignedRole'])->name('assing.role.store')->middleware(['permission:access-all|roles-create']);
            Route::get('assign/permission/{userId}', [StaffController::class, 'assignPermission'])->name('assing.permission')->middleware(['permission:access-all|roles-create']);
            Route::post('assign/permission/{userId}', [StaffController::class, 'saveAssignedPermission'])->name('assing.permission.store')->middleware(['permission:access-all|roles-create']);
        });
        Route::group(['prefix' => 'roles', 'as' => 'roles.'], function () {
            Route::get('/', [RoleController::class, 'index'])->name('index')->middleware(['permission:access-all|roles-visibility']);
            Route::post('store', [RoleController::class, 'store'])->name('store')->middleware(['permission:access-all|roles-create']);
            Route::get('edit/{id}', [RoleController::class, 'edit'])->name('edit')->middleware(['permission:access-all|roles-edit']);
            Route::put('update/{id}', [RoleController::class, 'update'])->name('update')->middleware(['permission:access-all|roles-edit']);
            Route::get('delete/{id}', [RoleController::class, 'destroy'])->name('destroy')->middleware(['permission:access-all|roles-destroy']);
            Route::get('give/permission/{id}', [RoleController::class, 'givePermission'])->name('give.permission')->middleware(['permission:access-all|roles-create']);
            Route::post('give/permission/{id}', [RoleController::class, 'saveAssignedPermission'])->name('save.assigned.permission')->middleware(['permission:access-all|roles-create']);
        });
        Route::prefix('products')->as('products.')->group(function () {
            Route::get('/', [ProductController::class, 'index'])->name('index')->middleware(['permission:access-all|product-visibility']);
            Route::get('/create', [ProductController::class, 'create'])->name('create')->middleware(['permission:access-all|product-create']);
            Route::post('/store', [ProductController::class, 'store'])->name('store')->middleware(['permission:access-all|product-create']);
            Route::get('/edit/{id}', [ProductController::class, 'edit'])->name('edit')->middleware(['permission:access-all|product-edit']);
            Route::put('/update/{id}', [ProductController::class, 'update'])->name('update')->middleware(['permission:access-all|product-edit']);
            Route::get('/delete/{id}', [ProductController::class, 'destroy'])->name('destroy')->middleware(['permission:access-all|product-delete']);
            Route::post('/toggle-status/{id}', [ProductController::class, 'toggleStatus'])->name('toggle-status')->middleware(['permission:access-all|product-edit']);
        });

        // Product Categories
        Route::prefix('product-categories')->as('product_categories.')->group(function () {
            Route::get('/', [ProductCategoryController::class, 'index'])->name('index')->middleware(['permission:access-all|category-visibility']);
            Route::post('/store', [ProductCategoryController::class, 'store'])->name('store')->middleware(['permission:access-all|category-create']);
            Route::get('/edit/{id}', [ProductCategoryController::class, 'edit'])->name('edit')->middleware(['permission:access-all|category-edit']);
            Route::put('/update/{id}', [ProductCategoryController::class, 'update'])->name('update')->middleware(['permission:access-all|category-edit']);
            Route::get('/delete/{id}', [ProductCategoryController::class, 'destroy'])->name('destroy')->middleware(['permission:access-all|category-delete']);
            Route::post('/toggle-status/{id}', [ProductCategoryController::class, 'toggleStatus'])->name('toggle-status')->middleware(['permission:access-all|category-edit']);
        });

        // Attributes
        Route::prefix('attributes')->as('attributes.')->group(function () {
            Route::get('/', [AttributeController::class, 'index'])->name('index')->middleware(['permission:access-all|attribute-visibility']);
            Route::post('/store', [AttributeController::class, 'store'])->name('store')->middleware(['permission:access-all|attribute-create']);
            Route::put('/update/{id}', [AttributeController::class, 'update'])->name('update')->middleware(['permission:access-all|attribute-edit']);
            Route::get('/delete/{id}', [AttributeController::class, 'destroy'])->name('destroy')->middleware(['permission:access-all|attribute-delete']);
            
            // Attribute Values
            Route::post('/{attributeId}/values', [AttributeController::class, 'storeValue'])->name('values.store')->middleware(['permission:access-all|attribute-create']);
            Route::put('/values/{id}', [AttributeController::class, 'updateValue'])->name('values.update')->middleware(['permission:access-all|attribute-edit']);
            Route::get('/values/delete/{id}', [AttributeController::class, 'destroyValue'])->name('values.destroy')->middleware(['permission:access-all|attribute-delete']);
        });

        // Featured Products
        Route::prefix('featured-products')->as('featured_products.')->group(function () {
            Route::get('/', [FeaturedProductController::class, 'index'])->name('index')->middleware(['permission:access-all|featured-visibility']);
            Route::get('/create', [FeaturedProductController::class, 'create'])->name('create')->middleware(['permission:access-all|featured-create']);
            Route::post('/store', [FeaturedProductController::class, 'store'])->name('store')->middleware(['permission:access-all|featured-create']);
            Route::get('/edit/{id}', [FeaturedProductController::class, 'edit'])->name('edit')->middleware(['permission:access-all|featured-edit']);
            Route::put('/update/{id}', [FeaturedProductController::class, 'update'])->name('update')->middleware(['permission:access-all|featured-edit']);
            Route::get('/delete/{id}', [FeaturedProductController::class, 'destroy'])->name('destroy')->middleware(['permission:access-all|featured-delete']);
        });
        // Orders Routes
        Route::prefix('orders')->name('orders.')->group(function () {
            Route::get('/', [OrderController::class, 'index'])->name('index');
            Route::get('/create', [OrderController::class, 'create'])->name('create');
            Route::post('/', [OrderController::class, 'store'])->name('store');
            Route::get('/{id}', [OrderController::class, 'show'])->name('show');
            Route::get('/{id}/edit', [OrderController::class, 'edit'])->name('edit');
            Route::put('/{id}', [OrderController::class, 'update'])->name('update');
            Route::delete('/{id}', [OrderController::class, 'destroy'])->name('destroy');
            Route::post('/{id}/update-status', [OrderController::class, 'updateStatus'])->name('update-status');
            Route::post('/{id}/add-conversation', [OrderController::class, 'addConversation'])->name('add-conversation');
            Route::post('/{id}/assign-courier', [OrderController::class, 'assignCourier'])->name('assign-courier');
            Route::get('/{id}/invoice', [OrderController::class, 'generateInvoice'])->name('invoice');
            Route::get('/{id}/sticker', [OrderController::class, 'generateSticker'])->name('sticker');

             Route::post('/{id}/assign-courier', [OrderController::class, 'assignCourier'])->name('assign-courier');
            Route::get('/{id}/track', [OrderController::class, 'trackOrder'])->name('track');
            Route::post('/{id}/cancel-courier', [OrderController::class, 'cancelCourier'])->name('cancel-courier');
            Route::get('/{id}/sticker', [OrderController::class, 'generateSticker'])->name('sticker');
            Route::post('/courier/pricing', [OrderController::class, 'getCourierPricing'])->name('courier-pricing');
            Route::post('/courier/bulk-assign', [OrderController::class, 'bulkAssignCourier'])->name('bulk-assign-courier');
            Route::get('/courier/services', [OrderController::class, 'getCourierServices'])->name('courier-services');
        });


        Route::resource('feature-cards', FeatureCardController::class)->except(['show']);

        // Promotions Routes
        Route::resource('promotions', PromotionController::class);

        Route::resource('categories', CategoryController::class);
        Route::post('categories/{id}/toggle-status', [CategoryController::class, 'toggleStatus'])->name('categories.toggle-status');
        
        // Subcategories
        Route::resource('subcategories', SubcategoryController::class);
        Route::post('subcategories/{id}/toggle-status', [SubcategoryController::class, 'toggleStatus'])->name('subcategories.toggle-status');
        Route::get('subcategories/get-by-category/{categoryId}', [SubcategoryController::class, 'getByCategory'])->name('subcategories.get-by-category');
        
        // Collections (renamed from product_categories)
        Route::resource('collections', CollectionController::class);
        Route::post('collections/{id}/toggle-status', [CollectionController::class, 'toggleStatus'])->name('collections.toggle-status');
        
        Route::post('products/{id}/toggle-status', [ProductController::class, 'toggleStatus'])->name('products.toggle-status');
        Route::get('products/get-subcategories/{categoryId}', [ProductController::class, 'getSubcategories'])->name('products.get-subcategories');
        
   
    });

});