{{-- resources/views/admin/promotions/create.blade.php --}}
@extends('layouts.admin.app')

@section('content')
<div class="row mb-32 gy-32">
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <h4 class="mb-0">{{ isset($promotion) ? 'Edit Promotion' : 'Create New Promotion' }}</h4>
            </div>
            <div class="card-body">
                <form id="promotionForm" action="{{ isset($promotion) ? route('admin.promotions.update', $promotion->id) : route('admin.promotions.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    @if(isset($promotion))
                        @method('PUT')
                    @endif

                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Title <span class="text-danger">*</span></label>
                                <input type="text" name="title" class="form-control" value="{{ old('title', $promotion->title ?? '') }}" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Subtitle/Badge Text</label>
                                <input type="text" name="subtitle" class="form-control" value="{{ old('subtitle', $promotion->subtitle ?? '') }}">
                            </div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea name="description" class="form-control" rows="3">{{ old('description', $promotion->description ?? '') }}</textarea>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Image</label>
                                @if(isset($promotion) && $promotion->image)
                                    <div class="mb-2">
                                        <img src="{{ asset('storage/' . $promotion->image) }}" alt="Current Image" style="width: 100px; height: 100px; object-fit: cover;">
                                    </div>
                                @endif
                                <input type="file" name="image" class="form-control" accept="image/*">
                                <small class="text-muted">Recommended size: 1920x1080 for sliders, 400x220 for feature products</small>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Type <span class="text-danger">*</span></label>
                                <select name="type" class="form-select" required>
                                    <option value="slider" {{ (old('type', $promotion->type ?? '') == 'slider') ? 'selected' : '' }}>Slider (Banner)</option>
                                    <option value="feature_product" {{ (old('type', $promotion->type ?? '') == 'feature_product') ? 'selected' : '' }}>Feature Product</option>
                                    <option value="feature_card" {{ (old('type', $promotion->type ?? '') == 'feature_card') ? 'selected' : '' }}>Feature Card</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Position</label>
                                <select name="position" class="form-select">
                                    <option value="top" {{ (old('position', $promotion->position ?? '') == 'top') ? 'selected' : '' }}>Top</option>
                                    <option value="middle" {{ (old('position', $promotion->position ?? '') == 'middle') ? 'selected' : '' }}>Middle</option>
                                    <option value="bottom" {{ (old('position', $promotion->position ?? '') == 'bottom') ? 'selected' : '' }}>Bottom</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Display Order</label>
                                <input type="number" name="order" class="form-control" value="{{ old('order', $promotion->order ?? 0) }}">
                                <small class="text-muted">Lower numbers display first</small>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Button Text</label>
                                <input type="text" name="button_text" class="form-control" value="{{ old('button_text', $promotion->button_text ?? 'Shop Now') }}">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Button Link</label>
                                <input type="text" name="button_link" class="form-control" value="{{ old('button_link', $promotion->button_link ?? '/shop') }}">
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Price</label>
                                <input type="number" step="0.01" name="price" class="form-control" value="{{ old('price', $promotion->price ?? '') }}">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Original Price</label>
                                <input type="number" step="0.01" name="original_price" class="form-control" value="{{ old('original_price', $promotion->original_price ?? '') }}">
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Start Date</label>
                                <input type="date" name="start_date" class="form-control" value="{{ old('start_date', $promotion->start_date ?? '') }}">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">End Date</label>
                                <input type="date" name="end_date" class="form-control" value="{{ old('end_date', $promotion->end_date ?? '') }}">
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Product (for feature products)</label>
                                <select name="product_id" class="form-select">
                                    <option value="">Select Product (Optional)</option>
                                    @foreach($products ?? [] as $product)
                                        <option value="{{ $product->id }}" {{ (old('product_id', $promotion->product_id ?? '') == $product->id) ? 'selected' : '' }}>
                                            {{ $product->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <div class="form-check mt-4">
                                    <input class="form-check-input" type="checkbox" name="is_active" value="1" id="is_active" {{ (old('is_active', $promotion->is_active ?? true) == 1) ? 'checked' : '' }}>
                                    <label class="form-check-label" for="is_active">
                                        Active
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4">
                        <button type="submit" class="btn btn-primary">Save Promotion</button>
                        <a href="{{ route('admin.promotions.index') }}" class="btn btn-secondary">Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

@push('script')
<script>
    // Add any additional JavaScript if needed
</script>
@endpush