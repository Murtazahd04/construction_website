import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/common/PrivateRoute'; // Import the guard
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
import AdminDashboard from './pages/AdminDashboard';
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
       
        <Route element={<PrivateRoute allowedRoles={['Admin']} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>
        {/* ✅ 1. ROOT: Show Landing Page first */}
        <Route path="/" element={<LandingPage />} />

        {/* ✅ 2. AUTH: Login & Sign Up Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/get-started" element={<RegisterCompany />} />

        {/* ✅ 3. DASHBOARDS: Protected Routes */}
        <Route element={<PrivateRoute allowedRoles={['Owner']} />}>
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        </Route>
        {/* 2. Project Manager Routes */}
        <Route element={<PrivateRoute allowedRoles={['Project Manager']} />}>
          <Route path="/project-manager-dashboard" element={<ProjectManagerDashboard />} />
        </Route>
        {/* 3. Contractor Routes */}
        <Route element={<PrivateRoute allowedRoles={['Contractor']} />}>
          <Route path="/contractor-dashboard" element={<ContractorDashboard />} />
        </Route>
        {/* 4. Site Engineer Routes */}
        <Route element={<PrivateRoute allowedRoles={['Site Engineer']} />}>
          { <Route path="/site-engineer-dashboard" element={<SiteEngineerDashboard />} /> }
        </Route>
        {/* 5. Supplier Routes */}
        <Route element={<PrivateRoute allowedRoles={['Supplier']} />}>
          {<Route path="/supplier-dashboard" element={<SupplierDashboard />} /> }
        </Route>

        {/* Catch-all: Redirect to Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;