import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente para proteger rutas privadas y validar permisos por rol (RBAC).
 *
 * @param {Array<number>} allowedRoles - IDs de roles con acceso permitido (opcional).
 *                                       1: Administrador, 2: Recepción/Registro,
 *                                       3: Analista, 4: Validador.
 * @param {React.ReactNode} children   - Componente hijo a renderizar si cumple permisos.
 */
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { usuario, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontSize: '18px',
        color: '#1976d2',
        fontWeight: 500
      }}>
        Verificando sesión...
      </div>
    );
  }

  // Si no está autenticado, redirigir a Login guardando la ruta intentada
  if (!usuario && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se definieron roles permitidos, verificar que el usuario tenga uno de ellos
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = usuario?.IdRol || usuario?.idRol;
    if (!allowedRoles.includes(userRole)) {
      // Redirigir al panel correspondiente según su rol si no tiene acceso a esta ruta
      if (userRole === 1) return <Navigate to="/admin" replace />;
      if (userRole === 2) return <Navigate to="/register-muestra" replace />;
      if (userRole === 3) return <Navigate to="/analista" replace />;
      if (userRole === 4) return <Navigate to="/validador" replace />;
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
