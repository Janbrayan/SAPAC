import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { app } from '../../services/firebaseConfig';
import styles from './Dashboard.module.scss';

interface DashboardProps {
    showTotalUsers: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ showTotalUsers }) => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalReports, setTotalReports] = useState(0);
    const [pendingReports, setPendingReports] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const db = getFirestore(app);

            if (showTotalUsers) {
                // Obtener el total de usuarios
                const usersCollection = collection(db, 'users');
                const usersSnapshot = await getDocs(usersCollection);
                setTotalUsers(usersSnapshot.size);
            }

            // Obtener el total de reportes
            const reportsCollection = collection(db, 'reports');
            const reportsSnapshot = await getDocs(reportsCollection);
            setTotalReports(reportsSnapshot.size);

            // Obtener el total de reportes pendientes
            const pendingReportsQuery = query(reportsCollection, where('status', '==', 'pending'));
            const pendingReportsSnapshot = await getDocs(pendingReportsQuery);
            setPendingReports(pendingReportsSnapshot.size);
        };

        fetchData();
    }, [showTotalUsers]);

    return (
        <div className={styles.dashboardContainer}>
            <h1>Dashboard</h1>
            <div className={styles.cardContainer}>
                {showTotalUsers && (
                    <div className={styles.card}>
                        <h3>Total de Usuarios</h3>
                        <p>{totalUsers}</p>
                    </div>
                )}
                <div className={styles.card}>
                    <h3>Total de Reportes</h3>
                    <p>{totalReports}</p>
                </div>
                <div className={styles.card}>
                    <h3>Reportes Pendientes</h3>
                    <p>{pendingReports}</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
