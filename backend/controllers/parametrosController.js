const { getConnection, sql } = require("../config/db");

const crearParametro = async (req, res) => {
    try {
        const { Nombre, Unidad } = req.body;
        if (!Nombre || !Unidad) {
            return res.status(400).json({ message: "Los campos Nombre y Unidad son obligatorios." });
        }
        const pool = await getConnection();
        await pool.request()
            .input('Nombre', sql.NVarChar(100), Nombre)
            .input('Unidad', sql.NVarChar(20), Unidad)
            .execute('CrearParametro');
        res.status(201).json({ message: "Parámetro creado exitosamente." });
    } catch (err) {
        console.error('Error al crear el parámetro:', err);
        res.status(500).json({ error: err.message });
    }
};

const listarParametros = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('ListarParametros');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al listar parámetros:', err);
        res.status(500).json({ error: err.message });
    }
};

const crearParametroNorma = async (req, res) => {
    try {
        const { IdNorma, IdParametro, ValorMinimo, ValorMaximo } = req.body;
        if (!IdNorma || !IdParametro) {
            return res.status(400).json({ message: "Los campos IdNorma y IdParametro son obligatorios." });
        }
        const pool = await getConnection();
        await pool.request()
            .input('IdNorma', sql.Int, IdNorma)
            .input('IdParametro', sql.Int, IdParametro)
            .input('ValorMinimo', sql.Decimal(18, 2), ValorMinimo)
            .input('ValorMaximo', sql.Decimal(18, 2), ValorMaximo)
            .execute('CrearParametroNorma');
        res.status(201).json({ message: "Relación Parámetro-Norma creada exitosamente." });
    } catch (err) {
        console.error('Error al crear la relación Parámetro-Norma:', err);
        res.status(500).json({ error: err.message });
    }
};

const listarParametrosPorNorma = async (req, res) => {
    try {
        const { idNorma } = req.params;
        const pool = await getConnection();
        const result = await pool.request()
            .input('IdNorma', sql.Int, idNorma)
            .execute('ListarParametrosNormaPorNorma');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al listar parámetros por norma:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    crearParametro,
    listarParametros,
    crearParametroNorma,
    listarParametrosPorNorma
};