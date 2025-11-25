import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const CategoryPage = () => {
    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = [
        { id: 'kitchen', name: 'Dish & Kitchen Care', key: 'Kitchen', icon: '🍽️', color: 'bg-green-100' },
        { id: 'laundry', name: 'Laundry & Fabric Care', key: 'Laundry', icon: '👕', color: 'bg-blue-100' },
        { id: 'bathroom', name: 'Bathroom & Toilet care', key: 'Bathroom', icon: '🚽', color: 'bg-purple-100' },
        { id: 'floor', name: 'Floor Cleaner', key: 'Floor', icon: '🧹', color: 'bg-orange-100' },
        { id: 'handwash', name: 'Hand Washes', key: 'HandWash', icon: '🧼', color: 'bg-pink-100' },
    ];

    const currentCategory = categories.find(c => c.id === categoryId);

    useEffect(() => {
        setLoading(true);
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
    }, [categoryId]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
        );
    }

    if (!currentCategory) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Category Not Found</h2>
                <Link to="/shop" className="text-primary hover:underline mt-4 inline-block">Return to Shop</Link>
            </div>
        );
    }

    const filteredProducts = products.filter(p => p.category === currentCategory.key);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-8">
                <Link to="/" className="hover:text-primary">Home</Link>
                <span className="mx-2">/</span>
                <Link to="/shop" className="hover:text-primary">Shop</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium">{currentCategory.name}</span>
            </div>

            <div className="text-center mb-12">
                <div className={`w-24 h-24 rounded-full ${currentCategory.color} flex items-center justify-center text-4xl shadow-sm mx-auto mb-6`}>
                    {currentCategory.icon}
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{currentCategory.name}</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Explore our range of {currentCategory.name.toLowerCase()} products.
                </p>
            </div>

            {/* Other Categories Nav (Optional, but good for UX) */}
            <div className="flex flex-wrap justify-center gap-4 mb-16 border-b border-gray-100 pb-8">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        to={`/shop/${cat.id}`}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${cat.id === categoryId
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {cat.name}
                    </Link>
                ))}
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <p className="text-gray-500">No products found in this category yet.</p>
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
