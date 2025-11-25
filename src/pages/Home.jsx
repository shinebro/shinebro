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
    const [reviews, setReviews] = useState([
        {
            id: 1,
            name: "Sarah Johnson",
            rating: 5,
            text: "Absolutely love the laundry liquid! It smells amazing and cleans so well without any harsh chemicals. Highly recommend!"
        },
        {
            id: 2,
            name: "Michael Chen",
            rating: 5,
            text: "The floor cleaner is a game changer. Safe for my pets and leaves no sticky residue. Will definitely buy again."
        },
        {
            id: 3,
            name: "Emily Davis",
            rating: 4,
            text: "Great eco-friendly products. The dish soap works well, though I wish it was a bit more bubbly. Still a great switch!"
        }
    ]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [showReviews, setShowReviews] = useState(false);
    const [newReview, setNewReview] = useState({ name: '', rating: 5, text: '' });

    useEffect(() => {
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
    }, []);

    const handleSubmitReview = (e) => {
        e.preventDefault();
        const review = {
            id: reviews.length + 1,
            ...newReview
        };
        setReviews([review, ...reviews]);
        setNewReview({ name: '', rating: 5, text: '' });
        setShowReviewForm(false);
        setShowReviews(true); // Show reviews after submitting
    };

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
                    <div className="text-center mb-12 flex justify-center gap-4">
                        <button
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-green-700 transition-colors"
                        >
                            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                        </button>
                        <button
                            onClick={() => setShowReviews(!showReviews)}
                            className="border-2 border-primary text-primary px-6 py-2 rounded-full font-medium hover:bg-primary hover:text-white transition-colors"
                        >
                            {showReviews ? 'Hide Reviews' : 'Read Reviews'}
                        </button>
                    </div>

                    {/* Review Form */}
                    {showReviewForm && (
                        <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-2xl shadow-sm mb-12 animate-slideDown">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Write a Review</h3>
                            <form onSubmit={handleSubmitReview} className="space-y-6">
                                <div>
                                    <label htmlFor="review-name" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                    <input
                                        id="review-name"
                                        type="text"
                                        required
                                        value={newReview.name}
                                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                                className="focus:outline-none transition-transform hover:scale-110"
                                            >
                                                <Star
                                                    size={24}
                                                    fill={star <= newReview.rating ? "currentColor" : "none"}
                                                    className={star <= newReview.rating ? "text-yellow-400" : "text-gray-300"}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                                    <textarea
                                        id="review-text"
                                        required
                                        value={newReview.text}
                                        onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-32 resize-none"
                                        placeholder="Share your experience..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
                                >
                                    Submit Review
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Reviews List */}
                    {showReviews && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn">
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
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
