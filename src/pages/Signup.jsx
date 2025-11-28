import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Sparkles, KeyRound } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [step, setStep] = useState('details'); // 'details' or 'verification'
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSendCode = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/send-verification-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();

            if (data.success) {
                setStep('verification');
            } else {
                setError(data.message || 'Failed to send verification code');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Pass the code to the signup function (which needs to be updated to accept it, or we call API directly here)
        // Since useAuth.signup might not support 'code' yet, we might need to update AuthContext or call API directly.
        // For now, let's assume we update AuthContext or just call API directly here for simplicity, 
        // BUT keeping consistency with AuthContext is better.
        // Let's call the API directly here to ensure the 'code' is passed, 
        // then use the 'login' function from context if successful.

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, code: verificationCode })
            });
            const data = await response.json();

            if (data.success) {
                // Manually log the user in using the token received
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                // We might need to refresh the app or update context state. 
                // A full reload or navigating to a page that checks auth is simplest.
                window.location.href = '/';
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-10 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                            <Sparkles className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {step === 'details' ? 'Join ShineBro' : 'Verify Email'}
                        </h1>
                        <p className="text-green-100 text-sm">
                            {step === 'details' ? 'Create your account and start your journey' : `Enter the code sent to ${email}`}
                        </p>
                    </div>

                    {/* Form */}
                    <div className="px-8 py-10">
                        <form className="space-y-5" onSubmit={step === 'details' ? handleSendCode : handleSignup}>
                            {error && (
                                <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                                    <span className="text-red-500">⚠️</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            {step === 'details' ? (
                                <>
                                    {/* Name Input */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                required
                                                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400 transition-all"
                                                placeholder="Enter your full name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Email Input */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                required
                                                type="email"
                                                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400 transition-all"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Password Input */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="password"
                                                required
                                                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400 transition-all"
                                                placeholder="Create a strong password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500">
                                            Must be at least 6 characters long
                                        </p>
                                    </div>
                                </>
                            ) : (
                                /* Verification Code Input */
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Verification Code
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <KeyRound className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400 transition-all tracking-widest text-lg"
                                            placeholder="Enter 6-digit code"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            maxLength={6}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setStep('details')}
                                        className="mt-2 text-sm text-green-600 hover:text-green-700"
                                    >
                                        Change email or details
                                    </button>
                                    <div className="mt-4 text-center">
                                        <button
                                            type="button"
                                            onClick={handleSendCode}
                                            disabled={loading}
                                            className="text-sm font-medium text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? 'Sending...' : 'Resend Code'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="animate-pulse">Processing...</span>
                                ) : (
                                    <>
                                        {step === 'details' ? (
                                            <>
                                                <Mail className="h-5 w-5" />
                                                Send Verification Code
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="h-5 w-5" />
                                                Verify & Create Account
                                            </>
                                        )}
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="mt-8 mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">
                                        Already have an account?
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Sign In Link */}
                        <Link
                            to="/login"
                            className="block w-full text-center py-3 px-4 border-2 border-green-600 text-green-600 font-semibold rounded-xl hover:bg-green-50 transition-all"
                        >
                            Sign In
                        </Link>

                        {/* Security Badge */}
                        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Secure signup with validation</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
