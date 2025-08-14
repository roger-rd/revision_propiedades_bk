require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/bd_revision_casa.js");

const app = express();

/* ============ Config dev ============ */
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

/* Logger dev (simple) */
// app.use((req, res, next) => {
//   const t0 = Date.now();
//   res.on("finish", () => {
//     const ms = Date.now() - t0;
//     console.log(
//       `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`
//     );
//   });
//   next();
// });

/* ============ Healthchecks útiles en dev ============ */
app.get("/health/db", async (req, res, next) => {
  try {
    const r = await pool.query("SELECT 1 as ok");
    res.json({ db: "ok", result: r.rows[0] });
  } catch (e) {
    next(e);
  }
});

app.get("/health/schema", async (req, res, next) => {
  try {
    const empresas = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'empresas'
      ORDER BY ordinal_position
    `);
    const usuarios = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'usuarios'
      ORDER BY ordinal_position
    `);
    res.json({ empresas: empresas.rows, usuarios: usuarios.rows });
  } catch (e) {
    next(e);
  }
});

/* Ruta raíz en dev */
app.get("/", (_req, res) => res.send("Servidor funcionando 🧡 (DEV)"));

/* (Opcional) Ruta demo: listar clientes (útil mientras desarrollas) */
if (String(process.env.ENABLE_DEMO).toLowerCase() === "true") {
  app.get("/clientes", async (_req, res) => {
    try {
      const r = await pool.query("SELECT * FROM clientes");
      res.json(r.rows);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
}

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
app.use("/api/autocomplete", require("./routes/autocomplete"));
app.use("/api/place-details", require("./routes/placeDetails"));

/* ============ Jobs (opcional también en dev) ============ */
// Deja off en dev salvo que quieras probar correos
if (String(process.env.ENABLE_JOBS).toLowerCase() === "true") {
  const { initRecordatorios } = require("./jobs/recordatorios");
  initRecordatorios();
}

/* ============ Errores y arranque ============ */
app.use((err, req, res, next) => {
  console.error("ERROR middleware:", err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor DEV corriendo en http://localhost:${PORT}`);
});
