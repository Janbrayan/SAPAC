import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login/Login';
import AdminPanel from './Pages/AdminPanel/AdminPanel';
import SuperAdminPanel from './Pages/SuperAdminPanel/SuperAdminPanel';
import WorkerPanel from './Pages/WorkerPanel/WorkerPanel';
import Dashboard from './Pages/Common/Dashboard';
import CreateUser from './components/UserManagement/CreateUser';
import ViewUsers from './components/UserManagement/ViewUsers';
import ViewReports from './components/ReportManagement/ViewReports';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './context/PrivateRoute';

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/admin" element={<PrivateRoute role="admin"><AdminPanel /></PrivateRoute>}>
                        <Route index element={<Dashboard showTotalUsers={true} />} />
                        <Route path="dashboard" element={<Dashboard showTotalUsers={true} />} />
                        <Route path="create-user" element={<CreateUser />} />
                        <Route path="view-users" element={<ViewUsers filterSuperAdmin={true} />} />
                        <Route path="view-reports" element={<ViewReports />} />
                    </Route>
                    <Route path="/superadmin" element={<PrivateRoute role="superadmin"><SuperAdminPanel /></PrivateRoute>}>
                        <Route index element={<Dashboard showTotalUsers={true} />} />
                        <Route path="dashboard" element={<Dashboard showTotalUsers={true} />} />
                        <Route path="create-user" element={<CreateUser />} />
                        <Route path="view-users" element={<ViewUsers filterSuperAdmin={false} />} />
                        <Route path="view-reports" element={<ViewReports />} />
                    </Route>
                    <Route path="/worker" element={<PrivateRoute role="worker"><WorkerPanel /></PrivateRoute>}>
                        <Route index element={<Dashboard showTotalUsers={false} />} />
                        <Route path="dashboard" element={<Dashboard showTotalUsers={false} />} />
                        <Route path="view-reports" element={<ViewReports />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
