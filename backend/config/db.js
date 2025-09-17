const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sql = require('mssql');

const dbConfig = {
  user: 'sa',
  password: 'ninjassj4',
  server: 'FELIPE-LAPTOP\\PRUEBAS',
  database: 'LaboratorioControlCalidad',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function getConnection() {
  try {
    const pool = await sql.connect(dbConfig);
    return pool;
  } catch (err) {
    console.error("Error de conexión:", err);
  }
}

module.exports = { sql, getConnection };