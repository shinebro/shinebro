import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, LogOut, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cartCount } = useCart();
    const { user, logout, openAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        // Implement search logic here (e.g., navigate to search results)
        console.log('Searching for:', searchQuery);
        setIsSearchOpen(false);
        navigate(`/shop?search=${searchQuery}`);
    };

    return (
        <div className="w-full relative">
            {/* Top Info Bar */}
            <div className="bg-[#9c4dcc] text-white text-xs md:text-sm py-2">
                <div className="overflow-hidden relative w-full">
                    <div className="flex whitespace-nowrap animate-scroll w-max">
                        {/* First set of items */}
                        <div className="flex items-center gap-8 mx-4">
                            <span className="flex items-center gap-1">🐾 Safe for pets</span>
                            <span>|</span>
                            <span className="flex items-center gap-1">♻️ Biodegradable</span>
                            <span>|</span>
                            <span className="flex items-center gap-1">💵 COD Available</span>
                            <span>|</span>
                            <span className="flex items-center gap-1">🚚 Delivers in 4-8 days</span>
                            <span>|</span>
                        </div>
                        {/* Duplicate set for seamless scrolling */}
                        <div className="flex items-center gap-8 mx-4">
                            <span className="flex items-center gap-1">🐾 Safe for pets</span>
                            <span>|</span>
                            <span className="flex items-center gap-1">♻️ Biodegradable</span>
                            <span>|</span>
                            <span className="flex items-center gap-1">💵 COD Available</span>
                            <span>|</span>
                            <span className="flex items-center gap-1">🚚 Delivers in 4-8 days</span>
                            <span>|</span>
                        </div>
                        {/* Triplicate set for seamless scrolling on wide screens */}
                        <div className="flex items-center gap-8 mx-4">
                            <span className="flex items-center gap-1">🐾 Safe for pets</span>
                            <span>|</span>
                            <span className="flex items-center gap-1">♻️ Biodegradable</span>
                            <span>|</span>
                            <span className="flex items-center gap-1">💵 COD Available</span>
                            <span>|</span>
                            <span className="flex items-center gap-1">🚚 Delivers in 4-8 days</span>
                            <span>|</span>
                        </div>
                        {/* Quadruplicate set for seamless scrolling on very wide screens */}
                        <div className="flex items-center gap-8 mx-4">
                            <span className="flex items-center gap-1">🐾 Safe for pets</span>
                            <span>|</span>
                            <span className="flex items-center gap-1">♻️ Biodegradable</span>
                            <span>|</span>
                            <span className="flex items-center gap-1">💵 COD Available</span>
                            <span>|</span>
                            <span className="flex items-center gap-1">🚚 Delivers in 4-8 days</span>
                            <span>|</span>
                        </div>
                    </div>
                </div>
            </div>

            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Left Section: Menu & Logo */}
                        <div className="flex items-center gap-2 md:gap-4">
                            <button
                                className="text-gray-600 hover:text-primary transition-colors"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                            <Link to="/" className="flex items-center gap-2">
                                <img src={logo} alt="ShineBro" style={{ width: '280px', maxWidth: '80vw', transform: 'scale(1.6)' }} className="h-auto object-contain" />
                            </Link>
                        </div>

                        {/* Desktop Navigation (Hidden on Mobile) */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Link to="/" className="text-gray-600 hover:text-primary font-medium transition-colors">Home</Link>
                            <Link to="/shop" className="text-gray-600 hover:text-primary font-medium transition-colors">Shop</Link>
                            <a href="#about" className="text-gray-600 hover:text-primary font-medium transition-colors">About Us</a>
                            <Link to="/contact" className="text-gray-600 hover:text-primary font-medium transition-colors">Contact</Link>
                        </nav>

                        {/* Right Icons */}
                        <div className="flex items-center gap-3 md:gap-6">
                            <button
                                className={`text-gray-600 hover:text-primary transition-colors ${isSearchOpen ? 'text-primary' : ''}`}
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                            >
                                <Search size={22} />
                            </button>

                            {user ? (
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                                >
                                    <User size={22} />
                                    <span className="hidden md:inline font-medium">{user.name}</span>
                                </Link>
                            ) : (
                                <Link
                                    to="/signup"
                                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-all transform hover:scale-105"
                                >
                                    <Sparkles size={18} />
                                    <span className="hidden sm:inline">Sign Up</span>
                                </Link>
                            )}

                            <Link to="/cart" className="relative text-gray-600 hover:text-primary transition-colors">
                                <ShoppingCart size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center animate-bounce-subtle">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>

                    {/* Search Bar Dropdown */}
                    {isSearchOpen && (
                        <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 p-4 animate-slideDown z-40">
                            <div className="container mx-auto max-w-3xl">
                                <form onSubmit={handleSearch} className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search for products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                                        autoFocus
                                    />
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <button
                                        type="button"
                                        onClick={() => setIsSearchOpen(false)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={20} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="mt-4 pb-4 border-t border-gray-100 animate-slideDown">
                            <nav className="flex flex-col gap-4 pt-4">
                                <Link to="/" className="text-gray-600 hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
                                <Link to="/shop" className="text-gray-600 hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>Shop</Link>
                                <a href="#about" className="text-gray-600 hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>About Us</a>
                                <Link to="/contact" className="text-gray-600 hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                                {!user && (
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-left text-gray-600 hover:text-primary font-medium"
                                    >
                                        Sign In
                                    </Link>
                                )}
                                {user && (
                                    <button onClick={handleLogout} className="text-left text-red-600 hover:text-red-700 font-medium">Sign Out</button>
                                )}
                            </nav>
                        </div>
                    )}
                </div>
            </header>
        </div>
    );
};

export default Header;
