const bcrypt = require('bcryptjs');
const db = require('../config/db');

class User {
  static async create(email, password) {
    const passwordHash = await bcrypt.hash(password, 12);
    
    const stmt = db.prepare(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)'
    );
    
    try {
      const result = await stmt.run([email, passwordHash]);
      return result.lastID;
    } catch (err) {
      throw new Error('Error al crear usuario: ' + err.message);
    }
  }

  static async findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = await stmt.get([email]);
    return user;
  }

  static async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password_hash);
  }
}

module.exports = User;