import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// ✅ FIXED IMPORT: Changed clearUserStatus -> clearUserState
import { createSubUser, clearUserState } from '../features/users/userSlice';
import { fetchSuppliers, createPO } from '../features/procurement/procurementSlice';
import { fetchMyProjects } from '../features/projects/projectSlice';
import { fetchReports } from '../features/operations/operationSlice';

const ContractorDashboard = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const [activeTab, setActiveTab] = useState('team');

  // --- State for User Creation ---
  const [newUser, setNewUser] = useState({ email: '', role: 'Site Engineer' });
  const userStatus = useSelector((state) => state.users);

  // --- State for Reports ---
  const [reportFilter, setReportFilter] = useState({ period: 'month', date: '' });
  const reports = useSelector((state) => state.operations.reports || []);

  // --- State for Procurement ---
  const [poData, setPoData] = useState({ supplier_id: '', details: '' });
  const { suppliers, message: poMessage } = useSelector((state) => state.procurement);
  
  // --- State for Project Selector ---
  const myProjects = useSelector((state) => state.projects.list);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  // Load Projects on mount
  useEffect(() => {
    if (token) {
      dispatch(fetchMyProjects(token));
    }
  }, [dispatch, token]);

  // Load Suppliers when Procurement tab opens
  useEffect(() => {
    if (activeTab === 'procurement') {
      dispatch(fetchSuppliers(token));
    }
  }, [activeTab, dispatch, token]);

  // --- Handlers ---

  const handleCreateUser = (e) => {
    e.preventDefault();
    dispatch(createSubUser({ data: newUser, token }));
  };

  // ✅ Clear status when switching tabs or closing
  useEffect(() => {
    if (userStatus.status === 'succeeded' || userStatus.status === 'failed') {
      const timer = setTimeout(() => {
        dispatch(clearUserState()); // ✅ UPDATED FUNCTION NAME
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [userStatus.status, dispatch]);

  const handleFetchReports = (e) => {
    e.preventDefault();
    if (!selectedProjectId) {
      alert("Please select a project first!");
      return;
    }
    dispatch(fetchReports({ projectId: selectedProjectId, ...reportFilter, token }));
  };

  const handleCreatePO = (e) => {
    e.preventDefault();
    dispatch(createPO({ data: poData, token }));
  };

  return (
    <div className="dashboard-container" style={{ padding: '20px' }}>
      <h1>Contractor Dashboard</h1>

      {/* PROJECT SELECTOR */}
      <div style={{ marginBottom: '20px', padding: '10px', background: '#eef', border: '1px solid #ccc' }}>
        <strong>Working on Project: </strong>
        <select 
          value={selectedProjectId} 
          onChange={(e) => setSelectedProjectId(e.target.value)}
          style={{ padding: '5px', marginLeft: '10px' }}
        >
          <option value="">-- Select Assigned Project --</option>
          {myProjects.map((p) => (
            <option key={p.project_id} value={p.project_id}>
              {p.name} (ID: {p.project_id})
            </option>
          ))}
        </select>
      </div>

      {/* Navigation Tabs */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('team')} style={{ marginRight: '10px' }}>Manage Team</button>
        <button onClick={() => setActiveTab('reports')} style={{ marginRight: '10px' }}>View Reports</button>
        <button onClick={() => setActiveTab('procurement')}>Procurement (PO)</button>
      </div>

      <hr />

      {/* 1. Manage Team Tab */}
      {activeTab === 'team' && (
        <div className="card">
          <h3>Create New User</h3>
          <form onSubmit={handleCreateUser}>
            <select 
              value={newUser.role} 
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="Site Engineer">Site Engineer</option>
              <option value="Supplier">Supplier</option>
            </select>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required 
            />
            <button type="submit">Create User</button>
          </form>
          {userStatus.status === 'succeeded' && (
            <div style={{ color: 'green', marginTop: '10px' }}>
              <p>{userStatus.message}</p>
              {userStatus.createdCredentials && (
                <p><strong>Temp Password:</strong> {userStatus.createdCredentials.password}</p>
              )}
            </div>
          )}
          {userStatus.status === 'failed' && <p style={{ color: 'red' }}>{userStatus.error}</p>}
        </div>
      )}

      {/* 2. View Reports Tab */}
      {activeTab === 'reports' && (
        <div className="card">
          <h3>Project Daily Reports</h3>
          <form onSubmit={handleFetchReports}>
            <select value={reportFilter.period} onChange={(e) => setReportFilter({ ...reportFilter, period: e.target.value })}>
              <option value="day">Specific Day</option>
              <option value="month">Month-wise</option>
              <option value="year">Year-wise</option>
            </select>
            <input 
              type="date" 
              value={reportFilter.date}
              onChange={(e) => setReportFilter({ ...reportFilter, date: e.target.value })}
              required
            />
            <button type="submit">Fetch Reports</button>
          </form>

          <div className="report-list" style={{ marginTop: '20px' }}>
            {reports.length === 0 ? <p>No reports found.</p> : reports.map((r) => (
              <div key={r.report_id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
                <strong>Date: {new Date(r.report_date).toLocaleDateString()}</strong> <br />
                <small>Engineer: {r.engineer_email}</small>
                <p>{r.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Procurement Tab */}
      {activeTab === 'procurement' && (
        <div className="card">
          <h3>Create Purchase Order</h3>
          <form onSubmit={handleCreatePO}>
            <select 
              value={poData.supplier_id} 
              onChange={(e) => setPoData({ ...poData, supplier_id: e.target.value })}
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map((s) => (
                <option key={s.user_id} value={s.user_id}>{s.email}</option>
              ))}
            </select>
            
            <textarea 
              placeholder="Order Details (Items, Quantity, etc.)" 
              value={poData.details}
              onChange={(e) => setPoData({ ...poData, details: e.target.value })}
              required
              style={{ display: 'block', width: '100%', margin: '10px 0', height: '80px' }}
            />
            
            <button type="submit">Send Order</button>
          </form>
          {poMessage && <p style={{ color: 'green' }}>{poMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default ContractorDashboard;