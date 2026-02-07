const db = require('../config/db');

class UserModel {
  static async create(userData) {
    const { company_registration_id, email, password_hash, role } = userData;
    const sql = `
      INSERT INTO users (company_registration_id, email, password_hash, role) 
      VALUES (?, ?, ?, ?)
    `;
    await db.execute(sql, [company_registration_id, email, password_hash, role]);
  }
}

module.exports = UserModel;