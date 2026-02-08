import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegistrations, approveCompany, rejectCompany, clearAdminMsg } from '../features/admin/adminSlice';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LogOut, CheckCircle, XCircle, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const { list, message, newCredentials } = useSelector((state) => state.admin);

  useEffect(() => {
    if (token) {
      dispatch(fetchRegistrations(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
  }, [message]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navbar */}
      <nav className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <Shield className="text-blue-400" size={28} />
          <h1 className="text-xl font-bold tracking-wide">System Admin</h1>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-300 hover:text-white transition">
          <LogOut size={18} /> Logout
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        
        {/* Success Credentials Box */}
        {newCredentials && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded shadow-sm relative animate-fade-in">
            <h4 className="font-bold text-green-800 mb-2">✅ Company Approved & User Created</h4>
            <div className="bg-white p-3 rounded border border-green-200 text-sm">
              <p><strong>Email:</strong> {newCredentials.email}</p>
              <p><strong>Password:</strong> {newCredentials.password}</p>
            </div>
            <p className="text-xs text-green-600 mt-2">Please share these credentials with the company owner.</p>
            <button 
              onClick={() => dispatch(clearAdminMsg())} 
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 font-bold"
            >✕</button>
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Pending Registrations</h2>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Company Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Owner Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Mobile</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {list.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    No pending registrations found.
                  </td>
                </tr>
              ) : (
                list.map((reg) => (
                  <tr key={reg.registration_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{reg.registration_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{reg.company_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reg.owner_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.mobile_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => dispatch(approveCompany({ id: reg.registration_id, token }))}
                          className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold hover:bg-green-200 transition"
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button
                          onClick={() => dispatch(rejectCompany({ id: reg.registration_id, token }))}
                          className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold hover:bg-red-200 transition"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;