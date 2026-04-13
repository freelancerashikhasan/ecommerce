// resources/js/components/Header.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
    const { getCartCount } = useCart();
    const { user, isAuthenticated, logout, getUserDisplayName, isLoading } = useAuth();
    const cartCount = getCartCount();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const userMenuRef = useRef(null);
    const mobileMenuRef = useRef(null);
    
    // Get collections from shared props
    const { headerCollections } = usePage().props;
    const collections = headerCollections || [];

    // Handle click outside to close user menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && mobileMenuOpen) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileMenuOpen]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle search on Enter key
    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            performSearch();
        }
    };

    // Handle search button click
    const handleSearchClick = () => {
        if (searchTerm.trim()) {
            performSearch();
        }
    };

    // Perform search navigation
    const performSearch = () => {
        if (!searchTerm.trim()) return;
        
        setIsSearching(true);
        
        router.get('/products', 
            { search: searchTerm.trim() },
            {
                preserveState: false,
                preserveScroll: true,
                onFinish: () => {
                    setIsSearching(false);
                    setMobileSearchOpen(false);
                }
            }
        );
    };

    // Handle logout
    const handleLogout = async (e) => {
        e.preventDefault();
        setShowUserMenu(false);
        await logout();
    };

    return (
        <div className="header-wrapper sticky-top bg-white">
            {/* Top Header - Hidden on mobile, visible on tablet and desktop */}
            <div className="topHeader">
                <div className="container d-none d-md-block">
                    {/* <div className="row">
                        <div className="col-md-6 text-center text-white topHeaderText1">
                            <p>FREE delivery & 40% Discount for next 3 orders! Place your 1st order in.</p>
                        </div>
                        <div className="col-md-6 text-center topHeaderText2">
                            <p>Until the end of the sale: <span className='timerText'>47</span> days <span className='timerText'>06</span> hours <span className='timerText'>55</span> Minutes <span className='timerText'>51</span> sec</p>
                        </div>
                    </div> */}
                    <div className="row">
                        {/* Left Side - Bilingual Title */}
                        <div className="col-md-7 text-center text-white topHeaderText1">
                            <p className="mb-0">
                                <i className="fas fa-exchange-alt me-2"></i>
                                <strong>🇧🇩 China-Bangladesh Import/Export 🇨🇳</strong>
                                <span className="mx-2">|</span>
                                <span>চীন-বাংলাদেশ আমদানি ও রপ্তানি</span>
                                <br className="d-md-none" />
                                <span className="mx-2">•</span>
                                <Link 
                                    href="/manual-order" 
                                    className="fw-bold ms-2 btn btn-sm btn-light text-dark px-3"
                                    style={{ borderRadius: '20px', textDecoration: 'none' }}
                                >
                                    <i className="fas fa-clipboard-list me-1"></i>
                                    Manual Order
                                </Link>
                            </p>
                        </div>
                        
                        {/* Right Side - Service Info */}
                        <div className="col-md-5 text-center text-white topHeaderText2">
                            <p className="mb-0">
                                <i className="fas fa-shipping-fast me-1"></i>
                                <strong>We Import:</strong>
                                <span className="mx-1">Electronics, Fashion, Home Goods, Industrial Products</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Section - Hide on mobile, show on tablet */}
            <div className="infoSection pt-2 d-none d-md-block">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="flex items-center gap-4 w-full whitespace-nowrap">
                                <div className="flex">
                                    <Link href="/about-us" className="info-btn me-2">About Us</Link>
                                    <Link href="/home" className="info-btn me-2">My Account</Link>
                                    <Link href="/wishlist" className="info-btn me-2">Wishlist</Link>
                                    <span className="ms-3 delivery-notice d-none d-md-block">
                                        <span className='me-3'>|</span>  We deliver to you every day from
                                        <span className="text-danger ms-2">7:00 to 23:00</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex col-md-4">
                            <div className="flex ms-auto justify-end text-end gap-3">
                                <select className="info-select px-2 me-2 py-1 rounded">
                                    <option value="usd">USD</option>
                                    <option value="eur">EUR</option>
                                    <option value="bdt">BDT</option>
                                </select>
                                <select className="info-select px-2 py-1 rounded">
                                    <option value="en">English</option>
                                    <option value="bn">Bangla</option>
                                    <option value="es">Spanish</option>
                                </select>
                                <Link href="/order-tracking" className="info-btn px-3 py-1 rounded text-sm">
                                    Order Tracking
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="d-none d-md-block" />

            {/* Search Section - Main Header */}
            <div className="search-section">
                <div className="container">
                    <div className="header-container">
                        {/* Mobile Menu Toggle */}
                       <div className='d-flex '>
                             <button 
                            className="mobile-menu-toggle d-block d-md-none"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                        </button>

                        <Link href={'/'} className="logo-container mt-2">
                            <img className='header-logo' src="../assets/images/Logo.svg" alt="" />
                        </Link>
                       </div>

                        {/* Desktop Search Bar */}
                        <div className="input-group d-none d-md-block">
                            <input 
                                type="text" 
                                placeholder='Search for products, categories or brands' 
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onKeyPress={handleSearchKeyPress}
                                disabled={isSearching}
                            />
                            <i 
                                className={`fas fa-search ${isSearching ? 'fa-spin' : ''}`} 
                                onClick={handleSearchClick}
                                style={{ cursor: 'pointer' }}
                            ></i>
                        </div>

                        

                        {/* Profile Section */}
                        <div className="profile-sec">
                            {/* Mobile Search Toggle & Bar */}
                        <div className="mobile-search-wrapper d-block d-md-none">
                            <button 
                                className="mobile-search-toggle"
                                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                                aria-label="Search"
                            >
                                <i className="fas fa-search"></i>
                            </button>
                            {mobileSearchOpen && (
                                <div className="mobile-search-overlay">
                                    <div className="mobile-search-container">
                                        <input 
                                            type="text" 
                                            placeholder='Search products...' 
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            onKeyPress={handleSearchKeyPress}
                                            disabled={isSearching}
                                            autoFocus
                                        />
                                        <button className='mobileSearch' onClick={performSearch} disabled={isSearching}>
                                            <i className={`fas fa-search ${isSearching ? 'fa-spin' : ''}`}></i>
                                        </button>
                                        <button className="close-search" onClick={() => setMobileSearchOpen(false)}>
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                            <div className="user-profile" ref={userMenuRef}>
                                {isAuthenticated ? (
                                    <>
                                        <button 
                                            className="account-link me-2 d-flex"
                                            onClick={() => setShowUserMenu(!showUserMenu)}
                                        >
                                            <div className="">
                                                <img className='account-icon me-2' src="../assets/images/user.svg" alt="" />
                                            </div>
                                            <div className="account-text d-none d-md-block">
                                                <p className="account-line1">Welcome</p>
                                                <p className="account-line2">{getUserDisplayName()}</p>
                                            </div>
                                        </button>
                                        
                                        {showUserMenu && (
                                            <div className="user-dropdown-menu">
                                                <div className="dropdown-header">
                                                    <strong>{user?.name}</strong>
                                                    <small>{user?.email}</small>
                                                </div>
                                                <div className="dropdown-divider"></div>
                                                <Link href="/home" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                                                    <i className="fas fa-tachometer-alt me-2"></i>
                                                    My Dashboard
                                                </Link>
                                                <Link href="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                                                    <i className="fas fa-user me-2"></i>
                                                    My Profile
                                                </Link>
                                                <Link href="/orders" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                                                    <i className="fas fa-shopping-bag me-2"></i>
                                                    My Orders
                                                </Link>
                                                <Link href="/wishlist" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                                                    <i className="fas fa-heart me-2"></i>
                                                    Wishlist
                                                </Link>
                                                <div className="dropdown-divider"></div>
                                                <button 
                                                    onClick={handleLogout} 
                                                    className="dropdown-item text-danger"
                                                    disabled={isLoading}
                                                >
                                                    <i className="fas fa-sign-out-alt me-2"></i>
                                                    {isLoading ? 'Logging out...' : 'Logout'}
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link href="/login" className="account-link me-2">
                                        <div className="">
                                            <img className='account-icon me-2' src="../assets/images/user.svg" alt="" />
                                        </div>
                                        <div className="account-text d-none d-md-block">
                                            <p className="account-line1">Sign In</p>
                                            <p className="account-line2">Account</p>
                                        </div>
                                    </Link>
                                )}
                            </div>
                            
                            <a href="#" className="wishlist-icon me-2 d-none d-md-flex">
                                <i className="far fa-heart account-icon"></i>
                                <span className="wishlist-count">0</span>
                            </a>
                            <Link href="/cart" className="wishlist-icon">
                                <img src="../assets/images/cart.svg" className='account-icon' alt="" />
                                {cartCount > 0 && (
                                    <span className="wishlist-count">{cartCount}</span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Section - Desktop Horizontal, Mobile Slide-out Menu */}
            <div className="nav-section bg-white shadow-sm">
                <div className="container">
                    {/* Desktop Navigation - Hidden on mobile */}
                    <div className="row d-none d-md-flex">
                        <div className="col-md-3"></div>
                        <div className="col-md-9">
                            <div className="d-flex justify-content-between align-items-start flex-wrap">
                                <ul className="nav d-flex gap-3">
                                    <li className="nav-item">
                                        <Link href="/" className="nav-link active">
                                            Home
                                        </Link>
                                    </li>
                                    {collections.map((collection) => (
                                        <li key={collection.id} className="nav-item">
                                            <Link 
                                                href={`/collections/${collection.slug}`} 
                                                className="nav-link"
                                            >
                                                {collection.name}
                                            </Link>
                                        </li>
                                    ))}
                                    <li className="nav-item">
                                        <Link href="/blog" className="nav-link">Blog</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/contact" className="nav-link">Contact</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Slide-out Menu */}
            {mobileMenuOpen && (
                <div className="mobile-menu-overlay">
                    <div className="mobile-menu" ref={mobileMenuRef}>
                        <div className="mobile-menu-header">
                            <h5>Menu</h5>
                            <button onClick={() => setMobileMenuOpen(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <ul className="mobile-nav-list">
                            <li><Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
                            {collections.map((collection) => (
                                <li key={collection.id}>
                                    <Link href={`/collections/${collection.slug}`} onClick={() => setMobileMenuOpen(false)}>
                                        {collection.name}
                                    </Link>
                                </li>
                            ))}
                            <li><Link href="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</Link></li>
                            <li><Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
                            <li><Link href="/wishlist" onClick={() => setMobileMenuOpen(false)}>Wishlist</Link></li>
                            <li><Link href="/home" onClick={() => setMobileMenuOpen(false)}>My Account</Link></li>
                            <li><Link href="/order-tracking" onClick={() => setMobileMenuOpen(false)}>Order Tracking</Link></li>
                        </ul>
                        <div className="mobile-menu-footer">
                            <select className="info-select px-2 me-2 py-1 rounded">
                                <option value="usd">USD</option>
                                <option value="eur">EUR</option>
                                <option value="bdt">BDT</option>
                            </select>
                            <select className="info-select px-2 py-1 rounded">
                                <option value="en">English</option>
                                <option value="bn">Bangla</option>
                                <option value="es">Spanish</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                /* Desktop styles remain unchanged */
                .user-profile {
                    position: relative;
                }
                
                .user-dropdown-menu {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    margin-top: 0.5rem;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    min-width: 200px;
                    z-index: 1000;
                    animation: slideDown 0.2s ease;
                        font-family: Inter;
                        color: #fff;

                }
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .dropdown-header {
                    padding: 0.75rem 1rem;
                    background: #112066;
                    border-radius: 8px 8px 0 0;
                }
                
                .dropdown-header strong {
                    display: block;
                    margin-bottom: 0.25rem;
                }
                
                .dropdown-header small {
                    color: #666;
                    font-size: 0.8rem;
                }
                
                .dropdown-divider {
                    height: 1px;
                    background: #e9ecef;
                    margin: 0.5rem 0;
                }
                
                .dropdown-item {
                    display: flex;
                    align-items: center;
                    padding: 0.5rem 1rem;
                    color: #333;
                    text-decoration: none;
                    transition: background 0.2s;
                    cursor: pointer;
                    background: none;
                    border: none;
                    width: 100%;
                    text-align: left;
                }
                
                .dropdown-item:hover {
                    background: #f8f9fa;
                }
                
                .dropdown-item i {
                    width: 20px;
                }

                /* Mobile & Tablet Responsive Styles */
                @media (max-width: 991px) {
                    .header-container {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 12px 0;
                        gap: 12px;
                    }

                    .logo-container .header-logo {
                        max-height: 40px;
                        width: auto;
                    }

                    .profile-sec {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }

                    /* Mobile Menu Toggle Button */
                    .mobile-menu-toggle {
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        color: #333;
                        cursor: pointer;
                        padding: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    /* Mobile Search */
                    .mobile-search-wrapper {
                        position: relative;
                        flex: 1;
                        display: flex;
                        justify-content: flex-end;
                    }

                    .mobile-search-toggle {
                        background: none;
                        border: none;
                        font-size: 1.2rem;
                        color: #333;
                        cursor: pointer;
                        padding: 8px;
                    }

                    .mobile-search-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        background: white;
                        padding: 15px;
                        z-index: 1001;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        animation: slideDown 0.2s ease;
                    }

                    .mobile-search-container {
                        display: flex;
                        gap: 10px;
                        align-items: center;
                    }

                    .mobile-search-container input {
                        flex: 1;
                        padding: 12px 20px;
                        border: 1px solid #959bb4;
                        border-radius: 20px;
                        font-size: 16px;
                        width: 100%;
                        font-family: Inter;

                    }

                    .mobile-search-container .mobileSearch {
                        border: none;
                        color: #112066;
                        padding: 12px 16px;
                        border-radius: 8px;
                        cursor: pointer;
                        position: absolute;
                        right: 54px;
                    }

                    .close-search {
                        color: #dc3545 !important;
                        padding: 2px 0px !important;
                    }

                    /* Mobile Slide-out Menu */
                    .mobile-menu-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0,0,0,0.5);
                        z-index: 1100;
                        animation: fadeIn 0.2s ease;
                        font-family: Inter;
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }

                    .mobile-menu {
                        position: fixed;
                        top: 0;
                        left: 0;
                        bottom: 0;
                        width: 280px;
                        background: #112066;
                        color: #fff;
                        padding: 20px;
                        overflow-y: auto;
                        animation: slideIn 0.3s ease;
                        box-shadow: 2px 0 10px rgba(0,0,0,0.1);
                        animation: fadeIn 0.2s ease;

                    }

                    @keyframes slideIn {
                        from { transform: translateX(-100%); }
                        to { transform: translateX(0); }
                    }

                    .mobile-menu-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding-bottom: 15px;
                        border-bottom: 1px solid #eee;
                        margin-bottom: 15px;
                    }

                    .mobile-menu-header h5 {
                        margin: 0;
                        font-size: 1.2rem;
                    }

                    .mobile-menu-header button {
                        background: none;
                        border: none;
                        font-size: 1.2rem;
                        cursor: pointer;
                    }

                    .mobile-nav-list {
                        list-style: none;
                        padding: 0;
                        margin: 0;
                    }

                    .mobile-nav-list li {
                        margin-bottom: 12px;
                    }

                    .mobile-nav-list li a {
                        text-decoration: none;
                        color: #fff;

                        font-size: 1rem;
                        display: block;
                        padding: 8px 0;
                    }

                    .mobile-nav-list li a:hover {
                        color: #28a745;
                    }

                    .mobile-menu-footer {
                        margin-top: 20px;
                        padding-top: 15px;
                        border-top: 1px solid #eee;
                        display: flex;
                        gap: 10px;
                    }

                    .mobile-menu-footer select {
                        flex: 1;
                        padding: 8px;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        background: white;
                    }
                }

                /* Tablet Specific Adjustments (768px - 991px) */
                @media (min-width: 768px) and (max-width: 991px) {
                    .header-container {
                        gap: 20px;
                    }

                    .logo-container .header-logo {
                        max-height: 45px;
                    }

                    .profile-sec {
                        gap: 12px;
                    }

                    .account-link .account-icon {
                        width: 20px;
                        height: 20px;
                    }
                }

                /* Mobile Specific (up to 767px) */
                @media (max-width: 767px) {
                    .header-container {
                        padding: 10px 0;
                        gap: 10px;
                    }

                    .logo-container .header-logo {
                        max-height: 35px;
                    }

                    .profile-sec {
                        gap: 6px;
                    }

                    .account-link {
                        padding: 4px !important;
                    }

                    .account-icon {
                        width: 22px !important;
                        height: 22px !important;
                    }

                    .wishlist-icon {
                        position: relative;
                        padding: 6px;
                    }

                    .wishlist-count {
                        position: absolute;
                        top: -2px;
                        right: -4px;
                        background: #dc3545;
                        color: white;
                        font-size: 9px;
                        padding: 2px 5px;
                        border-radius: 50%;
                        min-width: 16px;
                        text-align: center;
                    }

                    .mobile-search-container input {
                        font-size: 14px;
                        padding: 10px 20px;
                    }

                    .mobile-search-container button {
                        padding: 10px 14px;
                    }

                    .mobile-menu {
                        width: 260px;
                        padding: 15px;
                    }
                }

                /* Small Mobile (up to 480px) */
                @media (max-width: 480px) {
                    .logo-container .header-logo {
                        max-height: 30px;
                    }

                    .account-icon {
                        width: 18px !important;
                        height: 18px !important;
                    }

                    .mobile-menu {
                        width: 240px;
                    }
                }
            `}</style>
        </div>
    );
}