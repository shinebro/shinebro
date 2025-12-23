const products = [
    {
        id: 1,
        name: "Natural Laundry Liquid",
        price: 499,
        image: "/images/laundry-liquid.png",
        category: "Laundry",

        isNew: true,
        inStock: false,
        sizes: [
            { size: "500ml", price: 70 },
            { size: "1L", price: 120 },
            { size: "5L", price: 399 }
        ]
    },
    {
        id: 2,
        name: "Dishwashing Liquid",
        price: 299,
        image: "/images/dishwash-liquid-lemon.jpg",
        category: "Kitchen",

        isNew: false,
        inStock: true,
        sizes: [
            { size: "500ml", price: 70 },
            { size: "1L", price: 120 },
            { size: "5L", price: 399 }
        ]
    },
    {
        id: 3,
        name: "Floor Cleaner",
        price: 349,
        image: "/images/floor-cleaner-new.jpg?v=1",
        category: "Floor",

        isNew: true,
        inStock: false,
        sizes: [
            { size: "500ml", price: 70 },
            { size: "1L", price: 120 },
            { size: "5L", price: 399 }
        ]
    },
    {
        id: 4,
        name: "Fabric Conditioner",
        price: 399,
        image: "https://placehold.co/400x400/e2e8f0/1e293b?text=Fabric+Cond",
        category: "Laundry",

        isNew: false,
        inStock: false,
        sizes: [
            { size: "500ml", price: 70 },
            { size: "1L", price: 120 },
            { size: "5L", price: 399 }
        ]
    },
    {
        id: 5,
        name: "Toilet Cleaner",
        price: 249,
        image: "/images/toilet-cleaner.jpg?v=1",
        images: [
            "/images/toilet-cleaner.jpg?v=1",
            "/images/tc1.jpg?v=1",
            "/images/tc2.jpg?v=1",
            "/images/tc3.png?v=1"
        ],
        category: "Bathroom",

        isNew: true,
        inStock: false,
        sizes: [
            { size: "500ml", price: 70 },
            { size: "1L", price: 120 },
            { size: "5L", price: 399 }
        ]
    },
    {
        id: 6,
        name: "Hand Wash Rose",
        price: 199,
        image: "https://placehold.co/400x400/e2e8f0/1e293b?text=Hand+Wash",
        category: "HandWash",

        isNew: false,
        inStock: false,
        sizes: [
            { size: "500ml", price: 70 },
            { size: "1L", price: 120 },
            { size: "5L", price: 399 }
        ]
    }
];

module.exports = products;
