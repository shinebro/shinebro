import { Link } from 'react-router-dom';

const concerns = [
    { name: "Laundry", image: "/images/laundry-concern.jpg", link: "/shop/laundry" },
    { name: "Dishwashing", image: "/images/dishwashing-concern.jpg", link: "/shop/kitchen" },
    { name: "Floor Cleaning", image: "/images/floor-cleaning-concern.jpg", link: "/shop/floor" },
    { name: "Glass Cleaning", image: "/images/glass-cleaning-concern.jpg", link: "/shop/delicate" },

];

const ShopByConcern = () => {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Shop by Concern</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {concerns.map((item, index) => (
                        <Link key={index} to={item.link} className="group text-center">
                            <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <h3 className="font-medium text-gray-800 group-hover:text-primary transition-colors">
                                {item.name}
                            </h3>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShopByConcern;
