require('dotenv').config();
const sql = require('mssql');

const dbConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  server: process.env.DB_SERVER || '127.0.0.1',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
  database: process.env.DB_DATABASE || 'LaboratorioControlCalidad',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false',
  },
};

let poolPromise = null;

async function getConnection() {
  try {
    if (!poolPromise) {
      poolPromise = sql.connect(dbConfig);
    }
    const pool = await poolPromise;
    return pool;
  } catch (err) {
    poolPromise = null; // Reiniciar para permitir reintento de conexión
    console.error("Error de conexión a la base de datos:", err);
    throw err;
  }
}

module.exports = { sql, getConnection, dbConfig };