import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSubUser, clearUserState } from '../features/users/userSlice';
import { fetchSuppliers, createPO } from '../features/procurement/procurementSlice';
import { fetchMyProjects } from '../features/projects/projectSlice';
import { fetchReports } from '../features/operations/operationSlice';
import { logout } from '../features/auth/authSlice';
import { fetchProjectRequests } from '../features/materials/materialSlice'; 

// Icons (Optional fallback if lucide-react is missing, simply remove icon prop)
import { ClipboardList, LogOut, Users, FileText, Package } from 'lucide-react';

const ContractorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Navigation State
  const [activeTab, setActiveTab] = useState('team');

  // --- Redux State Selectors ---
  const userStatus = useSelector((state) => state.users);
  const reports = useSelector((state) => state.operations.reports || []);
  const { suppliers, message: poMessage } = useSelector((state) => state.procurement);
  const myProjects = useSelector((state) => state.projects.list);
  
  // Get requests from material slice
  const { requests } = useSelector((state) => state.materials);

  // --- Local Forms State ---
  const [newUser, setNewUser] = useState({ email: '', role: 'Site Engineer' });
  const [reportFilter, setReportFilter] = useState({ period: 'month', date: '' });
  const [poData, setPoData] = useState({ supplier_id: '', details: '' });
  const [selectedProjectId, setSelectedProjectId] = useState('');

  // --- Effects ---

  // 1. Load Projects on Mount
  useEffect(() => {
    if (token) {
      dispatch(fetchMyProjects(token));
    } else {
      navigate('/'); // Redirect if no token
    }
  }, [dispatch, token, navigate]);

  // 2. Load Suppliers when entering Procurement
  useEffect(() => {
    if (activeTab === 'procurement') dispatch(fetchSuppliers(token));
  }, [activeTab, dispatch, token]);

  // 3. Load Requests when entering Requests tab OR changing Project
  useEffect(() => {
    if (activeTab === 'requests' && selectedProjectId) {
        dispatch(fetchProjectRequests({ projectId: selectedProjectId, token }));
    }
  }, [activeTab, selectedProjectId, dispatch, token]);

  // 4. Auto-clear User Creation Status messages
  useEffect(() => {
    if (userStatus.status === 'succeeded' || userStatus.status === 'failed') {
      const timer = setTimeout(() => dispatch(clearUserState()), 5000);
      return () => clearTimeout(timer);
    }
  }, [userStatus.status, dispatch]);

  // --- Handlers ---

  const handleCreateUser = (e) => {
    e.preventDefault();
    dispatch(createSubUser({ data: newUser, token }));
  };

  const handleFetchReports = (e) => {
    e.preventDefault();
    if (!selectedProjectId) return alert("Please select a project first!");
    dispatch(fetchReports({ projectId: selectedProjectId, ...reportFilter, token }));
  };

  const handleCreatePO = (e) => {
    e.preventDefault();
    dispatch(createPO({ data: poData, token }));
  };

  const handleLogout = () => {
    dispatch(logout()); 
    navigate('/');      
  };

  // Helper to render Sidebar Menu Items
  const renderMenuItem = (id, label, icon) => (
    <div 
      style={{
        ...styles.menuItem,
        backgroundColor: activeTab === id ? '#34495e' : 'transparent',
        borderLeft: activeTab === id ? '4px solid #3498db' : '4px solid transparent'
      }}
      onClick={() => setActiveTab(id)}
    >
      <span style={{ marginRight: '10px' }}>{icon}</span>
      {label}
    </div>
  );

  return (
    <div style={styles.container}>
      {/* 🟢 SIDEBAR */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Contractor Panel</h2>
        <div style={styles.menu}>
          {renderMenuItem('team', 'Manage Team', '👥')}
          {renderMenuItem('reports', 'View Reports', '📊')}
          {renderMenuItem('procurement', 'Procurement', '📦')}
          {renderMenuItem('requests', 'Material Requests', '🧱')}
          
          <div 
            style={{ ...styles.menuItem, marginTop: '50px', borderTop: '1px solid #34495e', color: '#e74c3c' }} 
            onClick={handleLogout}
          >
            <span style={{ marginRight: '10px' }}>🚪</span>
            Logout
          </div>
        </div>
      </div>

      {/* 🟢 MAIN CONTENT AREA */}
      <div style={styles.mainContent}>
        
        {/* Header & Project Selector */}
        <div style={styles.header}>
          <h2 style={{ margin: 0 }}>Dashboard</h2>
          <div style={styles.projectSelector}>
            <strong>Current Project:</strong>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              style={styles.selectInput}
            >
              <option value="">-- Select Project --</option>
              {myProjects.map((project) => (
                <option key={project.project_id} value={project.project_id}>
                  {project.name || project.project_name || `Project #${project.project_id}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Content Body */}
        <div style={styles.contentBody}>
          
          {/* TAB: MANAGE TEAM */}
          {activeTab === 'team' && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Create New User</h3>
              <p style={{ color: '#666', marginBottom: '15px' }}>
                Add Site Engineers or Suppliers to your team.
              </p>
              <form onSubmit={handleCreateUser} style={styles.form}>
                <div style={styles.formGroup}>
                  <label>Role</label>
                  <select
                    style={styles.input}
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="Site Engineer">Site Engineer</option>
                    <option value="Supplier">Supplier</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    style={styles.input}
                    placeholder="user@example.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" style={styles.button}>Create User</button>
              </form>

              {userStatus.status === 'succeeded' && (
                <div style={styles.successBox}>
                  <strong>Success:</strong> {userStatus.message}
                  {userStatus.createdCredentials && (
                    <div style={{ marginTop: '5px' }}>
                      Temp Password: <strong>{userStatus.createdCredentials.password}</strong>
                    </div>
                  )}
                </div>
              )}
              {userStatus.status === 'failed' && <div style={styles.errorBox}>{userStatus.error}</div>}
            </div>
          )}

          {/* TAB: VIEW REPORTS */}
          {activeTab === 'reports' && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Daily Progress Reports</h3>
              <form onSubmit={handleFetchReports} style={styles.inlineForm}>
                <select 
                  style={styles.input} 
                  value={reportFilter.period} 
                  onChange={(e) => setReportFilter({ ...reportFilter, period: e.target.value })}
                >
                  <option value="day">Specific Day</option>
                  <option value="month">Month-wise</option>
                  <option value="year">Year-wise</option>
                </select>
                <input
                  type="date"
                  style={styles.input}
                  value={reportFilter.date}
                  onChange={(e) => setReportFilter({ ...reportFilter, date: e.target.value })}
                  required
                />
                <button type="submit" style={styles.button}>Fetch Reports</button>
              </form>

              <div style={{ marginTop: '20px' }}>
                {reports.length === 0 ? (
                  <p style={{ color: '#7f8c8d' }}>No reports found for selected criteria.</p>
                ) : (
                  reports.map((r) => (
                    <div key={r.report_id} style={styles.reportItem}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <strong>📅 {new Date(r.report_date).toLocaleDateString()}</strong>
                        <span style={{ fontSize: '12px', color: '#7f8c8d' }}>By: {r.engineer_email}</span>
                      </div>
                      <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{r.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: PROCUREMENT */}
          {activeTab === 'procurement' && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Create Purchase Order (PO)</h3>
              <form onSubmit={handleCreatePO}>
                <div style={styles.formGroup}>
                  <label>Select Supplier</label>
                  <select
                    style={styles.input}
                    value={poData.supplier_id}
                    onChange={(e) => setPoData({ ...poData, supplier_id: e.target.value })}
                    required
                  >
                    <option value="">-- Choose a Supplier --</option>
                    {suppliers.map((s) => (
                      <option key={s.user_id} value={s.user_id}>{s.email}</option>
                    ))}
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label>Order Details</label>
                  <textarea
                    style={{ ...styles.input, height: '100px', resize: 'vertical' }}
                    placeholder="List items, quantities, and delivery instructions..."
                    value={poData.details}
                    onChange={(e) => setPoData({ ...poData, details: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" style={styles.button}>Send Purchase Order</button>
              </form>
              {poMessage && <div style={styles.successBox}>{poMessage}</div>}
            </div>
          )}

          {/* TAB: MATERIAL REQUESTS */}
          {activeTab === 'requests' && (
            <div style={styles.card}>
                <h3 style={styles.cardTitle}>Incoming Material Requests</h3>
                {!selectedProjectId ? (
                    <div style={{...styles.errorBox, marginTop: 0}}>
                        ⚠️ Please select a project from the top dropdown first.
                    </div>
                ) : (
                    <div style={{ marginTop: '20px' }}>
                        {requests.length === 0 ? (
                            <p style={{ color: '#7f8c8d' }}>No pending requests found for this project.</p>
                        ) : (
                            requests.map((req) => (
                                <div key={req.request_id} style={styles.requestItem}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <strong style={{ fontSize: '1.1rem', color: '#2c3e50' }}>{req.details}</strong>
                                        <span style={{ 
                                            padding: '5px 10px', 
                                            borderRadius: '20px', 
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            backgroundColor: req.status === 'Pending' ? '#fff3cd' : '#d4edda',
                                            color: req.status === 'Pending' ? '#856404' : '#155724'
                                        }}>
                                            {req.status}
                                        </span>
                                    </div>
                                    <div style={{ marginTop: '8px', fontSize: '13px', color: '#7f8c8d' }}>
                                        Requested by: <strong>{req.requester_email || `User #${req.created_by_engineer_id}`}</strong>
                                        <span style={{ margin: '0 8px' }}>|</span>
                                        Date: {new Date(req.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// --- STYLES OBJECT ---
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    backgroundColor: '#f4f7f6',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
  },
  logo: {
    padding: '20px',
    textAlign: 'center',
    borderBottom: '1px solid #34495e',
    margin: 0,
    fontSize: '1.5rem',
  },
  menu: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '20px',
  },
  menuItem: {
    padding: '15px 20px',
    cursor: 'pointer',
    transition: 'background 0.3s',
    display: 'flex',
    alignItems: 'center',
    fontSize: '16px',
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '20px 30px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  contentBody: {
    padding: '30px',
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    maxWidth: '800px',
  },
  cardTitle: {
    marginTop: 0,
    marginBottom: '20px',
    color: '#2c3e50',
    borderBottom: '2px solid #3498db',
    display: 'inline-block',
    paddingBottom: '5px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inlineForm: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #bdc3c7',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  selectInput: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #bdc3c7',
  },
  button: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'background 0.2s',
  },
  successBox: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '4px',
    border: '1px solid #c3e6cb',
  },
  errorBox: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '4px',
    border: '1px solid #f5c6cb',
  },
  reportItem: {
    backgroundColor: '#f9f9f9',
    borderLeft: '4px solid #27ae60',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '4px',
  },
  // ✅ ADDED THIS MISSING STYLE
  requestItem: {
    padding: '20px',
    borderBottom: '1px solid #eee',
    backgroundColor: '#fafafa',
    marginBottom: '15px',
    borderRadius: '8px',
    borderLeft: '4px solid #f39c12'
  }
};

export default ContractorDashboard;