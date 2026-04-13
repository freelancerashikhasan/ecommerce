// resources/js/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

const AuthContext = createContext();

export function AuthProvider({ children, initialUser }) {
    const [user, setUser] = useState(initialUser || null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!initialUser);
    const [isLoading, setIsLoading] = useState(false);

    // Check if user is logged in
    useEffect(() => {
        setIsAuthenticated(!!user);
    }, [user]);

    // Login function
    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    // Logout function
    const logout = async () => {
        setIsLoading(true);
        try {
            await router.post('/logout', {}, {
                onSuccess: () => {
                    setUser(null);
                    setIsAuthenticated(false);
                    // Redirect to home page after logout
                    router.get('/');
                },
                onError: (errors) => {
                    console.error('Logout error:', errors);
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Update user data
    const updateUser = (userData) => {
        setUser(prev => ({ ...prev, ...userData }));
    };

    // Check if user has specific role
    const hasRole = (role) => {
        return user?.role === role;
    };

    // Get user's name or email
    const getUserDisplayName = () => {
        if (user?.name) return user.name;
        if (user?.email) return user.email.split('@')[0];
        return 'User';
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser,
        hasRole,
        getUserDisplayName
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}