import React from 'react';
import { ShieldCheck, Sparkles, Heart, Lightbulb, Scale, Hand } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">About Shinebro</h1>
                    <p className="text-xl text-primary font-semibold mb-4">Trusted shine every time.</p>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        At Shinebro, we understand that cleanliness is about more than just appearance—it is about health, hygiene, and the comfort of your environment. Whether it is a busy hotel kitchen or a cozy family home, every space deserves to sparkle.
                    </p>
                </div>

                {/* Our Story */}
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-12">
                    <div className="max-w-4xl mx-auto">
                        <p className="text-gray-600 leading-relaxed text-lg mb-6">
                            We founded Shinebro with a singular mission: to formulate high-performance cleaning products that deliver professional results without the hassle. We were tired of products that over-promised and under-delivered. That is why we developed a complete range of solutions—from our tough-on-grease Liquid Dishwash and fabric-protecting Laundry Liquids to our powerful Floor and Toilet Cleaners—all engineered to work effectively every single time.
                        </p>
                    </div>
                </div>

                {/* Mission */}
                <div className="bg-primary/5 rounded-2xl p-8 mb-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                    <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                        To simplify your cleaning routine with powerful, affordable, and safe products. We strive to set a new standard in hygiene, ensuring that when you reach for a Shinebro bottle, you are reaching for quality you can trust.
                    </p>
                </div>

                {/* What Drives Us */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Drives Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl shadow-sm p-8 text-center hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Lightbulb size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
                            <p className="text-gray-600">
                                We are constantly researching and improving our formulas to ensure they tackle modern cleaning challenges effectively.
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm p-8 text-center hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Scale size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Integrity</h3>
                            <p className="text-gray-600">
                                We believe in honest pricing and honest results. No hidden chemicals, no false promises—just pure cleaning power.
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm p-8 text-center hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Care</h3>
                            <p className="text-gray-600">
                                We design products that are tough on dirt but safe for your hands and your home surfaces.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Why Choose Shinebro */}
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Shinebro?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                                <Sparkles size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Uncompromising Quality</h3>
                            <p className="text-gray-600">Advanced formulas that cut through dirt, grime, and grease instantly.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                                <Hand size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Care</h3>
                            <p className="text-gray-600">A full range of products, including Hand Wash and specialized surface cleaners.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Our Promise</h3>
                            <p className="text-gray-600">We stand by our slogan—giving you a Trusted shine every time.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
