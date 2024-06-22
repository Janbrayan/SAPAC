import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './login.module.scss';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (error) {
            setError('Usuario o contraseña incorrectos');
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles.loginContainer}>
            <h1 className={styles.header}>Administración SAPAC</h1>
            <div className={styles.logo}></div>
            <h2 className={styles.subtitle}>Iniciar Sesión</h2>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <input
                        type="email"
                        placeholder="Usuario"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={toggleShowPassword} className={styles.showPasswordButton}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                {error && <div className={styles.error}>{error}</div>}
                <button type="submit" className={styles.loginButton}>Login</button>
            </form>
        </div>
    );
};

export default Login;
