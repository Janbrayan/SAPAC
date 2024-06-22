import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from '../../services/firebaseConfig';
import styles from './CreateUser.module.scss';

const CreateUser: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('worker');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const auth = getAuth(app);
    const db = getFirestore(app);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                name,
                email,
                role
            });

            setSuccess('Usuario creado exitosamente');
            setError('');
        } catch (error) {
            setError('Error al crear el usuario');
            setSuccess('');
            console.error('Error creating user:', error);
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
                {error && <div className={styles.error}>{error}</div>}
                {success && <div className={styles.success}>{success}</div>}
            </form>
        </div>
    );
}

export default CreateUser;
