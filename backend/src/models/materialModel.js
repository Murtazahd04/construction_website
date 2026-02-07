const db = require('../config/db');

class MaterialModel {
  // 1. Create Request
  static async create(requestData) {
    const { project_id, engineer_id, details } = requestData;
    const sql = `
      INSERT INTO material_requests (project_id, created_by_engineer_id, details, status) 
      VALUES (?, ?, ?, 'Pending')
    `;
    const [result] = await db.execute(sql, [project_id, engineer_id, details]);
    return result.insertId;
  }

  // 2. Get Requests by Engineer (To check status: Pending/Approved)
  static async getByEngineer(engineerId) {
    const sql = `
      SELECT * FROM material_requests 
      WHERE created_by_engineer_id = ? 
      ORDER BY created_at DESC
    `;
    const [rows] = await db.execute(sql, [engineerId]);
    return rows;
  }
}

module.exports = MaterialModel;