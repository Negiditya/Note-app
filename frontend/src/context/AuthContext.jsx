import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios';

// create context
export const AuthContext = createContext()

// provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);       // store user info if needed
    const [token, setToken] = useState(null);     // store JWT token
    const [loading, setLoading] = useState(true); // for initial auth check

    // load token from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
        
        if (savedToken) {
            setToken(savedToken);
            // Set default authorization header for all API calls
            api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        }
        
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (err) {
                console.error('Error parsing saved user:', err);
                localStorage.removeItem("user");
            }
        }
        
        setLoading(false);
    }, []);

    // login function
    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Set authorization header for future API calls
        api.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    };

    // logout function
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Remove authorization header
        delete api.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)