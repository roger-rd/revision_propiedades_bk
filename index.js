require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/bd_revision_casa.js');
const { initRecordatorios } = require("./jobs/recordatorios");

const app = express();

app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true,
}));

app.use(express.json());

// Log simple de requests (útil para ver el 201 del POST)
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode}`);
  });
  next();
});

// Healthchecks
app.get('/health/db', async (req, res, next) => {
  try {
    const r = await pool.query('SELECT 1 as ok');
    res.json({ db: 'ok', result: r.rows[0] });
  } catch (e) { next(e); }
});
app.get('/health/schema', async (req, res, next) => {
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
  } catch (e) { next(e); }
});

app.get('/', (req, res) => res.send('Servidor funcionando 🧡'));

// Ruta demo (ok si la quieres mantener)
app.get('/clientes', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM clientes');
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/solicitudes', require('./routes/solicitudes'));
app.use('/api/espacios', require('./routes/espacios'));
app.use('/api/observaciones', require('./routes/observacion'));
app.use('/api/fotos-observacion', require('./routes/fotosObservaciones'));
app.use('/api/informes', require('./routes/informes'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/empresas', require('./routes/empresas'));
app.use('/api/agenda', require('./routes/agenda')); // <-- SOLO esta línea (sin duplicar)
app.use('/api/autocomplete', require('./routes/autocomplete'));
app.use('/api/place-details', require('./routes/placeDetails'));
app.use('/uploads', express.static('uploads'));

// Jobs
initRecordatorios();

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('ERROR middleware:', err);
  res.status(500).json({ error: err.message });
});

app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});
