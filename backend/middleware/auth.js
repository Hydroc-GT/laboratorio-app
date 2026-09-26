const jwt = require('jsonwebtoken');
const { getConnection, sql } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto_laboratorio_lims_jwt_key_2025_prod';

/**
 * Middleware global permisivo: Extrae el usuario autenticado desde el Bearer Token JWT
 * o (por retrocompatibilidad) desde el header user-id.
 */
const extraerUsuario = async (req, res, next) => {
    try {
        let token = null;
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                req.user = decoded;
                req.usuario = decoded; // Alias para compatibilidad con código existente
                return next();
            } catch (jwtErr) {
                // Token inválido o expirado
                console.warn('Token JWT inválido o expirado:', jwtErr.message);
            }
        }

        // Retrocompatibilidad con header 'user-id'
        const userId = req.headers['user-id'];
        if (userId) {
            const pool = await getConnection();
            const result = await pool.request()
                .input('IdUsuario', sql.Int, userId)
                .query('SELECT IdUsuario, Nombre, Correo, IdRol, Estado FROM Usuarios WHERE IdUsuario = @IdUsuario');

            if (result.recordset.length > 0) {
                const user = result.recordset[0];
                req.user = {
                    idUsuario: user.IdUsuario,
                    nombre: user.Nombre,
                    correo: user.Correo,
                    idRol: user.IdRol,
                    estado: user.Estado
                };
                req.usuario = req.user;
            }
        }

        next();
    } catch (error) {
        console.error('Error en middleware de autenticación:', error);
        next();
    }
};

/**
 * Middleware estricto: Requiere que la petición tenga un token JWT válido
 */
const autenticarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado: Token no proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        req.usuario = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Sesión expirada. Por favor inicie sesión nuevamente.' });
        }
        return res.status(403).json({ message: 'Token de autenticación no válido.' });
    }
};

/**
 * Middleware de RBAC: Valida que el usuario autenticado posea uno de los roles permitidos
 * @param {Array<number>} rolesPermitidos - Lista de IDs de roles autorizados
 */
const verificarRol = (rolesPermitidos = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado.' });
        }
        const userRoleId = req.user.idRol || req.user.IdRol;
        if (!rolesPermitidos.includes(userRoleId)) {
            return res.status(403).json({ message: 'Acceso restringido: no tiene permisos para esta acción.' });
        }
        next();
    };
};

module.exports = {
    extraerUsuario,
    autenticarToken,
    verificarRol,
    JWT_SECRET
};