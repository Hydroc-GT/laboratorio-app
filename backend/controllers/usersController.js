const { getConnection, sql } = require("../config/db");
const bcrypt = require('bcrypt');
const { registrarEvento } = require('../utils/auditoria');

const crearUsuario = async (req, res) => {
    try {
        const { Nombre, Correo, Contrasena, IdRol } = req.body;
        if (!Nombre || !Correo || !Contrasena || !IdRol) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }
        const salt = await bcrypt.genSalt(10);
        const contrasenaHash = await bcrypt.hash(Contrasena, salt);
        const pool = await getConnection();
        await pool.request()
            .input('Nombre', sql.NVarChar(100), Nombre)
            .input('Correo', sql.NVarChar(100), Correo)
            .input('Contrasena', sql.NVarChar(255), contrasenaHash)
            .input('IdRol', sql.Int, IdRol)
            .execute('CrearUsuario');
            
        // Registrar en auditoría
        await registrarEvento({
            usuario: 'sistema', // O podría ser el ID del admin que crea usuarios
            accion: 'Creación de usuario',
            detalles: `Usuario: ${Correo}, Rol: ${IdRol}`
        });
            
        res.status(201).json({ message: "Usuario creado exitosamente." });
    } catch (err) {
        console.error('Error al crear el usuario:', err);
        res.status(500).json({ error: err.message });
    }
};

const listarUsuarios = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('ListarUsuarios');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al listar usuarios:', err);
        res.status(500).json({ error: err.message });
    }
};

const loginUsuario = async (req, res) => {
    try {
        const { Correo, Contrasena } = req.body;
        const pool = await getConnection();
        const result = await pool.request()
            .input('Correo', sql.NVarChar(100), Correo)
            .execute('LoginUsuario');
        
        if (result.recordset.length === 0) {
            return res.status(401).json({ message: "Credenciales inválidas." });
        }

        const usuario = result.recordset[0];
        if (usuario.Estado && usuario.Estado === 'Inactivo') {
            return res.status(403).json({ message: "Usuario inactivo. Contacte al administrador." });
        }
        const contrasenaValida = await bcrypt.compare(Contrasena, usuario.Contrasena);
        if (!contrasenaValida) {
            return res.status(401).json({ message: "Credenciales inválidas." });
        }
        // Se excluye la contraseña del objeto de respuesta por seguridad
        delete usuario.Contrasena;
        
        // Registrar en auditoría
        await registrarEvento({
            usuario: usuario.IdUsuario,
            accion: 'Inicio de sesión',
            detalles: `Acceso exitoso desde ${req.ip || 'IP desconocida'}`
        });
         
        res.json({ message: "Inicio de sesión exitoso.", usuario });

    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        res.status(500).json({ error: err.message });
    }
};


// Cambiar estado de usuario (Activo/Inactivo)
const actualizarEstadoUsuario = async (req, res) => {
    try {
        const { idUsuario } = req.params;
        const { Estado } = req.body;
        if (!idUsuario || !Estado) {
            return res.status(400).json({ message: "Faltan datos obligatorios." });
        }
        const pool = await getConnection();
        const result = await pool.request()
            .input('IdUsuario', sql.Int, idUsuario)
            .input('Estado', sql.NVarChar(20), Estado)
            .execute('ActualizarEstadoUsuario');
        
        const usuarioAfectado = result.recordset[0];
        
        // Registrar en auditoría
        await registrarEvento({
            usuario: req.usuario?.IdUsuario || 'sistema', // Idealmente del token de autenticación
            accion: 'Cambio de estado usuario',
            detalles: `Usuario: ${usuarioAfectado.Correo}, Estado: ${usuarioAfectado.Estado}`
        });
            
        res.json({ message: "Estado actualizado correctamente." });
    } catch (err) {
        console.error('Error al actualizar estado del usuario:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    crearUsuario,
    listarUsuarios,
    loginUsuario,
    actualizarEstadoUsuario
};