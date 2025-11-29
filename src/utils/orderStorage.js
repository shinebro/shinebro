import { products } from '../data/products';

const STORAGE_KEY = 'shinebro_orders';
const initialOrders = [];



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

export const addOrder = (newOrder) => {
    const orders = getOrders();
    const updatedOrders = [newOrder, ...orders];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
    return updatedOrders;
};

export const deleteOrder = (id) => {
    const orders = getOrders();
    const updatedOrders = orders.filter(order => order.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
    return updatedOrders;
};
