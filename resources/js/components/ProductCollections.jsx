import React from 'react';
import product01 from "../assets/images/619.png";
import AddToCartButton from './AddToCartButton';

function ProductCollections() {
    // Product data for all collections
    const collections = [
        {
            id: 1,
            title: "New Arrivals",
            description: "Don't miss this opportunity at a special discount just for this week.",
            products: [
                {
                    id: 101,
                    name: "100 Percent Apple Juice 64 fl oz Bottle",
                    image: product01,
                    price: 0.50,
                    originalPrice: 1.99,
                    rating: 3.5,
                    badge: "New"
                },
                {
                    id: 102,
                    name: "Organic Orange Juice 64 fl oz",
                    image: product01,
                    price: 0.75,
                    originalPrice: 2.25,
                    rating: 4.0,
                    badge: "New"
                },
                {
                    id: 103,
                    name: "Cold Pressed Green Juice",
                    image: product01,
                    price: 3.99,
                    originalPrice: 4.99,
                    rating: 4.5,
                    badge: "New"
                },
                {
                    id: 104,
                    name: "Pomegranate Antioxidant Blend",
                    image: product01,
                    price: 2.50,
                    originalPrice: 3.25,
                    rating: 4.2,
                    badge: "New"
                },
                {
                    id: 105,
                    name: "Tropical Fruit Mix Juice",
                    image: product01,
                    price: 1.99,
                    originalPrice: 2.49,
                    rating: 3.8,
                    badge: "New"
                },
                {
                    id: 106,
                    name: "Organic Carrot Juice",
                    image: product01,
                    price: 2.25,
                    originalPrice: 2.99,
                    rating: 4.1,
                    badge: "New"
                }
            ]
        },
        {
            id: 2,
            title: "Best Sellers",
            description: "Our most popular products loved by customers",
            products: [
                {
                    id: 201,
                    name: "Classic Apple Juice 1 Gallon",
                    image: product01,
                    price: 3.99,
                    originalPrice: 4.99,
                    rating: 4.7
                },
                {
                    id: 202,
                    name: "Organic Cranberry Juice",
                    image: product01,
                    price: 4.25,
                    originalPrice: 5.25,
                    rating: 4.5
                },
                {
                    id: 203,
                    name: "Fresh Squeezed OJ 64oz",
                    image: product01,
                    price: 3.75,
                    originalPrice: 4.25,
                    rating: 4.8
                },
                {
                    id: 204,
                    name: "Pineapple Coconut Blend",
                    image: product01,
                    price: 3.25,
                    originalPrice: 3.99,
                    rating: 4.3
                },
                {
                    id: 205,
                    name: "Beetroot Detox Juice",
                    image: product01,
                    price: 4.50,
                    originalPrice: 5.50,
                    rating: 4.6
                },
                {
                    id: 206,
                    name: "Low Sugar Berry Mix",
                    image: product01,
                    price: 3.99,
                    originalPrice: 4.75,
                    rating: 4.4
                }
            ]
        },
        {
            id: 3,
            title: "Discounted Items",
            description: "Limited-time offers you don't want to miss",
            products: [
                {
                    id: 301,
                    name: "Apple Juice (Clearance)",
                    image: product01,
                    price: 0.99,
                    originalPrice: 2.99,
                    rating: 3.9,
                    badge: "Sale"
                },
                {
                    id: 302,
                    name: "Mango Nectar 64oz",
                    image: product01,
                    price: 1.25,
                    originalPrice: 2.50,
                    rating: 4.0,
                    badge: "Sale"
                },
                {
                    id: 303,
                    name: "Vegetable Juice Combo",
                    image: product01,
                    price: 2.99,
                    originalPrice: 4.99,
                    rating: 3.7,
                    badge: "Sale"
                },
                {
                    id: 304,
                    name: "Citrus Energy Boost",
                    image: product01,
                    price: 1.75,
                    originalPrice: 3.25,
                    rating: 4.1,
                    badge: "Sale"
                },
                {
                    id: 305,
                    name: "Kids Juice Pack (6pk)",
                    image: product01,
                    price: 3.49,
                    originalPrice: 5.99,
                    rating: 4.2,
                    badge: "Sale"
                },
                {
                    id: 306,
                    name: "Organic Grape Juice",
                    image: product01,
                    price: 1.99,
                    originalPrice: 3.49,
                    rating: 3.8,
                    badge: "Sale"
                }
            ]
        }
    ];

    // Function to render star ratings
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
                        <a className="">View All <i className='fas fa-arrow-right'></i></a>
                    </div>

                    <div className="product-cards">
                        <div className="row">
                            {collection.products.map(product => (
                                <div key={product.id} className="col-lg-2 col-md-4 col-sm-12 product-card p-2">
                                    {product.originalPrice && (
                                        <span className="discount-badge">
                                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                        </span>
                                    )}

                                    <div className="img-sec">
                                        <img src={product.image} alt={product.name} />
                                        {product.badge && (
                                            <span className={`product-badge ${product.badge.toLowerCase()}`}>
                                                {product.badge}
                                            </span>
                                        )}
                                    </div>
                                    <div className="details-section">
                                        <p className="single-line-ellipsis">{product.name}</p>
                                        {renderStars(product.rating)}
                                        <div className="pricing mt-2 d-flex">
                                            <h5 className="main-price">${product.price.toFixed(2)}</h5>
                                            {product.originalPrice && (
                                                <del>${product.originalPrice.toFixed(2)}</del>
                                            )}
                                        </div>
                                        <div>
                                            <AddToCartButton product={product} />
                                        </div>
                                    </div>
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