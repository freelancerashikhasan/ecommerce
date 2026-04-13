<?php
// app/Http/Controllers/User/DashboardController.php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        $stats = [
            'total_orders' => Order::where('customer_phone', $user->phone)->count(),
            'total_spent' => Order::where('customer_phone', $user->phone)
                ->whereIn('payment_status', ['paid', 'completed'])
                ->sum('total'),
            'reviews_count' => Review::where('user_id', $user->id)->count(),
        ];
        
        $recentOrders = Order::where('customer_phone', $user->phone)
            ->latest()
            ->limit(5)
            ->get();
            
        $wishlistCount = $user->wishlist()->count();
        
        return Inertia::render('Dashboard/Index', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'wishlistCount' => $wishlistCount,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
            ]
        ]);
    }

    public function profile()
    {
        $user = Auth::user();
        $addresses = Address::where('user_id', $user->id)->get();
        $defaultAddress = Address::where('user_id', $user->id)->where('is_default', true)->first();
        
        return Inertia::render('Dashboard/Profile', [
            'user' => $user,
            'addresses' => $addresses,
            'defaultAddress' => $defaultAddress,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'required|string|max:20|unique:users,phone,' . $user->id,
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        
        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::delete('public/avatars/' . $user->avatar);
            }
            $avatarPath = $request->file('avatar')->store('public/avatars');
            $validated['avatar'] = basename($avatarPath);
        }
        
        $user->update($validated);
        
        return back()->with('success', 'Profile updated successfully');
    }
      public function showChangePassword()
    {
        return Inertia::render('Dashboard/ChangePassword');
    }

    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|current_password',
            'new_password' => 'required|string|min:8|confirmed',
        ]);
        
        Auth::user()->update([
            'password' => Hash::make($validated['new_password']),
        ]);
        
        return back()->with('success', 'Password changed successfully');
    }

    public function orders()
    {
        $user = Auth::user();
        $orders = Order::where('customer_phone', $user->phone)
            ->with('items')
            ->latest()
            ->paginate(10);
        
        return Inertia::render('Dashboard/Orders', [
            'orders' => $orders,
        ]);
    }

    public function orderDetails($id)
    {
        $user = Auth::user();
        $order = Order::where('customer_phone', $user->phone)
            ->with('items')
            ->findOrFail($id);
        
        return Inertia::render('Dashboard/OrderDetails', [
            'order' => $order,
        ]);
    }

    public function trackOrder($orderNumber)
    {
        $user = Auth::user();
        $order = Order::where('customer_phone', $user->phone)
            ->where('order_number', $orderNumber)
            ->firstOrFail();
        
        return Inertia::render('Dashboard/TrackOrder', [
            'order' => $order,
        ]);
    }

    public function wishlist()
    {
        $user = Auth::user();
        $wishlist = $user->wishlist()
            ->with('images')
            ->paginate(12);
        
        return Inertia::render('Dashboard/Wishlist', [
            'wishlist' => $wishlist,
        ]);
    }

    public function addToWishlist(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);
        
        $user = Auth::user();
        
        if (!$user->wishlist()->where('product_id', $validated['product_id'])->exists()) {
            $user->wishlist()->attach($validated['product_id']);
            return back()->with('success', 'Product added to wishlist');
        }
        
        return back()->with('error', 'Product already in wishlist');
    }

    public function removeFromWishlist($productId)
    {
        $user = Auth::user();
        $user->wishlist()->detach($productId);
        
        return back()->with('success', 'Product removed from wishlist');
    }

    public function reviews()
    {
        $user = Auth::user();
        $reviews = Review::where('user_id', $user->id)
            ->with('product')
            ->latest()
            ->paginate(10);
        
        return Inertia::render('Dashboard/Reviews', [
            'reviews' => $reviews,
        ]);
    }

    public function createReview(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'order_id' => 'nullable|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);
        
        // Check if user has purchased this product
        $hasPurchased = Order::where('customer_phone', Auth::user()->phone)
            ->whereHas('items', function($query) use ($validated) {
                $query->where('product_id', $validated['product_id']);
            })
            ->exists();
        
        $validated['user_id'] = Auth::id();
        $validated['is_verified'] = $hasPurchased;
        
        // Handle images
        if ($request->hasFile('images')) {
            $images = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('public/reviews');
                $images[] = basename($path);
            }
            $validated['images'] = $images;
        }
        
        Review::create($validated);
        
        return back()->with('success', 'Review submitted successfully');
    }

    public function updateReview(Request $request, $id)
    {
        $review = Review::where('user_id', Auth::id())->findOrFail($id);
        
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);
        
        $review->update($validated);
        
        return back()->with('success', 'Review updated successfully');
    }

    public function deleteReview($id)
    {
        $review = Review::where('user_id', Auth::id())->findOrFail($id);
        $review->delete();
        
        return back()->with('success', 'Review deleted successfully');
    }

    public function addresses()
    {
        $user = Auth::user();
        $addresses = Address::where('user_id', $user->id)->get();
        
        return Inertia::render('Dashboard/Addresses', [
            'addresses' => $addresses,
        ]);
    }

    public function addAddress(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'city' => 'required|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'is_default' => 'boolean',
        ]);
        
        $validated['user_id'] = Auth::id();
        
        if ($validated['is_default'] ?? false) {
            Address::where('user_id', Auth::id())->update(['is_default' => false]);
        }
        
        Address::create($validated);
        
        return back()->with('success', 'Address added successfully');
    }

    public function updateAddress(Request $request, $id)
    {
        $address = Address::where('user_id', Auth::id())->findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'city' => 'required|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'is_default' => 'boolean',
        ]);
        
        if ($validated['is_default'] ?? false) {
            Address::where('user_id', Auth::id())->update(['is_default' => false]);
        }
        
        $address->update($validated);
        
        return back()->with('success', 'Address updated successfully');
    }

    public function deleteAddress($id)
    {
        $address = Address::where('user_id', Auth::id())->findOrFail($id);
        $address->delete();
        
        return back()->with('success', 'Address deleted successfully');
    }

    public function setDefaultAddress($id)
    {
        Address::where('user_id', Auth::id())->update(['is_default' => false]);
        Address::where('user_id', Auth::id())->where('id', $id)->update(['is_default' => true]);
        
        return back()->with('success', 'Default address updated');
    }
}