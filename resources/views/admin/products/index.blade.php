{{-- resources/views/admin/products/index.blade.php --}}
@extends('layouts.admin.app')

@section('title', 'Products')
@section('page-title', 'Products Management')


@section('content')
<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="card-body">
              <a href="{{ route('admin.products.create') }}" class="btn btn-primary">
                    <i class="ri-add-line"></i> Add New Product
                </a>
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table id="product-table" class="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Type</th>
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
@endsection

@push('script')
<script>
    $(document).ready(function() {
        var table = $('#product-table').DataTable({
            processing: true,
            serverSide: true,
            dom: 'Bfrtip',
            buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
            ajax: '{{ url()->current() }}',
            columns: [
                { data: 'id' },
                { data: 'image', orderable: false, searchable: false },
                { data: 'name' },
                { data: 'price', orderable: false },
                { data: 'stock', orderable: false },
                { data: 'product_type' },
                { data: 'status', orderable: false },
                { data: 'action', orderable: false }
            ]
        });

        // Toggle status
        $(document).on('change', '.toggle-status', function() {
            let id = $(this).data('id');
            let url = '{{ route('admin.products.toggle-status', ':id') }}'.replace(':id', id);
            
            $.ajax({
                url: url,
                type: 'POST',
                data: {
                    _token: '{{ csrf_token() }}'
                },
                success: function(response) {
                    if (response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: response.message,
                            timer: 1500,
                            showConfirmButton: false
                        });
                        table.ajax.reload(null, false);
                    }
                },
                error: function(xhr) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Something went wrong!'
                    });
                }
            });
        });
    });

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
                var url = '{{ route('admin.products.destroy', ':id') }}'.replace(':id', id);
                
                $.ajax({
                    type: "GET",
                    url: url,
                    success: function(data) {
                        $('#product-table').DataTable().ajax.reload();
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Product deleted successfully!',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    },
                    error: function(xhr) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'Something went wrong!'
                        });
                    }
                });
            }
        });
    }
</script>
@endpush