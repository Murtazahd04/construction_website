import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createReport } from '../../features/operations/operationSlice';
import { createMaterialRequest, fetchMyRequests, clearMaterialMsg } from '../../features/materials/materialSlice';
import { fetchMyProjects } from '../../features/projects/projectSlice';
import { logout } from '../../features/auth/authSlice';
import {
  Home,
  ClipboardList,
  BrickWall,
  FileText,
  Moon,
  Sun,
  LogOut,
  HardHat,
  MapPin,
  Calendar,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  Activity,
  Zap
} from 'lucide-react';
import { toast } from 'react-toastify';

const SiteEngineerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = useSelector((state) => state.auth.user);

  // --- UI State ---
  const [activeTab, setActiveTab] = useState('home');
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
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const dateOptions = { day: 'numeric', month: 'long', weekday: 'long' };
    setCurrentDate(new Date().toLocaleDateString('en-GB', dateOptions));

    if (token) {
      dispatch(fetchMyProjects(token));
    } else {
      navigate('/login');
    }
  }, [dispatch, token, navigate]);

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

  const handleReportSubmit = (e) => {
    e.preventDefault();
    dispatch(createReport({ data: reportData, token }));
    toast.success("Daily Report Submitted!");
    setReportData({ ...reportData, content: '' });
  };

  const handleMaterialSubmit = (e) => {
    e.preventDefault();
    dispatch(createMaterialRequest({ data: materialData, token }));
    setTimeout(() => dispatch(clearMaterialMsg()), 3000);
  };

  // --- Animation Variants ---
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const SidebarItem = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`relative w-full flex items-center space-x-3 px-6 py-4 transition-all duration-300 group
        ${activeTab === id ? 'text-blue-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
    >
      {activeTab === id && (
        <motion.div layoutId="engNav" className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full" />
      )}
      <Icon className={`w-5 h-5 transition-colors ${activeTab === id ? 'text-blue-500' : 'group-hover:text-white'}`} />
      <span className="font-bold text-sm tracking-wide uppercase">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      
      {/* 🌌 Animated Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      {/* 🟢 SIDEBAR (Now matches Admin/PM/Owner) */}
      <aside className="w-72 bg-slate-950 border-r border-white/5 flex flex-col z-20 shadow-2xl">
        <div className="h-24 flex items-center px-8 border-b border-white/5 bg-gradient-to-b from-blue-500/5 to-transparent">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40 mr-4">
            <HardHat className="text-white w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">Field.OPS</span>
            <p className="text-[9px] text-blue-500 font-bold tracking-[0.3em] uppercase leading-none">Engineer</p>
          </div>
        </div>

        <nav className="flex-1 py-8 space-y-2">
          <SidebarItem id="home" label="Operations Terminal" icon={Home} />
          <SidebarItem id="report" label="Daily Reporting" icon={FileText} />
          <SidebarItem id="material" label="Inventory Request" icon={BrickWall} />
          <SidebarItem id="requests" label="Transmission Log" icon={ClipboardList} />
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all group">
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="font-bold text-sm uppercase">Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* 🟢 MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-900 to-[#020617] relative z-10">
        <div className="max-w-7xl mx-auto p-10">
          
          <header className="mb-12 flex justify-between items-end">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                {activeTab === 'home' ? 'Mission Overview' : activeTab === 'report' ? 'Protocol Logging' : 'Asset Deployment'}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">{greeting} Engineer</p>
              </div>
            </motion.div>

            <div className="hidden lg:flex items-center space-x-4 bg-white/5 p-2 rounded-2xl border border-white/10">
               <div className="px-4 py-2 text-right">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Identified Node</p>
                  <p className="text-sm text-white font-medium mt-1">{user?.email}</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-blue-500 shadow-inner">
                  {user?.email?.[0].toUpperCase()}
               </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            
            {/* TAB: HOME */}
            {activeTab === 'home' && (
              <motion.div key="home" variants={containerVars} initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  {[
                    { label: 'Assigned Sectors', val: myProjects.length, icon: MapPin, color: 'text-blue-500' },
                    { label: 'System Date', val: currentDate.split(',')[0], icon: Calendar, color: 'text-indigo-500' },
                    { label: 'Active Status', val: 'Field-Ready', icon: Activity, color: 'text-emerald-500' },
                  ].map((stat, i) => (
                    <motion.div key={i} variants={itemVars} className="bg-white/5 backdrop-blur-md border border-white/5 p-6 rounded-[2rem] hover:bg-white/10 transition-all">
                      <stat.icon className={`w-6 h-6 ${stat.color} mb-4`} />
                      <p className="text-2xl font-black text-white">{stat.val}</p>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-2">
                  <Zap size={14} className="text-blue-500" /> Authorized Project Sectors
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myProjects.length === 0 ? (
                    <div className="col-span-full py-24 text-center bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">Awaiting Sector Allocation</p>
                    </div>
                  ) : (
                    myProjects.map((proj, idx) => (
                      <motion.div 
                        key={proj.project_id} 
                        variants={itemVars}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem] flex items-center justify-between group cursor-default"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white shadow-xl shadow-blue-900/20 group-hover:rotate-6 transition-transform">
                            <HardHat size={30} />
                          </div>
                          <div>
                            <h4 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-blue-400 transition-colors">{proj.project_name || `Sector ${proj.project_id}`}</h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 flex items-center gap-2">
                              <MapPin size={12} className="text-blue-500" /> {proj.location || 'Region Restricted'}
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={24} className="text-slate-700" />
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB: DAILY REPORT */}
            {activeTab === 'report' && (
              <motion.div key="report" variants={itemVars} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="max-w-3xl">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] shadow-2xl">
                  <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3 italic">
                    <FileText className="text-blue-500" /> Operations Protocol
                  </h3>
                  <form onSubmit={handleReportSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Target Sector</label>
                        <select
                          className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                          value={reportData.project_id}
                          onChange={(e) => setReportData({ ...reportData, project_id: e.target.value })}
                          required
                        >
                          <option value="" className="bg-slate-900">Authenticate Sector</option>
                          {myProjects.map(p => <option key={p.project_id} value={p.project_id} className="bg-slate-900">{p.project_name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Log Timestamp</label>
                        <input
                          type="date"
                          className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all invert-calendar-icon"
                          value={reportData.report_date}
                          onChange={(e) => setReportData({ ...reportData, report_date: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Intelligence / Progress Summary</label>
                      <textarea
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-white font-medium min-h-[200px] outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Detailed field analytics..."
                        value={reportData.content}
                        onChange={(e) => setReportData({ ...reportData, content: e.target.value })}
                        required
                      />
                    </div>
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-900/40">
                      Sync Local Protocol
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* TAB: REQUEST MATERIALS */}
            {activeTab === 'material' && (
              <motion.div key="material" variants={itemVars} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="max-w-2xl">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] shadow-2xl">
                  <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3 italic">
                    <BrickWall className="text-amber-500" /> Resource Deployment Request
                  </h3>
                  <form onSubmit={handleMaterialSubmit} className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Deployment Sector</label>
                      <select
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-amber-500 transition-all appearance-none cursor-pointer"
                        value={materialData.project_id}
                        onChange={(e) => setMaterialData({ ...materialData, project_id: e.target.value })}
                        required
                      >
                        <option value="" className="bg-slate-900">Identify Deployment Node</option>
                        {myProjects.map(p => <option key={p.project_id} value={p.project_id} className="bg-slate-900">{p.project_name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 text-amber-500">Inventory Specification (Quantities / Tonnage)</label>
                      <textarea
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-white font-medium min-h-[160px] outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                        placeholder="e.g. 500 Units Grade-A Brick, 25 TMT Steel..."
                        value={materialData.details}
                        onChange={(e) => setMaterialData({ ...materialData, details: e.target.value })}
                        required
                      />
                    </div>
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" className="w-full py-5 bg-amber-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-amber-900/40">
                      Authorize Requisition
                    </motion.button>
                  </form>
                  {matMessage && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-center rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} /> Transmission Synchronized
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB: MY REQUESTS */}
            {activeTab === 'requests' && (
              <motion.div key="requests" variants={containerVars} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {requests.length === 0 ? (
                    <div className="py-32 text-center opacity-30 flex flex-col items-center gap-4 uppercase font-black tracking-[0.5em]">
                      <ClipboardList size={60} strokeWidth={1} />
                      <p className="text-sm">Log Entry Empty</p>
                    </div>
                  ) : (
                    requests.map((req, idx) => (
                      <motion.div 
                        key={req.request_id}
                        variants={itemVars}
                        className="bg-white/5 border border-white/5 p-8 rounded-[2rem] border-l-8 border-l-blue-600 shadow-2xl relative overflow-hidden group"
                      >
                        <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                          <Package size={100} />
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full">Sector: {req.project_id}</span>
                              <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                req.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              }`}>
                                {req.status}
                              </span>
                            </div>
                            <p className="text-lg font-bold text-white leading-tight mt-4 uppercase italic tracking-tighter">{req.details}</p>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest bg-black/20 px-4 py-2 rounded-xl border border-white/5">
                            <Clock size={12} className="text-blue-500" />
                            {new Date(req.created_at || Date.now()).toLocaleDateString()}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default SiteEngineerDashboard;