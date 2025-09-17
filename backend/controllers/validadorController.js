const sql = require('mssql');
const { getConnection } = require('../config/db');
const jwt = require('jsonwebtoken');

exports.getDashboardData = async (req, res) => {
    try {
        let pool = await getConnection();
        
        const muestrasParaAsignar = await pool.request().execute('GetMuestrasParaAsignar');
        const analistas = await pool.request().execute('GetAnalistas');
        const muestrasParaAprobar = await pool.request().execute('GetMuestrasParaAprobar');
        const historial = await pool.request().execute('GetHistorialValidador');

        res.status(200).json({
            porAsignar: muestrasParaAsignar.recordset,
            analistas: analistas.recordset,
            porAprobar: muestrasParaAprobar.recordset,
            historial: historial.recordset
        });

    } catch (err) {
        res.status(500).json({ message: 'Error al obtener datos del dashboard del validador', error: err.message });
    }
};

exports.asignarAnalista = async (req, res) => {
    const { idMuestra, idAnalista, comentarios } = req.body;
    try {
        let pool = await getConnection();
        await pool.request()
            .input('IdMuestra', sql.Int, idMuestra)
            .input('IdAnalista', sql.Int, idAnalista)
            .input('Comentarios', sql.NVarChar, comentarios)
            .execute('AsignarAnalistaAMuestra');
        res.status(200).json({ message: 'Analista asignado con éxito.' });
    } catch (err) {
        res.status(500).json({ message: 'Error al asignar el analista', error: err.message });
    }
};

exports.aprobarMuestra = async (req, res) => {
    const { idMuestra } = req.body;
    try {
        let pool = await getConnection();
        await pool.request()
            .input('IdMuestra', sql.Int, idMuestra)
            .execute('AprobarMuestra');
        res.status(200).json({ message: 'Muestra aprobada y certificada.' });
    } catch (err) {
        res.status(500).json({ message: 'Error al aprobar la muestra', error: err.message });
    }
};

exports.desaprobarMuestra = async (req, res) => {
    const { idMuestra, comentarios } = req.body;
    try {
        let pool = await getConnection();
        await pool.request()
            .input('IdMuestra', sql.Int, idMuestra)
            .input('Comentarios', sql.NVarChar, comentarios)
            .execute('DesaprobarMuestra');
        // Auditoría: registrar evento de devolución/desaprobación
        try {
            const { registrarEvento } = require('../utils/auditoria');
            // Obtener usuario desde JWT si está disponible
            let usuario = null;
            if (req.headers.authorization) {
                try {
                    const token = req.headers.authorization.split(' ')[1];
                    const decoded = jwt.verify(token, 'secreto-laboratorio-control-calidad-2025');
                    usuario = decoded.correo || decoded.idUsuario || null;
                } catch (e) {
                    usuario = null;
                }
            }
            await registrarEvento({
                usuario: usuario,
                accion: 'Devolver muestra',
                detalles: `Muestra: ${idMuestra}, Comentarios: ${comentarios}`
            });
        } catch (e) {
            console.error('Error al registrar evento de auditoría (desaprobarMuestra):', e.message);
        }
        res.status(200).json({ message: 'Muestra desaprobada y devuelta.' });
    } catch (err) {
        console.error('Error detallado al desaprobar la muestra:', err);
        if (err.precedingErrors) {
            err.precedingErrors.forEach((e, i) => {
                console.error(`SQL Error[${i}]:`, e);
            });
        }
        res.status(500).json({ message: 'Error al desaprobar la muestra', error: err.message, stack: err.stack });
    }
};