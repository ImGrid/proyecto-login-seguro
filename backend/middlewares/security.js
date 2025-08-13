const { body, validationResult } = require('express-validator');
const csrf = require('csrf');
const tokens = new csrf();

// VALIDACION DE LOS INPUTS
const sanitizeInputs = [
  body('email').isEmail().normalizeEmail(),
  body('password').trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// GENERA EL TOKEN CSRF
const generateCsrfToken = (req, res, next) => {
  const secret = tokens.secretSync();
  const token = tokens.create(secret);
  
  req.session.csrfSecret = secret;
  res.locals.csrfToken = token;
  next();
};

// VERIFICA EL TOKEN CSRF
const verifyCsrfToken = (req, res, next) => {
  const token = req.body._csrf || req.headers['x-csrf-token'];
  const secret = req.session.csrfSecret;
  
  if (!tokens.verify(secret, token)) {
    return res.status(403).json({ error: 'Token CSRF inválido' });
  }
  
  next();
};

module.exports = {
  sanitizeInputs,
  generateCsrfToken,
  verifyCsrfToken
};