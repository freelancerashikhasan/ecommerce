{{-- resources/views/admin/attributes/index.blade.php --}}
@extends('layouts.admin.app')

@section('content')
<div class="row mb-32 gy-32">
    <div class="col-12">
        <div class="col-12 col-md-7">
            <div class="row g-16 align-items-center justify-content-end">
                @canany(['access-all','attribute-create'])
                <div class="col hp-flex-none w-auto">
                    <button type="button" class="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#addAttributeModal">
                        <i class="ri-add-line remix-icon"></i>
                        <span>Add New Attribute</span>
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
                    <table id="attributeTable" class="table align-middle table-hover table-borderless">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Values</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- Add/Edit Attribute Modal --}}
<div class="modal fade" id="addAttributeModal" tabindex="-1" aria-labelledby="addAttributeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header py-16 px-24">
                <h5 class="modal-title" id="addAttributeModalLabel">Add New Attribute</h5>
                <button type="button" class="btn-close hp-bg-none d-flex align-items-center justify-content-center" data-bs-dismiss="modal" aria-label="Close">
                    <i class="ri-close-line hp-text-color-dark-0 lh-1" style="font-size: 24px;"></i>
                </button>
            </div>

            <div class="divider m-0"></div>

            <form id="attributeForm" action="{{ route('admin.attributes.store') }}" method="POST">
                @csrf
                <input type="hidden" name="_method" value="POST">
                <input type="hidden" id="attribute_id" name="attribute_id">

                <div class="modal-body">
                    <div class="row gx-8">
                        <div class="col-12">
                            <div class="mb-24">
                                <label for="name" class="form-label">
                                    <span class="text-danger me-4">*</span>
                                    Attribute Name
                                </label>
                                <input type="text" class="form-control" id="name" name="name" placeholder="e.g., Size, Color, Material">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer pt-0 px-24 pb-24">
                    <div class="divider"></div>
                    <button type="submit" class="m-0 btn btn-primary w-100">Save Attribute</button>
                </div>
            </form>
        </div>
    </div>
</div>

{{-- Attribute Values Modal --}}
<div class="modal fade" id="valuesModal" tabindex="-1" aria-labelledby="valuesModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header py-16 px-24">
                <h5 class="modal-title" id="valuesModalLabel">Manage Attribute Values</h5>
                <button type="button" class="btn-close hp-bg-none d-flex align-items-center justify-content-center" data-bs-dismiss="modal" aria-label="Close">
                    <i class="ri-close-line hp-text-color-dark-0 lh-1" style="font-size: 24px;"></i>
                </button>
            </div>

            <div class="divider m-0"></div>

            <div class="modal-body">
                <div class="row gx-8">
                    <div class="col-12">
                        <h6 class="mb-16">Add New Value</h6>
                        <form id="valueForm" action="" method="POST">
                            @csrf
                            <input type="hidden" id="attribute_id_value" name="attribute_id">
                            
                            <div class="row gx-8">
                                <div class="col-md-5">
                                    <div class="mb-16">
                                        <label for="value" class="form-label">Value <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="value" name="value" placeholder="e.g., Red, XL, Cotton">
                                    </div>
                                </div>
                                <div class="col-md-5">
                                    <div class="mb-16">
                                        <label for="color_code" class="form-label">Color Code (for color attributes)</label>
                                        <input type="color" class="form-control form-control-color" id="color_code" name="color_code" style="height: 38px;">
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <div class="mb-16">
                                        <label class="form-label">&nbsp;</label>
                                        <button type="submit" class="btn btn-primary w-100">Add</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    
                    <div class="col-12">
                        <div class="divider my-16"></div>
                        <h6 class="mb-16">Existing Values</h6>
                        <div id="values-list" class="row gx-8">
                            {{-- Values will be loaded here via AJAX --}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- Edit Value Modal --}}
<div class="modal fade" id="editValueModal" tabindex="-1" aria-labelledby="editValueModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header py-16 px-24">
                <h5 class="modal-title" id="editValueModalLabel">Edit Attribute Value</h5>
                <button type="button" class="btn-close hp-bg-none d-flex align-items-center justify-content-center" data-bs-dismiss="modal" aria-label="Close">
                    <i class="ri-close-line hp-text-color-dark-0 lh-1" style="font-size: 24px;"></i>
                </button>
            </div>

            <div class="divider m-0"></div>

            <form id="editValueForm" action="" method="POST">
                @csrf
                @method('PUT')
                <input type="hidden" id="edit_value_id" name="value_id">

                <div class="modal-body">
                    <div class="row gx-8">
                        <div class="col-12 mb-16">
                            <label for="edit_value" class="form-label">Value <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="edit_value" name="value">
                        </div>
                        <div class="col-12">
                            <label for="edit_color_code" class="form-label">Color Code</label>
                            <input type="color" class="form-control form-control-color" id="edit_color_code" name="color_code" style="height: 38px;">
                        </div>
                    </div>
                </div>

                <div class="modal-footer pt-0 px-24 pb-24">
                    <div class="divider"></div>
                    <button type="submit" class="m-0 btn btn-primary w-100">Update Value</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection

@push('script')
<script>
    $(document).ready(function() {
        var table = $('#attributeTable').DataTable({
            processing: true,
            serverSide: false, // Since we're not using server-side for this simple data
            dom: 'Bfrtip',
            buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
            paging: true,
            searching: true,
            ordering: true,
            responsive: true,
            ajax: {
                url: '{{ route('admin.attributes.index') }}',
                dataSrc: function(json) {
                    return json;
                }
            },
            columns: [
                { data: 'id' },
                { data: 'name' },
                { 
                    data: 'values',
                    render: function(data) {
                        if (!data || data.length === 0) {
                            return '<span class="badge bg-secondary">No values</span>';
                        }
                        let html = '<div class="d-flex flex-wrap gap-8">';
                        $.each(data, function(index, value) {
                            if (value.color_code) {
                                html += `<span class="badge" style="background-color: ${value.color_code}; color: white;">${value.value}</span>`;
                            } else {
                                html += `<span class="badge bg-info">${value.value}</span>`;
                            }
                        });
                        html += '</div>';
                        return html;
                    }
                },
                {
                    data: null,
                    render: function(data) {
                        return `
                            <div class="d-flex gap-8">
                                <a href="javascript:;" onclick="editAttribute(${data.id}, '${data.name}')" class="btn btn-sm btn-soft-primary">
                                    <i class="ri-edit-line"></i>
                                </a>
                                <a href="javascript:;" onclick="manageValues(${data.id}, '${data.name}')" class="btn btn-sm btn-soft-success">
                                    <i class="ri-list-settings-line"></i>
                                </a>
                                <a href="javascript:void(0);" onclick="destroy(${data.id})" class="btn btn-sm btn-soft-danger">
                                    <i class="ri-delete-bin-line"></i>
                                </a>
                            </div>
                        `;
                    }
                }
            ]
        });

        // Handle attribute form submission
        $('#attributeForm').on('submit', function(e) {
            e.preventDefault();

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
                        $('#addAttributeModal').modal('hide');
                        $('#attributeTable').DataTable().ajax.reload();
                        $('#attributeForm')[0].reset();
                        $('input[name="_method"]').val('POST');
                        $('#attributeForm').attr('action', '{{ route('admin.attributes.store') }}');
                        
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
                        let errorField = $(`#${key}`);
                        if (errorField.length) {
                            errorField.addClass('is-invalid');
                            errorField.siblings('.invalid-feedback').remove();
                            errorField.after(`<div class="invalid-feedback">${value}</div>`);
                        }
                    });
                    
                    errorMessage += '</ul>';
                    
                    Swal.fire({
                        icon: 'error',
                        title: 'Validation Error!',
                        html: errorMessage
                    });
                }
            });
        });

        // Handle value form submission
        $('#valueForm').on('submit', function(e) {
            e.preventDefault();

            let formData = new FormData(this);
            let attributeId = $('#attribute_id_value').val();
            let url = '{{ route('admin.attributes.values.store', ':id') }}'.replace(':id', attributeId);

            $.ajax({
                url: url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    if (response.success) {
                        $('#valueForm')[0].reset();
                        loadValues(attributeId);
                        
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
                    
                    Swal.fire({
                        icon: 'error',
                        title: 'Validation Error!',
                        html: errorMessage
                    });
                }
            });
        });

        // Handle edit value form submission
        $('#editValueForm').on('submit', function(e) {
            e.preventDefault();

            let formData = new FormData(this);
            let valueId = $('#edit_value_id').val();
            let url = '{{ route('admin.attributes.values.update', ':id') }}'.replace(':id', valueId);

            $.ajax({
                url: url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    if (response.success) {
                        $('#editValueModal').modal('hide');
                        let attributeId = $('#attribute_id_value').val();
                        loadValues(attributeId);
                        
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
                    
                    Swal.fire({
                        icon: 'error',
                        title: 'Validation Error!',
                        html: errorMessage
                    });
                }
            });
        });
    });

    function editAttribute(id, name) {
        $('#attribute_id').val(id);
        $('#name').val(name);
        $('#attributeForm').attr('action', '{{ route('admin.attributes.update', ':id') }}'.replace(':id', id));
        $('input[name="_method"]').val('PUT');
        $('#addAttributeModalLabel').text('Edit Attribute');
        $('#addAttributeModal').modal('show');
    }

    function manageValues(attributeId, attributeName) {
        $('#attribute_id_value').val(attributeId);
        $('#valuesModalLabel').text(`Manage Values - ${attributeName}`);
        $('#valuesModal').modal('show');
        loadValues(attributeId);
    }

    function loadValues(attributeId) {
        $.ajax({
            url: '{{ route('admin.attributes.index') }}',
            type: 'GET',
            success: function(attributes) {
                let attribute = attributes.find(a => a.id == attributeId);
                let valuesHtml = '';
                
                if (attribute.values && attribute.values.length > 0) {
                    $.each(attribute.values, function(index, value) {
                        let colorPreview = '';
                        if (value.color_code) {
                            colorPreview = `<div style="width: 20px; height: 20px; background-color: ${value.color_code}; border-radius: 4px; margin-right: 8px;"></div>`;
                        }
                        
                        valuesHtml += `
                            <div class="col-md-4 mb-16">
                                <div class="card">
                                    <div class="card-body d-flex align-items-center justify-content-between">
                                        <div class="d-flex align-items-center">
                                            ${colorPreview}
                                            <span>${value.value}</span>
                                        </div>
                                        <div>
                                            <a href="javascript:;" onclick="editValue(${value.id}, '${value.value}', '${value.color_code || ''}')" class="text-primary me-8">
                                                <i class="ri-edit-line"></i>
                                            </a>
                                            <a href="javascript:;" onclick="destroyValue(${value.id})" class="text-danger">
                                                <i class="ri-delete-bin-line"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                } else {
                    valuesHtml = '<div class="col-12"><p class="text-muted">No values added yet.</p></div>';
                }
                
                $('#values-list').html(valuesHtml);
            }
        });
    }

    function editValue(id, value, colorCode) {
        $('#edit_value_id').val(id);
        $('#edit_value').val(value);
        $('#edit_color_code').val(colorCode);
        
        let url = '{{ route('admin.attributes.values.update', ':id') }}'.replace(':id', id);
        $('#editValueForm').attr('action', url);
        
        $('#editValueModal').modal('show');
    }

    function destroyValue(id) {
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
                var url = '{{ route('admin.attributes.values.destroy', ':id') }}'.replace(':id', id);
                
                $.ajax({
                    type: "GET",
                    url: url,
                    success: function(data) {
                        let attributeId = $('#attribute_id_value').val();
                        loadValues(attributeId);
                        $('#attributeTable').DataTable().ajax.reload();
                        
                        Swal.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'success',
                            title: 'Value deleted successfully!',
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
                var url = '{{ route('admin.attributes.destroy', ':id') }}'.replace(':id', id);
                
                $.ajax({
                    type: "GET",
                    url: url,
                    success: function(data) {
                        $('#attributeTable').DataTable().ajax.reload();
                        
                        Swal.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'success',
                            title: 'Attribute deleted successfully!',
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