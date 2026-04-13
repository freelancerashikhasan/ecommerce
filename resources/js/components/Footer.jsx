// components/Footer.jsx
import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Footer() {
    const [isMobile, setIsMobile] = useState(false);
    const { url } = usePage();

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Navigation items for bottom bar
    const navItems = [
        { name: 'Home', icon: 'fas fa-home', link: '/' },
        { name: 'Shop', icon: 'fas fa-store', link: '/products' },
        { name: 'Cart', icon: 'fas fa-shopping-cart', link: '/cart' },
        { name: 'Wishlist', icon: 'fas fa-heart', link: '/wishlist' },
        { name: 'Account', icon: 'fas fa-user', link: '/home' },
    ];

    // Check if link is active
    const isActive = (link) => {
        if (link === '/') {
            return url === '/';
        }
        return url.startsWith(link);
    };

    return (
        <>
            {/* Main Footer - Desktop & Mobile */}
            <footer className="main-footer" style={{ background: '#112066' }}>
                <div className="container">
                    {/* Footer Top Section */}
                    <div className="footer-top py-4 py-md-5">
                        <div className="row">
                            {/* About Section */}
                            <div className="col-md-4 mb-4 mb-md-0">
                                <div className="footer-logo mb-3">
                                    <img 
                                        src="/assets/images/Logo-white.svg" 
                                        alt="Logo" 
                                        style={{ height: '40px', filter: 'brightness(0) invert(1)' }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                    <h4 className="text-white mb-0" style={{ fontSize: '24px', fontWeight: '700' }}>
                                        MyShop
                                    </h4>
                                </div>
                                <p className="text-white-50 mb-3" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                    Your one-stop destination for quality products at the best prices. 
                                    We deliver happiness to your doorstep with fast and reliable service.
                                </p>
                                <div className="social-links d-flex gap-3">
                                    <a href="#" className="social-link" aria-label="Facebook">
                                        <i className="fab fa-facebook-f"></i>
                                    </a>
                                    <a href="#" className="social-link" aria-label="Instagram">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                    <a href="#" className="social-link" aria-label="Twitter">
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                    <a href="#" className="social-link" aria-label="YouTube">
                                        <i className="fab fa-youtube"></i>
                                    </a>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="col-md-2 mb-4 mb-md-0">
                                <h5 className="text-white mb-3" style={{ fontSize: '16px', fontWeight: '600' }}>
                                    Quick Links
                                </h5>
                                <ul className="footer-links list-unstyled">
                                    <li className="mb-2"><Link href="/" className="text-white-50 text-decoration-none">Home</Link></li>
                                    <li className="mb-2"><Link href="/products" className="text-white-50 text-decoration-none">Shop</Link></li>
                                    <li className="mb-2"><Link href="/about" className="text-white-50 text-decoration-none">About Us</Link></li>
                                    <li className="mb-2"><Link href="/contact" className="text-white-50 text-decoration-none">Contact</Link></li>
                                </ul>
                            </div>

                            {/* Customer Service */}
                            <div className="col-md-3 mb-4 mb-md-0">
                                <h5 className="text-white mb-3" style={{ fontSize: '16px', fontWeight: '600' }}>
                                    Customer Service
                                </h5>
                                <ul className="footer-links list-unstyled">
                                    <li className="mb-2"><Link href="/faq" className="text-white-50 text-decoration-none">FAQ</Link></li>
                                    <li className="mb-2"><Link href="/shipping-info" className="text-white-50 text-decoration-none">Shipping Info</Link></li>
                                    <li className="mb-2"><Link href="/returns" className="text-white-50 text-decoration-none">Returns Policy</Link></li>
                                    <li className="mb-2"><Link href="/privacy-policy" className="text-white-50 text-decoration-none">Privacy Policy</Link></li>
                                    <li className="mb-2"><Link href="/terms" className="text-white-50 text-decoration-none">Terms of Service</Link></li>
                                </ul>
                            </div>

                            {/* Contact Info */}
                            <div className="col-md-3">
                                <h5 className="text-white mb-3" style={{ fontSize: '16px', fontWeight: '600' }}>
                                    Get In Touch
                                </h5>
                                <ul className="contact-info list-unstyled">
                                    <li className="mb-3 d-flex align-items-center">
                                        <i className="fas fa-map-marker-alt text-white-50 me-3"></i>
                                        <span className="text-white-50 small">123 Business Street, City, Country</span>
                                    </li>
                                    <li className="mb-3 d-flex align-items-center">
                                        <i className="fas fa-phone-alt text-white-50 me-3"></i>
                                        <span className="text-white-50 small">+1 234 567 890</span>
                                    </li>
                                    <li className="mb-3 d-flex align-items-center">
                                        <i className="fas fa-envelope text-white-50 me-3"></i>
                                        <span className="text-white-50 small">support@myshop.com</span>
                                    </li>
                                    <li className="mb-3 d-flex align-items-center">
                                        <i className="fas fa-clock text-white-50 me-3"></i>
                                        <span className="text-white-50 small">Mon - Sun: 9:00 AM - 9:00 PM</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="bg-white-50 my-3" style={{ opacity: '0.1' }} />

                    {/* Footer Bottom */}
                    <div className="footer-bottom py-3">
                        <div className="row align-items-center">
                            <div className="col-md-6 text-center text-md-start">
                                <p className="text-white-50 mb-0 small">
                                    &copy; {new Date().getFullYear()} MyShop. All rights reserved.
                                </p>
                            </div>
                            <div className="col-md-6 text-center text-md-end">
                                <div className="payment-methods d-flex justify-content-center justify-content-md-end gap-3">
                                    <img src="https://cdn-icons-png.flaticon.com/512/196/196539.png" alt="Visa" style={{ height: '25px' }} />
                                    <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="Mastercard" style={{ height: '25px' }} />
                                    <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="PayPal" style={{ height: '25px' }} />
                                    <img src="https://cdn-icons-png.flaticon.com/512/196/196566.png" alt="Amex" style={{ height: '25px' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Mobile Bottom Navigation Bar */}
            {isMobile && (
                <div className="mobile-bottom-nav">
                    <div className="bottom-nav-container">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.link}
                                className={`bottom-nav-item ${isActive(item.link) ? 'active' : ''}`}
                            >
                                <i className={`${item.icon} bottom-nav-icon`}></i>
                                <span className="bottom-nav-label">{item.name}</span>
                                {item.name === 'Cart' && (
                                    <span className="cart-badge">0</span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <style jsx>{`
                /* Main Footer Styles */
                .main-footer {
                    padding-top: 50px;
                    position: relative;
                }

                .social-link {
                    width: 36px;
                    height: 36px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    color: white;
                    text-decoration: none;
                }

                .social-link:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateY(-3px);
                }

                .footer-links li a {
                    transition: all 0.3s ease;
                    display: inline-block;
                }

                .footer-links li a:hover {
                    color: white !important;
                    transform: translateX(5px);
                }

                .contact-info li {
                    transition: all 0.3s ease;
                }

                .contact-info li:hover {
                    transform: translateX(5px);
                }

                .payment-methods img {
                    opacity: 0.7;
                    transition: opacity 0.3s ease;
                    cursor: pointer;
                }

                .payment-methods img:hover {
                    opacity: 1;
                }

                /* Mobile Bottom Navigation */
                .mobile-bottom-nav {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: white;
                    box-shadow: 0 -2px 15px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                    animation: slideUp 0.3s ease;
                    background-color: #112066;
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }

                .bottom-nav-container {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    padding: 8px 12px;
                    background: #112066;
                }

                .bottom-nav-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    color: #fff;
                    transition: all 0.3s ease;
                    position: relative;
                    padding: 4px 8px;
                    border-radius: 8px;
                    min-width: 60px;
                }

                .bottom-nav-item.active {
                    color: #066d9c;
                }

                .bottom-nav-icon {
                    font-size: 22px;
                    margin-bottom: 2px;
                    transition: all 0.3s ease;
                }

                .bottom-nav-label {
                    font-size: 11px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }

                .bottom-nav-item.active .bottom-nav-icon {
                    transform: translateY(-2px);
                }

                .bottom-nav-item.active .bottom-nav-label {
                    font-weight: 600;
                }

                .bottom-nav-item:hover {
                    color: #112066;
                    transform: translateY(-2px);
                }

                /* Cart Badge */
                .cart-badge {
                    position: absolute;
                    top: -2px;
                    right: 5px;
                    background: #dc3545;
                    color: white;
                    font-size: 9px;
                    font-weight: bold;
                    padding: 2px 5px;
                    border-radius: 50%;
                    min-width: 16px;
                    text-align: center;
                }

                /* Add padding to body to prevent content hiding behind bottom nav */
                body {
                    padding-bottom: 0;
                }

                @media (max-width: 768px) {
                    body {
                        padding-bottom: 65px;
                    }
                    
                    .main-footer {
                        margin-bottom: 0;
                    }
                }

                /* Tablet Styles */
                @media (min-width: 769px) and (max-width: 1024px) {
                    .footer-links li a,
                    .contact-info span {
                        font-size: 13px;
                    }
                    
                    .social-link {
                        width: 32px;
                        height: 32px;
                    }
                }

                /* Mobile Styles for Footer */
                @media (max-width: 768px) {
                    .footer-top {
                        padding: 30px 0 20px !important;
                    }
                    
                    .footer-logo h4 {
                        font-size: 20px !important;
                    }
                    
                    .footer-links li a,
                    .contact-info span {
                        font-size: 12px !important;
                    }
                    
                    .social-link {
                        width: 30px;
                        height: 30px;
                    }
                    
                    .payment-methods img {
                        height: 20px !important;
                    }
                    
                    .footer-bottom p {
                        font-size: 11px !important;
                    }
                }

                /* Small Mobile */
                @media (max-width: 480px) {
                    .bottom-nav-item {
                        min-width: 50px;
                        padding: 4px 4px;
                    }
                    
                    .bottom-nav-icon {
                        font-size: 20px;
                    }
                    
                    .bottom-nav-label {
                        font-size: 10px;
                    }
                    
                    .cart-badge {
                        right: 2px;
                        top: -4px;
                        font-size: 8px;
                        padding: 1px 4px;
                    }
                }

                /* Landscape mode */
                @media (max-width: 768px) and (orientation: landscape) {
                    .mobile-bottom-nav {
                        display: none;
                    }
                    
                    body {
                        padding-bottom: 0;
                    }
                }
            `}</style>
        </>
    );
}