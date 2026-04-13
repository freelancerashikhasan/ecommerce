<?php
// app/Http/Controllers/Auth/GoogleAuthController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Redirect to Google OAuth
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }
    
    /**
     * Handle Google OAuth callback
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            // Check if user exists by email
            $user = User::where('email', $googleUser->getEmail())->first();
            
            if (!$user) {
                // Check if user exists by google_id
                $user = User::where('google_id', $googleUser->getId())->first();
            }
            
            if (!$user) {
                // Create new user
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'password' => Hash::make(Str::random(16)),
                    'email_verified_at' => now(),
                ]);
            } else {
                // Update google_id if not set
                if (!$user->google_id) {
                    $user->update([
                        'google_id' => $googleUser->getId(),
                        'avatar' => $googleUser->getAvatar(),
                    ]);
                }
            }
            
            // Login user
            Auth::login($user, true);
            
            // Regenerate session
            request()->session()->regenerate();
            
            // Redirect to home
            return redirect()->intended(route('home'));
            
        } catch (\Exception $e) {
            \Log::error('Google login error: ' . $e->getMessage());
            return redirect()->route('login')->withErrors([
                'email' => 'Google authentication failed. Please try again.'
            ]);
        }
    }
}