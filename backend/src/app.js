const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const projectRoutes = require("./routes/projectRoutes");
app.use("/api/projects", projectRoutes);
const companyRoutes = require('./routes/companyRoutes');
app.use('/api/companies', companyRoutes);
module.exports = app;
