const db = require('../config/db');

class ReportModel {
  // 1. Fetch Reports with Filters (Day/Month/Year)
  static async getReports(projectId, filters) {
    let sql = `
      SELECT r.*, u.email as engineer_email 
      FROM daily_progress_reports r
      JOIN users u ON r.created_by_engineer_id = u.user_id
      WHERE r.project_id = ?
    `;
    const params = [projectId];

    // Filter Logic: Day-wise, Month-wise, Year-wise
    if (filters.period === 'day' && filters.date) {
      // Expecting filters.date as 'YYYY-MM-DD'
      sql += ' AND r.report_date = ?';
      params.push(filters.date);
    } else if (filters.period === 'month' && filters.date) {
      // Matches both Month and Year of the provided date
      sql += ' AND MONTH(r.report_date) = MONTH(?) AND YEAR(r.report_date) = YEAR(?)';
      params.push(filters.date, filters.date);
    } else if (filters.period === 'year' && filters.date) {
      // Matches only the Year
      sql += ' AND YEAR(r.report_date) = YEAR(?)';
      params.push(filters.date);
    }

    sql += ' ORDER BY r.report_date DESC';

    const [rows] = await db.execute(sql, params);
    return rows;
  }

  // 2. Create a new Daily Progress Report
  static async create(reportData) {
    const { project_id, engineer_id, report_date, content } = reportData;
    const sql = `
      INSERT INTO daily_progress_reports (project_id, created_by_engineer_id, report_date, content) 
      VALUES (?, ?, ?, ?)
    `;
    // Returns the ID of the newly created report
    const [result] = await db.execute(sql, [project_id, engineer_id, report_date, content]);
    return result.insertId;
  }
}

module.exports = ReportModel;