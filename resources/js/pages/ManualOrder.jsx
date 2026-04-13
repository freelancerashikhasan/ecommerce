// resources/js/Pages/ManualOrder.jsx
import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import MainLayout from '../Layout/MainLayout';

export default function ManualOrder() {
    const { data, setData, post, processing, errors, reset } = useForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        shipping_address: '',
        delivery_area: 'inside',
        product_name: '',
        product_link: '',
        product_details: '',
        quantity: 1,
        expected_price: '',
        special_instructions: '',
        preferred_payment: 'cod'
    });

    const [showSuccess, setShowSuccess] = useState(false);

    const deliveryAreas = [
        { value: 'inside', label: 'Inside Dhaka', charge: 60 },
        { value: 'outside', label: 'Outside Dhaka', charge: 120 }
    ];

    const paymentMethods = [
        { value: 'cod', label: 'Cash on Delivery', icon: 'fas fa-money-bill-wave' },
        { value: 'bkash', label: 'bKash', icon: 'fas fa-mobile-alt' },
        { value: 'nagad', label: 'Nagad', icon: 'fas fa-mobile-alt' },
        { value: 'rocket', label: 'Rocket', icon: 'fas fa-university' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/manual-order', {
            onSuccess: () => {
                setShowSuccess(true);
                reset();
                setTimeout(() => setShowSuccess(false), 5000);
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
            }
        });
    };

    return (
        <MainLayout>
            <div className="container manual-order-container py-4 py-md-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10 col-xl-8">
                        {/* Header */}
                        <div className="text-center mb-4 mb-md-5">
                            <h1 className="fw-bold mb-3" style={{ color: '#112066' }}>
                                <i className="fas fa-cart-plus me-2"></i>
                                Manual Order Request
                            </h1>
                            <p className="text-muted">
                                Can't find what you're looking for? Submit a manual order request and we'll help you get it.
                            </p>
                        </div>

                        {/* Success Message */}
                        {showSuccess && (
                            <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
                                <i className="fas fa-check-circle me-2"></i>
                                <strong>Order Request Submitted!</strong> We'll contact you within 24 hours to confirm your order.
                                <button type="button" className="btn-close" onClick={() => setShowSuccess(false)}></button>
                            </div>
                        )}

                        {/* Form Card */}
                        <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                            <div className="card-header bg-white p-4 border-0" style={{ background: 'linear-gradient(135deg, #112066 0%, #8B6FC1 100%)' }}>
                                <h5 className="mb-0 text-white">
                                    <i className="fas fa-edit me-2"></i>
                                    Order Details Form
                                </h5>
                                <p className="text-white-50 mb-0 small mt-2">
                                    Please fill out all required fields carefully
                                </p>
                            </div>

                            <div className="card-body p-4 p-md-5">
                                <form onSubmit={handleSubmit}>
                                    {/* Customer Information Section */}
                                    <div className="mb-4">
                                        <h6 className="fw-bold mb-3 pb-2 border-bottom" style={{ color: '#112066' }}>
                                            <i className="fas fa-user me-2"></i>
                                            Customer Information
                                        </h6>
                                        
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Full Name <span className="text-danger">*</span>
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">
                                                        <i className="fas fa-user"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${errors.customer_name ? 'is-invalid' : ''}`}
                                                        value={data.customer_name}
                                                        onChange={e => setData('customer_name', e.target.value)}
                                                        placeholder="Enter your full name"
                                                        required
                                                    />
                                                </div>
                                                {errors.customer_name && (
                                                    <div className="invalid-feedback d-block">{errors.customer_name}</div>
                                                )}
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Phone Number <span className="text-danger">*</span>
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">
                                                        <i className="fas fa-phone"></i>
                                                    </span>
                                                    <input
                                                        type="tel"
                                                        className={`form-control ${errors.customer_phone ? 'is-invalid' : ''}`}
                                                        value={data.customer_phone}
                                                        onChange={e => setData('customer_phone', e.target.value)}
                                                        placeholder="01XXXXXXXXX"
                                                        required
                                                    />
                                                </div>
                                                {errors.customer_phone && (
                                                    <div className="invalid-feedback d-block">{errors.customer_phone}</div>
                                                )}
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Email Address
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">
                                                        <i className="fas fa-envelope"></i>
                                                    </span>
                                                    <input
                                                        type="email"
                                                        className={`form-control ${errors.customer_email ? 'is-invalid' : ''}`}
                                                        value={data.customer_email}
                                                        onChange={e => setData('customer_email', e.target.value)}
                                                        placeholder="your@email.com"
                                                    />
                                                </div>
                                                {errors.customer_email && (
                                                    <div className="invalid-feedback d-block">{errors.customer_email}</div>
                                                )}
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Delivery Area <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    className={`form-select ${errors.delivery_area ? 'is-invalid' : ''}`}
                                                    value={data.delivery_area}
                                                    onChange={e => setData('delivery_area', e.target.value)}
                                                    required
                                                >
                                                    {deliveryAreas.map(area => (
                                                        <option key={area.value} value={area.value}>
                                                            {area.label} (Delivery Charge: ৳{area.charge})
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.delivery_area && (
                                                    <div className="invalid-feedback d-block">{errors.delivery_area}</div>
                                                )}
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label fw-semibold">
                                                    Shipping Address <span className="text-danger">*</span>
                                                </label>
                                                <textarea
                                                    className={`form-control ${errors.shipping_address ? 'is-invalid' : ''}`}
                                                    rows="2"
                                                    value={data.shipping_address}
                                                    onChange={e => setData('shipping_address', e.target.value)}
                                                    placeholder="House no., Road, Area, Landmark"
                                                    required
                                                ></textarea>
                                                {errors.shipping_address && (
                                                    <div className="invalid-feedback d-block">{errors.shipping_address}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Information Section */}
                                    <div className="mb-4">
                                        <h6 className="fw-bold mb-3 pb-2 border-bottom" style={{ color: '#112066' }}>
                                            <i className="fas fa-box me-2"></i>
                                            Product Information
                                        </h6>
                                        
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Product Name <span className="text-danger">*</span>
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">
                                                        <i className="fas fa-tag"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${errors.product_name ? 'is-invalid' : ''}`}
                                                        value={data.product_name}
                                                        onChange={e => setData('product_name', e.target.value)}
                                                        placeholder="Product name"
                                                        required
                                                    />
                                                </div>
                                                {errors.product_name && (
                                                    <div className="invalid-feedback d-block">{errors.product_name}</div>
                                                )}
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Product Link (Optional)
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">
                                                        <i className="fas fa-link"></i>
                                                    </span>
                                                    <input
                                                        type="url"
                                                        className={`form-control ${errors.product_link ? 'is-invalid' : ''}`}
                                                        value={data.product_link}
                                                        onChange={e => setData('product_link', e.target.value)}
                                                        placeholder="https://example.com/product"
                                                    />
                                                </div>
                                                {errors.product_link && (
                                                    <div className="invalid-feedback d-block">{errors.product_link}</div>
                                                )}
                                                <small className="text-muted">Paste product URL from any website (optional)</small>
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label fw-semibold">
                                                    Product Details / Specifications
                                                </label>
                                                <textarea
                                                    className={`form-control ${errors.product_details ? 'is-invalid' : ''}`}
                                                    rows="3"
                                                    value={data.product_details}
                                                    onChange={e => setData('product_details', e.target.value)}
                                                    placeholder="Color, size, model, features, or any specific requirements"
                                                ></textarea>
                                                {errors.product_details && (
                                                    <div className="invalid-feedback d-block">{errors.product_details}</div>
                                                )}
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label fw-semibold">
                                                    Quantity <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                                                    value={data.quantity}
                                                    onChange={e => setData('quantity', parseInt(e.target.value) || 1)}
                                                    min="1"
                                                    required
                                                />
                                                {errors.quantity && (
                                                    <div className="invalid-feedback d-block">{errors.quantity}</div>
                                                )}
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label fw-semibold">
                                                    Expected Price (BDT)
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">৳</span>
                                                    <input
                                                        type="number"
                                                        className={`form-control ${errors.expected_price ? 'is-invalid' : ''}`}
                                                        value={data.expected_price}
                                                        onChange={e => setData('expected_price', e.target.value)}
                                                        placeholder="Your expected price"
                                                    />
                                                </div>
                                                {errors.expected_price && (
                                                    <div className="invalid-feedback d-block">{errors.expected_price}</div>
                                                )}
                                                <small className="text-muted">Optional: Tell us your expected price</small>
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label fw-semibold">
                                                    Preferred Payment Method
                                                </label>
                                                <select
                                                    className={`form-select ${errors.preferred_payment ? 'is-invalid' : ''}`}
                                                    value={data.preferred_payment}
                                                    onChange={e => setData('preferred_payment', e.target.value)}
                                                >
                                                    {paymentMethods.map(method => (
                                                        <option key={method.value} value={method.value}>
                                                            {method.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.preferred_payment && (
                                                    <div className="invalid-feedback d-block">{errors.preferred_payment}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Information */}
                                    <div className="mb-4">
                                        <h6 className="fw-bold mb-3 pb-2 border-bottom" style={{ color: '#112066' }}>
                                            <i className="fas fa-info-circle me-2"></i>
                                            Additional Information
                                        </h6>
                                        
                                        <div className="row g-3">
                                            <div className="col-12">
                                                <label className="form-label fw-semibold">
                                                    Special Instructions
                                                </label>
                                                <textarea
                                                    className={`form-control ${errors.special_instructions ? 'is-invalid' : ''}`}
                                                    rows="2"
                                                    value={data.special_instructions}
                                                    onChange={e => setData('special_instructions', e.target.value)}
                                                    placeholder="Any special requests, delivery instructions, or notes"
                                                ></textarea>
                                                {errors.special_instructions && (
                                                    <div className="invalid-feedback d-block">{errors.special_instructions}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary px-4"
                                            onClick={() => reset()}
                                            disabled={processing}
                                        >
                                            <i className="fas fa-undo-alt me-2"></i>
                                            Reset
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn px-5 py-2"
                                            style={{ background: '#112066', color: 'white' }}
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-paper-plane me-2"></i>
                                                    Submit Order Request
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="alert alert-info mt-4" style={{ borderRadius: '15px' }}>
                            <div className="d-flex flex-column flex-md-row align-items-md-center gap-3">
                                <i className="fas fa-info-circle fs-2"></i>
                                <div>
                                    <strong>How it works:</strong>
                                    <p className="mb-0 small">
                                        1. Submit your manual order request with all details.<br />
                                        2. Our team will review and contact you within 24 hours.<br />
                                        3. We'll confirm availability, final price, and delivery timeline.<br />
                                        4. Make payment and receive your product.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .manual-order-container {
                    font-family: 'Inter', sans-serif;
                }
                
                .form-label {
                    font-size: 0.9rem;
                    margin-bottom: 0.5rem;
                }
                
                .input-group-text {
                    border: 1px solid #dee2e6;
                    border-right: none;
                }
                
                .form-control, .form-select {
                    border-left: none;
                }
                
                .form-control:focus, .form-select:focus {
                    box-shadow: none;
                    border-color: #112066;
                }
                
                .input-group:focus-within .input-group-text {
                    border-color: #112066;
                }
                
                @media (max-width: 768px) {
                    .card-body {
                        padding: 1.5rem !important;
                    }
                }
            `}</style>
        </MainLayout>
    );
}