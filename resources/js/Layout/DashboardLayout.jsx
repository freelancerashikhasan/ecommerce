// resources/js/Layout/DashboardLayout.jsx

import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import MainLayout from './MainLayout';

export default function DashboardLayout({ children }) {
    const { auth } = usePage().props;
    const { url } = usePage();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        {
            name: 'Dashboard',
            icon: 'fas fa-tachometer-alt',
            href: '/home',
            active: url === '/home'
        },
        {
            name: 'My Profile',
            icon: 'fas fa-user',
            href: '/profile',
            active: url.startsWith('/profile')
        },
        {
            name: 'My Orders',
            icon: 'fas fa-shopping-bag',
            href: '/orders',
            active: url.startsWith('/orders')
        },
        {
            name: 'Wishlist',
            icon: 'fas fa-heart',
            href: '/wishlist',
            active: url === '/wishlist'
        },
        {
            name: 'Reviews',
            icon: 'fas fa-star',
            href: '/reviews',
            active: url === '/reviews'
        },
       
        {
            name: 'Change Password',
            icon: 'fas fa-key',
            href: '/change-password',
            active: url === '/change-password'
        }
    ];

    return (
        <MainLayout>
            <div className="dashboard-container">
                <div className="container py-4">
                    <div className="row">
                        {/* Mobile Sidebar Toggle */}
                        <div className="col-12 d-block d-lg-none mb-3">
                            <button
                                className="btn defaultColor w-100"
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            >
                                <i className="fas fa-bars me-2"></i>
                                Dashboard Menu
                            </button>
                        </div>

                        {/* Sidebar */}
                        <div className={`col-lg-3 mb-4 ${isSidebarOpen ? 'd-block' : 'd-none d-lg-block'}`}>
                            <div className="dashboard-sidebar">
                                <div className="user-info text-center p-4">
                                    {auth?.user?.avatar ? (
                                        <img 
                                            src={`/storage/avatars/${auth.user.avatar}`} 
                                            alt={auth.user.name}
                                            className="user-avatar mb-3"
                                        />
                                    ) : (
                                        <div className="user-avatar-placeholder mb-3">
                                            <i className="fas fa-user fa-3x"></i>
                                        </div>
                                    )}
                                    <h5 className="user-name">{auth?.user?.name}</h5>
                                    <p className="user-email text-muted small">{auth?.user?.email}</p>
                                    <p className="user-phone text-muted small">
                                        <i className="fas fa-phone me-1"></i> {auth?.user?.phone}
                                    </p>
                                </div>

                                <div className="dashboard-menu">
                                    {menuItems.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            className={`dashboard-menu-item ${item.active ? 'active' : ''}`}
                                        >
                                            <i className={`${item.icon} me-3`}></i>
                                            <span>{item.name}</span>
                                        </Link>
                                    ))}
                                    
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="dashboard-menu-item text-danger"
                                    >
                                        <i className="fas fa-sign-out-alt me-3"></i>
                                        <span>Logout</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-lg-9">
                            <div className="dashboard-content">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .dashboard-container {
                    background: #f8f9fa;
                    min-height: 100vh;
                    font-family: Inter;
                }

                .dashboard-sidebar {
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    overflow: hidden;
                    position: sticky;
                    top: 20px;
                }

                .user-info {
                    background: linear-gradient(135deg, #634C9F 0%, #4a3780 100%);
                    color: white;
                }

                .user-avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 3px solid white;
                }

                .user-avatar-placeholder {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto;
                }

                .user-name {
                    color: white;
                    margin-bottom: 0.25rem;
                }

                .user-email, .user-phone {
                    color: rgba(255,255,255,0.8);
                }

                .dashboard-menu {
                    padding: 1rem 0;
                }

                .dashboard-menu-item {
                    display: flex;
                    align-items: center;
                    padding: 0.75rem 1.5rem;
                    color: #333;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .dashboard-menu-item:hover {
                    background: #f8f9fa;
                    color: #634C9F;
                }

                .dashboard-menu-item.active {
                    background: rgba(99, 76, 159, 0.1);
                    color: #634C9F;
                    border-right: 3px solid #634C9F;
                }

                .dashboard-menu-item i {
                    width: 20px;
                }

                .dashboard-content {
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    padding: 2rem;
                }

                @media (max-width: 991.98px) {
                    .dashboard-content {
                        padding: 1.5rem;
                    }
                }
            `}</style>
        </MainLayout>
    );
}