const User = require("../models/User");
const validator = require("validator");

// Registro de usuario
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validaciones
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son requeridos",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Email inválido",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({
        success: false,
        message: "El nombre debe tener entre 2 y 50 caracteres",
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "El email ya está registrado",
      });
    }

    // Crear nuevo usuario
    const user = new User({ email, password, name });
    await user.save();

    // Generar token
    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error) {
    console.error("Error en registro:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "El email ya está registrado",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son requeridos",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Email inválido",
      });
    }

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Cuenta desactivada",
      });
    }

    // Verificar contraseña (maneja automáticamente los intentos)
    try {
      const isValidPassword = await user.comparePassword(password);

      if (!isValidPassword) {
        const attemptsLeft = Math.max(0, 5 - (user.loginAttempts + 1));
        return res.status(401).json({
          success: false,
          message: `Credenciales inválidas. ${attemptsLeft} intentos restantes`,
        });
      }

      // Login exitoso
      const token = user.generateAuthToken();

      res.json({
        success: true,
        message: "Login exitoso",
        data: {
          token,
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            lastLogin: new Date(),
          },
        },
      });
    } catch (lockError) {
      // Usuario bloqueado
      return res.status(423).json({
        success: false,
        message: lockError.message,
      });
    }
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// Obtener perfil del usuario
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -loginAttempts -lockUntil"
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
