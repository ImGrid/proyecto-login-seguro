const express = require('express');
const session = require('express-session');
const securityMiddleware = require('./config/security');
const authRoutes = require('./routes/auth');
const db = require('./config/db');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CONFIG DE SESION (ESTO ES NECESARIO PARA EL CSRF)
app.use(session({
  secret: process.env.SESSION_SECRET || 'tu_secreto_super_seguro',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict'
  }
}));

// MIDDLEWARES DE SEGURIDAD
securityMiddleware(app);

// RUTAS
app.use('/api/auth', authRoutes);

// RUTA PARA OBTENER TOKEN CSRF
app.get('/api/csrf-token', (req, res) => {
  const secret = tokens.secretSync();
  const token = tokens.create(secret);
  
  req.session.csrfSecret = secret;
  res.json({ csrfToken: token });
});

// MANEJO DE ERRORES
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salio mal!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});