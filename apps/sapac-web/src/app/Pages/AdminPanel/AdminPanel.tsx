import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaTachometerAlt, FaUserPlus, FaUsers, FaFileAlt, FaSignOutAlt, FaBars } from 'react-icons/fa';
import styles from './AdminPanel.module.scss';
import { useAuth } from '../../context/AuthContext';

const AdminPanel: React.FC = () => {
    const { user, logout } = useAuth();
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    return (
        <div className={styles.panelContainer}>
            <div className={`${styles.sidebar} ${isSidebarVisible ? '' : styles.hidden}`}>
                <h2>Admin</h2>
                <ul>
                    <li>
                        <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? styles.activeLink : ''}>
                            <FaTachometerAlt /> Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/create-user" className={({ isActive }) => isActive ? styles.activeLink : ''}>
                            <FaUserPlus /> Crear Usuarios
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/view-users" className={({ isActive }) => isActive ? styles.activeLink : ''}>
                            <FaUsers /> Ver Usuarios
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/view-reports" className={({ isActive }) => isActive ? styles.activeLink : ''}>
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

export default AdminPanel;
