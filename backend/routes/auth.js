const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { sanitizeInputs, verifyCsrfToken, generateCsrfToken } = require('../middlewares/security');

// REGISTRO DE USUARIO
router.post('/register', sanitizeInputs, generateCsrfToken, async (req, res) => {
  try {
    const { email, password } = req.body;
    const userId = await User.create(email, password);
    res.status(201).json({ id: userId, csrfToken: res.locals.csrfToken });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// LOGIN DE USUARIO
router.post('/login', sanitizeInputs, verifyCsrfToken, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const isValid = await User.verifyPassword(user, password);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // GENERA UN NUEVO TOKEN CSRF DESPUES DEL LOGIN
    generateCsrfToken(req, res, () => {
      res.json({ 
        message: 'Login exitoso',
        csrfToken: res.locals.csrfToken
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;