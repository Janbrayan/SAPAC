import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Pages/Login/Login';
import AdminPanel from './Pages/AdminPanel/AdminPanel';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './context/PrivateRoute';

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
