{{-- resources/views/admin/products/edit.blade.php --}}
@extends('layouts.admin.app')

@section('title', 'Edit Product')
@section('page-title', 'Edit Product: ' . $product->name)

@section('content')
<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="card-body">
                <form id="productForm" action="{{ route('admin.products.update', $product->id) }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')
                    
                    {{-- Basic Information --}}
                    <div class="row mb-4">
                        <div class="col-12">
                            <h5 class="mb-3">Basic Information</h5>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <label for="name" class="form-label">Product Name <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="name" name="name" value="{{ $product->name }}" required>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <label for="sku" class="form-label">SKU <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="sku" name="sku" value="{{ $product->sku }}" required>
                        </div>
                        
                        <div class="col-md-12 mb-3">
                            <label for="short_description" class="form-label">Short Description</label>
                            <textarea class="form-control" id="short_description" name="short_description" rows="3">{{ $product->short_description }}</textarea>
                        </div>
                        
                        <div class="col-md-12 mb-3">
                            <label for="description" class="form-label">Full Description</label>
                            <textarea class="form-control" id="description" name="description" rows="5">{{ $product->description }}</textarea>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <label for="categories" class="form-label">Categories</label>
                            <select class="form-select select2" id="categories" name="categories[]" multiple>
                                @foreach($categories as $category)
                                    <option value="{{ $category->id }}" {{ in_array($category->id, $product->categories->pluck('id')->toArray()) ? 'selected' : '' }}>
                                        {{ $category->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <label for="product_type" class="form-label">Product Type <span class="text-danger">*</span></label>
                            <select class="form-select" id="product_type" name="product_type" required>
                                <option value="simple" {{ $product->product_type == 'simple' ? 'selected' : '' }}>Simple Product</option>
                                <option value="variable" {{ $product->product_type == 'variable' ? 'selected' : '' }}>Variable Product</option>
                            </select>
                        </div>
                    </div>
                    
                    {{-- Pricing & Stock --}}
                    <div class="row mb-4">
                        <div class="col-12">
                            <h5 class="mb-3">Pricing & Stock</h5>
                        </div>
                        
                        <div class="col-md-4 mb-3">
                            <label for="regular_price" class="form-label">Regular Price <span class="text-danger">*</span></label>
                            <input type="number" step="0.01" class="form-control" id="regular_price" name="regular_price" value="{{ $product->regular_price }}" required>
                        </div>
                        
                        <div class="col-md-4 mb-3">
                            <label for="sale_price" class="form-label">Sale Price</label>
                            <input type="number" step="0.01" class="form-control" id="sale_price" name="sale_price" value="{{ $product->sale_price }}">
                        </div>
                        
                        <div class="col-md-4 mb-3">
                            <label for="purchase_price" class="form-label">Purchase Price</label>
                            <input type="number" step="0.01" class="form-control" id="purchase_price" name="purchase_price" value="{{ $product->purchase_price }}">
                        </div>
                        
                        <div class="col-md-4 mb-3">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="manage_stock" name="manage_stock" {{ $product->manage_stock ? 'checked' : '' }}>
                                <label class="form-check-label" for="manage_stock">
                                    Manage Stock
                                </label>
                            </div>
                        </div>
                        
                        <div class="col-md-4 mb-3 stock-field" style="{{ $product->manage_stock ? '' : 'display: none;' }}">
                            <label for="stock_quantity" class="form-label">Stock Quantity</label>
                            <input type="number" class="form-control" id="stock_quantity" name="stock_quantity" value="{{ $product->stock_quantity }}">
                        </div>
                        
                        <div class="col-md-4 mb-3">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="in_stock" name="in_stock" {{ $product->in_stock ? 'checked' : '' }}>
                                <label class="form-check-label" for="in_stock">
                                    In Stock
                                </label>
                            </div>
                        </div>
                        
                        <div class="col-md-4 mb-3">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="status" name="status" {{ $product->status ? 'checked' : '' }}>
                                <label class="form-check-label" for="status">
                                    Active
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    {{-- Media --}}
                    <div class="row mb-4">
                        <div class="col-12">
                            <h5 class="mb-3">Media</h5>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <label for="featured_image" class="form-label">Featured Image</label>
                            <input type="file" class="form-control" id="featured_image" name="featured_image" accept="image/*">
                            <div id="featured_preview" class="mt-2">
                                @if($product->featured_image)
                                    <img src="{{ asset('storage/' . $product->featured_image) }}" class="img-thumbnail" style="max-height: 150px;">
                                @endif
                            </div>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <label for="video_link" class="form-label">Video Link (YouTube/Vimeo)</label>
                            <input type="url" class="form-control" id="video_link" name="video_link" value="{{ $product->video_link }}" placeholder="https://www.youtube.com/watch?v=...">
                        </div>
                        
                        <div class="col-md-12 mb-3">
                            <label for="images" class="form-label">Gallery Images</label>
                            <input type="file" class="form-control" id="images" name="images[]" multiple accept="image/*">
                            <input type="hidden" id="deleted_images" name="deleted_images">
                            
                            {{-- Existing Gallery Images --}}
                            @if($product->images->count() > 0)
                                <div class="row mt-3">
                                    <div class="col-12">
                                        <label class="form-label">Current Gallery Images</label>
                                    </div>
                                    @foreach($product->images as $image)
                                        <div class="col-md-3 mb-2 existing-image" data-id="{{ $image->id }}">
                                            <div class="position-relative">
                                                <img src="{{ asset('storage/' . $image->image_path) }}" class="img-thumbnail" style="max-height: 100px; width: 100%; object-fit: cover;">
                                                <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 remove-existing-image" data-id="{{ $image->id }}">
                                                    <i class="ri-delete-bin-line"></i>
                                                </button>
                                            </div>
                                        </div>
                                    @endforeach
                                </div>
                            @endif
                            
                            <div id="gallery_preview" class="row mt-2"></div>
                        </div>
                    </div>
                    
                    {{-- Dynamic Specifications --}}
                    <div class="row mb-4">
                        <div class="col-12">
                            <h5 class="mb-3">Specifications</h5>
                        </div>
                        
                        <div class="col-12">
                            <div id="specifications-container">
                                @if($product->specifications && count($product->specifications) > 0)
                                    @foreach($product->specifications as $key => $value)
                                        <div class="row mb-2 specification-row">
                                            <div class="col-md-5">
                                                <input type="text" class="form-control" name="spec_keys[]" value="{{ $key }}" placeholder="Specification Name (e.g., Brand)">
                                            </div>
                                            <div class="col-md-5">
                                                <input type="text" class="form-control" name="spec_values[]" value="{{ $value }}" placeholder="Value (e.g., Nike)">
                                            </div>
                                            <div class="col-md-2">
                                                <button type="button" class="btn btn-danger remove-spec"><i class="ri-delete-bin-line"></i></button>
                                            </div>
                                        </div>
                                    @endforeach
                                @else
                                    <div class="row mb-2 specification-row">
                                        <div class="col-md-5">
                                            <input type="text" class="form-control" name="spec_keys[]" placeholder="Specification Name (e.g., Brand)">
                                        </div>
                                        <div class="col-md-5">
                                            <input type="text" class="form-control" name="spec_values[]" placeholder="Value (e.g., Nike)">
                                        </div>
                                        <div class="col-md-2">
                                            <button type="button" class="btn btn-danger remove-spec"><i class="ri-delete-bin-line"></i></button>
                                        </div>
                                    </div>
                                @endif
                            </div>
                            <button type="button" class="btn btn-primary btn-sm mt-2" id="add-spec">
                                <i class="ri-add-line"></i> Add Specification
                            </button>
                        </div>
                    </div>
                    
                    {{-- Additional Information --}}
                    <div class="row mb-4">
                        <div class="col-12">
                            <h5 class="mb-3">Additional Information</h5>
                        </div>
                        
                        <div class="col-12">
                            <div id="info-container">
                                @if($product->additional_info && count($product->additional_info) > 0)
                                    @foreach($product->additional_info as $key => $value)
                                        <div class="row mb-2 info-row">
                                            <div class="col-md-5">
                                                <input type="text" class="form-control" name="info_keys[]" value="{{ $key }}" placeholder="Field Name (e.g., Warranty)">
                                            </div>
                                            <div class="col-md-5">
                                                <input type="text" class="form-control" name="info_values[]" value="{{ $value }}" placeholder="Value (e.g., 2 Years)">
                                            </div>
                                            <div class="col-md-2">
                                                <button type="button" class="btn btn-danger remove-info"><i class="ri-delete-bin-line"></i></button>
                                            </div>
                                        </div>
                                    @endforeach
                                @else
                                    <div class="row mb-2 info-row">
                                        <div class="col-md-5">
                                            <input type="text" class="form-control" name="info_keys[]" placeholder="Field Name (e.g., Warranty)">
                                        </div>
                                        <div class="col-md-5">
                                            <input type="text" class="form-control" name="info_values[]" placeholder="Value (e.g., 2 Years)">
                                        </div>
                                        <div class="col-md-2">
                                            <button type="button" class="btn btn-danger remove-info"><i class="ri-delete-bin-line"></i></button>
                                        </div>
                                    </div>
                                @endif
                            </div>
                            <button type="button" class="btn btn-primary btn-sm mt-2" id="add-info">
                                <i class="ri-add-line"></i> Add Information
                            </button>
                        </div>
                    </div>
                    
                    {{-- Variations (for variable products) --}}
                    <div class="row mb-4" id="variations-section" style="{{ $product->product_type == 'variable' ? '' : 'display: none;' }}">
                        <div class="col-12">
                            <h5 class="mb-3">Product Variations</h5>
                            
                            <div class="mb-3">
                                <label class="form-label">Select Attributes</label>
                                <select class="form-select select2" id="attribute-select" multiple>
                                    @foreach($attributes as $attribute)
                                        <option value="{{ $attribute->id }}" data-attribute="{{ $attribute->name }}">{{ $attribute->name }}</option>
                                    @endforeach
                                </select>
                            </div>
                            
                            <div id="variations-container">
                                @if($product->variations->count() > 0)
                                    @foreach($product->variations as $index => $variation)
                                        <div class="card mb-3 variation-card" data-id="{{ $variation->id }}">
                                            <div class="card-body">
                                                <div class="row">
                                                    <input type="hidden" name="variations[{{ $index }}][id]" value="{{ $variation->id }}">
                                                    
                                                    <div class="col-md-3 mb-2">
                                                        <label class="form-label">SKU</label>
                                                        <input type="text" class="form-control" name="variations[{{ $index }}][sku]" value="{{ $variation->sku }}">
                                                    </div>
                                                    <div class="col-md-3 mb-2">
                                                        <label class="form-label">Regular Price</label>
                                                        <input type="number" step="0.01" class="form-control" name="variations[{{ $index }}][regular_price]" value="{{ $variation->regular_price }}">
                                                    </div>
                                                    <div class="col-md-3 mb-2">
                                                        <label class="form-label">Sale Price</label>
                                                        <input type="number" step="0.01" class="form-control" name="variations[{{ $index }}][sale_price]" value="{{ $variation->sale_price }}">
                                                    </div>
                                                    <div class="col-md-3 mb-2">
                                                        <label class="form-label">Stock</label>
                                                        <input type="number" class="form-control" name="variations[{{ $index }}][stock_quantity]" value="{{ $variation->stock_quantity }}">
                                                    </div>
                                                    <div class="col-md-6 mb-2">
                                                        <label class="form-label">Attributes (JSON)</label>
                                                        <input type="text" class="form-control" name="variations[{{ $index }}][attributes]" value='{{ json_encode($variation->attributes) }}'>
                                                    </div>
                                                    <div class="col-md-4 mb-2">
                                                        <label class="form-label">Image</label>
                                                        <input type="file" class="form-control" name="variations[{{ $index }}][image]" accept="image/*">
                                                        @if($variation->image)
                                                            <div class="mt-2">
                                                                <img src="{{ asset('storage/' . $variation->image) }}" class="img-thumbnail" style="max-height: 50px;">
                                                            </div>
                                                        @endif
                                                    </div>
                                                    <div class="col-md-2 mb-2 d-flex align-items-end">
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="checkbox" name="variations[{{ $index }}][is_default]" {{ $variation->is_default ? 'checked' : '' }}>
                                                            <label class="form-check-label">Default</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-12 text-end">
                                                        <button type="button" class="btn btn-sm btn-danger remove-variation" data-id="{{ $variation->id }}">
                                                            <i class="ri-delete-bin-line"></i> Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    @endforeach
                                @endif
                            </div>
                            
                            <button type="button" class="btn btn-primary btn-sm mt-2" id="generate-variations">
                                <i class="ri-add-line"></i> Generate Variations
                            </button>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-12">
                            <button type="submit" class="btn btn-primary">Update Product</button>
                            <a href="{{ route('admin.products.index') }}" class="btn btn-secondary">Cancel</a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

@push('css')
<link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-bs4.min.css" rel="stylesheet">
@endpush

@push('script')
<script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-bs4.min.js"></script>
<script>
    $(document).ready(function() {
        // Initialize Summernote
        $('#description').summernote({
            height: 200,
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'underline', 'clear']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['table', ['table']],
                ['insert', ['link', 'picture']],
                ['view', ['fullscreen', 'codeview', 'help']]
            ]
        });
        
        // Initialize Select2
        $('.select2').select2({
            theme: 'bootstrap-5',
            width: '100%'
        });
        
        // Toggle stock field
        $('#manage_stock').change(function() {
            $('.stock-field').toggle(this.checked);
        });
        
        // Toggle variations section based on product type
        $('#product_type').change(function() {
            if ($(this).val() === 'variable') {
                $('#variations-section').slideDown();
            } else {
                $('#variations-section').slideUp();
            }
        });
        
        // Add specification row
        $('#add-spec').click(function() {
            let html = `
                <div class="row mb-2 specification-row">
                    <div class="col-md-5">
                        <input type="text" class="form-control" name="spec_keys[]" placeholder="Specification Name">
                    </div>
                    <div class="col-md-5">
                        <input type="text" class="form-control" name="spec_values[]" placeholder="Value">
                    </div>
                    <div class="col-md-2">
                        <button type="button" class="btn btn-danger remove-spec"><i class="ri-delete-bin-line"></i></button>
                    </div>
                </div>
            `;
            $('#specifications-container').append(html);
        });
        
        // Remove specification row
        $(document).on('click', '.remove-spec', function() {
            $(this).closest('.specification-row').remove();
        });
        
        // Add info row
        $('#add-info').click(function() {
            let html = `
                <div class="row mb-2 info-row">
                    <div class="col-md-5">
                        <input type="text" class="form-control" name="info_keys[]" placeholder="Field Name">
                    </div>
                    <div class="col-md-5">
                        <input type="text" class="form-control" name="info_values[]" placeholder="Value">
                    </div>
                    <div class="col-md-2">
                        <button type="button" class="btn btn-danger remove-info"><i class="ri-delete-bin-line"></i></button>
                    </div>
                </div>
            `;
            $('#info-container').append(html);
        });
        
        // Remove info row
        $(document).on('click', '.remove-info', function() {
            $(this).closest('.info-row').remove();
        });
        
        // Preview featured image
        $('#featured_image').change(function() {
            let file = this.files[0];
            let reader = new FileReader();
            
            reader.onload = function(e) {
                $('#featured_preview').html('<img src="' + e.target.result + '" class="img-thumbnail" style="max-height: 150px;">');
            };
            
            reader.readAsDataURL(file);
        });
        
        // Preview gallery images
        $('#images').change(function() {
            $('#gallery_preview').empty();
            
            $.each(this.files, function(index, file) {
                let reader = new FileReader();
                
                reader.onload = function(e) {
                    $('#gallery_preview').append('<div class="col-md-3 mb-2"><img src="' + e.target.result + '" class="img-thumbnail" style="max-height: 100px;"></div>');
                };
                
                reader.readAsDataURL(file);
            });
        });
        
        // Remove existing gallery image
        let deletedImages = [];
        $('.remove-existing-image').click(function() {
            let imageId = $(this).data('id');
            deletedImages.push(imageId);
            $('#deleted_images').val(deletedImages.join(','));
            $(this).closest('.existing-image').fadeOut();
        });
        
        // Generate variations
        $('#generate-variations').click(function() {
            let selectedAttributes = $('#attribute-select').val();
            if (!selectedAttributes || selectedAttributes.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'Please select at least one attribute!'
                });
                return;
            }
            
            // Get the next index for variations
            let nextIndex = $('#variations-container .variation-card').length;
            
            // Add a new variation row
            let variationHtml = `
                <div class="card mb-3 variation-card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-3 mb-2">
                                <label class="form-label">SKU</label>
                                <input type="text" class="form-control" name="variations[${nextIndex}][sku]">
                            </div>
                            <div class="col-md-3 mb-2">
                                <label class="form-label">Regular Price</label>
                                <input type="number" step="0.01" class="form-control" name="variations[${nextIndex}][regular_price]">
                            </div>
                            <div class="col-md-3 mb-2">
                                <label class="form-label">Sale Price</label>
                                <input type="number" step="0.01" class="form-control" name="variations[${nextIndex}][sale_price]">
                            </div>
                            <div class="col-md-3 mb-2">
                                <label class="form-label">Stock</label>
                                <input type="number" class="form-control" name="variations[${nextIndex}][stock_quantity]">
                            </div>
                            <div class="col-md-6 mb-2">
                                <label class="form-label">Attributes (JSON)</label>
                                <input type="text" class="form-control" name="variations[${nextIndex}][attributes]" value='{"Color":"","Size":""}'>
                            </div>
                            <div class="col-md-6 mb-2">
                                <label class="form-label">Image</label>
                                <input type="file" class="form-control" name="variations[${nextIndex}][image]" accept="image/*">
                            </div>
                            <div class="col-md-12">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="variations[${nextIndex}][is_default]">
                                    <label class="form-check-label">Default Variation</label>
                                </div>
                            </div>
                            <div class="col-md-12 text-end">
                                <button type="button" class="btn btn-sm btn-danger remove-variation">
                                    <i class="ri-delete-bin-line"></i> Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            $('#variations-container').append(variationHtml);
        });
        
        // Remove variation
        $(document).on('click', '.remove-variation', function() {
            let card = $(this).closest('.variation-card');
            let variationId = card.data('id');
            
            if (variationId) {
                // If it's an existing variation, we need to track it for deletion
                // You might want to add a hidden input for deleted variations
                Swal.fire({
                    title: 'Are you sure?',
                    text: "This variation will be deleted!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        card.remove();
                    }
                });
            } else {
                card.remove();
            }
        });
        
        // Form submission
        $('#productForm').on('submit', function(e) {
            e.preventDefault();
            
            let formData = new FormData(this);
            
            // Get Summernote content
            formData.set('description', $('#description').summernote('code'));
            
            $.ajax({
                url: $(this).attr('action'),
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
                            window.location.href = '{{ route('admin.products.index') }}';
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
    });
</script>
@endpush