import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import MainLayout from '../../layouts/MainLayout';

export default function ProductsIndex({ products, categories, filters }) {
    const { props } = usePage();
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
                    <p className="text-gray-600 mt-2">Discover our amazing collection of products</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products..."
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="input-field"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <Link
                                href={`/products?search=${search}&category=${selectedCategory}`}
                                className="btn-primary w-full"
                            >
                                Apply Filters
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.data.map((product) => (
                        <div key={product.id} className="card group">
                            <Link href={`/products/${product.id}`}>
                                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-64 w-full object-cover object-center group-hover:opacity-75 group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-2">
                                        {product.category.name}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            {product.has_sale ? (
                                                <>
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        ${product.sale_price}
                                                    </p>
                                                    <p className="text-sm text-gray-500 line-through">
                                                        ${product.price}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-lg font-semibold text-gray-900">
                                                    ${product.price}
                                                </p>
                                            )}
                                        </div>
                                        {product.stock > 0 ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                In Stock
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Out of Stock
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {products.links && products.links.length > 3 && (
                    <div className="mt-8 flex justify-center">
                        <nav className="flex space-x-2">
                            {products.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 rounded-lg border ${
                                        link.active
                                            ? 'bg-primary-600 text-white border-primary-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
