// resources/js/components/Categories.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import '../assets/css/parts/categories.css';

const Categories = ({ categories = [] }) => {
    const [activeCategory, setActiveCategory] = useState(null);
    const [keepOpen, setKeepOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const categoryMenuRef = useRef(null);
    const dropdownRef = useRef(null);
    const timeoutRef = useRef(null);

    // Handle category hover with delay
    const handleCategoryHover = (categoryId) => {
        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        // Small delay before showing dropdown to prevent accidental triggers
        timeoutRef.current = setTimeout(() => {
            setActiveCategory(categoryId);
            setKeepOpen(true);
        }, 150);
    };

    const handleDropdownEnter = () => {
        // Clear any timeout that might close the dropdown
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setKeepOpen(true);
    };

    const handleDropdownLeave = () => {
        // Delay closing to allow moving back to category
        timeoutRef.current = setTimeout(() => {
            setKeepOpen(false);
            setActiveCategory(null);
        }, 200);
    };

    const handleCategoryLeave = () => {
        if (!keepOpen) {
            timeoutRef.current = setTimeout(() => {
                setActiveCategory(null);
            }, 200);
        }
    };

    // Handle subcategory click
    const handleSubcategoryClick = (categorySlug, subcategorySlug, subcategoryName, e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Navigate to products page with subcategory filter
        router.get('/products', 
            { 
                category: categorySlug,
                subcategory: subcategorySlug 
            },
            {
                preserveState: false,
                preserveScroll: true,
                onFinish: () => {
                    setIsLoading(false);
                    setKeepOpen(false);
                    setActiveCategory(null);
                }
            }
        );
    };

    // Handle category click
    const handleCategoryClick = (categorySlug, categoryName, e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Navigate to products page with category filter
        router.get('/products', 
            { category: categorySlug },
            {
                preserveState: false,
                preserveScroll: true,
                onFinish: () => {
                    setIsLoading(false);
                    setKeepOpen(false);
                    setActiveCategory(null);
                }
            }
        );
    };

    // Position the dropdown menu
    useEffect(() => {
        if (categoryMenuRef.current && dropdownRef.current && activeCategory) {
            const menuRect = categoryMenuRef.current.getBoundingClientRect();
            dropdownRef.current.style.height = 'auto';
            dropdownRef.current.style.minHeight = `${menuRect.height}px`;
            dropdownRef.current.style.top = `${menuRect.top}px`;
            dropdownRef.current.style.left = `${menuRect.right}px`;
        }
    }, [activeCategory]);

    // Get active category data
    const activeCategoryData = categories.find(c => c.id === activeCategory);

    return (
        <div className="col-md-3 d-none d-md-block">
            <div className="categories-container">
                <div className="category-sidebar">
                    <div className="category-menu" ref={categoryMenuRef}>
                        <h3 className="category-title">All Categories</h3>
                        <div className="category-scroll-container">
                            <ul className="category-list">
                                {categories.length === 0 ? (
                                    <li className="category-item">
                                        <div className="category-link text-muted">
                                            No categories found
                                        </div>
                                    </li>
                                ) : (
                                    categories.map((category) => (
                                        <li
                                            key={category.id}
                                            className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
                                            onMouseEnter={() => handleCategoryHover(category.id)}
                                            onMouseLeave={handleCategoryLeave}
                                        >
                                            <a 
                                                href={`/products?category=${category.slug}`}
                                                className="category-link"
                                                onClick={(e) => handleCategoryClick(category.slug, category.name, e)}
                                            >
                                                {category.name}
                                                {category.subcategories && category.subcategories.length > 0 && (
                                                    <span className="category-arrow">›</span>
                                                )}
                                            </a>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div
                    ref={dropdownRef}
                    className={`subcategory-dropdown ${activeCategory && activeCategoryData?.subcategories?.length > 0 ? 'visible' : ''}`}
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                >
                    {activeCategory && activeCategoryData?.subcategories?.length > 0 && (
                        <>
                            {/* Category header */}
                            <div className="subcategory-header">
                                <Link 
                                    href={`/products?category=${activeCategoryData.slug}`}
                                    className="view-all-link"
                                    onClick={() => setKeepOpen(false)}
                                >
                                    All {activeCategoryData.name}
                                    <span className="arrow">→</span>
                                </Link>
                            </div>
                            
                            {/* Subcategories list */}
                            <ul className="subcategory-list">
                                {activeCategoryData.subcategories.map((subcategory) => (
                                    <li
                                        key={subcategory.id}
                                        className="subcategory-item"
                                    >
                                        <a 
                                            href={`/products?category=${activeCategoryData.slug}&subcategory=${subcategory.slug}`}
                                            className="subcategory-link"
                                            onClick={(e) => handleSubcategoryClick(
                                                activeCategoryData.slug, 
                                                subcategory.slug, 
                                                subcategory.name, 
                                                e
                                            )}
                                        >
                                            {subcategory.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    
                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="dropdown-loading">
                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <span className="ms-2">Loading products...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Add styles for the dynamic dropdown */}
            <style jsx>{`
                .categories-container {
                    position: relative;
                }
                
                .subcategory-dropdown {
                    position: fixed;
                    background: white;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    min-width: 250px;
                    z-index: 1000;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.2s ease, visibility 0.2s ease;
                    padding: 0.5rem 0;
                }
                
                .subcategory-dropdown.visible {
                    opacity: 1;
                    visibility: visible;
                }
                
                .subcategory-header {
                    padding: 0.75rem 1rem;
                    border-bottom: 1px solid #f0f0f0;
                    margin-bottom: 0.5rem;
                }
                
                .view-all-link {
                    color: #007bff;
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 0.9rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .view-all-link:hover {
                    color: #0056b3;
                }
                
                .view-all-link .arrow {
                    transition: transform 0.2s ease;
                }
                
                .view-all-link:hover .arrow {
                    transform: translateX(3px);
                }
                
                .subcategory-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    max-height: 400px;
                    overflow-y: auto;
                }
                
                .subcategory-item {
                    padding: 0;
                    margin: 0;
                }
                
                .subcategory-link {
                    display: block;
                    padding: 0.6rem 1rem;
                    color: #333;
                    text-decoration: none;
                    font-size: 0.9rem;
                    transition: all 0.2s ease;
                }
                
                .subcategory-link:hover {
                    background-color: #f8f9fa;
                    color: #007bff;
                    padding-left: 1.25rem;
                }
                
                .dropdown-loading {
                    padding: 1rem;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #666;
                }
                
                /* Category list styling */
                .category-scroll-container {
                    max-height: 450px;
                    overflow-y: auto;
                }
                
                .category-item.active {
                    background-color: #f8f9fa;
                    border-left: 3px solid #007bff;
                }
                
                .category-item.active .category-link {
                    color: #007bff;
                }
                
                .category-arrow {
                    float: right;
                    color: #999;
                    transition: transform 0.2s ease;
                }
                
                .category-item:hover .category-arrow {
                    transform: translateX(3px);
                    color: #007bff;
                }
            `}</style>
        </div>
    );
};

export default Categories;