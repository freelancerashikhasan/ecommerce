// resources/js/Pages/Dashboard/Wishlist.jsx

import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import DashboardLayout from '../../Layout/DashboardLayout';

export default function Wishlist({ wishlist }) {
    const { delete: destroy, processing } = useForm();

    const removeFromWishlist = (productId) => {
        if (confirm('Are you sure you want to remove this item from your wishlist?')) {
            destroy(`/dashboard/wishlist/${productId}`);
        }
    };

    return (
        <DashboardLayout>
            <div className="wishlist-page">
                <h3 className="mb-4">My Wishlist</h3>
                
                {wishlist.data && wishlist.data.length > 0 ? (
                    <>
                        <div className="row">
                            {wishlist.data.map(product => (
                                <div key={product.id} className="col-md-4 col-lg-3 mb-4">
                                    <div className="wishlist-card">
                                        <div className="product-image">
                                            <img 
                                                src={product.featured_image ? `/storage/${product.featured_image}` : 'https://via.placeholder.com/300'}
                                                alt={product.name}
                                                className="img-fluid"
                                            />
                                            <button 
                                                className="remove-btn"
                                                onClick={() => removeFromWishlist(product.id)}
                                                disabled={processing}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                        <div className="product-info p-3">
                                            <h6 className="product-name">{product.name}</h6>
                                            <p className="product-price text-primary fw-bold">
                                                ${(product.sale_price || product.regular_price).toFixed(2)}
                                            </p>
                                            <div className="d-grid gap-2">
                                                <Link 
                                                    href={`/product/${product.slug}`} 
                                                    className="btn btn-outline-primary btn-sm"
                                                >
                                                    View Details
                                                </Link>
                                                <button className="btn btn-primary btn-sm">
                                                    <i className="fas fa-shopping-cart me-1"></i> Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Pagination */}
                        {wishlist.links && (
                            <div className="d-flex justify-content-center mt-4">
                                {wishlist.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`btn btn-sm ${link.active ? 'btn-primary' : 'btn-outline-secondary'} mx-1`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-5">
                        <i className="fas fa-heart-broken fa-3x text-muted mb-3"></i>
                        <p>Your wishlist is empty</p>
                        <Link href="/" className="btn btn-primary">
                            Browse Products
                        </Link>
                    </div>
                )}
            </div>

            <style jsx>{`
                .wishlist-card {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    transition: transform 0.3s ease;
                }
                
                .wishlist-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
                
                .product-image {
                    position: relative;
                    overflow: hidden;
                    padding-top: 100%;
                    background: #f8f9fa;
                }
                
                .product-image img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .remove-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: white;
                    border: none;
                    color: #dc3545;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .remove-btn:hover {
                    background: #dc3545;
                    color: white;
                }
                
                .product-name {
                    font-size: 0.9rem;
                    margin-bottom: 0.5rem;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .product-price {
                    font-size: 1rem;
                    margin-bottom: 1rem;
                }
            `}</style>
        </DashboardLayout>
    );
}