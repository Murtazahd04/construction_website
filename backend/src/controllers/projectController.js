const ProjectModel = require('../models/projectModel');
const db = require('../config/db'); // Import DB to fetch parent user
// Inside src/controllers/projectController.js

exports.createProject = async (req, res) => {
  try {
    if (req.userRole !== 'Project Manager') {
      return res.status(403).json({ message: 'Only Project Managers can create projects.' });
    }

    // 1. Destructure new fields
    const { project_name, budget, location, project_type, start_date, end_date } = req.body;

    const companyId = await ProjectModel.getCompanyIdByUser(req.userId);
    if (!companyId) return res.status(404).json({ message: 'Company association not found.' });

    // 2. Pass new fields to Model
    const projectId = await ProjectModel.create({
      project_name,
      budget,
      location,       // New
      project_type,   // New
      start_date,     // New
      end_date,       // New
      created_by_pm_id: req.userId,
      company_id: companyId
    });

    res.status(201).json({ message: 'Project created successfully', projectId });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// 2. Get Available Contractors (To populate the "Assign Contractor" dropdown)
exports.getAvailableContractors = async (req, res) => {
  try {
    const companyId = await ProjectModel.getCompanyIdByUser(req.userId);
    const contractors = await ProjectModel.getContractorsByCompany(companyId);
    res.status(200).json(contractors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// 3. Assign Contractor to Project (REVERTED)
exports.assignContractor = async (req, res) => {
  try {
    // A. Role Check
    if (req.userRole !== 'Project Manager') {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    const { project_id, contractor_id } = req.body;

    // B. Check if THIS specific contractor is already assigned to THIS project
    // (Optional but good practice to prevent assigning the SAME contractor twice)
    // You would need a new method in ProjectModel like 'checkAssignment(projectId, contractorId)'
    // For now, we will rely on the database allowing multiple rows.

    await ProjectModel.assignContractor(project_id, contractor_id);

    res.status(200).json({ message: 'Contractor assigned successfully.' });

  } catch (error) {
    console.error(error);
    // We removed the specific check for ER_DUP_ENTRY regarding the project_id
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Inside src/controllers/projectController.js
// Inside src/controllers/projectController.js

exports.getMyProjects = async (req, res) => {
  try {
    let projects = [];

    // Case 1: Project Manager (See projects they created)
    if (req.userRole === 'Project Manager') {
      projects = await ProjectModel.getProjectsByPm(req.userId);
    } 
    // Case 2: Contractor (See projects ASSIGNED to them)
    else if (req.userRole === 'Contractor') {
      projects = await ProjectModel.getAssignedProjectsByContractor(req.userId);
    }
    // Case 3: Owner (See all company projects)
    else if (req.userRole === 'Owner') {
      const companyId = await ProjectModel.getCompanyIdByUser(req.userId);
      projects = await ProjectModel.getProjectsByCompany(companyId);
    }
    // Case 4: Site Engineer (See projects assigned to their Contractor)
    else if (req.userRole === 'Site Engineer') {
      // 1. Find the Contractor who created this Site Engineer
      const sql = 'SELECT created_by_user_id FROM users WHERE user_id = ?';
      const [rows] = await db.execute(sql, [req.userId]);
      
      if (rows.length > 0) {
        const parentContractorId = rows[0].created_by_user_id;
        
        // 2. Fetch projects assigned to that Parent Contractor
        // (We reuse the existing method for contractors)
        projects = await ProjectModel.getAssignedProjectsByContractor(parentContractorId);
      }
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error in getMyProjects:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};
// Add this new function
exports.getOwnerProjects = async (req, res) => {
  try {
    // 1. Verify Role
    if (req.userRole !== 'Owner') {
      return res.status(403).json({ message: 'Access Denied' });
    }

    // 2. Get Owner's Company ID
    const companyId = await ProjectModel.getCompanyIdByUser(req.userId);
    if (!companyId) return res.status(404).json({ message: 'Company not found' });

    // 3. Fetch All Projects for this Company
    const projects = await ProjectModel.getProjectsByCompany(companyId);
    
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add this new function
exports.getProjectTeam = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Optional: Add check to ensure this PM owns this project
    
    const team = await ProjectModel.getAssignedContractorsByProject(projectId);
    res.status(200).json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};