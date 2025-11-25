import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingCart, Check, Loader2 } from 'lucide-react';

import { useCart } from '../context/CartContext';
import { products } from '../data/products';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        if (isAdding || isAdded) return;

        setIsAdding(true);

        // Simulate network delay
        setTimeout(() => {
            const productToAdd = {
                ...product,
                selectedSize: selectedSize,
                price: selectedSize ? selectedSize.price : product.price
            };
            addToCart(productToAdd, quantity);
            setIsAdding(false);
            setIsAdded(true);

            // Reset success state after 2 seconds
            setTimeout(() => {
                setIsAdded(false);
            }, 2000);
        }, 600);
    };

    React.useEffect(() => {
        const productData = products.find(p => p.id === parseInt(id));
        if (productData) {
            setProduct(productData);
            // Set default size if product has sizes
            if (productData.sizes && productData.sizes.length > 0) {
                setSelectedSize(productData.sizes[1]); // Default to middle size (500ml)
            }
        }
        setLoading(false);
    }, [id]);

    if (loading) {
        return <div className="container mx-auto px-4 py-20 text-center">Loading...</div>;
    }

    if (!product) {
        return <div className="container mx-auto px-4 py-20 text-center">Product not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row gap-12">
                {/* Image Gallery */}
                <div className="md:w-1/2">
                    <div className="bg-gray-50 rounded-3xl overflow-hidden mb-4">
                        <img src={product.image} alt={product.name} className="w-full h-auto object-cover" />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-gray-50 rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary">
                                <img src={product.image} alt="Thumbnail" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="md:w-1/2">
                    <div className="mb-2 text-primary font-bold uppercase tracking-wider text-sm">{product.category}</div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={20} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                            ))}
                        </div>
                        <span className="text-gray-500">({product.reviews} reviews)</span>
                    </div>

                    <div className="text-3xl font-bold text-gray-900 mb-8">
                        ₹{selectedSize ? selectedSize.price : product.price}
                    </div>

                    {/* Size Selection */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Select Size</label>
                            <div className="flex gap-3">
                                {product.sizes.map((sizeOption, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedSize(sizeOption)}
                                        className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${selectedSize && selectedSize.size === sizeOption.size
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-gray-300 hover:border-primary'
                                            }`}
                                    >
                                        {sizeOption.size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Experience the power of nature with our {product.name}. Formulated with plant-based ingredients,
                        it effectively removes dirt and grime while being gentle on your hands and the environment.
                        Safe for babies and pets.
                    </p>

                    {/* Quantity & Add to Cart */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="flex items-center border border-gray-300 rounded-full w-max">
                            <button
                                className="p-3 hover:text-primary"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                <Minus size={20} />
                            </button>
                            <span className="w-12 text-center font-bold">{quantity}</span>
                            <button
                                className="p-3 hover:text-primary"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className={`flex-1 px-8 py-3 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${isAdded
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-primary hover:bg-green-700 text-white'
                                }`}
                        >
                            {isAdding ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" /> Adding...
                                </>
                            ) : isAdded ? (
                                <>
                                    <Check size={20} /> Added to Cart!
                                </>
                            ) : (
                                <>
                                    <ShoppingCart size={20} /> Add to Cart
                                </>
                            )}
                        </button>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 border-t border-gray-100 pt-8">
                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="bg-green-100 p-1 rounded-full text-primary"><Check size={16} /></div>
                            <span>100% Plant-based ingredients</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="bg-green-100 p-1 rounded-full text-primary"><Check size={16} /></div>
                            <span>No harsh chemicals or toxins</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="bg-green-100 p-1 rounded-full text-primary"><Check size={16} /></div>
                            <span>Biodegradable & Eco-friendly</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
