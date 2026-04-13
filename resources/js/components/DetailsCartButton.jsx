// components/AddToCartButton.jsx
import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import cartIcon from '../assets/images/cartIcon.svg';

export default function DetailsCartButton({ product, className = '' }) {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent event bubbling
        setIsAdding(true);

        // Simulate async operation
        setTimeout(() => {
            addToCart(product, 1);
            setIsAdding(false);
        }, 300);
    };

    return (
        <button
            onClick={handleAddToCart}
            className={`relatedCartbtn me-2 ${className} ${isAdding ? 'adding' : ''}`}
            style={{ gap: '50px' }}
            disabled={isAdding}
        >
            {isAdding ? (
                <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Adding...
                </>
            ) : (
                <div className='d-flex justify-center'>
                    <img src={cartIcon} alt="Add to cart" className="me-2 cartIcon" />
                    <span>IN STOCK</span>
                </div>
            )}
        </button>
    );
}