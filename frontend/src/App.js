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
import ProtectedRoute from './components/ProtectedRoute';

// Componente para manejar la visualización del menú de perfil y rutas
const AppContent = () => {
  const { usuario } = useAuth();
  const location = useLocation();
  const showProfileMenu = usuario && !location.pathname.startsWith('/admin');
  
  return (
    <div>
      {showProfileMenu && <ProfileMenu />}
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Módulo Recepción / Registro de Muestras (Rol 2 y Rol 1 Admin) */}
        <Route 
          path="/register-muestra" 
          element={
            <ProtectedRoute allowedRoles={[1, 2]}>
              <RegisterMuestra />
            </ProtectedRoute>
          } 
        />

        {/* Módulo Analista de Laboratorio (Rol 3 y Rol 1 Admin) */}
        <Route 
          path="/analista" 
          element={
            <ProtectedRoute allowedRoles={[1, 3]}>
              <DashboardAnalista />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analista/analisis/:idMuestra" 
          element={
            <ProtectedRoute allowedRoles={[1, 3]}>
              <AnalisisForm />
            </ProtectedRoute>
          } 
        />

        {/* Módulo Validador / Supervisor (Rol 4 y Rol 1 Admin) */}
        <Route 
          path="/validador" 
          element={
            <ProtectedRoute allowedRoles={[1, 4]}>
              <DashboardValidador />
            </ProtectedRoute>
          } 
        />

        {/* Módulo Administrador del Sistema (Rol 1 Admin) */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
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