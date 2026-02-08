import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSubUser, clearUserState } from '../../features/users/userSlice';
import { fetchOwnerProjects } from '../../features/projects/projectSlice';
import { logout } from '../../features/auth/authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, LogOut, LayoutDashboard } from 'lucide-react';
// 1. IMPORT TOAST
import { toast } from 'react-toastify';

const OwnerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get Token
  const token = localStorage.getItem('token');

  // Selectors (Added 'error' to the destruction)
  const { loading, successMessage, error, createdCredentials } = useSelector((state) => state.users);
  const { projects } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);

  const [activeView, setActiveView] = useState('dashboard');
  const [formData, setFormData] = useState({ email: '', role: 'Project Manager', specialization: '' });

  // --- 2. ADD TOAST EFFECT ---
  useEffect(() => {
    // Show Success Toast
    if (successMessage) {
      toast.success(successMessage);
      // Note: We do NOT clear state here immediately, 
      // because we need the inline box to stay visible so the user can copy the password.
    }

    // Show Error Toast
    if (error) {
      toast.error(error);
      dispatch(clearUserState()); // Clear error immediately after toast
    }
  }, [successMessage, error, dispatch]);

  // Fetch Projects Logic
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

  const SidebarItem = ({ icon: Icon, label, viewName }) => (
    <button
      onClick={() => setActiveView(viewName)}
      className={`w-full flex items-center space-x-3 px-6 py-4 text-left transition-all duration-200 border-l-4
        ${activeView === viewName
          ? 'bg-orange-50 border-orange-500 text-orange-700'
          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
    >
      <Icon className={`w-5 h-5 ${activeView === viewName ? 'text-orange-600' : 'text-gray-400'}`} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-xl z-10 flex flex-col">
        <div className="h-20 flex items-center justify-center border-b border-gray-100">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3 shadow-lg">
            <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Owner Panel</h1>
        </div>
        <nav className="flex-1 py-6 space-y-1">
          <SidebarItem icon={Briefcase} label="Active Projects" viewName="dashboard" />
          <SidebarItem icon={Users} label="Create User" viewName="createUser" />
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center space-x-3 px-6 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {activeView === 'dashboard' ? 'Project Overview' : 'User Management'}
          </h2>
          <p className="text-gray-500 mt-1">
            {activeView === 'dashboard' ? 'Track all ongoing construction projects.' : 'Add new managers and contractors to your team.'}
          </p>
        </header>

        {activeView === 'dashboard' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <div key={project.project_id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      Active
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{project.project_name}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Budget: ₹{Number(project.budget).toLocaleString()}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <div className="text-right text-xs text-gray-500">Project Started</div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-10 text-gray-500">
                No projects found. Ask your Project Managers to create one.
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-2xl">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-orange-100 rounded-full mr-4">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Create New Account</h3>
                  <p className="text-sm text-gray-500">Generate credentials for your team members.</p>
                </div>
              </div>

              {/* KEEP THIS BOX so users can see the password */}
              {successMessage && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r shadow-sm relative">
                  <p className="text-sm text-green-700 font-bold">{successMessage}</p>
                  {createdCredentials && (
                    <div className="mt-2 text-sm bg-white p-3 rounded border border-green-200">
                      <p><strong>Email:</strong> {createdCredentials.email}</p>
                      <p><strong>Password:</strong> {createdCredentials.password}</p>
                    </div>
                  )}
                  <button onClick={() => dispatch(clearUserState())} className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700">&times;</button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Select Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="block w-full p-3 border rounded-lg bg-gray-50"
                  >
                    <option value="Project Manager">Project Manager</option>
                    <option value="Contractor">Contractor</option>
                  </select>
                </div>

                <Input 
                  label="User Email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  placeholder={
                    formData.role === 'Project Manager' 
                      ? `projectmanager@${companyName}.com` 
                      : `contractor@${companyName}.com`
                  }
                />

                {formData.role === 'Contractor' && (
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Specialization</label>
                    <select name="specialization" value={formData.specialization} onChange={handleChange} className="block w-full p-3 border rounded-lg bg-gray-50">
                      <option value="">Select...</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Foundation">Foundation</option>
                      <option value="Civil">Civil</option>
                    </select>
                  </div>
                )}
                <Button text={loading ? 'Creating...' : 'Create User'} type="submit" variant="primary" className="w-full py-3 bg-gray-900 text-white rounded-lg" />
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OwnerDashboard;