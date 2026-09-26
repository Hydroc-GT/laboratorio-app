require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const { extraerUsuario } = require('./middleware/auth');

const rolesRoutes = require("./routes/roles");
const authRoutes = require('./routes/users');
const muestrasRoutes = require("./routes/muestras");
const solicitantesRoutes = require("./routes/solicitantes");
const tiposMuestraRoutes = require("./routes/tiposMuestra");
const normasRoutes = require("./routes/normas");
const parametrosRoutes = require("./routes/parametros");
const resultadosRoutes = require("./routes/resultados");
const auditoriaRoutes = require("./routes/auditoria");

const analistaRoutes = require('./routes/analista');
const validadorRoutes = require('./routes/validador');

const app = express();

// Configuración de middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de autenticación
app.use(extraerUsuario);

// Configuración de rutas
app.use("/api/roles", rolesRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/muestras", muestrasRoutes);
app.use("/api/solicitantes", solicitantesRoutes);
app.use("/api/tipos-muestra", tiposMuestraRoutes);
app.use("/api/normas", normasRoutes);
app.use("/api/parametros", parametrosRoutes);
app.use("/api/resultados", resultadosRoutes);
app.use("/api/auditoria", auditoriaRoutes);
app.use('/api/analista', analistaRoutes);
app.use('/api/validador', validadorRoutes);

// Manejo de errores 404
app.use((req, res, next) => {
    res.status(404).send("Lo siento, esa ruta no existe.");
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal en el servidor!');
});

const PORT = process.env.PORT || 3001;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}

module.exports = app;