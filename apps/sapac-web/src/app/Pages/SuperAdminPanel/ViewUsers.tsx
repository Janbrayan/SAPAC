import React, { useState, useEffect } from 'react';
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

    return (
        <div className={styles.viewUsersContainer}>
            <h1>Ver Usuarios</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id} className={styles.userCard}>
                        <p><strong>Nombre:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Rol:</strong> {user.role}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ViewUsers;
