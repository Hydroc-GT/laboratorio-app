const { getConnection, sql } = require("../config/db");

const crearSolicitante = async (req, res) => {
  try {
    const { Nombre, TipoSolicitante, DocumentoIdentidad, Direccion, Telefono, Correo } = req.body;
    if (!Nombre || !TipoSolicitante || !DocumentoIdentidad) {
      return res.status(400).json({ message: "Los campos Nombre, TipoSolicitante y DocumentoIdentidad son obligatorios." });
    }
    const pool = await getConnection();
    const result = await pool.request()
      .input('Nombre', sql.NVarChar(100), Nombre)
      .input('TipoSolicitante', sql.NVarChar(50), TipoSolicitante)
      .input('DocumentoIdentidad', sql.NVarChar(50), DocumentoIdentidad)
      .input('Direccion', sql.NVarChar(200), Direccion)
      .input('Telefono', sql.NVarChar(20), Telefono)
      .input('Correo', sql.NVarChar(100), Correo)
      .execute('CrearSolicitante');
    res.status(201).json({ message: "Solicitante creado exitosamente." });
  } catch (err) {
    console.error('Error al crear el solicitante:', err);
    res.status(500).json({ error: err.message });
  }
};

const listarSolicitantes = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().execute('ListarSolicitantes');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al listar solicitantes:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  crearSolicitante,
  listarSolicitantes
};