// resources/js/Pages/Dashboard/Index.jsx

import React from 'react';
import { Link } from '@inertiajs/react';
import DashboardLayout from '../../Layout/DashboardLayout';

export default function Dashboard({ stats, recentOrders, wishlistCount, user }) {
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

    // Stats data for mapping
    const statsData = [
        {
            key: 'total_orders',
            icon: 'fas fa-shopping-bag',
            label: 'Total Orders',
            value: stats?.total_orders || 0,
            color: '#112066'
        },
        {
            key: 'total_spent',
            icon: 'fas fa-dollar-sign',
            label: 'Total Spent',
            value: `$${(stats?.total_spent || 0)}`,
            color: '#28a745'
        },
        {
            key: 'wishlist',
            icon: 'fas fa-heart',
            label: 'Wishlist Items',
            value: wishlistCount || 0,
            color: '#dc3545'
        },
        {
            key: 'reviews',
            icon: 'fas fa-star',
            label: 'Reviews',
            value: stats?.reviews_count || 0,
            color: '#ffc107'
        }
    ];

    return (
        <DashboardLayout>
            <div className="dashboard-overview">
                <div className="welcome-section mb-4">
                    <h3 className="mb-2">Welcome back, {user.name}!</h3>
                    <p className="text-muted">Here's what's happening with your account today.</p>
                </div>
                
                {/* Stats Cards - Responsive Grid */}
                <div className="stats-grid mb-4">
                    <div className="row g-3">
                        {statsData.map((stat, index) => (
                            <div className="col-6 col-md-3" key={index}>
                                <div className="stat-card">
                                    <div className="stat-icon" style={{ background: stat.color }}>
                                        <i className={stat.icon}></i>
                                    </div>
                                    <div className="stat-info">
                                        <h3>{stat.value}</h3>
                                        <p>{stat.label}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders Section */}
                <div className="recent-orders mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <h4 className="mb-0">Recent Orders</h4>
                        <Link href="/orders" className="btn btn-sm view-all-btn">
                            View All <i className="fas fa-arrow-right ms-1"></i>
                        </Link>
                    </div>
                    
                    {recentOrders && recentOrders.length > 0 ? (
                        <>
                            {/* Desktop Table View */}
                            <div className="desktop-table-view d-none d-md-block">
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Order #</th>
                                                <th>Date</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentOrders.map(order => (
                                                <tr key={order.id}>
                                                    <td>
                                                        <strong>#{order.order_number}</strong>
                                                    </td>
                                                    <td>{new Date(order.order_date).toLocaleDateString()}</td>
                                                    <td>
                                                        <strong>${parseFloat(order.total).toFixed(2)}</strong>
                                                    </td>
                                                    <td>
                                                        <span className={`badge bg-${getStatusBadge(order.order_status)}`}>
                                                            {order.order_status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <Link href={`/orders/${order.id}`} className="btn btn-sm btn-link p-0">
                                                            View Details <i className="fas fa-chevron-right ms-1"></i>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile Card View */}
                            <div className="mobile-card-view d-block d-md-none">
                                {recentOrders.map(order => (
                                    <div key={order.id} className="order-card mb-3">
                                        <div className="order-card-header p-3">
                                            <div className="d-flex justify-content-between align-items-center">
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
                                                    <span 
                                                        className="status-badge d-block mt-1" 
                                                        style={{ background: getStatusColor(order.order_status) }}
                                                    >
                                                        {order.order_status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="order-card-body p-3 border-top">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="small text-muted">Order ID</span>
                                                    <div className="small fw-bold">#{order.order_number}</div>
                                                </div>
                                                <Link href={`/orders/${order.id}`} className="btn btn-sm btn-primary">
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="empty-state text-center py-5">
                            <i className="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
                            <p className="mb-3">No orders yet</p>
                            <Link href="/" className="btn btn-primary">
                                Start Shopping
                            </Link>
                        </div>
                    )}
                </div>

                {/* Quick Actions Section */}
                <div className="quick-actions">
                    <h4 className="mb-3">Quick Actions</h4>
                    <div className="row g-3">
                        <div className="col-md-4 col-6">
                            <Link href="/" className="action-card">
                                <div className="action-icon" style={{ color: '#112066' }}>
                                    <i className="fas fa-shopping-cart fa-2x"></i>
                                </div>
                                <h6 className="mt-2">Continue Shopping</h6>
                                <p className="small text-muted mb-0">Browse our latest products</p>
                            </Link>
                        </div>
                        <div className="col-md-4 col-6">
                            <Link href="/profile" className="action-card">
                                <div className="action-icon" style={{ color: '#28a745' }}>
                                    <i className="fas fa-user-edit fa-2x"></i>
                                </div>
                                <h6 className="mt-2">Update Profile</h6>
                                <p className="small text-muted mb-0">Edit your information</p>
                            </Link>
                        </div>
                        <div className="col-md-4 col-6">
                            <Link href="/wishlist" className="action-card">
                                <div className="action-icon" style={{ color: '#dc3545' }}>
                                    <i className="fas fa-heart fa-2x"></i>
                                </div>
                                <h6 className="mt-2">View Wishlist</h6>
                                <p className="small text-muted mb-0">Items you've saved</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .dashboard-overview {
                    font-family: 'Lexend', sans-serif;
                    padding: 0 0 20px 0;
                }

                .welcome-section h3 {
                    font-size: clamp(1.2rem, 5vw, 1.8rem);
                    font-weight: 600;
                    color: #112066;
                }

                .welcome-section p {
                    font-size: clamp(0.85rem, 4vw, 0.95rem);
                }

                /* Stats Cards */
                .stat-card {
                    background: white;
                    border-radius: 16px;
                    padding: clamp(1rem, 4vw, 1.5rem);
                    display: flex;
                    align-items: center;
                    gap: clamp(0.75rem, 3vw, 1rem);
                    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
                    transition: all 0.3s ease;
                    height: 100%;
                }

                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.12);
                }

                .stat-icon {
                    width: clamp(45px, 10vw, 55px);
                    height: clamp(45px, 10vw, 55px);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    flex-shrink: 0;
                }

                .stat-icon i {
                    font-size: clamp(1.2rem, 4vw, 1.5rem);
                }

                .stat-info {
                    flex: 1;
                }

                .stat-info h3 {
                    margin: 0;
                    font-size: clamp(1.2rem, 5vw, 1.8rem);
                    font-weight: 700;
                    color: #333;
                }

                .stat-info p {
                    margin: 0;
                    color: #666;
                    font-size: clamp(0.7rem, 3vw, 0.85rem);
                }

                /* Recent Orders Section */
                .recent-orders h4 {
                    font-size: clamp(1rem, 4.5vw, 1.25rem);
                    font-weight: 600;
                }

                .view-all-btn {
                    background: #112066;
                    color: white;
                    border-radius: 20px;
                    padding: 5px 15px;
                    font-size: 12px;
                }

                .view-all-btn:hover {
                    background: #0d1a52;
                    color: white;
                }

                /* Desktop Table */
                .table {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
                }

                .table thead th {
                    background: #f8f9fa;
                    border-bottom: 2px solid #dee2e6;
                    font-weight: 600;
                    font-size: 13px;
                    padding: 12px;
                }

                .table tbody td {
                    padding: 12px;
                    vertical-align: middle;
                    font-size: 13px;
                }

                .badge {
                    padding: 0.35rem 0.65rem;
                    border-radius: 20px;
                    font-size: 0.7rem;
                    font-weight: 500;
                }

                /* Mobile Card View */
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
                }

                .order-number {
                    font-weight: 700;
                    font-size: 14px;
                    color: #112066;
                }

                .order-date {
                    font-size: 10px;
                }

                .order-total {
                    font-size: 16px;
                    color: #112066;
                }

                .status-badge {
                    font-size: 10px;
                    padding: 3px 8px;
                    border-radius: 20px;
                    color: white;
                    text-align: center;
                }

                .order-card-body {
                    background: white;
                }

                /* Quick Actions */
                .quick-actions h4 {
                    font-size: clamp(1rem, 4.5vw, 1.25rem);
                    font-weight: 600;
                }

                .action-card {
                    display: block;
                    background: white;
                    border-radius: 16px;
                    padding: clamp(1rem, 4vw, 1.5rem);
                    text-align: center;
                    text-decoration: none;
                    color: #333;
                    transition: all 0.3s ease;
                    border: 1px solid #e9ecef;
                    height: 100%;
                }

                .action-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                    border-color: #112066;
                }

                .action-icon i {
                    transition: transform 0.3s ease;
                }

                .action-card:hover .action-icon i {
                    transform: scale(1.1);
                }

                .action-card h6 {
                    font-size: clamp(0.85rem, 4vw, 1rem);
                    font-weight: 600;
                    margin-top: 10px;
                    margin-bottom: 5px;
                }

                .action-card p {
                    font-size: clamp(0.7rem, 3vw, 0.8rem);
                    line-height: 1.4;
                }

                /* Empty State */
                .empty-state {
                    background: white;
                    border-radius: 12px;
                    padding: 30px 20px;
                }

                .empty-state i {
                    opacity: 0.5;
                }

                /* Responsive Breakpoints */
                @media (max-width: 768px) {
                    .dashboard-overview {
                        padding: 0;
                    }
                    
                    .stat-card {
                        padding: 1rem;
                    }
                    
                    .stat-icon {
                        width: 40px;
                        height: 40px;
                    }
                    
                    .stat-info h3 {
                        font-size: 1.1rem;
                    }
                    
                    .stat-info p {
                        font-size: 0.7rem;
                    }
                }

                @media (max-width: 576px) {
                    .stats-grid .col-6 {
                        padding: 0 6px;
                    }
                    
                    .action-card {
                        padding: 1rem;
                    }
                    
                    .action-card i {
                        font-size: 1.5rem;
                    }
                    
                    .action-card h6 {
                        font-size: 0.75rem;
                    }
                    
                    .action-card p {
                        font-size: 0.65rem;
                    }
                    
                    .order-card-header {
                        padding: 12px !important;
                    }
                    
                    .order-card-body {
                        padding: 12px !important;
                    }
                }

                /* Tablet Specific */
                @media (min-width: 768px) and (max-width: 991px) {
                    .stat-card {
                        padding: 1.2rem;
                    }
                    
                    .stat-icon {
                        width: 45px;
                        height: 45px;
                    }
                    
                    .action-card {
                        padding: 1.2rem;
                    }
                }

                /* Hover Effects for Desktop */
                @media (min-width: 768px) {
                    .order-card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.12);
                    }
                }

                /* Touch Optimization */
                @media (max-width: 768px) {
                    .action-card,
                    .stat-card,
                    .view-all-btn,
                    .btn {
                        cursor: pointer;
                        -webkit-tap-highlight-color: transparent;
                    }
                    
                    .action-card:active,
                    .stat-card:active {
                        transform: scale(0.98);
                    }
                    
                    .btn:active {
                        transform: scale(0.96);
                    }
                }

                /* Animation */
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .stat-card,
                .order-card,
                .action-card {
                    animation: fadeInUp 0.5s ease forwards;
                }
            `}</style>
        </DashboardLayout>
    );
}