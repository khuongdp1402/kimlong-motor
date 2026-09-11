import React, { createContext, useContext, useState, useCallback } from 'react';
import { login as apiLogin } from '../api/client';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('admin_token'));

    const login = useCallback(async (password) => {
        const { token: newToken } = await apiLogin(password);
        localStorage.setItem('admin_token', newToken);
        setToken(newToken);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('admin_token');
        setToken(null);
    }, []);

    return (
        <AdminAuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => useContext(AdminAuthContext);

export default AdminAuthContext;
