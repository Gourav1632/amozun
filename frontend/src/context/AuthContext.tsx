'use client'

import { createContext, useEffect, useState, ReactNode } from "react"
import { apiFetch } from "@/lib/api"
import LoginPromptModal from "@/components/auth/LoginPromptModal";


interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    showLoginModal: boolean;
    setShowLoginModal: (show: boolean) => void;
    requireAuth: (action: () => void) => void;
    login: (userData: User) => void;
    logout: () => Promise<void>;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await apiFetch('/auth/me');
                setUser(res.data);
            } catch (error) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [])

    const login = (userData: User) => {
        setUser(userData);
    };

    const requireAuth = (action: () => void) => {
        if (user) {
            action();
        } else {
            setShowLoginModal(true);
        }
    };

    const logout = async () => {
        try {
            await apiFetch('/auth/logout', { method: 'POST' });
            setUser(null);
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, showLoginModal, setShowLoginModal, requireAuth, login, logout }}>
            {children}
            <LoginPromptModal />
        </AuthContext.Provider>
    );
};

