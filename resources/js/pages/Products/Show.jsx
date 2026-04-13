// resources/js/Pages/Product/Show.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AddToCartButton from '@/Components/AddToCartButton';
import productPlaceholder from "../../assets/images/619.png";
import MainLayout from '../../Layout/MainLayout';
import '../../assets/css/productDetails.css';
import { useCart } from '../../contexts/CartContext';
import orderIcon from '../../assets/images/order.svg';
import sheild from '../../assets/images/sheild.svg';
import love from '../../assets/images/love.svg';
import share from '../../assets/images/share.svg';
import transfer from '../../assets/images/transfer.svg';
import DetailsCartButton from '../../components/DetailsCartButton';

export default function Show({ product }) {
    const [selectedImage, setSelectedImage] = useState(product.featured_image || product.images?.[0]?.image_path);
    const [showZoom, setShowZoom] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    const imageRef = useRef(null);
    const zoomContainerRef = useRef(null);
    const magnifierRef = useRef(null);

    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const handleAddToCart = (e) => {
        e.preventDefault();
        setIsAdding(true);

        setTimeout(() => {
            addToCart(product, 1);
            setIsAdding(false);
        }, 300);
    };
    
    // Check screen size on mount and resize
    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            setIsMobile(width <= 768);
            setIsTablet(width > 768 && width <= 1024);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Handle mouse move for zoom
    const handleMouseMove = (e) => {
        if (isMobile || !imageRef.current || !zoomContainerRef.current) return;

        const { left, top, width, height } = imageRef.current.getBoundingClientRect();

        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        const constrainedX = Math.min(100, Math.max(0, x));
        const constrainedY = Math.min(100, Math.max(0, y));

        setZoomPosition({ x: constrainedX, y: constrainedY });

        if (magnifierRef.current) {
            const magnifierSize = 100;
            const magnifierLeft = (constrainedX / 100) * width - magnifierSize / 2;
            const magnifierTop = (constrainedY / 100) * height - magnifierSize / 2;

            magnifierRef.current.style.left = `${Math.max(0, Math.min(width - magnifierSize, magnifierLeft))}px`;
            magnifierRef.current.style.top = `${Math.max(0, Math.min(height - magnifierSize, magnifierTop))}px`;
        }
    };

    // Render star ratings
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
                <strong className='ms-3 reviews'>{rating.toFixed(1)}</strong>
            </div>
        );
    };

    return (
        <MainLayout>
            <div className="product-details-wrapper py-4">
                <div className="container">
                    {/* Breadcrumb */}
                    <nav aria-label="breadcrumb" className="mb-4">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                            <li className="breadcrumb-item"><Link href="/products">Products</Link></li>
                            {product.category && (
                                <li className="breadcrumb-item">
                                    <Link href={`/category/${product.category.slug}`}>
                                        {product.category.name}
                                    </Link>
                                </li>
                            )}
                            <li className="breadcrumb-item active" aria-current="page">
                                {product.name}
                            </li>
                        </ol>
                    </nav>

                    {/* Product Main Section */}
                    <div className="row">
                        {/* Image Gallery Section */}
                        <div className="col-lg-6 mb-4">
                            <div className="product-image-gallery">
                                {/* Main Image with Zoom */}
                                <div
                                    className="main-image-container position-relative mb-3"
                                    onMouseEnter={() => !isMobile && setShowZoom(true)}
                                    onMouseLeave={() => !isMobile && setShowZoom(false)}
                                    onMouseMove={handleMouseMove}
                                    ref={imageRef}
                                >
                                    <img
                                        src={selectedImage ? `/storage/${selectedImage}` : productPlaceholder}
                                        alt={product.name}
                                        className="img-fluid w-100"
                                        style={{
                                            cursor: isMobile ? 'default' : 'zoom-in',
                                            borderRadius: '10px',
                                            maxHeight: '500px',
                                            objectFit: 'contain',
                                            width: '100%'
                                        }}
                                    />

                                    {/* Magnifying Glass (desktop only) */}
                                    {!isMobile && showZoom && (
                                        <div
                                            ref={magnifierRef}
                                            className="magnifying-glass"
                                            style={{
                                                position: 'absolute',
                                                width: '100px',
                                                height: '100px',
                                                border: '2px solid #fff',
                                                borderRadius: '50%',
                                                boxShadow: '0 0 10px rgba(0,0,0,0.3)',
                                                backgroundColor: 'rgba(255,255,255,0.3)',
                                                pointerEvents: 'none',
                                                zIndex: 10
                                            }}
                                        />
                                    )}
                                </div>

                                {/* Zoom Preview (desktop only) */}
                                {!isMobile && showZoom && (
                                    <div
                                        ref={zoomContainerRef}
                                        className="zoom-preview"
                                        style={{
                                            position: 'fixed',
                                            right: '20px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: '400px',
                                            height: '400px',
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            backgroundColor: '#fff',
                                            boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
                                            zIndex: 1000
                                        }}
                                    >
                                        <img
                                            src={selectedImage ? `/storage/${selectedImage}` : productPlaceholder}
                                            alt={product.name}
                                            style={{
                                                position: 'absolute',
                                                width: '800px',
                                                height: '800px',
                                                maxWidth: 'none',
                                                transform: `translate(-${zoomPosition.x}%, -${zoomPosition.y}%)`,
                                                transformOrigin: '0 0'
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Thumbnail Images */}
                                {(product.images && product.images.length > 0) && (
                                    <div className="thumbnail-images d-flex gap-2 mt-3 flex-wrap">
                                        {/* Featured image thumbnail */}
                                        <div
                                            className={`thumbnail-item ${!selectedImage || selectedImage === product.featured_image ? 'active' : ''}`}
                                            onClick={() => setSelectedImage(product.featured_image)}
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                border: selectedImage === product.featured_image ? '2px solid #007bff' : '1px solid #ddd',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                overflow: 'hidden',
                                                flexShrink: 0
                                            }}
                                        >
                                            <img
                                                src={product.featured_image ? `/storage/${product.featured_image}` : productPlaceholder}
                                                alt={product.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </div>

                                        {/* Gallery images thumbnails */}
                                        {product.images.map((image, index) => (
                                            <div
                                                key={image.id}
                                                className={`thumbnail-item ${selectedImage === image.image_path ? 'active' : ''}`}
                                                onClick={() => setSelectedImage(image.image_path)}
                                                style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    border: selectedImage === image.image_path ? '2px solid #007bff' : '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    overflow: 'hidden',
                                                    flexShrink: 0
                                                }}
                                            >
                                                <img
                                                    src={`/storage/${image.image_path}`}
                                                    alt={`${product.name} - ${index + 1}`}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Details Section */}
                        <div className="col-lg-6">
                            <div className="product-info">
                                {/* Product Title */}
                                <h1 className="product-title mb-3">{product.name}</h1>
                                <div className="product-meta pb-2">
                                    {product.category && (
                                        <p className="mb-2 categories">
                                            <React.Fragment key={product.category.id}>
                                                <Link href={`/category/${product.category.slug}`} className="text-decoration-none">
                                                    {product.category.name}
                                                </Link>
                                            </React.Fragment>
                                        </p>
                                    )}
                                </div>

                                {/* Ratings */}
                                <div className="d-flex product-ratings mb-3 flex-wrap align-items-center">
                                    {renderStars(product.average_rating || 4.0)}
                                    <span className="ms-1 text-muted review-count">
                                        ({product.reviews_count || 0} reviews)
                                    </span>
                                    
                                    <span className="ms-3 text-muted review-count">
                                        {product.sku && (
                                            <>
                                                <span className='me-2'>| SKU:</span>
                                                <span className='text-dark'>{product.sku}</span>
                                            </>
                                        )}
                                    </span>
                                </div>
                                <hr />
                                <p className='text-inter pb-3'>{product.short_description ? (
                                    <div dangerouslySetInnerHTML={{ __html: product.short_description }} />
                                ) : (
                                    <p className="text-muted">No description available.</p>
                                )}</p>

                                {/* Price */}  
                                <div className="product-price d-flex mb-3 flex-wrap align-items-center">
                                    <div>
                                        {product.sale_price ? (
                                            <>
                                                <h2 className="text-danger f-bold d-inline">
                                                    ${parseFloat(product.sale_price).toFixed(2)}
                                                </h2>
                                                <del className="ms-2 text-muted">
                                                    ${parseFloat(product.regular_price).toFixed(2)}
                                                </del>
                                                <span className="badge bg-success ms-3">
                                                    Save ${(product.regular_price - product.sale_price).toFixed(2)}
                                                </span>
                                            </>
                                        ) : (
                                            <h2 className="text-primary">
                                                ${parseFloat(product.regular_price).toFixed(2)}
                                            </h2>
                                        )}
                                    </div>

                                    {/* Stock Status */}
                                    <div className="stock-status mb-3 pt-3 ms-2">
                                        {product.in_stock ? (
                                            <span className="text-success">
                                                <i className="fas fa-check-circle me-2"></i>
                                                In Stock
                                            </span>
                                        ) : (
                                            <span className="text-danger">
                                                <i className="fas fa-times-circle me-2"></i>
                                                Out of Stock
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Add to Cart */}
                                <div className="add-to-cart-section mb-4 d-flex flex-wrap gap-3">
                                    <button
                                        onClick={handleAddToCart}
                                        className={`detailsCartbtn ${isAdding ? 'adding' : ''}`}
                                        disabled={isAdding}
                                    >
                                        {isAdding ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                                                Adding...
                                            </>
                                        ) : (
                                            <div className='d-flex justify-center align-items-center'>
                                                <img src={orderIcon} alt="Add to cart" className="me-2" /> 
                                                Add to cart
                                            </div>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleAddToCart}
                                        className={`detailsOrderbtn ${isAdding ? 'adding' : ''}`}
                                        disabled={isAdding}
                                    >
                                        {isAdding ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                                                Adding...
                                            </>
                                        ) : (
                                            <div className='d-flex justify-center align-items-center'>
                                                <img src={orderIcon} alt="Add to cart" className="me-2" /> 
                                                Buy Now
                                            </div>
                                        )}
                                    </button>
                                </div>
                                
                                <div className='credit-card-section'>
                                    <div className='d-flex flex-sm-row flex-column'>
                                        <div className='credit-card'><i className="fas fa-credit-card"></i></div>
                                        <div className='credit-card-text'><span className='f-bold'>Payment.</span> Payment upon receipt of goods, Payment by card in the department, Google Pay, Online card, -5% discount in case of payment</div>
                                    </div>
                                    <hr />
                                    <div className='d-flex flex-sm-row flex-column'>
                                        <div className='credit-card'>
                                            <img src={sheild} alt="Warranty" className="me-2" />
                                        </div>
                                        <div className='credit-card-text'><span className='f-bold'>Warranty.</span> The Consumer Protection Act does not provide for the return of this product of proper quality.</div>
                                    </div>
                                </div>
                                
                                <div className='share-section mt-4'>
                                    <div className='d-flex flex-wrap gap-2'>
                                        <button className='d-flex share-btn me-3'>
                                            <img src={love} alt="Add to wishlist" className="me-2" />
                                            <span>Add to wishlist</span>
                                        </button>
                                        <button className='d-flex share-btn me-3'>
                                            <img src={share} alt="Share" className="me-2" />
                                            <span>Share</span>
                                        </button>
                                        <button className='d-flex share-btn'>
                                            <img src={transfer} alt="Compare" className="me-2" />
                                            <span>Compare</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Tabs */}
                    <div className="product-tabs mt-5">
                        <ul className="nav nav-tabs flex-nowrap overflow-auto" id="productTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" id="description-tab" data-bs-toggle="tab" data-bs-target="#description" type="button" role="tab">
                                    Description
                                </button>
                            </li>
                            {product.specifications && Object.keys(product.specifications).length > 0 && (
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="specifications-tab" data-bs-toggle="tab" data-bs-target="#specifications" type="button" role="tab">
                                        Specifications
                                    </button>
                                </li>
                            )}
                            {product.additional_info && Object.keys(product.additional_info).length > 0 && (
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="additional-tab" data-bs-toggle="tab" data-bs-target="#additional" type="button" role="tab">
                                        Additional Info
                                    </button>
                                </li>
                            )}
                        </ul>

                        <div className="tab-content p-3 border border-top-0" id="productTabContent">
                            <div className="tab-pane fade show active" id="description" role="tabpanel">
                                {product.description ? (
                                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                ) : (
                                    <p className="text-muted">No description available.</p>
                                )}
                            </div>

                            {product.specifications && Object.keys(product.specifications).length > 0 && (
                                <div className="tab-pane fade" id="specifications" role="tabpanel">
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <tbody>
                                                {Object.entries(product.specifications).map(([key, value]) => (
                                                    <tr key={key}>
                                                        <th style={{ width: '200px' }}>{key}</th>
                                                        <td>{value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {product.additional_info && Object.keys(product.additional_info).length > 0 && (
                                <div className="tab-pane fade" id="additional" role="tabpanel">
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <tbody>
                                                {Object.entries(product.additional_info).map(([key, value]) => (
                                                    <tr key={key}>
                                                        <th style={{ width: '200px' }}>{key}</th>
                                                        <td>{value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related Products */}
                    {product.related_products && product.related_products.length > 0 && (
                        <div className="related-products mt-5 related-product">
                            <h3 className="mb-4">Related Products</h3>
                            <div className="row g-3">
                                {product.related_products.map(related => (
                                    <div key={related.id} className="col-lg-2 col-md-4 col-sm-6 col-6 product-card p-2">
                                        <div style={{ textDecoration: 'none' }}>
                                            {related.regular_price && related.sale_price && related.regular_price > related.sale_price && (
                                                <span className="discount-badge">
                                                    {Math.round(((related.regular_price - related.sale_price) / related.regular_price) * 100)}%
                                                </span>
                                            )}
                                            
                                            {related.badge && (
                                                <span className={`product-badge absolute ${related.badge.toLowerCase()}`}>
                                                    {related.badge}
                                                </span>
                                            )}
                                            
                                            <Link href={`/product/${related.slug}`} style={{ textDecoration: 'none' }}>
                                                <div className="img-sec">
                                                    <img
                                                        src={related.featured_image ? `/storage/${related.featured_image}` : productPlaceholder}
                                                        alt={related.name}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = productPlaceholder;
                                                        }}
                                                    />
                                                </div>
                                                <div className="details-section">
                                                    <p className="single-line-ellipsis">{related.name}</p>
                                                    {renderStars(related.average_rating || 4.0)}
                                                    <div className="pricing mt-2 d-flex align-items-center">
                                                        <h5 className="main-price mb-0">
                                                            ${parseFloat(related.sale_price || related.regular_price).toFixed(2)}
                                                        </h5>
                                                        {related.regular_price && related.sale_price && related.regular_price > related.sale_price && (
                                                            <del className="mb-0 ms-2">${parseFloat(related.regular_price).toFixed(2)}</del>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                            <div className="mt-2">
                                                <DetailsCartButton product={related} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Zoom Modal */}
            {isMobile && showZoom && (
                <div
                    className="mobile-zoom-modal"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        zIndex: 1050,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'zoom-out'
                    }}
                    onClick={() => setShowZoom(false)}
                >
                    <img
                        src={selectedImage ? `/storage/${selectedImage}` : productPlaceholder}
                        alt={product.name}
                        style={{
                            maxWidth: '90%',
                            maxHeight: '90%',
                            objectFit: 'contain'
                        }}
                    />
                    <button
                        className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                        onClick={() => setShowZoom(false)}
                    />
                </div>
            )}

            <style>{`
                /* Responsive Styles for Product Details Page */
                
                /* Tablet (768px - 1024px) */
                @media (min-width: 768px) and (max-width: 1024px) {
                    .product-details-wrapper .product-title {
                        font-size: 28px !important;
                    }
                    
                    .product-details-wrapper .detailsCartbtn,
                    .product-details-wrapper .detailsOrderbtn {
                        width: 140px !important;
                        height: 42px !important;
                        font-size: 14px !important;
                    }
                    
                    .thumbnail-images {
                        gap: 8px !important;
                    }
                    
                    .thumbnail-item {
                        width: 60px !important;
                        height: 60px !important;
                    }
                    
                    .credit-card {
                        padding: 15px !important;
                    }
                    
                    .credit-card img {
                        width: 40px !important;
                    }
                    
                    .share-btn {
                        width: auto !important;
                        padding: 0 12px !important;
                    }
                    
                    .share-btn img {
                        width: 32px !important;
                        height: 32px !important;
                    }
                    
                    .zoom-preview {
                        width: 300px !important;
                        height: 300px !important;
                        right: 10px !important;
                    }
                }
                
                /* Mobile (576px - 767px) */
                @media (min-width: 576px) and (max-width: 767px) {
                    .product-details-wrapper .product-title {
                        font-size: 24px !important;
                    }
                    
                    .product-details-wrapper .detailsCartbtn,
                    .product-details-wrapper .detailsOrderbtn {
                        width: 130px !important;
                        height: 40px !important;
                        font-size: 13px !important;
                    }
                    
                    .product-details-wrapper .reviews {
                        font-size: 12px !important;
                    }
                    
                    .product-price h2 {
                        font-size: 24px !important;
                    }
                    
                    .thumbnail-item {
                        width: 50px !important;
                        height: 50px !important;
                    }
                    
                    .credit-card {
                        padding: 12px !important;
                        font-size: 20px !important;
                    }
                    
                    .credit-card img {
                        width: 35px !important;
                    }
                    
                    .credit-card-text {
                        font-size: 13px !important;
                        padding: 8px !important;
                    }
                    
                    .share-btn {
                        width: auto !important;
                        padding: 0 10px !important;
                    }
                    
                    .share-btn img {
                        width: 28px !important;
                        height: 28px !important;
                    }
                    
                    .share-btn span {
                        font-size: 12px !important;
                    }
                    
                    .nav-tabs .nav-link {
                        padding: 8px 12px !important;
                        font-size: 14px !important;
                    }
                    
                    .related-product .product-card .img-sec {
                        height: 140px !important;
                    }
                }
                
                /* Small Mobile (up to 575px) */
                @media (max-width: 575px) {
                    .product-details-wrapper .product-title {
                        font-size: 20px !important;
                    }
                    
                    .product-details-wrapper .breadcrumb li a,
                    .product-details-wrapper .breadcrumb .active {
                        font-size: 12px !important;
                    }
                    
                    .product-details-wrapper .reviews {
                        font-size: 11px !important;
                        padding: 2px 4px !important;
                    }
                    
                    .product-details-wrapper .review-count {
                        font-size: 12px !important;
                    }
                    
                    .product-price h2 {
                        font-size: 20px !important;
                    }
                    
                    .product-price .badge {
                        font-size: 10px !important;
                        margin-top: 5px !important;
                        display: inline-block !important;
                    }
                    
                    .product-details-wrapper .detailsCartbtn,
                    .product-details-wrapper .detailsOrderbtn {
                        width: 100% !important;
                        height: 40px !important;
                        font-size: 14px !important;
                    }
                    
                    .add-to-cart-section {
                        flex-direction: column !important;
                        width: 100% !important;
                    }
                    
                    .thumbnail-images {
                        gap: 6px !important;
                        justify-content: center !important;
                    }
                    
                    .thumbnail-item {
                        width: 45px !important;
                        height: 45px !important;
                    }
                    
                    .credit-card {
                        padding: 10px !important;
                        font-size: 18px !important;
                        text-align: center !important;
                    }
                    
                    .credit-card img {
                        width: 30px !important;
                    }
                    
                    .credit-card-text {
                        font-size: 12px !important;
                        padding: 8px !important;
                        text-align: center !important;
                    }
                    
                    .share-section {
                        text-align: center !important;
                    }
                    
                    .share-section .d-flex {
                        justify-content: center !important;
                    }
                    
                    .share-btn {
                        width: auto !important;
                        padding: 0 8px !important;
                        margin: 0 5px !important;
                    }
                    
                    .share-btn img {
                        width: 24px !important;
                        height: 24px !important;
                    }
                    
                    .share-btn span {
                        font-size: 11px !important;
                    }
                    
                    .nav-tabs {
                        flex-wrap: nowrap !important;
                        overflow-x: auto !important;
                        -webkit-overflow-scrolling: touch !important;
                    }
                    
                    .nav-tabs .nav-link {
                        white-space: nowrap !important;
                        padding: 6px 12px !important;
                        font-size: 13px !important;
                    }
                    
                    .tab-content {
                        padding: 15px !important;
                    }
                    
                    .tab-content p,
                    .tab-content li {
                        font-size: 13px !important;
                    }
                    
                    .table th,
                    .table td {
                        font-size: 12px !important;
                        padding: 8px !important;
                    }
                    
                    .related-product h3 {
                        font-size: 20px !important;
                    }
                    
                    .related-product .product-card {
                        margin-bottom: 10px !important;
                    }
                    
                    .related-product .product-card .img-sec {
                        height: 120px !important;
                    }
                    
                    .related-product .details-section p {
                        font-size: 11px !important;
                    }
                    
                    .related-product .main-price {
                        font-size: 14px !important;
                    }
                    
                    .related-product del {
                        font-size: 11px !important;
                    }
                    
                    .related-product .star-sec i {
                        font-size: 9px !important;
                    }
                    
                    .related-product .star-sec strong {
                        font-size: 10px !important;
                    }
                    
                    .related-product .cartbtn {
                        height: 28px !important;
                        font-size: 9px !important;
                        padding: 4px 6px !important;
                    }
                }
                
                /* Extra Small Mobile (up to 380px) */
                @media (max-width: 380px) {
                    .product-details-wrapper .product-title {
                        font-size: 18px !important;
                    }
                    
                    .product-price h2 {
                        font-size: 18px !important;
                    }
                    
                    .thumbnail-item {
                        width: 40px !important;
                        height: 40px !important;
                    }
                    
                    .credit-card {
                        padding: 8px !important;
                        font-size: 16px !important;
                    }
                    
                    .credit-card img {
                        width: 25px !important;
                    }
                    
                    .credit-card-text {
                        font-size: 11px !important;
                    }
                    
                    .share-btn span {
                        font-size: 10px !important;
                    }
                    
                    .related-product .product-card .img-sec {
                        height: 100px !important;
                    }
                }
                
                /* Landscape mode for mobile */
                @media (max-width: 767px) and (orientation: landscape) {
                    .product-details-wrapper .product-title {
                        font-size: 22px !important;
                    }
                    
                    .product-image-gallery .main-image-container img {
                        max-height: 300px !important;
                    }
                    
                    .thumbnail-item {
                        width: 50px !important;
                        height: 50px !important;
                    }
                    
                    .credit-card-section {
                        margin-top: 15px !important;
                    }
                    
                    .share-section {
                        margin-top: 15px !important;
                    }
                }
                
                /* Ensure proper spacing on all devices */
                .product-details-wrapper {
                    overflow-x: hidden !important;
                }
                
                .table-responsive {
                    overflow-x: auto !important;
                    -webkit-overflow-scrolling: touch !important;
                }
                
                /* Improve touch targets on mobile */
                @media (max-width: 767px) {
                    button,
                    .share-btn,
                    .thumbnail-item,
                    .nav-link {
                        cursor: pointer !important;
                        -webkit-tap-highlight-color: transparent !important;
                    }
                    
                    button:active,
                    .share-btn:active {
                        opacity: 0.8 !important;
                    }
                }
            `}</style>
        </MainLayout>
    );
}