import React, { createContext, useState, useEffect, useContext } from 'react';

// Crear el contexto de autenticación
export const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario y token desde localStorage al iniciar
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    const tokenGuardado = localStorage.getItem('token');
    
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (error) {
        console.error('Error al parsear usuario de localStorage:', error);
        localStorage.removeItem('usuario');
      }
    }
    if (tokenGuardado) {
      setToken(tokenGuardado);
    }
    setLoading(false);
  }, []);

  // Función para iniciar sesión
  const login = (userData, jwtToken) => {
    const tokenToSave = jwtToken || userData?.token || '';
    if (tokenToSave) {
      localStorage.setItem('token', tokenToSave);
      setToken(tokenToSave);
    }
    localStorage.setItem('usuario', JSON.stringify(userData));
    setUsuario(userData);
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUsuario(null);
    setToken(null);
  };

  // Proveer el contexto
  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};