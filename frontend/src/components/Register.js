import React, { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register({
                Nombre: nombre,
                Correo: correo,
                Contrasena: contrasena,
                IdRol: 2 // id del rol de registro
            });
            navigate('/login');
        } catch (err) {
            setError('Fallo el registro. Inténtalo de nuevo.');
        }
    };

    return (
        <div className='form-container'>
            <h2>Crear Cuenta</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                <div>
                    <label>Correo:</label>
                    <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
                </div>
                <button type="submit">Crear Cuenta</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Register;