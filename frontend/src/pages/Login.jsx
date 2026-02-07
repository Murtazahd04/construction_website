import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';


const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, role } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };

    // Redirect based on Role
    useEffect(() => {
        if (role) {
            switch (role) {
                case 'Owner':
                    navigate('/owner-dashboard');
                    break;
                case 'Project Manager':
                    navigate('/pm-dashboard');
                    break;
                case 'Contractor':
                    navigate('/contractor-dashboard');
                    break;
                case 'Site Engineer':
                    navigate('/site-engineer-dashboard');
                    break;
                case 'Supplier':
                    navigate('/supplier-dashboard');
                    break;
                default:
                    navigate('/');
            }
        }
    }, [role, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

return (
  <div 
    // Changed background from orange gradient to a clean, professional light gray
    className="flex items-center justify-center min-h-screen bg-gray-50 p-4"
  >
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border-t-4 border-orange-600">

      {/* Welcome Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-4 shadow-sm">
          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome To</h1>
        <p className="text-gray-500 mt-2 text-sm uppercase tracking-wide font-semibold">
          Construction Management System
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-6 text-gray-700 text-center">Login to your account</h2>

      <form onSubmit={handleSubmit}>
        <Input 
          label="Email Address" 
          name="email" 
          type="email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          placeholder="name@company.com"
        />
        <Input 
          label="Password" 
          name="password" 
          type="password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
          placeholder="Enter your password"
        />
        
        <div className="mt-8">
          <Button 
            text={loading ? 'Authenticating...' : 'Login'} 
            type="submit" 
            variant="primary" 
            className={`w-full py-3 text-lg font-bold text-white shadow-lg transition-all duration-300 
              bg-orange-600 
              hover:bg-orange-700 
              hover:shadow-xl 
              hover:-translate-y-1 
              ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={loading}
          />
        </div>
      </form>
      
    </div>
  </div>
);
};

export default Login;