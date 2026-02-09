import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Menu, X, Building2, Users, ClipboardList, 
  Truck, BarChart3, ShieldCheck, ArrowRight,
  MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram, XCircle
} from 'lucide-react';

// --- IMAGE IMPORTS ---
import bannerImage from '../assets/banner.jpeg';
import footerImage from '../assets/footer.jpeg'; 

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

// ==============================
// 1. NAVBAR COMPONENT
// ==============================
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [navStyle, setNavStyle] = useState('transparent');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const footer = document.getElementById('footer-section');
      
      let inFooter = false;
      if (footer) {
        const rect = footer.getBoundingClientRect();
        if (rect.top <= 100) inFooter = true;
      }

      if (scrollY < 800) {
        setNavStyle('transparent');
      } else if (inFooter) {
        setNavStyle('transparent');
      } else {
        setNavStyle('glass');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = navStyle === 'transparent';
  const navClasses = isTransparent ? "bg-transparent py-5" : "bg-white/80 backdrop-blur-md shadow-sm py-3";
  const textClasses = isTransparent ? "text-white" : "text-slate-900";
  const buttonClasses = isTransparent 
    ? "bg-orange-600 text-white hover:bg-orange-700" 
    : "bg-orange-600 text-white hover:bg-orange-500 shadow-lg shadow-orange-900/20";
  const logoBg = isTransparent ? "bg-white/20 backdrop-blur-sm border border-white/30" : "bg-slate-900";
  const logoIcon = "text-white"; 

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${navClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${logoBg}`}>
              <Building2 className={`w-6 h-6 ${logoIcon}`} />
            </div>
            <span className={`font-bold text-2xl tracking-tight transition-colors ${textClasses}`}>BuildFlow</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/login" className={`font-semibold text-lg transition-colors hover:text-orange-500 ${textClasses}`}>
              Login
            </Link>
            <Link to="/get-started">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2.5 rounded-lg font-bold transition-all ${buttonClasses}`}
              >
                Get Started
              </motion.button>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className={`${textClasses} focus:outline-none`}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 shadow-xl"
          >
            <div className="px-4 pt-4 pb-6 space-y-3">
              <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-3 border border-slate-700 rounded-lg text-white font-bold hover:bg-slate-800">
                Login
              </Link>
              <Link to="/get-started" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-3 rounded-lg text-white bg-orange-600 font-bold hover:bg-orange-700 shadow-md">
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// ==============================
// 2. HERO SECTION
// ==============================
const HeroSection = () => {
  return (
    <div className="relative bg-slate-900 h-[850px] flex items-center overflow-hidden">
      <motion.div 
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img src={bannerImage} alt="Construction Site" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl">
          <motion.div variants={fadeInUp} className="inline-flex items-center px-3 py-1 rounded border border-orange-500/50 bg-orange-500/20 text-orange-300 text-sm font-bold uppercase tracking-wider mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-orange-500 mr-2 animate-pulse"></span>
            Seamless Operations
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl tracking-tight font-extrabold text-white sm:text-7xl leading-tight drop-shadow-lg">
            Build with <span className="text-white">Precision.</span><br />
            Manage with <span className="text-orange-500">Power.</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="mt-6 text-xl text-gray-200 leading-relaxed max-w-2xl drop-shadow-md">
            The all-in-one construction management platform engineered for stability. Connect your site engineers, contractors, and suppliers in one secure ecosystem.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link to="/get-started">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto flex items-center justify-center px-8 py-4 text-lg font-bold rounded-lg text-white bg-orange-600 hover:bg-orange-700 shadow-xl shadow-orange-900/30 transition-all"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// ==============================
// 3. FEATURES SECTION (LOGOS ANIMATION + DYNAMIC COLORS)
// ==============================
const FeaturesSection = () => {
  const features = [
    { icon: Building2, title: "Project Management", description: "Centralized command center for all your construction sites with real-time analytics." },
    { icon: Users, title: "Team Coordination", description: "Granular role-based access for contractors, engineers, and stakeholders." },
    { icon: ClipboardList, title: "Daily Reporting", description: "Standardized digital logs for site progress, weather conditions, and incidents." },
    { icon: Truck, title: "Supply Chain", description: "End-to-end material tracking from purchase request to site delivery." },
    { icon: BarChart3, title: "Financial Control", description: "Strict budget monitoring with automated alerts for cost overruns." },
    { icon: ShieldCheck, title: "Enterprise Security", description: "Bank-grade data encryption ensuring your proprietary data remains safe." }
  ];

  return (
    <div className="bg-slate-50 py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-orange-600 tracking-widest uppercase">Operational Excellence</h2>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">Engineered for Efficiency</p>
          <p className="mt-4 text-xl text-slate-500">Tools designed to reduce friction and increase visibility across your entire operation.</p>
        </motion.div>
        
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={fadeInUp} 
              className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 group hover:shadow-2xl hover:shadow-orange-500/20 hover:border-orange-500/30"
            >
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                className="w-14 h-14 bg-slate-900 rounded-lg flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-slate-100"
              >
                <feature.icon className="text-white w-7 h-7 transition-colors duration-300 group-hover:text-slate-900" />
              </motion.div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 transition-colors duration-300 group-hover:text-orange-600">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-base leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// ==============================
// 4. ROLES SECTION (DYNAMIC COLORS + ORANGE SHADOW)
// ==============================
const RoleCard = ({ letter, title, description }) => (
  <motion.div 
    variants={fadeInUp}
    className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 flex flex-col items-start text-left cursor-default group hover:shadow-2xl hover:shadow-orange-500/20 hover:border-orange-500/30"
  >
    <div className="w-14 h-14 bg-slate-900 rounded-lg flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-slate-100 group-hover:scale-110">
      <span className="text-white text-xl font-bold transition-colors duration-300 group-hover:text-slate-900">
        {letter}
      </span>
    </div>
    
    <h3 className="text-xl font-bold text-slate-900 mb-3 transition-colors duration-300 group-hover:text-orange-600">
      {title}
    </h3>
    
    <p className="text-slate-500 text-base leading-relaxed">
      {description}
    </p>
  </motion.div>
);

const RolesSection = () => {
  const roles = [
    { letter: "A", title: "Admin", description: "System configuration, granular user provisioning, and secure data access management." },
    { letter: "O", title: "Owner", description: "Strategic oversight and high-level company management for executive decision making." },
    { letter: "P", title: "Project Manager", description: "Budget authority and timeline enforcement across multiple project phases." },
    { letter: "C", title: "Contractor", description: "Workforce management and task execution specialized for construction delivery." },
    { letter: "S", title: "Site Engineer", description: "On-ground technical supervision and digital reporting for quality control." },
    { letter: "V", title: "Supplier", description: "Supply fulfillment, real-time material tracking, and automated invoice submission." }
   
  ];

  return (
    <div className="bg-white py-24 border-y border-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-sm font-bold text-orange-600 tracking-widest uppercase mb-2">Team Ecosystem</h2>
          <p className="text-4xl font-extrabold text-slate-900 mb-4">Unified Workflow</p>
          <p className="text-lg text-slate-500">Every stakeholder connected in one secure platform.</p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {roles.map((role, index) => (
            <RoleCard key={index} {...role} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// ==============================
// 5. PRICING SECTION
// ==============================
const PricingCard = ({ title, price, frequency, features, isPopular, idealFor }) => (
  <motion.div 
    variants={fadeInUp}
    whileHover={{ scale: 1.05 }}
    className={`relative p-8 bg-white rounded-xl flex flex-col transition-all duration-300 ${
      isPopular 
        ? 'border-2 border-orange-500 shadow-2xl z-10' 
        : 'border border-slate-200 shadow-sm hover:shadow-xl'
    }`}
  >
    {isPopular && (
      <div className="absolute top-0 right-0 -mt-4 px-4 py-1 bg-orange-600 text-white text-xs font-bold uppercase tracking-wider rounded shadow-md">
        Most Popular
      </div>
    )}
    <div className="mb-5">
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-500 text-sm font-medium mt-1">Ideal for: {idealFor}</p>
    </div>
    <div className="mb-6 pb-6 border-b border-slate-100">
      <div className="flex items-baseline">
        <span className="text-4xl font-extrabold text-slate-900">₹{price}</span>
        <span className="text-slate-500 ml-1 font-medium">{frequency}</span>
      </div>
    </div>
    <ul className="mb-8 space-y-4 flex-1">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-start">
          {feature.included ? (
            <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
          ) : (
            <XCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
          )}
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${feature.included ? 'text-slate-900' : 'text-slate-400'}`}>
              {feature.label}
            </span>
            <span className="text-xs text-slate-500">{feature.value}</span>
          </div>
        </li>
      ))}
    </ul>
    <Link to="/get-started">
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3 px-4 rounded-lg font-bold transition-colors ${
          isPopular 
            ? 'bg-orange-600 text-white hover:bg-orange-700' 
            : 'bg-slate-900 text-white hover:bg-slate-800'
        }`}
      >
        Select Plan
      </motion.button>
    </Link>
  </motion.div>
);

const PricingSection = () => {
  const plans = [
    {
      title: "Single Day Plan",
      price: "9",
      frequency: "/day",
      idealFor: "New Users",
      isPopular: false,
      features: [
        { label: "Projects", value: "1 Project", included: true },
        { label: "Users", value: "Limited Users", included: true },
        { label: "Progress Reports", value: "Daily Only", included: true },
        { label: "Budget Tracking", value: "No", included: false },
        { label: "Purchase Orders", value: "View Only", included: true }
      ]
    },
    {
      title: "Monthly Plan",
      price: "199",
      frequency: "/month",
      idealFor: "Growing Teams",
      isPopular: true,
      features: [
        { label: "Projects", value: "Multiple Projects", included: true },
        { label: "Users", value: "All Roles Enabled", included: true },
        { label: "Progress Reports", value: "Daily + Weekly", included: true },
        { label: "Budget Tracking", value: "Basic", included: true },
        { label: "Purchase Orders", value: "Full Access", included: true }
      ]
    },
    {
      title: "Yearly Plan",
      price: "1599",
      frequency: "/year",
      idealFor: "Established Teams",
      isPopular: false,
      features: [
        { label: "Projects", value: "Unlimited Projects", included: true },
        { label: "Users", value: "All Roles Enabled", included: true },
        { label: "Progress Reports", value: "Daily + Weekly + Monthly", included: true },
        { label: "Budget Tracking", value: "Advanced", included: true },
        { label: "Purchase Orders", value: "Full Access + History", included: true }
      ]
    }
  ];

  return (
    <div className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-sm font-bold text-orange-600 tracking-widest uppercase">Pricing Plans</h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Optimized for Your Scale</p>
        </motion.div>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid gap-8 lg:grid-cols-3 lg:gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// ==============================
// 6. FOOTER COMPONENT
// ==============================
const FooterWithCTA = () => {
  return (
    <footer id="footer-section" className="relative bg-slate-900 pt-24 pb-12 overflow-hidden text-slate-300">
      <div className="absolute inset-0 z-0">
        <img src={footerImage} alt="Footer Background" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-slate-900/90 mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Ready to stabilize your workflow?</h2>
          <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto mb-10">Join the platform built for the demands of modern construction.</p>
          <Link to="/get-started">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-lg text-white bg-orange-600 hover:bg-orange-700 shadow-xl transition-all">
              Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>

        <div className="border-t border-slate-800 mb-12"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800 border border-slate-700">
                 <Building2 className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-2xl text-white tracking-tight">BuildFlow</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">Empowering construction teams with seamless management tools for better efficiency, real-time control, and smarter decision making.</p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Instagram, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 flex items-center justify-center rounded bg-slate-800 hover:bg-orange-600 hover:text-white transition-all text-slate-400">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6">Solutions</h3>
            <ul className="space-y-4 text-sm">
              {['Project Management', 'Financial Control', 'Supply Chain Tracking', 'Workforce Coordination', 'Safety Reporting'].map(item => (
                <li key={item}><Link to="#" className="hover:text-orange-500 transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6">Company</h3>
            <ul className="space-y-4 text-sm">
              {['About Us', 'Careers', 'Blog & News', 'Privacy Policy', 'Terms of Service'].map(item => (
                <li key={item}><Link to="#" className="hover:text-orange-500 transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <span>123 BuildFlow company ,<br/>Mumbai, India 400001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-600 shrink-0" />
                <span>+91 1234567890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-600 shrink-0" />
                <span>support@buildflow.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">© 2026 BuildFlow. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <Link to="#" className="text-slate-500 hover:text-white text-sm">Privacy</Link>
             <Link to="#" className="text-slate-500 hover:text-white text-sm">Terms</Link>
             <Link to="#" className="text-slate-500 hover:text-white text-sm">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// =============================
// 7. MAIN PAGE EXPORT
// =============================
const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-slate-900">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <RolesSection />
        <PricingSection />
      </main>
      <FooterWithCTA />
    </div>
  );
};

export default LandingPage;