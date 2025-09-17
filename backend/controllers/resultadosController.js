const { getConnection, sql } = require("../config/db");

const registrarResultado = async (req, res) => {
    try {
        const { IdMuestra, IdParametroNorma, ValorObtenido, Cumple } = req.body;
        if (!IdMuestra || !IdParametroNorma || !ValorObtenido || Cumple === undefined) {
            return res.status(400).json({ message: "Los campos IdMuestra, IdParametroNorma, ValorObtenido y Cumple son obligatorios." });
        }
        const pool = await getConnection();
        await pool.request()
            .input('IdMuestra', sql.Int, IdMuestra)
            .input('IdParametroNorma', sql.Int, IdParametroNorma)
            .input('ValorObtenido', sql.Decimal(10, 2), ValorObtenido)
            .input('Cumple', sql.Bit, Cumple)
            .execute('RegistrarResultado');
        res.status(201).json({ message: "Resultado registrado exitosamente." });
    } catch (err) {
        console.error('Error al registrar el resultado:', err);
        res.status(500).json({ error: err.message });
    }
};

const listarResultadosPorMuestra = async (req, res) => {
    try {
        const { idMuestra } = req.params;
        const pool = await getConnection();
        const result = await pool.request()
            .input('IdMuestra', sql.Int, idMuestra)
            .execute('ListarResultadosPorMuestra');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al listar resultados por muestra:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    registrarResultado,
    listarResultadosPorMuestra
};