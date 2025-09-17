import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import RegisterMuestra from './components/RegisterMuestra';
import AdminDashboard from './components/AdminDashboard';
import ProfileMenu from './components/ProfileMenu';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardAnalista from './components/DashboardAnalista';
import AnalisisForm from './components/AnalisisForm';
import DashboardValidador from './components/DashboardValidador';

// Componente para manejar la visualización del menú de perfil
const AppContent = () => {
  const { usuario } = useAuth();
  const location = useLocation();
  const showProfileMenu = usuario && !location.pathname.startsWith('/admin');
  
  return (
    <div>
      {showProfileMenu && <ProfileMenu />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-muestra" element={<RegisterMuestra />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/analista" element={<DashboardAnalista />} />
         <Route path="/analista/analisis/:idMuestra" element={<AnalisisForm />} />     
         <Route path="/validador" element={<DashboardValidador />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;