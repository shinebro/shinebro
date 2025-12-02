import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-8">Looks like you haven't added anything yet.</p>
                <Link to="/" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Cart Items */}
                <div className="lg:w-2/3 space-y-4 sm:space-y-6">
                    {cart.map(item => (
                        <div key={item.id} className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                            <img src={item.image} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl" />

                            <div className="flex-1 text-center sm:text-left w-full sm:w-auto">
                                <h3 className="font-bold text-base sm:text-lg text-gray-900">{item.name}</h3>
                                <p className="text-gray-500 text-xs sm:text-sm">{item.category}</p>
                            </div>

                            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                                <div className="flex items-center border border-gray-200 rounded-full">
                                    <button
                                        className="p-2 hover:text-primary"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                                    <button
                                        className="p-2 hover:text-primary"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <div className="font-bold text-lg sm:w-20 text-right">
                                    ₹{item.price * item.quantity}
                                </div>
                            </div>

                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors absolute top-4 right-4 sm:static"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹{cartTotal}</span>
                            </div>
                        </div>

                        <Link
                            to="/checkout"
                            className="w-full bg-primary hover:bg-green-700 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                            Checkout <ArrowRight size={20} />
                        </Link>

                        <p className="text-xs text-gray-400 text-center mt-4">
                            Secure Checkout. 100% Satisfaction Guaranteed.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
