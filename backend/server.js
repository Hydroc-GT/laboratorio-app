const express = require("express");
const cors = require("cors");
const muestrasRoutes = require("./routes/muestras");

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/muestras", muestrasRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
