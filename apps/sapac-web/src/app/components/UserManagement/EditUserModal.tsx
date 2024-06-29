import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './EditUserModal.module.scss';

interface EditUserModalProps {
    user: any;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedUser: any) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, isOpen, onClose, onSave }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [role, setRole] = useState(user.role);

    useEffect(() => {
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
    }, [user]);

    const handleSave = async () => {
        try {
            const updatedUser = { ...user, name, email, role };
            await axios.put(`http://localhost:5000/updateUser/${user.id}`, updatedUser);
            onSave(updatedUser);
            onClose();
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Editar Usuario</h2>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Nombre:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Correo Electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="role">Rol:</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="admin">Admin</option>
                        <option value="worker">Trabajador</option>
                    </select>
                </div>
                <button onClick={handleSave} className={styles.saveButton}>Guardar</button>
                <button onClick={onClose} className={styles.closeButton}>Cerrar</button>
            </div>
        </div>
    );
};

export default EditUserModal;
