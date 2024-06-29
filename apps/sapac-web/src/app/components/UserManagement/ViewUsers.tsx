import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { app } from '../../services/firebaseConfig';
import EditUserModal from './EditUserModal'; // Asegúrate de que la ruta es correcta
import Swal from 'sweetalert2';
import styles from './ViewUsers.module.scss';

const ViewUsers: React.FC<{ filterSuperAdmin: boolean }> = ({ filterSuperAdmin }) => {
    const [users, setUsers] = useState<any[]>([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const db = getFirestore(app);
            const usersCollection = collection(db, 'users');
            let usersSnapshot;
            if (filterSuperAdmin) {
                const usersQuery = query(usersCollection, where('role', '!=', 'superadmin'));
                usersSnapshot = await getDocs(usersQuery);
            } else {
                usersSnapshot = await getDocs(usersCollection);
            }
            const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersList);
        };
        fetchUsers();
    }, [filterSuperAdmin]);

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Confirmar eliminación',
            text: '¿Estás seguro de que deseas eliminar este usuario?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/deleteUser/${id}`);
                setUsers(users.filter(user => user.id !== id));
                toast.success('Usuario eliminado exitosamente');
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Error al eliminar el usuario');
            }
        }
    };

    const handleEdit = (id: string) => {
        const user = users.find(user => user.id === id);
        setCurrentUser(user);
        setEditModalOpen(true);
    };

    const handleSaveEdit = async (updatedUser: any) => {
        const result = await Swal.fire({
            title: 'Confirmar actualización',
            text: '¿Estás seguro de que deseas actualizar este usuario?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
        });

        if (result.isConfirmed) {
            try {
                await axios.put(`http://localhost:5000/updateUser/${updatedUser.id}`, updatedUser);
                setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
                setEditModalOpen(false);
                toast.success('Usuario actualizado exitosamente');
            } catch (error) {
                console.error('Error updating user:', error);
                toast.error('Error al actualizar el usuario');
            }
        }
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
            {editModalOpen && (
                <EditUserModal
                    user={currentUser}
                    isOpen={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    onSave={handleSaveEdit}
                />
            )}
            <ToastContainer />
        </div>
    );
}

export default ViewUsers;
