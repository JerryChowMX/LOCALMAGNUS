import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { authApi } from '../services/authApi';
import { strapiClient } from '../api/strapiClient';
import type { User, LoginCredentials, RegisterCredentials } from '../types/auth';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    socialLogin: (token: string) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use 'jwt' as the key to match strapiClient
const TOKEN_KEY = 'jwt';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const bootstrap = async () => {
            const storedToken = localStorage.getItem(TOKEN_KEY);
            if (storedToken) {
                try {
                    // Token is already loaded in strapiClient from localStorage
                    // Just fetch the current user to validate the session
                    const { data: userData } = await authApi.getCurrentUser();
                    setUser(userData);
                    setToken(storedToken);
                } catch (error) {
                    console.error('Failed to bootstrap auth session', error);
                    // Clear invalid token
                    strapiClient.clearToken();
                    setToken(null);
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        bootstrap();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        try {
            const { data: response } = await authApi.login(credentials);

            // Set token in strapiClient for authenticated requests
            strapiClient.setToken(response.token);

            setUser(response.user);
            setToken(response.token);
            // Token is already saved to localStorage by strapiClient.setToken()
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (credentials: RegisterCredentials) => {
        setIsLoading(true);
        try {
            const { data: response } = await authApi.register(credentials);

            // Set token in strapiClient for authenticated requests
            strapiClient.setToken(response.token);

            setUser(response.user);
            setToken(response.token);
        } catch (error) {
            console.error('Registration failed', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const socialLogin = async (jwt: string) => {
        setIsLoading(true);
        try {
            strapiClient.setToken(jwt);
            const { data: userData } = await authApi.getCurrentUser();

            setUser(userData);
            setToken(jwt);
            localStorage.setItem(TOKEN_KEY, jwt);
        } catch (error) {
            console.error('Social login failed', error);
            strapiClient.clearToken();
            setToken(null);
            setUser(null);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            setUser({ ...user, ...userData });
        }
    };

    const logout = () => {
        // Call logout API (which clears strapiClient token)
        authApi.logout().catch(console.error);

        // Clear local state
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                socialLogin,
                logout,
                updateUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
