import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Pages/Login/Login';
import AdminPanel from './Pages/AdminPanel/AdminPanel';
import SuperAdminPanel from './Pages/SuperAdminPanel/SuperAdminPanel';
import WorkerPanel from './Pages/WorkerPanel/WorkerPanel';
import Dashboard from './Pages/SuperAdminPanel/Dashboard';
import CreateUser from './Pages/SuperAdminPanel/CreateUser';
import ViewUsers from './Pages/SuperAdminPanel/ViewUsers';
import ViewReports from './Pages/SuperAdminPanel/ViewReports';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './context/PrivateRoute';

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/superadmin" element={<PrivateRoute role="superadmin"><SuperAdminPanel /></PrivateRoute>}>
                        <Route index element={<Navigate to="dashboard" />} />
                        <Route path="dashboard" element={<PrivateRoute role="superadmin"><Dashboard /></PrivateRoute>} />
                        <Route path="create-user" element={<PrivateRoute role="superadmin"><CreateUser /></PrivateRoute>} />
                        <Route path="view-users" element={<PrivateRoute role="superadmin"><ViewUsers /></PrivateRoute>} />
                        <Route path="view-reports" element={<PrivateRoute role="superadmin"><ViewReports /></PrivateRoute>} />
                    </Route>
                    <Route path="/admin" element={<PrivateRoute role="admin"><AdminPanel /></PrivateRoute>} />
                    <Route path="/worker" element={<PrivateRoute role="worker"><WorkerPanel /></PrivateRoute>} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
