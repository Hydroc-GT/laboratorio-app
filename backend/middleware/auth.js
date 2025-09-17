const { getConnection, sql } = require('../config/db');

// Middleware para extraer el usuario de la cookie o token de sesión
const extraerUsuario = async (req, res, next) => {
    try {
        // Obtener la información del usuario de la sesión, cookies o encabezados
        // En un entorno de producción, usarías JWT u otro método de autenticación
        // Para este ejemplo, simplemente extraemos el ID del usuario de los encabezados

        const userId = req.headers['user-id']; // El frontend debe enviar este encabezado
        
        if (userId) {
            const pool = await getConnection();
            const result = await pool.request()
                .input('IdUsuario', sql.Int, userId)
                .query('SELECT IdUsuario, Nombre, Correo, IdRol FROM Usuarios WHERE IdUsuario = @IdUsuario');
            
            if (result.recordset.length > 0) {
                req.user = result.recordset[0];
            }
        }
        
        next();
    } catch (error) {
        console.error('Error en middleware de autenticación:', error);
        next(); // Continuamos, pero sin usuario autenticado
    }
};

module.exports = { extraerUsuario };