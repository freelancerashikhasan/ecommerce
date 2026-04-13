// resources/js/components/ProductCollections.jsx

import React from 'react';
import { Link } from '@inertiajs/react';
import productPlaceholder from "../assets/images/619.png";
import AddToCartButton from './AddToCartButton';
import '../assets/css/product-collections.css';

function ProductCollections({ collections }) {
    // Function to render star ratings (exactly the same)
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        return (
            <div className="d-flex star-sec">
                {[...Array(5)].map((_, i) => (
                    <span key={i}>
                        {i < fullStars ? (
                            <i className='fas fa-star'></i>
                        ) : i === fullStars && hasHalfStar ? (
                            <i className='fas fa-star-half-alt'></i>
                        ) : (
                            <i className='far fa-star'></i>
                        )}
                    </span>
                ))}
                <strong className='ps-3'>{rating.toFixed(1)}</strong>
            </div>
        );
    };

    return (
        <div className="product-collections-wrapper">
            {collections.map(collection => (
                <div key={collection.id} className="container mb-5">
                    <div className="d-flex justify-content-between align-items-center my-3 collection-title">
                        <div className="d-flex flex-wrap align-items-center">
                            <h5 className="mb-0">{collection.title}</h5>
                            <p className="mb-0">{collection.description}</p>
                        </div>
                        <Link href={`/products?collection=${collection.slug || collection.id}`} className="">
                            View All <i className='fas fa-arrow-right'></i>
                        </Link>
                    </div>

                    <div className="product-cards">
                        <div className="row g-3 g-lg-4">
                            {collection.products.map(product => (
                                <div key={product.id} className="col-lg-2 col-md-4 col-sm-6  product-card p-2">
                                    <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                                        <div className="product-card-inner">
                                            {product.originalPrice && product.originalPrice > product.price && (
                                                <span className="discount-badge">
                                                    {product.discountPercentage ||
                                                        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                                </span>
                                            )}

                                            <div className="img-sec">
                                                <img
                                                    src={product.image ? `${product.image}` : productPlaceholder}
                                                    alt={product.name}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = productPlaceholder;
                                                    }}
                                                />
                                            </div>
                                            <div className="details-section">
                                                <p className="single-line-ellipsis">{product.name}</p>
                                                {renderStars(product.rating)}
                                                <div className="pricing mt-2 d-flex align-items-center">
                                                    <h5 className="main-price mb-0">${parseFloat(product.price).toFixed(2)}</h5>
                                                    {product.originalPrice && product.originalPrice > product.price && (
                                                        <del className="mb-0">${parseFloat(product.originalPrice).toFixed(2)}</del>
                                                    )}  
                                                </div>
                                                <div className="mt-2">
                                                    <AddToCartButton product={product} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

         
        </div>
    );
}

export default ProductCollections;