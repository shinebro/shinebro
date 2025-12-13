import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Truck, Lock, Smartphone } from 'lucide-react';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, cartTotal, clearCart } = useCart();
    const { user, openAuth, updateProfile } = useAuth(); // Destructure updateProfile

    // ... (rest of component state)

    const handleProceedToSummary = async (e) => { // Make async
        e.preventDefault();
        if (!allowedPincodes.includes(formData.pincode)) {
            setPincodeError('Invalid Pincode');
            setIsPincodeVerified(false);
            return;
        }

        // Save details if user is logged in
        if (user) {
            try {
                await updateProfile(formData);
                console.log("Profile updated with checkout details");
            } catch (err) {
                console.error("Failed to auto-save profile:", err);
                // Don't block checkout if save fails
            }
        }

        navigate('/order-summary', { state: { formData } });
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <button onClick={() => navigate('/')} className="text-primary hover:underline">
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12 relative">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>

                <div className="max-w-3xl mx-auto">
                    {/* Step 1: Delivery Availability */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Truck className="text-primary" />
                            <h2 className="text-xl font-bold text-gray-900">Delivery Availability</h2>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                            <div className="flex-1 w-full">
                                <input
                                    type="text"
                                    placeholder="Enter Delivery Pincode"
                                    value={pincodeInput}
                                    onChange={(e) => {
                                        setPincodeInput(e.target.value);
                                        setIsPincodeVerified(false);
                                        setPincodeError('');
                                    }}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                                {pincodeError && <p className="text-red-500 text-sm mt-2">{pincodeError}</p>}
                                {isPincodeVerified && <p className="text-green-600 text-sm mt-2 font-medium">Delivery available! Please fill in your details below.</p>}
                            </div>
                            <button
                                onClick={handleCheckPincode}
                                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
                            >
                                Check
                            </button>
                        </div>
                    </div>

                    {/* Step 2: Shipping Information (Conditional) */}
                    {isPincodeVerified && (
                        <form onSubmit={handleProceedToSummary} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white p-8 rounded-2xl shadow-sm mb-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <Truck className="text-primary" />
                                        <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none md:col-span-2"
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Street Address"
                                        value={formData.address}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none md:col-span-2"
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={formData.city}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        onChange={handleInputChange}
                                    />
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="pincode"
                                            placeholder="Pincode"
                                            value={formData.pincode}
                                            readOnly
                                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                                        />
                                        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        required
                                        maxLength="10"
                                        pattern="\d{10}"
                                        title="Please enter exactly 10 digits"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none md:col-span-2"
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setFormData(prev => ({ ...prev, phone: val }));
                                        }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-green-700 text-white py-4 rounded-full font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
                            >
                                Proceed to Order Summary
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Checkout;
