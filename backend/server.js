const express = require('express');
const cors = require('cors');
require('dotenv').config();

// --- Import Routes ---
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const materialRoutes = require('./src/routes/materialRoutes'); // NEW: Flow 5
const procurementRoutes = require('./src/routes/procurementRoutes');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Register Routes ---

// 1. Auth & Registration (Flow 1 & 2)
app.use('/api/auth', authRoutes);

// 2. User Management (Flow 2 & 4)
app.use('/api/users', userRoutes);

// 3. Project Management (Flow 3)
app.use('/api/projects', projectRoutes);

// 4. Reports (Flow 4 & 5) - Updated with POST
app.use('/api/reports', reportRoutes);

// 5. Material Requests (Flow 5) - NEW
app.use('/api/materials', materialRoutes);

// 6. Procurement (Flow 4 & 6)
app.use('/api/procurement', procurementRoutes);


// --- Server Startup ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});