import { useState, useEffect } from 'react';

export const useCart = () => {
    const [cart, setCart] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);

    useEffect(() => {
        // Load cart from localStorage
        const savedCart = JSON.parse(localStorage.getItem('electroshop-cart')) || [];
        setCart(savedCart);
        updateCartMetrics(savedCart);
    }, []);

    const updateCartMetrics = (cartItems) => {
        const count = cartItems.reduce((total, item) => total + item.quantity, 0);
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setCartCount(count);
        setCartTotal(total);
    };

    const addToCart = (product, quantity = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            let newCart;

            if (existingItem) {
                newCart = prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                newCart = [...prevCart, { ...product, quantity }];
            }

            localStorage.setItem('electroshop-cart', JSON.stringify(newCart));
            updateCartMetrics(newCart);
            return newCart;
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => {
            const newCart = prevCart.filter(item => item.id !== productId);
            localStorage.setItem('electroshop-cart', JSON.stringify(newCart));
            updateCartMetrics(newCart);
            return newCart;
        });
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }

        setCart(prevCart => {
            const newCart = prevCart.map(item =>
                item.id === productId ? { ...item, quantity } : item
            );
            localStorage.setItem('electroshop-cart', JSON.stringify(newCart));
            updateCartMetrics(newCart);
            return newCart;
        });
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('electroshop-cart');
        updateCartMetrics([]);
    };

    return {
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    };
};