import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createReport } from '../features/operations/operationSlice';
import { createMaterialRequest, fetchMyRequests, clearMaterialMsg } from '../features/materials/materialSlice';
import { fetchMyProjects } from '../features/projects/projectSlice';
import { logout } from '../features/auth/authSlice';
import {
  Home,
  ClipboardList,
  BrickWall,
  FileText,
  Moon,
  Sun,
  LogOut,
  User,
  HardHat
} from 'lucide-react';

const SiteEngineerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = useSelector((state) => state.auth.user); // Get logged-in user info

  // --- UI State ---
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // --- Redux State ---
  const { requests, message: matMessage } = useSelector((state) => state.materials);
  const myProjects = useSelector((state) => state.projects.list || []);

  // --- Form States ---
  const [reportData, setReportData] = useState({
    project_id: '',
    report_date: new Date().toISOString().split('T')[0],
    content: ''
  });
  const [materialData, setMaterialData] = useState({ project_id: '', details: '' });

  // --- Effects ---

  // 1. Initial Load (Time, Projects)
  useEffect(() => {
    // Set Time & Greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Set Date (e.g., "8th February, Sunday")
    const dateOptions = { day: 'numeric', month: 'long', weekday: 'long' };
    setCurrentDate(new Date().toLocaleDateString('en-GB', dateOptions));

    // Fetch Projects assigned to this Engineer
    if (token) {
      dispatch(fetchMyProjects(token));
    }
  }, [dispatch, token]);

  // 2. Load Requests when tab changes
  useEffect(() => {
    if (activeTab === 'requests') {
      dispatch(fetchMyRequests(token));
    }
  }, [activeTab, dispatch, token]);

  // --- Handlers ---

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleReportSubmit = (e) => {
    e.preventDefault();
    dispatch(createReport({ data: reportData, token }));
    alert("✅ Daily Report Submitted!");
    setReportData({ ...reportData, content: '' });
  };

  const handleMaterialSubmit = (e) => {
    e.preventDefault();
    dispatch(createMaterialRequest({ data: materialData, token }));
    setTimeout(() => dispatch(clearMaterialMsg()), 3000);
  };

  // --- Dynamic Styles based on Dark Mode ---
  const theme = darkMode ? styles.dark : styles.light;

  return (
    <div style={{ ...styles.container, backgroundColor: theme.bg, color: theme.text }}>

      {/* 🟢 TOP HEADER */}
      <div style={{ ...styles.header, backgroundColor: theme.card }}>
        <div style={styles.headerLeft}>
          <div style={styles.avatar}>👷</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>{user?.email || 'Site Engineer'}</h3>
            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Site ID: #{user?.user_id || '---'}</span>
          </div>
        </div>
        <div style={styles.headerRight}>
          <button onClick={toggleTheme} style={{ ...styles.iconBtn, color: theme.text }}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={handleLogout} style={{ ...styles.iconBtn, color: '#ef4444' }}>
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* 🟢 MAIN CONTENT AREA (Scrollable) */}
      <div style={styles.content}>

        {/* === TAB: HOME === */}
        {activeTab === 'home' && (
          <div style={styles.fadePending}>
            {/* Greeting Card */}
            <div style={{ ...styles.heroCard, backgroundImage: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
              <h1 style={{ margin: 0, fontSize: '1.8rem' }}>{greeting}</h1>
              <p style={{ margin: '5px 0 0', opacity: 0.9, fontSize: '1.1rem' }}>{currentDate}</p>
            </div>

            {/* Active Projects Section */}
            <h3 style={styles.sectionTitle}>🏗️ Active Projects</h3>
            {myProjects.length === 0 ? (
              <div style={{ ...styles.card, backgroundColor: theme.card, textAlign: 'center', padding: '30px' }}>
                <p>No projects assigned yet.</p>
              </div>
            ) : (
              myProjects.map(proj => (
                <div key={proj.project_id} style={{ ...styles.projectCard, backgroundColor: theme.card }}>
                  <div style={styles.projectIcon}><HardHat size={24} color="#fff" /></div>
                  <div>
                    <h4 style={{ margin: 0 }}>{proj.name || `Project #${proj.project_id}`}</h4>
                    <p style={{ margin: '5px 0 0', fontSize: '0.85rem', opacity: 0.7 }}>
                      Location: {proj.location || 'Site A'}
                    </p>
                  </div>
                </div>
              ))
            )}

            {/* Contractor Info */}
            <h3 style={styles.sectionTitle}>👤 Reporting Manager (Contractor)</h3>
            <div style={{ ...styles.card, backgroundColor: theme.card, display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ ...styles.avatar, backgroundColor: '#10b981' }}>👨‍💼</div>
              <div>
                <h4 style={{ margin: 0 }}>Contractor Team</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>Head Office</p>
              </div>
            </div>
          </div>
        )}

        {/* === TAB: DAILY REPORT === */}
        {activeTab === 'report' && (
          <div style={styles.fadePending}>
            <h2 style={styles.pageTitle}>📝 Daily Report</h2>
            <div style={{ ...styles.card, backgroundColor: theme.card }}>
              <form onSubmit={handleReportSubmit} style={styles.form}>
                <label style={styles.label}>Select Project</label>
                <select
                  style={{ ...styles.largeInput, backgroundColor: theme.inputBg, color: theme.text }}
                  value={reportData.project_id} // (Or materialData.project_id for the other form)
                  onChange={(e) => setReportData({ ...reportData, project_id: e.target.value })}
                  required
                >
                  <option value="">-- Tap to Select --</option>
                  {myProjects.map(p => (
                    <option key={p.project_id} value={p.project_id}>
                      {p.project_name || p.name || `Project #${p.project_id}`}
                    </option>
                  ))}
                </select>


                <label style={styles.label}>Report Date</label>
                <input
                  type="date"
                  style={{ ...styles.largeInput, backgroundColor: theme.inputBg, color: theme.text }}
                  value={reportData.report_date}
                  onChange={(e) => setReportData({ ...reportData, report_date: e.target.value })}
                  required
                />

                <label style={styles.label}>Work Log / Progress</label>
                <textarea
                  style={{ ...styles.largeInput, height: '150px', backgroundColor: theme.inputBg, color: theme.text }}
                  placeholder="Describe work done today (e.g. Foundation laid, 50% wall completed...)"
                  value={reportData.content}
                  onChange={(e) => setReportData({ ...reportData, content: e.target.value })}
                  required
                />

                <button type="submit" style={styles.largeButton}>
                  Submit Report
                </button>
              </form>
            </div>
          </div>
        )}

        {/* === TAB: REQUEST MATERIALS === */}
        {activeTab === 'material' && (
          <div style={styles.fadePending}>
            <h2 style={styles.pageTitle}>🧱 Request Materials</h2>
            <div style={{ ...styles.card, backgroundColor: theme.card }}>
              <form onSubmit={handleMaterialSubmit} style={styles.form}>
                <label style={styles.label}>Select Project</label>
                <select
                  style={{ ...styles.largeInput, backgroundColor: theme.inputBg, color: theme.text }}
                  value={materialData.project_id}
                  onChange={(e) => setMaterialData({ ...materialData, project_id: e.target.value })}
                  required
                >
                  <option value="">-- Tap to Select --</option>
                  {myProjects.map(p => (
                    <option key={p.project_id} value={p.project_id}>{p.name || p.project_id}</option>
                  ))}
                </select>

                <label style={styles.label}>Material Details</label>
                <textarea
                  style={{ ...styles.largeInput, height: '120px', backgroundColor: theme.inputBg, color: theme.text }}
                  placeholder="E.g., 50 Bags Cement, 200 Bricks..."
                  value={materialData.details}
                  onChange={(e) => setMaterialData({ ...materialData, details: e.target.value })}
                  required
                />

                <button type="submit" style={{ ...styles.largeButton, backgroundColor: '#f59e0b' }}>
                  Send Request
                </button>
              </form>
              {matMessage && <div style={styles.successMsg}>{matMessage}</div>}
            </div>
          </div>
        )}

        {/* === TAB: MY REQUESTS === */}
        {activeTab === 'requests' && (
          <div style={styles.fadePending}>
            <h2 style={styles.pageTitle}>📋 My History</h2>
            {requests.length === 0 ? (
              <p style={{ textAlign: 'center', opacity: 0.6 }}>No material requests found.</p>
            ) : (
              requests.map((req) => (
                <div key={req.request_id} style={{ ...styles.statusCard, backgroundColor: theme.card }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong>Project #{req.project_id}</strong>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: req.status === 'Pending' ? '#fff3cd' : '#d1fae5',
                      color: req.status === 'Pending' ? '#856404' : '#065f46'
                    }}>
                      {req.status}
                    </span>
                  </div>
                  <p style={{ margin: 0, opacity: 0.8 }}>{req.details}</p>
                  <small style={{ display: 'block', marginTop: '8px', opacity: 0.5 }}>
                    {new Date(req.created_at || Date.now()).toLocaleDateString()}
                  </small>
                </div>
              ))
            )}
          </div>
        )}

        {/* Padding for Bottom Nav */}
        <div style={{ height: '80px' }}></div>
      </div>

      {/* 🟢 BOTTOM NAVIGATION BAR */}
      <div style={{ ...styles.bottomNav, backgroundColor: theme.card, borderTop: `1px solid ${theme.border}` }}>
        <NavButton
          active={activeTab === 'home'}
          onClick={() => setActiveTab('home')}
          icon={<Home size={24} />}
          label="Home"
          theme={theme}
        />
        <NavButton
          active={activeTab === 'report'}
          onClick={() => setActiveTab('report')}
          icon={<FileText size={24} />}
          label="Reports"
          theme={theme}
        />
        <NavButton
          active={activeTab === 'material'}
          onClick={() => setActiveTab('material')}
          icon={<BrickWall size={24} />}
          label="Materials"
          theme={theme}
        />
        <NavButton
          active={activeTab === 'requests'}
          onClick={() => setActiveTab('requests')}
          icon={<ClipboardList size={24} />}
          label="History"
          theme={theme}
        />
      </div>

    </div>
  );
};

// --- Sub-Components ---
const NavButton = ({ active, onClick, icon, label, theme }) => (
  <button
    onClick={onClick}
    style={{
      ...styles.navBtn,
      color: active ? '#3b82f6' : theme.text,
      opacity: active ? 1 : 0.6
    }}
  >
    {icon}
    <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>{label}</span>
  </button>
);

// --- STYLES (Mobile Optimized) ---
const styles = {
  // Theme Config
  light: { bg: '#f3f4f6', card: '#ffffff', text: '#1f2937', inputBg: '#f9fafb', border: '#e5e7eb' },
  dark: { bg: '#111827', card: '#1f2937', text: '#f3f4f6', inputBg: '#374151', border: '#374151' },

  // Layout
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  header: {
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    zIndex: 10,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  headerRight: {
    display: 'flex',
    gap: '15px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
  },

  // Content
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
  },
  heroCard: {
    padding: '25px',
    borderRadius: '16px',
    color: 'white',
    marginBottom: '25px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    marginBottom: '10px',
    opacity: 0.8,
  },
  card: {
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  projectCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    borderRadius: '12px',
    marginBottom: '15px',
    gap: '15px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  projectIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Forms
  pageTitle: {
    marginBottom: '15px',
    fontSize: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '-5px',
  },
  largeInput: {
    width: '100%',
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid transparent',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  largeButton: {
    padding: '18px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
  },

  // Status List
  statusCard: {
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '10px',
    borderLeft: '4px solid #3b82f6',
  },
  badge: {
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  successMsg: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '8px',
    textAlign: 'center',
  },

  // Bottom Navigation
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 100,
    paddingBottom: 'safe-area-inset-bottom', // iOS safe area
  },
  navBtn: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
    cursor: 'pointer',
  },
  fadePending: {
    animation: 'fadeIn 0.3s ease-in',
  },
};

// Add keyframes for smooth fade
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);

export default SiteEngineerDashboard;