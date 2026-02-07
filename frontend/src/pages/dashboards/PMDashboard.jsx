import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Building } from 'lucide-react'; // Add these icons
import { useDispatch, useSelector } from 'react-redux';
import { 
  createProject, 
  fetchProjects, 
  fetchContractors, 
  assignContractor, 
  fetchProjectTeam, // New Thunk
  clearProjectState 
} from '../../features/projects/projectSlice';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { 
  LayoutDashboard, 
  PlusSquare, 
  UserPlus, 
  LogOut, 
  Briefcase, 
  HardHat, 
  X 
} from 'lucide-react';

const PMDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Selectors
  const { projects, contractors, currentProjectTeam, successMessage, error } = useSelector((state) => state.projects);

  // Layout State
  const [activeView, setActiveView] = useState('overview'); // overview, create, assign
  const [selectedProject, setSelectedProject] = useState(null); // For Modal

  // Form States
  const [projectForm, setProjectForm] = useState({ project_name: '', budget: '' ,location: '', 
    project_type: 'Residential', // Default
    start_date: '',
    end_date: ''});
  const [assignForm, setAssignForm] = useState({ project_id: '', contractor_id: '' });

  // Initial Fetch
  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchContractors());
  }, [dispatch]);

const handleCreate = (e) => {
    e.preventDefault();
    dispatch(createProject(projectForm)).then((res) => {
      if (!res.error) {
        dispatch(fetchProjects());
        // Reset form
        setProjectForm({ 
          project_name: '', 
          budget: '', 
          location: '', 
          project_type: 'Residential', 
          start_date: '', 
          end_date: '' 
        });
        setActiveView('overview');
      }
    });
  };

  const handleAssign = (e) => {
    e.preventDefault();
    dispatch(assignContractor(assignForm)).then((res) => {
      if(!res.error) {
        setAssignForm({ project_id: '', contractor_id: '' });
      }
    });
  };

  const handleCardClick = (project) => {
    setSelectedProject(project);
    dispatch(fetchProjectTeam(project.project_id));
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Sidebar Component
  const SidebarItem = ({ icon: Icon, label, viewName }) => (
    <button
      onClick={() => { setActiveView(viewName); setSelectedProject(null); }}
      className={`w-full flex items-center space-x-3 px-6 py-4 text-left transition-all duration-200 border-l-4
        ${activeView === viewName 
          ? 'bg-blue-50 border-blue-600 text-blue-700' 
          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
    >
      <Icon className={`w-5 h-5 ${activeView === viewName ? 'text-blue-600' : 'text-gray-400'}`} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* 1. SIDEBAR */}
      <aside className="w-64 bg-white shadow-xl z-10 flex flex-col">
        <div className="h-20 flex items-center justify-center border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg shadow-md">
              <Briefcase className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-gray-800">Project Manager</h1>
          </div>
        </div>

        <nav className="flex-1 py-6 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="My Projects" viewName="overview" />
          <SidebarItem icon={PlusSquare} label="Create Project" viewName="create" />
          <SidebarItem icon={UserPlus} label="Assign Contractor" viewName="assign" />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center space-x-3 px-6 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        
        {/* Top Notification Area */}
        {successMessage && (
          <div className="absolute top-4 right-8 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-20 flex items-center">
             <span>{successMessage}</span>
             <button onClick={() => dispatch(clearProjectState())} className="ml-4 font-bold">&times;</button>
          </div>
        )}
        {error && (
          <div className="absolute top-4 right-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-20 flex items-center">
             <span>{error}</span>
             <button onClick={() => dispatch(clearProjectState())} className="ml-4 font-bold">&times;</button>
          </div>
        )}

        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {activeView === 'overview' ? 'My Projects' : 
             activeView === 'create' ? 'Launch New Project' : 'Team Allocation'}
          </h2>
        </header>

{/* --- VIEW: OVERVIEW (CARD GRID) --- */}
        {activeView === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div 
                  key={project.project_id} 
                  onClick={() => handleCardClick(project)}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                    {/* Show Project Type Badge */}
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                      {project.project_type}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {project.project_name}
                  </h3>
                  
                  {/* Show Location */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                    {project.location || 'No Location'}
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500 mt-4 pt-4 border-t border-gray-50">
                    <span>Budget</span>
                    <span className="font-bold text-gray-800">₹{Number(project.budget).toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              // ... (Empty state remains same)
              <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500 text-lg">You haven't created any projects yet.</p>
                  <button onClick={() => setActiveView('create')} className="text-blue-600 font-bold mt-2 hover:underline">
                    Create your first project
                  </button>
              </div>
            )}
          </div>
        )}

        {/* --- VIEW: CREATE PROJECT --- */}
        {activeView === 'create' && (
          <div className="max-w-2xl bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <PlusSquare className="text-blue-600" /> Project Details
            </h3>
            
            <form onSubmit={handleCreate} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input 
                  label="Project Name" 
                  name="project_name" 
                  value={projectForm.project_name} 
                  onChange={(e) => setProjectForm({...projectForm, project_name: e.target.value})} 
                  placeholder="e.g., City Center Mall"
                  required
                />
                
                {/* Project Type Dropdown */}
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Project Type</label>
                  <select
                    className="w-full border rounded-lg px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={projectForm.project_type}
                    onChange={(e) => setProjectForm({...projectForm, project_type: e.target.value})}
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input 
                  label="Total Budget (₹)" 
                  name="budget" 
                  type="number"
                  value={projectForm.budget} 
                  onChange={(e) => setProjectForm({...projectForm, budget: e.target.value})} 
                  placeholder="e.g., 10000000"
                  required
                />
                <Input 
                  label="Location" 
                  name="location" 
                  value={projectForm.location} 
                  onChange={(e) => setProjectForm({...projectForm, location: e.target.value})} 
                  placeholder="e.g., Mumbai, Andheri East"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input 
                  label="Start Date" 
                  name="start_date" 
                  type="date"
                  value={projectForm.start_date} 
                  onChange={(e) => setProjectForm({...projectForm, start_date: e.target.value})} 
                  required
                />
                <Input 
                  label="Expected End Date" 
                  name="end_date" 
                  type="date"
                  value={projectForm.end_date} 
                  onChange={(e) => setProjectForm({...projectForm, end_date: e.target.value})} 
                  required
                />
              </div>

              <div className="pt-4">
                <Button text="Create Project" type="submit" variant="primary" className="w-full py-3 bg-blue-600 hover:bg-blue-700" />
              </div>
            </form>
          </div>
        )}

        {/* --- VIEW: ASSIGN CONTRACTOR --- */}
        {activeView === 'assign' && (
          <div className="max-w-xl bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <UserPlus className="text-blue-600" /> Assign Contractor
            </h3>
            <form onSubmit={handleAssign} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Select Project</label>
                <select 
                  className="w-full border rounded-lg px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) => setAssignForm({...assignForm, project_id: e.target.value})}
                  value={assignForm.project_id}
                  required
                >
                  <option value="">-- Choose Project --</option>
                  {projects.map(p => (
                    <option key={p.project_id} value={p.project_id}>{p.project_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Select Contractor</label>
                <select 
                  className="w-full border rounded-lg px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) => setAssignForm({...assignForm, contractor_id: e.target.value})}
                  value={assignForm.contractor_id}
                  required
                >
                  <option value="">-- Choose Contractor --</option>
                  {contractors.map(c => (
                    <option key={c.user_id} value={c.user_id}>
                      {c.email} — {c.contractor_specialization || 'General'}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="pt-4">
                <Button text="Assign Contractor" type="submit" variant="primary" className="w-full py-3 bg-blue-600 hover:bg-blue-700" />
              </div>
            </form>
          </div>
        )}

        {/* --- PROJECT DETAILS MODAL --- */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
              
              {/* Modal Header */}
              <div className="bg-blue-600 p-6 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedProject.project_name}</h3>
                  <p className="text-blue-100 mt-1">Budget: ₹{Number(selectedProject.budget).toLocaleString()}</p>
                </div>
                <button onClick={closeModal} className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body: Team List */}
              <div className="p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <HardHat className="text-orange-500" /> Assigned Team
                </h4>
                
                <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                  {currentProjectTeam && currentProjectTeam.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {currentProjectTeam.map((member) => (
                        <div key={member.user_id} className="p-4 flex items-center justify-between hover:bg-white transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                              {member.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{member.email}</p>
                              <p className="text-xs text-gray-500">Joined: {new Date(member.assigned_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold uppercase rounded-full border border-orange-100">
                            {member.contractor_specialization || 'General'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <p>No contractors assigned yet.</p>
                      <button 
                        onClick={() => { closeModal(); setActiveView('assign'); }}
                        className="text-blue-600 font-bold mt-2 hover:underline text-sm"
                      >
                        Assign one now
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-gray-50 text-right border-t border-gray-100">
                <button onClick={closeModal} className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default PMDashboard;