import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../services/firebaseConfig';
import styles from './ViewReports.module.scss';

const ViewReports: React.FC = () => {
    const [reports, setReports] = useState<any[]>([]);

    useEffect(() => {
        const fetchReports = async () => {
            const db = getFirestore(app);
            const reportsCollection = collection(db, 'reports');
            const reportsSnapshot = await getDocs(reportsCollection);
            const reportsList = reportsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReports(reportsList);
        };
        fetchReports();
    }, []);

    return (
        <div className={styles.viewReportsContainer}>
            <h1>Ver Reportes</h1>
            <ul>
                {reports.map(report => (
                    <li key={report.id} className={styles.reportCard}>
                        <p><strong>Reporte ID:</strong> {report.id}</p>
                        <p><strong>Descripción:</strong> {report.description}</p>
                        <p><strong>Estado:</strong> {report.status}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ViewReports;
