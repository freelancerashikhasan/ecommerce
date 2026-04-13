import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useForm } from '@inertiajs/react';
import MainLayout from '../../Layout/MainLayout';
import { useCart } from '../../contexts/CartContext';
import axios from 'axios';

// Move FormInput component outside of the main component to prevent re-renders
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

export default function Cart() {
    const { 
        cartItems, 
        removeFromCart, 
        updateQuantity,
        getCartTotal,
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
        
        // Add padding to body when mobile to account for fixed button
        if (isMobile) {
            document.body.style.paddingBottom = '80px';
        } else {
            document.body.style.paddingBottom = '0';
        }
        
        return () => {
            window.removeEventListener('resize', checkScreenSize);
            document.body.style.paddingBottom = '0';
        };
    }, [isMobile]);

    // Memoize the total calculation to prevent unnecessary recalculations
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
        
        // Use axios or fetch directly to avoid Inertia's transformation issues
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
            reset();
            clearCart();
        })
        .catch(error => {
            console.log('Checkout errors:', error.response?.data?.errors || error);
        });
    }, [data, cartItems, getCartTotal, calculateTotal, reset, clearCart]);

    // Memoize the input change handlers to prevent re-renders
    const handleInputChange = useCallback((field) => (e) => {
        setData(field, e.target.value);
    }, [setData]);

    if (cartItems.length === 0) {
        return (
            <MainLayout>
                <div className="container my-5">
                    <div className="text-center py-5">
                        <i className="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
                        <h3>Your cart is empty</h3>
                        <p className="text-muted">Looks like you haven't added any items to your cart yet.</p>
                        <Link href="/" className="btn mt-3" style={{ background: '#112066', color: 'white' }}>
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container cart-section my-3 my-md-5">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4">
                    <h2 className="fw-bold mb-3 mb-sm-0" style={{ color: '#112066', fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>
                        <i className="fas fa-shopping-cart me-2"></i>
                        Shopping Cart
                    </h2>
                    <span className="badge align-self-start align-self-sm-auto" style={{ background: '#112066', color: 'white', padding: '8px 15px' }}>
                        {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                    </span>
                </div>
                
                <div className="row">
                    <div className="col-lg-7 mb-4 mb-lg-0">
                        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                            <div className="card-body p-3 p-md-4">
                                <h6 className="fw-bold mb-3" style={{ color: '#112066' }}>
                                    <i className="fas fa-shopping-cart me-2"></i>
                                    Your Items
                                </h6>
                                
                                {cartItems.map((item, index) => (
                                    <div 
                                        key={item.id} 
                                        className="cart-item-row mb-4 pb-4 border-bottom"
                                        style={{ animation: `slideIn 0.3s ease ${index * 0.1}s` }}
                                    >
                                        <div className="row align-items-center">
                                            <div className="col-4 col-md-2 mb-3 mb-md-0">
                                                <div className="cart-item-image" style={{ position: 'relative' }}>
                                                    <img 
                                                        src={item.image || 'https://via.placeholder.com/80'}
                                                        alt={item.name}
                                                        className="img-fluid rounded w-100"
                                                        style={{
                                                            borderRadius: '12px',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                            maxHeight: '100px',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-8 col-md-4 mb-3 mb-md-0">
                                                <h5 className="fw-bold mb-2" style={{ fontSize: 'clamp(0.9rem, 4vw, 1rem)' }}>{item.name}</h5>
                                                <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                                                    <span className="fw-bold" style={{ color: '#112066' }}>${item.price}</span> each
                                                </p>
                                            </div>
                                            <div className="col-12 col-md-3 mb-3 mb-md-0">
                                                <div className="quantity-control d-flex align-items-center justify-content-start justify-content-md-center">
                                                    <button 
                                                        className="btn btn-sm rounded-circle"
                                                        style={{ 
                                                            width: 'clamp(28px, 6vw, 32px)', 
                                                            height: 'clamp(28px, 6vw, 32px)', 
                                                            padding: 0,
                                                            border: '2px solid #112066',
                                                            background: 'white',
                                                            color: '#112066'
                                                        }}
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    >
                                                        <i className="fas fa-minus"></i>
                                                    </button>
                                                    <input 
                                                        type="number" 
                                                        className="form-control text-center mx-2"
                                                        style={{ 
                                                            width: 'clamp(50px, 15vw, 60px)',
                                                            borderRadius: '8px',
                                                            border: '2px solid #e1e1e1',
                                                            fontWeight: 'bold'
                                                        }}
                                                        value={item.quantity}
                                                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                                        min="1"
                                                    />
                                                    <button 
                                                        className="btn btn-sm rounded-circle"
                                                        style={{ 
                                                            width: 'clamp(28px, 6vw, 32px)', 
                                                            height: 'clamp(28px, 6vw, 32px)', 
                                                            padding: 0,
                                                            border: '2px solid #112066',
                                                            background: 'white',
                                                            color: '#112066'
                                                        }}
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        <i className="fas fa-plus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-8 col-md-2">
                                                <h5 className="fw-bold mb-0" style={{ color: '#112066', fontSize: 'clamp(0.9rem, 4vw, 1rem)' }}>
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </h5>
                                            </div>
                                            <div className="col-4 col-md-1 text-end">
                                                <button 
                                                    className="btn btn-link text-danger p-0"
                                                    onClick={() => removeFromCart(item.id)}
                                                    style={{ fontSize: '1.2rem' }}
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
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
                                
                                <div className="d-flex flex-column flex-sm-row gap-2 mt-3">
                                    <button 
                                        className="btn btn-outline-secondary rounded-pill px-4"
                                        onClick={clearCart}
                                    >
                                        <i className="fas fa-trash-alt me-2"></i>
                                        Clear Cart
                                    </button>
                                    <Link href="/" className="btn btn-outline-secondary rounded-pill px-4 text-center">
                                        <i className="fas fa-arrow-left me-2"></i>
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-lg-5">
                        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', position: 'sticky', top: '20px' }}>
                            <div className="card-body p-3 p-md-4">
                                <h5 className="card-title fw-bold mb-3" style={{ color: '#112066' }}>
                                    <i className="fas fa-user me-2"></i>
                                    Checkout Information
                                </h5>
                                
                                <form onSubmit={handleCheckout}>
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
                                        <div className="col-12 col-sm-6">
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
                                        <div className="delivery-options p-3 rounded d-flex" style={{ background: '#f8f9fa' }}>
                                            <div className="form-check mb-3 me-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="delivery_area"
                                                    id="insideDhaka"
                                                    value="inside"
                                                    checked={deliveryArea === 'inside'}
                                                    onChange={handleDeliveryAreaChange}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <label className="form-check-label ms-2" htmlFor="insideDhaka">
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
                                                    id="outsideDhaka"
                                                    value="outside"
                                                    checked={deliveryArea === 'outside'}
                                                    onChange={handleDeliveryAreaChange}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <label className="form-check-label ms-2" htmlFor="outsideDhaka">
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
                                                    id="cashOnDelivery"
                                                    value="cash_on_delivery"
                                                    checked={data.payment_method === 'cash_on_delivery'}
                                                    onChange={handleInputChange('payment_method')}
                                                />
                                                <label className="form-check-label ms-2" htmlFor="cashOnDelivery">
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
                                            <div className="alert alert-info mt-3 mb-0 small">
                                                <i className="fas fa-info-circle me-1"></i>
                                                Cash on Delivery is the only available payment method. Please prepare exact change when receiving your order.
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop Button - Hidden on mobile */}
                                    <button
                                        type="submit"
                                        className="btn w-100 py-3 rounded-pill mt-3 d-none d-sm-block"
                                        disabled={processing}
                                        style={{
                                            background: '#112066',
                                            color: 'white',
                                            border: 'none',
                                            fontSize: 'clamp(1rem, 4vw, 1.1rem)',
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

                                    <p className="text-center text-muted small mt-3 d-none d-sm-block">
                                        <i className="fas fa-shield-alt me-1"></i>
                                        Your information is secure and encrypted
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Fixed Bottom Button */}
            {isMobile && (
                <div className="mobile-fixed-bottom">
                    <div className="mobile-order-summary">
                        <div className="total-amount">
                            <span>Total:</span>
                            <strong>${calculateTotal.toFixed(2)}</strong>
                        </div>
                        <button
                            type="submit"
                            className="mobile-place-order-btn"
                            onClick={handleCheckout}
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
                                    Place Order
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                .cart-section {
                    font-family: Inter;
                }
                
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .cart-item-image img {
                    transition: transform 0.3s ease;
                }

                .cart-item-image img:hover {
                    transform: scale(1.05);
                }

                .quantity-control button {
                    transition: all 0.3s ease;
                }

                .quantity-control button:hover {
                    background: #112066;
                    color: white;
                }

                .quantity-control input:focus {
                    border-color: #112066;
                    outline: none;
                    box-shadow: 0 0 0 2px rgba(99, 76, 159, 0.1);
                }

                /* Remove number input arrows */
                .quantity-control input::-webkit-inner-spin-button,
                .quantity-control input::-webkit-outer-spin-button {
                    opacity: 0.5;
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

                /* Mobile Fixed Bottom Button */
                .mobile-fixed-bottom {
                    position: fixed;
                    bottom: 55px;
                    left: 0;
                    right: 0;
                    background: white;
                    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
                    z-index: 1000;
                    padding: 12px 16px;
                    animation: slideUp 0.3s ease;
                }
                
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }
                
                .mobile-order-summary {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                }
                
                .total-amount {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                
                .total-amount span {
                    font-size: 12px;
                    color: #6c757d;
                }
                
                .total-amount strong {
                    font-size: 20px;
                    font-weight: bold;
                    color: #112066;
                }
                
                .mobile-place-order-btn {
                    flex: 1;
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
                    background: #4a3a7a;
                }
                
                .mobile-place-order-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                /* Mobile Responsive Styles */
                @media (max-width: 767.98px) {
                    .cart-section {
                        padding: 0 12px;
                        margin-bottom: 80px !important;
                    }
                    
                    .cart-item-image {
                        margin-bottom: 0;
                    }
                    
                    .cart-item-image img {
                        width: 100%;
                        max-height: 80px;
                        object-fit: cover;
                    }
                    
                    .quantity-control {
                        margin-top: 0;
                        justify-content: flex-start;
                    }
                    
                    .cart-item-row {
                        padding-bottom: 15px;
                        margin-bottom: 15px;
                    }
                    
                    .card-body {
                        padding: 1rem !important;
                    }
                    
                    .btn-outline-secondary {
                        width: 100%;
                        text-align: center;
                    }
                }
                
                /* Tablet (768px - 1024px) */
                @media (min-width: 768px) and (max-width: 1024px) {
                    .cart-section {
                        padding: 0 15px;
                    }
                    
                    .cart-item-image img {
                        max-height: 80px;
                    }
                    
                    .quantity-control {
                        justify-content: center;
                    }
                }
                
                /* Small Mobile (up to 480px) */
                @media (max-width: 480px) {
                    .cart-section h2 {
                        font-size: 1.3rem !important;
                    }
                    
                    .badge {
                        font-size: 0.8rem !important;
                        padding: 5px 12px !important;
                    }
                    
                    .cart-item-row h5 {
                        font-size: 0.85rem !important;
                    }
                    
                    .cart-item-row p {
                        font-size: 0.75rem !important;
                    }
                    
                    .cart-item-row .fw-bold {
                        font-size: 0.85rem !important;
                    }
                    
                    .quantity-control button {
                        width: 28px !important;
                        height: 28px !important;
                    }
                    
                    .quantity-control input {
                        width: 50px !important;
                    }
                    
                    .mobile-order-summary {
                        gap: 8px;
                    }
                    
                    .total-amount strong {
                        font-size: 18px;
                    }
                    
                    .mobile-place-order-btn {
                        padding: 12px 16px;
                        font-size: 14px;
                    }
                }
                
                /* Landscape mode for mobile */
                @media (max-width: 767px) and (orientation: landscape) {
                    .cart-item-image img {
                        max-height: 60px;
                    }
                    
                    .cart-item-row h5 {
                        font-size: 0.8rem;
                    }
                    
                    .quantity-control button {
                        width: 28px;
                        height: 28px;
                    }
                    
                    .mobile-fixed-bottom {
                        padding: 8px 16px;
                    }
                    
                    .mobile-place-order-btn {
                        padding: 10px 16px;
                    }
                }
                
                /* Ensure proper spacing for sticky element on mobile */
                @media (max-width: 991px) {
                    .col-lg-5 .card {
                        position: relative !important;
                        top: 0 !important;
                        margin-top: 20px;
                    }
                }
                
                /* Improve touch targets on mobile */
                @media (max-width: 767px) {
                    button,
                    .btn,
                    .form-check-input,
                    .cart-item-image {
                        cursor: pointer !important;
                        -webkit-tap-highlight-color: transparent !important;
                    }
                    
                    button:active,
                    .btn:active {
                        opacity: 0.8 !important;
                        transform: scale(0.98) !important;
                    }
                    
                    .quantity-control button:active {
                        transform: scale(0.95) !important;
                    }
                }
                
                /* Responsive form inputs */
                @media (max-width: 576px) {
                    .form-control {
                        font-size: 0.85rem !important;
                        padding: 0.6rem 0.75rem !important;
                    }
                    
                    .form-label {
                        font-size: 0.85rem !important;
                    }
                    
                    .alert-info {
                        font-size: 0.7rem !important;
                    }
                }
            `}</style>
        </MainLayout>
    );
}