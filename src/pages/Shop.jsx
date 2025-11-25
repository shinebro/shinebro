import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const categories = [
        { id: 'kitchen', name: 'Dish & Kitchen Care', key: 'Kitchen', icon: '🍽️', color: 'bg-green-100' },
        { id: 'laundry', name: 'Laundry & Fabric Care', key: 'Laundry', icon: '👕', color: 'bg-blue-100' },
        { id: 'bathroom', name: 'Bathroom & Toilet care', key: 'Bathroom', icon: '🚽', color: 'bg-purple-100' },
        { id: 'floor', name: 'Floor Cleaner', key: 'Floor', icon: '🧹', color: 'bg-orange-100' },
        { id: 'handwash', name: 'Hand Washes', key: 'HandWash', icon: '🧼', color: 'bg-pink-100' },
    ];

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';

    const filteredProducts = searchQuery
        ? products.filter(p =>
            p.name.toLowerCase().includes(searchQuery)
        )
        : products;

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
                </h1>
                {!searchQuery && (
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore our complete range of safe, effective, and eco-friendly cleaning solutions.
                    </p>
                )}
            </div>

            {/* Show Categories only if NOT searching */}
            {!searchQuery && (
                <div className="flex flex-wrap justify-center gap-6 mb-16">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            to={`/shop/${cat.id}`}
                            className="flex flex-col items-center gap-3 group"
                        >
                            <div className={`w-20 h-20 rounded-full ${cat.color} flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                {cat.icon}
                            </div>
                            <span className="text-sm font-medium text-gray-700 max-w-[100px] text-center leading-tight group-hover:text-primary transition-colors">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            )}

            {/* Product Display Logic */}
            {searchQuery ? (
                // Search Results View - Flat Grid
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-xl text-gray-500">No products found matching your search.</p>
                            <Link to="/shop" className="mt-4 inline-block text-primary hover:underline">
                                Clear Search
                            </Link>
                        </div>
                    )}
                </div>
            ) : (
                // Default Category View
                <div className="space-y-16">
                    {categories.map((cat) => {
                        const categoryProducts = products.filter(p => p.category === cat.key);
                        if (categoryProducts.length === 0) return null;

                        return (
                            <section key={cat.id} id={cat.id} className="scroll-mt-24">
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900">{cat.name}</h2>
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {categoryProducts.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Shop;
