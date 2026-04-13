// resources/js/components/CardSection.jsx

import React from 'react';
import svg01 from "../assets/images/svg01.svg";
import svg02 from "../assets/images/svg02.svg";
import svg03 from "../assets/images/svg03.svg";
import svg04 from "../assets/images/svg04.svg";
import feature from "../assets/images/slider-01.png";

export default function CardSection({ featureCards = [], featureProducts = [] }) {
    // Default cards if no data from database
    const defaultCards = [
        {
            id: 1,
            icon: svg01,
            title: "Payment only online",
            description: "Tasigförsamhet beteendedesign. Mobile checkout. Ylig kärrtorpa."
        },
        {
            id: 2,
            icon: svg02,
            title: "New stocks and sales",
            description: "Tasigförsamhet beteendedesign. Mobile checkout. Ylig kärrtorpa."
        },
        {
            id: 3,
            icon: svg03,
            title: "Quality assurance",
            description: "Tasigförsamhet beteendedesign. Mobile checkout. Ylig kärrtorpa."
        },
        {
            id: 4,
            icon: svg04,
            title: "Delivery from 1 hour",
            description: "Tasigförsamhet beteendedesign. Mobile checkout. Ylig kärrtorpa."
        }
    ];

    // Default feature products if no data from database
    const defaultFeatureProducts = [
        {
            id: 1,
            badge: "Only This Week",
            title: "Quality eggs at an affordable price",
            description: "Eat one every day",
            image: feature,
            buttonText: "Shop Now",
            buttonLink: "/shop"
        },
        {
            id: 2,
            badge: "Only This Week",
            title: "Quality eggs at an affordable price",
            description: "Eat one every day",
            image: feature,
            buttonText: "Shop Now",
            buttonLink: "/shop"
        },
        {
            id: 3,
            badge: "Only This Week",
            title: "Quality eggs at an affordable price",
            description: "Eat one every day",
            image: feature,
            buttonText: "Shop Now",
            buttonLink: "/shop"
        }
    ];

    const displayCards = defaultCards;
    const displayProducts = featureProducts && featureProducts.length > 0 ? featureProducts : defaultFeatureProducts;

    return (
        <>
            <div className='cardSection'>
                <div className="container">
                    <div className="row g-3 g-md-4">
                        {displayCards.map((card, index) => (
                            <div key={card.id} className="col-6 col-md-6 col-lg-3 d-flex feature-card">
                                <div className="feature-card-inner">
                                    <div className="feature-card-icon">
                                        <img src={card.icon || (index === 0 ? svg01 : index === 1 ? svg02 : index === 2 ? svg03 : svg04)} alt={card.title} />
                                    </div>
                                    <div className="feature-card-content">
                                        <h5>{card.title}</h5>
                                        <p>{card.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="feature-product-section">
                <div className="container">
                    <div className="row g-3 g-md-4">
                        {displayProducts.map((product) => (
                            <div key={product.id} className="col-md-6 col-lg-4">
                                <div 
                                    className="featureProduct"
                                    style={{
                                        backgroundImage: `url(${product.image || feature})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        borderRadius: '10px',
                                        position: 'relative'
                                    }}
                                >
                                    <p className='text01'>{product.badge_text || product.badge || 'Only This Week'}</p>
                                    <h5 className='title'>{product.title}</h5>
                                    <p className='text02'>{product.description || 'Eat one every day'}</p>
                                    <a 
                                        className='shopBtn' 
                                        href={product.button_link || product.buttonLink || '/shop'}
                                    >
                                        {product.button_text || product.buttonText || 'Shop Now'} 
                                        <i className='fas fa-arrow-right'></i>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                /* CardSection Responsive Styles */
                
                /* Desktop styles preserved */
                .cardSection {
                    margin-top: 50px;
                }
                
                .feature-card {
                    margin-bottom: 20px;
                }
                
                .feature-card-inner {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                    width: 100%;
                }
                
                .feature-card-icon {
                    flex-shrink: 0;
                }
                
                .feature-card-icon img {
                    width: 56px;
                    height: 57px;
                    object-fit: contain;
                }
                
                .feature-card-content {
                    flex: 1;
                }
                
                .feature-card h5 {
                    color: #030712;
                    font-family: Inter;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: normal;
                    letter-spacing: -0.32px;
                    margin-bottom: 8px;
                }
                
                .feature-card p {
                    color: #6B7280;
                    font-family: Inter;
                    font-size: 13px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 18.21px;
                    letter-spacing: -0.32px;
                    margin: 0;
                }
                
                /* Feature Products Styles */
                .feature-product-section {
                    margin-top: 50px;
                }
                
                .featureProduct {
                    padding: 20px;
                    height: 250px;
                    width: 100%;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    transition: transform 0.3s ease;
                }
                
                .featureProduct:hover {
                    transform: translateY(-5px);
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
                    font-size: 22px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: 30px;
                    letter-spacing: -0.88px;
                    width: 80%;
                    word-break: break-word;
                    overflow-wrap: break-word;
                    margin-bottom: 12px;
                }
                
                .featureProduct .text02 {
                    color: #6B7280;
                    font-family: Inter;
                    font-size: 13px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 19.51px;
                    letter-spacing: -0.32px;
                    margin-bottom: 20px;
                }
                
                .featureProduct .shopBtn {
                    display: inline-flex;
                    width: 140px;
                    height: 50px;
                    padding: 12px 13px 10px 13px;
                    justify-content: center;
                    align-items: center;
                    gap: 5.624px;
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
                
                .featureProduct .shopBtn i {
                    padding-top: 2px;
                }
                
                /* Tablet (768px - 991px) */
                @media (min-width: 768px) and (max-width: 991px) {
                    .cardSection {
                        margin-top: 40px;
                    }
                    
                    .feature-card {
                        margin-bottom: 25px;
                    }
                    
                    .feature-card-inner {
                        gap: 12px;
                    }
                    
                    .feature-card-icon img {
                        width: 48px;
                        height: 49px;
                    }
                    
                    .feature-card h5 {
                        font-size: 15px;
                        margin-bottom: 6px;
                    }
                    
                    .feature-card p {
                        font-size: 12px;
                        line-height: 17px;
                    }
                    
                    .feature-product-section {
                        margin-top: 40px;
                    }
                    
                    .featureProduct {
                        height: 220px;
                        padding: 18px;
                    }
                    
                    .featureProduct .title {
                        font-size: 18px;
                        line-height: 26px;
                        width: 90%;
                    }
                    
                    .featureProduct .text01 {
                        font-size: 11px;
                    }
                    
                    .featureProduct .text02 {
                        font-size: 12px;
                        line-height: 18px;
                        margin-bottom: 15px;
                    }
                    
                    .featureProduct .shopBtn {
                        width: 130px;
                        height: 45px;
                        font-size: 12px;
                        padding: 10px 12px;
                    }
                }
                
                /* Mobile (576px - 767px) */
                @media (min-width: 576px) and (max-width: 767px) {
                    .cardSection {
                        margin-top: 30px;
                    }
                    
                    .feature-card {
                        margin-bottom: 20px;
                    }
                    
                    .feature-card-inner {
                        gap: 10px;
                    }
                    
                    .feature-card-icon img {
                        width: 42px;
                        height: 43px;
                    }
                    
                    .feature-card h5 {
                        font-size: 14px;
                        margin-bottom: 5px;
                    }
                    
                    .feature-card p {
                        font-size: 11px;
                        line-height: 16px;
                    }
                    
                    .feature-product-section {
                        margin-top: 30px;
                    }
                    
                    .featureProduct {
                        height: 200px;
                        padding: 15px;
                        margin-bottom: 20px;
                    }
                    
                    .featureProduct .title {
                        font-size: 16px;
                        line-height: 24px;
                        width: 100%;
                    }
                    
                    .featureProduct .text01 {
                        font-size: 10px;
                    }
                    
                    .featureProduct .text02 {
                        font-size: 11px;
                        line-height: 17px;
                        margin-bottom: 12px;
                    }
                    
                    .featureProduct .shopBtn {
                        width: 120px;
                        height: 40px;
                        font-size: 11px;
                        padding: 8px 10px;
                    }
                }
                
                /* Small Mobile (up to 575px) */
                @media (max-width: 575px) {
                    .cardSection {
                        margin-top: 25px;
                    }
                    
                    .feature-card {
                        margin-bottom: 18px;
                    }
                    
                    .feature-card-inner {
                        gap: 10px;
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }
                    
                    .feature-card-icon img {
                        width: 40px;
                        height: 41px;
                    }
                    
                    .feature-card h5 {
                        font-size: 13px;
                        margin-bottom: 4px;
                    }
                    
                    .feature-card p {
                        font-size: 10px;
                        line-height: 15px;
                    }
                    
                    .feature-product-section {
                        margin-top: 25px;
                    }
                    
                    .featureProduct {
                        height: auto;
                        min-height: 200px;
                        padding: 20px 15px;
                        margin-bottom: 15px;
                        text-align: center;
                    }
                    
                    .featureProduct .title {
                        font-size: 16px;
                        line-height: 24px;
                        width: 100%;
                        text-align: center;
                    }
                    
                    .featureProduct .text01 {
                        font-size: 10px;
                        text-align: center;
                    }
                    
                    .featureProduct .text02 {
                        font-size: 11px;
                        line-height: 17px;
                        margin-bottom: 15px;
                        text-align: center;
                    }
                    
                    .featureProduct .shopBtn {
                        width: 130px;
                        height: 38px;
                        font-size: 11px;
                        padding: 8px 12px;
                        margin: 0 auto;
                        justify-content: center;
                    }
                    
                    .featureProduct .shopBtn i {
                        padding-top: 1px;
                    }
                }
                
                /* Extra Small Mobile (up to 380px) */
                @media (max-width: 380px) {
                    .feature-card-icon img {
                        width: 35px;
                        height: 36px;
                    }
                    
                    .feature-card h5 {
                        font-size: 12px;
                    }
                    
                    .feature-card p {
                        font-size: 9px;
                        line-height: 14px;
                    }
                    
                    .featureProduct .title {
                        font-size: 14px;
                        line-height: 20px;
                    }
                    
                    .featureProduct .text02 {
                        font-size: 10px;
                        line-height: 15px;
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
                    
                    .featureProduct .text02 {
                        font-size: 10px;
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
                }
                
                /* Touch optimization for mobile */
                @media (max-width: 767px) {
                    .featureProduct .shopBtn,
                    .feature-card {
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
        </>
    );
}