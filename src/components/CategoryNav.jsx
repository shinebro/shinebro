import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
    { id: 'kitchen', name: "Dish & Kitchen Care", color: "bg-green-100", icon: "🍽️" },
    { id: 'laundry', name: "Laundry & Fabric Care", color: "bg-blue-100", icon: "👕" },
    { id: 'bathroom', name: "Bathroom & Toilet care", color: "bg-purple-100", icon: "🚽" },
    { id: 'floor', name: "Floor Cleaner", color: "bg-orange-100", icon: "🧹" },
    { id: 'handwash', name: "Hand Washes", color: "bg-pink-100", icon: "🧼" },
];

const CategoryNav = () => {
    return (
        <div className="border-b border-gray-100 py-6 overflow-x-auto">
            <div className="container mx-auto px-4">
                <div className="flex justify-center min-w-max gap-8 md:gap-4">
                    {categories.map((cat, index) => (
                        <Link key={index} to={`/shop/${cat.id}`} className="flex flex-col items-center gap-3 group min-w-[100px]">
                            <div className={`w-20 h-20 rounded-full ${cat.color} flex items-center justify-center text-3xl shadow-sm group-hover:shadow-md transition-all transform group-hover:scale-105 border-2 border-white ring-2 ring-transparent group-hover:ring-primary/20`}>
                                {cat.icon}
                            </div>
                            <span className="text-sm font-medium text-gray-700 text-center max-w-[120px] leading-tight group-hover:text-primary">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryNav;
