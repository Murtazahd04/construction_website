// frontend/src/pages/RegisterCompany.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerCompany, resetState } from '../features/company/companySlice';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, ArrowLeft } from 'lucide-react';

const RegisterCompany = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, successMessage } = useSelector((state) => state.company);

  const [formData, setFormData] = useState({
    legal_name: '',
    trade_name: '',
    structure: 'Private Limited Company',
    establishment_year: '',
    address: '',
    phone: '',
    email: '',
    website: ''
  });

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        dispatch(resetState());
        navigate('/login');
      }, 2000);
    }
  }, [successMessage, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerCompany(formData));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-2 mb-6 text-gray-500 hover:text-gray-900">
           <ArrowLeft size={20} /> Back to Home
        </Link>
        <div className="flex justify-center">
            <div className="w-12 h-12 bg-orange-500 rounded flex items-center justify-center">
                <Building2 className="text-white w-7 h-7" />
            </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register Your Company
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Start managing your construction projects today.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {successMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded relative">
              {successMessage} Redirecting...
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                
                {/* Legal Name - REQUIRED */}
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Legal Entity Name <span className="text-red-500">*</span>
                    </label>
                    <input type="text" name="legal_name" required onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
                        placeholder="e.g. ABC Construction Pvt Ltd"/>
                </div>

                {/* Trade Name */}
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Trade Name / DBA</label>
                    <input type="text" name="trade_name" onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
                        placeholder="e.g. ABC Homes"/>
                </div>

                {/* Business Structure */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Business Structure</label>
                    <select name="structure" onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500">
                        <option>Private Limited Company</option>
                        <option>Sole Proprietorship</option>
                        <option>Partnership</option>
                        <option>LLP</option>
                        <option>Other</option>
                    </select>
                </div>

                {/* Year Est */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Year of Establishment</label>
                    <input type="number" name="establishment_year" onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
                        placeholder="2020"/>
                </div>

                {/* Address - REQUIRED */}
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Registered Office Address <span className="text-red-500">*</span>
                    </label>
                    <textarea name="address" rows={3} required onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"/>
                </div>

                {/* Phone - REQUIRED */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input type="tel" name="phone" required onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"/>
                </div>

                {/* Email - REQUIRED */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input type="email" name="email" required onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"/>
                </div>

                 <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Website (Optional)</label>
                    <input type="url" name="website" onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
                        placeholder="https://"/>
                </div>

            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${isLoading ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
              >
                {isLoading ? 'Registering...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterCompany;