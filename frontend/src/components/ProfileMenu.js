import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  
  if (!usuario) return null;
  
  return (
    <div style={{ position: 'fixed', top: 18, right: 32, zIndex: 1000 }}>
      <button
        style={{
          background: '#1976d2',
          color: '#fff',
          border: 'none',
          borderRadius: 24,
          padding: '8px 22px',
          fontWeight: 600,
          fontSize: 16,
          boxShadow: '0 2px 8px rgba(25,118,210,0.07)',
          cursor: 'pointer',
        }}
        onClick={() => setOpen(o => !o)}
      >
        Mi perfil
      </button>
      {open && (
        <div style={{
          marginTop: 8,
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 2px 16px rgba(0,0,0,0.13)',
          padding: '18px 28px',
          minWidth: 220,
          textAlign: 'left',
        }}>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{usuario.Correo}</div>
          <div style={{ color: '#1976d2', fontWeight: 500, fontSize: 15, marginBottom: 12 }}>{usuario.NombreRol || 'Cliente'}</div>
          <button
            style={{
              background: '#d32f2f',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '7px 18px',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 15,
              width: '100%',
              marginTop: 8,
            }}
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;