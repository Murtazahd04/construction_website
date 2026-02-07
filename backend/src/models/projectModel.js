const db = require('../config/db');

class ProjectModel {
  
  // 1. Create a new Project
  static async create(projectData) {
    const { project_name, budget,location, 
    project_type, 
    start_date, 
    end_date, created_by_pm_id, company_id } = projectData;
    const sql = `
      INSERT INTO projects (project_name, budget,location, project_type, start_date, end_date, created_by_pm_id, company_id) 
      VALUES (?, ?, ?, ?,?,?,?,?)
    `;
    const [result] = await db.execute(sql, [project_name, budget, location, project_type, start_date, end_date,created_by_pm_id, company_id]);
    return result.insertId;
  }

  // 2. Assign a Contractor to a Project
  static async assignContractor(projectId, contractorId) {
    const sql = `
      INSERT INTO project_assignments (project_id, contractor_id) 
      VALUES (?, ?)
    `;
    await db.execute(sql, [projectId, contractorId]);
  }

  // 3. Helper: Find Company ID associated with a Project Manager
  static async getCompanyIdByUser(userId) {
    const sql = 'SELECT company_registration_id FROM users WHERE user_id = ?';
    const [rows] = await db.execute(sql, [userId]);
    return rows[0] ? rows[0].company_registration_id : null;
  }

  // 4. Get all Contractors for a specific Company (for the assignment dropdown)
  static async getContractorsByCompany(companyId) {
    const sql = `
      SELECT user_id, email, contractor_specialization 
      FROM users 
      WHERE company_registration_id = ? AND role = 'Contractor'
    `;
    const [rows] = await db.execute(sql, [companyId]);
    return rows;
  }
    
  // 5. Get Projects created by this PM
  static async getProjectsByPm(pmId) {
      const sql = 'SELECT * FROM projects WHERE created_by_pm_id = ?';
      const [rows] = await db.execute(sql, [pmId]);
      return rows;
  }

  // Add this method inside the ProjectModel class
static async getProjectsByCompany(companyId) {
  const sql = 'SELECT * FROM projects WHERE company_id = ? ORDER BY created_at DESC';
  const [rows] = await db.execute(sql, [companyId]);
  return rows;
}
// Add inside ProjectModel class
static async getAssignedContractorsByProject(projectId) {
  const sql = `
    SELECT u.user_id, u.email, u.contractor_specialization, pa.assigned_at
    FROM users u
    JOIN project_assignments pa ON u.user_id = pa.contractor_id
    WHERE pa.project_id = ?
  `;
  const [rows] = await db.execute(sql, [projectId]);
  return rows;
}
}

module.exports = ProjectModel;