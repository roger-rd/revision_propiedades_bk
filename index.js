require("dotenv").config();
const express = require("express");
const cors = require("cors");

const cron = require('node-cron');
const { limpiarTokensExpirados } = require('./jobs/limpieza');

const app = express();


// ====== Health con info útil
const { v2: cld } = require('cloudinary');
const url = require('url');
app.get('/api/health', (req, res) => {
  const dbUrl = process.env.DATABASE_URL;
  const dbHost = dbUrl ? new url.URL(dbUrl).hostname : process.env.DB_HOST;

  res.json({
    ok: true,
    at: new Date().toISOString(),
    db_source: dbUrl ? "DATABASE_URL" : "DB_HOST",
    db_host: dbHost,
    cloud: cld.config().cloud_name
  });
});


/* ============ Configuración base ============ */

/* ============ CORS ============ */
const envList =
  (process.env.FRONTEND_ORIGINS || process.env.FRONTEND_ORIGIN || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

// dev local
const localList = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const ALLOWED_ORIGINS = Array.from(new Set([...envList, ...localList]));

const corsOptions = {
  origin(origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true, // ponlo en false si NO usas cookies/sesión
};

// 1) Aplica CORS (una sola vez)
app.use(cors(corsOptions));

// 2) Fuerza headers (incluye respuestas normales)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    if (corsOptions.credentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    res.setHeader('Vary', 'Origin');
  }
  next();
});

// 3) Preflight genérico SIN ruta (evita path-to-regexp)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
      return res.sendStatus(204);
    }
    return res.sendStatus(403);
  }
  next();
});




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

app.use('/api/auth', require('./routes/auth_reset'));

app.use('/api/autocomplete', require('./routes/googleAutocomplete'));
app.use('/api/place-details', require('./routes/googlePlaceDetails'));
app.use('/api/google-billing', require('./routes/googleBilling'));


app.use('/api', require('./routes/test'));
app.use('/api/_debug', require('./routes/debugRoutes'));


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
