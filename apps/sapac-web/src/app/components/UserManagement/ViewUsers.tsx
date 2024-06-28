import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../services/firebaseConfig';
import styles from './ViewUsers.module.scss';

const ViewUsers: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const db = getFirestore(app);
            const usersCollection = collection(db, 'users');
            const usersSnapshot = await getDocs(usersCollection);
            const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersList);
        };
        fetchUsers();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`http://localhost:5000/deleteUser/${id}`);
            setUsers(users.filter(user => user.id !== id));
            toast.success('Usuario eliminado exitosamente');
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Error al eliminar el usuario');
        }
    };

    const handleEdit = (id: string) => {
        // Aquí puedes implementar la lógica para editar el usuario
        console.log('Edit user with id:', id);
    };

    return (
        <div className={styles.viewUsersContainer}>
            <h1>Ver Usuarios</h1>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button
                                    className={`${styles.button} ${styles.editButton}`}
                                    onClick={() => handleEdit(user.id)}
                                >
                                    Editar
                                </button>
                                <button
                                    className={`${styles.button} ${styles.deleteButton}`}
                                    onClick={() => handleDelete(user.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer />
        </div>
    );
}

export default ViewUsers;
