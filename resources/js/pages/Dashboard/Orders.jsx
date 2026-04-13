// resources/js/Pages/Dashboard/Orders.jsx

import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import DashboardLayout from '../../Layout/DashboardLayout';

export default function Orders({ orders }) {
    const [expandedOrder, setExpandedOrder] = useState(null);

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

    const toggleOrderExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    return (
        <DashboardLayout>
            <div className="orders-page">
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <h3 className="mb-0">My Orders</h3>
                    <Link href="/" className="btn btn-sm btn-outline-primary">
                        <i className="fas fa-shopping-cart me-2"></i>
                        Continue Shopping
                    </Link>
                </div>
                
                {orders.data && orders.data.length > 0 ? (
                    <>
                        {/* Desktop Table View - Hidden on mobile */}
                        <div className="desktop-table-view d-none d-md-block">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Order #</th>
                                            <th>Date</th>
                                            <th>Items</th>
                                            <th>Total</th>
                                            <th>Payment</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.data.map(order => (
                                            <tr key={order.id}>
                                                <td>
                                                    <strong>#{order.order_number}</strong>
                                                </td>
                                                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                                                <td>{order.items?.length || 0} items</td>
                                                <td>
                                                    <strong>${parseFloat(order.total).toFixed(2)}</strong>
                                                </td>
                                                <td>
                                                    <span className={`badge bg-${order.payment_status === 'paid' ? 'success' : 'warning'}`}>
                                                        {order.payment_status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge bg-${getStatusBadge(order.order_status)}`}>
                                                        {order.order_status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <Link href={`/orders/${order.id}`} className="btn btn-sm btn-primary">
                                                            View
                                                        </Link>
                                                        <Link href={`/track/${order.order_number}`} className="btn btn-sm btn-outline-secondary">
                                                            Track
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card View - Visible only on mobile */}
                        <div className="mobile-card-view d-block d-md-none">
                            {orders.data.map(order => (
                                <div 
                                    key={order.id} 
                                    className="order-card mb-3"
                                    onClick={() => toggleOrderExpand(order.id)}
                                >
                                    <div className="order-card-header d-flex justify-content-between align-items-center p-3">
                                        <div>
                                            <span className="order-number">#{order.order_number}</span>
                                            <span className="order-date d-block small text-muted">
                                                {new Date(order.order_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="text-end">
                                            <span className="order-total fw-bold">
                                                ${parseFloat(order.total).toFixed(2)}
                                            </span>
                                            <span className={`badge status-badge d-block mt-1`} style={{ background: getStatusColor(order.order_status) }}>
                                                {order.order_status}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className={`order-card-body p-3 border-top ${expandedOrder === order.id ? 'expanded' : ''}`}>
                                        <div className="order-info-grid">
                                            <div className="info-item">
                                                <span className="info-label">Items:</span>
                                                <span className="info-value">{order.items?.length || 0} products</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Payment:</span>
                                                <span className={`badge bg-${order.payment_status === 'paid' ? 'success' : 'warning'}`}>
                                                    {order.payment_status}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {order.items && order.items.length > 0 && expandedOrder === order.id && (
                                            <div className="order-items mt-3">
                                                <div className="items-list">
                                                    {order.items.slice(0, 3).map((item, idx) => (
                                                        <div key={idx} className="order-item d-flex gap-2 mb-2">
                                                            {item.image && (
                                                                <img 
                                                                    src={item.image} 
                                                                    alt={item.name}
                                                                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }}
                                                                />
                                                            )}
                                                            <div className="flex-grow-1">
                                                                <div className="item-name small fw-bold">{item.name}</div>
                                                                <div className="item-meta small text-muted">
                                                                    Qty: {item.quantity} x ${parseFloat(item.price).toFixed(2)}
                                                                </div>
                                                            </div>
                                                            <div className="item-total fw-bold">
                                                                ${(item.quantity * item.price).toFixed(2)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {order.items.length > 3 && (
                                                        <div className="text-muted small text-center mt-2">
                                                            +{order.items.length - 3} more items
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="order-actions d-flex gap-2 mt-3">
                                            <Link href={`/orders/${order.id}`} className="btn btn-sm btn-primary flex-grow-1">
                                                <i className="fas fa-eye me-1"></i> View Details
                                            </Link>
                                            <Link href={`/track/${order.order_number}`} className="btn btn-sm btn-outline-secondary flex-grow-1">
                                                <i className="fas fa-map-marker-alt me-1"></i> Track
                                            </Link>
                                        </div>
                                        
                                        {order.items && order.items.length > 0 && (
                                            <div className="expand-hint text-center mt-2">
                                                <small className="text-muted">
                                                    {expandedOrder === order.id ? '▲ Tap to collapse' : '▼ Tap to expand items'}
                                                </small>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Pagination */}
                        {orders.links && orders.links.length > 3 && (
                            <div className="pagination-wrapper mt-4 d-flex justify-content-center">
                                <div className="pagination-container">
                                    {orders.links.map((link, index) => {
                                        if (link.label === '&laquo; Previous') {
                                            return (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`pagination-btn ${!link.url ? 'disabled' : ''}`}
                                                    dangerouslySetInnerHTML={{ __html: '‹' }}
                                                />
                                            );
                                        }
                                        
                                        if (link.label === 'Next &raquo;') {
                                            return (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`pagination-btn ${!link.url ? 'disabled' : ''}`}
                                                    dangerouslySetInnerHTML={{ __html: '›' }}
                                                />
                                            );
                                        }
                                        
                                        return (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`pagination-btn ${link.active ? 'active' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="empty-orders text-center py-5">
                        <div className="empty-icon mb-4">
                            <i className="fas fa-shopping-bag fa-4x text-muted"></i>
                        </div>
                        <h5>No orders found</h5>
                        <p className="text-muted">You haven't placed any orders yet.</p>
                        <Link href="/" className="btn btn-primary mt-3">
                            <i className="fas fa-shopping-cart me-2"></i>
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>

            <style>{`
                .orders-page {
                    font-family: 'Lexend', sans-serif;
                    padding: 0 0 20px 0;
                }
                
                /* Badge Styles */
                .badge {
                    padding: 0.35rem 0.65rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 500;
                }
                
                /* Desktop Table Styles */
                .table {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                
                .table thead th {
                    background: #f8f9fa;
                    border-bottom: 2px solid #dee2e6;
                    font-weight: 600;
                    font-size: 14px;
                    padding: 12px;
                }
                
                .table tbody td {
                    padding: 12px;
                    vertical-align: middle;
                    font-size: 14px;
                }
                
                /* Mobile Card View Styles */
                .mobile-card-view {
                    padding: 0;
                }
                
                .order-card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                
                .order-card:active {
                    transform: scale(0.99);
                }
                
                .order-card-header {
                    background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
                    cursor: pointer;
                }
                
                .order-number {
                    font-weight: 700;
                    font-size: 16px;
                    color: #112066;
                }
                
                .order-date {
                    font-size: 11px;
                    color: #6c757d;
                    margin-top: 2px;
                }
                
                .order-total {
                    font-size: 18px;
                    color: #112066;
                }
                
                .status-badge {
                    font-size: 11px;
                    padding: 4px 10px;
                    text-align: center;
                }
                
                .order-card-body {
                    transition: all 0.3s ease;
                }
                
                .order-info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                    padding: 0 0 8px 0;
                }
                
                .info-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .info-label {
                    font-size: 12px;
                    color: #6c757d;
                }
                
                .info-value {
                    font-size: 13px;
                    font-weight: 500;
                    color: #333;
                }
                
                .order-items {
                    border-top: 1px solid #e9ecef;
                    padding-top: 12px;
                    margin-top: 8px;
                }
                
                .order-item {
                    padding: 8px 0;
                    border-bottom: 1px solid #f0f0f0;
                }
                
                .order-item:last-child {
                    border-bottom: none;
                }
                
                .item-name {
                    font-size: 13px;
                    color: #333;
                }
                
                .item-meta {
                    font-size: 11px;
                }
                
                .item-total {
                    font-size: 13px;
                    color: #112066;
                    min-width: 60px;
                    text-align: right;
                }
                
                .order-actions {
                    margin-top: 12px;
                }
                
                .order-actions .btn {
                    font-size: 13px;
                    padding: 8px 12px;
                }
                
                .expand-hint {
                    font-size: 10px;
                    opacity: 0.7;
                }
                
                /* Pagination Styles */
                .pagination-wrapper {
                    margin-top: 30px;
                }
                
                .pagination-container {
                    display: flex;
                    gap: 5px;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                
                .pagination-btn {
                    min-width: 36px;
                    height: 36px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 10px;
                    border: 1px solid #dee2e6;
                    background: white;
                    color: #112066;
                    text-decoration: none;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }
                
                .pagination-btn:hover {
                    background: #112066;
                    color: white;
                    border-color: #112066;
                }
                
                .pagination-btn.active {
                    background: #112066;
                    color: white;
                    border-color: #112066;
                }
                
                .pagination-btn.disabled {
                    opacity: 0.5;
                    pointer-events: none;
                }
                
                /* Empty State */
                .empty-orders {
                    background: white;
                    border-radius: 12px;
                    padding: 40px 20px;
                }
                
                .empty-icon i {
                    opacity: 0.5;
                }
                
                /* Responsive Adjustments */
                @media (max-width: 768px) {
                    .orders-page h3 {
                        font-size: 20px;
                    }
                    
                    .order-total {
                        font-size: 16px;
                    }
                    
                    .order-number {
                        font-size: 14px;
                    }
                }
                
                @media (max-width: 480px) {
                    .order-info-grid {
                        grid-template-columns: 1fr;
                        gap: 8px;
                    }
                    
                    .order-actions {
                        flex-direction: column;
                    }
                    
                    .order-actions .btn {
                        width: 100%;
                    }
                    
                    .pagination-btn {
                        min-width: 32px;
                        height: 32px;
                        font-size: 12px;
                    }
                }
                
                /* Animation for expanding items */
                .order-card-body {
                    max-height: 0;
                    overflow: hidden;
                    padding-top: 0;
                    padding-bottom: 0;
                }
                
                .order-card-body.expanded {
                    max-height: 500px;
                    padding-top: 12px;
                    padding-bottom: 12px;
                }
                
                /* Smooth transitions */
                .order-card,
                .order-card-body,
                .order-card-header {
                    transition: all 0.3s ease;
                }
                
                /* Hover effects on desktop */
                @media (min-width: 768px) {
                    .order-card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.12);
                    }
                }
                
                /* Touch optimization */
                @media (max-width: 768px) {
                    .order-card-header,
                    .btn,
                    .pagination-btn {
                        cursor: pointer;
                        -webkit-tap-highlight-color: transparent;
                    }
                    
                    .btn:active,
                    .pagination-btn:active {
                        transform: scale(0.96);
                    }
                }
            `}</style>
        </DashboardLayout>
    );
}