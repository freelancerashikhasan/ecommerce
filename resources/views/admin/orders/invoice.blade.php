<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $order->order_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
            font-size: 16px;
            line-height: 24px;
            color: #555;
        }
        .invoice-box table {
            width: 100%;
            line-height: inherit;
            text-align: left;
            border-collapse: collapse;
        }
        .invoice-box table td {
            padding: 5px;
            vertical-align: top;
        }
        .invoice-box table tr td:nth-child(2) {
            text-align: right;
        }
        .invoice-box table tr.top table td {
            padding-bottom: 20px;
        }
        .invoice-box table tr.top table td.title {
            font-size: 45px;
            line-height: 45px;
            color: #333;
        }
        .invoice-box table tr.information table td {
            padding-bottom: 40px;
        }
        .invoice-box table tr.heading td {
            background: #eee;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
        }
        .invoice-box table tr.details td {
            padding-bottom: 20px;
        }
        .invoice-box table tr.item td {
            border-bottom: 1px solid #eee;
        }
        .invoice-box table tr.item.last td {
            border-bottom: none;
        }
        .invoice-box table tr.total td:nth-child(2) {
            border-top: 2px solid #eee;
            font-weight: bold;
        }
        @media only screen and (max-width: 600px) {
            .invoice-box table tr.top table td {
                width: 100%;
                display: block;
                text-align: center;
            }
            .invoice-box table tr.information table td {
                width: 100%;
                display: block;
                text-align: center;
            }
        }
        .text-center { text-align: center; }
        .mt-20 { margin-top: 20px; }
        .mb-20 { margin-bottom: 20px; }
        .badge {
            display: inline-block;
            padding: 5px 10px;
            background: #f0f0f0;
            border-radius: 4px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <table cellpadding="0" cellspacing="0">
            <tr class="top">
                <td colspan="2">
                    <table>
                        <tr>
                            <td class="title">
                                <h2>{{ siteSettings()->name ?? 'E-Commerce Store' }}</h2>
                            </td>
                            <td>
                                Invoice #: {{ $order->order_number }}<br>
                                Created: {{ $order->order_date->format('d M Y') }}<br>
                                Due: {{ $order->order_date->addDays(7)->format('d M Y') }}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <tr class="information">
                <td colspan="2">
                    <table>
                        <tr>
                            <td>
                                {{ siteSettings()->name ?? 'Store Name' }}<br>
                                {{ siteSettings()->address ?? 'Address' }}<br>
                                {{ siteSettings()->phone ?? 'Phone' }}
                            </td>
                            <td>
                                Customer: {{ $order->customer_name }}<br>
                                Phone: {{ $order->customer_phone }}<br>
                                Email: {{ $order->customer_email ?? 'N/A' }}<br>
                                Total Orders: {{ $orderCount }}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <tr class="heading">
                <td>Shipping Address</td>
                <td>Billing Address</td>
            </tr>
            
            <tr class="details">
                <td>
                    {{ $order->shipping_address }}<br>
                    {{ $order->city }}, {{ $order->state }} {{ $order->zip_code }}<br>
                    {{ $order->country }}
                </td>
                <td>
                    {{ $order->billing_address ?? $order->shipping_address }}<br>
                    {{ $order->city }}, {{ $order->state }} {{ $order->zip_code }}<br>
                    {{ $order->country }}
                </td>
            </tr>
            
            <tr class="heading">
                <td>Item</td>
                <td>Price</td>
            </tr>
            
            @foreach($order->items as $item)
            <tr class="item">
                <td>
                    {{ $item->product_name }}<br>
                    <small>SKU: {{ $item->product_sku }} | Qty: {{ $item->quantity }}</small>
                </td>
                <td>{{ number_format($item->total_price, 2) }} BDT</td>
            </tr>
            @endforeach
            
            <tr class="total">
                <td></td>
                <td>Subtotal: {{ number_format($order->subtotal, 2) }} BDT</td>
            </tr>
            @if($order->discount > 0)
            <tr class="total">
                <td></td>
                <td>Discount: -{{ number_format($order->discount, 2) }} BDT</td>
            </tr>
            @endif
            @if($order->shipping_cost > 0)
            <tr class="total">
                <td></td>
                <td>Shipping: {{ number_format($order->shipping_cost, 2) }} BDT</td>
            </tr>
            @endif
            @if($order->tax > 0)
            <tr class="total">
                <td></td>
                <td>Tax: {{ number_format($order->tax, 2) }} BDT</td>
            </tr>
            @endif
            <tr class="total">
                <td></td>
                <td><strong>Total: {{ number_format($order->total, 2) }} BDT</strong></td>
            </tr>
        </table>
        
        <div class="text-center mt-20">
            <p><strong>Payment Status:</strong> <span class="badge">{{ ucfirst($order->payment_status) }}</span></p>
            <p><strong>Order Status:</strong> <span class="badge">{{ ucfirst($order->order_status) }}</span></p>
            @if($order->courier_type)
            <p><strong>Courier:</strong> {{ ucfirst($order->courier_type) }} | Consignment: {{ $order->courier_consignment_id }}</p>
            @endif
            <p>Thank you for your business!</p>
        </div>
    </div>
</body>
</html>