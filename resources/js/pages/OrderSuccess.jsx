import React, { useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import MainLayout from '../Layout/MainLayout';

export default function OrderSuccess() {
    const { order } = usePage().props;

    useEffect(() => {
        // Track order success event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', {
                transaction_id: order.order_number,
                value: order.total,
                currency: 'USD',
                items: order.items.map(item => ({
                    id: item.product_id,
                    name: item.product_name,
                    price: item.unit_price,
                    quantity: item.quantity
                }))
            });
        }
    }, []);

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <MainLayout>
            <div className="container order-success my-3 my-md-5 px-3 px-md-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-8">
                        {/* Success Animation */}
                        <div className="text-center mb-3 mb-md-4">
                            <div className="success-animation">
                                <div className="checkmark-circle">
                                    <div className="checkmark draw"></div>
                                </div>
                            </div>
                            <h1 className="fw-bold mt-3 mb-2" style={{ color: '#2ecc71', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
                                Order Confirmed!
                            </h1>
                            <p className="text-muted fs-6 fs-md-5 px-2">
                                Thank you for your purchase. Your order has been successfully placed.
                            </p>
                        </div>

                        {/* Order Summary Card */}
                        <div className="card border-0 shadow-sm mb-3 mb-md-4" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                            <div className="card-header bg-white p-3 p-md-4 border-0">
                                <div className="row align-items-center g-2">
                                    <div className="col-12 col-md-6 text-center text-md-start">
                                        <h5 className="mb-0 fw-bold" style={{ color: '#634C9F', fontSize: 'clamp(1rem, 4vw, 1.25rem)' }}>
                                            <i className="fas fa-receipt me-2"></i>
                                            Order Summary
                                        </h5>
                                    </div>
                                    <div className="col-12 col-md-6 text-center text-md-end">
                                        <span className="badge px-3 py-2" style={{ background: '#2ecc71', color: 'white', fontSize: '0.85rem' }}>
                                            <i className="fas fa-check-circle me-1"></i>
                                            Confirmed
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="card-body p-3 p-md-4">
                                {/* Order Info - Responsive Grid */}
                                <div className="row g-3 mb-4">
                                    <div className="col-12 col-sm-6">
                                        <div className="info-card p-3 rounded h-100" style={{ background: '#f8f9fa' }}>
                                            <p className="text-muted mb-1 small">Order Number</p>
                                            <h5 className="fw-bold mb-0" style={{ color: '#634C9F', fontSize: 'clamp(0.9rem, 4vw, 1.25rem)', wordBreak: 'break-all' }}>
                                                #{order.order_number}
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <div className="info-card p-3 rounded h-100" style={{ background: '#f8f9fa' }}>
                                            <p className="text-muted mb-1 small">Order Date</p>
                                            <h5 className="fw-bold mb-0" style={{ fontSize: 'clamp(0.85rem, 3.5vw, 1.1rem)' }}>
                                                {formatDate(order.order_date)}
                                            </h5>
                                        </div>
                                    </div>
                                </div>

                                {/* Tracking & Total - Responsive */}
                                <div className="row g-3 mb-4">
                                    <div className="col-12 col-md-6">
                                        <div className="info-card p-3 rounded h-100" style={{ background: '#f8f9fa' }}>
                                            <p className="text-muted mb-2 small">Tracking Status</p>
                                            <div className="tracking-steps">
                                                <div className="d-flex justify-content-between">
                                                    <div className="text-center" style={{ flex: 1 }}>
                                                        <div className="step-circle active mx-auto">1</div>
                                                        <small className="d-none d-sm-block">Order Placed</small>
                                                        <small className="d-sm-none" style={{ fontSize: '0.7rem' }}>Placed</small>
                                                    </div>
                                                    <div className="text-center" style={{ flex: 1 }}>
                                                        <div className="step-circle mx-auto">2</div>
                                                        <small className="d-none d-sm-block">Processing</small>
                                                        <small className="d-sm-none" style={{ fontSize: '0.7rem' }}>Process</small>
                                                    </div>
                                                    <div className="text-center" style={{ flex: 1 }}>
                                                        <div className="step-circle mx-auto">3</div>
                                                        <small className="d-none d-sm-block">Shipped</small>
                                                        <small className="d-sm-none" style={{ fontSize: '0.7rem' }}>Ship</small>
                                                    </div>
                                                    <div className="text-center" style={{ flex: 1 }}>
                                                        <div className="step-circle mx-auto">4</div>
                                                        <small className="d-none d-sm-block">Delivered</small>
                                                        <small className="d-sm-none" style={{ fontSize: '0.7rem' }}>Deliver</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="info-card p-3 rounded h-100" style={{ background: '#f8f9fa' }}>
                                            <p className="text-muted mb-1 small">Total Amount</p>
                                            <h3 className="fw-bold mb-0" style={{ color: '#634C9F', fontSize: 'clamp(1.5rem, 6vw, 2rem)' }}>
                                                ${parseFloat(order.total).toFixed(2)}
                                            </h3>
                                            <small className="text-muted">Including delivery charge</small>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Info - Responsive */}
                                <div className="mb-4">
                                    <h6 className="fw-bold mb-3" style={{ color: '#634C9F', fontSize: 'clamp(0.95rem, 4vw, 1.1rem)' }}>
                                        <i className="fas fa-user me-2"></i>
                                        Customer Information
                                    </h6>
                                    <div className="row g-3">
                                        <div className="col-12 col-md-6">
                                            <div className="bg-light p-3 rounded h-100">
                                                <p className="mb-2"><strong>Name:</strong> <span className="text-break">{order.customer_name}</span></p>
                                                <p className="mb-2"><strong>Email:</strong> <span className="text-break">{order.customer_email}</span></p>
                                                <p className="mb-0"><strong>Phone:</strong> {order.customer_phone}</p>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <div className="bg-light p-3 rounded h-100">
                                                <p className="mb-2"><strong>Delivery Address:</strong></p>
                                                <p className="text-muted mb-2 small text-break">{order.shipping_address}</p>
                                                <p className="mb-0"><strong>Delivery Area:</strong> {order.metadata?.delivery_area === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items - Responsive Table */}
                                <div className="mb-4">
                                    <h6 className="fw-bold mb-3" style={{ color: '#634C9F' }}>
                                        <i className="fas fa-shopping-cart me-2"></i>
                                        Order Items
                                    </h6>
                                    
                                    {/* Desktop Table View */}
                                    <div className="table-responsive d-none d-md-block">
                                        <table className="table table-borderless">
                                            <thead style={{ borderBottom: '2px solid #e9ecef' }}>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Quantity</th>
                                                    <th className="text-end">Price</th>
                                                    <th className="text-end">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.items.map((item, index) => (
                                                    <tr key={index} style={{ borderBottom: '1px solid #e9ecef' }}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                {item.product_image && (
                                                                    <img 
                                                                        src={item.product_image} 
                                                                        alt={item.product_name}
                                                                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                                                                        className="me-3"
                                                                    />
                                                                )}
                                                                <div>
                                                                    <strong className="text-break">{item.product_name}</strong>
                                                                    {item.attributes && (
                                                                        <><br /><small className="text-muted">{JSON.stringify(item.attributes)}</small></>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{item.quantity}</td>
                                                        <td className="text-end">${parseFloat(item.unit_price).toFixed(2)}</td>
                                                        <td className="text-end">${parseFloat(item.total_price).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colSpan="3" className="text-end"><strong>Subtotal:</strong></td>
                                                    <td className="text-end">${parseFloat(order.subtotal).toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="3" className="text-end"><strong>Delivery Charge:</strong></td>
                                                    <td className="text-end">${parseFloat(order.shipping_cost).toFixed(2)}</td>
                                                </tr>
                                                {order.discount > 0 && (
                                                    <tr>
                                                        <td colSpan="3" className="text-end"><strong>Discount:</strong></td>
                                                        <td className="text-end text-danger">-${parseFloat(order.discount).toFixed(2)}</td>
                                                    </tr>
                                                )}
                                                <tr style={{ borderTop: '2px solid #634C9F' }}>
                                                    <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                                                    <td className="text-end"><strong className="fs-5" style={{ color: '#634C9F' }}>${parseFloat(order.total).toFixed(2)}</strong></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>

                                    {/* Mobile Card View */}
                                    <div className="d-md-none">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="card mb-3 border-0 shadow-sm">
                                                <div className="card-body p-3">
                                                    <div className="d-flex mb-3">
                                                        {item.product_image && (
                                                            <img 
                                                                src={item.product_image} 
                                                                alt={item.product_name}
                                                                style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }}
                                                                className="me-3"
                                                            />
                                                        )}
                                                        <div className="flex-grow-1">
                                                            <h6 className="fw-bold mb-1 text-break">{item.product_name}</h6>
                                                            {item.attributes && (
                                                                <small className="text-muted d-block mb-2">{JSON.stringify(item.attributes)}</small>
                                                            )}
                                                            <div className="d-flex justify-content-between align-items-center mt-2">
                                                                <span className="text-muted">Qty: {item.quantity}</span>
                                                                <span className="fw-bold">${parseFloat(item.total_price).toFixed(2)}</span>
                                                            </div>
                                                            <div className="text-muted small mt-1">
                                                                ${parseFloat(item.unit_price).toFixed(2)} each
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {/* Mobile Totals */}
                                        <div className="bg-light p-3 rounded mt-3">
                                            <div className="d-flex justify-content-between mb-2">
                                                <span>Subtotal:</span>
                                                <span>${parseFloat(order.subtotal).toFixed(2)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span>Delivery Charge:</span>
                                                <span>${parseFloat(order.shipping_cost).toFixed(2)}</span>
                                            </div>
                                            {order.discount > 0 && (
                                                <div className="d-flex justify-content-between mb-2 text-danger">
                                                    <span>Discount:</span>
                                                    <span>-${parseFloat(order.discount).toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="d-flex justify-content-between pt-2 mt-2 border-top border-2" style={{ borderColor: '#634C9F' }}>
                                                <strong className="fs-5">Total:</strong>
                                                <strong className="fs-5" style={{ color: '#634C9F' }}>${parseFloat(order.total).toFixed(2)}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Info - Responsive */}
                                <div className="alert alert-success p-3 p-md-4">
                                    <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
                                        <i className="fas fa-money-bill-wave fs-1 fs-sm-3 text-center text-sm-start"></i>
                                        <div className="text-center text-sm-start">
                                            <strong>Payment Method: Cash on Delivery</strong>
                                            <p className="mb-0 small mt-1">Please prepare exact change when receiving your order.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons - Responsive */}
                                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mt-4">
                                    <button 
                                        className="btn rounded-pill px-4 py-2 w-100 w-sm-auto"
                                        style={{ background: '#634C9F', color: 'white' }}
                                        onClick={() => window.print()}
                                    >
                                        <i className="fas fa-print me-2"></i>
                                        Print Invoice
                                    </button>
                                    <Link 
                                        href="/" 
                                        className="btn btn-outline-secondary rounded-pill px-4 py-2 w-100 w-sm-auto text-center"
                                    >
                                        <i className="fas fa-shopping-bag me-2"></i>
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info - Responsive */}
                        <div className="text-center px-2">
                            <p className="text-muted small mb-0">
                                <i className="fas fa-envelope me-1"></i>
                                A confirmation email has been sent to your email address.
                            </p>
                            <p className="text-muted small mt-1">
                                <i className="fas fa-phone-alt me-1"></i>
                                For any questions, please contact our support team.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .order-success {
                    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                }

                /* Success Animation */
                .success-animation {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .checkmark-circle {
                    width: clamp(60px, 15vw, 80px);
                    height: clamp(60px, 15vw, 80px);
                    background: #2ecc71;
                    border-radius: 50%;
                    display: inline-block;
                    position: relative;
                }

                .checkmark {
                    width: clamp(30px, 8vw, 40px);
                    height: clamp(15px, 4vw, 20px);
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -60%) rotate(-45deg);
                }

                .checkmark.draw {
                    animation: draw 0.5s ease-in-out forwards;
                }

                .checkmark:before,
                .checkmark:after {
                    content: '';
                    position: absolute;
                    background: white;
                    border-radius: 2px;
                }

                .checkmark:before {
                    width: 3px;
                    height: clamp(15px, 4vw, 20px);
                    left: 0;
                    top: 0;
                }

                .checkmark:after {
                    width: clamp(30px, 8vw, 40px);
                    height: 3px;
                    left: 0;
                    top: clamp(12px, 3vw, 17px);
                }

                @keyframes draw {
                    0% {
                        opacity: 0;
                        transform: translate(-50%, -60%) rotate(-45deg) scale(0);
                    }
                    100% {
                        opacity: 1;
                        transform: translate(-50%, -60%) rotate(-45deg) scale(1);
                    }
                }

                /* Tracking Steps */
                .step-circle {
                    width: clamp(25px, 7vw, 30px);
                    height: clamp(25px, 7vw, 30px);
                    background: #e9ecef;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 5px;
                    font-size: clamp(10px, 3vw, 12px);
                    font-weight: bold;
                    color: #6c757d;
                }

                .step-circle.active {
                    background: #634C9F;
                    color: white;
                }

                /* Info Cards */
                .info-card {
                    transition: all 0.3s ease;
                }

                .info-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }

                /* Responsive Table */
                @media (max-width: 767px) {
                    .table-responsive {
                        border: 0;
                    }
                }

                /* Print Styles */
                @media print {
                    .order-success .btn,
                    .order-success .alert-success,
                    .order-success .text-center:last-child,
                    .order-success button,
                    .order-success a.btn {
                        display: none !important;
                    }
                    
                    .card {
                        box-shadow: none !important;
                        border: 1px solid #ddd !important;
                    }
                    
                    .info-card {
                        break-inside: avoid;
                    }
                    
                    .order-success {
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                }

                /* Touch-friendly buttons for mobile */
                @media (max-width: 576px) {
                    .btn {
                        padding: 0.6rem 1rem !important;
                        font-size: 0.9rem;
                    }
                    
                    .step-circle {
                        cursor: default;
                    }
                }
            `}</style>
        </MainLayout>
    );
}