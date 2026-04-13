@extends('layouts.admin.app')

@section('content')
<div class="row mb-32 gy-32">
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <h4 class="mb-0">Create New Order</h4>
            </div>
            <div class="card-body">
                <form id="orderForm">
                    @csrf
                    <div class="row">
                        <div class="col-md-6">
                            <h5>Customer Information</h5>
                            <div class="mb-16">
                                <label class="form-label">Customer Name <span class="text-danger">*</span></label>
                                <input type="text" name="customer_name" class="form-control" required>
                            </div>
                            <div class="mb-16">
                                <label class="form-label">Phone Number <span class="text-danger">*</span></label>
                                <input type="text" name="customer_phone" class="form-control" required>
                            </div>
                            <div class="mb-16">
                                <label class="form-label">Email</label>
                                <input type="email" name="customer_email" class="form-control">
                            </div>
                            <div class="mb-16">
                                <label class="form-label">Shipping Address <span class="text-danger">*</span></label>
                                <textarea name="shipping_address" class="form-control" rows="3" required></textarea>
                            </div>
                            <div class="mb-16">
                                <label class="form-label">Billing Address</label>
                                <textarea name="billing_address" class="form-control" rows="3"></textarea>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-16">
                                    <label class="form-label">City</label>
                                    <input type="text" name="city" class="form-control">
                                </div>
                                <div class="col-md-6 mb-16">
                                    <label class="form-label">State</label>
                                    <input type="text" name="state" class="form-control">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-16">
                                    <label class="form-label">Zip Code</label>
                                    <input type="text" name="zip_code" class="form-control">
                                </div>
                                <div class="col-md-6 mb-16">
                                    <label class="form-label">Country</label>
                                    <input type="text" name="country" class="form-control">
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <h5>Order Items</h5>
                            <div id="items-container">
                                <div class="item-row mb-16 p-16 border rounded">
                                    <div class="row">
                                        <div class="col-md-6 mb-16">
                                            <label class="form-label">Product</label>
                                            <select name="items[0][product_id]" class="form-select product-select" required>
                                                <option value="">Select Product</option>
                                                @foreach($products as $product)
                                                <option value="{{ $product->id }}" data-price="{{ $product->sale_price ?? $product->regular_price }}">
                                                    {{ $product->name }} - {{ number_format($product->sale_price ?? $product->regular_price, 2) }} BDT
                                                </option>
                                                @endforeach
                                            </select>
                                        </div>
                                        <div class="col-md-4 mb-16">
                                            <label class="form-label">Quantity</label>
                                            <input type="number" name="items[0][quantity]" class="form-control quantity" value="1" min="1" required>
                                        </div>
                                        <div class="col-md-2 mb-16">
                                            <label class="form-label">&nbsp;</label>
                                            <button type="button" class="btn btn-danger remove-item form-control">Remove</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="button" id="add-item" class="btn btn-secondary mb-16">Add Another Item</button>
                            
                            <h5>Order Summary</h5>
                            <div class="border rounded p-16">
                                <div class="mb-16">
                                    <label class="form-label">Subtotal</label>
                                    <input type="text" id="subtotal" class="form-control" readonly value="0.00">
                                </div>
                                <div class="mb-16">
                                    <label class="form-label">Discount</label>
                                    <input type="number" name="discount" id="discount" class="form-control" value="0" step="0.01">
                                </div>
                                <div class="mb-16">
                                    <label class="form-label">Shipping Cost</label>
                                    <input type="number" name="shipping_cost" id="shipping_cost" class="form-control" value="0" step="0.01">
                                </div>
                                <div class="mb-16">
                                    <label class="form-label">Tax</label>
                                    <input type="number" name="tax" id="tax" class="form-control" value="0" step="0.01">
                                </div>
                                <div class="mb-16">
                                    <label class="form-label">Total</label>
                                    <input type="text" id="total" class="form-control" readonly value="0.00">
                                </div>
                            </div>
                            
                            <div class="mb-16 mt-16">
                                <label class="form-label">Payment Method</label>
                                <select name="payment_method" class="form-select">
                                    <option value="">Select Payment Method</option>
                                    <option value="cash_on_delivery">Cash on Delivery</option>
                                    <option value="bkash">bKash</option>
                                    <option value="nagad">Nagad</option>
                                    <option value="rocket">Rocket</option>
                                    <option value="card">Card Payment</option>
                                </select>
                            </div>
                            
                            <div class="mb-16">
                                <label class="form-label">Admin Notes</label>
                                <textarea name="admin_notes" class="form-control" rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                    
                    <div class="text-end mt-32">
                        <button type="submit" class="btn btn-primary">Create Order</button>
                        <a href="{{ route('admin.orders.index') }}" class="btn btn-secondary">Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

@push('script')
<script>
    let itemIndex = 1;
    
    // Add item row
    $('#add-item').click(function() {
        let newRow = `
            <div class="item-row mb-16 p-16 border rounded">
                <div class="row">
                    <div class="col-md-6 mb-16">
                        <label class="form-label">Product</label>
                        <select name="items[${itemIndex}][product_id]" class="form-select product-select" required>
                            <option value="">Select Product</option>
                            @foreach($products as $product)
                            <option value="{{ $product->id }}" data-price="{{ $product->sale_price ?? $product->regular_price }}">
                                {{ $product->name }} - {{ number_format($product->sale_price ?? $product->regular_price, 2) }} BDT
                            </option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-4 mb-16">
                        <label class="form-label">Quantity</label>
                        <input type="number" name="items[${itemIndex}][quantity]" class="form-control quantity" value="1" min="1" required>
                    </div>
                    <div class="col-md-2 mb-16">
                        <label class="form-label">&nbsp;</label>
                        <button type="button" class="btn btn-danger remove-item form-control">Remove</button>
                    </div>
                </div>
            </div>
        `;
        $('#items-container').append(newRow);
        itemIndex++;
        attachEvents();
        calculateTotal();
    });
    
    // Remove item
    $(document).on('click', '.remove-item', function() {
        if ($('.item-row').length > 1) {
            $(this).closest('.item-row').remove();
            calculateTotal();
        } else {
            Swal.fire('Error', 'At least one item is required', 'error');
        }
    });
    
    // Calculate total
    function calculateTotal() {
        let subtotal = 0;
        $('.item-row').each(function() {
            let select = $(this).find('.product-select');
            let price = select.find('option:selected').data('price') || 0;
            let quantity = $(this).find('.quantity').val() || 0;
            subtotal += price * quantity;
        });
        
        let discount = parseFloat($('#discount').val()) || 0;
        let shipping = parseFloat($('#shipping_cost').val()) || 0;
        let tax = parseFloat($('#tax').val()) || 0;
        
        let total = subtotal - discount + shipping + tax;
        
        $('#subtotal').val(subtotal.toFixed(2));
        $('#total').val(total.toFixed(2));
    }
    
    function attachEvents() {
        $('.product-select, .quantity, #discount, #shipping_cost, #tax').off('change keyup').on('change keyup', function() {
            calculateTotal();
        });
    }
    
    attachEvents();
    calculateTotal();
    
    // Form submission
    $('#orderForm').on('submit', function(e) {
        e.preventDefault();
        
        let formData = new FormData(this);
        
        $.ajax({
            url: '{{ route("admin.orders.store") }}',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    Swal.fire({
                        title: 'Success!',
                        text: response.message,
                        icon: 'success',
                        confirmButtonText: 'View Order'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '{{ route("admin.orders.show", "") }}/' + response.order_id;
                        } else {
                            window.location.href = '{{ route("admin.orders.index") }}';
                        }
                    });
                }
            },
            error: function(xhr) {
                let errors = xhr.responseJSON.errors;
                let errorMessage = '<ul>';
                $.each(errors, function(key, value) {
                    errorMessage += `<li>${value}</li>`;
                });
                errorMessage += '</ul>';
                Swal.fire('Error', errorMessage, 'error');
            }
        });
    });
</script>
@endpush