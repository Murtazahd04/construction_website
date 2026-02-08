import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSubUser, clearUserState } from '../../features/users/userSlice';
import { fetchOwnerProjects } from '../../features/projects/projectSlice';
import { logout } from '../../features/auth/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Briefcase, LogOut, LayoutDashboard, 
  Plus, ShieldCheck, Zap, Copy, X, ChevronRight, Loader2 
} from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const OwnerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const { loading, successMessage, error, createdCredentials } = useSelector((state) => state.users);
  const { projects } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);

  const [activeView, setActiveView] = useState('dashboard');
  const [formData, setFormData] = useState({ email: '', role: 'Project Manager', specialization: '' });

  useEffect(() => {
    if (successMessage) toast.success(successMessage);
    if (error) {
      toast.error(error);
      dispatch(clearUserState());
    }
  }, [successMessage, error, dispatch]);

  useEffect(() => {
    if (activeView === 'dashboard' && token) {
      dispatch(fetchOwnerProjects(token)); 
    }
  }, [dispatch, activeView, token]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createSubUser({ data: formData, token }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const getCompanyName = () => {
    if (!user || !user.email) return 'companyname';
    const domain = user.email.split('@')[1];
    return domain ? domain.split('.')[0] : 'companyname';
  };

  const companyName = getCompanyName();

  // SIDEBAR COMPONENT
  const SidebarItem = ({ icon: Icon, label, viewName }) => (
    <button
      onClick={() => setActiveView(viewName)}
      className={`relative w-full flex items-center space-x-3 px-6 py-4 transition-all duration-300 group
        ${activeView === viewName ? 'text-orange-500' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
    >
      {activeView === viewName && (
        <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-8 bg-orange-500 rounded-r-full" />
      )}
      <Icon className={`w-5 h-5 transition-colors ${activeView === viewName ? 'text-orange-500' : 'group-hover:text-white'}`} />
      <span className="font-semibold text-sm tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 border-r border-white/5 flex flex-col z-20">
        <div className="h-24 flex items-center px-8 border-b border-white/5">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20 mr-4">
            <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase">Owner Panel</span>
        </div>
        
        <nav className="flex-1 py-8 space-y-2">
          <SidebarItem icon={Briefcase} label="Active Projects" viewName="dashboard" />
          <SidebarItem icon={Users} label="Team Management" viewName="createUser" />
        </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={handleLogout} 
            className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="font-bold text-sm">Logout Session</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-900 to-[#0f172a] relative">
        {/* Background Mesh Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto p-10 relative z-10">
          <header className="mb-12 flex justify-between items-end">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-4xl font-extrabold text-white tracking-tight">
                {activeView === 'dashboard' ? 'Projects Hub' : 'Add Team Member'}
              </h2>
              <p className="text-slate-400 mt-2 text-lg">
                {activeView === 'dashboard' ? 'Real-time oversight of construction progress.' : 'Provision new credentials for site leads.'}
              </p>
            </motion.div>
            
            <div className="hidden lg:flex items-center space-x-4 bg-white/5 p-2 rounded-2xl border border-white/10">
               <div className="px-4 py-2 text-right">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Logged in as</p>
                  <p className="text-sm text-white font-medium">{user?.email}</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-orange-500">
                  {user?.email?.[0].toUpperCase()}
               </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeView === 'dashboard' ? (
              <motion.div 
                key="dash"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {projects && projects.length > 0 ? (
                  projects.map((project, idx) => (
                    <motion.div 
                      key={project.project_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group bg-white/5 backdrop-blur-md border border-white/10 p-7 rounded-3xl hover:border-orange-500/50 hover:bg-white/10 transition-all shadow-2xl"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 group-hover:scale-110 transition-transform">
                          <Briefcase className="w-6 h-6 text-orange-500" />
                        </div>
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          <Zap className="w-3 h-3 fill-current" /> Live
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">{project.project_name}</h3>
                      <p className="text-slate-400 text-sm mb-6 font-medium tracking-wide">
                        Budget allocation: <span className="text-white">₹{Number(project.budget).toLocaleString()}</span>
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tighter">
                          <span>Construction Progress</span>
                          <span className="text-orange-500 text-sm">0%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-white/5 p-0.5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '5%' }} // Simulated tiny progress for new projects
                            className="bg-gradient-to-r from-orange-600 to-orange-400 h-full rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full bg-white/5 border border-dashed border-white/10 rounded-3xl py-24 text-center">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                       <Briefcase className="w-10 h-10 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white">No active projects</h3>
                    <p className="text-slate-500 mt-2">Projects created by managers will appear here.</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="create"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-xl"
              >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                  <div className="flex items-center mb-10">
                    <div className="p-4 bg-orange-600/20 rounded-2xl mr-6 border border-orange-600/20">
                      <ShieldCheck className="w-8 h-8 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight">Identity Provisioning</h3>
                      <p className="text-slate-400 font-medium">Create secure sub-user credentials.</p>
                    </div>
                  </div>

                  {/* PASSWORD DISPLAY BOX - PRESERVED LOGIC */}
                  <AnimatePresence>
                    {successMessage && createdCredentials && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-10 bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl relative"
                      >
                        <div className="flex justify-between mb-4">
                           <span className="text-emerald-500 font-black text-xs uppercase tracking-[0.2em]">Credentials Generated</span>
                           <button onClick={() => dispatch(clearUserState())} className="text-slate-400 hover:text-white transition-colors">
                              <X className="w-4 h-4" />
                           </button>
                        </div>
                        <div className="space-y-3 font-mono">
                          <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                            <span className="text-slate-400 text-xs">EMAIL</span>
                            <span className="text-white text-sm">{createdCredentials.email}</span>
                          </div>
                          <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                            <span className="text-slate-400 text-xs">TEMP PASSWORD</span>
                            <span className="text-orange-400 font-bold tracking-widest">{createdCredentials.password}</span>
                          </div>
                        </div>
                        <p className="mt-4 text-[10px] text-emerald-500/70 italic text-center uppercase tracking-widest font-bold">Please share these credentials securely with the user.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Access Level</label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="w-full bg-slate-900/80 border border-white/10 rounded-2xl p-4 text-white font-bold appearance-none focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                        >
                          <option value="Project Manager">Project Manager</option>
                          <option value="Contractor">Contractor</option>
                        </select>
                      </div>

                      <Input 
                        label={<span className="text-xs font-black text-slate-500 uppercase tracking-widest">User Corporate Email</span>}
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        placeholder={`e.g. name@${companyName}.com`}
                        className="bg-slate-900/80 border-white/10 text-white p-4 rounded-2xl focus:ring-orange-500"
                      />

                      {formData.role === 'Contractor' && (
                        <div className="space-y-3">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Field Specialization</label>
                          <select 
                            name="specialization" 
                            value={formData.specialization} 
                            onChange={handleChange} 
                            className="w-full bg-slate-900/80 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none"
                          >
                            <option value="">Select Domain...</option>
                            <option value="Electrical">Electrical Engineering</option>
                            <option value="Plumbing">Plumbing & HVAC</option>
                            <option value="Foundation">Structural Foundation</option>
                            <option value="Civil">Civil Construction</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-5 rounded-[1.2rem] font-black uppercase tracking-widest text-sm shadow-2xl transition-all flex items-center justify-center
                          ${loading ? 'bg-orange-600/50 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-500 shadow-orange-900/40 text-white'}`}
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Secure Access'}
                      </button>
                    </motion.div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;