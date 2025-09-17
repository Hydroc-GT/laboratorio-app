const { getConnection, sql } = require("../config/db");

const crearRol = async (req, res) => {
    try {
        const { Nombre } = req.body;
        if (!Nombre) {
            return res.status(400).json({ message: "El nombre del rol es obligatorio." });
        }
        const pool = await getConnection();
        const result = await pool.request()
            .input('Nombre', sql.NVarChar(50), Nombre)
            .execute('CrearRol');
        res.status(201).json({ message: "Rol creado exitosamente.", result: result.rowsAffected });
    } catch (err) {
        console.error('Error al crear el rol:', err);
        res.status(500).json({ error: err.message });
    }
};

const listarRoles = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('ListarRoles');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al listar roles:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    crearRol,
    listarRoles
};