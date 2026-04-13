// resources/js/Pages/Home.jsx

import React, { useState, useEffect } from 'react';
import Categories from '../components/Categories';
import CardSection from '../components/CardSection';
import ProductCollections from '../components/ProductCollections';
import MainLayout from '../Layout/MainLayout';
import { Link } from '@inertiajs/react';

export default function Home({ categories, collections, sliders, featureCards, featureProducts }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // Auto slide change every 5 seconds
    useEffect(() => {
        if (sliders && sliders.length > 0) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % sliders.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [sliders]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % displaySliders.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + displaySliders.length) % displaySliders.length);
    };

    // Touch events for mobile swipe
    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;
        
        if (isLeftSwipe) {
            nextSlide();
        }
        if (isRightSwipe) {
            prevSlide();
        }
        
        setTouchStart(null);
        setTouchEnd(null);
    };

    // Default sliders if none exist
    const defaultSliders = [
        {
            id: 1,
            title: 'Get the best quality products at the lowest prices',
            description: 'We have prepared special discounts for you on grocery products. Don\'t miss these opportunities...',
            price: '27.99',
            originalPrice: '56.67',
            offerText: 'Don\'t miss this limited time offer.',
            image: '/assets/images/slider-01.png',
            button_text: 'Shop Now',
            button_link: '/shop'
        },
        {
            id: 2,
            title: 'Fresh Groceries Delivered Daily',
            description: 'Get fresh fruits, vegetables and more delivered to your doorstep',
            price: '19.99',
            originalPrice: '39.99',
            offerText: 'Limited time offer!',
            image: '/assets/images/slider-02.png',
            button_text: 'Shop Now',
            button_link: '/shop'
        }
    ];

    const displaySliders = sliders && sliders.length > 0 ? sliders : defaultSliders;

    return (
        <MainLayout>
            <div className="banner-section mt-2">
                <div className="container">
                    <div className="row">
                        {/* Categories - Hidden on mobile, shows as dropdown or grid */}
                        <div className="col-md-3 d-none d-md-block">
                            <Categories categories={categories} />
                        </div>
                       <div className="row d-block d-md-none defaultColor my-2">
                            {/* Mobile Marquee Version */}
                            <div className="col-12 text-center text-white topHeaderText1">
                                <marquee 
                                    behavior="scroll" 
                                    direction="left" 
                                    scrollamount="3"
                                    onMouseEnter={(e) => e.target.stop()}
                                    onMouseLeave={(e) => e.target.start()}
                                    style={{ padding: '8px 0' }}
                                >
                                   <Link style={{ textDecoration:'none',color:'#fff' }} href='/manual-order'>
                                         <i className="fas fa-exchange-alt me-2"></i>
                                        <strong>🇧🇩 China-Bangladesh Import/Export 🇨🇳</strong>
                                        <span className="mx-2">|</span>
                                        <span>চীন-বাংলাদেশ আমদানি ও রপ্তানি</span>
                                        <span className="mx-2">•</span>
                                        <Link 
                                            href="/manual-order" 
                                            className="fw-bold ms-2 btn btn-sm btn-light text-dark px-3"
                                            style={{ borderRadius: '20px', textDecoration: 'none', display: 'inline-block' }}
                                        >
                                            <i className="fas fa-clipboard-list me-1"></i>
                                            Manual Order
                                        </Link>
                                        <span className="mx-3">|</span>
                                        <i className="fas fa-shipping-fast me-1"></i>
                                        <strong>We Import:</strong>
                                        <span className="mx-1">Electronics, Fashion, Home Goods, Industrial Products</span>
                                   </Link>
                                </marquee>
                            </div>
                        </div>
                        <div className="col-12 col-md-9">
                            <div 
                                className="slider-container"
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                {displaySliders.map((slide, index) => (
                                    <div
                                        key={slide.id}
                                        className={`slide ${index === currentSlide ? 'active' : ''}`}
                                        style={{ backgroundImage: `url(${slide.image})` }}
                                    >
                                        <div className="slide-content">
                                            <h2>{slide.title}</h2>
                                            <p>{slide.description}</p>
                                            <div className="d-flex mt-5 banner-btn-sec">
                                                <Link href={slide.button_link} className='banner-btn'>
                                                    {slide.button_text || 'Shop Now'}
                                                </Link>
                                                <div className="ms-3 mt-2">
                                                    <h3>
                                                        ${slide.price} 
                                                        {slide.originalPrice && (
                                                            <del>${slide.originalPrice}</del>
                                                        )}
                                                    </h3>
                                                    {/* <p>{slide.offerText}</p> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Navigation Arrows - Optional for desktop */}
                                {/* {displaySliders.length > 1 && (
                                    <>
                                        <button 
                                            className="slider-nav prev d-none d-md-flex"
                                            onClick={prevSlide}
                                            aria-label="Previous slide"
                                        >
                                            ❮
                                        </button>
                                        <button 
                                            className="slider-nav next d-none d-md-flex"
                                            onClick={nextSlide}
                                            aria-label="Next slide"
                                        >
                                            ❯
                                        </button>
                                    </>
                                )} */}

                                <div className="slider-dots">
                                    {displaySliders.map((_, index) => (
                                        <button
                                            key={index}
                                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                                            onClick={() => goToSlide(index)}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Mobile Categories Section - Visible only on mobile */}
             <div className="mobile-categories d-block d-md-none">
                <div className="container">
                   
                    <div className="mobile-categories-grid">
                        {categories && categories.slice(0, 8).map((category) => (
                            <Link key={category.id} href={`/categories/${category.slug}`} className="mobile-category-item">
                                {category.icon && <img src={category.icon} alt={category.name} />}
                                <span>{category.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="feature">
                <CardSection 
                    featureCards={featureCards} 
                    featureProducts={featureProducts}
                />
            </div>
            
            <div className="product-collection-section">
                <ProductCollections collections={collections} />
            </div> 

            <style jsx>{`
                /* Navigation Arrows Styling */
                .slider-nav {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255, 255, 255, 0.8);
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    font-size: 20px;
                    cursor: pointer;
                    z-index: 10;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #112066;
                    font-weight: bold;
                    transition: all 0.3s ease;
                }

                .slider-nav:hover {
                    background: white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                }

                .slider-nav.prev {
                    left: 15px;
                }

                .slider-nav.next {
                    right: 15px;
                }

                /* Mobile Categories Section */
                .mobile-categories {
                    margin: 20px 0;
                    padding: 15px 0;
                    background: #f8f9fa;
                }

                .mobile-categories-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }

                .mobile-categories-header h5 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #030712;
                }

                .mobile-categories-header .view-all {
                    font-size: 12px;
                    color: #112066;
                    text-decoration: none;
                    font-weight: 500;
                }

                .mobile-categories-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 12px;
                }

                .mobile-category-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-decoration: none;
                    padding: 8px;
                    background: white;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    background-color: #112066;
                }

                .mobile-category-item img {
                    width: 40px;
                    height: 40px;
                    object-fit: contain;
                    margin-bottom: 6px;
                }

                .mobile-category-item span {
                    font-size: 11px;
                    color: #fff;
                    text-align: center;
                    font-weight: 500;
                }

                /* Tablet Categories Grid Adjustment */
                @media (min-width: 768px) and (max-width: 991px) {
                    .mobile-categories-grid {
                        grid-template-columns: repeat(6, 1fr);
                    }
                }

                /* Mobile Landscape */
                @media (max-width: 767px) and (orientation: landscape) {
                    .mobile-categories-grid {
                        grid-template-columns: repeat(6, 1fr);
                    }
                }

                /* Small Mobile */
                @media (max-width: 480px) {
                    .mobile-categories-grid {
                        gap: 8px;
                    }
                    
                    .mobile-category-item img {
                        width: 32px;
                        height: 32px;
                    }
                    
                    .mobile-category-item span {
                        font-size: 10px;
                    }
                }
            `}</style>
        </MainLayout>
    );
}