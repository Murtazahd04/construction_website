import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerCompany, resetAuth } from '../features/auth/authSlice';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

const RegisterCompany = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, successMessage, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    company_name: '',
    owner_name: '',
    email: '',
    mobile_number: '',
  });

  // Clear state when component mounts
  useEffect(() => {
    dispatch(resetAuth());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerCompany(formData));
  };

  if (successMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-green-50">
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Registration Successful!</h2>
          <p className="text-gray-700">{successMessage}</p>
          <p className="text-sm text-gray-500 mt-2">Wait for Admin approval to receive your credentials.</p>
          <div className="mt-6">
            <Button text="Back to Home" onClick={() => navigate('/')} variant="primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Company Registration</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <Input 
            label="Company Name" 
            name="company_name" 
            value={formData.company_name} 
            onChange={handleChange} 
            placeholder="Enter company name" 
            required 
          />
          <Input 
            label="Owner Name" 
            name="owner_name" 
            value={formData.owner_name} 
            onChange={handleChange} 
            placeholder="Enter owner name" 
            required 
          />
          <Input 
            label="Email" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Enter email" 
            required 
          />
          <Input 
            label="Mobile Number" 
            name="mobile_number" 
            value={formData.mobile_number} 
            onChange={handleChange} 
            placeholder="Enter mobile number" 
            required 
          />

          <div className="mt-6">
            <Button 
              text={loading ? 'Submitting...' : 'Register Company'} 
              type="submit" 
              variant="primary" 
              disabled={loading}
              className="w-full"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterCompany;