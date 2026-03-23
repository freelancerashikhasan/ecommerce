import React from 'react';
import { Link } from '@inertiajs/react';
import productPlaceholder from "../assets/images/619.png";
import AddToCartButton from './AddToCartButton';

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
                        <div className="d-flex">
                            <h5 className="mb-0">{collection.title}</h5>
                            <p>{collection.description}</p>
                        </div>
                        <Link href={`/category/${collection.slug || collection.id}`} className="">
                            View All <i className='fas fa-arrow-right'></i>
                        </Link>
                    </div>

                    <div className="product-cards">
                        <div className="row">
                            {collection.products.map(product => (
                                <div key={product.id} className="col-lg-2 col-md-4 col-sm-12 product-card p-2">
                                  <Link href={`/product/${product.slug}`} style={{ textDecoration:'none' }}>
                                      {product.originalPrice && product.originalPrice > product.price && (
                                        <span className="discount-badge">
                                            {product.discountPercentage ||
                                                Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                        </span>
                                    )}

                                    <div className="img-sec">
                                        <img
                                            src={product.image || productPlaceholder}
                                            alt={product.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = productPlaceholder;
                                            }}
                                        />
                                        {/* {product.badge && (
                                            <span className={`product-badge ${product.badge.toLowerCase()}`}>
                                                {product.badge}
                                            </span>
                                        )} */}
                                    </div>
                                    <div className="details-section">
                                        <p className="single-line-ellipsis">{product.name}</p>
                                        {renderStars(product.rating)}
                                        <div className="pricing mt-2 d-flex">
                                            <h5 className="main-price">${parseFloat(product.price).toFixed(2)}</h5>
                                            {product.originalPrice && product.originalPrice > product.price && (
                                                <del>${parseFloat(product.originalPrice).toFixed(2)}</del>
                                            )}
                                        </div>
                                        <div>
                                            <AddToCartButton product={product} />
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
