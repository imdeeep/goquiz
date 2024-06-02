import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const AuthContext = createContext(undefined);

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const router = useRouter();

    const fetchUser = async (token) => {
        setLoading(true); 
        try {
            const response = await axios.get(`http://localhost:5000/api/auth/me?token=${token}`);
            const data = response.data;
            setUser(data);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Fetch user error:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const checkAuth = () => {
        const token = Cookies.get('token');
        if (token) {
            fetchUser(token);
        } else {
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false); 
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (token) => {
        Cookies.set('token', token, { expires: 1 });
        fetchUser(token) 
    };
    
    const logout = async () => {
        try {
            Cookies.remove('token');
            setIsAuthenticated(false);
            setUser(null);
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, user, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthProvider, useAuth };