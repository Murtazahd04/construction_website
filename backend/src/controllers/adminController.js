const db = require('../config/db');
const bcrypt = require('bcryptjs');
const CompanyModel = require('../models/companyModel');
const UserModel = require('../models/userModel');

// 1. Get Pending Registrations
exports.getPendingRegistrations = async (req, res) => {
  try {
    // ✅ FIX: Changed 'Pending' to 'Pending Approval' to match your database
    const sql = "SELECT * FROM company_registrations WHERE status = 'Pending Approval'";
    
    const [rows] = await db.execute(sql);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// 2. Approve Company (Generates User)
exports.approveCompany = async (req, res) => {
  try {
    const { id } = req.params;

    // A. Check Registration
    const company = await CompanyModel.findById(id);
    if (!company) return res.status(404).json({ message: 'Registration not found' });

    // B. Update Status to 'Approved'
    await CompanyModel.updateStatus(id, 'Approved');

    // C. Generate Credentials
    const tempPassword = 'Owner@' + Math.floor(1000 + Math.random() * 9000);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // D. Create User (Role: Owner)
    await UserModel.create({
      company_registration_id: id,
      email: company.email,
      password_hash: hashedPassword,
      role: 'Owner' 
    });

    res.status(200).json({ 
      message: 'Company Approved & User Created',
      credentials: { email: company.email, password: tempPassword } 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// 3. Reject Company
exports.rejectCompany = async (req, res) => {
  try {
    const { id } = req.params;
    // Update status to 'Rejected'
    await CompanyModel.updateStatus(id, 'Rejected');
    res.status(200).json({ message: 'Company Rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};