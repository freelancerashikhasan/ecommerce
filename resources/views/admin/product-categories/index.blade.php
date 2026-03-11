{{-- resources/views/admin/product-categories/index.blade.php --}}
@extends('layouts.admin.app')

@section('content')
<div class="row mb-32 gy-32">
    <div class="col-12">
        <div class="col-12 col-md-7">
            <div class="row g-16 align-items-center justify-content-end">
                @canany(['access-all','category-create'])
                <div class="col hp-flex-none w-auto">
                    <button type="button" class="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#addCategoryModal">
                        <i class="ri-add-line remix-icon"></i>
                        <span>Add New Category</span>
                    </button>
                </div>
                @endcanany
            </div>
        </div>
    </div>

    <div class="col-12">
        <div class="card hp-contact-card mb-32">
            <div class="card-body px-10">
                <div class="table-responsive">
                    <table id="categoryTable" class="table align-middle table-hover table-borderless">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Products</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- Add/Edit Category Modal --}}
<div class="modal fade" id="addCategoryModal" tabindex="-1" aria-labelledby="addCategoryModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header py-16 px-24">
                <h5 class="modal-title" id="addCategoryModalLabel">Add New Category</h5>
                <button type="button" class="btn-close hp-bg-none d-flex align-items-center justify-content-center" data-bs-dismiss="modal" aria-label="Close">
                    <i class="ri-close-line hp-text-color-dark-0 lh-1" style="font-size: 24px;"></i>
                </button>
            </div>

            <div class="divider m-0"></div>

            <form id="categoryForm" action="{{ route('admin.product_categories.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <input type="hidden" name="_method" value="POST">
                <input type="hidden" id="category_id" name="category_id">

                <div class="modal-body">
                    <div class="row gx-8">
                        <div class="col-12">
                            <div class="mb-24">
                                <label for="name" class="form-label">
                                    <span class="text-danger me-4">*</span>
                                    Category Name
                                </label>
                                <input type="text" class="form-control" id="name" name="name" placeholder="e.g., Electronics, Clothing, Books">
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="mb-24">
                                <label for="description" class="form-label">Description</label>
                                <textarea class="form-control" id="description" name="description" rows="3" placeholder="Enter category description..."></textarea>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="mb-24">
                                <label for="image" class="form-label">Category Image</label>
                                <input type="file" class="form-control" id="image" name="image" accept="image/*">
                                <div id="image_preview" class="mt-2"></div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-24">
                                <label for="order" class="form-label">Display Order</label>
                                <input type="number" class="form-control" id="order" name="order" value="0" min="0">
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-24">
                                <div class="form-check mt-32">
                                    <input class="form-check-input" type="checkbox" id="status" name="status" checked>
                                    <label class="form-check-label" for="status">
                                        Active
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer pt-0 px-24 pb-24">
                    <div class="divider"></div>
                    <button type="submit" class="m-0 btn btn-primary w-100">Save Category</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection

@push('script')
<script>
    $(document).ready(function() {
        var table = $('#categoryTable').DataTable({
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
                { data: 'id' },
                { 
                    data: 'image',
                    orderable: false,
                    searchable: false
                },
                { data: 'name' },
                { 
                    data: 'products_count',
                    orderable: false,
                    searchable: false
                },
                { 
                    data: 'status',
                    orderable: false
                },
                { 
                    data: 'action',
                    orderable: false
                }
            ]
        });

        // Preview image
        $('#image').change(function() {
            let file = this.files[0];
            let reader = new FileReader();
            
            reader.onload = function(e) {
                $('#image_preview').html('<img src="' + e.target.result + '" class="img-thumbnail" style="max-height: 100px;">');
            };
            
            reader.readAsDataURL(file);
        });

        // Handle form submission
        $('#categoryForm').on('submit', function(e) {
            e.preventDefault();

            // Clear previous errors
            $('.is-invalid').removeClass('is-invalid');
            $('.invalid-feedback').remove();

            let formData = new FormData(this);
            let url = $(this).attr('action');
            let method = $('input[name="_method"]').val();

            $.ajax({
                url: url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    if (response.success) {
                        $('#addCategoryModal').modal('hide');
                        $('#categoryTable').DataTable().ajax.reload();
                        $('#categoryForm')[0].reset();
                        $('#image_preview').empty();
                        $('input[name="_method"]').val('POST');
                        $('#categoryForm').attr('action', '{{ route('admin.product_categories.store') }}');
                        $('#addCategoryModalLabel').text('Add New Category');
                        
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
                    if (xhr.status === 422) {
                        let errors = xhr.responseJSON.errors;
                        let errorMessage = '<ul class="mb-0">';
                        
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

        // Toggle status
        $(document).on('change', '.toggle-status', function() {
            let id = $(this).data('id');
            let url = '{{ route('admin.product_categories.toggle-status', ':id') }}'.replace(':id', id);
            
            $.ajax({
                url: url,
                type: 'POST',
                data: {
                    _token: '{{ csrf_token() }}'
                },
                success: function(response) {
                    if (response.success) {
                        $('#categoryTable').DataTable().ajax.reload();
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
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Something went wrong!'
                    });
                    $('#categoryTable').DataTable().ajax.reload();
                }
            });
        });
    });

    function edit(id) {
        let categoryId = id;
        var url = '{{ route('admin.product_categories.edit', ['id' => ':id']) }}';
        var updateRoute = '{{ route('admin.product_categories.update', ['id' => ':id']) }}';
        url = url.replace(':id', categoryId);
        
        $.ajax({
            url: url,
            type: 'GET',
            success: function(data) {
                $('#name').val(data.name);
                $('#description').val(data.description);
                $('#order').val(data.order);
                $('#status').prop('checked', data.status == 1);
                
                // Show existing image preview if available
                if (data.image) {
                    $('#image_preview').html('<img src="{{ asset('storage') }}/' + data.image + '" class="img-thumbnail" style="max-height: 100px;">');
                } else {
                    $('#image_preview').empty();
                }
                
                const actionUrl = updateRoute.replace(':id', data.id);
                $('#categoryForm').attr('action', actionUrl);
                $('input[name="_method"]').val('PUT');
                $('#addCategoryModalLabel').text('Edit Category');
                $('#addCategoryModal').modal('show');
            },
            error: function(xhr) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to fetch category details.'
                });
            }
        });
    }

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
                var url = '{{ route('admin.product_categories.destroy', ':id') }}'.replace(':id', id);
                
                $.ajax({
                    type: "GET",
                    url: url,
                    success: function(data) {
                        $('#categoryTable').DataTable().ajax.reload();
                        Swal.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'success',
                            title: 'Category deleted successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    },
                    error: function(xhr) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: xhr.responseJSON.message || 'Something went wrong!'
                        });
                    }
                });
            }
        });
    }
</script>
@endpush