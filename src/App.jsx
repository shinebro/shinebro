import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import AuthSidebar from './components/AuthSidebar';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';
import Checkout from './pages/Checkout';
import OrderSummary from './pages/OrderSummary';
import OrderSuccess from './pages/OrderSuccess';
import OrderDetails from './pages/OrderDetails';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';
import Shop from './pages/Shop';
import CategoryPage from './pages/CategoryPage';
import GPayPayment from './pages/GPayPayment';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import ReturnPolicy from './pages/ReturnPolicy';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <AuthSidebar />
          <WhatsAppButton />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              } />
              <Route path="/order-summary" element={<OrderSummary />} />
              <Route path="/gpay-payment" element={<GPayPayment />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/order/:orderId" element={<OrderDetails />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:categoryId" element={<CategoryPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;
