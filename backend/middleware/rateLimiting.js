const rateLimit = require("express-rate-limit");

// Rate limiting para registro de usuarios
const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // máximo 5 registros por hora por IP
  message: {
    success: false,
    message: "Demasiados intentos de registro. Intenta en 1 hora.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting para login (más estricto)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 intentos por 15 minutos por IP
  message: {
    success: false,
    message: "Demasiados intentos de login. Intenta en 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting general para la API
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por 15 minutos por IP
  message: {
    success: false,
    message: "Demasiadas peticiones. Intenta más tarde.",
  },
});

module.exports = {
  createAccountLimiter,
  loginLimiter,
  generalLimiter,
};
