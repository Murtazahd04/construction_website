import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  createSubUser, 
  clearUserState 
} from '../../features/users/userSlice';
import { fetchSuppliers, createPO } from '../../features/procurement/procurementSlice';
import { fetchMyProjects } from '../../features/projects/projectSlice';
import { fetchReports } from '../../features/operations/operationSlice';
import { logout } from '../../features/auth/authSlice';
import { fetchProjectRequests } from '../../features/materials/materialSlice'; 
import { 
  Users, 
  FileText, 
  Package, 
  Truck, 
  LogOut, 
  LayoutDashboard, 
  Briefcase, 
  Calendar,
  Plus,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-toastify';

const ContractorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Navigation State
  const [activeTab, setActiveTab] = useState('team');

  // --- Redux State Selectors ---
  const userStatus = useSelector((state) => state.users);
  const reports = useSelector((state) => state.operations.reports || []);
  const { suppliers, message: poMessage, loading: poLoading } = useSelector((state) => state.procurement);
  const myProjects = useSelector((state) => state.projects.list || []);
  const { requests } = useSelector((state) => state.materials);

  // --- Local Forms State ---
  const [newUser, setNewUser] = useState({ email: '', role: 'Site Engineer' });
  const [reportFilter, setReportFilter] = useState({ period: 'month', date: '' });
  const [poData, setPoData] = useState({ supplier_id: '', details: '' });
  const [selectedProjectId, setSelectedProjectId] = useState('');

  // --- Effects ---
  useEffect(() => {
    if (token) {
      dispatch(fetchMyProjects(token));
    } else {
      navigate('/login');
    }
  }, [dispatch, token, navigate]);

  useEffect(() => {
    if (activeTab === 'procurement') dispatch(fetchSuppliers(token));
  }, [activeTab, dispatch, token]);

  useEffect(() => {
    if (activeTab === 'requests' && selectedProjectId) {
        dispatch(fetchProjectRequests({ projectId: selectedProjectId, token }));
    }
  }, [activeTab, selectedProjectId, dispatch, token]);

  useEffect(() => {
    if (userStatus.status === 'succeeded') toast.success(userStatus.message);
    if (userStatus.status === 'failed') toast.error(userStatus.error);
  }, [userStatus.status]);

  // --- Handlers ---
  const handleCreateUser = (e) => {
    e.preventDefault();
    dispatch(createSubUser({ data: newUser, token }));
  };

  const handleFetchReports = (e) => {
    e.preventDefault();
    if (!selectedProjectId) return toast.warning("Please select a project first!");
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

  // Animation Variants
  const tabVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -10 }
  };

  const SidebarItem = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`relative w-full flex items-center space-x-3 px-6 py-4 transition-all duration-300 group
        ${activeTab === id ? 'text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
    >
      {activeTab === id && (
        <motion.div layoutId="contractorNav" className="absolute left-0 w-1 h-8 bg-emerald-500 rounded-r-full" />
      )}
      <Icon className={`w-5 h-5 transition-colors ${activeTab === id ? 'text-emerald-500' : 'group-hover:text-white'}`} />
      <span className="font-bold text-sm tracking-wide uppercase">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 border-r border-white/5 flex flex-col z-20">
        <div className="h-24 flex items-center px-8 border-b border-white/5 bg-gradient-to-b from-emerald-500/5 to-transparent">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20 mr-4">
            <Briefcase className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase italic">Contractor</span>
        </div>

        <nav className="flex-1 py-8 space-y-2">
          <SidebarItem id="team" label="Manage Team" icon={Users} />
          <SidebarItem id="reports" label="Site Reports" icon={FileText} />
          <SidebarItem id="procurement" label="Procurement" icon={Truck} />
          <SidebarItem id="requests" label="Material Logs" icon={Package} />
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all group">
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="font-bold text-sm">Logout Session</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-900 to-[#0f172a] relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none" />
        
        {/* TOP HEADER */}
        <header className="sticky top-0 z-10 px-10 py-6 bg-slate-950/50 backdrop-blur-xl border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-black text-white italic tracking-tighter uppercase">
            {activeTab === 'team' ? 'Force Management' : activeTab === 'reports' ? 'Field Intelligence' : 'Supply Chain'}
          </motion.h2>

          <div className="flex items-center gap-4 bg-slate-900/80 border border-white/10 p-2 rounded-2xl">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-2">Scope:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-transparent text-sm font-bold text-emerald-400 outline-none pr-4"
            >
              <option value="" className="bg-slate-900">Select Active Project</option>
              {myProjects.map((project) => (
                <option key={project.project_id} value={project.project_id} className="bg-slate-900">
                  {project.project_name || `Project #${project.project_id}`}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="p-10 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            
            {/* TAB: MANAGE TEAM */}
            {activeTab === 'team' && (
              <motion.div key="team" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="max-w-xl">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
                  <div className="flex items-center gap-6 mb-10">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-inner">
                      <Plus className="text-emerald-500 w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight">Onboard Personnel</h3>
                      <p className="text-slate-400 font-medium">Add Site Engineers or Suppliers to this project.</p>
                    </div>
                  </div>

                  <form onSubmit={handleCreateUser} className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Designation</label>
                      <select
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      >
                        <option value="Site Engineer">Site Engineer</option>
                        <option value="Supplier">Supplier</option>
                      </select>
                    </div>
                    
                    <div className="space-y-3">
                       <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Corporate Email</label>
                       <input
                        type="email"
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white font-bold placeholder:text-slate-700 outline-none"
                        placeholder="engineer@firm.com"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                      />
                    </div>
                    
                    <button type="submit" className="group w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2">
                       {userStatus.status === 'loading' ? <Loader2 className="animate-spin" /> : 'Authorize User'}
                       <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>

                  {userStatus.status === 'succeeded' && userStatus.createdCredentials && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl font-mono">
                      <p className="text-emerald-500 text-xs font-black uppercase mb-3 tracking-widest">Generated Key</p>
                      <p className="text-white flex justify-between">Pass: <span className="font-black text-emerald-400 tracking-[0.3em]">{userStatus.createdCredentials.password}</span></p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB: VIEW REPORTS */}
            {activeTab === 'reports' && (
              <motion.div key="reports" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-white/5">
                    <h3 className="text-2xl font-black text-white">Daily Logs</h3>
                    <form onSubmit={handleFetchReports} className="flex gap-3 w-full md:w-auto">
                      <select 
                        className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none"
                        value={reportFilter.period} 
                        onChange={(e) => setReportFilter({ ...reportFilter, period: e.target.value })}
                      >
                        <option value="day">Day View</option>
                        <option value="month">Monthly Rollup</option>
                      </select>
                      <input
                        type="date"
                        className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none invert-calendar-icon"
                        value={reportFilter.date}
                        onChange={(e) => setReportFilter({ ...reportFilter, date: e.target.value })}
                        required
                      />
                      <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-xl text-xs font-black text-white uppercase tracking-widest transition-all">Sync</button>
                    </form>
                  </div>

                  <div className="space-y-6">
                    {reports.length === 0 ? (
                      <div className="text-center py-20 bg-slate-950/50 rounded-3xl border border-dashed border-white/5">
                         <FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                         <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Awaiting Site Engineer Submissions</p>
                      </div>
                    ) : (
                      reports.map((r, idx) => (
                        <motion.div 
                          key={r.report_id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-slate-950/80 border border-white/5 p-8 rounded-3xl group hover:border-emerald-500/30 transition-all"
                        >
                          <div className="flex justify-between items-center mb-6">
                            <span className="flex items-center gap-2 text-emerald-500 text-xs font-black uppercase tracking-widest">
                               <Calendar size={14} /> {new Date(r.report_date).toLocaleDateString()}
                            </span>
                            <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-slate-500 font-bold tracking-widest uppercase italic">Author: {r.engineer_email}</span>
                          </div>
                          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{r.content}</p>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: PROCUREMENT */}
            {activeTab === 'procurement' && (
              <motion.div key="procure" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="max-w-2xl">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[3rem] shadow-2xl">
                  <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4">
                    <Truck className="text-emerald-500" /> Procurement Protocol
                  </h3>
                  <form onSubmit={handleCreatePO} className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Certified Supplier</label>
                      <select
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none appearance-none"
                        value={poData.supplier_id}
                        onChange={(e) => setPoData({ ...poData, supplier_id: e.target.value })}
                        required
                      >
                        <option value="">-- Authenticate Supplier --</option>
                        {suppliers.map((s) => <option key={s.user_id} value={s.user_id} className="bg-slate-900">{s.email}</option>)}
                      </select>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Logistics & Order Spec</label>
                      <textarea
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white font-medium min-h-[150px] outline-none"
                        placeholder="Itemized manifest, tonnage, and delivery window..."
                        value={poData.details}
                        onChange={(e) => setPoData({ ...poData, details: e.target.value })}
                        required
                      />
                    </div>

                    <button type="submit" className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all">
                       {poLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Dispatch Purchase Order'}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* TAB: MATERIAL REQUESTS */}
            {activeTab === 'requests' && (
              <motion.div key="requests" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
                    <h3 className="text-2xl font-black text-white mb-10">Inventory Requests</h3>
                    {!selectedProjectId ? (
                        <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-3xl flex items-center gap-6 text-amber-500">
                            <AlertTriangle size={40} className="shrink-0" />
                            <p className="font-bold tracking-tight">System locked. Select an active project project from the global selector above to view site requests.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {requests.length === 0 ? (
                                <div className="text-center py-20 bg-slate-950/50 rounded-3xl border-2 border-dashed border-white/5">
                                   <Package className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                   <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No pending requests for this sector</p>
                                </div>
                            ) : (
                                requests.map((req, idx) => (
                                    <motion.div 
                                      key={req.request_id} 
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: idx * 0.05 }}
                                      className="p-8 bg-slate-950/80 border border-white/5 rounded-3xl group hover:border-amber-500/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-2">
                                              <h4 className="text-xl font-black text-white group-hover:text-amber-500 transition-colors uppercase tracking-tight">{req.details}</h4>
                                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                req.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                              }`}>
                                                  {req.status}
                                              </span>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><Users size={12} /> {req.requester_email || `Engineer #${req.created_by_engineer_id}`}</span>
                                                <span className="w-1 h-1 bg-slate-700 rounded-full mt-1.5 hidden md:block" />
                                                <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(req.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-600 group-hover:text-amber-500 group-hover:border-amber-500/20 transition-all">
                                           <Package size={24} />
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
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

export default ContractorDashboard;