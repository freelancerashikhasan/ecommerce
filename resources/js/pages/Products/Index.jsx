// resources/js/Pages/Products/Index.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import MainLayout from '../../Layout/MainLayout';
import productPlaceholder from "../../assets/images/619.png";
import '../../assets/css/productFilter.css';
import { useCart } from '../../contexts/CartContext';
import DetailsCartButton from '../../components/DetailsCartButton';

export default function ProductIndex({ filters = {}, categories = [], collections = [], variations = [], minPrice = 0, maxPrice = 1000, totalProducts = 0 }) {
    const { addToCart } = useCart();
    const [viewMode, setViewMode] = useState('grid');
    const isInitialMount = useRef(true);
    
    // Safe initialization with fallbacks
    const [selectedFilters, setSelectedFilters] = useState({
        categories: filters.selectedCategories || [],
        collections: filters.selectedCollections || [],
        priceRange: filters.priceRange || { min: minPrice, max: maxPrice },
        variations: filters.selectedVariations || {},
        sortBy: filters.sortBy || 'newest',
        search: filters.search || ''
    });
    
    const [priceValues, setPriceValues] = useState({
        min: selectedFilters.priceRange.min,
        max: selectedFilters.priceRange.max
    });
    
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Group variations by type
    const groupedVariations = variations?.reduce((groups, variation) => {
        if (!groups[variation.type]) {
            groups[variation.type] = [];
        }
        groups[variation.type].push(variation);
        return groups;
    }, {}) || {};
    
    // Handle category filter
    const handleCategoryChange = (categoryId) => {
        setSelectedFilters(prev => {
            const newCategories = prev.categories.includes(categoryId)
                ? prev.categories.filter(id => id !== categoryId)
                : [...prev.categories, categoryId];
            return { ...prev, categories: newCategories };
        });
    };
    
    // Handle collection filter
    const handleCollectionChange = (collectionId) => {
        setSelectedFilters(prev => {
            const newCollections = prev.collections.includes(collectionId)
                ? prev.collections.filter(id => id !== collectionId)
                : [...prev.collections, collectionId];
            return { ...prev, collections: newCollections };
        });
    };
    
    // Handle variation filter
    const handleVariationChange = (type, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            variations: {
                ...prev.variations,
                [type]: prev.variations[type] === value ? null : value
            }
        }));
    };
    
    // Handle price range change
    const handlePriceChange = (type, value) => {
        setPriceValues(prev => ({
            ...prev,
            [type]: parseInt(value) || 0
        }));
    };
    
    // Apply filters
    const applyFilters = () => {
        setIsLoading(true);
        const params = {};
        
        if (selectedFilters.categories && selectedFilters.categories.length > 0) {
            params.categories = selectedFilters.categories.join(',');
        }
        
        if (selectedFilters.collections && selectedFilters.collections.length > 0) {
            params.collections = selectedFilters.collections.join(',');
        }
        
        if (selectedFilters.priceRange) {
            params.min_price = selectedFilters.priceRange.min;
            params.max_price = selectedFilters.priceRange.max;
        }
        
        if (selectedFilters.sortBy) {
            params.sort = selectedFilters.sortBy;
        }
        
        if (selectedFilters.search) {
            params.search = selectedFilters.search;
        }
        
        if (selectedFilters.variations) {
            Object.entries(selectedFilters.variations).forEach(([key, value]) => {
                if (value) {
                    params[`variation_${key}`] = value;
                }
            });
        }
        
        router.get('/products', params, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false)
        });
    };
    
    // Reset all filters
    const resetFilters = () => {
        setSelectedFilters({
            categories: [],
            collections: [],
            priceRange: { min: minPrice, max: maxPrice },
            variations: {},
            sortBy: 'newest',
            search: ''
        });
        setPriceValues({ min: minPrice, max: maxPrice });
        
        router.get('/products', {}, {
            preserveState: true,
            preserveScroll: true
        });
    };
    
    // Clear a specific filter
    const clearFilter = (filterType, value = null) => {
        switch(filterType) {
            case 'search':
                setSelectedFilters(prev => ({ ...prev, search: '' }));
                break;
            case 'category':
                setSelectedFilters(prev => ({
                    ...prev,
                    categories: prev.categories.filter(id => id !== value)
                }));
                break;
            case 'collection':
                setSelectedFilters(prev => ({
                    ...prev,
                    collections: prev.collections.filter(id => id !== value)
                }));
                break;
            case 'variation':
                setSelectedFilters(prev => {
                    const newVariations = { ...prev.variations };
                    delete newVariations[value];
                    return { ...prev, variations: newVariations };
                });
                break;
            case 'price':
                setSelectedFilters(prev => ({
                    ...prev,
                    priceRange: { min: minPrice, max: maxPrice }
                }));
                setPriceValues({ min: minPrice, max: maxPrice });
                break;
            default:
                break;
        }
    };
    
    // Debounced search - PREVENT INITIAL TRIGGER
    useEffect(() => {
        if (isInitialMount.current) {
            return;
        }
        
        const timer = setTimeout(() => {
            if (selectedFilters.search !== filters.search) {
                applyFilters();
            }
        }, 500);
        
        return () => clearTimeout(timer);
    }, [selectedFilters.search]);
    
    // Apply filters when price range is confirmed
    const confirmPriceRange = () => {
        setIsLoading(true);

        const updatedFilters = {
            ...selectedFilters,
            priceRange: priceValues
        };

        setSelectedFilters(updatedFilters);

        const params = {};

        if (updatedFilters.categories && updatedFilters.categories.length > 0) {
            params.categories = updatedFilters.categories.join(',');
        }
        
        if (updatedFilters.collections && updatedFilters.collections.length > 0) {
            params.collections = updatedFilters.collections.join(',');
        }

        params.min_price = priceValues.min;
        params.max_price = priceValues.max;

        if (updatedFilters.sortBy) {
            params.sort = updatedFilters.sortBy;
        }

        if (updatedFilters.search) {
            params.search = updatedFilters.search;
        }

        if (updatedFilters.variations) {
            Object.entries(updatedFilters.variations).forEach(([key, value]) => {
                if (value) {
                    params[`variation_${key}`] = value;
                }
            });
        }

        router.get('/products', params, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false)
        });
    };
    
    // Apply filters when sort changes - PREVENT INITIAL TRIGGER
    useEffect(() => {
        if (isInitialMount.current) {
            return;
        }
        
        if (selectedFilters.sortBy !== filters.sortBy) {
            applyFilters();
        }
    }, [selectedFilters.sortBy]);
    
    // Apply filters when categories, collections, or variations change - PREVENT INITIAL TRIGGER
    useEffect(() => {
        if (isInitialMount.current) {
            return;
        }
        
        const timer = setTimeout(() => {
            if (JSON.stringify(selectedFilters.categories) !== JSON.stringify(filters.selectedCategories || []) ||
                JSON.stringify(selectedFilters.collections) !== JSON.stringify(filters.selectedCollections || []) ||
                JSON.stringify(selectedFilters.variations) !== JSON.stringify(filters.selectedVariations || {})) {
                applyFilters();
            }
        }, 300);
        
        return () => clearTimeout(timer);
    }, [selectedFilters.categories, selectedFilters.collections, selectedFilters.variations]);
    
    // Mark initial mount as complete after first render
    useEffect(() => {
        isInitialMount.current = false;
    }, []);
    
    // Function to render star ratings
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        return (
            <div className="d-flex star-sec">
                {[...Array(5)].map((_, i) => (
                    <span key={i}>
                        {i < fullStars ? (
                            <i className='fas fa-star'></i>
                        ) : i === fullStars && hasHalfStar ? (
                            <i className='fas fa-star-half-alt'></i>
                        ) : (
                            <i className='far fa-star'></i>
                        )}
                    </span>
                ))}
                <strong className='ps-3'>{rating.toFixed(1)}</strong>
            </div>
        );
    };
    
    // Get category names for display
    const getCategoryName = (categoryId) => {
        const category = categories?.find(cat => cat.id === categoryId);
        return category ? category.name : '';
    };
    
    // Get collection names for display
    const getCollectionName = (collectionId) => {
        const collection = collections?.find(col => col.id === collectionId);
        return collection ? collection.name : '';
    };
    
    // Get products data safely
    const productsData = filters.products || { data: [], total: 0 };
    const products = productsData.data || [];
    const hasActiveFilters = (selectedFilters.search || 
                              (selectedFilters.categories && selectedFilters.categories.length > 0) || 
                              (selectedFilters.collections && selectedFilters.collections.length > 0) ||
                              (selectedFilters.variations && Object.keys(selectedFilters.variations).length > 0) ||
                              (selectedFilters.priceRange && (selectedFilters.priceRange.min !== minPrice || selectedFilters.priceRange.max !== maxPrice)));
    
    return (
        <MainLayout>
            <div className="product-filter-page py-3 py-md-4">
                <div className="container">
                    {/* Page Header */}
                    <div className="page-header mb-3 mb-md-4">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link href="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    Products
                                </li>
                            </ol>
                        </nav>
                    </div>
                    
                    {/* Mobile Filter Toggle */}
                    <div className="d-block d-lg-none mb-3">
                        <button 
                            className="btn filterBtn w-100 py-2"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            style={{ borderRadius: '10px' }}
                        >
                            <i className="fas fa-filter me-2"></i>
                            Filters {isFilterOpen ? '▲' : '▼'}
                        </button>
                    </div>
                    
                    <div className="row">
                        {/* Sidebar Filters */}
                        <div className={`col-lg-3 mb-4 ${isFilterOpen ? 'd-block' : 'd-none d-lg-block'}`}>
                            <div className="filter-sidebar">
                                {/* Search Filter */}
                                <div className="filter-section mb-4">
                                    <h6 className="filter-title mb-3">Search Products</h6>
                                    <div className="search-box">
                                        <i className="fas fa-search search-icon"></i>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search products..."
                                            value={selectedFilters.search}
                                            onChange={(e) => setSelectedFilters(prev => ({ ...prev, search: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                
                                {/* Categories Filter */}
                                {categories && categories.length > 0 && (
                                    <div className="filter-section mb-4">
                                        <h6 className="filter-title mb-3">Categories</h6>
                                        <div className="categories-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                            {categories.map(category => (
                                                <div className="form-check mb-2" key={category.id}>
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id={`category-${category.id}`}
                                                        checked={selectedFilters.categories?.includes(category.id) || false}
                                                        onChange={() => handleCategoryChange(category.id)}
                                                    />
                                                    <label 
                                                        className="form-check-label" 
                                                        htmlFor={`category-${category.id}`}
                                                    >
                                                        {category.name}
                                                        <span className="text-muted ms-1">
                                                            ({category.products_count || 0})
                                                        </span>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Collections Filter */}
                                {collections && collections.length > 0 && (
                                    <div className="filter-section mb-4">
                                        <h6 className="filter-title mb-3">Collections</h6>
                                        <div className="collections-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                            {collections.map(collection => (
                                                <div className="form-check mb-2" key={collection.id}>
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id={`collection-${collection.id}`}
                                                        checked={selectedFilters.collections?.includes(collection.id) || false}
                                                        onChange={() => handleCollectionChange(collection.id)}
                                                    />
                                                    <label 
                                                        className="form-check-label" 
                                                        htmlFor={`collection-${collection.id}`}
                                                    >
                                                        {collection.name}
                                                        <span className="text-muted ms-1">
                                                            ({collection.products_count || 0})
                                                        </span>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Price Range Filter */}
                                <div className="filter-section mb-4">
                                    <h6 className="filter-title mb-3">Price Range</h6>
                                    <div className="price-range">
                                        <div className="d-flex flex-wrap gap-2 align-items-center">
                                            <div className="flex-grow-1">
                                                <label className="small text-dark">Min</label>
                                                <input
                                                    type="number"
                                                    className="form-control priceRange"
                                                    value={priceValues.min}
                                                    onChange={(e) => handlePriceChange('min', e.target.value)}
                                                    min={minPrice}
                                                    max={priceValues.max}
                                                    style={{ width: '100%' }}
                                                />
                                            </div>
                                            <div className="flex-grow-1">
                                                <label className="small text-dark">Max</label>
                                                <input
                                                    type="number"
                                                    className="form-control priceRange"
                                                    value={priceValues.max}
                                                    onChange={(e) => handlePriceChange('max', e.target.value)}
                                                    min={priceValues.min}
                                                    max={maxPrice}
                                                    style={{ width: '100%' }}
                                                />
                                            </div>
                                            <div className="d-flex align-items-end">
                                                <button 
                                                    className="btn btn-dark btn-sm px-3"
                                                    onClick={confirmPriceRange}
                                                >
                                                    <i className="fas fa-filter"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Variations Filter */}
                                {Object.keys(groupedVariations).length > 0 && (
                                    Object.entries(groupedVariations).map(([type, options]) => (
                                        <div className="filter-section mb-4" key={type}>
                                            <h6 className="filter-title mb-3">{type}</h6>
                                            <div className="variations-list" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                                {options.map((option, index) => (
                                                    <div className="form-check mb-2" key={index}>
                                                        <input
                                                            type="radio"
                                                            className="form-check-input"
                                                            name={`variation-${type}`}
                                                            id={`${type}-${option.value}`}
                                                            checked={selectedFilters.variations?.[type] === option.value || false}
                                                            onChange={() => handleVariationChange(type, option.value)}
                                                        />
                                                        <label 
                                                            className="form-check-label" 
                                                            htmlFor={`${type}-${option.value}`}
                                                        >
                                                            {option.value}
                                                            <span className="text-muted ms-1">
                                                                ({option.count})
                                                            </span>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                                
                                {/* Apply Filters Button for Mobile */}
                                <button 
                                    className="btn btn-primary w-100 mt-3 d-block d-lg-none py-2"
                                    onClick={() => {
                                        applyFilters();
                                        setIsFilterOpen(false);
                                    }}
                                    style={{ borderRadius: '10px' }}
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                        
                        {/* Product Grid */}
                        <div className="col-lg-9">
                            {/* Active Filters Bar */}
                            {hasActiveFilters && (
                                <div className="active-filters-bar mb-3 mb-md-4 p-2 p-md-3">
                                    <div className="d-flex flex-wrap align-items-center gap-2">
                                        <span className="fw-bold me-2 small">Active Filters:</span>
                                        
                                        {/* Search Filter */}
                                        {selectedFilters.search && (
                                            <span className="filter-tag">
                                                <i className="fas fa-search me-1"></i>
                                                "{selectedFilters.search.length > 15 ? selectedFilters.search.substring(0, 15) + '...' : selectedFilters.search}"
                                                <button 
                                                    className="filter-tag-remove"
                                                    onClick={() => clearFilter('search')}
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </span>
                                        )}
                                        
                                        {/* Category Filters */}
                                        {selectedFilters.categories?.slice(0, 3).map(categoryId => (
                                            <span key={`cat-${categoryId}`} className="filter-tag">
                                                <i className="fas fa-tag me-1"></i>
                                                {getCategoryName(categoryId).length > 10 ? getCategoryName(categoryId).substring(0, 10) + '...' : getCategoryName(categoryId)}
                                                <button 
                                                    className="filter-tag-remove"
                                                    onClick={() => clearFilter('category', categoryId)}
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </span>
                                        ))}
                                        {selectedFilters.categories?.length > 3 && (
                                            <span className="filter-tag">
                                                +{selectedFilters.categories.length - 3} more
                                            </span>
                                        )}
                                        
                                        {/* Collection Filters */}
                                        {selectedFilters.collections?.slice(0, 2).map(collectionId => (
                                            <span key={`col-${collectionId}`} className="filter-tag">
                                                <i className="fas fa-layer-group me-1"></i>
                                                {getCollectionName(collectionId).length > 10 ? getCollectionName(collectionId).substring(0, 10) + '...' : getCollectionName(collectionId)}
                                                <button 
                                                    className="filter-tag-remove"
                                                    onClick={() => clearFilter('collection', collectionId)}
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </span>
                                        ))}
                                        
                                        {/* Price Range Filter */}
                                        {(selectedFilters.priceRange?.min !== minPrice || selectedFilters.priceRange?.max !== maxPrice) && (
                                            <span className="filter-tag">
                                                <i className="fas fa-dollar-sign me-1"></i>
                                                ${selectedFilters.priceRange?.min} - ${selectedFilters.priceRange?.max}
                                                <button 
                                                    className="filter-tag-remove"
                                                    onClick={() => clearFilter('price')}
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </span>
                                        )}
                                        
                                        {/* Clear All Button */}
                                        <button 
                                            className="btn btn-sm btn-outline-danger ms-2"
                                            onClick={resetFilters}
                                        >
                                            <i className="fas fa-trash-alt me-1"></i> Clear All
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {/* Sort and Results Header */}
                            <div className="products-header d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-3 mb-md-4 p-3">
                                <div className="results-count mb-2 mb-sm-0">
                                    <p className="mb-0 text-muted small">
                                        Showing <strong>{productsData.total || products.length}</strong> products
                                        {selectedFilters.search && (
                                            <span className="d-block d-sm-inline"> for "<strong>{selectedFilters.search.length > 20 ? selectedFilters.search.substring(0, 20) + '...' : selectedFilters.search}</strong>"</span>
                                        )}
                                    </p>
                                </div>
                                
                                <div className="d-flex gap-2 gap-sm-3 align-items-center">
                                    {/* View Toggle Buttons */}
                                    <div className="view-toggle btn-group" role="group">
                                        <button 
                                            className={`btn btn-sm ${viewMode === 'grid' ? 'btn-dark' : 'btn-outline-secondary'}`}
                                            onClick={() => setViewMode('grid')}
                                            title="Grid View"
                                        >
                                            <i className="fas fa-th"></i>
                                        </button>
                                        <button 
                                            className={`btn btn-sm ${viewMode === 'list' ? 'btn-dark' : 'btn-outline-secondary'}`}
                                            onClick={() => setViewMode('list')}
                                            title="List View"
                                        >
                                            <i className="fas fa-list"></i>
                                        </button>
                                    </div>
                                    
                                    {/* Sort By Dropdown */}
                                    <div className="sort-by">
                                        <select 
                                            className="form-select form-select-sm"
                                            value={selectedFilters.sortBy}
                                            onChange={(e) => {
                                                setSelectedFilters(prev => ({ ...prev, sortBy: e.target.value }));
                                            }}
                                        >
                                            <option value="newest">Newest First</option>
                                            <option value="price_low">Price: Low to High</option>
                                            <option value="price_high">Price: High to Low</option>
                                            <option value="popular">Most Popular</option>
                                            <option value="rating">Highest Rated</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Loading State */}
                            {isLoading && (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            )}
                            
                            {/* Product Grid/List View */}
                            {!isLoading && (
                                <>
                                    {products.length > 0 ? (
                                        <div className={viewMode === 'grid' ? 'row g-2 g-md-3' : 'list-view'}>
                                            {products.map(product => (
                                                <div 
                                                    key={product.id} 
                                                    className={viewMode === 'grid' 
                                                        ? "col-6 col-md-4 col-lg-3 product-card p-2" 
                                                        : "product-list-item mb-3"
                                                    }
                                                >
                                                    <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                                                        <div className={viewMode === 'list' ? "d-flex flex-column flex-md-row align-items-start gap-3 p-3 border rounded" : ""}>
                                                            {/* Discount Badge */}
                                                            {product.discount && (
                                                                <span className="discount-badge">
                                                                    {product.discount}%
                                                                </span>
                                                            )}
                                                            
                                                            {/* Product Badge (Sale/New) */}
                                                            {product.badge && (
                                                                <span className={`product-badge absolute ${product.badge.toLowerCase()}`}>
                                                                    {product.badge}
                                                                </span>
                                                            )}
                                                            
                                                            <div className={viewMode === 'list' ? "img-sec-list" : "img-sec"}>
                                                                <img
                                                                    src={product.featured_image || productPlaceholder}
                                                                    alt={product.name}
                                                                    className={viewMode === 'list' ? "list-view-img" : ""}
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = productPlaceholder;
                                                                    }}
                                                                />
                                                            </div>
                                                            
                                                            <div className={viewMode === 'list' ? "details-section-list flex-grow-1" : "details-section"}>
                                                                <p className="single-line-ellipsis">{product.name}</p>
                                                                {renderStars(product.average_rating || 4.0)}
                                                                <div className="pricing mt-2 d-flex gap-2 align-items-center flex-wrap">
                                                                    <h5 className="main-price mb-0">
                                                                        ${parseFloat(product.price).toFixed(2)}
                                                                    </h5>
                                                                    {product.regular_price && product.sale_price && product.regular_price > product.sale_price && (
                                                                        <del className="text-muted">${parseFloat(product.regular_price).toFixed(2)}</del>
                                                                    )}
                                                                </div>
                                                                {viewMode === 'list' && product.short_description && (
                                                                    <p className="short-description mt-2 text-muted small">
                                                                        {product.short_description.substring(0, 100)}...
                                                                    </p>
                                                                )}
                                                                <div className="mt-2">
                                                                    <DetailsCartButton product={product} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-5">
                                            <i className="fas fa-search fa-3x text-muted mb-3"></i>
                                            <h5>No products found</h5>
                                            <p className="text-muted">Try adjusting your filters to find what you're looking for.</p>
                                            <button className="btn btn-primary" onClick={resetFilters}>
                                                Reset Filters
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                            
                            {/* Pagination */}
                            {productsData.links && productsData.links.length > 3 && (
                                <div className="pagination-wrapper mt-3 mt-md-4 p-2 p-md-3">
                                    <nav aria-label="Page navigation">
                                        <ul className="pagination justify-content-center flex-wrap">
                                            {productsData.links.map((link, index) => {
                                                if (link.label === '&laquo; Previous') {
                                                    return (
                                                        <li key={index} className={`page-item ${!link.url ? 'disabled' : ''}`}>
                                                            <Link className="page-link" href={link.url || '#'}>
                                                                <span className="d-none d-sm-inline">Previous</span>
                                                                <span className="d-inline d-sm-none"><i className="fas fa-chevron-left"></i></span>
                                                            </Link>
                                                        </li>
                                                    );
                                                }
                                                
                                                if (link.label === 'Next &raquo;') {
                                                    return (
                                                        <li key={index} className={`page-item ${!link.url ? 'disabled' : ''}`}>
                                                            <Link className="page-link" href={link.url || '#'}>
                                                                <span className="d-none d-sm-inline">Next</span>
                                                                <span className="d-inline d-sm-none"><i className="fas fa-chevron-right"></i></span>
                                                            </Link>
                                                        </li>
                                                    );
                                                }
                                                
                                                // Show limited page numbers on mobile
                                                const isMobile = window.innerWidth <= 576;
                                                const pageNumber = parseInt(link.label);
                                                const currentPage = productsData.current_page || 1;
                                                const totalPages = productsData.last_page || 1;
                                                
                                                if (isMobile && pageNumber) {
                                                    // Show only current page, first, last, and neighbors on mobile
                                                    if (pageNumber === 1 || 
                                                        pageNumber === totalPages || 
                                                        Math.abs(pageNumber - currentPage) <= 1) {
                                                        return (
                                                            <li key={index} className={`page-item ${link.active ? 'active' : ''}`}>
                                                                <Link 
                                                                    className="page-link" 
                                                                    href={link.url || '#'}
                                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                                />
                                                            </li>
                                                        );
                                                    } else if (Math.abs(pageNumber - currentPage) === 2) {
                                                        return <li key={index} className="page-item disabled"><span className="page-link">...</span></li>;
                                                    }
                                                    return null;
                                                }
                                                
                                                return (
                                                    <li key={index} className={`page-item ${link.active ? 'active' : ''}`}>
                                                        <Link 
                                                            className="page-link" 
                                                            href={link.url || '#'}
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add responsive CSS */}
            <style>{`
                /* Responsive Styles for Product Index Page */
                
                @media (max-width: 767px) {
                    .product-filter-page .page-header {
                        padding: 10px 15px;
                    }
                    .filterBtn{
                        background-color: #112066;
                        color: white;
                    }
                    
                    .product-filter-page .filter-sidebar {
                        padding: 15px;
                        max-height: 80vh;
                        overflow-y: auto;
                    }
                    
                    .product-filter-page .filter-title {
                        font-size: 13px;
                        margin-bottom: 10px;
                    }
                    
                    .product-filter-page .form-check-label {
                        font-size: 12px;
                    }
                    
                    .product-filter-page .priceRange {
                        font-size: 12px;
                        padding: 6px 8px;
                    }
                    
                    .active-filters-bar {
                        background: #f8f9fa;
                        border-radius: 10px;
                    }
                    
                    .filter-tag {
                        font-size: 11px;
                        padding: 4px 8px;
                    }
                    
                    .filter-tag i {
                        font-size: 10px;
                    }
                    
                    .results-count p {
                        font-size: 12px;
                    }
                    
                    .view-toggle .btn {
                        padding: 4px 10px;
                    }
                    
                    .view-toggle .btn i {
                        font-size: 12px;
                    }
                    
                    .sort-by select {
                        font-size: 12px;
                        padding: 4px 8px;
                        width: 130px;
                    }
                    
                    .product-card .details-section p {
                        font-size: 12px;
                    }
                    
                    .product-card .main-price {
                        font-size: 14px;
                    }
                    
                    .product-card del {
                        font-size: 11px;
                    }
                    
                    .product-card .star-sec i {
                        font-size: 9px;
                    }
                    
                    .product-card .star-sec strong {
                        font-size: 10px;
                    }
                    
                    .product-card .cartbtn {
                        height: 28px;
                        font-size: 10px;
                        padding: 4px 6px;
                    }
                    
                    .img-sec {
                        height: 140px;
                    }
                    
                    .page-link {
                        padding: 6px 10px;
                        font-size: 12px;
                    }
                }
                
                @media (max-width: 480px) {
                    .product-card .details-section p {
                        font-size: 11px;
                    }
                    
                    .product-card .main-price {
                        font-size: 13px;
                    }
                    
                    .product-card .img-sec {
                        height: 120px;
                    }
                    
                    .filter-tag {
                        font-size: 10px;
                        padding: 3px 6px;
                    }
                    
                    .btn-outline-danger {
                        font-size: 11px;
                        padding: 4px 8px;
                    }
                }
                
                @media (min-width: 768px) and (max-width: 991px) {
                    .product-card .img-sec {
                        height: 160px;
                    }
                    
                    .product-card .main-price {
                        font-size: 16px;
                    }
                    
                    .filter-tag {
                        font-size: 12px;
                    }
                }
                
                /* Landscape mode */
                @media (max-width: 767px) and (orientation: landscape) {
                    .filter-sidebar {
                        max-height: 70vh;
                    }
                    
                    .product-card .img-sec {
                        height: 110px;
                    }
                }
                
                /* Improved touch targets */
                @media (max-width: 767px) {
                    .form-check-input,
                    .btn,
                    .page-link,
                    .filter-tag-remove {
                        cursor: pointer;
                        -webkit-tap-highlight-color: transparent;
                    }
                    
                    .btn:active,
                    .page-link:active {
                        transform: scale(0.98);
                    }
                }
            `}</style>
        </MainLayout>
    );
}