import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Everyone/Home';
import Cart from './components/User/Cart';
import Wishlist from './components/User/Wishlist';
import LogisticsPolicy from './components/Everyone/LogisticsPolicy';
import PaymentPolicy from './components/Everyone/PaymentPolicy';
import ContactPage from './components/Everyone/ContactPage';
import Login from './components/Everyone/Login';
import Register from './components/Everyone/Register';
import ForgotPassword from './components/Everyone/ForgotPassword';
import ProductDetail from './components/Everyone/ProductDetail';
import UserData from './components/User/UserData';
import UserOrders from './components/User/UserOrders';
import AdminPage from './components/Admin/AdminPage';
import ClientManagement from './components/Admin/ClientManagement';
import OrderManagement from './components/Admin/OrderManagement';
import OrderCompleted from './components/User/OrderCompleted';
import ProductManagement from './components/Admin/ProductManagement';
import StockManagement from './components/Admin/StockManagement';
import PhotoManagement from "./components/Admin/PhotoManagement";
import CouponManagement from './components/Admin/CouponManagement';
import SearchResults from './components/Everyone/SearchResults';
import AllProducts from './components/Everyone/AllProducts';
import Checkout from './components/User/Checkout';
import { AuthProvider } from './utils/AuthContext';
import {JSX} from "react";

function App(): JSX.Element {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/logistics" element={<LogisticsPolicy />} />
                    <Route path="/payment" element={<PaymentPolicy />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/user-data" element={<UserData />} />
                    <Route path="/user-orders" element={<UserOrders />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/admin/clients" element={<ClientManagement />} />
                    <Route path="/admin/orders" element={<OrderManagement />} />
                    <Route path="/admin/products" element={<ProductManagement />} />
                    <Route path="/admin/stocks" element={<StockManagement />} />
                    <Route path="/admin/photos" element={<PhotoManagement />} />
                    <Route path="/admin/coupons" element={<CouponManagement />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/all-products" element={<AllProducts />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-completed" element={<OrderCompleted />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;