import React, { useState } from 'react';
import { login as loginService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const Login = () => {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await loginService({ Correo: correo, Contrasena: contrasena });
            const idRol = res.usuario?.IdRol;
            if (res.usuario?.Estado && res.usuario.Estado === 'Inactivo') {
                setError('Usuario inactivo. Contacte al administrador.');
                return;
            }
            // Usar el método login del contexto
            login(res.usuario);
            if (idRol === 2) {
                navigate('/register-muestra');
            } else if (idRol === 3) {
                navigate('/analista');
            } else if (idRol === 1) {
                navigate('/admin');
            } else if (idRol === 4) {
                navigate('/validador');
            } else {
                navigate('/');
            }
        } catch (err) {
            if (err.response && err.response.status === 403) {
                setError('Usuario inactivo. Contacte al administrador.');
            } else {
                setError('Correo o contraseña incorrectos');
            }
        }
    };

    return (
        <div className="form-container">
            <h2 style={{marginTop: 0}}>Iniciar Sesión</h2>
            {error && <div style={{color: '#b71c1c', background: '#ffebee', borderRadius: 6, padding: '10px 14px', marginBottom: 16, fontWeight: 500}}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="correo">Correo</label>
                <input
                    id="correo"
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                />
                <label htmlFor="contrasena">Contraseña</label>
                <input
                    id="contrasena"
                    type="password"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    required
                />
                <div style={{ margin: '10px 0 16px 0', textAlign: 'right' }}>
                    <span
                        style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline', fontSize: 15 }}
                        onClick={() => navigate('/register')}
                    >
                        Crear cuenta
                    </span>
                </div>
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
};

export default Login;
