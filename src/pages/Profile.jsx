import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, MapPin, Phone, LogOut, Save, Package, ChevronRight, UserPlus, Lock, Sparkles, KeyRound } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Profile = () => {
    const { user, login, signup, logout, updateProfile } = useAuth();
    console.log("Profile render, user:", user);
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('login');

    // Auth Form State
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [authName, setAuthName] = useState('');
    const [authError, setAuthError] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [step, setStep] = useState('details'); // 'details' or 'verification'
    const [loading, setLoading] = useState(false);

    // Profile Form State
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        zipCode: '',
        phone: ''
    });
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [myOrders, setMyOrders] = useState([]);

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
                }
            } else {
                setMyOrders([]);
            }
        };
        fetchMyOrders();
    }, [user]);

    useEffect(() => {
        if (user && user.shippingInfo) {
            setProfileData(prev => ({
                ...prev,
                ...user.shippingInfo,
                firstName: user.name ? user.name.split(' ')[0] : '',
                lastName: user.name ? user.name.split(' ').slice(1).join(' ') : ''
            }));
        }
    }, [user]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setAuthError('');
        const result = await login(authEmail, authPassword);
        if (result.success) {
            const from = location.state?.from?.pathname || '/profile';
            if (from !== '/profile') {
                navigate(from);
            }
        } else {
            setAuthError(result.message);
        }
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        setAuthError('');
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/send-verification-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: authEmail })
            });
            const data = await response.json();

            if (data.success) {
                setStep('verification');
            } else {
                setAuthError(data.message || 'Failed to send verification code');
            }
        } catch (err) {
            setAuthError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setAuthError('');
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: authName, email: authEmail, password: authPassword, code: verificationCode })
            });
            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                const from = location.state?.from?.pathname || '/profile';
                if (from !== '/profile') {
                    window.location.href = from;
                } else {
                    window.location.reload();
                }
            } else {
                setAuthError(data.message || 'Signup failed');
            }
        } catch (err) {
            setAuthError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        await updateProfile(profileData);
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            {activeTab === 'login' ? 'Sign in to your account' : 'Create your account'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Or{' '}
                            <button
                                onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
                                className="font-medium text-primary hover:text-green-700"
                            >
                                {activeTab === 'login' ? 'create a new account' : 'sign in to existing account'}
                            </button>
                        </p>
                    </div>

                    {authError && <div className="text-red-500 text-center text-sm bg-red-50 p-3 rounded-lg">{authError}</div>}

                    {activeTab === 'login' ? (
                        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                            <div className="rounded-md shadow-sm -space-y-px">
                                <input
                                    type="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    value={authEmail}
                                    onChange={(e) => setAuthEmail(e.target.value)}
                                />
                                <input
                                    type="password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                    value={authPassword}
                                    onChange={(e) => setAuthPassword(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                Sign in
                            </button>
                        </form>
                    ) : (
                        <form className="mt-8 space-y-6" onSubmit={step === 'details' ? handleSendCode : handleSignup}>
                            {step === 'details' ? (
                                <div className="rounded-md shadow-sm -space-y-px">
                                    <input
                                        type="text"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                        placeholder="Full Name"
                                        value={authName}
                                        onChange={(e) => setAuthName(e.target.value)}
                                    />
                                    <input
                                        type="email"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                        placeholder="Email address"
                                        value={authEmail}
                                        onChange={(e) => setAuthEmail(e.target.value)}
                                    />
                                    <input
                                        type="password"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                        placeholder="Password"
                                        value={authPassword}
                                        onChange={(e) => setAuthPassword(e.target.value)}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Verification Code sent to {authEmail}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <KeyRound className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            required
                                            className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm tracking-widest"
                                            placeholder="Enter 6-digit code"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            maxLength={6}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setStep('details')}
                                        className="mt-2 text-sm text-primary hover:text-green-700"
                                    >
                                        Change email or details
                                    </button>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70"
                            >
                                {loading ? 'Processing...' : (
                                    step === 'details' ? 'Send Verification Code' : 'Verify & Create Account'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-primary px-6 py-8 text-white">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-full">
                                <User size={40} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{user.name}</h1>
                                <p className="text-white/80 flex items-center gap-2">
                                    <Mail size={16} /> {user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <MapPin className="text-primary" /> Shipping Details
                            </h2>
                            <button
                                onClick={handleLogout}
                                className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
                            >
                                <LogOut size={18} /> Sign Out
                            </button>
                        </div>



                        <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={profileData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={profileData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={profileData.address}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={profileData.city}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">ZIP Code</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={profileData.zipCode}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profileData.phone}
                                        maxLength="10"
                                        pattern="\d{10}"
                                        title="Please enter exactly 10 digits"
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setProfileData(prev => ({ ...prev, phone: val }));
                                        }}
                                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 pt-4">
                                <button
                                    type="submit"
                                    className="w-full md:w-auto bg-primary hover:bg-green-700 text-white py-3 px-8 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    <Save size={20} /> Save Changes
                                </button>
                            </div>
                            {updateSuccess && (
                                <div className="md:col-span-2 mt-4 bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2">
                                    <Save size={18} /> Profile updated successfully!
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* My Orders Section */}
                <div className="mt-8 bg-white shadow rounded-2xl overflow-hidden">
                    <div className="px-6 py-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Package className="text-primary" /> My Orders
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {myOrders.length > 0 ? (
                            myOrders.map((order) => (
                                <Link
                                    to={`/order/${order.id}`}
                                    key={order.id}
                                    className="block p-6 hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-20 w-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                                            {/* Placeholder for product image since order items might not have full image path in mock data */}
                                            <Package className="text-gray-400" size={32} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-gray-900 truncate">{order.itemsSummary || 'Order Items'}</p>
                                                    <p className="text-sm text-gray-500 mt-1">Order ID: {order.id}</p>
                                                    <p className="text-sm text-gray-500">Ordered on {order.date}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-900">₹{order.total}</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center gap-2">
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
                                        </div>
                                        <ChevronRight className="text-gray-400 group-hover:text-primary transition-colors" />
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                No orders found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
