import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link, useForm } from '@inertiajs/react';

export default function CartModal() {
    const {
        showCartModal,
        setShowCartModal,
        cartItems,
        getCartCount,
        getCartTotal,
        removeFromCart,
        updateQuantity,
        clearCart
    } = useCart();

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        notes: ''
    });

    const handleCheckout = (e) => {
        e.preventDefault();

        // Prepare order data with cart items
        const orderData = {
            ...data,
            cart_items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            total: getCartTotal()
        };

        post('/guest-checkout', {
            data: orderData,
            onSuccess: () => {
                setShowCartModal(false);
                reset();
                clearCart();
            },
            onError: (errors) => {
                console.log('Checkout errors:', errors);
            }
        });
    };

    if (!showCartModal) return null;

    // Floating label input component
    const FloatingInput = ({ type = "text", name, label, value, onChange, error, required = false, rows }) => {
        const [focused, setFocused] = useState(false);
        const hasValue = value && value.length > 0;

        if (type === "textarea") {
            return (
                <div className="floating-input-group mb-4">
                    <div className={`floating-input-wrapper ${focused ? 'focused' : ''} ${error ? 'error' : ''} ${hasValue ? 'has-value' : ''}`}>
                        <textarea
                            name={name}
                            rows={rows || 3}
                            value={value}
                            onChange={onChange}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            className="floating-textarea"
                            required={required}
                        />
                        <label className="floating-label">{label} {required && <span className="text-danger">*</span>}</label>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                </div>
            );
        }

        return (
            <div className="floating-input-group mb-4">
                <div className={`floating-input-wrapper ${focused ? 'focused' : ''} ${error ? 'error' : ''} ${hasValue ? 'has-value' : ''}`}>
                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        className="floating-input"
                        required={required}
                    />
                    <label className="floating-label">{label} {required && <span className="text-danger">*</span>}</label>
                </div>
                {error && <div className="error-message">{error}</div>}
            </div>
        );
    };

    return (
        <>
            {/* Modal Backdrop */}
            <div
                className="modal-backdrop fade show"
                style={{ zIndex: 1040 }}
                onClick={() => {
                    setShowCartModal(false);
                }}
            />

            {/* Modal */}
            <div
                className="modal fade show"
                style={{ display: 'block', zIndex: 1050 }}
                tabIndex="-1"
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                        {/* Modal Header with Gradient */}
                        <div className="modal-header border-0" style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            padding: '1.5rem 2rem'
                        }}>
                            <h5 className="modal-title text-white fw-bold">
                                <i className="fas fa-lock me-2"></i>
                                Secure Checkout
                                {cartItems.length > 0 && (
                                    <span className="ms-2 badge bg-white text-primary rounded-pill px-3">
                                        {getCartCount()} {getCartCount() === 1 ? 'Item' : 'Items'}
                                    </span>
                                )}
                            </h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={() => {
                                    setShowCartModal(false);
                                }}
                            />
                        </div>

                        <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            {cartItems.length === 0 ? (
                                <div className="text-center py-5">
                                    <div className="empty-cart-icon mb-4">
                                        <i className="fas fa-shopping-cart fa-4x" style={{ color: '#e1e1e1' }}></i>
                                    </div>
                                    <h5 className="text-muted mb-3">Your cart is empty</h5>
                                    <p className="text-muted mb-4">Looks like you haven't added anything to your cart yet</p>
                                    <button
                                        className="btn btn-primary px-4 py-2 rounded-pill"
                                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                                        onClick={() => setShowCartModal(false)}
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="row">
                                    {/* Left Column - Cart Items */}
                                    <div className="col-lg-5 mb-4 mb-lg-0">
                                        <h6 className="fw-bold mb-3" style={{ color: '#667eea' }}>
                                            <i className="fas fa-shopping-cart me-2"></i>
                                            Your Items
                                        </h6>

                                        {/* Cart Items List */}
                                        <div className="cart-items" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
                                            {cartItems.map((item, index) => (
                                                <div
                                                    key={item.id}
                                                    className="cart-item-card mb-3 p-3"
                                                    style={{
                                                        background: '#f8f9fa',
                                                        borderRadius: '15px',
                                                        border: '1px solid #e9ecef',
                                                        animation: `slideIn 0.3s ease ${index * 0.1}s`
                                                    }}
                                                >
                                                    <div className="d-flex">
                                                        <div className="item-image me-3" style={{ position: 'relative' }}>
                                                            <img
                                                                src={item.image || 'https://via.placeholder.com/60'}
                                                                alt={item.name}
                                                                style={{
                                                                    width: '60px',
                                                                    height: '60px',
                                                                    objectFit: 'cover',
                                                                    borderRadius: '10px',
                                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="flex-grow-1">
                                                            <div className="d-flex justify-content-between align-items-start">
                                                                <h6 className="fw-bold mb-1" style={{ fontSize: '0.95rem' }}>{item.name}</h6>
                                                                <button
                                                                    onClick={() => removeFromCart(item.id)}
                                                                    className="btn btn-link text-danger p-0"
                                                                    style={{ fontSize: '1rem' }}
                                                                >
                                                                    <i className="fas fa-times"></i>
                                                                </button>
                                                            </div>

                                                            <div className="d-flex justify-content-between align-items-center mt-2">
                                                                <span className="text-primary fw-bold">
                                                                    ${item.price}
                                                                </span>

                                                                <div className="quantity-control d-flex align-items-center">
                                                                    <button
                                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                                        className="btn btn-sm btn-outline-secondary rounded-circle"
                                                                        style={{ width: '25px', height: '25px', padding: 0, fontSize: '0.8rem' }}
                                                                    >
                                                                        <i className="fas fa-minus"></i>
                                                                    </button>
                                                                    <span className="mx-2 fw-bold" style={{ fontSize: '0.9rem' }}>{item.quantity}</span>
                                                                    <button
                                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                        className="btn btn-sm btn-outline-secondary rounded-circle"
                                                                        style={{ width: '25px', height: '25px', padding: 0, fontSize: '0.8rem' }}
                                                                    >
                                                                        <i className="fas fa-plus"></i>
                                                                    </button>
                                                                </div>

                                                                <span className="fw-bold text-primary" style={{ fontSize: '0.95rem' }}>
                                                                    ${(item.price * item.quantity).toFixed(2)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Mini Cart Summary */}
                                        <div className="mt-3 p-3" style={{
                                            background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
                                            borderRadius: '12px'
                                        }}>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Subtotal:</span>
                                                <span className="fw-bold">${getCartTotal().toFixed(2)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Shipping:</span>
                                                <span className="text-success">Free</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Tax (10%):</span>
                                                <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
                                            </div>
                                            <hr className="my-2" />
                                            <div className="d-flex justify-content-between">
                                                <span className="fw-bold">Total:</span>
                                                <span className="h6 fw-bold" style={{
                                                    color: '#667eea'
                                                }}>
                                                    ${(getCartTotal() * 1.1).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Checkout Form */}
                                    <div className="col-lg-7">
                                        <h6 className="fw-bold mb-3" style={{ color: '#667eea' }}>
                                            <i className="fas fa-user me-2"></i>
                                            Guest Checkout
                                        </h6>

                                        <form onSubmit={handleCheckout}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <FloatingInput
                                                        type="text"
                                                        name="first_name"
                                                        label="First Name"
                                                        value={data.first_name}
                                                        onChange={e => setData('first_name', e.target.value)}
                                                        error={errors.first_name}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <FloatingInput
                                                        type="text"
                                                        name="last_name"
                                                        label="Last Name"
                                                        value={data.last_name}
                                                        onChange={e => setData('last_name', e.target.value)}
                                                        error={errors.last_name}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6">
                                                    <FloatingInput
                                                        type="email"
                                                        name="email"
                                                        label="Email Address"
                                                        value={data.email}
                                                        onChange={e => setData('email', e.target.value)}
                                                        error={errors.email}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <FloatingInput
                                                        type="tel"
                                                        name="phone"
                                                        label="Phone Number"
                                                        value={data.phone}
                                                        onChange={e => setData('phone', e.target.value)}
                                                        error={errors.phone}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <FloatingInput
                                                type="text"
                                                name="address"
                                                label="Street Address"
                                                value={data.address}
                                                onChange={e => setData('address', e.target.value)}
                                                error={errors.address}
                                                required
                                            />

                                            <div className="row">
                                                <div className="col-md-6">
                                                    <FloatingInput
                                                        type="text"
                                                        name="city"
                                                        label="City"
                                                        value={data.city}
                                                        onChange={e => setData('city', e.target.value)}
                                                        error={errors.city}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <FloatingInput
                                                        type="text"
                                                        name="postal_code"
                                                        label="Postal Code"
                                                        value={data.postal_code}
                                                        onChange={e => setData('postal_code', e.target.value)}
                                                        error={errors.postal_code}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <FloatingInput
                                                type="textarea"
                                                name="notes"
                                                label="Order Notes (Optional)"
                                                value={data.notes}
                                                onChange={e => setData('notes', e.target.value)}
                                                rows="2"
                                            />

                                            <button
                                                type="submit"
                                                className="btn btn-success w-100 py-3 rounded-pill mt-3"
                                                disabled={processing}
                                                style={{
                                                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                                    border: 'none',
                                                    fontSize: '1.1rem',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {processing ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-lock me-2"></i>
                                                        Place Order • ${(getCartTotal() * 1.1).toFixed(2)}
                                                    </>
                                                )}
                                            </button>

                                            <p className="text-center text-muted small mt-3">
                                                <i className="fas fa-shield-alt me-1"></i>
                                                Your information is secure and encrypted
                                            </p>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="modal-footer border-0 p-3" style={{ background: '#f8f9fa' }}>
                            <button
                                type="button"
                                className="btn btn-outline-secondary rounded-pill px-4"
                                onClick={() => setShowCartModal(false)}
                                style={{ borderWidth: '2px' }}
                            >
                                <i className="fas fa-times me-2"></i>
                                Close
                            </button>
                            {cartItems.length > 0 && (
                                <Link
                                    href="/cart"
                                    className="btn btn-outline-primary rounded-pill px-4"
                                    onClick={() => setShowCartModal(false)}
                                    style={{ borderWidth: '2px' }}
                                >
                                    <i className="fas fa-shopping-cart me-2"></i>
                                    View Full Cart
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add custom styles */}
            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .floating-input-wrapper {
                    position: relative;
                    margin-bottom: 0;
                }

                .floating-input, .floating-textarea {
                    width: 100%;
                    padding: 0.9rem 1rem 0.4rem;
                    border: 2px solid #e1e1e1;
                    border-radius: 10px;
                    outline: none;
                    font-size: 0.95rem;
                    transition: all 0.3s ease;
                    background: white;
                    font-family: Inter;

                }

                .floating-textarea {
                    min-height: 70px;
                    resize: vertical;
                    font-family: Inter;

                }

                .floating-label {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    background: white;
                    padding: 0 0.25rem;
                    color: #999;
                    font-size: 0.95rem;
                    transition: all 0.3s ease;
                    pointer-events: none;
                    border-radius: 4px;
                    font-family: Inter;

                }

                .floating-textarea ~ .floating-label {
                    top: 1rem;
                    transform: none;
                    font-family: Inter;

                }

                .floating-input-wrapper.focused .floating-input,
                .floating-input-wrapper.focused .floating-textarea,
                .floating-input-wrapper.has-value .floating-input,
                .floating-input-wrapper.has-value .floating-textarea {
                    border-color: #667eea;
                    padding-top: 1.1rem;
                    padding-bottom: 0.2rem;
                }

                .floating-input-wrapper.focused .floating-label,
                .floating-input-wrapper.has-value .floating-label {
                    top: 0;
                    transform: translateY(-50%) scale(0.8);
                    color: #667eea;
                    font-weight: 500;
                }

                .floating-input-wrapper.error .floating-input,
                .floating-input-wrapper.error .floating-textarea {
                    border-color: #dc3545;
                }

                .floating-input-wrapper.error .floating-label {
                    color: #dc3545;
                }

                .error-message {
                    color: #dc3545;
                    font-size: 0.8rem;
                    margin-top: 0.2rem;
                    padding-left: 0.5rem;
                    font-family: Inter;

                }

                .cart-item-card {
                    transition: all 0.3s ease;
                }

                .cart-item-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }

                .quantity-control button {
                    transition: all 0.3s ease;
                    font-family: Inter;

                }

                .quantity-control button:hover {
                    background: #667eea;
                    color: white;
                    border-color: #667eea;
                }

                ::-webkit-scrollbar {
                    width: 6px;
                }

                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }

                ::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 10px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }
            `}</style>
        </>
    );
}
