<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;

class PageController extends Controller
{
    /**
     * Show About Us page
     */
    public function aboutUs()
    {
        return Inertia::render('AboutUs');
    }

    /**
     * Show Contact Us page
     */
    public function contactUs()
    {
        return Inertia::render('ContactUs');
    }

    /**
     * Submit Contact Form
     */
    public function submitContact(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|min:10|max:5000'
        ]);

        try {
            // Send email notification (optional)
            // Mail::to('info@chinabdimport.com')->send(new ContactFormMail($validated));
            
            // You can also save to database if needed
            // ContactMessage::create($validated);
            
            return redirect()->back()->with('success', 'Message sent successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to send message. Please try again.');
        }
    }

    // Your existing methods...
    public function faq()
    {
        return Inertia::render('FAQ');
    }

    public function shippingInfo()
    {
        return Inertia::render('ShippingInfo');
    }

    public function returnsPolicy()
    {
        return Inertia::render('ReturnsPolicy');
    }

    public function privacyPolicy()
    {
        return Inertia::render('PrivacyPolicy');
    }

    public function termsOfService()
    {
        return Inertia::render('TermsOfService');
    }
}