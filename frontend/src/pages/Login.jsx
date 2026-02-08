import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
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
        case 'Admin':
          navigate('/admin-dashboard');
          break;
        case 'Owner':
          navigate('/owner-dashboard');
          break;
        case 'Project Manager':
          navigate('/project-manager-dashboard');
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
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-slate-950">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Main Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 mb-6 shadow-lg shadow-orange-900/40"
            >
              <Building2 className="w-8 h-8 text-white" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-white tracking-tight">BuildFlow</h1>
            <p className="text-slate-400 mt-2 text-sm font-medium uppercase tracking-[0.2em]">
              Construction Management
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Input
                label={<span className="text-slate-300 text-sm font-semibold">Email Address</span>}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@company.com"
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>

            <div className="relative">
              <Input
                label={<span className="text-slate-300 text-sm font-semibold">Password</span>}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center text-slate-400 cursor-pointer">
                <input type="checkbox" className="mr-2 accent-orange-500 rounded border-slate-700 bg-slate-800" />
                Remember me
              </label>
              <Link to="/forgot-password" size="sm" className="text-orange-500 hover:text-orange-400 font-medium transition-colors">
                Forgot password?
              </Link>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pt-4"
            >
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex items-center justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 shadow-lg shadow-orange-900/20 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.div>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-orange-500 font-bold hover:text-orange-400 transition-colors">
                Register Company
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Decorative Bar */}
        <div className="mt-8 flex justify-center space-x-6 text-slate-500 text-xs font-medium">
          <span>Privacy Policy</span>
          <span>•</span>
          <span>Terms of Service</span>
          <span>•</span>
          <span>Help Center</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;