import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createProject, 
  fetchProjects, 
  fetchContractors, 
  assignContractor, 
  clearProjectState 
} from '../../features/projects/projectSlice';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const PMDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Selectors
  const { projects, contractors, successMessage, error } = useSelector((state) => state.projects);

  // Local State
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'assign'
  const [projectForm, setProjectForm] = useState({ project_name: '', budget: '' });
  const [assignForm, setAssignForm] = useState({ project_id: '', contractor_id: '' });

  // Initial Fetch
  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchContractors());
  }, [dispatch]);

  // Handlers
  const handleCreate = (e) => {
    e.preventDefault();
    dispatch(createProject(projectForm)).then(() => {
        dispatch(fetchProjects()); // Refresh list
        setProjectForm({ project_name: '', budget: '' });
    });
  };

  const handleAssign = (e) => {
    e.preventDefault();
    dispatch(assignContractor(assignForm));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">Project Manager Dashboard</h1>
            <Button text="Logout" onClick={handleLogout} variant="secondary" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        
        {/* Notifications */}
        {successMessage && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
             <strong className="font-bold">Success: </strong> {successMessage}
             <button onClick={() => dispatch(clearProjectState())} className="absolute top-0 right-0 px-4 py-3">&times;</button>
          </div>
        )}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
             <strong className="font-bold">Error: </strong> {error}
             <button onClick={() => dispatch(clearProjectState())} className="absolute top-0 right-0 px-4 py-3">&times;</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT COLUMN: Actions */}
          <div className="space-y-6">
            
            {/* Toggle Tabs */}
            <div className="bg-white rounded-lg shadow p-2 flex space-x-2">
                <button 
                  className={`flex-1 py-2 rounded-md font-medium ${activeTab === 'create' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setActiveTab('create')}
                >
                  Create Project
                </button>
                <button 
                  className={`flex-1 py-2 rounded-md font-medium ${activeTab === 'assign' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setActiveTab('assign')}
                >
                  Assign Contractor
                </button>
            </div>

            {/* ACTION FORMS */}
            <div className="bg-white shadow rounded-lg p-6">
              {activeTab === 'create' ? (
                <form onSubmit={handleCreate}>
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">New Project Details</h2>
                  <Input 
                    label="Project Name" 
                    name="project_name" 
                    value={projectForm.project_name} 
                    onChange={(e) => setProjectForm({...projectForm, project_name: e.target.value})} 
                    placeholder="e.g., Downtown Plaza Construction"
                    required
                  />
                  <Input 
                    label="Budget (₹)" 
                    name="budget" 
                    type="number"
                    value={projectForm.budget} 
                    onChange={(e) => setProjectForm({...projectForm, budget: e.target.value})} 
                    placeholder="e.g., 5000000"
                    required
                  />
                  <Button text="Create Project" type="submit" className="w-full mt-4" />
                </form>
              ) : (
                <form onSubmit={handleAssign}>
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Assign Contractor</h2>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Select Project</label>
                    <select 
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => setAssignForm({...assignForm, project_id: e.target.value})}
                      required
                    >
                      <option value="">-- Choose Project --</option>
                      {projects.map(p => (
                        <option key={p.project_id} value={p.project_id}>{p.project_name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Select Contractor</label>
                    <select 
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => setAssignForm({...assignForm, contractor_id: e.target.value})}
                      required
                    >
                      <option value="">-- Choose Contractor --</option>
                      {contractors.map(c => (
                        <option key={c.user_id} value={c.user_id}>
                          {c.email} ({c.contractor_specialization || 'General'})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <Button text="Assign Contractor" type="submit" className="w-full mt-4" />
                </form>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Project List */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">My Projects</h2>
            
            {projects.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No projects created yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projects.map((project) => (
                      <tr key={project.project_id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{project.project_name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹{parseFloat(project.budget).toLocaleString()}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {new Date(project.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default PMDashboard;