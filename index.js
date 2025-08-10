require('dotenv').config(); // esto carga las variables de entorno
const express = require('express');
const cors = require('cors');
const pool = require('./config/bd_revision_casa.js');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health/db', async (req, res, next) => {
  try {
    const r = await pool.query('SELECT 1 as ok');
    res.json({ db: 'ok', result: r.rows[0] });
  } catch (e) {
    next(e);
  }
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
  } catch (e) {
    next(e);
  }
});

app.get('/', (req, res) => {
  res.send('Servidor funcionando 🧡');
});

app.get('/clientes', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM clientes');
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



const clientesRoutes = require('./routes/clientes');
app.use('/api/clientes', clientesRoutes);

const solicitudesRoutes = require('./routes/solicitudes');
app.use('/api/solicitudes', solicitudesRoutes);

const espaciosRoutes = require('./routes/espacios');
app.use('/api/espacios',espaciosRoutes)

const observacionRoutes = require('./routes/observacion');
app.use('/api/observaciones',observacionRoutes);

const fotosObservacionRoutes = require('./routes/fotosObservaciones');
app.use('/api/fotos-observacion',fotosObservacionRoutes);

const informeRoutes = require('./routes/informes');
app.use('/api/informes',informeRoutes);

const usuariosRouters = require('./routes/usuarios');
app.use('/api/usuarios', usuariosRouters);

const empresasRoutes = require('./routes/empresas');
app.use('/api/empresas', empresasRoutes);

const agendaRoutes = require('./routes/agenda');
app.use('/api/agenda', agendaRoutes);

const autocompleteRoutes = require('./routes/autocomplete');
app.use('/api/autocomplete', autocompleteRoutes);

const placeDetailsRoute = require('./routes/placeDetails');
app.use('/api/place-details', placeDetailsRoute);

app.use('/uploads', express.static('uploads'));

app.use((err, req, res, next) => {
  console.error('ERROR middleware:', err);           // <-- muestra stack completo en consola
  res.status(500).json({ error: err.message });      // <-- te devuelve el detalle real
});

app.listen(3001, () => {
    console.log('Servidor corriendo en http://localhost:3001');
  });
  