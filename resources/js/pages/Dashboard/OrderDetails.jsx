import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import DashboardLayout from '../../Layout/DashboardLayout';

export default function OrderDetails({ order }) {
    const [showFullHistory, setShowFullHistory] = useState(false);

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'warning',
            processing: 'info',
            confirmed: 'primary',
            shipped: 'info',
            delivered: 'success',
            cancelled: 'danger',
            returned: 'secondary'
        };
        return badges[status] || 'secondary';
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: '#ffc107',
            processing: '#17a2b8',
            confirmed: '#007bff',
            shipped: '#17a2b8',
            delivered: '#28a745',
            cancelled: '#dc3545',
            returned: '#6c757d'
        };
        return colors[status] || '#6c757d';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTrackingSteps = () => {
        const steps = [
            { status: 'pending', label: 'Order Placed', icon: 'fas fa-check-circle' },
            { status: 'processing', label: 'Processing', icon: 'fas fa-cog' },
            { status: 'confirmed', label: 'Confirmed', icon: 'fas fa-check-double' },
            { status: 'shipped', label: 'Shipped', icon: 'fas fa-truck' },
            { status: 'delivered', label: 'Delivered', icon: 'fas fa-home' }
        ];
        
        const currentIndex = steps.findIndex(step => step.status === order.order_status);
        
        return steps.map((step, index) => ({
            ...step,
            completed: index <= currentIndex,
            active: index === currentIndex
        }));
    };

    const trackingSteps = getTrackingSteps();

    return (
        <DashboardLayout>
            <div className="order-details-page">
                {/* Header with Back Button */}
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
                    <h3 className="mb-0">Order Details</h3>
                    <Link href="/orders" className="btn btn-outline-secondary btn-sm">
                        <i className="fas fa-arrow-left me-2"></i> Back to Orders
                    </Link>
                </div>

                {/* Order Header - Responsive Grid */}
                <div className="order-header mb-4 p-3 p-md-4 bg-light rounded">
                    <div className="row g-3">
                        <div className="col-6 col-md-3">
                            <small className="text-muted">Order Number</small>
                            <h6 className="mb-0">#{order.order_number}</h6>
                        </div>
                        <div className="col-6 col-md-3">
                            <small className="text-muted">Order Date</small>
                            <h6 className="mb-0">{formatDate(order.order_date)}</h6>
                        </div>
                        <div className="col-6 col-md-3">
                            <small className="text-muted">Order Status</small>
                            <div className="mb-0">
                                <span className={`badge bg-${getStatusBadge(order.order_status)}`}>
                                    {order.order_status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <small className="text-muted">Total Amount</small>
                            <h6 className="mb-0 text-primary">${parseFloat(order.total).toFixed(2)}</h6>
                        </div>
                    </div>
                </div>

                {/* Tracking Timeline - Responsive */}
                <div className="tracking-timeline mb-4 p-3 p-md-4 border rounded">
                    <h5 className="mb-4">Order Tracking</h5>
                    
                    {/* Desktop Timeline */}
                    <div className="steps-container d-none d-md-flex">
                        {trackingSteps.map((step, index) => (
                            <div key={step.status} className={`step ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
                                <div className="step-icon">
                                    <i className={step.icon}></i>
                                </div>
                                <div className="step-label">{step.label}</div>
                                {index < trackingSteps.length - 1 && <div className="step-line"></div>}
                            </div>
                        ))}
                    </div>

                    {/* Mobile Timeline - Vertical */}
                    <div className="mobile-timeline d-block d-md-none">
                        {trackingSteps.map((step, index) => (
                            <div key={step.status} className={`mobile-step ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
                                <div className="mobile-step-icon">
                                    <i className={step.icon}></i>
                                </div>
                                <div className="mobile-step-content">
                                    <div className="mobile-step-label">{step.label}</div>
                                    <div className="mobile-step-status">
                                        {step.completed ? 'Completed' : step.active ? 'In Progress' : 'Pending'}
                                    </div>
                                </div>
                                {index < trackingSteps.length - 1 && <div className="mobile-step-line"></div>}
                            </div>
                        ))}
                    </div>
                    
                    {/* Tracking History */}
                    {order.tracking_history && order.tracking_history.length > 0 && (
                        <div className="tracking-history mt-4">
                            <h6 className="mb-3">Tracking History</h6>
                            <div className="timeline">
                                {(showFullHistory ? order.tracking_history : order.tracking_history.slice(0, 3)).map((track, idx) => (
                                    <div key={idx} className="timeline-item mb-3">
                                        <div className="d-flex flex-column flex-sm-row">
                                            <div className="timeline-badge me-3">
                                                <i className="fas fa-circle" style={{ fontSize: '12px', color: '#112066' }}></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-start">
                                                    <strong className="mb-1 mb-sm-0">{track.status.toUpperCase()}</strong>
                                                    <small className="text-muted">{formatDate(track.created_at)}</small>
                                                </div>
                                                <p className="mb-0 mt-1">{track.description}</p>
                                                {track.location && (
                                                    <small className="text-muted d-block mt-1">
                                                        <i className="fas fa-map-marker-alt me-1"></i> {track.location}
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {order.tracking_history.length > 3 && (
                                    <button 
                                        className="btn btn-link btn-sm mt-2"
                                        onClick={() => setShowFullHistory(!showFullHistory)}
                                    >
                                        {showFullHistory ? 'Show Less' : `Show ${order.tracking_history.length - 3} More`}
                                        <i className={`fas fa-chevron-${showFullHistory ? 'up' : 'down'} ms-1`}></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="row g-3 g-md-4">
                    {/* Order Items */}
                    <div className="col-lg-8 mb-4">
                        <div className="card h-100">
                            <div className="card-header">
                                <h5 className="mb-0">Order Items</h5>
                            </div>
                            <div className="card-body p-0">
                                {/* Desktop Table View */}
                                <div className="desktop-table-view d-none d-md-block">
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>SKU</th>
                                                    <th>Quantity</th>
                                                    <th>Unit Price</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                {item.product_image && (
                                                                    <img 
                                                                        src={`${item.product_image}`}
                                                                        alt={item.product_name}
                                                                        className="me-3 rounded"
                                                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                                    />
                                                                )}
                                                                <div>
                                                                    <strong>{item.product_name}</strong>
                                                                    {item.attributes && Object.keys(item.attributes).length > 0 && (
                                                                        <>
                                                                            <br />
                                                                            <small className="text-muted">
                                                                                {Object.entries(item.attributes).map(([key, val]) => `${key}: ${val}`).join(', ')}
                                                                            </small>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{item.product_sku || 'N/A'}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>${parseFloat(item.unit_price).toFixed(2)}</td>
                                                        <td>${parseFloat(item.total_price).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="table-light">
                                                <tr>
                                                    <td colSpan="4" className="text-end"><strong>Subtotal:</strong></td>
                                                    <td><strong>${parseFloat(order.subtotal).toFixed(2)}</strong></td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="4" className="text-end"><strong>Delivery Charge:</strong></td>
                                                    <td>${parseFloat(order.shipping_cost).toFixed(2)}</td>
                                                </tr>
                                                {order.discount > 0 && (
                                                    <tr>
                                                        <td colSpan="4" className="text-end"><strong>Discount:</strong></td>
                                                        <td className="text-danger">-${parseFloat(order.discount).toFixed(2)}</td>
                                                    </tr>
                                                )}
                                                {order.tax > 0 && (
                                                    <tr>
                                                        <td colSpan="4" className="text-end"><strong>Tax:</strong></td>
                                                        <td>${parseFloat(order.tax).toFixed(2)}</td>
                                                    </tr>
                                                )}
                                                <tr className="table-active">
                                                    <td colSpan="4" className="text-end"><strong>Total:</strong></td>
                                                    <td><strong>${parseFloat(order.total).toFixed(2)}</strong></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>

                                {/* Mobile Card View for Items */}
                                <div className="mobile-items-view d-block d-md-none">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="item-card p-3 border-bottom">
                                            <div className="d-flex gap-3">
                                                {item.product_image && (
                                                    <img 
                                                        src={`${item.product_image}`}
                                                        alt={item.product_name}
                                                        className="rounded"
                                                        style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                                                    />
                                                )}
                                                <div className="flex-grow-1">
                                                    <strong className="d-block mb-1">{item.product_name}</strong>
                                                    <small className="text-muted d-block">SKU: {item.product_sku || 'N/A'}</small>
                                                    {item.attributes && Object.keys(item.attributes).length > 0 && (
                                                        <small className="text-muted d-block">
                                                            {Object.entries(item.attributes).map(([key, val]) => `${key}: ${val}`).join(', ')}
                                                        </small>
                                                    )}
                                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                                        <span>Qty: {item.quantity}</span>
                                                        <span>${parseFloat(item.unit_price).toFixed(2)} each</span>
                                                        <strong>${parseFloat(item.total_price).toFixed(2)}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {/* Mobile Totals */}
                                    <div className="totals-card p-3 bg-light">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Subtotal:</span>
                                            <strong>${parseFloat(order.subtotal).toFixed(2)}</strong>
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
                                        {order.tax > 0 && (
                                            <div className="d-flex justify-content-between mb-2">
                                                <span>Tax:</span>
                                                <span>${parseFloat(order.tax).toFixed(2)}</span>
                                            </div>
                                        )}
                                        <hr className="my-2" />
                                        <div className="d-flex justify-content-between">
                                            <strong>Total:</strong>
                                            <strong className="text-primary">${parseFloat(order.total).toFixed(2)}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Information - Responsive Grid */}
                    <div className="col-lg-4">
                        <div className="row g-3">
                            {/* Customer Information */}
                            <div className="col-12">
                                <div className="card h-100">
                                    <div className="card-header">
                                        <h5 className="mb-0">Customer Information</h5>
                                    </div>
                                    <div className="card-body">
                                        <p className="mb-2"><strong>Name:</strong> {order.customer_name}</p>
                                        <p className="mb-2"><strong>Phone:</strong> {order.customer_phone}</p>
                                        <p className="mb-0"><strong>Email:</strong> {order.customer_email || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="col-12">
                                <div className="card h-100">
                                    <div className="card-header">
                                        <h5 className="mb-0">Shipping Address</h5>
                                    </div>
                                    <div className="card-body">
                                        <p className="mb-1">{order.shipping_address}</p>
                                        <p className="mb-1">{order.city}, {order.state} {order.zip_code}</p>
                                        <p className="mb-0">{order.country}</p>
                                        {order.metadata?.delivery_area && (
                                            <p className="mb-0 mt-2">
                                                <strong>Delivery Area:</strong> {order.metadata.delivery_area === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="col-12">
                                <div className="card h-100">
                                    <div className="card-header">
                                        <h5 className="mb-0">Payment Information</h5>
                                    </div>
                                    <div className="card-body">
                                        <p className="mb-2"><strong>Method:</strong> {order.payment_method}</p>
                                        <p className="mb-0"><strong>Status:</strong> 
                                            <span className={`badge bg-${order.payment_status === 'paid' ? 'success' : 'warning'} ms-2`}>
                                                {order.payment_status}
                                            </span>
                                        </p>
                                        {order.transaction_id && (
                                            <p className="mb-0 mt-2"><strong>Transaction ID:</strong> {order.transaction_id}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Courier Information */}
                            {order.courier_type && (
                                <div className="col-12">
                                    <div className="card h-100">
                                        <div className="card-header">
                                            <h5 className="mb-0">Courier Information</h5>
                                        </div>
                                        <div className="card-body">
                                            <p className="mb-2"><strong>Courier:</strong> {order.courier_type.toUpperCase()}</p>
                                            <p className="mb-2"><strong>Consignment ID:</strong> {order.courier_consignment_id}</p>
                                            {order.tracking_code && (
                                                <p className="mb-0"><strong>Tracking Code:</strong> {order.tracking_code}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Admin Notes */}
                            {order.admin_notes && (
                                <div className="col-12">
                                    <div className="card h-100">
                                        <div className="card-header">
                                            <h5 className="mb-0">Notes</h5>
                                        </div>
                                        <div className="card-body">
                                            <p className="mb-0 text-muted">{order.admin_notes}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons - Responsive */}
                <div className="action-buttons mt-4 text-center">
                    <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                        <button className="btn btn-primary" onClick={() => window.print()}>
                            <i className="fas fa-print me-2"></i> Print Order
                        </button>
                        <Link href={`/track/${order.order_number}`} className="btn btn-info">
                            <i className="fas fa-map-marker-alt me-2"></i> Track Order
                        </Link>
                        <Link href="/orders" className="btn btn-secondary">
                            <i className="fas fa-list me-2"></i> View All Orders
                        </Link>
                    </div>
                </div>
            </div>

            <style>{`
                .order-details-page {
                    font-family: 'Lexend', sans-serif;
                    padding: 0 0 20px 0;
                }
                
                .badge {
                    padding: 0.35rem 0.65rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 500;
                }
                
                /* Desktop Timeline Styles */
                .steps-container {
                    display: flex;
                    justify-content: space-between;
                    position: relative;
                    margin-bottom: 30px;
                }
                
                .step {
                    flex: 1;
                    text-align: center;
                    position: relative;
                }
                
                .step-icon {
                    width: 45px;
                    height: 45px;
                    background: #e9ecef;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 10px;
                    font-size: 18px;
                    color: #6c757d;
                    position: relative;
                    z-index: 2;
                    transition: all 0.3s ease;
                }
                
                .step.completed .step-icon {
                    background: #28a745;
                    color: white;
                }
                
                .step.active .step-icon {
                    background: #112066;
                    color: white;
                    box-shadow: 0 0 0 4px rgba(17, 32, 102, 0.2);
                }
                
                .step-label {
                    font-size: 12px;
                    font-weight: 500;
                    color: #6c757d;
                }
                
                .step.completed .step-label {
                    color: #28a745;
                    font-weight: 600;
                }
                
                .step.active .step-label {
                    color: #112066;
                    font-weight: 600;
                }
                
                .step-line {
                    position: absolute;
                    top: 22px;
                    left: 50%;
                    width: 100%;
                    height: 2px;
                    background: #e9ecef;
                    z-index: 1;
                }
                
                .step.completed + .step .step-line {
                    background: #28a745;
                }
                
                /* Mobile Timeline */
                .mobile-timeline {
                    padding: 10px 0;
                }
                
                .mobile-step {
                    display: flex;
                    align-items: flex-start;
                    position: relative;
                    padding-bottom: 20px;
                }
                
                .mobile-step:last-child {
                    padding-bottom: 0;
                }
                
                .mobile-step-icon {
                    width: 36px;
                    height: 36px;
                    background: #e9ecef;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 15px;
                    font-size: 14px;
                    color: #6c757d;
                    flex-shrink: 0;
                    transition: all 0.3s ease;
                }
                
                .mobile-step.completed .mobile-step-icon {
                    background: #28a745;
                    color: white;
                }
                
                .mobile-step.active .mobile-step-icon {
                    background: #112066;
                    color: white;
                    box-shadow: 0 0 0 3px rgba(17, 32, 102, 0.2);
                }
                
                .mobile-step-content {
                    flex: 1;
                }
                
                .mobile-step-label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 4px;
                }
                
                .mobile-step-status {
                    font-size: 11px;
                    color: #6c757d;
                }
                
                .mobile-step.completed .mobile-step-status {
                    color: #28a745;
                }
                
                .mobile-step.active .mobile-step-status {
                    color: #112066;
                    font-weight: 500;
                }
                
                .mobile-step-line {
                    position: absolute;
                    left: 17px;
                    top: 36px;
                    bottom: 0;
                    width: 2px;
                    background: #e9ecef;
                }
                
                .mobile-step.completed + .mobile-step .mobile-step-line {
                    background: #28a745;
                }
                
                /* Timeline History */
                .timeline {
                    position: relative;
                    padding-left: 20px;
                }
                
                .timeline-item {
                    position: relative;
                    padding-bottom: 15px;
                }
                
                .timeline-item:last-child {
                    padding-bottom: 0;
                }
                
                .timeline-badge {
                    position: absolute;
                    left: -20px;
                    top: 0;
                }
                
                .timeline-item:before {
                    content: '';
                    position: absolute;
                    left: -14px;
                    top: 20px;
                    bottom: 0;
                    width: 2px;
                    background: #e9ecef;
                }
                
                .timeline-item:last-child:before {
                    display: none;
                }
                
                /* Card Styles */
                .card {
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid #e9ecef;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                }
                
                .card-header {
                    background: #f8f9fa;
                    border-bottom: 1px solid #e9ecef;
                    padding: 12px 16px;
                }
                
                .card-body {
                    padding: 16px;
                }
                
                /* Mobile Items View */
                .item-card {
                    background: white;
                }
                
                .item-card:last-child {
                    border-bottom: none !important;
                }
                
                .totals-card {
                    border-radius: 12px;
                    margin-top: 10px;
                }
                
                /* Responsive Adjustments */
                @media (max-width: 768px) {
                    .order-header h6 {
                        font-size: 13px;
                    }
                    
                    .order-header small {
                        font-size: 11px;
                    }
                    
                    .card-header h5 {
                        font-size: 16px;
                    }
                    
                    .card-body p {
                        font-size: 13px;
                        margin-bottom: 8px;
                    }
                    
                    .action-buttons .btn {
                        font-size: 13px;
                        padding: 8px 16px;
                    }
                    
                    .timeline-item strong {
                        font-size: 12px;
                    }
                    
                    .timeline-item p {
                        font-size: 12px;
                    }
                }
                
                @media (max-width: 576px) {
                    .order-details-page {
                        padding: 0;
                    }
                    
                    .order-header {
                        border-radius: 12px;
                    }
                    
                    .order-header .col-6 {
                        margin-bottom: 10px;
                    }
                    
                    .tracking-timeline {
                        border-radius: 12px;
                    }
                    
                    .card {
                        border-radius: 12px;
                    }
                    
                    .item-card {
                        padding: 12px !important;
                    }
                    
                    .item-card img {
                        width: 60px !important;
                        height: 60px !important;
                    }
                    
                    .totals-card {
                        padding: 12px !important;
                    }
                }
                
                /* Print Styles */
                @media print {
                    .action-buttons,
                    .dashboard-sidebar,
                    .btn-close,
                    .navbar,
                    .back-button {
                        display: none !important;
                    }
                    
                    .order-details-page {
                        padding: 0 !important;
                    }
                    
                    .card {
                        box-shadow: none !important;
                        border: 1px solid #ddd !important;
                    }
                }
                
                /* Touch Optimization */
                @media (max-width: 768px) {
                    .btn,
                    .step-icon,
                    .mobile-step-icon {
                        cursor: pointer;
                        -webkit-tap-highlight-color: transparent;
                    }
                    
                    .btn:active {
                        transform: scale(0.96);
                    }
                }
                
                /* Animations */
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .order-header,
                .tracking-timeline,
                .card {
                    animation: fadeIn 0.3s ease forwards;
                }
            `}</style>
        </DashboardLayout>
    );
}