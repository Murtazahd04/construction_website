const ProjectModel = require('../models/projectModel');

// 1. Create Project
exports.createProject = async (req, res) => {
  try {
    // A. Role Check
    if (req.userRole !== 'Project Manager') {
      return res.status(403).json({ message: 'Only Project Managers can create projects.' });
    }

    const { project_name, budget } = req.body;

    // B. Get Company ID (Project must belong to the PM's company)
    const companyId = await ProjectModel.getCompanyIdByUser(req.userId);
    
    if (!companyId) return res.status(404).json({ message: 'Company association not found.' });

    // C. Create Project
    const projectId = await ProjectModel.create({
      project_name,
      budget, // [cite: 53]
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

// 3. Assign Contractor to Project (UPDATED)
exports.assignContractor = async (req, res) => {
  try {
    // A. Role Check
    if (req.userRole !== 'Project Manager') {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    const { project_id, contractor_id } = req.body;

    // B. Attempt Assignment
    // The Database UNIQUE constraint will block this if project is already assigned
    await ProjectModel.assignContractor(project_id, contractor_id);

    res.status(200).json({ message: 'Contractor assigned successfully.' });

  } catch (error) {
    console.error(error);
    
    // C. Handle Duplicate Entry Error (ER_DUP_ENTRY)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        message: 'This project already has a contractor assigned. You cannot assign another one.' 
      });
    }

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