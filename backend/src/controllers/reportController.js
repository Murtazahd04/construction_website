const ReportModel = require('../models/reportModel');

// 1. Get Project Reports (with optional Day/Month/Year filters)
exports.getProjectReports = async (req, res) => {
  try {
    const { project_id, period, date } = req.query; 
    // Usage: GET /api/reports?project_id=1&period=month&date=2023-10-01

    if (!project_id) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    // (Optional: You can add logic here to verify if the requesting Contractor/PM 
    // is actually assigned to this project_id before showing data)

    const reports = await ReportModel.getReports(project_id, { period, date });
    res.status(200).json(reports);

  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// 2. Create Daily Progress Report
exports.createReport = async (req, res) => {
  try {
    // A. Role Check: Strict validation
    if (req.userRole !== 'Site Engineer') {
      return res.status(403).json({ message: 'Access Denied. Only Site Engineers can submit reports.' });
    }

    const { project_id, report_date, content } = req.body;

    // B. Basic Validation
    if (!project_id || !report_date || !content) {
      return res.status(400).json({ message: 'Missing required fields: project_id, report_date, or content.' });
    }

    // C. Create the Report
    const reportId = await ReportModel.create({
      project_id,
      engineer_id: req.userId, // Taken from the authenticated token
      report_date,
      content
    });

    res.status(201).json({ 
      message: 'Daily Report submitted successfully.', 
      reportId 
    });

  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};