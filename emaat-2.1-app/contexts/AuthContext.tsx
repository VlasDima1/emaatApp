import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/apiService';
import { Gender } from '../types';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    dateOfBirth?: string;
    gender?: Gender;
    height?: number;
    language?: string;
    avatarUrl?: string;
    points?: number;
    currentStreak?: number;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    accessCode: string;
    dateOfBirth?: string;
    gender?: Gender;
    height?: number;
    weight?: number;
    photoDataUrl?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string; user?: User }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if (apiService.isAuthenticated()) {
                const result = await apiService.getProfile();
                if (result.success && result.data) {
                    setUser(result.data);
                } else {
                    apiService.logout();
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const result = await apiService.login(email, password);
        
        if (result.success && result.data) {
            // Validate that this is a patient account
            if (result.data.user.role !== 'patient') {
                apiService.logout();
                return { success: false, error: 'Dit account is geen patiënt account.' };
            }
            setUser(result.data.user);
            return { success: true, user: result.data.user };
        }
        
        return { success: false, error: result.error };
    };

    const register = async (data: RegisterData) => {
        const result = await apiService.register(data);
        
        if (result.success && result.data) {
            // Auto-login after successful registration
            // Validate that this is a patient account
            if (result.data.user.role !== 'patient') {
                apiService.logout();
                return { success: false, error: 'Dit account is geen patiënt account.' };
            }
            // Set the token for future API calls
            apiService.setToken(result.data.token);
            setUser(result.data.user);
            return { success: true, user: result.data.user };
        }
        
        return { success: false, error: result.error };
    };

    const logout = () => {
        apiService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
