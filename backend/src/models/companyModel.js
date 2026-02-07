const db = require('../config/db');

class CompanyModel {
  // Save new company registration
  static async create(companyData) {
    const { company_name, owner_name, email, mobile_number } = companyData;
    const sql = `
      INSERT INTO company_registrations (company_name, owner_name, email, mobile_number, status) 
      VALUES (?, ?, ?, ?, 'Pending Approval')
    `;
    const [result] = await db.execute(sql, [company_name, owner_name, email, mobile_number]);
    return result.insertId;
  }

  // Find registration by ID
  static async findById(id) {
    const sql = 'SELECT * FROM company_registrations WHERE registration_id = ?';
    const [rows] = await db.execute(sql, [id]);
    return rows[0];
  }

  // Update status (e.g., to 'Approved')
  static async updateStatus(id, status) {
    const sql = 'UPDATE company_registrations SET status = ? WHERE registration_id = ?';
    await db.execute(sql, [status, id]);
  }
}

module.exports = CompanyModel;