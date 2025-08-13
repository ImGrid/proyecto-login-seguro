const helmet = require('helmet');
const cors = require('cors');

const securityMiddleware = (app) => {
  // HEADERS DE SEGURIDAD CON HELMET (INCLUYE XSS PROTECTION)
  app.use(helmet());
  
  // CONFIG DE CORS
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
  }));
  
  // CONTENT SECURITY POLICY
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  }));
  
  // MIDDLEWARE DE SANITIZACION MANUAL
  app.use((req, res, next) => {
    // SANITIZA BODY
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = req.body[key].replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
      });
    }
    next();
  });
};

module.exports = securityMiddleware;