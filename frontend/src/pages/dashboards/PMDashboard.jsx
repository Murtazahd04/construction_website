import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createProject, 
  fetchProjects, 
  fetchContractors, 
  assignContractor, 
  fetchProjectTeam, 
  clearProjectState 
} from '../../features/projects/projectSlice';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  PlusSquare, 
  UserPlus, 
  LogOut, 
  Briefcase, 
  HardHat, 
  X,
  MapPin,
  Calendar,
  IndianRupee,
  Layers,
  ArrowRight,
  Loader2
} from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';

const PMDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); 
  
  const { projects, contractors, currentProjectTeam, successMessage, error, loading } = useSelector((state) => state.projects);

  const [activeView, setActiveView] = useState('overview'); 
  const [selectedProject, setSelectedProject] = useState(null); 

  const [projectForm, setProjectForm] = useState({ 
    project_name: '', 
    budget: '' ,
    location: '', 
    project_type: 'Residential', 
    start_date: '',
    end_date: ''
  });
  const [assignForm, setAssignForm] = useState({ project_id: '', contractor_id: '' });

  useEffect(() => {
    if (token) {
      dispatch(fetchProjects(token));
      dispatch(fetchContractors(token));
    } else {
      navigate('/login');
    }
  }, [dispatch, token, navigate]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearProjectState());
    }
    if (error) {
      toast.error(error);
      dispatch(clearProjectState());
    }
  }, [successMessage, error, dispatch]);

  const handleCreate = (e) => {
    e.preventDefault();
    dispatch(createProject({ data: projectForm, token })).then((res) => {
      if (!res.error) {
        dispatch(fetchProjects(token));
        setProjectForm({ 
          project_name: '', budget: '', location: '', 
          project_type: 'Residential', start_date: '', end_date: '' 
        });
        setActiveView('overview');
      }
    });
  };

  const handleAssign = (e) => {
    e.preventDefault();
    dispatch(assignContractor({ data: assignForm, token })).then((res) => {
      if(!res.error) setAssignForm({ project_id: '', contractor_id: '' });
    });
  };

  const handleCardClick = (project) => {
    setSelectedProject(project);
    dispatch(fetchProjectTeam({ projectId: project.project_id, token }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const SidebarItem = ({ icon: Icon, label, viewName }) => (
    <button
      onClick={() => { setActiveView(viewName); setSelectedProject(null); }}
      className={`relative w-full flex items-center space-x-3 px-6 py-4 transition-all duration-300 group
        ${activeView === viewName ? 'text-blue-500' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
    >
      {activeView === viewName && (
        <motion.div layoutId="activeNavPM" className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full" />
      )}
      <Icon className={`w-5 h-5 transition-colors ${activeView === viewName ? 'text-blue-500' : 'group-hover:text-white'}`} />
      <span className="font-bold text-sm tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 border-r border-white/5 flex flex-col z-20">
        <div className="h-24 flex items-center px-8 border-b border-white/5">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 mr-4">
            <Briefcase className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase">PM Hub</span>
        </div>

        <nav className="flex-1 py-8 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard Overview" viewName="overview" />
          <SidebarItem icon={PlusSquare} label="Launch Project" viewName="create" />
          <SidebarItem icon={UserPlus} label="Team Allocation" viewName="assign" />
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all group">
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="font-bold text-sm">Logout Session</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-900 to-[#0f172a] relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto p-10 relative z-10">
          <header className="mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-4xl font-extrabold text-white tracking-tight italic">
                {activeView === 'overview' ? 'Active Operations' : 
                 activeView === 'create' ? 'Project Initiation' : 'Resource Management'}
              </h2>
              <p className="text-slate-400 mt-2 text-lg">Manage sites, budgets, and contractor workflows.</p>
            </motion.div>
          </header>

          <AnimatePresence mode="wait">
            {/* VIEW: OVERVIEW */}
            {activeView === 'overview' && (
              <motion.div 
                key="ov" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {projects.length > 0 ? (
                  projects.map((project, idx) => (
                    <motion.div 
                      key={project.project_id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleCardClick(project)}
                      className="group bg-white/5 backdrop-blur-md border border-white/10 p-7 rounded-[2rem] hover:border-blue-500/50 hover:bg-white/10 transition-all cursor-pointer shadow-2xl"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 group-hover:rotate-6 transition-transform">
                          <Layers className="w-6 h-6 text-blue-500" />
                        </div>
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-800 text-slate-400 border border-white/5">
                          {project.project_type}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{project.project_name}</h3>
                      
                      <div className="flex items-center text-slate-400 text-sm mb-6">
                        <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                        {project.location || 'Undisclosed Location'}
                      </div>

                      <div className="pt-5 border-t border-white/5 flex justify-between items-center">
                         <div>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Budget</p>
                            <p className="text-white font-bold text-lg">₹{Number(project.budget).toLocaleString()}</p>
                         </div>
                         <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                            <ArrowRight className="w-5 h-5 text-white" />
                         </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-24 text-center bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
                     <p className="text-slate-500 text-xl font-medium">No active project records found.</p>
                     <button onClick={() => setActiveView('create')} className="mt-4 px-8 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-500 transition-all">Launch First Project</button>
                  </div>
                )}
              </motion.div>
            )}

            {/* VIEW: CREATE PROJECT */}
            {activeView === 'create' && (
              <motion.div key="cr" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-3xl">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
                  <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                    <PlusSquare className="text-blue-500" /> Project Specification
                  </h3>
                  
                  <form onSubmit={handleCreate} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input 
                        label={<span className="text-xs font-black text-slate-500 uppercase tracking-widest">Project Name</span>}
                        value={projectForm.project_name} 
                        onChange={(e) => setProjectForm({...projectForm, project_name: e.target.value})} 
                        className="bg-slate-900/80 border-white/10 text-white rounded-2xl"
                        required
                      />
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Infrastructure Category</label>
                        <select
                          className="w-full bg-slate-900/80 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          value={projectForm.project_type}
                          onChange={(e) => setProjectForm({...projectForm, project_type: e.target.value})}
                        >
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Industrial">Industrial</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input 
                        label={<span className="text-xs font-black text-slate-500 uppercase tracking-widest">CapEx Budget (₹)</span>}
                        type="number" value={projectForm.budget} 
                        onChange={(e) => setProjectForm({...projectForm, budget: e.target.value})} 
                        className="bg-slate-900/80 border-white/10 text-white rounded-2xl"
                        required
                      />
                      <Input 
                        label={<span className="text-xs font-black text-slate-500 uppercase tracking-widest">Site Coordinates / Location</span>}
                        value={projectForm.location} 
                        onChange={(e) => setProjectForm({...projectForm, location: e.target.value})} 
                        className="bg-slate-900/80 border-white/10 text-white rounded-2xl"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input 
                        label={<span className="text-xs font-black text-slate-500 uppercase tracking-widest">Mobilization Date</span>}
                        type="date" value={projectForm.start_date} 
                        onChange={(e) => setProjectForm({...projectForm, start_date: e.target.value})} 
                        className="bg-slate-900/80 border-white/10 text-white rounded-2xl invert-calendar-icon"
                        required
                      />
                      <Input 
                        label={<span className="text-xs font-black text-slate-500 uppercase tracking-widest">Target Completion</span>}
                        type="date" value={projectForm.end_date} 
                        onChange={(e) => setProjectForm({...projectForm, end_date: e.target.value})} 
                        className="bg-slate-900/80 border-white/10 text-white rounded-2xl invert-calendar-icon"
                        required
                      />
                    </div>

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-900/20">
                         {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Authorize Project Launch'}
                      </button>
                    </motion.div>
                  </form>
                </div>
              </motion.div>
            )}

            {/* VIEW: ASSIGN CONTRACTOR */}
            {activeView === 'assign' && (
              <motion.div key="as" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
                  <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                    <UserPlus className="text-blue-500" /> Personnel Assignment
                  </h3>
                  <form onSubmit={handleAssign} className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Target Project</label>
                      <select 
                        className="w-full bg-slate-900/80 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none"
                        onChange={(e) => setAssignForm({...assignForm, project_id: e.target.value})}
                        value={assignForm.project_id} required
                      >
                        <option value="">-- Choose Project --</option>
                        {projects.map(p => <option key={p.project_id} value={p.project_id}>{p.project_name}</option>)}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Certified Contractor</label>
                      <select 
                        className="w-full bg-slate-900/80 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none"
                        onChange={(e) => setAssignForm({...assignForm, contractor_id: e.target.value})}
                        value={assignForm.contractor_id} required
                      >
                        <option value="">-- Choose Contractor --</option>
                        {contractors.map(c => (
                          <option key={c.user_id} value={c.user_id}>
                            {c.email} {c.specialization ? `— ${c.specialization}` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <button type="submit" className="w-full py-5 bg-slate-100 hover:bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest shadow-xl">
                        Finalize Assignment
                      </button>
                    </motion.div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MODAL: PROJECT DETAILS */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden relative z-10"
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">{selectedProject.project_name}</h3>
                      <div className="flex items-center gap-4 mt-3">
                         <span className="flex items-center gap-1 text-blue-100 text-sm font-bold"><IndianRupee className="w-4 h-4" /> {Number(selectedProject.budget).toLocaleString()}</span>
                         <span className="w-1.5 h-1.5 rounded-full bg-blue-300 opacity-50" />
                         <span className="flex items-center gap-1 text-blue-100 text-sm font-bold"><Calendar className="w-4 h-4" /> {selectedProject.project_type}</span>
                      </div>
                    </div>
                    <button onClick={() => setSelectedProject(null)} className="text-white bg-white/10 hover:bg-white/20 p-3 rounded-2xl transition-all">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-10">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                    <HardHat className="text-blue-500 w-4 h-4" /> Assigned Site Personnel
                  </h4>
                  
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {currentProjectTeam && currentProjectTeam.length > 0 ? (
                      currentProjectTeam.map((member) => (
                        <div key={member.user_id} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 font-black border border-blue-500/20">
                              {member.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{member.email}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Contractor Level Access</p>
                            </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Assigned</p>
                             <p className="text-xs text-slate-300 mt-1">{new Date(member.assigned_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No Site Personnel Allocated</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default PMDashboard;