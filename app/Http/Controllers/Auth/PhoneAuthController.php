<?php
// app/Http/Controllers/Auth/PhoneAuthController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PhoneAuthController extends Controller
{
    /**
     * Send OTP to phone number
     */
    public function sendOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|regex:/^[0-9]{10,15}$/',
        ]);

        $phone = $request->phone;
        
        // Generate 6-digit OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Store OTP in cache with 5 minutes expiration
        Cache::put('otp_' . $phone, $otp, now()->addMinutes(5));
        
        // In production, send SMS here
        $this->sendSms($phone, "Your verification code is: {$otp}");
        
        // For development, log the OTP
        \Log::info('OTP for ' . $phone . ': ' . $otp);
        
        return response()->json([
            'success' => true,
            'message' => 'OTP sent successfully',
            'debug_otp' => config('app.env') === 'local' ? $otp : null
        ]);
    }
    
    /**
     * Verify OTP and login/register user
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|regex:/^[0-9]{10,15}$/',
            'otp' => 'required|string|size:6',
            'remember' => 'boolean'
        ]);
        
        $phone = $request->phone;
        $otp = $request->otp;
        
        // Check if OTP exists and matches
        $cachedOtp = Cache::get('otp_' . $phone);
        
        if (!$cachedOtp) {
            return response()->json([
                'errors' => [
                    'otp' => ['OTP expired or not found. Please request a new code.']
                ]
            ], 422);
        }
        
        if ($cachedOtp != $otp) {
            return response()->json([
                'errors' => [
                    'otp' => ['Invalid OTP code. Please try again.']
                ]
            ], 422);
        }
        
        // Find or create user
        $user = User::where('phone', $phone)->first();
        
        if (!$user) {
            // Create new user
            $user = User::create([
                'name' => 'User_' . substr($phone, -4),
                'phone' => $phone,
                'email' => $phone . '@temp.user',
                'password' => Hash::make(Str::random(16)),
                'phone_verified_at' => now(),
            ]);
        } else {
            // Update phone verification
            $user->update(['phone_verified_at' => now()]);
        }
        
        // Delete OTP from cache
        Cache::forget('otp_' . $phone);
        
        // Login user
        Auth::login($user, $request->remember ?? false);
        
        // Regenerate session
        $request->session()->regenerate();
        
        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'redirect' => route('home')
        ]);
    }
    
    /**
     * Send SMS (implement with your SMS provider)
     */
    private function sendSms($phone, $message)
    {
        // Example with Twilio (uncomment and configure if using Twilio)
        /*
        try {
            $twilio = new \Twilio\Rest\Client(
                config('services.twilio.sid'), 
                config('services.twilio.token')
            );
            $twilio->messages->create($phone, [
                'from' => config('services.twilio.phone_number'),
                'body' => $message
            ]);
        } catch (\Exception $e) {
            \Log::error('SMS sending failed: ' . $e->getMessage());
        }
        */
        
        // For development, just log
        \Log::info("SMS to {$phone}: {$message}");
    }
}