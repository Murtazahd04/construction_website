import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterCompany from './pages/RegisterCompany';
import Login from './pages/Login';
import OwnerDashboard from './pages/dashboards/OwnerDashboard';
import PMDashboard from './pages/dashboards/PMDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Placeholder Components
const ContractorDashboard = () => <div>Contractor Dashboard (Coming Soon)</div>;
const SiteEngineerDashboard = () => <div>Site Engineer Dashboard (Coming Soon)</div>;
const SupplierDashboard = () => <div>Supplier Dashboard (Coming Soon)</div>;

function App() {
  return (
    <Router>
      {/* ✅ ToastContainer goes HERE */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterCompany />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboards */}
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/pm-dashboard" element={<PMDashboard />} />
        <Route path="/contractor-dashboard" element={<ContractorDashboard />} />
        <Route path="/site-engineer-dashboard" element={<SiteEngineerDashboard />} />
        <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
