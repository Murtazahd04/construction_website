import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSubUser, clearUserState } from '../../features/users/userSlice';
import { logout } from '../../features/auth/authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage, createdCredentials } = useSelector((state) => state.users);

  const [formData, setFormData] = useState({
    email: '',
    role: 'Project Manager', // Default
    specialization: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createSubUser(formData));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
          <Button text="Logout" onClick={handleLogout} variant="secondary" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New User</h2>
          
          {/* Success Message & Credentials Display */}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              <strong className="font-bold">User Created! </strong>
              <span className="block sm:inline">{successMessage}</span>
              {createdCredentials && (
                <div className="mt-2 text-sm bg-white p-2 rounded border border-green-200">
                  <p><strong>Email:</strong> {createdCredentials.email}</p>
                  <p><strong>Password:</strong> {createdCredentials.password}</p>
                  <p className="text-xs text-gray-500 mt-1">(Please copy these credentials safely)</p>
                </div>
              )}
              <button onClick={() => dispatch(clearUserState())} className="absolute top-0 right-0 px-4 py-3">
                <span className="text-xl">&times;</span>
              </button>
            </div>
          )}

          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            
            {/* Role Selection */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Select Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            />

            {/* Conditional Input: Specialization (Only for Contractors) */}
            {formData.role === 'Contractor' && (
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Contractor Specialization</label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Specialization...</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Foundation">Foundation</option>
                  <option value="Civil">Civil</option>
                </select>
              </div>
            )}

            <Button 
              text={loading ? 'Creating...' : 'Create User'} 
              type="submit" 
              variant="primary" 
              disabled={loading}
            />
          </form>
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;