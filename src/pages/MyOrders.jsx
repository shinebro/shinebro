import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, ChevronLeft, Search, Filter, Trash2 } from 'lucide-react';

const MyOrders = () => {
    const { user } = useAuth();
    const [myOrders, setMyOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleDeleteOrder = async (e, orderId) => {
        e.preventDefault(); // Prevent navigation to details
        if (!window.confirm('Are you sure you want to delete this order from your history?')) return;

        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'DELETE',
            });
            const data = await response.json();

            if (data.success) {
                setMyOrders(prev => prev.filter(order => order.id !== orderId));
            } else {
                alert(data.message || 'Failed to delete order');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Failed to connect to server');
        }
    };

    useEffect(() => {
        const fetchMyOrders = async () => {
            if (user && user.email) {
                try {
                    const response = await fetch(`/api/orders?email=${user.email}`);
                    if (response.ok) {
                        const data = await response.json();
                        setMyOrders(data);
                    }
                } catch (error) {
                    console.error('Error fetching orders:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setMyOrders([]);
                setLoading(false);
            }
        };
        fetchMyOrders();
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <Package size={48} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Please log in</h2>
                    <p className="text-gray-500 mb-6">You need to look at your orders history.</p>
                    <Link to="/profile" className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                    <Link to="/" className="hover:text-primary">Home</Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-900 font-medium">My Orders</span>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Package className="text-primary" /> My Orders ({myOrders.length})
                    </h1>
                </div>

                <div className="bg-white shadow rounded-2xl overflow-hidden min-h-[400px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : myOrders.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {myOrders.map((order) => (
                                <Link
                                    to={`/order/${order.id}`}
                                    key={order.id}
                                    className="block p-6 hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-20 w-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                                            <Package className="text-gray-400" size={32} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start md:items-center">
                                                <div>
                                                    <p className="font-medium text-gray-900 truncate">{order.itemsSummary || 'Order Items'}</p>
                                                    <p className="text-sm text-gray-500 mt-1">Order ID: {order.id}</p>
                                                    <p className="text-sm text-gray-500">Ordered on {order.date}</p>
                                                </div>
                                                <div className="text-right hidden md:block">
                                                    <p className="font-bold text-gray-900">₹{order.total}</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex flex-wrap items-center gap-2 justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                    {order.status === 'Delivered' && (
                                                        <span className="text-xs text-gray-500">Delivered on {order.deliveryDate || 'Unknown'}</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="md:hidden font-bold text-gray-900">₹{order.total}</div>

                                                    {['Delivered', 'Cancelled'].includes(order.status) && (
                                                        <button
                                                            onClick={(e) => handleDeleteOrder(e, order.id)}
                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
                                                            title="Delete Order"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className="text-gray-400 group-hover:text-primary transition-colors ml-2" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                            <Package size={48} className="text-gray-200 mb-4" />
                            <p className="text-gray-500 text-lg mb-2">No orders found yet</p>
                            <p className="text-gray-400 text-sm mb-6">Looks like you haven't placed any orders yet.</p>
                            <Link to="/shop" className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                                Start Shopping
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
