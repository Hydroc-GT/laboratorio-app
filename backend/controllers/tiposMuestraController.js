const { getConnection, sql } = require("../config/db");

const crearTipoMuestra = async (req, res) => {
    try {
        const { Nombre } = req.body;
        if (!Nombre) {
            return res.status(400).json({ message: "El nombre del tipo de muestra es obligatorio." });
        }
        const pool = await getConnection();
        await pool.request()
            .input('Nombre', sql.NVarChar(50), Nombre)
            .execute('CrearTipoMuestra');
        res.status(201).json({ message: "Tipo de muestra creado exitosamente." });
    } catch (err) {
        console.error('Error al crear el tipo de muestra:', err);
        res.status(500).json({ error: err.message });
    }
};

const listarTiposMuestra = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('ListarTiposMuestra');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al listar tipos de muestra:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    crearTipoMuestra,
    listarTiposMuestra
};