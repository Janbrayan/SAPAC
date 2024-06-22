import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
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
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                const userDoc = await getDoc(doc(db, 'users', authUser.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const loggedInUser = {
                        id: authUser.uid,
                        name: userData.name ?? 'User',
                        email: authUser.email ?? 'Unknown',
                        role: userData.role ?? 'worker'
                    };
                    setUser(loggedInUser);
                    localStorage.setItem('user', JSON.stringify(loggedInUser));
                } else {
                    setUser(null);
                    localStorage.removeItem('user');
                }
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
            const user = userCredential.user;
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const loggedInUser = {
                    id: user.uid,
                    name: userData.name ?? 'User',
                    email: user.email ?? 'Unknown',
                    role: userData.role ?? 'worker'
                };
                setUser(loggedInUser);
                localStorage.setItem('user', JSON.stringify(loggedInUser));
                navigateBasedOnRole(userData.role ?? 'worker'); // Redirigir basado en el rol almacenado
            } else {
                throw new Error('User data not found');
            }
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

    // Redirige al usuario basado en su rol
    const navigateBasedOnRole = (role: string) => {
        if (role === 'superadmin') {
            navigate('/superadmin');
        } else if (role === 'admin') {
            navigate('/admin');
        } else if (role === 'worker') {
            navigate('/worker');
        } else {
            navigate('/'); // O cualquier ruta predeterminada
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
