import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; // Your provided Landing Page
import RegisterCompany from './pages/RegisterCompany';
import Login from './pages/Login';
import OwnerDashboard from './pages/dashboards/OwnerDashboard';

// Placeholder Components for future flows
const PMDashboard = () => <div>Project Manager Dashboard (Coming Soon)</div>;
const ContractorDashboard = () => <div>Contractor Dashboard (Coming Soon)</div>;
const SiteEngineerDashboard = () => <div>Site Engineer Dashboard (Coming Soon)</div>;
const SupplierDashboard = () => <div>Supplier Dashboard (Coming Soon)</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterCompany />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Dashboard Routes */}
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