// resources/js/components/FeatureProducts.jsx

import React from 'react';
import { Link } from '@inertiajs/react';

export default function FeatureProducts({ featureProducts = [] }) {
    if (!featureProducts || featureProducts.length === 0) {
        return null;
    }

    return (
        <div className="feature-product-section">
            <div className="container">
                <div className="row g-3 g-md-4">
                    {featureProducts.map((product) => (
                        <div key={product.id} className="col-12 col-sm-6 col-md-6 col-lg-4 mb-4">
                            <div 
                                className="featureProduct"
                                style={{
                                    backgroundImage: `url(${product.image || 'https://via.placeholder.com/400x220'})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderRadius: '10px',
                                    position: 'relative'
                                }}
                            >
                                {product.badge_text && (
                                    <span className="badge-promo">{product.badge_text}</span>
                                )}
                                <div className="feature-content">
                                    <p className='text01'>{product.title}</p>
                                    <h5 className='title'>{product.description}</h5>
                                    <div className="price-info">
                                        {product.price && (
                                            <span className="price">${product.price}</span>
                                        )}
                                        {product.original_price && product.original_price > product.price && (
                                            <del className="original-price">${product.original_price}</del>
                                        )}
                                    </div>
                                    <Link 
                                        className='shopBtn' 
                                        href={product.button_link || `/product/${product.product_slug}`}
                                    >
                                        {product.button_text || 'Shop Now'} <i className='fas fa-arrow-right'></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                /* FeatureProducts Responsive Styles */
                
                .feature-product-section {
                    margin-top: 30px;
                    margin-bottom: 30px;
                }
                
                .featureProduct {
                    padding: 25px;
                    height: 250px;
                    width: 100%;
                    margin-top: 0px !important;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    transition: all 0.3s ease;
                    overflow: hidden;
                }
                
                .featureProduct:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }
                
                .badge-promo {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: #DC2626;
                    color: white;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 600;
                    font-family: Inter;
                }
                
                .feature-content {
                    position: relative;
                    z-index: 1;
                }
                
                .featureProduct .text01 {
                    color: #EA580C;
                    font-family: Inter;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                    letter-spacing: -0.24px;
                    margin-bottom: 8px;
                }
                
                .featureProduct .title {
                    color: #111827;
                    font-family: Inter;
                    font-size: 20px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: 28px;
                    letter-spacing: -0.88px;
                    width: 80%;
                    word-break: break-word;
                    overflow-wrap: break-word;
                    margin-bottom: 10px;
                }
                
                .price-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 15px;
                }
                
                .price-info .price {
                    color: #DC2626;
                    font-family: Barlow;
                    font-size: 24px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: 24px;
                    letter-spacing: -0.48px;
                }
                
                .price-info .original-price {
                    color: #111827;
                    font-family: Barlow;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 16px;
                    letter-spacing: -0.44px;
                    text-decoration-line: line-through;
                }
                
                .featureProduct .shopBtn {
                    display: inline-flex;
                    width: 140px;
                    height: 45px;
                    padding: 10px 15px;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                    flex-shrink: 0;
                    border-radius: 999px;
                    border: 1px solid #E5E7EB;
                    background: #112066;
                    text-decoration: none;
                    color: #ffffff;
                    text-align: center;
                    font-family: Inter;
                    font-style: normal;
                    font-weight: 700;
                    letter-spacing: -0.24px;
                    font-size: 13px;
                    transition: all 0.3s ease;
                }
                
                .featureProduct .shopBtn:hover {
                    background: #0d1a52;
                    transform: scale(1.02);
                }
                
                /* Tablet (768px - 991px) */
                @media (min-width: 768px) and (max-width: 991px) {
                    .feature-product-section {
                        margin-top: 25px;
                        margin-bottom: 25px;
                    }
                    
                    .featureProduct {
                        height: 220px;
                        padding: 20px;
                    }
                    
                    .featureProduct .title {
                        font-size: 18px;
                        line-height: 26px;
                        width: 90%;
                    }
                    
                    .featureProduct .text01 {
                        font-size: 11px;
                    }
                    
                    .price-info .price {
                        font-size: 22px;
                    }
                    
                    .price-info .original-price {
                        font-size: 14px;
                    }
                    
                    .featureProduct .shopBtn {
                        width: 130px;
                        height: 42px;
                        font-size: 12px;
                    }
                    
                    .badge-promo {
                        font-size: 10px;
                        padding: 3px 10px;
                    }
                }
                
                /* Mobile (576px - 767px) */
                @media (min-width: 576px) and (max-width: 767px) {
                    .feature-product-section {
                        margin-top: 20px;
                        margin-bottom: 20px;
                    }
                    
                    .featureProduct {
                        height: 200px;
                        padding: 18px;
                    }
                    
                    .featureProduct .title {
                        font-size: 16px;
                        line-height: 24px;
                        width: 100%;
                    }
                    
                    .featureProduct .text01 {
                        font-size: 10px;
                    }
                    
                    .price-info .price {
                        font-size: 20px;
                    }
                    
                    .price-info .original-price {
                        font-size: 13px;
                    }
                    
                    .featureProduct .shopBtn {
                        width: 120px;
                        height: 38px;
                        font-size: 11px;
                        padding: 8px 12px;
                    }
                    
                    .badge-promo {
                        font-size: 9px;
                        padding: 3px 8px;
                    }
                }
                
                /* Small Mobile (up to 575px) */
                @media (max-width: 575px) {
                    .feature-product-section {
                        margin-top: 15px;
                        margin-bottom: 15px;
                    }
                    
                    .featureProduct {
                        height: auto;
                        min-height: 200px;
                        padding: 20px 15px;
                        text-align: center;
                    }
                    
                    .feature-content {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }
                    
                    .featureProduct .text01 {
                        font-size: 10px;
                        text-align: center;
                    }
                    
                    .featureProduct .title {
                        font-size: 16px;
                        line-height: 24px;
                        width: 100%;
                        text-align: center;
                    }
                    
                    .price-info {
                        justify-content: center;
                    }
                    
                    .price-info .price {
                        font-size: 20px;
                    }
                    
                    .price-info .original-price {
                        font-size: 13px;
                    }
                    
                    .featureProduct .shopBtn {
                        width: 130px;
                        height: 38px;
                        font-size: 11px;
                        margin: 0 auto;
                    }
                    
                    .badge-promo {
                        top: 10px;
                        right: 10px;
                        font-size: 9px;
                        padding: 2px 8px;
                    }
                }
                
                /* Extra Small Mobile (up to 380px) */
                @media (max-width: 380px) {
                    .featureProduct .title {
                        font-size: 14px;
                        line-height: 20px;
                    }
                    
                    .price-info .price {
                        font-size: 18px;
                    }
                    
                    .price-info .original-price {
                        font-size: 12px;
                    }
                    
                    .featureProduct .shopBtn {
                        width: 120px;
                        height: 35px;
                        font-size: 10px;
                    }
                }
                
                /* Landscape mode for mobile */
                @media (max-width: 767px) and (orientation: landscape) {
                    .featureProduct {
                        height: 180px;
                        min-height: 180px;
                        padding: 15px;
                    }
                    
                    .featureProduct .title {
                        font-size: 14px;
                        line-height: 20px;
                        margin-bottom: 8px;
                    }
                    
                    .price-info {
                        margin-bottom: 10px;
                    }
                    
                    .featureProduct .shopBtn {
                        height: 35px;
                        width: 110px;
                        font-size: 10px;
                    }
                }
                
                /* Grid gap adjustments */
                @media (max-width: 767px) {
                    .row {
                        --bs-gutter-x: 0.75rem;
                    }
                }
                
                @media (max-width: 575px) {
                    .row {
                        --bs-gutter-x: 0.5rem;
                    }
                    
                    .mb-4 {
                        margin-bottom: 0.75rem !important;
                    }
                }
                
                /* Touch optimization */
                @media (max-width: 767px) {
                    .featureProduct .shopBtn {
                        cursor: pointer;
                        -webkit-tap-highlight-color: transparent;
                    }
                    
                    .featureProduct .shopBtn:active {
                        transform: scale(0.97);
                    }
                    
                    .featureProduct {
                        transition: transform 0.2s ease;
                    }
                    
                    .featureProduct:active {
                        transform: scale(0.98);
                    }
                }
            `}</style>
        </div>
    );
}