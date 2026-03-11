{{-- resources/views/admin/featured-products/index.blade.php --}}
@extends('layouts.admin.app')

@section('content')
<div class="row mb-32 gy-32">
    <div class="col-12">
        <div class="col-12 col-md-7">
            <div class="row g-16 align-items-center justify-content-end">
                @canany(['access-all','featured-create'])
                <div class="col hp-flex-none w-auto">
                    <a href="{{ route('admin.featured_products.create') }}" class="btn btn-primary w-100">
                        <i class="ri-add-line remix-icon"></i>
                        <span>Add New Featured Product</span>
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
                    <table id="featuredTable" class="table align-middle table-hover table-borderless">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Product</th>
                                <th>Type</th>
                                <th>Discount</th>
                                <th>Duration</th>
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
        $('#featuredTable').DataTable({
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
                { data: 'image', orderable: false, searchable: false },
                { data: 'product' },
                { data: 'type' },
                { data: 'discount' },
                { data: 'duration' },
                { data: 'status' },
                { data: 'action', orderable: false }
            ]
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
                var url = '{{ route('admin.featured_products.destroy', ':id') }}'.replace(':id', id);
                
                $.ajax({
                    type: "GET",
                    url: url,
                    success: function(data) {
                        $('#featuredTable').DataTable().ajax.reload();
                        Swal.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'success',
                            title: 'Featured product deleted successfully!',
                            showConfirmButton: false,
                            timer: 1500
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