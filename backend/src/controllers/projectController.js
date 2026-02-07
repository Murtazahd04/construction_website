const ProjectModel = require('../models/projectModel');

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

// 4. List Projects (Dashboard View)
exports.getMyProjects = async (req, res) => {
    try {
        const projects = await ProjectModel.getProjectsByPm(req.userId);
        res.status(200).json(projects);
    } catch (error) {
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