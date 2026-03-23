import React, { useState, useEffect } from 'react';
import Categories from '../components/Categories';
import CardSection from './../components/CardSection';
import ProductCollections from '../components/ProductCollections';
import MainLayout from '../Layout/MainLayout';

export default function Home({ collections }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        {
            image: '../assets/images/slider-01.png',
            title: 'Get the best quality products at the lowest prices',
            description: 'We have prepared special discounts for you on grocery products. Don\'t miss these opportunities...',
            price: '$27.99',
            originalPrice: '$56.67',
            offerText: 'Don\'t miss this limited time offer.'
        },
        {
            image: '../assets/images/slider-01.png', // You'll need to add this image
            title: 'Summer Special Discounts',
            description: 'Up to 50% off on all summer essentials. Stock up now!',
            price: '$19.99',
            originalPrice: '$39.99',
            offerText: 'Limited stock available!'
        },
        {
            image: '../assets/images/slider-01.png', // You'll need to add this image
            title: 'Organic Products Sale',
            description: 'Healthy living starts here. Special prices on organic items this week.',
            price: '$34.99',
            originalPrice: '$69.99',
            offerText: 'Healthiest deal of the season!'
        }
    ];

    // Auto slide change every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const goToPrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    return (
        <MainLayout>
            <div className="banner-section">
                <div className="container">
                    <div className="row">
                        <Categories />
                        <div className="col-md-9">
                            <div className="slider-container">
                                {slides.map((slide, index) => (
                                    <div
                                        key={index}
                                        className={`slide ${index === currentSlide ? 'active' : ''}`}
                                        style={{ backgroundImage: `url(${slide.image})` }}
                                    >
                                        <div className="slide-content">
                                            <h2>{slide.title}</h2>
                                            <p>{slide.description}</p>
                                            <div className="d-flex mt-5 banner-btn-sec">
                                                <a href='' className='banner-btn'>Shop Now</a>
                                                <div className="ms-3">
                                                    <h3>{slide.price} <del>{slide.originalPrice}</del></h3>
                                                    <p>{slide.offerText}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* <button className="slider-nav prev" onClick={goToPrevSlide}>
                                &lt;
                            </button>
                            <button className="slider-nav next" onClick={goToNextSlide}>
                                &gt;
                            </button> */}

                                <div className="slider-dots">
                                    {slides.map((_, index) => (
                                        <button
                                            key={index}
                                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                                            onClick={() => goToSlide(index)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="feature">
                <CardSection />
            </div>
            <div className="product-collection-section">
                <ProductCollections  collections={collections}/>
            </div>
        </MainLayout>
    );
}
