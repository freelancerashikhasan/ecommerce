import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';

export default function AddToCartButton({ product, className = '', children }) {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
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
            className={`cartbtn ${className} ${isAdding ? 'adding' : ''}`}
            disabled={isAdding}
        >
            {isAdding ? (
                <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Adding...
                </>
            ) : (
                children || (
                    <>
                       Add to cart <i className='fas fa-arrow-right'></i>
                    </>
                )
            )}
        </button>
    );
}