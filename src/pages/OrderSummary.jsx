import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';
import { addOrder } from '../utils/orderStorage';

const OrderSummary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart, cartTotal, clearCart } = useCart();
    const [processingPayment, setProcessingPayment] = useState(false);

    const { user, updateProfile } = useAuth(); // Import user and updateProfile

    const { formData } = location.state || {};

    if (!formData) {
        // Redirect back to checkout if no data
        React.useEffect(() => {
            navigate('/checkout');
        }, [navigate]);
        return null;
    }

    const handlePlaceOrder = async () => {
        console.log('🔵 Confirm Order button clicked!');
        setProcessingPayment(true);

        const orderData = {
            customer: formData,
            items: cart.map(item => {
                const { selectedSize, ...rest } = item;
                return {
                    ...rest,
                    selectedSize: selectedSize ? String(selectedSize) : ""
                };
            }),
            total: cartTotal,
            paymentMethod: 'cod',
            date: new Date().toISOString()
        };

        console.log('📦 Sending order:', orderData);

        try {
            console.log('🌐 Fetching API...');

            // Create a controller to abort the fetch if it takes too long
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
                signal: controller.signal
            });

            clearTimeout(timeoutId); // Clear timeout if successful

            console.log('✅ Response status:', response.status);
            const data = await response.json();
            console.log('📄 Response data:', data);

            if (response.ok && data.success) {
                console.log('🎉 Order successful! Navigating to success page...');

                // Sync with Admin Dashboard (localStorage)
                const adminOrder = {
                    id: data.orderId,
                    email: formData.email,
                    customer: `${formData.firstName} ${formData.lastName}`,
                    date: new Date().toLocaleDateString(),
                    itemsSummary: `${cart.length} items`, // Simplified for list view
                    total: cartTotal,
                    status: 'Placed',
                    items: orderData.items, // Full details for order view
                    address: {
                        name: `${formData.firstName} ${formData.lastName}`,
                        phone: formData.phone,
                        street: formData.address,
                        city: formData.city,
                        state: formData.state || '',
                        pincode: formData.zipCode
                    }
                };
                addOrder(adminOrder);

                // Update user profile with shipping info if logged in
                if (user) {
                    console.log('👤 Updating user profile...');
                    await updateProfile(formData);
                }
                clearCart();
                console.log('🚀 Navigating to /order-success');
                navigate('/order-success', { state: { orderId: data.orderId } });
            } else {
                console.error('❌ Order failed:', data);
                alert(`Order failed: ${data.message || 'Please try again.'}`);
            }
        } catch (error) {
            console.error('💥 Error placing order:', error);
            // Fallback for demo/offline mode
            console.log('⚠️ API failed, switching to offline mode...');

            const offlineOrderId = `ORD-${Date.now()}`;

            const adminOrder = {
                id: offlineOrderId,
                email: formData.email,
                customer: `${formData.firstName} ${formData.lastName}`,
                date: new Date().toLocaleDateString(),
                itemsSummary: `${cart.length} items`,
                total: cartTotal,
                status: 'Placed',
                items: orderData.items,
                address: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    phone: formData.phone,
                    street: formData.address,
                    city: formData.city,
                    state: formData.state || '',
                    pincode: formData.zipCode
                }
            };
            addOrder(adminOrder);
            clearCart();
            navigate('/order-success', { state: { orderId: offlineOrderId } });

        } finally {
            console.log('🏁 Setting processingPayment to false');
            setProcessingPayment(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Order Summary</h1>

                <div className="bg-white p-8 rounded-2xl shadow-sm mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping To</h2>
                    <div className="text-gray-700">
                        <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                        <p>{formData.address}</p>
                        <p>{formData.city}, {formData.zipCode}</p>
                        <p>{formData.phone}</p>
                        <p>{formData.email}</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Items</h2>
                    <div className="space-y-4 mb-6">
                        {cart.map((item) => (
                            <div key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{item.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 pt-4 space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>₹{cartTotal}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span className="text-green-600 font-medium">Free</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-gray-100 mt-2">
                            <span>Total</span>
                            <span>₹{cartTotal}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Method Section */}
                <div className="bg-white p-8 rounded-2xl shadow-sm mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                    <div className="border-2 border-primary rounded-lg p-4 bg-green-50">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full border-2 border-primary bg-primary flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-gray-900">Cash on Delivery (COD)</p>
                                <p className="text-sm text-gray-600 mt-1">Pay when you receive your order</p>
                            </div>
                            <div className="text-3xl">💵</div>
                        </div>
                    </div>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> Please keep exact change ready. Our delivery partner will collect ₹{cartTotal} at the time of delivery.
                        </p>
                    </div>
                </div>

                <button
                    onClick={handlePlaceOrder}
                    disabled={processingPayment}
                    className="w-full bg-primary hover:bg-green-700 text-white py-4 rounded-full font-bold text-lg transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                    {processingPayment ? 'Processing Order...' : 'Confirm Order'}
                </button>

                <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
                    <Lock size={12} /> Secure Checkout
                </p>
            </div>
        </div>
    );
};

export default OrderSummary;
