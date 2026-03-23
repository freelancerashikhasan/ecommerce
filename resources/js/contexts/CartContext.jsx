import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    // Initialize state with data from localStorage
    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            return [];
        }
    });

    const [showCartModal, setShowCartModal] = useState(() => {
        try {
            const savedModalState = localStorage.getItem('cartModal');
            return savedModalState ? JSON.parse(savedModalState) : false;
        } catch (error) {
            return false;
        }
    });

    const [lastAddedItem, setLastAddedItem] = useState(() => {
        try {
            const savedLastItem = localStorage.getItem('lastAddedItem');
            return savedLastItem ? JSON.parse(savedLastItem) : null;
        } catch (error) {
            return null;
        }
    });

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }, [cartItems]);

    // Save modal state to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('cartModal', JSON.stringify(showCartModal));
        } catch (error) {
            console.error('Error saving modal state to localStorage:', error);
        }
    }, [showCartModal]);

    // Save last added item to localStorage
    useEffect(() => {
        try {
            if (lastAddedItem) {
                localStorage.setItem('lastAddedItem', JSON.stringify(lastAddedItem));
            } else {
                localStorage.removeItem('lastAddedItem');
            }
        } catch (error) {
            console.error('Error saving last added item to localStorage:', error);
        }
    }, [lastAddedItem]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                // Update quantity if item exists
                const updatedItems = prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );

                // Update last added item
                const updatedItem = updatedItems.find(item => item.id === product.id);
                setLastAddedItem(updatedItem);
                setShowCartModal(true);

                return updatedItems;
            } else {
                console.log(product);
                // Add new item
                const newItem = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity,
                    maxQuantity: product.stock_quantity || 10
                };

                setLastAddedItem(newItem);
                setShowCartModal(true);
                return [...prevItems, newItem];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => {
            const filteredItems = prevItems.filter(item => item.id !== productId);

            // Update lastAddedItem if we're removing the last added item
            if (lastAddedItem && lastAddedItem.id === productId) {
                setLastAddedItem(null);
            }

            return filteredItems;
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }

        setCartItems(prevItems => {
            const updatedItems = prevItems.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            );

            // Update lastAddedItem if it's the one being updated
            if (lastAddedItem && lastAddedItem.id === productId) {
                const updatedItem = updatedItems.find(item => item.id === productId);
                setLastAddedItem(updatedItem);
            }

            return updatedItems;
        });
    };

    const clearCart = () => {
        setCartItems([]);
        setLastAddedItem(null);
        // Don't clear modal state when clearing cart
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    // Helper function to check if cart has items
    const hasItems = () => {
        return cartItems.length > 0;
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        hasItems,
        showCartModal,
        setShowCartModal,
        lastAddedItem,
        setLastAddedItem
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
