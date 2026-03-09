import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Star, 
    ShoppingCart, 
    Heart, 
    Share2, 
    ArrowLeft,
    Truck,
    Shield,
    RefreshCw,
    Check,
    ZoomIn,
    Minus,
    Plus,
    Facebook,
    Twitter,
    Link2
} from 'lucide-react';
import { useImageZoom } from '../../utils/imageZoom';
import { useCart } from '../../hooks/useCart';
import AppLayout from '../../layouts/AppLayout';

const ProductDetail = ({ product }) => {
    const { addToCart, cart } = useCart();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedStorage, setSelectedStorage] = useState('');
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    
    const {
        isZoomed,
        zoomPosition,
        showZoom,
        imageRef,
        handleMouseMove,
        handleZoomToggle,
        setShowZoom
    } = useImageZoom();

    // Mock product data - in real app, this would come from props
    // const productData = product || {
    const productData =  {
        id: 1,
        name: 'Wireless Bluetooth Headphones Pro Max',
        description: 'Experience premium sound quality with active noise cancellation and 30-hour battery life. Perfect for music lovers and professionals alike.',
        longDescription: 'The Wireless Bluetooth Headphones Pro Max redefine what',
        price: 129.99,
        sale_price: 99.99,
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800'
        ],
        category: 'Electronics',
        rating: 4.5,
        reviewCount: 128,
        isNew: true,
        isPremium: true,
        isBestSeller: true,
        features: ['Noise Cancelling', 'Wireless', '30hr Battery', 'Quick Charge', 'Touch Control'],
        colors: ['Black', 'Silver', 'Blue'],
        storage: ['64GB', '128GB', '256GB'],
        inStock: true,
        stock: 15,
        sku: 'ESH-2024-PRO',
        brand: 'AudioPro',
        warranty: '2 years',
        specifications: {
            'Connectivity': 'Bluetooth 5.2',
            'Battery Life': '30 hours',
            'Charging Time': '2 hours',
            'Weight': '265g',
            'Driver Size': '40mm',
            'Noise Cancellation': 'Active',
            'Microphones': '6 beamforming mics',
            'Water Resistance': 'IPX4'
        },
        reviews: [
            {
                id: 1,
                user: 'Sarah Johnson',
                rating: 5,
                date: '2024-01-15',
                comment: 'Absolutely love these headphones! The noise cancellation is incredible and battery life is as advertised.',
                verified: true
            },
            {
                id: 2,
                user: 'Mike Chen',
                rating: 4,
                date: '2024-01-10',
                comment: 'Great sound quality and comfortable for long sessions. Would recommend!',
                verified: true
            },
            {
                id: 3,
                user: 'Emily Davis',
                rating: 5,
                date: '2024-01-08',
                comment: 'Best headphones I have ever owned. The build quality is premium and sound is amazing.',
                verified: false
            }
        ]
    };

    const isInCart = cart.some(item => item.id === productData.id);

    const handleAddToCart = () => {
        addToCart({
            ...productData,
            color: selectedColor || productData.colors[0],
            storage: selectedStorage || productData.storage?.[0]
        }, quantity);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        // Navigate to cart page
        window.location.href = '/cart';
    };

    const shareProduct = () => {
        if (navigator.share) {
            navigator.share({
                title: productData.name,
                text: productData.description,
                url: window.location.href,
            });
        } else {
            setShowShareModal(true);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        // Show copied notification
    };

   useEffect(() => {
    console.log(productData);
    setSelectedColor(productData?.colors?.[0] || '');
    setSelectedStorage(productData?.storage?.[0] || '');
}, [productData]);


    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
                        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
                        <span>/</span>
                        <Link
                            href={`/category/${typeof productData.category === 'string' 
                                ? productData.category.toLowerCase() 
                                : productData.category?.slug?.toLowerCase() || 'unknown'}`}
                            className="hover:text-blue-600 transition-colors"
                            >
                            {typeof productData.category === 'string'
                                ? productData.category
                                : productData.category?.name || 'Unknown'}
                            </Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{productData.name}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Product Images */}
                        <div className="space-y-4">
                            {/* Main Image with Zoom */}
                            <div 
                                className="relative rounded-3xl overflow-hidden bg-white border border-gray-200 cursor-zoom-in"
                                onMouseEnter={() => setShowZoom(true)}
                                onMouseLeave={() => setShowZoom(false)}
                                onMouseMove={handleMouseMove}
                                onClick={handleZoomToggle}
                                ref={imageRef}
                            >
                               <img
                                    src={productData?.images?.[selectedImage] || '/placeholder.png'}
                                    alt={productData?.name || 'Product Image'}
                                    className="w-full h-96 object-cover transition-transform duration-300"
                                    />

                                
                                {/* Zoom Icon */}
                                <button 
                                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300"
                                    onClick={handleZoomToggle}
                                >
                                    <ZoomIn className="w-5 h-5 text-gray-700" />
                                </button>

                                {/* Zoom Overlay */}
                                <AnimatePresence>
                                    {showZoom && isZoomed && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 overflow-hidden pointer-events-none"
                                        >
                                            <div
                                                className="absolute inset-0 bg-cover bg-no-repeat"
                                                style={{
                                                    backgroundImage: `url(${productData.images[selectedImage]})`,
                                                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                                    backgroundSize: '200%',
                                                    transform: 'scale(1.5)'
                                                }}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Badges */}
                                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                                    {productData.isNew && (
                                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                            NEW
                                        </span>
                                    )}
                                    {productData.sale_price && (
                                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                            -{Math.round((1 - productData.sale_price/productData.price) * 100)}%
                                        </span>
                                    )}
                                    {productData.isBestSeller && (
                                        <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                            BESTSELLER
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Thumbnail Images */}
                            <div className="flex space-x-4 overflow-x-auto pb-4">
                            {productData?.images?.length > 0 ? (
                                productData.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                                            selectedImage === index
                                                ? 'border-blue-500 ring-2 ring-blue-200'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${productData?.name || 'Product'} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))
                            ) : (
                                <div className="text-gray-500 text-sm">No images available</div>
                            )}

                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            {/* Header */}
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                                    {productData.name}
                                </h1>
                                
                                {/* Rating */}
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i}
                                                    className={`w-5 h-5 ${i < Math.floor(productData.rating) ? 'fill-current' : ''}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-lg font-semibold text-gray-900">{productData.rating}</span>
                                    </div>
                                    <span className="text-gray-500">({productData.reviewCount} reviews)</span>
                                    <span className="text-green-600 font-semibold flex items-center">
                                        <Check className="w-4 h-4 mr-1" />
                                        In Stock
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center space-x-4 mb-6">
                                    {productData.sale_price ? (
                                        <>
                                            <span className="text-4xl font-black text-gray-900">
                                                ${productData.sale_price}
                                            </span>
                                            <span className="text-2xl text-gray-500 line-through">
                                                ${productData.price}
                                            </span>
                                            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                                                Save ${(productData.price - productData.sale_price).toFixed(2)}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-4xl font-black text-gray-900">
                                            ${productData.price}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Features */}
                            <div className="flex flex-wrap gap-2">
                              {productData?.features?.length > 0 ? (
  productData.features.map((feature, index) => (
    <span
      key={index}
      className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium"
    >
      {feature}
    </span>
  ))
) : (
  <span className="text-gray-500 text-sm">No features listed</span>
)}

                            </div>

                            {/* Color Selection */}
                            {productData.colors && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Color</h3>
                                    <div className="flex space-x-3">
                                        {productData?.colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`flex items-center space-x-2 px-4 py-2 rounded-xl border-2 transition-all duration-300 ${
                                                    selectedColor === color
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div 
                                                    className="w-6 h-6 rounded-full border border-gray-300"
                                                    style={{ 
                                                        backgroundColor: color.toLowerCase() === 'black' ? '#000' :
                                                                      color.toLowerCase() === 'silver' ? '#c0c0c0' :
                                                                      color.toLowerCase() === 'blue' ? '#3b82f6' : '#6b7280'
                                                    }}
                                                />
                                                <span className="font-medium">{color}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Storage Selection */}
                            {productData.storage && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Storage</h3>
                                    <div className="flex space-x-3">
                                        {productData.storage.map((storage) => (
                                            <button
                                                key={storage}
                                                onClick={() => setSelectedStorage(storage)}
                                                className={`px-6 py-3 rounded-xl border-2 transition-all duration-300 font-medium ${
                                                    selectedStorage === storage
                                                        ? 'border-blue-500 bg-blue-500 text-white'
                                                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                                }`}
                                            >
                                                {storage}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-3 bg-white border border-gray-200 rounded-2xl px-4 py-3">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <span className="text-gray-500">{productData.stock} available</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <motion.button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 group"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>{isInCart ? 'Update Cart' : 'Add to Cart'}</span>
                                </motion.button>
                                
                                <motion.button
                                    onClick={handleBuyNow}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-bold hover:shadow-xl transition-all duration-300"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Buy Now
                                </motion.button>
                            </div>

                            {/* Secondary Actions */}
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setIsInWishlist(!isInWishlist)}
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-2xl border transition-all duration-300 ${
                                        isInWishlist
                                            ? 'bg-red-50 border-red-200 text-red-600'
                                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                                    <span>{isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
                                </button>
                                
                                <button
                                    onClick={shareProduct}
                                    className="flex items-center space-x-2 px-6 py-3 rounded-2xl border border-gray-200 bg-white text-gray-700 hover:border-gray-300 transition-all duration-300"
                                >
                                    <Share2 className="w-5 h-5" />
                                    <span>Share</span>
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                                <div className="text-center">
                                    <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                    <div className="text-sm font-medium">Free Shipping</div>
                                    <div className="text-xs text-gray-500">Over $50</div>
                                </div>
                                <div className="text-center">
                                    <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                    <div className="text-sm font-medium">2-Year Warranty</div>
                                    <div className="text-xs text-gray-500">Guaranteed</div>
                                </div>
                                <div className="text-center">
                                    <RefreshCw className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                                    <div className="text-sm font-medium">Easy Returns</div>
                                    <div className="text-xs text-gray-500">30 Days</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Details Tabs */}
                    <div className="mt-16">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8">
                                {[
                                    { id: 'description', label: 'Description' },
                                    { id: 'specifications', label: 'Specifications' },
                                    { id: 'reviews', label: `Reviews (${productData?.reviews?.length || 0})` },

                                    { id: 'shipping', label: 'Shipping & Returns' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="py-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {activeTab === 'description' && (
                                        <div className="prose prose-lg max-w-none">
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                                {productData.longDescription}
                                            </p>
                                        </div>
                                    )}

                                    {activeTab === 'specifications' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {Object.entries(productData.specifications).map(([key, value]) => (
                                                <div key={key} className="flex justify-between py-3 border-b border-gray-100">
                                                    <span className="font-medium text-gray-700">{key}</span>
                                                    <span className="text-gray-900">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeTab === 'reviews' && (
                                        <div className="space-y-6">
                                            {productData.reviews.map((review) => (
                                                <div key={review.id} className="border border-gray-200 rounded-2xl p-6">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">{review.user}</h4>
                                                            <div className="flex items-center space-x-2 mt-1">
                                                                <div className="flex text-yellow-400">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star 
                                                                            key={i}
                                                                            className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                {review.verified && (
                                                                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-medium">
                                                                        Verified Purchase
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <span className="text-gray-500 text-sm">{review.date}</span>
                                                    </div>
                                                    <p className="text-gray-700">{review.comment}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeTab === 'shipping' && (
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-3">Shipping Information</h4>
                                                <ul className="space-y-2 text-gray-700">
                                                    <li>• Free standard shipping on orders over $50</li>
                                                    <li>• Express shipping available for $9.99</li>
                                                    <li>• International shipping to 50+ countries</li>
                                                    <li>• Usually ships within 1-2 business days</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-3">Return Policy</h4>
                                                <ul className="space-y-2 text-gray-700">
                                                    <li>• 30-day money-back guarantee</li>
                                                    <li>• Free returns for defective products</li>
                                                    <li>• Products must be in original condition</li>
                                                    <li>• Return shipping label provided</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowShareModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Share Product</h3>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <button className="flex flex-col items-center space-y-2 p-4 rounded-2xl hover:bg-blue-50 transition-colors">
                                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                                        <Facebook className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-sm font-medium">Facebook</span>
                                </button>
                                <button className="flex flex-col items-center space-y-2 p-4 rounded-2xl hover:bg-blue-50 transition-colors">
                                    <div className="w-12 h-12 bg-blue-400 rounded-2xl flex items-center justify-center">
                                        <Twitter className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-sm font-medium">Twitter</span>
                                </button>
                                <button 
                                    onClick={copyLink}
                                    className="flex flex-col items-center space-y-2 p-4 rounded-2xl hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-12 h-12 bg-gray-600 rounded-2xl flex items-center justify-center">
                                        <Link2 className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-sm font-medium">Copy Link</span>
                                </button>
                            </div>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AppLayout>
    );
};

export default ProductDetail;