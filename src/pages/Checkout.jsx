import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Truck, Lock, Smartphone } from 'lucide-react';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, cartTotal, clearCart } = useCart();
    const { user, openAuth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        zipCode: '',
        state: '',
        phone: ''
    });
    const [processingPayment, setProcessingPayment] = useState(false);

    // Pincode Check State
    const [pincodeInput, setPincodeInput] = useState('');
    const [pincodeError, setPincodeError] = useState('');
    const [isPincodeVerified, setIsPincodeVerified] = useState(false);
    const allowedPincodes = ['400601', '400602', '400603', '400604'];

    useEffect(() => {
        if (user && user.shippingInfo) {
            setFormData(prev => ({
                ...prev,
                ...user.shippingInfo,
                email: user.email,
                firstName: user.name ? user.name.split(' ')[0] : '',
                lastName: user.name ? user.name.split(' ').slice(1).join(' ') : ''
            }));
            if (user.shippingInfo.zipCode) {
                setPincodeInput(user.shippingInfo.zipCode);
            }
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckPincode = (e) => {
        e.preventDefault();
        if (!pincodeInput) {
            setPincodeError('Please enter a pincode');
            return;
        }
        if (allowedPincodes.includes(pincodeInput)) {
            setIsPincodeVerified(true);
            setPincodeError('');
            setFormData(prev => ({ ...prev, zipCode: pincodeInput }));
        } else {
            setIsPincodeVerified(false);
            setPincodeError('Delivery is not available for this pincode. Allowed pincodes: ' + allowedPincodes.join(', '));
        }
    };

    const handleProceedToSummary = (e) => {
        e.preventDefault();
        if (!allowedPincodes.includes(formData.zipCode)) {
            setPincodeError('Invalid Pincode');
            setIsPincodeVerified(false);
            return;
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
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="State"
                                        value={formData.state}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        onChange={handleInputChange}
                                    />
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="zipCode"
                                            placeholder="ZIP Code"
                                            value={formData.zipCode}
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
