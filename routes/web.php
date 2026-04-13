<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ManualOrderController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProductFilterController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\User\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ProductController::class, 'collections'])->name('collections');
Route::get('/cart',  [CartController::class, 'index'])->name('cart.index');
// routes/web.php
Route::get('/product/{id}', [ProductController::class, 'show'])->name('product.show');
Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');

Route::get('/products', [ProductFilterController::class, 'index'])->name('products.index');
Route::get('/products/category/{slug}', [ProductFilterController::class, 'index'])->name('products.category');
Route::get('/products/subcategory/{slug}', [ProductFilterController::class, 'index'])->name('products.subcategory');
Route::get('/products/collection/{slug}', [ProductFilterController::class, 'index'])->name('products.collection');

// Guest checkout routes
Route::post('/guest-checkout', [OrderController::class, 'guestCheckout'])->name('guest.checkout');
Route::get('/order-success/{order}', [OrderController::class, 'orderSuccess'])->name('order.success');
Route::get('/track-order/{orderNumber}', [OrderController::class, 'trackOrder'])->name('order.track');

Route::get('/manual-order', [ManualOrderController::class, 'create'])->name('manual-order.create');
Route::post('/manual-order', [ManualOrderController::class, 'store'])->name('manual-order.store');

Route::get('/faq', [PageController::class, 'faq'])->name('faq');
Route::get('/shipping-info', [PageController::class, 'shippingInfo'])->name('shipping.info');
Route::get('/returns-policy', [PageController::class, 'returnsPolicy'])->name('returns.policy');
Route::get('/privacy-policy', [PageController::class, 'privacyPolicy'])->name('privacy.policy');
Route::get('/terms-of-service', [PageController::class, 'termsOfService'])->name('terms.service');

Route::get('/about', [PageController::class, 'aboutUs'])->name('about.us');
Route::get('/contact', [PageController::class, 'contactUs'])->name('contact.us');
Route::post('/contact', [PageController::class, 'submitContact'])->name('contact.submit');

Route::middleware(['auth'])->group(function () {
    // Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    // Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    // Route::put('/cart/{cart}', [CartController::class, 'update'])->name('cart.update');
    // Route::delete('/cart/{cart}', [CartController::class, 'destroy'])->name('cart.destroy');
         Route::get('/home', [DashboardController::class, 'index'])->name('home');

     Route::get('/profile', [DashboardController::class, 'profile'])->name('profile');
    Route::put('/profile', [DashboardController::class, 'updateProfile'])->name('profile.update');
    Route::get('/change-password', [DashboardController::class, 'showChangePassword'])->name('change-password');
    Route::post('/change-password', [DashboardController::class, 'changePassword'])->name('change-password.update');
    
    // Orders
    Route::get('/orders', [DashboardController::class, 'orders'])->name('orders');
    Route::get('/orders/{id}', [DashboardController::class, 'orderDetails'])->name('order.details');
    Route::get('/track/{orderNumber}', [DashboardController::class, 'trackOrder'])->name('track.order');
    
    // Wishlist
    Route::get('/wishlist', [DashboardController::class, 'wishlist'])->name('wishlist');
    Route::post('/wishlist', [DashboardController::class, 'addToWishlist'])->name('wishlist.add');
    Route::delete('/wishlist/{productId}', [DashboardController::class, 'removeFromWishlist'])->name('wishlist.remove');
    
    // Reviews
    Route::get('/reviews', [DashboardController::class, 'reviews'])->name('reviews');
    Route::post('/reviews', [DashboardController::class, 'createReview'])->name('reviews.create');
    Route::put('/reviews/{id}', [DashboardController::class, 'updateReview'])->name('reviews.update');
    Route::delete('/reviews/{id}', [DashboardController::class, 'deleteReview'])->name('reviews.delete');
    
    // Addresses
    Route::get('/addresses', [DashboardController::class, 'addresses'])->name('addresses');
    Route::post('/addresses', [DashboardController::class, 'addAddress'])->name('addresses.add');
    Route::put('/addresses/{id}', [DashboardController::class, 'updateAddress'])->name('addresses.update');
    Route::delete('/addresses/{id}', [DashboardController::class, 'deleteAddress'])->name('addresses.delete');
    Route::post('/addresses/{id}/default', [DashboardController::class, 'setDefaultAddress'])->name('addresses.default');
});

require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/ajax.php';
