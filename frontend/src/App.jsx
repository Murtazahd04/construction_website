import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Authentication Guard ---
import PrivateRoute from './components/common/PrivateRoute'; 

// --- Import Public Pages ---
import LandingPage from './pages/LandingPage'; 
import Login from './pages/Login';
import RegisterCompany from './pages/RegisterCompany';

// --- Import Role-Based Dashboards ---
import OwnerDashboard from './pages/dashboards/OwnerDashboard';
import ProjectManagerDashboard from './pages/dashboards/PMDashboard';
import ContractorDashboard from './pages/dashboards/ContractorDashboard';
import SiteEngineerDashboard from './pages/dashboards/SiteEngineerDashboard';
import SupplierDashboard from './pages/dashboards/SupplierDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

function App() {
  return (
    <Router>
 
     {/* Global Notification System */}
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
        theme="dark" 
      />

      <Routes>
        {/* ==============================
            PUBLIC ROUTES
            ============================== */}
        
        {/* Entry Point: Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication: User Login */}
        <Route path="/login" element={<Login />} />

        {/* Onboarding: Company Registration */}
        <Route path="/get-started" element={<RegisterCompany />} />

        {/* ==============================
            PROTECTED DASHBOARD ROUTES
            ============================== */}

        {/* System Administrator Dashboard */}
        <Route element={<PrivateRoute allowedRoles={['Admin']} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Corporate Owner Dashboard */}
        <Route element={<PrivateRoute allowedRoles={['Owner']} />}>
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        </Route>

        {/* Project Manager Dashboard */}
        <Route element={<PrivateRoute allowedRoles={['Project Manager']} />}>
          <Route path="/project-manager-dashboard" element={<ProjectManagerDashboard />} />
        </Route>

        {/* Contractor Operations Dashboard */}
        <Route element={<PrivateRoute allowedRoles={['Contractor']} />}>
          <Route path="/contractor-dashboard" element={<ContractorDashboard />} />
        </Route>

        {/* Field / Site Engineer Dashboard */}
        <Route element={<PrivateRoute allowedRoles={['Site Engineer']} />}>
          <Route path="/site-engineer-dashboard" element={<SiteEngineerDashboard />} />
        </Route>

        {/* Supplier / Vendor Dashboard */}
        <Route element={<PrivateRoute allowedRoles={['Supplier']} />}>
          <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
        </Route>

        {/* ==============================
            FALLBACK ROUTE
            ============================== */}
        
        {/* Wildcard: Any undefined route redirects to Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;