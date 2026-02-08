import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerCompany, resetAuth } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, User, Mail, Phone, ArrowRight, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

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

  // SUCCESS STATE UI
  if (successMessage) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px]" />
        </div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl text-center max-w-md w-full"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2">Request Sent!</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Your registration is successful. Our team will review your details and send credentials to <span className="text-emerald-400 font-medium">{formData.email}</span> once approved.
          </p>
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl mb-8">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Next Step</p>
            <p className="text-sm text-slate-300 mt-1">Wait for Admin Approval (24-48h)</p>
          </div>
          <Button 
            text="Return Home" 
            onClick={() => navigate('/')} 
            className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl transition-all"
          />
        </motion.div>
      </div>
    );
  }

  // REGISTRATION FORM UI
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-600/10 blur-[120px]" />
        <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl">
          
          <div className="text-center mb-10">
            <motion.div 
              whileHover={{ rotate: 10 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 mb-6 shadow-lg shadow-orange-900/40"
            >
              <Building2 className="w-7 h-7 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Register Company</h2>
            <p className="text-slate-400 text-sm mt-2 font-medium">Create your organization's digital workspace</p>
          </div>
          
          <AnimatePresence mode='wait'>
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-bold text-sm">Submission Error</p>
                  <p className="text-xs opacity-80">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
               <Input 
                label={<span className="text-slate-300 text-sm font-semibold">Company Name</span>}
                name="company_name" 
                value={formData.company_name} 
                onChange={handleChange} 
                placeholder="e.g. BuildRight Constructions" 
                required 
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 focus:ring-orange-500 transition-all"
              />
            </div>
            
            <Input 
              label={<span className="text-slate-300 text-sm font-semibold">Owner Name</span>}
              name="owner_name" 
              value={formData.owner_name} 
              onChange={handleChange} 
              placeholder="Full Name" 
              required 
              className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 focus:ring-orange-500 transition-all"
            />

            <Input 
              label={<span className="text-slate-300 text-sm font-semibold">Mobile Number</span>}
              name="mobile_number" 
              value={formData.mobile_number} 
              onChange={handleChange} 
              placeholder="+91 XXXXX XXXXX" 
              required 
              className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 focus:ring-orange-500 transition-all"
            />

            <div className="md:col-span-2">
              <Input 
                label={<span className="text-slate-300 text-sm font-semibold">Business Email</span>}
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="admin@company.com" 
                required 
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 focus:ring-orange-500 transition-all"
              />
            </div>

            <motion.div 
              className="md:col-span-2 mt-4"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <button 
                type="submit" 
                disabled={loading}
                className={`group w-full py-4 rounded-xl text-md font-bold text-white shadow-xl flex items-center justify-center transition-all
                  ${loading ? 'bg-orange-600/50 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-500 shadow-orange-900/20'}`}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <>
                    Submit Registration Request
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.div>
          </form>

          <p className="mt-8 text-center text-slate-500 text-xs">
            By registering, you agree to our <span className="text-slate-300 underline cursor-pointer">Terms of Service</span> and <span className="text-slate-300 underline cursor-pointer">Data Privacy Policy</span>.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterCompany;