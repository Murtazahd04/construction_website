import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegistrations, approveCompany, rejectCompany, clearAdminMsg } from '../../features/admin/adminSlice';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  LogOut, 
  CheckCircle, 
  XCircle, 
  Shield, 
  Building2, 
  Mail, 
  Phone, 
  Users, 
  Clock,
  ShieldCheck,
  Zap,
  Activity,
  Server
} from 'lucide-react';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const { list, message, newCredentials, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    if (token) {
      dispatch(fetchRegistrations(token));
    } else {
      navigate('/login');
    }
  }, [dispatch, token, navigate]);

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
  }, [message]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // --- Animation Variants ---
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 } 
    }
  };

  const itemVars = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  const glowVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans overflow-x-hidden relative">
      
      {/* 🌌 Advanced Animated Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          variants={glowVariants}
          animate="animate"
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-orange-600/10 blur-[140px]" 
        />
        <motion.div 
          variants={glowVariants}
          animate="animate"
          style={{ animationDelay: '2s' }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[140px]" 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* 🚀 Glassmorphism Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-950/40 backdrop-blur-2xl border-b border-white/5 px-8 py-4 flex justify-between items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]">
        <motion.div 
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-4"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500 blur-md opacity-20 animate-pulse"></div>
            <div className="relative w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-700 rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
              <Shield className="text-white" size={26} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">System Admin</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <p className="text-[9px] text-slate-400 font-black tracking-[0.4em] uppercase">Core Network Active</p>
            </div>
          </div>
        </motion.div>

        <motion.button 
          whileHover={{ scale: 1.05, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout} 
          className="group flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-red-400 transition-all font-black text-xs uppercase tracking-widest"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Terminate Session
        </motion.button>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto p-8 space-y-10">
        
        {/* 📊 System Overview Stats */}
        <motion.div 
          variants={containerVars}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Pending Queue', val: list.length, icon: Clock, color: 'text-orange-500' },
            { label: 'System Load', val: '24%', icon: Activity, color: 'text-blue-500' },
            { label: 'Verified Nodes', val: '1.2k', icon: ShieldCheck, color: 'text-emerald-500' },
            { label: 'Server Status', val: 'Stable', icon: Server, color: 'text-purple-500' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              variants={itemVars}
              whileHover={{ y: -5, borderColor: 'rgba(255,255,255,0.2)' }}
              className="bg-white/5 backdrop-blur-md border border-white/5 p-5 rounded-[2rem] flex items-center gap-4 transition-all"
            >
              <div className={`p-3 rounded-2xl bg-slate-900/50 border border-white/5 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
                <p className="text-xl font-black text-white">{stat.val}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 🔑 Credentials Dispatch UI */}
        <AnimatePresence>
          {newCredentials && (
            <motion.div 
              initial={{ height: 0, opacity: 0, scale: 0.95 }}
              animate={{ height: 'auto', opacity: 1, scale: 1 }}
              exit={{ height: 0, opacity: 0, scale: 0.95 }}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] p-8 relative shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] overflow-hidden group"
            >
              <div className="absolute -right-10 -bottom-10 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <Zap size={240} className="text-emerald-500" />
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/40">
                    <ShieldCheck className="text-slate-900" size={32} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white tracking-tight uppercase italic">Access Keys Provisioned</h4>
                    <p className="text-emerald-400/80 text-sm font-bold tracking-wide mt-1">Ready for deployment to organization lead.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Identity UID</p>
                    <p className="text-white font-mono text-sm">{newCredentials.email}</p>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Encrypted Hash</p>
                    <p className="text-orange-500 font-mono font-black text-sm tracking-widest">{newCredentials.password}</p>
                  </div>
                  <button 
                    onClick={() => dispatch(clearAdminMsg())} 
                    className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all self-center md:self-auto"
                  >
                    <XCircle size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 📋 Registry Table UI */}
        <div className="space-y-6">
          <div className="flex items-end justify-between px-2">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase flex items-center gap-3">
                Verification Queue
                <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-500 text-xs not-italic font-black tracking-widest">
                  {list.length} REQUESTS
                </span>
              </h2>
            </motion.div>
          </div>

          <motion.div 
            variants={containerVars}
            initial="hidden"
            animate="visible"
            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead className="bg-white/[0.02]">
                  <tr>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Registry Identifier</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Organization Specification</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Communication Node</th>
                    <th className="px-8 py-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Verification Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-transparent">
                  {list.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-32 text-center">
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }} 
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center gap-6"
                        >
                          <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center border border-white/5 shadow-inner">
                            <Building2 className="text-slate-700" size={48} strokeWidth={1} />
                          </div>
                          <div className="space-y-1">
                            <p className="text-slate-400 text-xl font-black uppercase tracking-widest">Registry Empty</p>
                            <p className="text-slate-600 text-sm font-medium tracking-wide">Awaiting incoming company encryption packets...</p>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  ) : (
                    list.map((reg, index) => (
                      <motion.tr 
                        key={reg.registration_id} 
                        variants={itemVars}
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                        className="transition-colors group"
                      >
                        <td className="px-8 py-8 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                            <span className="font-mono text-orange-500 font-black text-sm uppercase tracking-tighter">NODE-0{reg.registration_id}</span>
                          </div>
                        </td>
                        <td className="px-8 py-8 whitespace-nowrap">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-slate-950 border border-white/10 rounded-2xl flex items-center justify-center font-black text-2xl text-white group-hover:scale-110 group-hover:border-orange-500/50 transition-all duration-500 shadow-2xl">
                              {reg.company_name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-white font-black text-xl leading-none tracking-tight group-hover:text-orange-400 transition-colors uppercase italic">{reg.company_name}</p>
                              <p className="text-slate-500 text-[10px] mt-2 flex items-center gap-2 uppercase font-black tracking-[0.2em]">
                                 <Users size={12} className="text-orange-500" /> Authorized: {reg.owner_name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-8 whitespace-nowrap">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 text-slate-300 text-xs font-bold tracking-tight">
                              <div className="p-1.5 rounded-lg bg-white/5"><Mail size={12} className="text-blue-400" /></div>
                              {reg.email}
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 text-[11px] font-black tracking-[0.1em]">
                              <div className="p-1.5 rounded-lg bg-white/5"><Phone size={12} className="text-blue-400" /></div>
                              {reg.mobile_number}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-8 whitespace-nowrap text-center">
                          <div className="flex justify-center gap-4">
                            <motion.button
                              whileHover={{ scale: 1.1, backgroundColor: "rgba(16, 185, 129, 1)", color: "white" }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => dispatch(approveCompany({ id: reg.registration_id, token }))}
                              className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 text-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20 transition-all shadow-lg"
                            >
                              <CheckCircle size={14} /> Authorize
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 1)", color: "white" }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => dispatch(rejectCompany({ id: reg.registration_id, token }))}
                              className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-red-500/20 transition-all shadow-lg"
                            >
                              <XCircle size={14} /> Purge
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-8 bg-white/[0.02] text-center border-t border-white/5">
               <p className="text-[9px] font-black uppercase tracking-[1em] text-slate-700 animate-pulse">End of Encrypted Registry Stream</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;