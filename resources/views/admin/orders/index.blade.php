@extends('layouts.admin.app')

@section('content')
<div class="row mb-32 gy-32">
    <div class="col-12">
        <div class="col-12 col-md-7">
            <div class="row g-16 align-items-center justify-content-end">
                @canany(['access-all','order-create'])
                <div class="col hp-flex-none w-auto">
                    <a href="{{ route('admin.orders.create') }}" class="btn btn-primary">
                        <i class="ri-add-line remix-icon"></i>
                        <span>Create New Order</span>
                    </a>
                </div>
                @endcanany
            </div>
        </div>
    </div>

    <div class="col-12">
        <div class="card hp-contact-card mb-32">
            <div class="card-body px-10">
                <div class="table-responsive">
                    <table id="orders-table" class="table align-middle table-hover table-borderless">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Order #</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Courier</th>
                                <th>Orders</th>
                                <th>Conv</th>
                                <th>Date</th>
                                <th></th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Edit Order Modal -->
<div class="modal fade" id="editOrderModal" tabindex="-1" aria-labelledby="editOrderModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header py-16 px-24">
                <h5 class="modal-title" id="editOrderModalLabel">Edit Order</h5>
                <button type="button" class="btn-close hp-bg-none d-flex align-items-center justify-content-center" data-bs-dismiss="modal" aria-label="Close">
                    <i class="ri-close-line hp-text-color-dark-0 lh-1" style="font-size: 24px;"></i>
                </button>
            </div>

            <div class="divider m-0"></div>

            <form id="editOrderForm" action="" method="POST" enctype="multipart/form-data">
                @csrf
                <input type="hidden" name="_method" value="PUT">

                <div class="modal-body">
                    <div class="row gx-8">
                        <div class="col-md-6">
                            <div class="mb-24">
                                <label for="customer_name" class="form-label">
                                    <span class="text-danger me-4">*</span>
                                    Customer Name
                                </label>
                                <input type="text" class="form-control" id="customer_name" name="customer_name">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-24">
                                <label for="customer_phone" class="form-label">
                                    <span class="text-danger me-4">*</span>
                                    Phone Number
                                </label>
                                <input type="text" class="form-control" id="customer_phone" name="customer_phone">
                            </div>
                        </div>
                    </div>

                    <div class="row gx-8">
                        <div class="col-md-6">
                            <div class="mb-24">
                                <label for="customer_email" class="form-label">Email Address</label>
                                <input type="email" class="form-control" id="customer_email" name="customer_email">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-24">
                                <label for="shipping_address" class="form-label">
                                    <span class="text-danger me-4">*</span>
                                    Shipping Address
                                </label>
                                <textarea class="form-control" id="shipping_address" name="shipping_address" rows="2"></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="row gx-8">
                        <div class="col-md-6">
                            <div class="mb-24">
                                <label for="order_status" class="form-label">
                                    <span class="text-danger me-4">*</span>
                                    Order Status
                                </label>
                                <select class="form-select" id="order_status" name="order_status">
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="returned">Returned</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-24">
                                <label for="payment_status" class="form-label">
                                    <span class="text-danger me-4">*</span>
                                    Payment Status
                                </label>
                                <select class="form-select" id="payment_status" name="payment_status">
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="failed">Failed</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="mb-24">
                        <label for="admin_notes" class="form-label">Admin Notes</label>
                        <textarea class="form-control" id="admin_notes" name="admin_notes" rows="3"></textarea>
                    </div>
                </div>

                <div class="modal-footer pt-0 px-24 pb-24">
                    <div class="divider"></div>
                    <button type="submit" class="m-0 btn btn-primary w-100">Update Order</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection

@push('script')
<script>
    let editOrderId = null;

    $('#orders-table').DataTable({
        processing: true,
        serverSide: true,
        dom: 'Bfrtip',
        buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
        paging: true,
        searching: true,
        ordering: true,
        responsive: true,
        ajax: '{{ url()->current() }}',
        columns: [
            { data: 'id', orderable: false },
            { data: 'order_number' },
            { data: 'customer' },
            { data: 'total' },
            { data: 'order_status' },
            { data: 'payment_status' },
            { data: 'courier' },
            { data: 'order_count' },
            { data: 'conversations_count' },
            { data: 'order_date' },
            { data: 'action', orderable: false }
        ]
    });

    // Edit function
    function edit(id) {
        editOrderId = id;
        let url = '{{ route("admin.orders.edit", ":id") }}';
        url = url.replace(':id', id);
        
        $.ajax({
            url: url,
            type: 'GET',
            success: function(data) {
                // Populate form fields
                $('#customer_name').val(data.order.customer_name);
                $('#customer_phone').val(data.order.customer_phone);
                $('#customer_email').val(data.order.customer_email);
                $('#shipping_address').val(data.order.shipping_address);
                $('#order_status').val(data.order.order_status);
                $('#payment_status').val(data.order.payment_status);
                $('#admin_notes').val(data.order.admin_notes);
                
                // Set form action URL
                let updateUrl = '{{ route("admin.orders.update", ":id") }}';
                updateUrl = updateUrl.replace(':id', id);
                $('#editOrderForm').attr('action', updateUrl);
                
                // Show modal
                $('#editOrderModal').modal('show');
            },
            error: function(xhr) {
                Swal.fire('Error', 'Failed to fetch order details.', 'error');
            }
        });
    }

    // Handle edit form submission
    $('#editOrderForm').on('submit', function(e) {
        e.preventDefault();
        
        let formData = new FormData(this);
        let url = $(this).attr('action');
        
        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    $('#editOrderModal').modal('hide');
                    $('#orders-table').DataTable().ajax.reload();
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

    // Delete function
    function destroy(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                let url = '{{ route('admin.orders.destroy', ':id') }}';
                url = url.replace(':id', id);
                $.ajax({
                    type: "DELETE",
                    url: url,
                    data: {
                        _token: '{{ csrf_token() }}'
                    },
                    success: function(data) {
                        $('#orders-table').DataTable().ajax.reload();
                        Swal.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'success',
                            title: 'Order deleted successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    },
                    error: function(xhr) {
                        Swal.fire('Error', 'Failed to delete order.', 'error');
                    }
                });
            }
        });
    }
</script>
@endpush