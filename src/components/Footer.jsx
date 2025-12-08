import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand Section */}
                    <div>
                        <Link to="/" className="text-2xl font-bold flex items-center gap-2 mb-6">
                            <span>✨</span> ShineBro
                        </Link>
                        <p className="text-gray-400 mb-6">
                            Making your home shine with eco-friendly, safe, and effective cleaning products.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-gray-400 hover:text-primary transition-colors">Home</Link></li>
                            <li><Link to="/shop" className="text-gray-400 hover:text-primary transition-colors">Shop</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/blog" className="text-gray-400 hover:text-primary transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Customer Service</h3>
                        <ul className="space-y-4">
                            <li><Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link to="/faq" className="text-gray-400 hover:text-primary transition-colors">FAQs</Link></li>
                            <li><Link to="/shipping" className="text-gray-400 hover:text-primary transition-colors">Shipping Policy</Link></li>
                            <li><Link to="/return-policy" className="text-gray-400 hover:text-primary transition-colors">Returns & Refunds</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400">
                                <MapPin size={20} className="mt-1 flex-shrink-0" />
                                <span>wagle estate Thane 400604</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Phone size={20} className="flex-shrink-0" />
                                <span>+91 8355882750</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Mail size={20} className="flex-shrink-0" />
                                <span>shinebrofficial2@gmail</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} ShineBro. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
