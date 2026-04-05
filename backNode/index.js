const express = require('express');
const createTables = require('./createTables');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors({
    origin: 'http://frontlaravel.test', // o usa '*' para permitir todos en la fase de desarrollo
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true
}));

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Rutas
const clientesRouter = require('./routes/clientes');
const juegosRouter = require('./routes/juegos');
const correosRouter = require('./routes/correos');
const cuentasRouter = require('./routes/cuentas');
const facturasRouter = require('./routes/facturas');
const dashboardRouter = require('./routes/dashboard');

app.use('/clientes', clientesRouter);
app.use('/juegos', juegosRouter);
app.use('/correos', correosRouter);
app.use('/cuentas', cuentasRouter);
app.use('/facturas', facturasRouter);
app.use('/', dashboardRouter); // Dashboard at /dashboard


// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: '¡Hola Mundo!' });
});

// Inicializar base de datos y arrancar servidor
createTables().then(() => {
  app.listen(port, () => {
    console.log(`API escuchando en el puerto ${port}`);
  });
}).catch(err => {
  console.error('Error al inicializar la base de datos:', err);
});
