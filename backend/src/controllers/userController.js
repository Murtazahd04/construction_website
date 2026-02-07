const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Owner creates Project Manager or Contractor
exports.createSubUser = async (req, res) => {
  try {
    // 1. Verify if the requester is an Owner
    if (req.userRole !== 'Owner') {
      return res.status(403).json({ message: 'Access Denied. Only Owners can create users.' });
    }

    const { email, role, specialization } = req.body; 
    // Role must be 'Project Manager' or 'Contractor' [cite: 39, 40]

    // 2. Auto-generate password [cite: 41]
    const tempPassword = 'User@' + Math.floor(1000 + Math.random() * 9000);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 3. Get the Company ID of the Owner (to link the new user to the same company)
    const [ownerRows] = await db.execute('SELECT company_registration_id FROM users WHERE user_id = ?', [req.userId]);
    const companyId = ownerRows[0].company_registration_id;

    // 4. Insert the new User
    // note: created_by_user_id is set to the Owner's ID (req.userId)
    const sql = `
      INSERT INTO users (company_registration_id, email, password_hash, role, contractor_specialization, created_by_user_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    await db.execute(sql, [companyId, email, hashedPassword, role, specialization || null, req.userId]);

    res.status(201).json({ 
      message: `${role} created successfully.`,
      credentials: { email, password: tempPassword } // Return credentials to share with the new user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};