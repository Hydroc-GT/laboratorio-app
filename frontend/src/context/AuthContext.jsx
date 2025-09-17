import React, { createContext, useState, useEffect, useContext } from 'react';

// Crear el contexto de autenticación
export const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (error) {
        console.error('Error al parsear usuario de localStorage:', error);
        localStorage.removeItem('usuario');
      }
    }
    setLoading(false);
  }, []);

  // Función para iniciar sesión
  const login = (userData) => {
    localStorage.setItem('usuario', JSON.stringify(userData));
    setUsuario(userData);
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  // Proveer el contexto
  return (
    <AuthContext.Provider value={{ usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};