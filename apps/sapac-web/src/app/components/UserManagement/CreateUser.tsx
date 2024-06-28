import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './CreateUser.module.scss';

const CreateUser: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('worker');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/createUser', {
                email,
                password,
                name,
                role,
            });

            toast.success('Usuario creado exitosamente: ' + response.data.message);
        } catch (error: any) {
            console.error('Error al crear el usuario:', error.response?.data);
            toast.error('Error al crear el usuario: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className={styles.createUserContainer}>
            <h1>Crear Usuarios</h1>
            <form onSubmit={handleSubmit} className={styles.createUserForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Nombre:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Correo Electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="role">Rol:</label>
                    <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="admin">Admin</option>
                        <option value="worker">Trabajador</option>
                    </select>
                </div>
                <button type="submit" className={styles.createButton}>Crear Usuario</button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default CreateUser;
