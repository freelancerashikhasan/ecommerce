import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import DashboardLayout from '../../Layout/DashboardLayout';

export default function TrackOrder({ order }) {
    const [trackingHistory, setTrackingHistory] = useState(order.tracking_history || []);
    
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

    const getStatusProgress = () => {
        const statuses = ['pending', 'processing', 'confirmed', 'shipped', 'delivered'];
        const currentIndex = statuses.indexOf(order.order_status);
        return ((currentIndex + 1) / statuses.length) * 100;
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
            { status: 'pending', label: 'Order Placed', icon: 'fas fa-check-circle', description: 'Your order has been placed and is awaiting confirmation.' },
            { status: 'processing', label: 'Processing', icon: 'fas fa-cog', description: 'Your order is being processed and prepared for shipping.' },
            { status: 'confirmed', label: 'Confirmed', icon: 'fas fa-check-double', description: 'Your order has been confirmed and is being packed.' },
            { status: 'shipped', label: 'Shipped', icon: 'fas fa-truck', description: 'Your order has been shipped and is on its way.' },
            { status: 'delivered', label: 'Delivered', icon: 'fas fa-home', description: 'Your order has been delivered to your address.' }
        ];
        
        const currentIndex = steps.findIndex(step => step.status === order.order_status);
        
        return steps.map((step, index) => ({
            ...step,
            completed: index <= currentIndex,
            active: index === currentIndex,
            date: trackingHistory.find(t => t.status === step.status)?.created_at || null
        }));
    };

    // Auto-refresh tracking every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchTrackingStatus();
        }, 30000);
        
        return () => clearInterval(interval);
    }, [order.order_number]);

    const fetchTrackingStatus = async () => {
        try {
            const response = await fetch(`/api/track-order/${order.order_number}`);
            const data = await response.json();
            if (data.success && data.order) {
                setTrackingHistory(data.order.tracking_history || []);
            }
        } catch (error) {
            console.error('Failed to fetch tracking status:', error);
        }
    };

    return (
        <DashboardLayout>
            <div className="track-order-page">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="mb-0">Track Order #{order.order_number}</h3>
                    <Link href={`/dashboard/orders/${order.id}`} className="btn btn-outline-secondary">
                        <i className="fas fa-arrow-left me-2"></i> Back to Order
                    </Link>
                </div>

                {/* Order Summary */}
                <div className="order-summary mb-4 p-4 bg-light rounded">
                    <div className="row">
                        <div className="col-md-3 mb-3 mb-md-0">
                            <small className="text-muted">Order Date</small>
                            <p className="mb-0 fw-bold">{formatDate(order.order_date)}</p>
                        </div>
                        <div className="col-md-3 mb-3 mb-md-0">
                            <small className="text-muted">Order Status</small>
                            <p className="mb-0">
                                <span className={`badge bg-${getStatusBadge(order.order_status)}`}>
                                    {order.order_status.toUpperCase()}
                                </span>
                            </p>
                        </div>
                        <div className="col-md-3 mb-3 mb-md-0">
                            <small className="text-muted">Total Amount</small>
                            <p className="mb-0 fw-bold text-primary">${order.total  }</p>
                        </div>
                        <div className="col-md-3">
                            <small className="text-muted">Delivery Address</small>
                            <p className="mb-0">{order.shipping_address}</p>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-section mb-4 p-4 border rounded">
                    <h5 className="mb-3">Order Progress</h5>
                    <div className="progress mb-2" style={{ height: '10px', borderRadius: '10px' }}>
                        <div 
                            className="progress-bar" 
                            role="progressbar" 
                            style={{ width: `${getStatusProgress()}%`, background: '#112066' }}
                            aria-valuenow={getStatusProgress()} 
                            aria-valuemin="0" 
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <small className="text-muted">{Math.round(getStatusProgress())}% Complete</small>
                </div>

                {/* Tracking Timeline */}
                <div className="tracking-timeline mb-4 p-4 border rounded">
                    <h5 className="mb-4">Tracking Timeline</h5>
                    <div className="timeline-container">
                        {getTrackingSteps().map((step, index) => (
                            <div key={step.status} className={`timeline-step ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
                                <div className="timeline-icon">
                                    <i className={step.icon}></i>
                                </div>
                                <div className="timeline-content">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 className="mb-1">{step.label}</h6>
                                            <p className="mb-1 text-muted">{step.description}</p>
                                            {step.date && (
                                                <small className="text-muted">
                                                    <i className="far fa-clock me-1"></i> {formatDate(step.date)}
                                                </small>
                                            )}
                                        </div>
                                        {step.completed && (
                                            <i className="fas fa-check-circle text-success" style={{ fontSize: '20px' }}></i>
                                        )}
                                    </div>
                                </div>
                                {index < getTrackingSteps().length - 1 && (
                                    <div className="timeline-line"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tracking History */}
                {trackingHistory && trackingHistory.length > 0 && (
                    <div className="tracking-history mb-4 p-4 border rounded">
                        <h5 className="mb-3">Detailed Tracking History</h5>
                        <div className="history-list">
                            {trackingHistory.map((track, idx) => (
                                <div key={idx} className="history-item d-flex mb-3">
                                    <div className="history-icon me-3">
                                        <i className={`fas fa-${getIconForStatus(track.status)}`}></i>
                                    </div>
                                    <div className="history-content flex-grow-1">
                                        <div className="d-flex justify-content-between">
                                            <strong>{track.status.toUpperCase()}</strong>
                                            <small className="text-muted">{formatDate(track.created_at)}</small>
                                        </div>
                                        <p className="mb-0">{track.description}</p>
                                        {track.location && (
                                            <small className="text-muted">
                                                <i className="fas fa-map-marker-alt me-1"></i> {track.location}
                                            </small>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Courier Information */}
                {order.courier_type && (
                    <div className="courier-info mb-4 p-4 border rounded">
                        <h5 className="mb-3">Courier Information</h5>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <small className="text-muted">Courier Service</small>
                                <p className="mb-0 fw-bold">{order.courier_type.toUpperCase()}</p>
                            </div>
                            <div className="col-md-4 mb-3">
                                <small className="text-muted">Consignment ID</small>
                                <p className="mb-0">{order.courier_consignment_id}</p>
                            </div>
                            {order.tracking_code && (
                                <div className="col-md-4 mb-3">
                                    <small className="text-muted">Tracking Code</small>
                                    <p className="mb-0">{order.tracking_code}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="action-buttons text-center">
                    <button className="btn btn-primary me-2" onClick={() => window.location.reload()}>
                        <i className="fas fa-sync-alt me-2"></i> Refresh Status
                    </button>
                    <button className="btn btn-secondary me-2" onClick={() => window.print()}>
                        <i className="fas fa-print me-2"></i> Print Tracking
                    </button>
                    <Link href="/dashboard/orders" className="btn btn-outline-secondary">
                        <i className="fas fa-list me-2"></i> View All Orders
                    </Link>
                </div>
            </div>

            <style jsx>{`
                .track-order-page {
                    font-family: Inter;
                }
                
                .badge {
                    padding: 0.35rem 0.65rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                }
                
                /* Timeline Styles */
                .timeline-container {
                    position: relative;
                }
                
                .timeline-step {
                    position: relative;
                    padding-left: 40px;
                    margin-bottom: 30px;
                }
                
                .timeline-step:last-child {
                    margin-bottom: 0;
                }
                
                .timeline-icon {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 32px;
                    height: 32px;
                    background: #e9ecef;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #6c757d;
                    z-index: 2;
                }
                
                .timeline-step.completed .timeline-icon {
                    background: #2ecc71;
                    color: white;
                }
                
                .timeline-step.active .timeline-icon {
                    background: #112066;
                    color: white;
                    box-shadow: 0 0 0 3px rgba(99, 76, 159, 0.3);
                }
                
                .timeline-content {
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 10px;
                    margin-left: 10px;
                }
                
                .timeline-line {
                    position: absolute;
                    left: 15px;
                    top: 32px;
                    bottom: -30px;
                    width: 2px;
                    background: #e9ecef;
                }
                
                .timeline-step.completed + .timeline-step .timeline-line {
                    background: #2ecc71;
                }
                
                /* History Items */
                .history-item {
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 10px;
                    transition: all 0.3s ease;
                }
                
                .history-item:hover {
                    background: #e9ecef;
                    transform: translateX(5px);
                }
                
                .history-icon {
                    width: 40px;
                    height: 40px;
                    background: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #112066;
                    font-size: 18px;
                }
                
                /* Progress Bar */
                .progress {
                    background-color: #e9ecef;
                }
                
                .progress-bar {
                    transition: width 0.5s ease;
                }
                
                @media (max-width: 768px) {
                    .timeline-content h6 {
                        font-size: 14px;
                    }
                    
                    .timeline-content p {
                        font-size: 12px;
                    }
                    
                    .history-item {
                        flex-direction: column;
                    }
                    
                    .history-icon {
                        margin-bottom: 10px;
                    }
                }
                
                @media print {
                    .action-buttons,
                    .dashboard-sidebar,
                    .navbar {
                        display: none !important;
                    }
                    
                    .dashboard-content {
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    
                    .timeline-icon {
                        background: #e9ecef !important;
                        print-color-adjust: exact;
                    }
                    
                    .progress-bar {
                        print-color-adjust: exact;
                    }
                }
            `}</style>
        </DashboardLayout>
    );
}

function getIconForStatus(status) {
    const icons = {
        pending: 'clock',
        processing: 'cog',
        confirmed: 'check-double',
        shipped: 'truck',
        delivered: 'home',
        cancelled: 'times-circle',
        returned: 'undo-alt'
    };
    return icons[status] || 'info-circle';
}