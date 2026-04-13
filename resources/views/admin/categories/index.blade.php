{{-- resources/views/admin/categories/index.blade.php --}}
@extends('layouts.admin.app')

@section('title', 'Categories')
@section('page-title', 'Category Management')

@section('content')
<div class="row mb-4">
    <div class="col-12">
        <div class="card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="mb-0">Manage Categories</h5>
                        <p class="text-muted mb-0">Organize your products with categories and subcategories</p>
                    </div>
                    @if(auth('admin')->user()->canAny(['access-all','category-create']))
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addCategoryModal">
                        <i class="ri-add-line"></i> Add New Category
                    </button>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table id="categoryTable" class="table table-hover">
                        <thead class="table-light">
                            <tr>
                                <th width="50">ID</th>
                                <th width="80">Image</th>
                                <th>Name</th>
                                <th width="120">Subcategories</th>
                                <th width="100">Order</th>
                                <th width="80">Status</th>
                                <th width="100">Actions</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- Add/Edit Category Modal --}}
<div class="modal fade" id="addCategoryModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Add New Category</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="categoryForm" action="{{ route('admin.categories.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    <input type="hidden" name="_method" value="POST">
                    <input type="hidden" id="category_id" name="category_id">
                    
                    <div class="mb-3">
                        <label for="name" class="form-label">Category Name <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="name" name="name" required>
                    </div>
                    
                    <div class="mb-3">
                        <label for="description" class="form-label">Description</label>
                        <textarea class="form-control" id="description" name="description" rows="3"></textarea>
                    </div>
                    
                    <div class="mb-3">
                        <label for="image" class="form-label">Category Image</label>
                        <input type="file" class="form-control" id="image" name="image" accept="image/*">
                        <div id="image_preview" class="mt-2"></div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="order" class="form-label">Display Order</label>
                        <input type="number" class="form-control" id="order" name="order" value="0" min="0">
                        <small class="text-muted">Lower numbers appear first</small>
                    </div>
                    
                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="status" name="status" checked>
                        <label class="form-check-label" for="status">Active</label>
                    </div>
                    
                    <div class="modal-footer px-0 pb-0">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Category</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

@push('css')
<style>
    .table th, .table td {
        vertical-align: middle;
    }
    .img-thumbnail {
        max-height: 100px;
        width: auto;
    }
</style>
@endpush

@push('script')
<script>
$(document).ready(function() {
    // Initialize DataTable
    var table = $('#categoryTable').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: '{{ route("admin.categories.index") }}',
            type: 'GET'
        },
        columns: [
            { data: 'id', name: 'id' },
            { data: 'image', name: 'image', orderable: false, searchable: false },
            { data: 'name', name: 'name' },
            { data: 'subcategories_count', name: 'subcategories_count', orderable: false, searchable: false },
            { data: 'order', name: 'order' },
            { data: 'status', name: 'status', orderable: false },
            { data: 'action', name: 'action', orderable: false, searchable: false }
        ],
        order: [[0, 'desc']],
        pageLength: 10,
        responsive: true,
        language: {
            search: "_INPUT_",
            searchPlaceholder: "Search categories..."
        }
    });

    // Image preview
    $('#image').change(function() {
        let file = this.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function(e) {
                $('#image_preview').html('<img src="' + e.target.result + '" class="img-thumbnail" style="max-height: 100px;">');
            };
            reader.readAsDataURL(file);
        }
    });

    // Form submission
    $('#categoryForm').on('submit', function(e) {
        e.preventDefault();
        
        $('.is-invalid').removeClass('is-invalid');
        $('.invalid-feedback').remove();
        
        let formData = new FormData(this);
        
        $.ajax({
            url: $(this).attr('action'),
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    $('#addCategoryModal').modal('hide');
                    table.ajax.reload();
                    $('#categoryForm')[0].reset();
                    $('#image_preview').empty();
                    $('input[name="_method"]').val('POST');
                    $('#categoryForm').attr('action', '{{ route("admin.categories.store") }}');
                    $('#addCategoryModal .modal-title').text('Add New Category');
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: response.message,
                        timer: 1500,
                        showConfirmButton: false
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
        let url = '{{ route("admin.categories.toggle-status", ":id") }}'.replace(':id', id);
        
        $.ajax({
            url: url,
            type: 'POST',
            data: { _token: '{{ csrf_token() }}' },
            success: function(response) {
                if (response.success) {
                    table.ajax.reload();
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: response.message,
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            },
            error: function() {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to update status!'
                });
                table.ajax.reload();
            }
        });
    });
});

// Edit function
function editCategory(id) {
    let url = '{{ route("admin.categories.edit", ":id") }}'.replace(':id', id);
    let updateUrl = '{{ route("admin.categories.update", ":id") }}'.replace(':id', id);
    
    $.ajax({
        url: url,
        type: 'GET',
        success: function(data) {
            $('#name').val(data.name);
            $('#description').val(data.description);
            $('#order').val(data.order);
            $('#status').prop('checked', data.status == 1);
            
            if (data.image) {
                $('#image_preview').html('<img src="' + data.image_url + '" class="img-thumbnail" style="max-height: 100px;">');
            } else {
                $('#image_preview').empty();
            }
            
            $('#categoryForm').attr('action', updateUrl);
            $('input[name="_method"]').val('PUT');
            $('#addCategoryModal .modal-title').text('Edit Category');
            $('#addCategoryModal').modal('show');
        },
        error: function() {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to fetch category details.'
            });
        }
    });
}

// Delete function
function deleteCategory(id) {
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
            let url = '{{ route("admin.categories.destroy", ":id") }}'.replace(':id', id);
            
            $.ajax({
                type: "DELETE",
                url: url,
                data: {
                    _token: '{{ csrf_token() }}'
                },
                success: function(data) {
                    $('#categoryTable').DataTable().ajax.reload();
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: data.message,
                        timer: 1500,
                        showConfirmButton: false
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