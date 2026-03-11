{{-- resources/views/admin/featured-products/edit.blade.php --}}
@extends('layouts.admin.app')

@section('content')
<div class="row mb-32 gy-32">
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Edit Featured Product</h5>
            </div>
            <div class="card-body">
                <form id="featuredForm" action="{{ route('admin.featured_products.update', $featured->id) }}" method="POST">
                    @csrf
                    @method('PUT')

                    <div class="row gx-8">
                        <div class="col-md-6">
                            <div class="mb-24">
                                <label for="product_id" class="form-label">
                                    <span class="text-danger me-4">*</span>
                                    Select Product
                                </label>
                                <select class="form-control select2" id="product_id" name="product_id" required>
                                    <option value="">Choose a product...</option>
                                    @foreach($products as $product)
                                        <option value="{{ $product->id }}" {{ $featured->product_id == $product->id ? 'selected' : '' }}>
                                            {{ $product->name }} ({{ $product->sku }}) - ${{ $product->regular_price }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-24">
                                <label for="type" class="form-label">
                                    <span class="text-danger me-4">*</span>
                                    Feature Type
                                </label>
                                <select class="form-control" id="type" name="type" required>
                                    <option value="">Select type...</option>
                                    <option value="featured" {{ $featured->type == 'featured' ? 'selected' : '' }}>Featured</option>
                                    <option value="new_arrival" {{ $featured->type == 'new_arrival' ? 'selected' : '' }}>New Arrival</option>
                                    <option value="today_deal" {{ $featured->type == 'today_deal' ? 'selected' : '' }}>Today's Deal</option>
                                    <option value="best_seller" {{ $featured->type == 'best_seller' ? 'selected' : '' }}>Best Seller</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-24">
                                <label for="discount_percentage" class="form-label">Discount Percentage (%)</label>
                                <input type="number" step="0.01" min="0" max="100" class="form-control" id="discount_percentage" name="discount_percentage" value="{{ $featured->discount_percentage }}">
                                <small class="text-muted">Enter percentage (e.g., 20 for 20% off)</small>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-24">
                                <label for="discount_amount" class="form-label">Discount Amount ($)</label>
                                <input type="number" step="0.01" min="0" class="form-control" id="discount_amount" name="discount_amount" value="{{ $featured->discount_amount }}">
                                <small class="text-muted">Enter fixed amount (e.g., 50 for $50 off)</small>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-24">
                                <label for="start_date" class="form-label">Start Date</label>
                                <input type="datetime-local" class="form-control" id="start_date" name="start_date" value="{{ $featured->start_date ? $featured->start_date->format('Y-m-d\TH:i') : '' }}">
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-24">
                                <label for="end_date" class="form-label">End Date</label>
                                <input type="datetime-local" class="form-control" id="end_date" name="end_date" value="{{ $featured->end_date ? $featured->end_date->format('Y-m-d\TH:i') : '' }}">
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-24">
                                <label for="order" class="form-label">Display Order</label>
                                <input type="number" class="form-control" id="order" name="order" value="{{ $featured->order }}">
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-24">
                                <div class="form-check mt-32">
                                    <input class="form-check-input" type="checkbox" id="status" name="status" {{ $featured->status ? 'checked' : '' }}>
                                    <label class="form-check-label" for="status">
                                        Active
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="alert alert-info">
                                <i class="ri-information-line"></i>
                                <strong>Note:</strong> You can set either discount percentage OR discount amount, not both. If both are set, percentage will take precedence.
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer pt-0 px-0 pb-0">
                        <div class="divider"></div>
                        <div class="d-flex gap-16">
                            <button type="submit" class="btn btn-primary">Update Featured Product</button>
                            <a href="{{ route('admin.featured_products.index') }}" class="btn btn-secondary">Cancel</a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

@push('script')
<script>
    $(document).ready(function() {
        // Initialize Select2
        $('.select2').select2({
            theme: 'bootstrap-5',
            width: '100%',
            placeholder: 'Choose a product...'
        });

        // Form validation
        $('#featuredForm').on('submit', function(e) {
            e.preventDefault();

            // Clear previous errors
            $('.is-invalid').removeClass('is-invalid');
            $('.invalid-feedback').remove();

            let formData = new FormData(this);
            let url = $(this).attr('action');
            formData.append('_method', 'PUT');

            $.ajax({
                url: url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    if (response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: response.message,
                            timer: 1500,
                            showConfirmButton: false
                        }).then(() => {
                            window.location.href = '{{ route('admin.featured_products.index') }}';
                        });
                    }
                },
                error: function(xhr) {
                    if (xhr.status === 422) {
                        let errors = xhr.responseJSON.errors;
                        let errorMessage = '<ul>';
                        
                        $.each(errors, function(key, value) {
                            errorMessage += `<li>${value}</li>`;
                            
                            let errorField = $(`#${key}`);
                            if (errorField.length) {
                                errorField.addClass('is-invalid');
                                errorField.after(`<div class="invalid-feedback">${value}</div>`);
                            }
                        });
                        
                        errorMessage += '</ul>';
                        
                        Swal.fire({
                            icon: 'error',
                            title: 'Validation Error!',
                            html: errorMessage
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: xhr.responseJSON.message || 'Something went wrong!'
                        });
                    }
                }
            });
        });

        // Prevent both discount types
        $('#discount_percentage').on('input', function() {
            if ($(this).val()) {
                $('#discount_amount').prop('disabled', true);
            } else {
                $('#discount_amount').prop('disabled', false);
            }
        });

        $('#discount_amount').on('input', function() {
            if ($(this).val()) {
                $('#discount_percentage').prop('disabled', true);
            } else {
                $('#discount_percentage').prop('disabled', false);
            }
        });

        // Initial disable state based on existing values
        if ($('#discount_percentage').val()) {
            $('#discount_amount').prop('disabled', true);
        } else if ($('#discount_amount').val()) {
            $('#discount_percentage').prop('disabled', true);
        }
    });
</script>
@endpush