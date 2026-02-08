import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  fetchReceivedPOs, 
  submitInvoice, 
  clearProcurementMsg 
} from '../../features/procurement/procurementSlice';
import { 
  Package, 
  FileText, 
  Calendar, 
  User, 
  Phone, 
  ArrowRight, 
  PlusCircle, 
  LayoutDashboard, 
  LogOut, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  IndianRupee
} from 'lucide-react';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SupplierDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [activeTab, setActiveTab] = useState('orders');

  // --- State for Invoicing ---
  const [invoiceData, setInvoiceData] = useState({ 
    po_id: '', 
    amount: '', 
    file_path: '' 
  });

  const { receivedOrders, message, error, loading } = useSelector((state) => state.procurement);

  // Load Orders on Mount
  useEffect(() => {
    if (token) {
      dispatch(fetchReceivedPOs(token));
    } else {
      navigate('/login');
    }
  }, [dispatch, token, navigate]);

  // Toast Feedback
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearProcurementMsg());
    }
    if (error) {
      toast.error(error);
      dispatch(clearProcurementMsg());
    }
  }, [message, error, dispatch]);

  // --- Handlers ---
  const handleInvoiceSubmit = (e) => {
    e.preventDefault();
    dispatch(submitInvoice({ data: invoiceData, token }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Animation Variants
  const tabVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -20 }
  };

  const SidebarItem = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`relative w-full flex items-center space-x-3 px-6 py-4 transition-all duration-300 group
        ${activeTab === id ? 'text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
    >
      {activeTab === id && (
        <motion.div layoutId="supplierNav" className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-full" />
      )}
      <Icon className={`w-5 h-5 transition-colors ${activeTab === id ? 'text-indigo-500' : 'group-hover:text-white'}`} />
      <span className="font-bold text-sm tracking-wide uppercase">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-950 border-r border-white/5 flex flex-col z-20">
        <div className="h-24 flex items-center px-8 border-b border-white/5 bg-gradient-to-b from-indigo-500/5 to-transparent">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/40 mr-4">
            <Package className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase italic">Supplier Hub</span>
        </div>

        <nav className="flex-1 py-8 space-y-2">
          <SidebarItem id="orders" label="Incoming Orders" icon={LayoutDashboard} />
          <SidebarItem id="invoice" label="Billing / Invoicing" icon={FileText} />
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all group">
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="font-bold text-sm">Logout Session</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-900 to-[#020617] relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto p-10 relative z-10">
          <header className="mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                {activeTab === 'orders' ? 'Fulfillment Queue' : 'Invoice Generation'}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">Partner Portal: Active</p>
              </div>
            </motion.div>
          </header>

          <AnimatePresence mode="wait">
            {/* TAB: RECEIVED ORDERS */}
            {activeTab === 'orders' && (
              <motion.div 
                key="orders" variants={tabVariants} initial="hidden" animate="visible" exit="exit"
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {receivedOrders.length === 0 ? (
                  <div className="col-span-full py-24 text-center bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
                    <Package className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest">No new purchase orders detected.</p>
                  </div>
                ) : (
                  receivedOrders.map((po, idx) => (
                    <motion.div 
                      key={po.po_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem] hover:border-indigo-500/50 hover:bg-white/10 transition-all shadow-2xl"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 group-hover:rotate-6 transition-transform">
                          <Package className="w-6 h-6 text-indigo-500" />
                        </div>
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-800 text-slate-400 border border-white/5">
                          PO #{po.po_id}
                        </span>
                      </div>

                      <p className="text-white font-medium text-lg mb-6 leading-relaxed">
                        {po.details}
                      </p>

                      <div className="space-y-3 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-3 text-sm text-slate-400 font-medium">
                          <User className="w-4 h-4 text-indigo-500" />
                          <span>{po.contractor_email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-400 font-medium">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          <span>Issued: {new Date(po.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setInvoiceData({ ...invoiceData, po_id: po.po_id });
                          setActiveTab('invoice');
                        }}
                        className="mt-8 w-full py-4 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-600/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                      >
                        Initiate Invoicing <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {/* TAB: SUBMIT INVOICE */}
            {activeTab === 'invoice' && (
              <motion.div 
                key="invoice" variants={tabVariants} initial="hidden" animate="visible" exit="exit"
                className="max-w-2xl"
              >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                  <div className="flex items-center gap-6 mb-10">
                    <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-600/20">
                      <FileText className="w-8 h-8 text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight">Financial Claim</h3>
                      <p className="text-slate-400 font-medium">Finalize billing for fulfilled purchase orders.</p>
                    </div>
                  </div>

                  <form onSubmit={handleInvoiceSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Reference PO ID</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 104"
                          className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          value={invoiceData.po_id}
                          onChange={(e) => setInvoiceData({ ...invoiceData, po_id: e.target.value })}
                          required 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 text-indigo-400">Total Claim Amount</label>
                        <div className="relative">
                          <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
                          <input 
                            type="number" 
                            placeholder="0.00"
                            className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 pl-10 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            value={invoiceData.amount}
                            onChange={(e) => setInvoiceData({ ...invoiceData, amount: e.target.value })}
                            required 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Digital Asset / Invoice URL</label>
                      <input 
                        type="text" 
                        placeholder="https://storage.buildflow.com/inv-992.pdf"
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={invoiceData.file_path}
                        onChange={(e) => setInvoiceData({ ...invoiceData, file_path: e.target.value })}
                        required 
                      />
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      disabled={loading}
                      type="submit" 
                      className={`w-full py-5 rounded-[1.2rem] font-black uppercase tracking-widest text-sm shadow-2xl transition-all flex items-center justify-center gap-3
                        ${loading ? 'bg-indigo-600/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/40 text-white'}`}
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Submit Billing Request <ArrowRight className="w-5 h-5" /></>}
                    </motion.button>
                  </form>

                  <p className="mt-10 text-center text-slate-600 text-[10px] uppercase font-black tracking-widest">
                    BuildFlow Financial Protocol v2.6.0
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default SupplierDashboard;