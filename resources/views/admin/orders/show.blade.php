@extends('layouts.admin.app')

@section('content')
<div class="row mb-32 gy-32">
    <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
            <h4 class="mb-0">Order #{{ $order->order_number }}</h4>
            <div>
                <a href="{{ route('admin.orders.invoice', $order->id) }}" class="btn btn-secondary me-16" target="_blank">
                    <i class="ri-printer-line"></i> Print Invoice
                </a>
                @if($order->courier_type && $order->courier_consignment_id)
                <a href="{{ route('admin.orders.sticker', $order->id) }}" class="btn btn-info" target="_blank">
                    <i class="ri-qr-code-line"></i> Print Sticker
                </a>
                @endif
            </div>
        </div>
    </div>

    <div class="col-lg-8">
        <!-- Order Items -->
        <div class="card mb-32">
            <div class="card-header">
                <h5 class="mb-0">Order Items</h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($order->items as $item)
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center">
                                        @if($item->product_image)
                                        <img src="{{ asset($item->product_image) }}" alt="{{ $item->product_name }}" width="50" class="me-8">
                                        @endif
                                        <div>
                                            <strong>{{ $item->product_name }}</strong>
                                            @if($item->attributes)
                                            <br><small>{{ json_encode($item->attributes) }}</small>
                                            @endif
                                        </div>
                                    </div>
                                </td>
                                <td>{{ $item->product_sku }}</td>
                                <td>{{ $item->quantity }}</td>
                                <td>{{ number_format($item->unit_price, 2) }} BDT</td>
                                <td>{{ number_format($item->total_price, 2) }} BDT</td>
                            </tr>
                            @endforeach
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="4" class="text-end"><strong>Subtotal:</strong></td>
                                <td>{{ number_format($order->subtotal, 2) }} BDT</td>
                            </tr>
                            @if($order->discount > 0)
                            <tr>
                                <td colspan="4" class="text-end"><strong>Discount:</strong></td>
                                <td>-{{ number_format($order->discount, 2) }} BDT</td>
                            </tr>
                            @endif
                            @if($order->shipping_cost > 0)
                            <tr>
                                <td colspan="4" class="text-end"><strong>Shipping:</strong></td>
                                <td>{{ number_format($order->shipping_cost, 2) }} BDT</td>
                            </tr>
                            @endif
                            @if($order->tax > 0)
                            <tr>
                                <td colspan="4" class="text-end"><strong>Tax:</strong></td>
                                <td>{{ number_format($order->tax, 2) }} BDT</td>
                            </tr>
                            @endif
                            <tr class="table-active">
                                <td colspan="4" class="text-end"><strong>Total:</strong></td>
                                <td><strong>{{ number_format($order->total, 2) }} BDT</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>

        <!-- Tracking History -->
        <div class="card mb-32">
            <div class="card-header">
                <h5 class="mb-0">Tracking History</h5>
            </div>
            <div class="card-body">
                @if($order->tracking_history && count($order->tracking_history) > 0)
                <div class="timeline">
                    @foreach($order->tracking_history as $track)
                    <div class="timeline-item mb-16">
                        <div class="d-flex">
                            <div class="timeline-badge me-16">
                                <i class="ri-checkbox-circle-line text-success"></i>
                            </div>
                            <div>
                                <strong>{{ ucfirst($track['status']) }}</strong>
                                <p class="mb-0">{{ $track['description'] }}</p>
                                <small class="text-muted">{{ \Carbon\Carbon::parse($track['created_at'])->format('d M Y, h:i A') }}</small>
                                @if(isset($track['location']))
                                <br><small><i class="ri-map-pin-line"></i> {{ $track['location'] }}</small>
                                @endif
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
                @else
                <p class="text-muted">No tracking history available.</p>
                @endif
            </div>
        </div>

        <!-- Courier Assignment Section -->
        <div class="card mb-32">
            <div class="card-header">
                <h5 class="mb-0">Courier Assignment</h5>
            </div>
            <div class="card-body">
                @if($order->courier_consignment_id)
                    <div class="alert alert-info">
                        <strong>Courier:</strong> {{ ucfirst($order->courier_type) }}<br>
                        <strong>Consignment ID:</strong> {{ $order->courier_consignment_id }}<br>
                        @if($order->tracking_code)
                        <strong>Tracking Code:</strong> {{ $order->tracking_code }}<br>
                        @endif
                        <button type="button" id="trackOrderBtn" class="btn btn-sm btn-info mt-8">
                            <i class="ri-map-pin-line"></i> Track Order
                        </button>
                        <button type="button" id="cancelCourierBtn" class="btn btn-sm btn-danger mt-8">
                            <i class="ri-close-line"></i> Cancel Courier
                        </button>
                    </div>
                @else
                    <form id="courierForm">
                        @csrf
                        <div class="mb-16">
                            <label class="form-label">Courier Type</label>
                            <select name="courier_type" id="courier_type" class="form-select" required>
                                <option value="">Select Courier</option>
                                <option value="pathao">Pathao</option>
                                <option value="steadfast">Steadfast</option>
                            </select>
                        </div>
                        
                        <div class="mb-16">
                            <label class="form-label">Weight (kg)</label>
                            <input type="number" name="weight" id="weight" class="form-control" step="0.1" min="0.1" value="0.5">
                            <small class="text-muted">Estimated weight based on items</small>
                        </div>
                        
                        <div id="pricingInfo" class="mb-16" style="display: none;">
                            <div class="alert alert-info">
                                <strong>Delivery Charge:</strong> <span id="deliveryCharge">0.00</span> BDT<br>
                                <strong>COD Charge:</strong> <span id="codCharge">0.00</span> BDT<br>
                                <strong>Total Charge:</strong> <span id="totalCharge">0.00</span> BDT
                            </div>
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-100">
                            <i class="ri-send-plane-line"></i> Assign Courier
                        </button>
                    </form>
                @endif
            </div>
        </div>

        <!-- Tracking Modal -->
        <div class="modal fade" id="trackingModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Order Tracking</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div id="trackingContent">
                            <div class="text-center">
                                <div class="spinner-border" role="status"></div>
                                <p>Loading tracking information...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div class="col-lg-4">
        <!-- Customer Info -->
        <div class="card mb-32">
            <div class="card-header">
                <h5 class="mb-0">Customer Information</h5>
            </div>
            <div class="card-body">
                <p><strong>Name:</strong> {{ $order->customer_name }}</p>
                <p><strong>Phone:</strong> {{ $order->customer_phone }}</p>
                <p><strong>Email:</strong> {{ $order->customer_email ?? 'N/A' }}</p>
                <p><strong>Total Orders:</strong> <span class="badge bg-info">{{ $orderCount }}</span></p>
                <p><strong>Shipping Address:</strong><br>{{ $order->shipping_address }}</p>
                @if($order->billing_address)
                <p><strong>Billing Address:</strong><br>{{ $order->billing_address }}</p>
                @endif
            </div>
        </div>

        <!-- Order Status Update -->
        <div class="card mb-32">
            <div class="card-header">
                <h5 class="mb-0">Update Status</h5>
            </div>
            <div class="card-body">
                <form id="statusUpdateForm">
                    @csrf
                    <div class="mb-16">
                        <label class="form-label">Order Status</label>
                        <select name="order_status" class="form-select" required>
                            <option value="pending" {{ $order->order_status == 'pending' ? 'selected' : '' }}>Pending</option>
                            <option value="processing" {{ $order->order_status == 'processing' ? 'selected' : '' }}>Processing</option>
                            <option value="confirmed" {{ $order->order_status == 'confirmed' ? 'selected' : '' }}>Confirmed</option>
                            <option value="shipped" {{ $order->order_status == 'shipped' ? 'selected' : '' }}>Shipped</option>
                            <option value="delivered" {{ $order->order_status == 'delivered' ? 'selected' : '' }}>Delivered</option>
                            <option value="cancelled" {{ $order->order_status == 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                            <option value="returned" {{ $order->order_status == 'returned' ? 'selected' : '' }}>Returned</option>
                        </select>
                    </div>
                    <div class="mb-16">
                        <label class="form-label">Status Note</label>
                        <textarea name="status_note" class="form-control" rows="2" placeholder="Add note about this status update..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Update Status</button>
                </form>
            </div>
        </div>

        <!-- Courier Assignment -->
        <div class="card mb-32">
            <div class="card-header">
                <h5 class="mb-0">Courier Assignment</h5>
            </div>
            <div class="card-body">
                <form id="courierForm">
                    @csrf
                    <div class="mb-16">
                        <label class="form-label">Courier Type</label>
                        <select name="courier_type" class="form-select" required>
                            <option value="">Select Courier</option>
                            <option value="pathao" {{ $order->courier_type == 'pathao' ? 'selected' : '' }}>Pathao</option>
                            <option value="steadfast" {{ $order->courier_type == 'steadfast' ? 'selected' : '' }}>Steadfast</option>
                        </select>
                    </div>
                    <div class="mb-16">
                        <label class="form-label">Consignment ID</label>
                        <input type="text" name="courier_consignment_id" class="form-control" value="{{ $order->courier_consignment_id }}" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Assign Courier</button>
                </form>
            </div>
        </div>

        <!-- Conversations -->
        <div class="card mb-32">
            <div class="card-header">
                <h5 class="mb-0">Conversations</h5>
            </div>
            <div class="card-body">
                <div class="conversations-list mb-16" style="max-height: 300px; overflow-y: auto;">
                    @if($order->conversations && count($order->conversations) > 0)
                        @foreach($order->conversations as $conv)
                        <div class="mb-16 p-12 bg-light rounded">
                            <div class="d-flex justify-content-between mb-8">
                                <strong>{{ ucfirst($conv['type']) }}</strong>
                                <small>{{ \Carbon\Carbon::parse($conv['created_at'])->format('d M Y, h:i A') }}</small>
                            </div>
                            <p class="mb-0">{{ $conv['message'] }}</p>
                            <small class="text-muted">- {{ $conv['admin_name'] }}</small>
                        </div>
                        @endforeach
                    @else
                        <p class="text-muted">No conversations yet.</p>
                    @endif
                </div>
                
                <form id="conversationForm">
                    @csrf
                    <div class="mb-16">
                        <select name="type" class="form-select mb-8" required>
                            <option value="note">Note</option>
                            <option value="call">Call</option>
                            <option value="email">Email</option>
                            <option value="whatsapp">WhatsApp</option>
                        </select>
                        <textarea name="message" class="form-control" rows="2" placeholder="Type your message here..." required></textarea>
                    </div>
                    <button type="submit" class="btn btn-secondary w-100">Add Conversation</button>
                </form>
            </div>
        </div>

        <!-- Admin Notes -->
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Admin Notes</h5>
            </div>
            <div class="card-body">
                <form id="notesForm">
                    @csrf
                    <textarea name="admin_notes" class="form-control mb-16" rows="3">{{ $order->admin_notes }}</textarea>
                    <button type="submit" class="btn btn-secondary w-100">Update Notes</button>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

@push('script')
<script>
    // Status Update
    $('#statusUpdateForm').on('submit', function(e) {
        e.preventDefault();
        let formData = $(this).serialize();
        
        $.ajax({
            url: '{{ route("admin.orders.update-status", $order->id) }}',
            type: 'POST',
            data: formData,
            success: function(response) {
                if (response.success) {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: response.message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    setTimeout(() => location.reload(), 1500);
                }
            },
            error: function(xhr) {
                Swal.fire('Error', 'Failed to update status', 'error');
            }
        });
    });
    
    // Courier Assignment
    $('#courierForm').on('submit', function(e) {
        e.preventDefault();
        let formData = $(this).serialize();
        
        $.ajax({
            url: '{{ route("admin.orders.assign-courier", $order->id) }}',
            type: 'POST',
            data: formData,
            success: function(response) {
                if (response.success) {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: response.message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    setTimeout(() => location.reload(), 1500);
                }
            },
            error: function(xhr) {
                Swal.fire('Error', xhr.responseJSON?.message || 'Failed to assign courier', 'error');
            }
        });
    });
    
    // Conversation
    $('#conversationForm').on('submit', function(e) {
        e.preventDefault();
        let formData = $(this).serialize();
        
        $.ajax({
            url: '{{ route("admin.orders.add-conversation", $order->id) }}',
            type: 'POST',
            data: formData,
            success: function(response) {
                if (response.success) {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: response.message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    setTimeout(() => location.reload(), 1500);
                }
            },
            error: function(xhr) {
                Swal.fire('Error', 'Failed to add conversation', 'error');
            }
        });
    });
    
    // Notes Update
    $('#notesForm').on('submit', function(e) {
        e.preventDefault();
        let formData = $(this).serialize();
        
        $.ajax({
            url: '{{ route("admin.orders.update", $order->id) }}',
            type: 'PUT',
            data: formData,
            success: function(response) {
                if (response.success) {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: response.message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            },
            error: function(xhr) {
                Swal.fire('Error', 'Failed to update notes', 'error');
            }
        });
    });
</script>

<script>
// Get pricing when courier type or weight changes
$('#courier_type, #weight').on('change keyup', function() {
    let courierType = $('#courier_type').val();
    let weight = $('#weight').val();
    
    if (courierType && weight) {
        $.ajax({
            url: '{{ route("admin.orders.courier-pricing") }}',
            type: 'POST',
            data: {
                _token: '{{ csrf_token() }}',
                courier_type: courierType,
                total: {{ $order->total }},
                weight: weight,
                city: '{{ $order->city }}'
            },
            success: function(response) {
                if (response.success) {
                    $('#pricingInfo').show();
                    $('#deliveryCharge').text(response.delivery_charge.toFixed(2));
                    $('#codCharge').text(response.cod_charge.toFixed(2));
                    $('#totalCharge').text(response.total_charge.toFixed(2));
                }
            }
        });
    } else {
        $('#pricingInfo').hide();
    }
});

// Assign Courier
$('#courierForm').on('submit', function(e) {
    e.preventDefault();
    let formData = $(this).serialize();
    
    $.ajax({
        url: '{{ route("admin.orders.assign-courier", $order->id) }}',
        type: 'POST',
        data: formData,
        success: function(response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: response.message,
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(() => location.reload(), 1500);
            }
        },
        error: function(xhr) {
            Swal.fire('Error', xhr.responseJSON?.message || 'Failed to assign courier', 'error');
        }
    });
});

// Track Order
$('#trackOrderBtn').click(function() {
    $('#trackingModal').modal('show');
    
    $.ajax({
        url: '{{ route("admin.orders.track", $order->id) }}',
        type: 'GET',
        success: function(response) {
            if (response.success) {
                let html = `
                    <div class="timeline">
                        <div class="mb-16">
                            <strong>Status:</strong> 
                            <span class="badge bg-${getStatusColor(response.data.status)}">
                                ${response.data.status}
                            </span>
                        </div>
                        <div class="mb-16">
                            <strong>Status Message:</strong> ${response.data.status_message}
                        </div>
                `;
                
                if (response.data.history && response.data.history.length > 0) {
                    html += `<h6>Tracking History:</h6><div class="timeline">`;
                    response.data.history.forEach(item => {
                        html += `
                            <div class="timeline-item mb-16">
                                <div class="d-flex">
                                    <div class="timeline-badge me-16">
                                        <i class="ri-checkbox-circle-line text-success"></i>
                                    </div>
                                    <div>
                                        <strong>${item.status || 'Update'}</strong>
                                        <p>${item.description || item.message || ''}</p>
                                        <small>${new Date(item.created_at).toLocaleString()}</small>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                    html += `</div>`;
                }
                
                html += `</div>`;
                $('#trackingContent').html(html);
            }
        },
        error: function() {
            $('#trackingContent').html('<div class="alert alert-danger">Failed to load tracking information</div>');
        }
    });
});

// Cancel Courier
$('#cancelCourierBtn').click(function() {
    Swal.fire({
        title: 'Are you sure?',
        text: "This will cancel the courier consignment!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '{{ route("admin.orders.cancel-courier", $order->id) }}',
                type: 'POST',
                data: {
                    _token: '{{ csrf_token() }}'
                },
                success: function(response) {
                    if (response.success) {
                        Swal.fire('Cancelled!', response.message, 'success');
                        setTimeout(() => location.reload(), 1500);
                    }
                },
                error: function(xhr) {
                    Swal.fire('Error', xhr.responseJSON?.message || 'Failed to cancel courier', 'error');
                }
            });
        }
    });
});

function getStatusColor(status) {
    const colors = {
        'pending': 'warning',
        'processing': 'info',
        'shipped': 'primary',
        'delivered': 'success',
        'cancelled': 'danger',
        'returned': 'secondary'
    };
    return colors[status] || 'secondary';
}
</script>
@endpush