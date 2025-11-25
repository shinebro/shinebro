import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WhatsAppButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const phoneNumber = '918450946341'; // WhatsApp number in international format without + or spaces
    const defaultMessage = 'Hello! I have a question about your products.';

    const handleWhatsAppClick = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
        window.open(url, '_blank');
        setIsOpen(false);
    };

    return (
        <>
            {/* Floating WhatsApp Button */}
            <div className="fixed bottom-6 right-6 z-50">
                {isOpen && (
                    <div
                        className="mb-4 bg-white rounded-2xl shadow-2xl p-6 w-80"
                        style={{
                            animation: 'slideUp 0.3s ease-out'
                        }}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                    <MessageCircle className="text-white" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">ShineBro Support</h3>
                                    <p className="text-sm text-gray-500">Online</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-4 text-sm">
                            Hi there! 👋<br />
                            Need help? Chat with us on WhatsApp for instant support.
                        </p>
                        <a
                            href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsOpen(false)}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                            <MessageCircle size={20} />
                            Start Chat
                        </a>
                    </div>
                )}

                {/* Main WhatsApp Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-110 group"
                    aria-label="WhatsApp Support"
                >
                    {isOpen ? (
                        <X className="text-white" size={28} />
                    ) : (
                        <MessageCircle className="text-white" size={28} />
                    )}

                    {/* Pulse Effect */}
                    {!isOpen && (
                        <span className="absolute inset-0 w-16 h-16 bg-green-500 rounded-full opacity-20" style={{
                            animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite'
                        }}></span>
                    )}
                </button>
            </div>

            {/* CSS Animation Styles */}
            <style>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes ping {
                    75%, 100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `}</style>
        </>
    );
};

export default WhatsAppButton;
