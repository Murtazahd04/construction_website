const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Unified function to create sub-users based on the creator's role
exports.createSubUser = async (req, res) => {
  try {
    const { email, role, specialization } = req.body;
    const creatorRole = req.userRole; // Extracted from the JWT middleware

    // 1. Permission Check Matrix
    // Defines who is allowed to create whom
    const allowed = {
      'Owner': ['Project Manager', 'Contractor'],
      'Contractor': ['Site Engineer', 'Supplier']
    };

    // If the creator's role isn't in the list OR they are trying to create a restricted role
    if (!allowed[creatorRole] || (allowed[creatorRole] && !allowed[creatorRole].includes(role))) {
      return res.status(403).json({ 
        message: `Access Denied. ${creatorRole} cannot create ${role}.` 
      });
    }

    // 2. Role-Based Password Generation
    // Logic: Remove spaces, make lowercase, and append "123"
    // Example: "Project Manager" -> "projectmanager123"
    const prefix = role.replace(/\s+/g, '').toLowerCase(); 
    const tempPassword = `${prefix}123`;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 3. Get the Company ID of the Creator 
    // (The new user must belong to the same company as the person creating them)
    // We first need to find the user to get their company_registration_id
    const [creatorRows] = await db.execute(
      'SELECT company_registration_id FROM users WHERE user_id = ?', 
      [req.userId]
    );

    if (creatorRows.length === 0) {
      return res.status(404).json({ message: 'Creator user not found.' });
    }

    const companyId = creatorRows[0].company_registration_id;

    // 4. Insert the new User into the database
    // Ensure column names match your database schema (e.g., password_hash or password)
    const sql = `
      INSERT INTO users (company_registration_id, email, password_hash, role, contractor_specialization, created_by_user_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    // Note: 'specialization' is optional (mostly for Contractors), so we pass 'specialization || null'
    await db.execute(sql, [companyId, email, hashedPassword, role, specialization || null, req.userId]);

    // 5. Success Response
    res.status(201).json({ 
      message: `${role} created successfully.`,
      credentials: { email, password: tempPassword } // Return credentials to share with the new user
    });

  } catch (error) {
    console.error('Error creating sub-user:', error);
    
    // Handle duplicate email error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};