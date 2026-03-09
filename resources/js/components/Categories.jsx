import React, { useState, useRef, useEffect } from 'react';
import '../assets/css/parts/categories.css';

const Categories = () => {
    const [activeCategory, setActiveCategory] = useState(null);
    const [keepOpen, setKeepOpen] = useState(false);
    const categoryMenuRef = useRef(null);
    const dropdownRef = useRef(null);

    const categories = [
        {
            id: 1,
            name: 'Electronics',
            subcategories: [
                { id: 11, name: 'Smartphones' },
                { id: 12, name: 'Laptops' },
                { id: 13, name: 'Cameras' },
                { id: 14, name: 'Accessories' }
            ]
        },
        {
            id: 2,
            name: 'Fashion',
            subcategories: [
                { id: 21, name: "Men's Clothing" },
                { id: 22, name: "Women's Clothing" },
                { id: 23, name: 'Jewelry' },
                { id: 24, name: 'Watches' }
            ]
        },
        {
            id: 3,
            name: 'Home & Kitchen',
            subcategories: [
                { id: 31, name: 'Furniture' },
                { id: 32, name: 'Appliances' },
                { id: 33, name: 'Cookware' },
                { id: 34, name: 'Home Decor' }
            ]
        },
        {
            id: 4,
            name: 'Groceries',
            subcategories: [
                { id: 41, name: 'Fresh Produce' },
                { id: 42, name: 'Dairy' },
                { id: 43, name: 'Beverages' },
                { id: 44, name: 'Snacks' }
            ]
        },
        {
            id: 5,
            name: 'Groceries',
            subcategories: [
                { id: 45, name: 'Fresh Produce' },
                { id: 46, name: 'Dairfdy' },
                { id: 47, name: 'Bevedfrages' },
                { id: 48, name: 'Snacks' }
            ]
        },
        {
            id: 6,
            name: 'Groceries',
            subcategories: [
                { id: 49, name: 'Fresh Produce' },
                { id: 50, name: 'Daidfsgry' },
                { id: 51, name: 'Beverages' },
                { id: 52, name: 'Sndfadfcks' }
            ]
        },
        {
            id: 7,
            name: 'Groceries',
            subcategories: [
                { id: 53, name: 'Fresh Produce' },
                { id: 54, name: 'Daidsfry' },
                { id: 55, name: 'Beverages' },
                { id: 56, name: 'Snacks' }
            ]
        },
        {
            id: 8,
            name: 'Groceries',
            subcategories: [

            ]
        },
    ];


    const handleCategoryHover = (categoryId) => {
        setActiveCategory(categoryId);
        setKeepOpen(true);
    };

    const handleDropdownEnter = () => {
        setKeepOpen(true);
    };

    const handleDropdownLeave = () => {
        setKeepOpen(false);
        setActiveCategory(null);
    };

    const handleCategoryLeave = () => {
        if (!keepOpen) {
            setActiveCategory(null);
        }
    };

    useEffect(() => {
        if (categoryMenuRef.current && dropdownRef.current && activeCategory) {
            const menuRect = categoryMenuRef.current.getBoundingClientRect();
            dropdownRef.current.style.height = `${menuRect.height}px`;
            dropdownRef.current.style.top = `${menuRect.top}px`;
            dropdownRef.current.style.left = `${menuRect.right}px`;
        }
    }, [activeCategory]);

    return (
        <div className="col-md-3">
            <div className="categories-container">
                <div className="category-sidebar">
                    <div className="category-menu" ref={categoryMenuRef}>
                        <h3 className="category-title">All Categories</h3>
                        <div className="category-scroll-container">
                            <ul className="category-list">
                                {categories.map((category) => (
                                    <li
                                        key={category.id}
                                        className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
                                        onMouseEnter={() => handleCategoryHover(category.id)}
                                        onMouseLeave={handleCategoryLeave}
                                    >
                                        <a href="#" className="category-link">
                                            {category.name}
                                            <span className="category-arrow">›</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div
                    ref={dropdownRef}
                    className={`subcategory-dropdown ${activeCategory ? 'visible' : ''}`}
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                >
                    {activeCategory && (
                        <ul className="subcategory-list">
                            {categories.find(c => c.id === activeCategory)?.subcategories.map(subcategory => (
                                <li
                                    key={subcategory.id}
                                    className="subcategory-item"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        // Handle subcategory click here
                                        console.log('Subcategory clicked:', subcategory.name);
                                        setKeepOpen(false); // Close after click
                                    }}
                                >
                                    <a href="#" className="subcategory-link">
                                        {subcategory.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Categories;