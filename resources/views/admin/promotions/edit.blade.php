{{-- resources/views/admin/promotions/edit.blade.php --}}
@extends('layouts.admin.app')

@section('content')
<div class="row mb-32 gy-32">
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <h4 class="mb-0">Edit Promotion: {{ $promotion->title }}</h4>
            </div>
            <div class="card-body">
                <form action="{{ route('admin.promotions.update', $promotion->id) }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')

                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Title <span class="text-danger">*</span></label>
                                <input type="text" name="title" class="form-control @error('title') is-invalid @enderror" value="{{ old('title', $promotion->title) }}" required>
                                @error('title')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Subtitle/Badge Text</label>
                                <input type="text" name="subtitle" class="form-control @error('subtitle') is-invalid @enderror" value="{{ old('subtitle', $promotion->subtitle) }}">
                                @error('subtitle')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea name="description" class="form-control @error('description') is-invalid @enderror" rows="3">{{ old('description', $promotion->description) }}</textarea>
                        @error('description')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Current Image</label>
                                @if($promotion->image)
                                    <div class="mb-2">
                                        <img src="{{ asset('storage/' . $promotion->image) }}" alt="Current Image" style="width: 150px; height: 100px; object-fit: cover; border-radius: 8px;">
                                    </div>
                                @else
                                    <p class="text-muted">No image uploaded</p>
                                @endif
                                <label class="form-label">Change Image</label>
                                <input type="file" name="image" class="form-control @error('image') is-invalid @enderror" accept="image/*">
                                <small class="text-muted">Recommended size: 1920x1080 for sliders, 400x220 for feature products</small>
                                @error('image')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Type <span class="text-danger">*</span></label>
                                <select name="type" class="form-select @error('type') is-invalid @enderror" required>
                                    <option value="slider" {{ old('type', $promotion->type) == 'slider' ? 'selected' : '' }}>Slider (Banner)</option>
                                    <option value="feature_product" {{ old('type', $promotion->type) == 'feature_product' ? 'selected' : '' }}>Feature Product</option>
                                    <option value="feature_card" {{ old('type', $promotion->type) == 'feature_card' ? 'selected' : '' }}>Feature Card</option>
                                </select>
                                @error('type')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Position</label>
                                <select name="position" class="form-select @error('position') is-invalid @enderror">
                                    <option value="top" {{ old('position', $promotion->position) == 'top' ? 'selected' : '' }}>Top</option>
                                    <option value="middle" {{ old('position', $promotion->position) == 'middle' ? 'selected' : '' }}>Middle</option>
                                    <option value="bottom" {{ old('position', $promotion->position) == 'bottom' ? 'selected' : '' }}>Bottom</option>
                                </select>
                                @error('position')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Display Order</label>
                                <input type="number" name="order" class="form-control @error('order') is-invalid @enderror" value="{{ old('order', $promotion->order) }}">
                                <small class="text-muted">Lower numbers display first</small>
                                @error('order')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Button Text</label>
                                <input type="text" name="button_text" class="form-control @error('button_text') is-invalid @enderror" value="{{ old('button_text', $promotion->button_text ?? 'Shop Now') }}">
                                @error('button_text')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Button Link</label>
                                <input type="text" name="button_link" class="form-control @error('button_link') is-invalid @enderror" value="{{ old('button_link', $promotion->button_link ?? '/shop') }}">
                                @error('button_link')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Price (Optional)</label>
                                <input type="number" step="0.01" name="price" class="form-control @error('price') is-invalid @enderror" value="{{ old('price', $promotion->price) }}">
                                @error('price')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Original Price (Optional)</label>
                                <input type="number" step="0.01" name="original_price" class="form-control @error('original_price') is-invalid @enderror" value="{{ old('original_price', $promotion->original_price) }}">
                                @error('original_price')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Badge Text (Optional)</label>
                                <input type="text" name="badge_text" class="form-control @error('badge_text') is-invalid @enderror" value="{{ old('badge_text', $promotion->badge_text) }}" placeholder="e.g., Sale, New, Limited Offer">
                                @error('badge_text')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Product (for feature products)</label>
                                <select name="product_id" class="form-select @error('product_id') is-invalid @enderror">
                                    <option value="">Select Product (Optional)</option>
                                    @foreach($products as $product)
                                        <option value="{{ $product->id }}" {{ old('product_id', $promotion->product_id) == $product->id ? 'selected' : '' }}>
                                            {{ $product->name }} - ${{ $product->regular_price }}
                                        </option>
                                    @endforeach
                                </select>
                                @error('product_id')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Start Date</label>
                                <input type="date" name="start_date" class="form-control @error('start_date') is-invalid @enderror" value="{{ old('start_date', $promotion->start_date ? $promotion->start_date->format('Y-m-d') : '') }}">
                                @error('start_date')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">End Date</label>
                                <input type="date" name="end_date" class="form-control @error('end_date') is-invalid @enderror" value="{{ old('end_date', $promotion->end_date ? $promotion->end_date->format('Y-m-d') : '') }}">
                                @error('end_date')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="is_active" value="1" id="is_active" {{ old('is_active', $promotion->is_active) ? 'checked' : '' }}>
                                    <label class="form-check-label" for="is_active">
                                        Active
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4">
                        <button type="submit" class="btn btn-primary">Update Promotion</button>
                        <a href="{{ route('admin.promotions.index') }}" class="btn btn-secondary">Cancel</a>
                    </div>
                </form>
            </div>
        </div>

        <!-- Current Promotion Preview -->
        <div class="card mt-4">
            <div class="card-header">
                <h5 class="mb-0">Current Preview</h5>
            </div>
            <div class="card-body">
                @if($promotion->type == 'slider')
                    <div class="slider-preview" style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
                        <h4>{{ $promotion->title }}</h4>
                        <p>{{ $promotion->description }}</p>
                        <div class="d-flex">
                            <button class="btn btn-primary">{{ $promotion->button_text ?? 'Shop Now' }}</button>
                            @if($promotion->price)
                                <div class="ms-3">
                                    <h3>${{ $promotion->price }} @if($promotion->original_price) <del>${{ $promotion->original_price }}</del> @endif</h3>
                                </div>
                            @endif
                        </div>
                    </div>
                @elseif($promotion->type == 'feature_product')
                    <div class="feature-product-preview" style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
                        <p class="text-primary">{{ $promotion->badge_text ?? 'Only This Week' }}</p>
                        <h5>{{ $promotion->title }}</h5>
                        <p>{{ $promotion->description }}</p>
                        <a href="#" class="btn btn-primary">{{ $promotion->button_text ?? 'Shop Now' }}</a>
                    </div>
                @elseif($promotion->type == 'feature_card')
                    <div class="feature-card-preview d-flex">
                        <div class="me-3">
                            <i class="fas fa-star fa-2x" style="color: #634C9F;"></i>
                        </div>
                        <div>
                            <h5>{{ $promotion->title }}</h5>
                            <p>{{ $promotion->description }}</p>
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </div>
</div>
@endsection

@push('script')
<script>
    // Live preview on edit
    const form = document.querySelector('form');
    
    function updatePreview() {
        const title = document.querySelector('input[name="title"]').value;
        const description = document.querySelector('textarea[name="description"]').value;
        const type = document.querySelector('select[name="type"]').value;
        const badgeText = document.querySelector('input[name="badge_text"]').value;
        const price = document.querySelector('input[name="price"]').value;
        const originalPrice = document.querySelector('input[name="original_price"]').value;
        const buttonText = document.querySelector('input[name="button_text"]').value || 'Shop Now';
        
        const previewContainer = document.querySelector('.card.mt-4 .card-body');
        if (previewContainer) {
            let previewHtml = '';
            
            if (type === 'slider') {
                previewHtml = `
                    <div class="slider-preview" style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
                        <h4>${title || 'Slider Title'}</h4>
                        <p>${description || 'Slider description goes here...'}</p>
                        <div class="d-flex">
                            <button class="btn btn-primary">${buttonText}</button>
                            ${price ? `<div class="ms-3"><h3>$${price} ${originalPrice ? `<del>$${originalPrice}</del>` : ''}</h3></div>` : ''}
                        </div>
                    </div>
                `;
            } else if (type === 'feature_product') {
                previewHtml = `
                    <div class="feature-product-preview" style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
                        <p class="text-primary">${badgeText || 'Only This Week'}</p>
                        <h5>${title || 'Product Title'}</h5>
                        <p>${description || 'Product description...'}</p>
                        <a href="#" class="btn btn-primary">${buttonText}</a>
                    </div>
                `;
            } else if (type === 'feature_card') {
                previewHtml = `
                    <div class="feature-card-preview d-flex">
                        <div class="me-3">
                            <i class="fas fa-star fa-2x" style="color: #634C9F;"></i>
                        </div>
                        <div>
                            <h5>${title || 'Card Title'}</h5>
                            <p>${description || 'Card description goes here...'}</p>
                        </div>
                    </div>
                `;
            }
            
            previewContainer.innerHTML = previewHtml;
        }
    }
    
    // Add event listeners
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
        input.addEventListener('change', updatePreview);
    });
</script>
@endpush