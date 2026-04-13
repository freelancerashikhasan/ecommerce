{{-- resources/views/admin/promotions/index.blade.php --}}
@extends('layouts.admin.app')

@section('content')
<div class="row mb-32 gy-32">
    <div class="col-12">
        <div class="col-12 col-md-7">
            <div class="row g-16 align-items-center justify-content-end">
                @canany(['access-all','promotion-create'])
                <div class="col hp-flex-none w-auto">
                    <a href="{{ route('admin.promotions.create') }}" class="btn btn-primary">
                        <i class="ri-add-line remix-icon"></i>
                        <span>Add New Promotion</span>
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
                    <table id="promotion-table" class="table align-middle table-hover table-borderless">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Position</th>
                                <th>Status</th>
                                <th>Active Dates</th>
                                <th>Action</th>
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
    let table = $('#promotion-table').DataTable({
        processing: true,
        serverSide: true,
        dom: 'Bfrtip',
        buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
        paging: true,
        searching: true,
        ordering: true,
        responsive: true,
        ajax: '{{ route("admin.promotions.index") }}',
        columns: [
            { data: 'id' },
            { data: 'image' },
            { data: 'title' },
            { data: 'type' },
            { data: 'position' },
            { data: 'status' },
            { data: 'dates' },
            { data: 'action', orderable: false }
        ]
    });

    function edit(id) {
        window.location.href = '{{ route("admin.promotions.edit", ":id") }}'.replace(':id', id);
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
                let url = '{{ route("admin.promotions.destroy", ":id") }}';
                url = url.replace(':id', id);
                $.ajax({
                    type: "DELETE",
                    url: url,
                    data: {
                        _token: '{{ csrf_token() }}'
                    },
                    success: function(data) {
                        table.ajax.reload();
                        Swal.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'success',
                            title: data.message,
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                });
            }
        });
    }
</script>
@endpush