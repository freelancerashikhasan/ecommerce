<?php

namespace App\Helpers;

use Mpdf\Mpdf;

class PdfHelper
{
    /**
     * Generate PDF from view
     */
    public static function generate($view, $data = [], $options = [])
    {
        $defaultOptions = [
            'mode' => 'utf-8',
            'format' => 'A4',
            'orientation' => 'P',
            'margin_left' => 10,
            'margin_right' => 10,
            'margin_top' => 10,
            'margin_bottom' => 10,
            'default_font_size' => 10,
            'default_font' => 'dejavusans',
        ];
        
        $options = array_merge($defaultOptions, $options);
        
        $mpdf = new Mpdf($options);
        
        $html = view($view, $data)->render();
        $mpdf->WriteHTML($html);
        
        return $mpdf;
    }
    
    /**
     * Generate invoice PDF
     */
    public static function generateInvoice($order, $orderCount)
    {
        return self::generate('admin.orders.invoice', [
            'order' => $order,
            'orderCount' => $orderCount
        ], [
            'title' => 'Invoice #' . $order->order_number
        ]);
    }
    
    /**
     * Generate sticker PDF
     */
    public static function generateSticker($order)
    {
        return self::generate('admin.orders.sticker', [
            'order' => $order
        ], [
            'format' => [100, 150],
            'margin_left' => 5,
            'margin_right' => 5,
            'margin_top' => 5,
            'margin_bottom' => 5,
            'default_font_size' => 9,
            'title' => 'Sticker - ' . $order->order_number
        ]);
    }
}