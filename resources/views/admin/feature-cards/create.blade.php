{{-- resources/views/admin/feature-cards/create.blade.php --}}
@extends('layouts.admin.app')

@section('content')
<div class="row mb-32 gy-32">
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <h4 class="mb-0">Create New Feature Card</h4>
            </div>
            <div class="card-body">
                <form action="{{ route('admin.feature-cards.store') }}" method="POST">
                    @csrf

                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Title <span class="text-danger">*</span></label>
                                <input type="text" name="title" class="form-control @error('title') is-invalid @enderror" value="{{ old('title') }}" required>
                                @error('title')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Icon (Font Awesome Class)</label>
                                <input type="text" name="icon" class="form-control @error('icon') is-invalid @enderror" value="{{ old('icon') }}" placeholder="e.g., fas fa-truck">
                                <small class="text-muted">Example: fas fa-truck, fas fa-credit-card, fas fa-tags</small>
                                @error('icon')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Description <span class="text-danger">*</span></label>
                        <textarea name="description" class="form-control @error('description') is-invalid @enderror" rows="4" required>{{ old('description') }}</textarea>
                        @error('description')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Display Order</label>
                                <input type="number" name="order" class="form-control @error('order') is-invalid @enderror" value="{{ old('order', 0) }}">
                                <small class="text-muted">Lower numbers display first</small>
                                @error('order')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <div class="form-check mt-4">
                                    <input class="form-check-input" type="checkbox" name="is_active" value="1" id="is_active" {{ old('is_active', true) ? 'checked' : '' }}>
                                    <label class="form-check-label" for="is_active">
                                        Active
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4">
                        <button type="submit" class="btn btn-primary">Create Feature Card</button>
                        <a href="{{ route('admin.feature-cards.index') }}" class="btn btn-secondary">Cancel</a>
                    </div>
                </form>
            </div>
        </div>

        <!-- Icon Preview Section -->
        <div class="card mt-4">
            <div class="card-header">
                <h5 class="mb-0">Available Font Awesome Icons</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3">
                        <div class="icon-preview p-3 border rounded text-center">
                            <i class="fas fa-truck fa-2x mb-2"></i>
                            <div><code>fas fa-truck</code></div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="icon-preview p-3 border rounded text-center">
                            <i class="fas fa-credit-card fa-2x mb-2"></i>
                            <div><code>fas fa-credit-card</code></div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="icon-preview p-3 border rounded text-center">
                            <i class="fas fa-tags fa-2x mb-2"></i>
                            <div><code>fas fa-tags</code></div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="icon-preview p-3 border rounded text-center">
                            <i class="fas fa-check-circle fa-2x mb-2"></i>
                            <div><code>fas fa-check-circle</code></div>
                        </div>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-3">
                        <div class="icon-preview p-3 border rounded text-center">
                            <i class="fas fa-shopping-cart fa-2x mb-2"></i>
                            <div><code>fas fa-shopping-cart</code></div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="icon-preview p-3 border rounded text-center">
                            <i class="fas fa-clock fa-2x mb-2"></i>
                            <div><code>fas fa-clock</code></div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="icon-preview p-3 border rounded text-center">
                            <i class="fas fa-gift fa-2x mb-2"></i>
                            <div><code>fas fa-gift</code></div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="icon-preview p-3 border rounded text-center">
                            <i class="fas fa-star fa-2x mb-2"></i>
                            <div><code>fas fa-star</code></div>
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <small class="text-muted">Visit <a href="https://fontawesome.com/icons" target="_blank">Font Awesome Icons</a> for more icons</small>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .icon-preview {
        transition: all 0.3s ease;
        cursor: pointer;
    }
    .icon-preview:hover {
        background: #f8f9fa;
        border-color: #634C9F !important;
        transform: translateY(-2px);
    }
    .icon-preview code {
        font-size: 11px;
        background: #f0f0f0;
        padding: 2px 5px;
        border-radius: 3px;
    }
</style>

<script>
    // Click to copy icon class
    document.querySelectorAll('.icon-preview').forEach(preview => {
        preview.addEventListener('click', function() {
            const iconClass = this.querySelector('code').innerText;
            document.querySelector('input[name="icon"]').value = iconClass;
            
            // Show success message
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Icon class copied!',
                showConfirmButton: false,
                timer: 1500
            });
        });
    });
</script>
@endsection