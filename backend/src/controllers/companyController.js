// backend/src/controllers/companyController.js
const db = require('../config/db'); // Assuming you have a db connection file here

exports.registerCompany = async (req, res) => {
  const { 
    legal_name, 
    trade_name, 
    structure, 
    establishment_year, 
    address, 
    phone, 
    email, 
    website 
  } = req.body;

  try {
    // 1. Check if email already exists
    const [existing] = await db.query('SELECT * FROM companies WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Company with this email already exists' });
    }

    // 2. Insert new company
    const sql = `
      INSERT INTO companies 
      (legal_name, trade_name, structure, establishment_year, address, phone, email, website) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await db.query(sql, [
      legal_name, 
      trade_name, 
      structure, 
      establishment_year, 
      address, 
      phone, 
      email, 
      website
    ]);

    res.status(201).json({ message: 'Company registered successfully!' });

  } catch (error) {
    console.error(error);
    console.error("Database Error:", error); // Log the actual error to console
    res.status(500).json({ message: 'Server error during registration' });
  }
};