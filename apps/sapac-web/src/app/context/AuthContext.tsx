import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebaseConfig';

type User = {
    id: string;
    name: string;
    email: string;
} | null;

type AuthContextType = {
    user: User;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

type AuthProviderProps = {
    children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const loggedInUser = { id: user.uid, name: user.displayName ?? 'User', email: user.email ?? 'Unknown' };
                setUser(loggedInUser);
                localStorage.setItem('user', JSON.stringify(loggedInUser));
            } else {
                setUser(null);
                localStorage.removeItem('user');
            }
        });
        return unsubscribe;
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const loggedInUser = { id: userCredential.user.uid, name: userCredential.user.displayName ?? 'User', email: userCredential.user.email ?? 'Unknown' };
            setUser(loggedInUser);
            localStorage.setItem('user', JSON.stringify(loggedInUser));
            navigate('/admin'); // Redirigir después de iniciar sesión
        } catch (error) {
            console.error('Failed to log in:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            localStorage.removeItem('user');
            navigate('/');
        } catch (error) {
            console.error('Failed to log out:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
