require("dotenv").config();
const express = require("express");
const cors = require("cors");

const cron = require('node-cron');
const { limpiarTokensExpirados } = require('./jobs/limpieza');

const app = express();

/* ============ Configuración base ============ */
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN?.split(",") || ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ============ Rutas reales ============ */
app.use("/api/clientes", require("./routes/clientes"));
app.use("/api/solicitudes", require("./routes/solicitudes"));
app.use("/api/espacios", require("./routes/espacios"));
app.use("/api/observaciones", require("./routes/observacion"));
app.use("/api/fotos-observacion", require("./routes/fotosObservaciones"));
app.use("/api/informes", require("./routes/informes"));
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/empresas", require("./routes/empresas"));
app.use("/api/agenda", require("./routes/agenda"));
// app.use("/api/autocomplete", require("./routes/autocomplete"));
// app.use("/api/place-details", require("./routes/placeDetails"));
app.use('/api/auth', require('./routes/auth_reset'));

app.use('/api/autocomplete', require('./routes/googleAutocomplete'));
app.use('/api/place-details', require('./routes/googlePlaceDetails'));
app.use('/api/google-billing', require('./routes/googleBilling'));

// app.use('/api/google-usage', require('./routes/googleUsage')); 




/* ============ Jobs (opcional por bandera) ============ */
// Actívalo en producción solo si pones ENABLE_JOBS=true en .env
if (String(process.env.ENABLE_JOBS).toLowerCase() === "true") {
  const { initRecordatorios } = require("./jobs/recordatorios");
  initRecordatorios();
}


cron.schedule('0 3 * * *', () => {
  console.log('⏰ Ejecutando limpieza de tokens...');
  limpiarTokensExpirados();
});

/* ============ Errores y arranque ============ */
app.use((err, req, res, next) => {
  console.error("ERROR middleware:", err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
