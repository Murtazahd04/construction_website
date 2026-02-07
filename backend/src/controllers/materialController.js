const MaterialModel = require('../models/materialModel');

// 1. Create Material Request
exports.createRequest = async (req, res) => {
  try {
    if (req.userRole !== 'Site Engineer') {
      return res.status(403).json({ message: 'Only Site Engineers can request materials.' });
    }

    const { project_id, details } = req.body;

    const requestId = await MaterialModel.create({
      project_id,
      engineer_id: req.userId,
      details
    });

    res.status(201).json({ message: 'Material Request sent to Contractor.', requestId });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// 2. Get My Requests (Status Check)
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await MaterialModel.getByEngineer(req.userId);
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};