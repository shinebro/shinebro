import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Star, Download, HelpCircle, X, Send, Printer } from 'lucide-react';

const OrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [showRateModal, setShowRateModal] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [selectedItemForReview, setSelectedItemForReview] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/orders/${orderId}`);
                if (response.ok) {
                    const fetchedOrder = await response.json();
                    setOrder(fetchedOrder);
                } else {
                    setOrder(null);
                }
            } catch (error) {
                console.error('Error fetching order:', error);
                setOrder(null);
            }
        };
        fetchOrder();
    }, [orderId]);

    const handleDownloadInvoice = () => {
        window.print();
    };

    const openRateModal = (item) => {
        setSelectedItemForReview(item);
        setRating(item.rating || 0); // Pre-fill if already rated (mock)
        setShowRateModal(true);
    };

    const submitReview = (e) => {
        e.preventDefault();
        // In a real app, send to API
        console.log(`Submitted review for ${selectedItemForReview.name}: ${rating} stars, "${review}"`);
        setShowRateModal(false);
        setReview('');
        setRating(0);
        alert('Thank you for your review!');
    };

    if (!order) return <div className="min-h-screen flex items-center justify-center text-xl">Order not found</div>;

    return (
        <div className="bg-gray-100 min-h-screen py-6">
            <div className="container mx-auto px-4 max-w-[1200px]">
                {/* Breadcrumbs */}
                <div className="text-xs text-gray-500 flex items-center gap-1 mb-4 print:hidden">
                    <Link to="/" className="hover:text-blue-600">Home</Link>
                    <ChevronRight size={12} />
                    <Link to="/profile" className="hover:text-blue-600">My Account</Link>
                    <ChevronRight size={12} />
                    <Link to="/orders" className="hover:text-blue-600">My Orders</Link>
                    <ChevronRight size={12} />
                    <span className="text-gray-400">{order.id}</span>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    {/* Left Column - Delivery Address & Rewards */}
                    <div className="md:w-1/3 space-y-4">
                        <div className="bg-white shadow-sm rounded-sm p-4">
                            <h3 className="font-medium text-gray-900 mb-3">Delivery Address</h3>
                            <div className="text-sm">
                                <p className="font-bold mb-1">{order.address?.name || 'N/A'}</p>
                                <p className="text-gray-600 mb-1">{order.address?.street || ''}</p>
                                <p className="text-gray-600 mb-1">{order.address?.city || ''}, {order.address?.state || ''} - {order.address?.pincode || ''}</p>
                                <p className="font-bold mt-2">Phone number</p>
                                <p className="text-gray-600">{order.address?.phone || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="bg-white shadow-sm rounded-sm p-4 print:hidden">
                            <h3 className="font-medium text-gray-900 mb-2">More Actions</h3>
                            <button
                                onClick={handleDownloadInvoice}
                                className="w-full flex items-center gap-3 text-sm text-gray-700 py-3 border-b border-gray-100 cursor-pointer hover:text-blue-600 hover:bg-gray-50 px-2 rounded transition-colors text-left"
                            >
                                <Download size={16} /> Download Invoice
                            </button>
                            <button
                                onClick={() => setShowHelpModal(true)}
                                className="w-full flex items-center gap-3 text-sm text-gray-700 py-3 cursor-pointer hover:text-blue-600 hover:bg-gray-50 px-2 rounded transition-colors text-left"
                            >
                                <HelpCircle size={16} /> Need Help?
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Order Items & Tracking */}
                    <div className="md:w-2/3 space-y-4">
                        {order.items?.map((item, index) => (
                            <div key={index} className="bg-white shadow-sm rounded-sm p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Product Image & Details */}
                                    <div className="flex gap-4 md:w-1/3 relative">
                                        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        <div>
                                            <Link to={`/product/${item.id}`} className="font-medium text-gray-900 hover:text-blue-600 text-sm block mb-1">
                                                {item.name}
                                            </Link>
                                            <p className="text-xs text-gray-500 mb-1">Size: {item.selectedSize?.size || 'Standard'}</p>
                                            <p className="text-xs text-gray-500 mb-2">Seller: ShineBro Official</p>
                                            <p className="font-bold text-gray-900">₹{item.price}</p>
                                        </div>
                                    </div>

                                    {/* Tracking Status */}
                                    <div className="md:w-2/3">
                                        <div className="relative pb-8">
                                            {/* Progress Bar Line */}
                                            <div className="absolute top-2 left-2.5 h-full w-0.5 bg-gray-200"></div>

                                            {order.tracking?.map((step, i) => (
                                                <div key={i} className="relative flex items-start gap-4 mb-6 last:mb-0">
                                                    <div className={`z-10 w-5 h-5 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-500' : 'bg-gray-200'}`}>
                                                        {step.completed && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                                    </div>
                                                    <div className="-mt-1">
                                                        <p className={`text-sm font-medium ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>{step.status}</p>
                                                        <p className="text-xs text-gray-500">{step.date}</p>
                                                        {step.status === 'Delivered' && step.completed && (
                                                            <p className="text-xs text-gray-500 mt-1">Your item has been delivered</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Rate Product */}
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4 print:hidden">
                                            <button
                                                onClick={() => openRateModal(item)}
                                                className="text-sm text-blue-600 font-medium cursor-pointer hover:underline flex items-center gap-1"
                                            >
                                                <Star size={16} /> Rate & Review Product
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Rate & Review Modal */}
            {showRateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="font-bold text-lg">Rate Product</h3>
                            <button onClick={() => setShowRateModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={submitReview} className="p-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded p-2">
                                    <img src={selectedItemForReview?.image} alt="" className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm line-clamp-2">{selectedItemForReview?.name}</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-2 py-4">
                                <p className="text-sm text-gray-600">How would you rate this product?</p>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                        >
                                            <Star size={32} fill={rating >= star ? "currentColor" : "none"} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Write a Review</label>
                                <textarea
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                                    placeholder="What did you like or dislike?"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Send size={18} /> Submit Review
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Need Help Modal */}
            {showHelpModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-sm animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <HelpCircle className="text-primary" /> Need Help?
                            </h3>
                            <button onClick={() => setShowHelpModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-gray-600 text-sm">
                                Have an issue with your order? Our support team is here to help you.
                            </p>

                            <div className="space-y-3">
                                <a href="mailto:support@shinebro.com" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                        <Send size={18} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">Email Support</p>
                                        <p className="text-xs text-gray-500">support@shinebro.com</p>
                                    </div>
                                </a>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                                        <HelpCircle size={18} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">FAQs</p>
                                        <Link to="/contact" onClick={() => setShowHelpModal(false)} className="text-xs text-blue-600 hover:underline">
                                            Visit our Help Center
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowHelpModal(false)}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;
