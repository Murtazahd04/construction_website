const express = require('express');
const cors = require('cors'); // Middleware to allow frontend communication
require('dotenv').config(); // Loads environment variables

// Import Routes
// Ensure these paths match your actual folder structure (e.g., ./src/routes/...)
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const procurementRoutes = require('./src/routes/procurementRoutes');

// If you have a separate companyRoutes file, import it here. 
// If company registration is handled inside authRoutes, you can comment this out.
// const companyRoutes = require('./src/routes/companyRoutes'); 

const app = express();

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// --- Route Registration ---
// 1. Auth & Registration (Flow 1 & 2)
app.use('/api/auth', authRoutes);

// 2. User Management (Flow 2 & 4)
app.use('/api/users', userRoutes);

// 3. Project Management (Flow 3)
app.use('/api/projects', projectRoutes);

// 4. Reports (Flow 4 & 5)
app.use('/api/reports', reportRoutes);

// 5. Procurement: POs & Invoices (Flow 4 & 6)
app.use('/api/procurement', procurementRoutes);

// 6. Companies (Optional/Extra)
// app.use('/api/companies', companyRoutes);

// --- Server Startup ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});