<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Sticker - {{ $order->order_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .sticker {
            width: 4in;
            height: 3in;
            border: 1px solid #000;
            padding: 10px;
            margin: 0 auto;
        }
        .text-center {
            text-align: center;
        }
        .barcode {
            text-align: center;
            margin: 10px 0;
        }
        .qr-code {
            text-align: center;
            margin: 10px 0;
        }
        .order-info {
            margin: 10px 0;
        }
        .courier-info {
            border-top: 1px dashed #000;
            margin-top: 10px;
            padding-top: 10px;
        }
        .small {
            font-size: 10px;
        }
        @page {
            size: 4in 3in;
            margin: 0;
        }
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            .sticker {
                border: none;
                page-break-after: avoid;
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="sticker">
        <div class="text-center">
            <h3>{{ siteSettings()->name ?? 'E-Commerce Store' }}</h3>
        </div>
        
        <div class="order-info">
            <strong>Order #:</strong> {{ $order->order_number }}<br>
            <strong>Customer:</strong> {{ $order->customer_name }}<br>
            <strong>Phone:</strong> {{ $order->customer_phone }}<br>
            <strong>Address:</strong> {{ $order->shipping_address }}<br>
        </div>
        
        <div class="barcode">
            <div>*{{ $order->order_number }}*</div>
            <div class="small">Order Number</div>
        </div>
        
        @if($order->courier_consignment_id)
        <div class="courier-info">
            <strong>Courier:</strong> {{ ucfirst($order->courier_type) }}<br>
            <strong>Consignment ID:</strong> {{ $order->courier_consignment_id }}<br>
            <div class="barcode">
                <div>*{{ $order->courier_consignment_id }}*</div>
                <div class="small">Consignment ID</div>
            </div>
        </div>
        @endif
        
        <div class="text-center small">
            Total: {{ number_format($order->total, 2) }} BDT | Items: {{ $order->items->count() }}
        </div>
    </div>
</body>
</html>