const { getConnection, sql } = require("../config/db");

const registrarMuestra = async (req, res) => {
  const { IdTipoMuestra, CodigoUnico, Origen, IdSolicitante } = req.body;
  try {
    const pool = await getConnection();
    await pool.request()
      .input("IdTipoMuestra", sql.Int, IdTipoMuestra)
      .input("CodigoUnico", sql.VarChar, CodigoUnico)
      .input("Origen", sql.VarChar, Origen)
      .input("IdSolicitante", sql.Int, IdSolicitante)
      .query(`
        INSERT INTO Muestras (IdTipoMuestra, CodigoUnico, Origen, IdSolicitante)
        VALUES (@IdTipoMuestra, @CodigoUnico, @Origen, @IdSolicitante)
      `);
    res.json({ message: "Muestra registrada correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listarMuestras = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM Muestras");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registrarMuestra, listarMuestras };
