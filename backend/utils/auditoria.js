
const { getConnection, sql } = require('../config/db');

/**
 * Registra un evento en el sistema de auditoría
 * @param {Object} eventoData - Datos del evento a registrar
 * @param {string|number} eventoData.usuario - ID o correo del usuario que realizó la acción
 * @param {string} eventoData.accion - Tipo de acción realizada
 * @param {string} eventoData.detalles - Información adicional sobre la acción
 * @returns {Promise<void>}
 */

const registrarEvento = async ({ usuario, accion, detalles }) => {
    try {
        const pool = await getConnection();
        let idUsuario = usuario;
        // Si usuario es correo, buscar el ID
        if (usuario && isNaN(usuario)) {
            const result = await pool.request()
                .input('Correo', sql.NVarChar(100), usuario)
                .query('SELECT IdUsuario FROM Usuarios WHERE Correo = @Correo');
            if (result.recordset.length > 0) {
                idUsuario = result.recordset[0].IdUsuario;
            } else {
                idUsuario = null;
            }
        }
        await pool.request()
            .input('IdUsuario', sql.Int, idUsuario)
            .input('Accion', sql.NVarChar(100), accion)
            .input('Detalles', sql.NVarChar(sql.MAX), detalles || null)
            .query('INSERT INTO AuditoriaActividades (IdUsuario, Accion, Detalles, Fecha) VALUES (@IdUsuario, @Accion, @Detalles, GETDATE())');
    } catch (error) {
        console.error('Error al registrar evento de auditoría:', error.message);
    }
};

/**
 * Obtiene registros de auditoría con filtros opcionales
 * @param {Object} filtros - Filtros para la búsqueda
 * @param {string} filtros.usuario - Filtrar por usuario (correo)
 * @param {string} filtros.accion - Filtrar por tipo de acción
 * @param {string} filtros.fechaInicio - Fecha inicio formato YYYY-MM-DD
 * @param {string} filtros.fechaFin - Fecha fin formato YYYY-MM-DD
 * @returns {Promise<Array>} - Arreglo de registros de auditoría
 */
const obtenerRegistros = async (filtros = {}) => {
    try {
        const { usuario, accion, fechaInicio, fechaFin } = filtros;
        const pool = await getConnection();
        
        let queryString = `
            SELECT a.IdAuditoria, u.Correo as Usuario, a.Accion, a.Detalles, a.Fecha
            FROM AuditoriaActividades a
            LEFT JOIN Usuarios u ON a.IdUsuario = u.IdUsuario
            WHERE 1=1
        `;
        
        const request = pool.request();
        
        if (usuario) {
            queryString += " AND u.Correo LIKE @Usuario";
            request.input('Usuario', sql.NVarChar, `%${usuario}%`);
        }
        
        if (accion) {
            queryString += " AND a.Accion LIKE @Accion";
            request.input('Accion', sql.NVarChar, `%${accion}%`);
        }
        
        if (fechaInicio) {
            queryString += " AND CAST(a.Fecha AS DATE) >= @FechaInicio";
            request.input('FechaInicio', sql.Date, fechaInicio);
        }
        
        if (fechaFin) {
            queryString += " AND CAST(a.Fecha AS DATE) <= @FechaFin";
            request.input('FechaFin', sql.Date, fechaFin);
        }
        
        queryString += " ORDER BY a.Fecha DESC";
        
        const result = await request.query(queryString);
        return result.recordset;
    } catch (error) {
        console.error('Error al obtener registros de auditoría:', error.message);
        return [];
    }
};

module.exports = {
    registrarEvento,
    obtenerRegistros
};