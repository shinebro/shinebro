import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Loader2, CheckCircle, ShieldCheck } from 'lucide-react';

const GPayPayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const orderData = location.state?.orderData;

    useEffect(() => {
        if (!orderData) {
            navigate('/checkout');
        }
    }, [orderData, navigate]);

    const handlePayment = async () => {
        setProcessing(true);

        // Simulate GPay processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Now create the order on backend
        try {
            const finalOrderData = {
                ...orderData,
                date: new Date().toISOString()
            };

            const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalOrderData),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    clearCart();
                    navigate('/order-success', { state: { orderId: data.orderId } });
                }, 1500);
            } else {
                alert('Payment failed. Please try again.');
                setProcessing(false);
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Payment error. Please try again.');
            setProcessing(false);
        }
    };

    if (!orderData) return null;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative">
                {/* GPay Header */}
                <div className="bg-white p-6 flex flex-col items-center border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-gray-600">Google</span>
                        <span className="text-2xl font-bold text-gray-600">Pay</span>
                    </div>
                    <div className="text-sm text-gray-500">{orderData.upiId}</div>
                </div>

                {/* Payment Body */}
                <div className="p-8 flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4">
                        SB
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Paying ShineBro</h2>
                    <p className="text-gray-500 mb-8">Banking Name: SHINEBRO RETAIL</p>

                    <div className="text-4xl font-bold text-gray-900 mb-12">
                        ₹{orderData.total.toFixed(2)}
                    </div>

                    {success ? (
                        <div className="flex flex-col items-center animate-fadeIn">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg">
                                <CheckCircle size={40} />
                            </div>
                            <p className="text-xl font-bold text-gray-800">Payment Successful!</p>
                        </div>
                    ) : (
                        <button
                            onClick={handlePayment}
                            disabled={processing}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-full font-bold text-lg shadow-lg transition-transform transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <Loader2 size={24} className="animate-spin" /> Processing...
                                </>
                            ) : (
                                <>Pay ₹{orderData.total}</>
                            )}
                        </button>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 flex justify-center items-center gap-2 text-xs text-gray-500">
                    <ShieldCheck size={14} />
                    <span>Powered by UPI & Google Pay</span>
                </div>
            </div>
        </div>
    );
};

export default GPayPayment;
