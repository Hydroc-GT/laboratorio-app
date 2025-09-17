const { getConnection } = require('./config/db');
const fs = require('fs');

async function runSQLScript() {
  try {
    const sql = fs.readFileSync('./sql/parametros_muestra.sql', 'utf8');
    const pool = await getConnection();
    const result = await pool.request().query(sql);
    console.log('SQL script executed successfully!');
  } catch (err) {
    console.error('Error executing SQL script:', err);
  }
}

runSQLScript();