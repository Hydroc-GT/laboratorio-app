const puppeteer = require('puppeteer');
const sql = require('mssql');
const { getConnection } = require('../config/db'); 
const ExcelJS = require('exceljs');
const QRCode = require('qrcode');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);
const jwt = require('jsonwebtoken');

// Secret key for JWT
const JWT_SECRET = 'secreto-laboratorio-control-calidad-2025';

// Función para obtener las muestras asignadas a un analista
exports.getMuestrasPorAnalista = async (req, res) => {
    // En un entorno real, el ID del analista se obtendría del token de sesión
    const { idAnalista } = req.params;

    try {
        console.log(`Fetching samples for analyst ID: ${idAnalista}`);
        let pool = await getConnection();
        let result = await pool.request()
            .input('IdAnalista', sql.Int, idAnalista)
            .execute('ListarMuestrasPorAnalista');

        console.log(`Result from DB: ${JSON.stringify(result.recordset)}`);
        const muestras = result.recordset;

        // Separar las muestras en "Por analizar" e "Historial"
        const porAnalizar = muestras.filter(m => m.Estado === 'EnAnalisis' || m.Comentarios !== null);
        const historial = muestras.filter(m => m.Estado === 'Evaluada' || m.Estado === 'Certificada' || m.Estado === 'Devuelta');

        res.status(200).json({ porAnalizar, historial });

    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las muestras', error: err.message });
    }
};

exports.getParametrosPorMuestra = async (req, res) => {
    const { idMuestra } = req.params;
    try {
        let pool = await getConnection();
        // Usar el stored procedure para obtener los parámetros válidos
        const result = await pool.request()
            .input('IdMuestra', sql.Int, idMuestra)
            .execute('ObtenerParametrosParaMuestra');

        if (!result.recordset.length) {
            return res.status(404).json({ message: 'No se encontraron parámetros para la muestra.' });
        }

        // Los parámetros ya tienen los IDs correctos
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(`Error obteniendo parámetros desde la base de datos: ${err.message}`);
        res.status(500).json({ message: 'Error al obtener los parámetros desde la base de datos', error: err.message });
    }
};

async function obtenerDatosMuestraParaCertificado(idMuestra) {
    try {
        let pool = await getConnection();
        const result = await pool.request()
            .input('IdMuestra', sql.Int, idMuestra)
            .execute('ObtenerDatosMuestraParaCertificado');
        
        if (result.recordset.length === 0) {
            console.error("No se encontraron datos para la muestra:", idMuestra);
            return null;
        }
        
        console.log("Datos de la muestra obtenidos:", result.recordset[0]);
        return result.recordset[0];
    } catch (err) {
        console.error("Error al obtener datos de la muestra:", err);
        return null;
    }
}

// Función auxiliar para convertir un archivo de Excel a PDF.
async function convertExcelToPdf(filePath) {
        // Ya no se usa para certificados
        return Buffer.from([]);
}

// Función para generar el HTML del certificado
function generarCertificadoHTML(muestraData, resultados) {
        return `
        <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    h1 { color: #1976d2; }
                    .info { margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                    th { background: #e3f2fd; }
                </style>
            </head>
            <body>
                <h1>Certificado de Resultados</h1>
                <div class="info">
                    <strong>Código Único:</strong> ${muestraData.CodigoUnico}<br>
                    <strong>Solicitante:</strong> ${muestraData.NombreSolicitante}<br>
                    <strong>Tipo de Muestra:</strong> ${muestraData.TipoMuestra}
                </div>
                <table>
                    <tr>
                        <th>Parámetro</th>
                        <th>Valor Obtenido</th>
                        <th>Estado</th>
                    </tr>
                    ${resultados.map(r => `
                        <tr>
                            <td>${r.nombreParametro}</td>
                            <td>${r.valorObtenido}</td>
                            <td>${r.cumple ? 'Cumple' : 'No Cumple'}</td>
                        </tr>
                    `).join('')}
                </table>
            </body>
        </html>
        `;
}

// Endpoint para enviar resultados y generar el certificado
exports.enviarResultados = async (req, res) => {
    const { idMuestra, resultados, aptoConsumo } = req.body;

    // A. Guardar resultados en la base de datos
    console.log('Datos recibidos en enviarResultados:', {
        idMuestra,
        resultados,
        aptoConsumo
    });
    // Auditoría: registrar evento de envío de resultados
    try {
        const { registrarEvento } = require('../utils/auditoria');
        // Obtener usuario desde JWT si está disponible
        let usuario = null;
        if (req.headers.authorization) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, JWT_SECRET);
                usuario = decoded.correo || decoded.idUsuario || null;
            } catch (e) {
                usuario = null;
            }
        }
        await registrarEvento({
            usuario: usuario,
            accion: 'Enviar resultados',
            detalles: `Muestra: ${idMuestra}, Resultados: ${JSON.stringify(resultados)}, AptoConsumo: ${aptoConsumo}`
        });
    } catch (e) {
        console.error('Error al registrar evento de auditoría (enviarResultados):', e.message);
    }
    try {
        let pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            for (const resultado of resultados) {
                console.log('Registrando resultado:', resultado);
                await transaction.request()
                    .input('IdMuestra', sql.Int, idMuestra)
                    .input('IdParametroNorma', sql.Int, resultado.idParametroNorma)
                    .input('ValorObtenido', sql.Decimal(10, 2), resultado.valorObtenido)
                    .input('Cumple', sql.Bit, resultado.cumple)
                    .execute('RegistrarResultado');
            }
            const estadoFinal = aptoConsumo ? 'Evaluada' : 'Rechazada';
            await transaction.request()
                .input('IdMuestra', sql.Int, idMuestra)
                .input('NuevoEstado', sql.NVarChar, estadoFinal)
                .execute('ActualizarEstadoMuestra');

            await transaction.commit();

        } catch (err) {
            await transaction.rollback();
            throw err;
        }

    } catch (err) {
        console.error('Error detallado al registrar los resultados:', err);
        if (err.precedingErrors) {
            err.precedingErrors.forEach((e, i) => {
                console.error(`SQL Error[${i}]:`, e);
            });
        }
        return res.status(500).json({ message: 'Error al registrar los resultados', error: err.message, stack: err.stack });
    }

    // B. Generar PDF con HTML
    try {
        const muestraData = await obtenerDatosMuestraParaCertificado(idMuestra);
        if (!muestraData) {
            return res.status(404).json({ message: 'Datos de la muestra no encontrados.' });
        }
        console.log(`Generando certificado PDF con HTML para tipo de muestra: ${muestraData.TipoMuestra}`);

        // Generar el HTML del certificado
        const htmlCertificado = generarCertificadoHTML(muestraData, resultados);
        const finalPdfPath = path.join(__dirname, `../certificados/certificado_${idMuestra}.pdf`);

        // Generar el PDF usando Puppeteer
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setContent(htmlCertificado, { waitUntil: 'networkidle0' });
        await page.pdf({ path: finalPdfPath, format: 'A4' });
        await browser.close();

        res.status(200).json({
            message: 'Resultados registrados y certificado generado con éxito.',
            pdfUrl: `/certificados/certificado_${idMuestra}.pdf`
        });
    } catch (err) {
        console.error("Error en la generación del certificado PDF:", err);
        res.status(500).json({ message: 'Error en la generación del certificado', error: err.message });
    }
};

// Nueva función y ruta para validar el token del QR
exports.validarToken = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: 'Token no proporcionado.' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        res.status(200).json({
            message: 'Token válido.',
            data: decoded
        });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token ha caducado.' });
        }
        return res.status(401).json({ message: 'Token inválido.' });
    }
};