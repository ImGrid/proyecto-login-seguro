const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email es requerido"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Email inválido"],
    },
    password: {
      type: String,
      required: [true, "Contraseña es requerida"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    name: {
      type: String,
      required: [true, "Nombre es requerido"],
      trim: true,
      maxlength: [50, "El nombre no puede exceder 50 caracteres"],
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual para verificar si la cuenta está bloqueada
userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Hash de contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas con manejo de intentos
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (this.isLocked) {
    const remainingTime = Math.ceil((this.lockUntil - Date.now()) / 1000 / 60);
    throw new Error(`Cuenta bloqueada. Intenta en ${remainingTime} minutos`);
  }

  const isMatch = await bcrypt.compare(candidatePassword, this.password);

  if (isMatch) {
    // Reset intentos fallidos si la contraseña es correcta
    if (this.loginAttempts > 0) {
      await this.updateOne({
        $unset: { loginAttempts: 1, lockUntil: 1 },
        $set: { lastLogin: new Date() },
      });
    } else {
      await this.updateOne({ lastLogin: new Date() });
    }
    return true;
  } else {
    // Incrementar intentos fallidos
    await this.incLoginAttempts();
    return false;
  }
};

// Método para incrementar intentos de login
userSchema.methods.incLoginAttempts = async function () {
  const maxAttempts = 5;
  const lockTime = 15 * 60 * 1000; // 15 minutos

  // Si ya está bloqueado y el tiempo ha expirado, reset
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Si alcanza el máximo de intentos, bloquear cuenta
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }

  return this.updateOne(updates);
};

// Método para generar JWT
userSchema.methods.generateAuthToken = function () {
  const jwt = require("jsonwebtoken");
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

module.exports = mongoose.model("User", userSchema);
