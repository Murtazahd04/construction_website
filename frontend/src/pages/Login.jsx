import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <Input 
            label="Email" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Password" 
            name="password" 
            type="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
          <Button 
            text={loading ? 'Logging in...' : 'Login'} 
            type="submit" 
            variant="primary" 
            className="w-full mt-4"
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default Login;