const express = require('express');
const createTables = require('./createTables');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors({
  origin: [
    'http://frontlaravel.test',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://192.168.100.2:8000', // Acceso desde red local
  ],
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
const authRouter = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');

app.use('/auth', authRouter); // Ruta de autenticación pública

// Rutas protegidas con el middleware de JWT
app.use('/clientes', authMiddleware, clientesRouter);
app.use('/juegos', authMiddleware, juegosRouter);
app.use('/correos', authMiddleware, correosRouter);
app.use('/cuentas', authMiddleware, cuentasRouter);
app.use('/facturas', authMiddleware, facturasRouter);
app.use('/', authMiddleware, dashboardRouter); // Dashboard at /dashboard


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

//TODO: Verificar si la creacion de juegos valida que no exista el titulo (tolerancia del 95%)
//FIX: Los vendedores pueden crear juegos
//TODO: La eliminacion de un juego depende de si tiene cuentas asociadas (verificar si existe o no)
//TODO: Multifiltro para facturas (expandir a otros modulos de ser posible)