const express = require("express");
const cors = require("cors");
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes'); // Import
const app = express();

app.use(cors());
app.use(express.json());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // Register
app.use('/api/projects', projectRoutes); // Register
const projectRoutes = require("./routes/projectRoutes");
app.use("/api/projects", projectRoutes);
const companyRoutes = require('./routes/companyRoutes');
app.use('/api/companies', companyRoutes);
module.exports = app;
