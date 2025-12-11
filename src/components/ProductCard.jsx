import React, { useState } from 'react';
import { Star, ShoppingCart, Loader2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import floorCleanerNew from '../assets/floor-cleaner-new.jpg';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (isAdding || isAdded) return;

        setIsAdding(true);

        // Simulate network delay
        setTimeout(() => {
            addToCart(product);
            setIsAdding(false);
            setIsAdded(true);

            // Reset success state after 2 seconds
            setTimeout(() => {
                setIsAdded(false);
            }, 2000);
        }, 600);
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden group cursor-pointer relative"
        >
            <div className="relative">
                <img
                    src={product.id === 3 ? floorCleanerNew : product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.isNew && (
                    <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        NEW
                    </span>
                )}

                <button
                    onClick={handleAddToCart}
                    disabled={isAdding || product.inStock === false}
                    className={`absolute bottom-3 right-3 p-2 rounded-full shadow-md transition-all transform translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 duration-300 ${product.inStock === false
                        ? 'bg-gray-400 cursor-not-allowed'
                        : isAdded
                            ? 'bg-green-500 text-white'
                            : 'bg-primary text-white hover:bg-green-700'
                        }`}
                    title={product.inStock === false ? "Available Soon" : "Add to Cart"}
                >
                    {isAdding ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : isAdded ? (
                        <Check size={20} />
                    ) : (
                        <ShoppingCart size={20} />
                    )}
                </button>
            </div>

            <div className="p-4">
                <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                <h3 className="font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                </h3>

                <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400 text-xs">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                        ))}
                    </div>
                    <span className="text-xs text-gray-400 ml-2">({product.reviews})</span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-gray-900">₹{product.price}</span>
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding || product.inStock === false}
                        className={`text-sm font-medium hover:underline transition-colors ${product.inStock === false
                            ? 'text-gray-400 cursor-not-allowed no-underline'
                            : isAdded
                                ? 'text-green-600'
                                : 'text-primary'
                            }`}
                    >
                        {product.inStock === false
                            ? 'Available Soon'
                            : isAdding
                                ? 'Adding...'
                                : isAdded
                                    ? 'Added to Cart!'
                                    : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
