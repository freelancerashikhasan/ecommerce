import React from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '../../Layout/MainLayout';
import { useCart } from '../../contexts/CartContext';

export default function Cart() {
    const { 
        cartItems, 
        removeFromCart, 
        updateQuantity,
        getCartTotal,
        clearCart 
    } = useCart();

    if (cartItems.length === 0) {
        return (
            <MainLayout>
                <div className="container my-5">
                    <div className="text-center py-5">
                        <i className="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
                        
                        <h3>Your cart is empty</h3>
                        <p className="text-muted">Looks like you haven't added any items to your cart yet.</p>
                        <Link href="/" className="btn btn-primary mt-3">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container my-5">
                <h2 className="mb-4">Shopping Cart</h2>
                
                <div className="row">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                {cartItems.map(item => (
                                    <div key={item.id} className="row mb-3 pb-3 border-bottom">
                                        <div className="col-md-2">
                                            <img 
                                                src={item.image} 
                                                alt={item.name}
                                                className="img-fluid"
                                            />
                                        </div>
                                        <div className="col-md-5">
                                            <h5>{item.name}</h5>
                                            <p className="text-muted">${item.price.toFixed(2)} each</p>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="input-group">
                                                <button 
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >-</button>
                                                <input 
                                                    type="number" 
                                                    className="form-control text-center"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                                    min="1"
                                                    max={item.maxQuantity}
                                                />
                                                <button 
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.maxQuantity}
                                                >+</button>
                                            </div>
                                        </div>
                                        <div className="col-md-2 text-end">
                                            <h5 className="text-primary">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </h5>
                                            <button 
                                                className="btn btn-sm btn-link text-danger"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Order Summary</h5>
                                <hr />
                                
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal:</span>
                                    <strong>${getCartTotal().toFixed(2)}</strong>
                                </div>
                                
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Shipping:</span>
                                    <span className="text-success">Free</span>
                                </div>
                                
                                <hr />
                                
                                <div className="d-flex justify-content-between mb-3">
                                    <h5>Total:</h5>
                                    <h5 className="text-primary">${getCartTotal().toFixed(2)}</h5>
                                </div>
                                
                                <button className="btn btn-primary w-100 mb-2">
                                    Proceed to Checkout
                                </button>
                                
                                <button 
                                    className="btn btn-outline-secondary w-100"
                                    onClick={clearCart}
                                >
                                    Clear Cart
                                </button>
                                
                                <Link href="/" className="btn btn-link w-100 mt-2">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}