import React from 'react';
import { Mail } from 'lucide-react';

const ReturnPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Refund & Return Policy</h1>
                
                <div className="prose prose-lg max-w-none">
                    <div className="bg-green-50 border-l-4 border-primary p-6 rounded-lg mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-0">We've Got You Covered</h2>
                        <p className="text-gray-700 mb-0">
                            If your order arrives damaged or you receive the wrong item, don't worry — we'll make it right. 
                            We're happy to replace the damaged or incorrect item or offer a refund for that unit, depending on the situation.
                        </p>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Information</h2>
                        <p className="text-gray-700 mb-4">
                            Please note that we currently <strong>do not accept returns or exchanges</strong>, and return pickups are not possible.
                        </p>
                        <p className="text-gray-700">
                            You won't need to send the product back — just follow the simple steps below, and we'll take care of the rest.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-0">How to Report an Issue</h2>
                        <ol className="space-y-3 text-gray-700 pl-5">
                            <li className="pl-2">
                                <strong>Act quickly:</strong> Email us within <strong>24 hours</strong> of receiving your order.
                            </li>
                            <li className="pl-2">
                                <strong>Include details:</strong> Provide your order number and a clear photo of the damaged or incorrect item.
                            </li>
                            <li className="pl-2">
                                <strong>We'll respond:</strong> Our team will review your case and coordinate a replacement or refund.
                            </li>
                        </ol>
                    </div>

                    <div className="bg-primary/10 border-2 border-primary p-6 rounded-lg text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
                            <Mail className="text-primary" size={24} />
                            Contact Us
                        </h3>
                        <p className="text-gray-700 mb-3">
                            Email us at:
                        </p>
                        <a 
                            href="mailto:shinebrofficial2@gmail.com" 
                            className="text-primary text-lg font-bold hover:underline"
                        >
                            shinebrofficial2@gmail.com
                        </a>
                    </div>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        <p>
                            We appreciate your understanding and are committed to ensuring your satisfaction with every ShineBro order.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnPolicy;
