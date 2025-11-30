import React from 'react';

const benefits = [

    { icon: "🐾", title: "Pet Friendly", desc: "Safe for your furry friends" },
    { icon: "🚫", title: "Toxin Free", desc: "No harsh chemicals or bleach" },
];

const WhyChooseUs = () => {
    return (
        <section className="py-16 bg-green-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Why ShineBro?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We believe in cleaning without compromising on safety. Our products are tough on dirt but gentle on your home.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {benefits.map((item, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm text-center hover:shadow-md transition-shadow">
                            <div className="text-5xl mb-6">{item.icon}</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-gray-600">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;

