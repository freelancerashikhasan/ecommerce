import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link, useForm } from '@inertiajs/react';
import axios from 'axios';

// Move FormInput component outside
const FormInput = ({ type = "text", name, label, value, onChange, error, required = false, rows }) => {
    if (type === "textarea") {
        return (
            <div className="mb-4">
                <label className="form-label fw-semibold mb-2">
                    {label} {required && <span className="text-danger">*</span>}
                </label>
                <textarea
                    name={name}
                    rows={rows || 3}
                    value={value}
                    onChange={onChange}
                    className={`form-control ${error ? 'is-invalid' : ''}`}
                    style={{
                        borderRadius: '10px',
                        border: '2px solid #e1e1e1',
                        padding: '0.75rem 1rem',
                        fontSize: '0.95rem'
                    }}
                    required={required}
                />
                {error && <div className="invalid-feedback">{error}</div>}
            </div>
        );
    }

    return (
        <div className="mb-4">
            <label className="form-label fw-semibold mb-2">
                {label} {required && <span className="text-danger">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                style={{
                    borderRadius: '10px',
                    border: '2px solid #e1e1e1',
                    padding: '0.75rem 1rem',
                    fontSize: '0.95rem'
                }}
                required={required}
            />
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
};

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

    const [deliveryArea, setDeliveryArea] = useState('inside');
    const [deliveryCharge, setDeliveryCharge] = useState(50);
    const [isMobile, setIsMobile] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        delivery_area: 'inside',
        delivery_charge: 50,
        notes: '',
        payment_method: 'cash_on_delivery'
    });

    // Check screen size
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 767);
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Memoize total calculation
    const calculateTotal = useMemo(() => {
        const subtotal = getCartTotal();
        return subtotal + deliveryCharge;
    }, [getCartTotal, deliveryCharge]);

    // Update delivery charge when area changes
    useEffect(() => {
        const charge = deliveryArea === 'inside' ? 50 : 90;
        setDeliveryCharge(charge);
        setData('delivery_area', deliveryArea);
        setData('delivery_charge', charge);
    }, [deliveryArea, setData]);

    const handleDeliveryAreaChange = (e) => {
        setDeliveryArea(e.target.value);
    };

    // Memoize input change handler
    const handleInputChange = useCallback((field) => (e) => {
        setData(field, e.target.value);
    }, [setData]);

    const handleCheckout = useCallback((e) => {
        e.preventDefault();

        // Create FormData object
        const formData = new FormData();
        
        // Add all form fields
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('address', data.address);
        formData.append('city', data.city);
        formData.append('postal_code', data.postal_code);
        formData.append('delivery_area', data.delivery_area);
        formData.append('delivery_charge', data.delivery_charge);
        formData.append('notes', data.notes);
        formData.append('payment_method', data.payment_method);
        formData.append('subtotal', getCartTotal());
        formData.append('tax', 0);
        formData.append('total', calculateTotal);
        
        // Add cart items as JSON string
        const cartItemsData = cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || null,
            sku: item.sku || 'N/A'
        }));
        
        formData.append('cart_items', JSON.stringify(cartItemsData));
        
        axios.post('/guest-checkout', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        })
        .then(response => {
            if (response.data.redirect) {
                window.location.href = response.data.redirect;
            }
            setShowCartModal(false);
            reset();
            clearCart();
        })
        .catch(error => {
            console.log('Checkout errors:', error.response?.data?.errors || error);
        });
    }, [data, cartItems, getCartTotal, calculateTotal, reset, clearCart, setShowCartModal]);

    if (!showCartModal) return null;

    return (
        <>
            <div
                className="modal-backdrop fade show"
                style={{ zIndex: 1040 }}
                onClick={() => setShowCartModal(false)}
            />

            <div
                className="modal fade show"
                style={{ display: 'block', zIndex: 1050 }}
                tabIndex="-1"
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                        <div className="modal-header border-0" style={{
                            background: '#112066',
                        }}>
                            <h5 className="modal-title text-white fw-bold">
                                <i className="fas fa-lock me-2"></i>
                                Secure Checkout
                                {cartItems.length > 0 && (
                                    <span className="ms-2 badge bg-white text-dark rounded-pill px-3">
                                        {getCartCount()} {getCartCount() === 1 ? 'Item' : 'Items'}
                                    </span>
                                )}
                            </h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={() => setShowCartModal(false)}
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
                                        className="btn px-4 py-2 rounded-pill"
                                        style={{ background: '#112066', color: 'white', border: 'none' }}
                                        onClick={() => setShowCartModal(false)}
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="row">
                                    <div className="col-lg-5 mb-4 mb-lg-0">
                                        <h6 className="fw-bold mb-3" style={{ color: '#112066' }}>
                                            <i className="fas fa-shopping-cart me-2"></i>
                                            Your Items
                                        </h6>

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
                                                                <span className="fw-bold" style={{ color: '#112066' }}>
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

                                                                <span className="fw-bold" style={{ color: '#112066' }}>
                                                                    ${(item.price * item.quantity).toFixed(2)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-3 p-3" style={{
                                            background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
                                            borderRadius: '12px'
                                        }}>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Subtotal:</span>
                                                <span className="fw-bold">${getCartTotal().toFixed(2)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Delivery Charge:</span>
                                                <span className="fw-bold">${deliveryCharge.toFixed(2)}</span>
                                            </div>
                                            <hr className="my-2" />
                                            <div className="d-flex justify-content-between">
                                                <span className="fw-bold">Total:</span>
                                                <span className="h6 fw-bold" style={{ color: '#112066' }}>
                                                    ${calculateTotal.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-7">
                                        <h6 className="fw-bold mb-3" style={{ color: '#112066' }}>
                                            <i className="fas fa-user me-2"></i>
                                            Guest Checkout
                                        </h6>

                                        <form onSubmit={handleCheckout} id="checkout-form-modal">
                                            <div className="row">
                                                <div className="col-6">
                                                    <FormInput
                                                        type="text"
                                                        name="first_name"
                                                        label="First Name"
                                                        value={data.first_name}
                                                        onChange={handleInputChange('first_name')}
                                                        error={errors.first_name}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <FormInput
                                                        type="text"
                                                        name="last_name"
                                                        label="Last Name"
                                                        value={data.last_name}
                                                        onChange={handleInputChange('last_name')}
                                                        error={errors.last_name}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-6">
                                                    <FormInput
                                                        type="email"
                                                        name="email"
                                                        label="Email Address"
                                                        value={data.email}
                                                        onChange={handleInputChange('email')}
                                                        error={errors.email}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <FormInput
                                                        type="tel"
                                                        name="phone"
                                                        label="Phone Number"
                                                        value={data.phone}
                                                        onChange={handleInputChange('phone')}
                                                        error={errors.phone}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <FormInput
                                                type="text"
                                                name="address"
                                                label="Street Address"
                                                value={data.address}
                                                onChange={handleInputChange('address')}
                                                error={errors.address}
                                                required
                                            />

                                            <div className="row">
                                                <div className="col-md-6">
                                                    <FormInput
                                                        type="text"
                                                        name="city"
                                                        label="City"
                                                        value={data.city}
                                                        onChange={handleInputChange('city')}
                                                        error={errors.city}
                                                        required
                                                    />
                                                </div>
                                             
                                            </div>

                                            {/* Delivery Area Selection */}
                                            <div className="mb-4">
                                                <label className="form-label fw-semibold mb-2">
                                                    <i className="fas fa-truck me-2"></i>
                                                    Delivery Area <span className="text-danger">*</span>
                                                </label>
                                                <div className="delivery-options p-3 rounded d-flex " style={{ background: '#f8f9fa' }}>
                                                    <div className="form-check mb-3 me-2">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="delivery_area"
                                                            id="insideDhakaModal"
                                                            value="inside"
                                                            checked={deliveryArea === 'inside'}
                                                            onChange={handleDeliveryAreaChange}
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                        <label className="form-check-label ms-2" htmlFor="insideDhakaModal">
                                                            <strong>Inside Dhaka</strong>
                                                            <br />
                                                            <small className="text-muted">Delivery Charge: $50.00</small>
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="delivery_area"
                                                            id="outsideDhakaModal"
                                                            value="outside"
                                                            checked={deliveryArea === 'outside'}
                                                            onChange={handleDeliveryAreaChange}
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                        <label className="form-check-label ms-2" htmlFor="outsideDhakaModal">
                                                            <strong>Outside Dhaka</strong>
                                                            <br />
                                                            <small className="text-muted">Delivery Charge: $90.00</small>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <FormInput
                                                type="textarea"
                                                name="notes"
                                                label="Order Notes (Optional)"
                                                value={data.notes}
                                                onChange={handleInputChange('notes')}
                                                rows="2"
                                            />

                                            {/* Payment Method - Cash on Delivery Only */}
                                            <div className="mb-4">
                                                <label className="form-label fw-semibold mb-2">
                                                    <i className="fas fa-credit-card me-2"></i>
                                                    Payment Method <span className="text-danger">*</span>
                                                </label>
                                                <div className="payment-method-card p-3 rounded" style={{
                                                    background: '#f8f9fa',
                                                    border: '2px solid #e9ecef',
                                                    borderRadius: '10px'
                                                }}>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="payment_method"
                                                            id="cashOnDeliveryModal"
                                                            value="cash_on_delivery"
                                                            checked={data.payment_method === 'cash_on_delivery'}
                                                            onChange={handleInputChange('payment_method')}
                                                        />
                                                        <label className="form-check-label ms-2" htmlFor="cashOnDeliveryModal">
                                                            <div className="d-flex align-items-center">
                                                                <i className="fas fa-money-bill-wave fs-4 me-2" style={{ color: '#2ecc71' }}></i>
                                                                <div>
                                                                    <strong>Cash on Delivery</strong>
                                                                    <br />
                                                                    <small className="text-muted">Pay when you receive your order</small>
                                                                </div>
                                                            </div>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Desktop Button - Hidden on mobile */}
                                            <button
                                                type="submit"
                                                className="btn w-100 py-3 rounded-pill mt-3 desktop-place-order-btn"
                                                disabled={processing}
                                                style={{
                                                    background: '#112066',
                                                    color: 'white',
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
                                                        Place Order • ${calculateTotal.toFixed(2)}
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

                        {/* Modal Footer - Original buttons always visible */}
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
                                    className="btn rounded-pill px-4"
                                    onClick={() => setShowCartModal(false)}
                                    style={{ background: '#112066', color: 'white', border: 'none' }}
                                >
                                    <i className="fas fa-shopping-cart me-2"></i>
                                    View Full Cart
                                </Link>
                            )}
                        </div>

                        {/* Mobile Sticky Place Order Button in Footer */}
                        {isMobile && cartItems.length > 0 && (
                            <div className="mobile-sticky-order-btn">
                                <button
                                    type="submit"
                                    form="checkout-form-modal"
                                    className="mobile-place-order-btn"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-lock me-2"></i>
                                            Place Order • ${calculateTotal.toFixed(2)}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

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

                .form-control:focus {
                    border-color: #112066;
                    box-shadow: 0 0 0 2px rgba(99, 76, 159, 0.1);
                }

                .delivery-options .form-check {
                    padding: 8px;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }

                .delivery-options .form-check:hover {
                    background: white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .payment-method-card {
                    transition: all 0.3s ease;
                }

                .payment-method-card:hover {
                    border-color: #112066;
                    background: white;
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
                }

                .quantity-control button:hover {
                    background: #112066;
                    color: white;
                    border-color: #112066;
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

                /* Mobile Styles */
                @media (max-width: 767px) {
                    /* Hide desktop button on mobile */
                    .desktop-place-order-btn {
                        display: none !important;
                    }
                    
                    /* Add padding to modal body to prevent content hiding behind sticky button */
                    .modal-body {
                        padding-bottom: 80px !important;
                    }
                    
                    /* Make modal footer buttons smaller on mobile */
                    .modal-footer .btn {
                        padding: 8px 16px !important;
                        font-size: 13px !important;
                    }
                }
                
                /* Mobile Sticky Order Button in Footer */
                .mobile-sticky-order-btn {
                    position: sticky;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: white;
                    padding: 12px 16px;
                    border-top: 1px solid #e9ecef;
                    box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
                    z-index: 10;
                    display: none;
                }
                
                @media (max-width: 767px) {
                    .mobile-sticky-order-btn {
                        display: block;
                    }
                }
                
                .mobile-place-order-btn {
                    width: 100%;
                    background: #112066;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 14px 20px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                
                .mobile-place-order-btn:active {
                    transform: scale(0.98);
                    background: #0d1a52;
                }
                
                .mobile-place-order-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
            `}</style>
        </>
    );
}