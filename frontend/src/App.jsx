import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Import Pages ---
import LandingPage from './pages/LandingPage'; // ✅ Import Landing Page
import Login from './pages/Login';
import RegisterCompany from './pages/RegisterCompany';

// --- Import Dashboards ---
import OwnerDashboard from './pages/dashboards/OwnerDashboard';
import ProjectManagerDashboard from './pages/dashboards/PMDashboard';
import ContractorDashboard from './pages/ContractorDashboard';
import SiteEngineerDashboard from './pages/SiteEngineerDashboard';
import SupplierDashboard from './pages/SupplierDashboard';

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Routes>
        {/* ✅ 1. ROOT: Show Landing Page first */}
        <Route path="/" element={<LandingPage />} />
        
        {/* ✅ 2. AUTH: Login & Sign Up Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/get-started" element={<RegisterCompany />} />

        {/* ✅ 3. DASHBOARDS: Protected Routes */}
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/project-manager-dashboard" element={<ProjectManagerDashboard />} />
        <Route path="/contractor-dashboard" element={<ContractorDashboard />} />
        <Route path="/site-engineer-dashboard" element={<SiteEngineerDashboard />} />
        <Route path="/supplier-dashboard" element={<SupplierDashboard />} />

        {/* Catch-all: Redirect to Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;