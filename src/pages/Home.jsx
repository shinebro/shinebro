import React, { useState, useEffect } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

import ProductCard from '../components/ProductCard';
import CategoryNav from '../components/CategoryNav';
import HeroCarousel from '../components/HeroCarousel';
import ShopByConcern from '../components/ShopByConcern';
import WhyChooseUs from '../components/WhyChooseUs';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Review System State
    // Review System State
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);

    useEffect(() => {
        // Fetch products
        fetch(`${import.meta.env.VITE_API_URL || ''}/api/products`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching products:", err);
                setLoading(false);
            });

        // Fetch recent reviews
        fetch(`${import.meta.env.VITE_API_URL || ''}/api/reviews-recent`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setReviews(data);
                }
                setLoadingReviews(false);
            })
            .catch(err => {
                console.error("Error fetching reviews:", err);
            });
    }, []);


    return (
        <div className="bg-white">
            {/* Category Navigation */}
            <CategoryNav />

            {/* Hero Carousel */}
            <HeroCarousel />

            {/* Shop By Concern */}
            <ShopByConcern />

            {/* Best Sellers */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Best Sellers</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Discover our most loved products that are tough on stains but gentle on the planet.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/shop" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-full font-bold transition-colors inline-block">
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <WhyChooseUs />

            {/* Testimonials */}
            <section className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Customers Say</h2>

                    {/* Review Form Toggle */}

                    {/* Reviews List */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn">
                        {reviews.length === 0 && !loadingReviews && (
                            <p className="col-span-3 text-center text-gray-500 italic">No reviews yet. Check back later!</p>
                        )}
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-gray-50 p-8 rounded-2xl shadow-sm">
                                <div className="flex text-yellow-400 mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <Star
                                            key={j}
                                            size={16}
                                            fill={j < review.rating ? "currentColor" : "none"}
                                            className={j < review.rating ? "text-yellow-400" : "text-gray-300"}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-6 italic">
                                    "{review.text}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{review.name}</h4>
                                        <p className="text-xs text-gray-500">Verified Buyer</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
