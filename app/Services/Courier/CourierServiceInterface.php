<?php

namespace App\Services\Courier;

interface CourierServiceInterface
{
    /**
     * Create a consignment for an order
     */
    public function createConsignment($orderData);
    
    /**
     * Track a consignment
     */
    public function trackConsignment($consignmentId);
    
    /**
     * Get pricing for a delivery
     */
    public function getPricing($data);
    
    /**
     * Cancel a consignment
     */
    public function cancelConsignment($consignmentId);
    
    /**
     * Generate sticker/label
     */
    public function generateSticker($consignmentId);
    
    /**
     * Get available services
     */
    public function getServices();
}