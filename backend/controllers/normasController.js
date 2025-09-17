const { getConnection, sql } = require("../config/db");

const crearNorma = async (req, res) => {
    try {
        const { Nombre, Descripcion } = req.body;
        if (!Nombre) {
            return res.status(400).json({ message: "El nombre de la norma es obligatorio." });
        }
        const pool = await getConnection();
        await pool.request()
            .input('Nombre', sql.NVarChar(100), Nombre)
            .input('Descripcion', sql.NVarChar(500), Descripcion)
            .execute('CrearNorma');
        res.status(201).json({ message: "Norma creada exitosamente." });
    } catch (err) {
        console.error('Error al crear la norma:', err);
        res.status(500).json({ error: err.message });
    }
};

const listarNormas = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('ListarNormas');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al listar normas:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    crearNorma,
    listarNormas
};