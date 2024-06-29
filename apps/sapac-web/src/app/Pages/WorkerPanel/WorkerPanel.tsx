import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaTachometerAlt, FaFileAlt, FaSignOutAlt, FaBars } from 'react-icons/fa';
import styles from './WorkerPanel.module.scss'; // Usamos los estilos específicos para WorkerPanel
import { useAuth } from '../../context/AuthContext';

const WorkerPanel: React.FC = () => {
    const { user, logout } = useAuth();
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    return (
        <div className={styles.workerPanelContainer}>
            <div className={`${styles.sidebar} ${isSidebarVisible ? '' : styles.hidden}`}>
                <h2>Trabajador</h2>
                <ul>
                    <li>
                        <NavLink to="/worker/dashboard" className={({ isActive }) => isActive ? styles.activeLink : ''}>
                            <FaTachometerAlt /> Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/worker/view-reports" className={({ isActive }) => isActive ? styles.activeLink : ''}>
                            <FaFileAlt /> Ver Reportes
                        </NavLink>
                    </li>
                </ul>
                <button className={styles.logoutButton} onClick={logout}>
                    <FaSignOutAlt /> Cerrar Sesión
                </button>
            </div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <button className={styles.toggleButton} onClick={toggleSidebar}>
                        <FaBars />
                    </button>
                    <h1>Bienvenido, {user?.name}</h1>
                </div>
                <Outlet />
            </div>
        </div>
    );
}

export default WorkerPanel;
