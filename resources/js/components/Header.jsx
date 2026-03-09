// components/Header.jsx
import React from 'react';
import { Link } from '@inertiajs/react';
import { useCart } from '../contexts/CartContext';

export default function Header() {
     const { getCartCount } = useCart();
    const cartCount = getCartCount();
    return (
        <div className="">
            <div className="topHeader">
                <div className="container ">
                    <div className="">
                        <div className="row">
                            <div className="col-md-6 text-center text-white topHeaderText1">
                                <p>FREE delivery & 40% Discount for next 3 orders! Place your 1st order in.</p>
                            </div>
                            <div className="col-md-6 text-center topHeaderText2">
                                <p>Until the end of the sale: <span className='timerText'>47</span> days <span className='timerText'>06</span> hours <span className='timerText'>55</span> Minutes <span className='timerText'>51</span> sec</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="infoSection pt-2">
                <div className="container">
                    <div className=" ">
                        {/* Left section */}
                        <div className="row">
                            <div className="col-md-8">
                                <div className="flex items-center gap-4 w-full whitespace-nowrap">
                                    <div className="flex">
                                        <a href="" className="info-btn me-2">About Us</a>
                                        <a href="" className="info-btn me-2">My Account</a>
                                        <a href="" className="info-btn me-2">Wishlist</a>
                                        <span className="ms-3 delivery-notice">
                                            <span className='me-3'>|</span>  We deliver to you every day from
                                            <span className="text-danger ms-2">7:00 to 23:00</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex col-md-4">
                                <div className="flex ms-auto justify-end text-end gap-3">
                                    <select className="info-select  px-2 me-2 py-1 rounded">
                                        <option value="usd">USD</option>
                                        <option value="eur">EUR</option>
                                        <option value="bdt">BDT</option>
                                    </select>

                                    <select className="info-select  px-2 py-1 rounded">
                                        <option value="en">English</option>
                                        <option value="bn">Bangla</option>
                                        <option value="es">Spanish</option>
                                    </select>

                                    <a href="#" className="info-btn  px-3 py-1 rounded text-sm">
                                        Order Tracking
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div><hr />
            <div className="search-section">
                <div className="container">
                    <div className="header-container">
                        <Link href={'/'} className="logo-container">
                            <img className='header-logo' src="../assets/images/Logo.svg" alt="" />
                        </Link>
                        <div className="input-group">
                            <input type="text" placeholder='Search for products, categories or brands' />
                            <i className='fas fa-search'></i>
                        </div>
                        <div className="profile-sec">
                            <a href="#" className="account-link me-2">
                                <div className="">
                                    <img className='account-icon me-2' src="../assets/images/user.svg" alt="" />
                                </div>
                                <div className="account-text">
                                    <p className="account-line1">Sign In</p>
                                    <p className="account-line2">Account</p>
                                </div>
                            </a>
                            <a href="#" className="wishlist-icon me-2">
                                <i className="far fa-heart account-icon "></i>
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
            <div className="nav-section bg-white shadow-sm ">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3"></div>
                        <div className="col-md-9">
                            <div className="d-flex justify-content-between align-items-start flex-wrap">

                                <ul className="nav d-flex gap-3">
                                    <li className="nav-item ">
                                        <Link to={'/'} className="nav-link active" href="#" id="homeDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Home
                                        </Link>
                                       
                                    </li>

                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" href="#" id="shopDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Shop
                                        </a>
                                        <ul className="dropdown-menu" aria-labelledby="shopDropdown">
                                            <li><a className="dropdown-item" href="#">All Products</a></li>
                                            <li><a className="dropdown-item" href="#">Categories</a></li>
                                        </ul>
                                    </li>

                                    <li className="nav-item"><a className="nav-link" href="#">Fruits & Vegetables</a></li>
                                    <li className="nav-item"><a className="nav-link" href="#">Beverages</a></li>
                                    <li className="nav-item"><a className="nav-link" href="#">Blog</a></li>
                                    <li className="nav-item"><a className="nav-link" href="#">Contact</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    );
}
