const bcrypt = require('bcryptjs'); // You will need: npm install bcryptjs
const CompanyModel = require('../models/companyModel');
const UserModel = require('../models/userModel');
const db = require('../config/db'); // Access direct DB for login query
const jwt = require('jsonwebtoken');
// 1. Handle "Get Started" - Company Registration
exports.registerCompany = async (req, res) => {
  try {
    const { company_name, owner_name, email, mobile_number } = req.body;

    // Validation (Basic)
    if (!company_name || !owner_name || !email || !mobile_number) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    

    const registrationId = await CompanyModel.create(req.body);
    
    res.status(201).json({ 
      message: 'Registration submitted successfully. Status: Pending Approval', 
      registrationId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// 2. Handle Admin Approval
exports.approveCompany = async (req, res) => {
  try {
    const { registrationId } = req.body; // Admin sends the ID to approve

    // A. Check if company exists
    const company = await CompanyModel.findById(registrationId);
    if (!company) {
      return res.status(404).json({ message: 'Company registration not found' });
    }

    // B. Update status to Approved
    await CompanyModel.updateStatus(registrationId, 'Approved');

    // C. Auto-generate Owner Credentials
    const tempPassword = 'Owner@' + Math.floor(1000 + Math.random() * 9000); // Simple random password
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // D. Create the Owner User in the User Table
    await UserModel.create({
      company_registration_id: registrationId,
      email: company.email,
      password_hash: hashedPassword,
      role: 'Owner'
    });

    // In a real app, you would send an email here using a service like Nodemailer
    // emailService.send(company.email, tempPassword);

    res.status(200).json({ 
      message: 'Company Approved. Owner credentials generated.',
      temp_credentials: { email: company.email, password: tempPassword } // Returning here for testing purposes
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


// 3. Handle Login (Common for All Roles)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // A. Check if user exists
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // B. Verify Password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // C. Generate Token (Session)
    const token = jwt.sign(
      { id: user.user_id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // D. Return Role for Frontend Redirection
    // The frontend will use 'role' to redirect to "/owner-dashboard" or "/contractor-dashboard"
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.user_id,
        email: user.email,
        role: user.role, // Essential for Dashboard Access 
        specialization: user.contractor_specialization // Relevant for Contractors
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};