const { getConnection, sql } = require("../config/db");
const { registrarEvento } = require('../utils/auditoria');

// Endpoint para obtener el siguiente número de muestra por tipo vía Stored Procedure
const obtenerSiguienteNumero = async (req, res) => {
  const { idTipoMuestra } = req.query;
  if (!idTipoMuestra) return res.status(400).json({ error: 'idTipoMuestra requerido' });
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('IdTipoMuestra', sql.Int, parseInt(idTipoMuestra))
      .execute('ObtenerSiguienteNumeroMuestra');

    const siguienteNumero = result.recordset[0]?.SiguienteNumero || 1;
    res.json({ siguienteNumero });
  } catch (err) {
    console.error('Error al obtener siguiente número:', err);
    res.status(500).json({ error: err.message });
  }
};

const registrarMuestra = async (req, res) => {
  const { IdTipoMuestra, CodigoUnico, Origen, CondicionesTransporte, IdSolicitante } = req.body;
  try {
    const pool = await getConnection();
    
    // Registrar la muestra vía Stored Procedure
    await pool.request()
      .input("IdTipoMuestra", sql.Int, IdTipoMuestra)
      .input("CodigoUnico", sql.VarChar(50), CodigoUnico)
      .input("Origen", sql.VarChar(200), Origen)
      .input("CondicionesTransporte", sql.VarChar(200), CondicionesTransporte)
      .input("IdSolicitante", sql.Int, IdSolicitante)
      .execute("CrearMuestra");
    
    // Registrar en auditoría
    const usuarioId = req.user ? req.user.IdUsuario : null;
    const usuarioCorreo = req.user ? req.user.Correo : 'sistema';
    
    await registrarEvento({
      usuario: usuarioId || usuarioCorreo,
      accion: 'Registro de muestra',
      detalles: `Muestra: ${CodigoUnico}`
    });
    
    res.json({ message: "Muestra registrada correctamente" });
  } catch (err) {
    console.error('Error al registrar muestra:', err);
    res.status(500).json({ error: err.message });
  }
};

const listarMuestras = async (req, res) => {
  try {
    const pool = await getConnection();
    const request = pool.request();
    
    // El Stored Procedure ListarMuestras admite opcionalmente @IdSolicitante
    if (req.query.solicitanteId) {
      request.input('IdSolicitante', sql.Int, parseInt(req.query.solicitanteId));
    }

    const result = await request.execute('ListarMuestras');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al listar muestras:', err);
    res.status(500).json({ error: err.message });
  }
};

// Obtener el último número usado para el código único de una muestra por tipo
const obtenerUltimoCodigo = async (req, res) => {
  const tipo = req.query.tipo;
  if (!tipo) return res.status(400).json({ error: 'Tipo de muestra requerido' });
  let prefijo = '';
  if (tipo === 'Agua') prefijo = 'AGU-';
  else if (tipo === 'Alimento') prefijo = 'ALI-';
  else if (tipo === 'Bebida Alcohólica') prefijo = 'ALC-';
  else return res.status(400).json({ error: 'Tipo de muestra inválido' });

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('Prefijo', sql.VarChar(10), prefijo + '%')
      .query(`
        SELECT ISNULL(COUNT(*), 0) AS ultimoNumero
        FROM Muestras
        WHERE CodigoUnico LIKE @Prefijo
      `);
    const ultimoNumero = result.recordset[0].ultimoNumero || 0;
    res.json({ ultimoNumero });
  } catch (err) {
    console.error('Error al obtener último código:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registrarMuestra, listarMuestras, obtenerUltimoCodigo, obtenerSiguienteNumero };

