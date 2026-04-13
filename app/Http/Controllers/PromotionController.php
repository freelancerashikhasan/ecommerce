<?php
// app/Http/Controllers/PromotionController.php

namespace App\Http\Controllers;

use App\Models\Promotion;
use App\Models\FeatureCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PromotionController extends Controller
{
    public function getHomePromotions()
    {
        // Get active sliders
        $sliders = Promotion::active()
            ->where('type', 'slider')
            ->orderBy('order')
            ->get()
            ->map(function($slider) {
                return [
                    'id' => $slider->id,
                    'title' => $slider->title,
                    'description' => $slider->description,
                    'image' => $slider->image ? Storage::url($slider->image) : null,
                    'price' => $slider->price,
                    'originalPrice' => $slider->original_price,
                    'offerText' => $slider->subtitle ?? $slider->badge_text,
                    'button_text' => $slider->button_text,
                    'button_link' => $slider->button_link,
                    'product_id' => $slider->product_id
                ];
            });

        // Get feature cards
        $featureCards = FeatureCard::where('is_active', true)
            ->orderBy('order')
            ->get()
            ->map(function($card) {
                return [
                    'id' => $card->id,
                    'icon' => $card->icon,
                    'title' => $card->title,
                    'description' => $card->description
                ];
            });

        // Get feature products (special promotions)
        $featureProducts = Promotion::active()
            ->where('type', 'feature_product')
            ->with('product')
            ->orderBy('order')
            ->limit(3)
            ->get()
            ->map(function($promo) {
                $product = $promo->product;
                if (!$product) return null;
                
                return [
                    'id' => $promo->id,
                    'title' => $promo->title,
                    'description' => $promo->description,
                    'image' => $product->featured_image ? Storage::url($product->featured_image) : null,
                    'badge_text' => $promo->badge_text,
                    'button_text' => $promo->button_text ?? 'Shop Now',
                    'button_link' => $promo->button_link ?? route('product.show', $product->slug),
                    'price' => $promo->price ?? ($product->sale_price ?? $product->regular_price),
                    'original_price' => $promo->original_price ?? $product->regular_price,
                    'product_id' => $product->id,
                    'product_slug' => $product->slug
                ];
            })
            ->filter();

        return [
            'sliders' => $sliders,
            'featureCards' => $featureCards,
            'featureProducts' => $featureProducts
        ];
    }
}