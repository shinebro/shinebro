import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, AlertCircle, ChevronDown, LogOut, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching orders from /api/orders...');
            const response = await fetch('/api/orders');
            if (response.ok) {
                const data = await response.json();
                console.log('AdminDashboard: Fetched orders:', data);
                setOrders(data);
            } else {
                console.error('AdminDashboard: Failed to fetch orders', response.status);
                setError(`Failed to fetch orders (Status: ${response.status})`);
            }
        } catch (error) {
            console.error('AdminDashboard: Error fetching orders:', error);
            setError(`Error connecting to server: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        // Cleanup function: Clear session when component unmounts (user leaves page)
        return () => {
            sessionStorage.removeItem('isAdmin');
        };
    }, []);

    const statusOptions = ['Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Placed': return 'bg-blue-100 text-blue-800';
            case 'Packed': return 'bg-yellow-100 text-yellow-800';
            case 'Shipped': return 'bg-purple-100 text-purple-800';
            case 'Out for Delivery': return 'bg-orange-100 text-orange-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                // Update local state to reflect change immediately
                setOrders(orders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                ));
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error updating status');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            try {
                const response = await fetch(`/api/orders/${orderId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setOrders(orders.filter(order => order.id !== orderId));
                } else {
                    alert('Failed to delete order');
                }
            } catch (error) {
                console.error('Error deleting order:', error);
                alert('Error deleting order');
            }
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('isAdmin');
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={fetchOrders}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Refresh Orders
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-full text-blue-600"><Package size={20} /></div>
                            <div>
                                <p className="text-xs text-gray-500">Total Orders</p>
                                <p className="text-lg font-bold">{orders.length}</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3">
                            <div className="p-2 bg-green-50 rounded-full text-green-600"><CheckCircle size={20} /></div>
                            <div>
                                <p className="text-xs text-gray-500">Delivered</p>
                                <p className="text-lg font-bold">{orders.filter(o => o.status === 'Delivered').length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-gray-500">
                                            Loading orders...
                                        </td>
                                    </tr>
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-gray-500">
                                            No orders found. Place an order to see it here.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 text-sm font-medium text-blue-600">{order.id}</td>
                                            <td className="p-4 text-sm text-gray-900">{order.customer}</td>
                                            <td className="p-4 text-sm text-gray-500">{order.date}</td>
                                            <td className="p-4 text-sm text-gray-500 max-w-xs truncate" title={order.itemsSummary}>{order.itemsSummary}</td>
                                            <td className="p-4 text-sm font-medium text-gray-900">₹{order.total}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="relative group">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                        className="appearance-none bg-white border border-gray-300 text-gray-700 py-1 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-sm cursor-pointer hover:border-blue-400 transition-colors"
                                                    >
                                                        {statusOptions.map(status => (
                                                            <option key={status} value={status}>{status}</option>
                                                        ))}
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                        <ChevronDown size={14} />
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className="ml-3 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Delete Order"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    )))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

