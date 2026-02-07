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
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md mx-4 border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Success!</h2>
          <p className="text-gray-600 mb-6">{successMessage}</p>
          <p className="text-sm text-gray-500 mb-8 bg-gray-50 p-3 rounded-lg border border-gray-200">
            Please wait for Admin approval to receive your login credentials.
          </p>
          <div className="flex justify-center">
             <Button 
               text="Back to Home" 
               onClick={() => navigate('/')} 
               variant="primary" 
               className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-xl shadow-lg transition-transform hover:-translate-y-1"
             />
          </div>
        </div>
      </div>
    );
  }

  return (
    // 1. Changed background to Light Gray (bg-gray-50)
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      
      {/* 2. Card with Rounded Borders and Orange Top Border */}
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border-t-4 border-orange-600">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Register Company
          </h2>
          <p className="text-gray-500 text-sm mt-2">Start your construction journey</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 text-sm">
            <p className="font-bold">Registration Failed</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input 
            label="Company Name" 
            name="company_name" 
            value={formData.company_name} 
            onChange={handleChange} 
            placeholder="e.g. BuildRight Constructions" 
            required 
          />
          <Input 
            label="Owner Name" 
            name="owner_name" 
            value={formData.owner_name} 
            onChange={handleChange} 
            placeholder="e.g. John Doe" 
            required 
          />
          <Input 
            label="Email Address" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="name@company.com" 
            required 
          />
          <Input 
            label="Mobile Number" 
            name="mobile_number" 
            value={formData.mobile_number} 
            onChange={handleChange} 
            placeholder="+91 98765 43210" 
            required 
          />

          {/* 3. Button Centered and Styled with Orange Theme */}
          <div className="mt-8 flex justify-center">
            <Button 
              text={loading ? 'Submitting...' : 'Register Company'} 
              type="submit" 
              variant="primary" 
              disabled={loading}
              className={`w-full py-3 px-6 rounded-xl text-lg font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 hover:shadow-xl
                ${loading ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'}`}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterCompany;