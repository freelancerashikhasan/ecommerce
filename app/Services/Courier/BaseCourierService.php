<?php

namespace App\Services\Courier;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

abstract class BaseCourierService
{
    protected $apiKey;
    protected $apiSecret;
    protected $baseUrl;
    protected $isSandbox;
    
    public function __construct()
    {
        $this->apiKey = config('courier.' . $this->getCourierName() . '.api_key');
        $this->apiSecret = config('courier.' . $this->getCourierName() . '.api_secret');
        $this->baseUrl = config('courier.' . $this->getCourierName() . '.base_url');
        $this->isSandbox = config('courier.' . $this->getCourierName() . '.sandbox', true);
    }
    
    abstract protected function getCourierName();
    
    protected function makeRequest($method, $endpoint, $data = [], $headers = [])
    {
        try {
            $url = $this->baseUrl . $endpoint;
            
            $defaultHeaders = array_merge([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ], $headers);
            
            $response = Http::withHeaders($defaultHeaders)
                ->timeout(30)
                ->$method($url, $data);
            
            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json(),
                    'status_code' => $response->status()
                ];
            }
            
            return [
                'success' => false,
                'error' => $response->body(),
                'status_code' => $response->status()
            ];
            
        } catch (\Exception $e) {
            Log::error($this->getCourierName() . ' API Error: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'status_code' => 500
            ];
        }
    }
    
    protected function formatAddress($address)
    {
        return [
            'address' => $address['address'] ?? '',
            'city' => $address['city'] ?? '',
            'state' => $address['state'] ?? '',
            'postal_code' => $address['zip_code'] ?? '',
            'country' => $address['country'] ?? 'Bangladesh',
            'phone' => $address['phone'] ?? '',
            'name' => $address['name'] ?? ''
        ];
    }
}