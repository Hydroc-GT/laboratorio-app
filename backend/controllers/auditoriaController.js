const { getConnection, sql } = require('../config/db');
const { registrarEvento, obtenerRegistros } = require('../utils/auditoria');

/**
 * Registrar un evento de auditoría en el sistema
 * @param {Object} req - Objeto de solicitud con detalles del evento
 * @param {Object} res - Objeto de respuesta
 */
exports.registrarEvento = async (req, res) => {
    const { usuario, accion, detalles } = req.body;
    
    if (!usuario || !accion) {
        return res.status(400).json({ error: 'Usuario y acción son campos obligatorios' });
    }

    try {
        await registrarEvento({ usuario, accion, detalles });
        res.status(201).json({ success: true, message: 'Evento registrado correctamente' });
    } catch (error) {
        console.error('Error al registrar evento de auditoría:', error);
        res.status(500).json({ error: 'Error al registrar evento de auditoría' });
    }
};

/**
 * Obtener registros de auditoría con filtros opcionales
 * @param {Object} req - Objeto de solicitud con filtros opcionales
 * @param {Object} res - Objeto de respuesta
 */
exports.obtenerRegistros = async (req, res) => {
    try {
        const { usuario, accion, fechaInicio, fechaFin } = req.query;
        
        // Usar la función de utilidad para obtener los registros
        const logs = await obtenerRegistros({ usuario, accion, fechaInicio, fechaFin });
        
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error al obtener registros de auditoría:', error);
        res.status(500).json({ error: 'Error al obtener registros de auditoría' });
    }
};

/**
 * Obtener registros de auditoría con filtros opcionales
 * @param {Object} req - Objeto de solicitud con filtros opcionales
 * @param {Object} res - Objeto de respuesta
 */
exports.obtenerRegistros = async (req, res) => {
    try {
        const { usuario, accion, fechaInicio, fechaFin } = req.query;
        
        // Usar la función de utilidad para obtener los registros
        const logs = await obtenerRegistros({ usuario, accion, fechaInicio, fechaFin });
        
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error al obtener registros de auditoría:', error);
        res.status(500).json({ error: 'Error al obtener registros de auditoría' });
    }
};