import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const OrderSuccess = () => {
    const location = useLocation();
    const { orderId } = location.state || { orderId: 'UNKNOWN' };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="flex justify-center mb-6">
                    <CheckCircle className="text-green-500 w-20 h-20" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h2>
                <p className="text-gray-600 mb-6">
                    Thank you for your purchase. Your order has been received and is being processed.
                </p>
                <div className="bg-green-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Order ID</p>
                    <p className="text-2xl font-mono font-bold text-primary">{orderId}</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 text-left">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="text-2xl">💵</div>
                        <div>
                            <p className="font-bold text-gray-900">Payment Method</p>
                            <p className="text-sm text-gray-600">Cash on Delivery</p>
                        </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> Please keep exact change ready for the delivery person.
                        </p>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-8 text-left">
                    <p className="font-semibold text-gray-900 mb-2">📦 What's Next?</p>
                    <ul className="text-sm text-gray-600 space-y-2">
                        <li>✅ You'll receive an order confirmation email shortly</li>
                        <li>📞 We'll call you to confirm your order</li>
                        <li>🚚 Your order will be delivered in 4-8 business days</li>
                        <li>💰 Pay in cash when you receive your order</li>
                    </ul>
                </div>

                <Link
                    to="/"
                    className="w-full bg-primary hover:bg-green-700 text-white font-bold py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-colors"
                >
                    Continue Shopping <ArrowRight size={20} />
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;
