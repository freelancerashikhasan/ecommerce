// resources/js/Layouts/PolicyLayout.jsx
import React from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from './MainLayout';

export default function PolicyLayout({ children, title }) {
    const navItems = [
        { name: 'FAQ', href: '/faq', icon: 'fas fa-question-circle' },
        { name: 'Shipping Info', href: '/shipping-info', icon: 'fas fa-truck' },
        { name: 'Returns Policy', href: '/returns-policy', icon: 'fas fa-undo-alt' },
        { name: 'Privacy Policy', href: '/privacy-policy', icon: 'fas fa-shield-alt' },
        { name: 'Terms of Service', href: '/terms-of-service', icon: 'fas fa-file-contract' }
    ];

    return (
        <MainLayout>
            <div className="policy-container py-4 py-md-5">
                <div className="container">
                    <div className="row">
                        {/* Sidebar for Desktop */}
                        <div className="col-lg-3 mb-4 mb-lg-0" style={{ zIndex: '0' }}>
                            <div className="policy-sidebar sticky-top" style={{ top: '20px' }}>
                                <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                                    <div className="card-header" style={{ background: '#112066', color: 'white', border: 'none' }}>
                                        <h5 className="mb-0 fw-bold">
                                            <i className="fas fa-bars me-2"></i>
                                            Information
                                        </h5>
                                    </div>
                                    <div className="card-body p-0">
                                        <div className="nav flex-column nav-pills">
                                            {navItems.map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={`nav-link px-4 py-3 ${window.location.pathname === item.href ? 'active' : ''}`}
                                                    style={{
                                                        borderRadius: '0',
                                                        color: window.location.pathname === item.href ? 'white' : '#112066',
                                                        background: window.location.pathname === item.href ? '#112066' : 'transparent',
                                                        borderLeft: window.location.pathname === item.href ? '4px solid #112066' : '4px solid transparent'
                                                    }}
                                                >
                                                    <i className={`${item.icon} me-2`}></i>
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Card */}
                                <div className="card border-0 shadow-sm mt-4" style={{ borderRadius: '15px' }}>
                                    <div className="card-body text-center p-4">
                                        <i className="fas fa-headset" style={{ fontSize: '40px', color: '#112066' }}></i>
                                        <h6 className="fw-bold mt-3">Need Help?</h6>
                                        <p className="small text-muted">Contact our support team</p>
                                        <a href="mailto:support@example.com" className="btn btn-sm w-100" style={{ background: '#112066', color: 'white', borderRadius: '25px' }}>
                                            <i className="fas fa-envelope me-2"></i>
                                            support@example.com
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-lg-9">
                            <div className="card border-0 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                                <div className="card-header p-4" style={{ background: 'linear-gradient(135deg, #112066 0%, #1a3399 100%)', border: 'none' }}>
                                    <h2 className="mb-0 fw-bold text-white">
                                        <i className={`fas ${getIcon(title)} me-3`}></i>
                                        {title}
                                    </h2>
                                </div>
                                <div className="card-body p-4 p-md-5">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .policy-container {
                    background: #f8f9fa;
                    min-height: calc(100vh - 200px);
                }
                
                .nav-link {
                    transition: all 0.3s ease;
                    font-weight: 500;
                }
                
                .nav-link:hover:not(.active) {
                    background: #f0f2f5;
                    color: #112066 !important;
                    border-left-color: #112066 !important;
                }
                
                .nav-link.active {
                    background: linear-gradient(90deg, #112066 0%, #1a3399 100%);
                    color: white !important;
                }
                
                @media (max-width: 991px) {
                    .policy-sidebar {
                        position: relative !important;
                    }
                }
            `}</style>
        </MainLayout>
    );
}

function getIcon(title) {
    const icons = {
        'FAQ': 'fa-question-circle',
        'Shipping Info': 'fa-truck',
        'Returns Policy': 'fa-undo-alt',
        'Privacy Policy': 'fa-shield-alt',
        'Terms of Service': 'fa-file-contract'
    };
    return icons[title] || 'fa-info-circle';
}