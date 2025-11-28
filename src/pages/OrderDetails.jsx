import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, MapPin, ChevronRight, Star, Download, HelpCircle } from 'lucide-react';
import { products } from '../data/products';

const OrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        // Mock order data
        const mockOrder = {
            id: orderId || 'OD123456789012345',
            date: 'Fri, Nov 24, 2023',
            total: 599,
            status: 'Delivered',
            deliveryDate: 'Sun, Nov 26',
            address: {
                name: 'Nishant Kumar',
                phone: '9876543210',
                street: '123, ShineBro Street, Tech Park',
                city: 'Bangalore',
                state: 'Karnataka',
                pincode: '560103'
            },
            items: [
                {
                    ...products[0], // Use the first product as a mock item
                    quantity: 1,
                    price: 499,
                    status: 'Delivered',
                    deliveryDate: 'Sun, Nov 26'
                }
            ],
            tracking: [
                { status: 'Order Placed', date: 'Fri, 24 Nov', completed: true },
                { status: 'Packed', date: 'Sat, 25 Nov', completed: true },
                { status: 'Shipped', date: 'Sat, 25 Nov', completed: true },
                { status: 'Out for Delivery', date: 'Sun, 26 Nov', completed: true },
                { status: 'Delivered', date: 'Sun, 26 Nov', completed: true }
            ]
        };
        setOrder(mockOrder);
    }, [orderId]);

    if (!order) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="bg-gray-100 min-h-screen py-6">
            <div className="container mx-auto px-4 max-w-[1200px]">
                {/* Breadcrumbs */}
                <div className="text-xs text-gray-500 flex items-center gap-1 mb-4">
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
                                <p className="font-bold mb-1">{order.address.name}</p>
                                <p className="text-gray-600 mb-1">{order.address.street}</p>
                                <p className="text-gray-600 mb-1">{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                                <p className="font-bold mt-2">Phone number</p>
                                <p className="text-gray-600">{order.address.phone}</p>
                            </div>
                        </div>
                        <div className="bg-white shadow-sm rounded-sm p-4">
                            <h3 className="font-medium text-gray-900 mb-2">More Actions</h3>
                            <div className="flex items-center gap-3 text-sm text-gray-700 py-2 border-b border-gray-100 cursor-pointer hover:text-blue-600">
                                <Download size={16} /> Download Invoice
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-700 py-2 cursor-pointer hover:text-blue-600">
                                <HelpCircle size={16} /> Need Help?
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Items & Tracking */}
                    <div className="md:w-2/3 space-y-4">
                        {order.items.map((item, index) => (
                            <div key={index} className="bg-white shadow-sm rounded-sm p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Product Image & Details */}
                                    <div className="flex gap-4 md:w-1/3 relative">
                                        <div className="w-20 h-20 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
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

                                            {order.tracking.map((step, i) => (
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
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                                            <span className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">Rate & Review Product</span>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star key={star} size={16} className="text-gray-300 hover:text-yellow-400 cursor-pointer" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
