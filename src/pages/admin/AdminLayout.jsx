import React from 'react';
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { LogOut, Package, Newspaper, Star, Phone } from 'lucide-react';

const AdminLayout = () => {
    const { isAuthenticated, logout } = useAdminAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const tabClass = ({ isActive }) =>
        `flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive
            ? 'bg-red-600 text-white'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-red-600 dark:text-red-500">KL</span>
                        <span className="font-semibold text-gray-900 dark:text-white">Quản trị nội dung</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                        <LogOut size={16} /> Đăng xuất
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <nav className="flex gap-2 mb-8">
                    <NavLink to="/admin/products" className={tabClass}>
                        <Package size={16} /> Sản phẩm
                    </NavLink>
                    <NavLink to="/admin/articles" className={tabClass}>
                        <Newspaper size={16} /> Tin tức
                    </NavLink>
                    <NavLink to="/admin/testimonials" className={tabClass}>
                        <Star size={16} /> Đánh giá
                    </NavLink>
                    <NavLink to="/admin/leads" className={tabClass}>
                        <Phone size={16} /> Khách hàng liên hệ
                    </NavLink>
                </nav>

                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
