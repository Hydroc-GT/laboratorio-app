import React, { useEffect, useState } from 'react';
import { NavLink, Routes, Route, useNavigate, useResolvedPath } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../App.css';

const UsersRoles = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3001/api/auth/listar');
      setUsuarios(res.data);
    } catch (err) {
      setError('Error al cargar usuarios');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleEstadoChange = async (idUsuario, nuevoEstado) => {
    try {
      await axios.put(`http://localhost:3001/api/auth/estado/${idUsuario}`, { Estado: nuevoEstado });
      setUsuarios(usuarios => usuarios.map(u => u.IdUsuario === idUsuario ? { ...u, Estado: nuevoEstado } : u));
    } catch (err) {
      setError('No se pudo cambiar el estado');
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 32, maxWidth: 900, margin: '0 auto' }}>
      <h3 style={{ marginBottom: 24, color: '#1976d2', fontWeight: 600 }}>Gestión de Usuarios y Roles</h3>
      {error && <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>}
      {loading ? <p>Cargando...</p> : (
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: '#fafbfc', borderRadius: 8, overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#f6f8fa' }}>
              <th style={{ padding: '12px 8px', borderBottom: '2px solid #e0e0e0', textAlign: 'left', fontWeight: 500 }}>Nombre</th>
              <th style={{ padding: '12px 8px', borderBottom: '2px solid #e0e0e0', textAlign: 'left', fontWeight: 500 }}>Correo</th>
              <th style={{ padding: '12px 8px', borderBottom: '2px solid #e0e0e0', textAlign: 'left', fontWeight: 500 }}>Rol</th>
              <th style={{ padding: '12px 8px', borderBottom: '2px solid #e0e0e0', textAlign: 'left', fontWeight: 500 }}>Estado</th>
              <th style={{ padding: '12px 8px', borderBottom: '2px solid #e0e0e0', textAlign: 'left', fontWeight: 500 }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.IdUsuario} style={{ borderBottom: '1px solid #f0f0f0', background: '#fff', transition: 'background 0.2s' }}>
                <td style={{ padding: '10px 8px' }}>{u.NombreUsuario}</td>
                <td style={{ padding: '10px 8px' }}>{u.Correo}</td>
                <td style={{ padding: '10px 8px' }}>{u.NombreRol}</td>
                <td style={{ padding: '10px 8px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: 12,
                    background: u.Estado === 'Inactivo' ? '#ffeaea' : '#e3f6e3',
                    color: u.Estado === 'Inactivo' ? '#d32f2f' : '#388e3c',
                    fontWeight: 500,
                    fontSize: 13
                  }}>{u.Estado || 'Activo'}</span>
                </td>
                <td style={{ padding: '10px 8px' }}>
                  <button
                    style={{
                      background: u.Estado === 'Inactivo' ? '#1976d2' : '#bdbdbd',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '7px 18px',
                      cursor: 'pointer',
                      fontWeight: 500,
                      fontSize: 14,
                      transition: 'background 0.2s'
                    }}
                    onClick={() => handleEstadoChange(u.IdUsuario, u.Estado === 'Inactivo' ? 'Activo' : 'Inactivo')}
                  >
                    {u.Estado === 'Inactivo' ? 'Activar' : 'Desactivar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Componente de auditoría
const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({
    usuario: '',
    accion: '',
    fechaInicio: '',
    fechaFin: ''
  });

  // Cargar registros de auditoría
  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      // Construir query params para filtros
      const queryParams = new URLSearchParams();
      if (filtro.usuario) queryParams.append('usuario', filtro.usuario);
      if (filtro.accion) queryParams.append('accion', filtro.accion);
      if (filtro.fechaInicio) queryParams.append('fechaInicio', filtro.fechaInicio);
      if (filtro.fechaFin) queryParams.append('fechaFin', filtro.fechaFin);

      // Obtener logs del backend
      const res = await axios.get(`http://localhost:3001/api/auditoria/logs?${queryParams}`);
      setLogs(res.data);
    } catch (err) {
      setError('Error al cargar los registros de auditoría');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [filtro.usuario, filtro.accion, filtro.fechaInicio, filtro.fechaFin]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltro(prevFiltro => ({
      ...prevFiltro,
      [name]: value
    }));
  };

  const formatFecha = (fechaIso) => {
    const fecha = new Date(fechaIso);
    return fecha.toLocaleDateString() + ' ' + fecha.toLocaleTimeString();
  };

  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 32, maxWidth: 1100, margin: '0 auto' }}>
      <h3 style={{ marginBottom: 24, color: '#1976d2', fontWeight: 600 }}>Auditoría de Actividades del Sistema</h3>
      
      {error && <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>}
      
      {/* Filtros */}
      <div style={{ marginBottom: 24, display: 'flex', flexWrap: 'wrap', gap: 16, background: '#f6f8fa', padding: 16, borderRadius: 8 }}>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Usuario:</label>
          <input
            type="text"
            name="usuario"
            value={filtro.usuario}
            onChange={handleFiltroChange}
            placeholder="Filtrar por usuario"
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Acción:</label>
          <select
            name="accion"
            value={filtro.accion}
            onChange={handleFiltroChange}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
          >
            <option value="">Todas las acciones</option>
            <option value="Inicio de sesión">Inicio de sesión</option>
            <option value="Registro de muestra">Registro de muestra</option>
            <option value="Registro de resultado">Registro de resultado</option>
            <option value="Validación de resultado">Validación de resultado</option>
            <option value="Cambio de estado usuario">Cambio de estado usuario</option>
          </select>
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Fecha inicio:</label>
          <input
            type="date"
            name="fechaInicio"
            value={filtro.fechaInicio}
            onChange={handleFiltroChange}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Fecha fin:</label>
          <input
            type="date"
            name="fechaFin"
            value={filtro.fechaFin}
            onChange={handleFiltroChange}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
          />
        </div>
      </div>
      
      {/* Tabla de logs */}
      {loading ? <p>Cargando registros...</p> : (
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: '#fafbfc', borderRadius: 8, overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#f6f8fa' }}>
              <th style={{ padding: '12px 8px', borderBottom: '2px solid #e0e0e0', textAlign: 'left', fontWeight: 500 }}>Usuario</th>
              <th style={{ padding: '12px 8px', borderBottom: '2px solid #e0e0e0', textAlign: 'left', fontWeight: 500 }}>Acción</th>
              <th style={{ padding: '12px 8px', borderBottom: '2px solid #e0e0e0', textAlign: 'left', fontWeight: 500 }}>Detalles</th>
              <th style={{ padding: '12px 8px', borderBottom: '2px solid #e0e0e0', textAlign: 'left', fontWeight: 500 }}>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: 20 }}>No se encontraron registros de auditoría</td>
              </tr>
            ) : (
              logs.map(log => (
                <tr key={log.IdAuditoria} style={{ borderBottom: '1px solid #f0f0f0', background: '#fff' }}>
                  <td style={{ padding: '10px 8px' }}>{log.Usuario || 'Sistema'}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: 12,
                      background: log.Accion?.toLowerCase().includes('sesión') ? '#e3f2fd' : 
                                log.Accion?.toLowerCase().includes('muestra') ? '#e8f5e9' : 
                                log.Accion?.toLowerCase().includes('resultado') ? '#fffde7' :
                                log.Accion?.toLowerCase().includes('usuario') ? '#fce4ec' : '#f3e5f5',
                      color: log.Accion?.toLowerCase().includes('sesión') ? '#0d47a1' : 
                            log.Accion?.toLowerCase().includes('muestra') ? '#1b5e20' : 
                            log.Accion?.toLowerCase().includes('resultado') ? '#f57f17' :
                            log.Accion?.toLowerCase().includes('usuario') ? '#880e4f' : '#4a148c',
                      fontWeight: 500,
                      fontSize: 13
                    }}>{log.Accion}</span>
                  </td>
                  <td style={{ padding: '10px 8px' }}>{log.Detalles}</td>
                  <td style={{ padding: '10px 8px' }}>{formatFecha(log.Fecha)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const base = useResolvedPath("").pathname;
  const { logout } = useAuth();
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f6f8fa' }}>
      {/* Sidebar */}
      <nav style={{
        width: 250,
        background: 'linear-gradient(135deg, #1e2a38 80%, #1976d2 100%)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0',
        boxShadow: '2px 0 8px rgba(0,0,0,0.07)'
      }}>
        <div style={{ 
          width: '100%', 
          background: '#16202b', 
          padding: '32px 0 18px 0', 
          textAlign: 'center', 
          borderBottom: '1px solid #22304a' 
        }}>
          <div style={{ fontWeight: 700, fontSize: 22, letterSpacing: 1, color: '#fff' }}>
            Laboratorio-App
          </div>
        </div>

        <div style={{ width: '100%', marginTop: 30 }}>
          {/* Ruta absoluta para usuarios */}
          <NavLink 
            to="/admin/users" 
            end 
            style={({ isActive }) => ({
              display: 'block',
              padding: '14px 32px',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 500,
              borderLeft: isActive ? '4px solid #ff9800' : '4px solid transparent',
              background: isActive ? 'rgba(25,118,210,0.08)' : 'none',
              transition: 'background 0.2s, border 0.2s'
            })}
          >
            Usuarios y Roles
          </NavLink>

          {/* Ruta absoluta para auditoría */}
          <NavLink 
            to="/admin/audit" 
            end 
            style={({ isActive }) => ({
              display: 'block',
              padding: '14px 32px',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 500,
              borderLeft: isActive ? '4px solid #ff9800' : '4px solid transparent',
              background: isActive ? 'rgba(25,118,210,0.08)' : 'none',
              transition: 'background 0.2s, border 0.2s'
            })}
          >
            Auditoría
          </NavLink>
        </div>

        <button 
          style={{ 
            marginTop: 'auto', 
            marginBottom: 32, 
            width: '80%', 
            padding: 12, 
            borderRadius: 8, 
            border: 'none', 
            background: '#1976d2', 
            color: '#fff', 
            cursor: 'pointer', 
            fontWeight: 500, 
            fontSize: 15, 
            boxShadow: '0 2px 8px rgba(25,118,210,0.07)' 
          }} 
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Cerrar sesión
        </button>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '48px 32px', minHeight: '100vh', background: '#f6f8fa' }}>
        <Routes>
          <Route path="users" element={<UsersRoles />} />
          <Route path="audit" element={<AuditLog />} />
          <Route path="*" element={<h3 style={{ color: '#1976d2', fontWeight: 600 }}>Bienvenido al panel de administración</h3>} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
