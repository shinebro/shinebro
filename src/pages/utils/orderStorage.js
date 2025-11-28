import { products } from '../data/products';

const STORAGE_KEY = 'shinebro_orders';

const initialOrders = [
    {
        id: 'OD123456789012345',
        customer: 'Nishant Kumar',
        date: '2023-11-24',
        total: 599,
        status: 'Placed',
        address: {
            name: 'Nishant Kumar',
            phone: '9876543210',
            street: '123, ShineBro Street, Tech Park',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560103'
        },
        items: [
            {
                ...products[0],
                quantity: 1,
                price: 499,
                selectedSize: { size: '1L', price: 499 }
            }
        ],
        itemsSummary: 'Liquid Dishwash (1L)'
    },
    {
        id: 'OD987654321098765',
        customer: 'Rahul Singh',
        date: '2023-11-23',
        total: 1299,
        status: 'Shipped',
        address: {
            name: 'Rahul Singh',
            phone: '8765432109',
            street: '456, Green Avenue',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
        },
        items: [
            {
                ...products[1],
                quantity: 1,
                price: 1299,
                selectedSize: { size: '5L', price: 1299 }
            }
        ],
        itemsSummary: 'Floor Cleaner (5L)'
    },
    {
        id: 'OD456789012345678',
        customer: 'Priya Sharma',
        date: '2023-11-22',
        total: 450,
        status: 'Delivered',
        address: {
            name: 'Priya Sharma',
            phone: '7654321098',
            street: '789, Blue Heights',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110001'
        },
        items: [
            {
                ...products[2],
                quantity: 1,
                price: 450,
                selectedSize: { size: '500ml', price: 450 }
            }
        ],
        itemsSummary: 'Glass Cleaner (500ml)'
    }
];

export const initializeOrders = () => {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialOrders));
    }
};

export const getOrders = () => {
    initializeOrders();
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
};

export const getOrderById = (id) => {
    const orders = getOrders();
    return orders.find(o => o.id === id);
};

export const updateOrderStatus = (id, newStatus) => {
    const orders = getOrders();
    const updatedOrders = orders.map(order =>
        order.id === id ? { ...order, status: newStatus } : order
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
    return updatedOrders;
};
