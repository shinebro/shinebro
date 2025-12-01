import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Zap, Tag, Truck, RotateCcw, ShieldCheck, ChevronRight, Heart } from 'lucide-react';

import { useCart } from '../context/CartContext';
import { products } from '../data/products';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [pincode, setPincode] = useState('');
    const [availabilityMessage, setAvailabilityMessage] = useState('');
    const [isAvailable, setIsAvailable] = useState(false);

    const allowedPincodes = ['400601', '400602', '400603', '400604'];

    const checkPincode = () => {
        if (!pincode) {
            setAvailabilityMessage('Please enter a pincode');
            setIsAvailable(false);
            return;
        }
        if (allowedPincodes.includes(pincode)) {
            setAvailabilityMessage('Delivery available!');
            setIsAvailable(true);
        } else {
            setAvailabilityMessage('Not available for this pincode');
            setIsAvailable(false);
        }
    };

    useEffect(() => {
        const productData = products.find(p => p.id === parseInt(id));
        if (productData) {
            setProduct(productData);
            if (productData.sizes && productData.sizes.length > 0) {
                setSelectedSize(productData.sizes[1]); // Default to middle size
            }
        }
        setLoading(false);
    }, [id]);

    const handleAddToCart = () => {
        if (isAdding || !product) return;
        setIsAdding(true);
        setTimeout(() => {
            const productToAdd = {
                ...product,
                selectedSize: selectedSize,
                price: selectedSize ? selectedSize.price : product.price
            };
            addToCart(productToAdd, 1);
            setIsAdding(false);
            // Ideally show a toast notification here
            alert("Added to cart!");
        }, 500);
    };

    const handleBuyNow = () => {
        if (isAdding || !product) return;
        setIsAdding(true);

        const productToAdd = {
            ...product,
            selectedSize: selectedSize,
            price: selectedSize ? selectedSize.price : product.price
        };

        addToCart(productToAdd, 1);
        setIsAdding(false);
        navigate('/cart');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center text-xl">Product not found</div>;

    const currentPrice = selectedSize ? selectedSize.price : product.price;
    const originalPrice = Math.round(currentPrice * 1.25); // Mock original price
    const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

    return (
        <div className="bg-gray-100 min-h-screen py-4">
            <div className="container mx-auto px-2 max-w-[1400px]">
                <div className="bg-white shadow-sm rounded-sm flex flex-col md:flex-row overflow-hidden">

                    {/* Left Column - Images & Buttons */}
                    <div className="md:w-[40%] lg:w-[35%] p-4 border-r border-gray-200 relative">
                        <div className="sticky top-24">
                            <div className="flex flex-col-reverse md:flex-row gap-4 h-[450px]">
                                {/* Thumbnails */}
                                <div className="flex md:flex-col gap-2 overflow-auto md:w-16 hide-scrollbar">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className={`border p-1 cursor-pointer hover:border-blue-600 rounded-sm h-16 w-16 flex-shrink-0 ${i === 0 ? 'border-blue-600' : 'border-gray-200'}`}>
                                            <img src={product.image} alt="Thumbnail" className="w-full h-full object-contain" />
                                        </div>
                                    ))}
                                </div>

                                {/* Main Image */}
                                <div className="flex-1 flex items-center justify-center border border-gray-100 relative group">
                                    <div className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md text-gray-400 hover:text-red-500 cursor-pointer z-10">
                                        <Heart size={20} fill="currentColor" className="text-transparent hover:text-red-500 transition-colors" />
                                    </div>
                                    <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAdding || product.inStock === false}
                                    className={`flex-1 font-bold py-4 rounded-sm shadow-sm uppercase text-sm md:text-base flex items-center justify-center gap-2 transition-colors ${product.inStock === false
                                        ? 'bg-gray-400 cursor-not-allowed text-white'
                                        : 'bg-[#ff9f00] hover:bg-[#f39700] text-white'
                                        }`}
                                >
                                    <ShoppingCart size={20} fill="currentColor" />
                                    {product.inStock === false
                                        ? 'Available Soon'
                                        : isAdding
                                            ? 'Adding...'
                                            : 'Add to Cart'}
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={isAdding || product.inStock === false}
                                    className={`flex-1 font-bold py-4 rounded-sm shadow-sm uppercase text-sm md:text-base flex items-center justify-center gap-2 transition-colors ${product.inStock === false
                                        ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                        : 'bg-[#fb641b] hover:bg-[#f05c17] text-white'
                                        }`}
                                >
                                    <Zap size={20} fill="currentColor" />
                                    {product.inStock === false ? 'Out of Stock' : 'Buy Now'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Product Details */}
                    <div className="md:w-[60%] lg:w-[65%] p-6 overflow-y-auto">
                        {/* Breadcrumbs */}
                        <div className="text-xs text-gray-500 flex items-center gap-1 mb-4">
                            <Link to="/" className="hover:text-blue-600">Home</Link>
                            <ChevronRight size={12} />
                            <Link to="/shop" className="hover:text-blue-600">Shop</Link>
                            <ChevronRight size={12} />
                            <span className="text-gray-400 truncate">{product.name}</span>
                        </div>

                        {/* Title & Rating */}
                        <h1 className="text-xl font-medium text-gray-800 mb-2">{product.name}</h1>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-sm flex items-center gap-1">
                                {product.rating} <Star size={10} fill="currentColor" />
                            </span>
                            <span className="text-gray-500 text-sm font-medium">{product.reviews} Ratings & {Math.floor(product.reviews * 0.4)} Reviews</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-4">
                            <span className="text-3xl font-bold text-gray-900">₹{currentPrice}</span>
                            <span className="text-gray-500 line-through text-base">₹{originalPrice}</span>
                            <span className="text-green-600 font-bold text-sm">{discount}% off</span>
                        </div>

                        {/* Offers */}


                        {/* Delivery */}
                        <div className="flex gap-12 mb-6">
                            <div className="w-24 text-gray-500 text-sm font-medium">Delivery</div>
                            <div className="flex-1">
                                <div className="text-gray-500"><Truck size={18} /></div>
                                <input
                                    type="text"
                                    placeholder="Enter Delivery Pincode"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                    className="outline-none text-sm font-medium text-gray-900 placeholder-gray-400 w-40"
                                />
                                <button onClick={checkPincode} className="text-blue-600 font-bold text-sm">Check</button>
                            </div>
                            <div className="text-sm">
                                {availabilityMessage && (
                                    <p className={`font-medium mb-1 ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                        {availabilityMessage}
                                    </p>
                                )}
                                {isAvailable && (
                                    <>
                                        <span className="font-bold text-gray-900">Delivery by {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                        <span className="text-gray-400 mx-2">|</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                        <span className="text-gray-500 line-through text-xs ml-1">₹40</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Size Selection */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div className="flex gap-12 mb-6">
                            <div className="w-24 text-gray-500 text-sm font-medium mt-2">Size</div>
                            <div className="flex gap-2 flex-wrap">
                                {product.sizes.map((sizeOption, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedSize(sizeOption)}
                                        className={`px-4 py-2 border-2 rounded-sm text-sm font-bold transition-all ${selectedSize && selectedSize.size === sizeOption.size
                                            ? 'border-blue-600 text-blue-600 bg-blue-50'
                                            : 'border-gray-300 text-gray-800 hover:border-blue-600'
                                            }`}
                                    >
                                        {sizeOption.size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Highlights */}
                    <div className="flex gap-12 mb-6">
                        <div className="w-24 text-gray-500 text-sm font-medium">Highlights</div>
                        <ul className="list-disc pl-4 space-y-2 text-sm text-gray-800">
                            <li>100% Plant-based ingredients</li>
                            <li>No harsh chemicals or toxins</li>
                            <li>Biodegradable & Eco-friendly</li>
                            <li>Safe for babies and pets</li>
                            <li>Effective stain removal</li>
                        </ul>
                    </div>

                    {/* Seller */}
                    <div className="flex gap-12 mb-8">
                        <div className="w-24 text-gray-500 text-sm font-medium">Seller</div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-blue-600 font-bold text-sm">ShineBro Official</span>
                                <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                    4.9 <Star size={8} fill="currentColor" />
                                </span>
                            </div>
                            <ul className="list-disc pl-4 text-sm text-gray-800">
                                <li>24 hour's replacement policy for undamaged product</li>
                                <li>GST invoice Not available</li>
                            </ul>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="border border-gray-200 rounded-sm mb-6">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-xl font-medium text-gray-800">Product Description</h2>
                        </div>
                        <div className="p-4 text-sm text-gray-700 leading-relaxed">
                            <p>{product.description || `Experience the power of nature with our ${product.name}. Formulated with plant-based ingredients, it effectively removes dirt and grime while being gentle on your hands and the environment. This product is designed to provide superior cleaning performance without the use of harmful chemicals. It is safe for use around children and pets, making it the perfect choice for a healthy home.`}</p>
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="border border-gray-200 rounded-sm">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-xl font-medium text-gray-800">Specifications</h2>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex gap-4">
                                    <div className="w-1/3 text-gray-500 text-sm">In The Box</div>
                                    <div className="w-2/3 text-sm text-gray-900">1 {product.name}</div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-1/3 text-gray-500 text-sm">Brand</div>
                                    <div className="w-2/3 text-sm text-gray-900">ShineBro</div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-1/3 text-gray-500 text-sm">Fragrance</div>
                                    <div className="w-2/3 text-sm text-gray-900">Natural Fresh</div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-1/3 text-gray-500 text-sm">Type</div>
                                    <div className="w-2/3 text-sm text-gray-900">{product.category}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ratings & Reviews */}
                    <div className="mt-8 border border-gray-200 rounded-sm">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-medium text-gray-800">Ratings & Reviews</h2>
                            <button className="shadow-md border border-gray-300 px-4 py-2 text-sm font-medium rounded-sm hover:shadow-lg transition-shadow">Rate Product</button>
                        </div>
                        <div className="p-6">
                            <div className="flex gap-8 mb-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-1">
                                        {product.rating} <Star size={24} fill="currentColor" className="text-gray-900" />
                                    </div>
                                    <div className="text-gray-500 text-sm mt-1">{product.reviews} Ratings & Reviews</div>
                                </div>
                                <div className="flex-1 space-y-1">
                                    {[5, 4, 3, 2, 1].map((star) => (
                                        <div key={star} className="flex items-center gap-2 text-xs">
                                            <span className="w-3 font-bold">{star}</span> <Star size={10} className="text-gray-400" />
                                            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${star >= 4 ? 'bg-green-500' : star === 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                    style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : 5}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-gray-400 w-6 text-right">{star === 5 ? 85 : star === 4 ? 25 : 5}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Individual Reviews */}
                            <div className="space-y-6">
                                <p className="text-gray-500 text-sm italic">No reviews yet.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
