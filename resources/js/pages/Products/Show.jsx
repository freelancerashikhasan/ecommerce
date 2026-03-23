// resources/js/Pages/Product/Show.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AddToCartButton from '@/Components/AddToCartButton';
import productPlaceholder from "../../assets/images/619.png";
import MainLayout from '../../Layout/MainLayout';

export default function Show({ product }) {
    const [selectedImage, setSelectedImage] = useState(product.featured_image || product.images?.[0]?.image_path);
    const [showZoom, setShowZoom] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);

    const imageRef = useRef(null);
    const zoomContainerRef = useRef(null);
    const magnifierRef = useRef(null);

    // Check screen size on mount and resize
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Handle mouse move for zoom
    const handleMouseMove = (e) => {
        if (isMobile || !imageRef.current || !zoomContainerRef.current) return;

        const { left, top, width, height } = imageRef.current.getBoundingClientRect();

        // Calculate mouse position relative to image
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        // Constrain values between 0 and 100
        const constrainedX = Math.min(100, Math.max(0, x));
        const constrainedY = Math.min(100, Math.max(0, y));

        setZoomPosition({ x: constrainedX, y: constrainedY });

        // Update magnifier position if using magnifier glass style
        if (magnifierRef.current) {
            const magnifierSize = 100;
            const magnifierLeft = (constrainedX / 100) * width - magnifierSize / 2;
            const magnifierTop = (constrainedY / 100) * height - magnifierSize / 2;

            magnifierRef.current.style.left = `${Math.max(0, Math.min(width - magnifierSize, magnifierLeft))}px`;
            magnifierRef.current.style.top = `${Math.max(0, Math.min(height - magnifierSize, magnifierTop))}px`;
        }
    };

    // Render star ratings (keeping your existing function)
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
        <MainLayout>
            <div className="product-details-wrapper py-4">
                <div className="container">
                    {/* Breadcrumb */}
                    <nav aria-label="breadcrumb" className="mb-4">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                            <li className="breadcrumb-item"><Link href="/products">Products</Link></li>
                            {product.categories && product.categories.length > 0 && (
                                <li className="breadcrumb-item">
                                    <Link href={`/category/${product.categories[0].slug}`}>
                                        {product.categories[0].name}
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
                                            maxHeight: '500px',
                                            maxHeight: '500px',
                                            objectFit: 'contain'
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
                                    <div className="thumbnail-images d-flex gap-2 mt-3">
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
                                                overflow: 'hidden'
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
                                                    overflow: 'hidden'
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

                                {/* Ratings */}
                                <div className="product-ratings mb-3">
                                    {renderStars(product.average_rating || 4.0)}
                                    <span className="ms-3 text-muted">
                                        ({product.reviews_count || 0} reviews)
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="product-price mb-3">
                                    {product.sale_price ? (
                                        <>
                                            <h2 className="text-primary d-inline">
                                                ${parseFloat(product.sale_price)}
                                            </h2>
                                            <del className="ms-3 text-muted">
                                                ${parseFloat(product.regular_price)}
                                            </del>
                                            <span className="badge bg-success ms-3">
                                                Save ${(product.regular_price - product.sale_price)}
                                            </span>
                                        </>
                                    ) : (
                                        <h2 className="text-primary">
                                            ${parseFloat(product.regular_price)}
                                        </h2>
                                    )}
                                </div>

                                {/* Stock Status */}
                                <div className="stock-status mb-3">
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
                                    {product.manage_stock && product.stock_quantity > 0 && (
                                        <span className="ms-3 text-muted">
                                            ({product.stock_quantity} available)
                                        </span>
                                    )}
                                </div>

                                {/* Short Description */}
                                {product.short_description && (
                                    <div className="short-description mb-4">
                                        <p className="text-muted">{product.short_description}</p>
                                    </div>
                                )}

                                {/* Add to Cart */}
                                <div className="add-to-cart-section mb-4">
                                    <AddToCartButton product={product} />
                                </div>

                                {/* Product Meta */}
                                <div className="product-meta border-top pt-3">
                                    {product.sku && (
                                        <p className="mb-2">
                                            <strong>SKU:</strong> {product.sku}
                                        </p>
                                    )}
                                    {product.categories && product.categories.length > 0 && (
                                        <p className="mb-2">
                                            <strong>Categories:</strong>{' '}
                                            {product.categories.map((cat, index) => (
                                                <React.Fragment key={cat.id}>
                                                    {index > 0 && ', '}
                                                    <Link href={`/category/${cat.slug}`} className="text-decoration-none">
                                                        {cat.name}
                                                    </Link>
                                                </React.Fragment>
                                            ))}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Tabs - Description, Specifications, Additional Info */}
                    <div className="product-tabs mt-5">
                        <ul className="nav nav-tabs" id="productTab" role="tablist">
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
                            )}

                            {product.additional_info && Object.keys(product.additional_info).length > 0 && (
                                <div className="tab-pane fade" id="additional" role="tabpanel">
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
                            )}
                        </div>
                    </div>

                    {/* Related Products */}
                    {product.related_products && product.related_products.length > 0 && (
                        <div className="related-products mt-5">
                            <h3 className="mb-4">Related Products</h3>
                            <div className="row">
                                {product.related_products.map(related => (
                                    <div key={related.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                                        <div className="product-card h-100">
                                            <Link href={`/product/${related.slug}`}>
                                                <img
                                                    src={related.featured_image ? `/storage/${related.featured_image}` : productPlaceholder}
                                                    alt={related.name}
                                                    className="img-fluid"
                                                />
                                            </Link>
                                            <div className="details-section p-2">
                                                <Link href={`/product/${related.slug}`} className="text-decoration-none text-dark">
                                                    <p className="single-line-ellipsis">{related.name}</p>
                                                </Link>
                                                <div className="pricing mt-2">
                                                    <h6 className="main-price">
                                                        ${(related.sale_price || related.regular_price)}
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Zoom Modal (for small screens) */}
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
                            maxWidth: '500px',
                            maxHeight: '500px',
                            objectFit: 'contain'
                        }}
                    />
                    <button
                        className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                        onClick={() => setShowZoom(false)}
                    />
                </div>
            )}
        </MainLayout>
    );
}
