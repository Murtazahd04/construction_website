import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you use react-router
// Update this line at the top of your file
import { Check, Menu, X, Building2, Users, ClipboardList, Truck, BarChart3, ShieldCheck } from 'lucide-react';// Install lucide-react for icons: npm install lucide-react
import bannerImage from '../assets/banner.jpeg';
// Add this with your other imports
import footerImage from '../assets/footer.jpeg'; // Or replace with specific footer image
const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-900">BuildFlow</span>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Login
            </Link>
            <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md font-medium transition-colors">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900 focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Login</Link>
            <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-orange-600 hover:bg-orange-50">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const HeroSection = () => {
  return (
    <div className="relative bg-gray-900 h-[600px] flex items-center">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bannerImage} 
          alt="Construction Site" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
          <span className="block">Build Smarter,</span>
          <span className="block text-orange-500">Manage Better</span>
        </h1>
        <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-0 md:mt-5 md:text-xl">
          Streamline your construction projects with our comprehensive management platform. From site engineers to suppliers, everyone stays connected.
        </p>
        <div className="mt-8 sm:mt-10 sm:flex sm:justify-center md:justify-start gap-4">
          <div className="rounded-md shadow">
            <Link to="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 md:py-4 md:text-lg md:px-10">
              Get Started Free
            </Link>
          </div>
          <div className="mt-3 sm:mt-0 sm:ml-3">
            <Link to="/login" className="w-full flex items-center justify-center px-8 py-3 border border-white/30 text-base font-medium rounded-md text-white bg-transparent hover:bg-white/10 md:py-4 md:text-lg md:px-10 backdrop-blur-sm">
              Login to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
      <Icon className="text-orange-600 w-6 h-6" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
  </div>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: Building2,
      title: "Project Management",
      description: "Oversee all construction projects from a single dashboard with real-time updates."
    },
    {
      icon: Users,
      title: "Team Coordination",
      description: "Manage contractors, site engineers, and suppliers with role-based access."
    },
    {
      icon: ClipboardList,
      title: "Progress Tracking",
      description: "Daily progress reports with visual charts for day, month, and yearly insights."
    },
    {
      icon: Truck,
      title: "Material Management",
      description: "Handle material requests, purchase orders, and supplier invoices seamlessly."
    },
    {
      icon: BarChart3,
      title: "Budget Control",
      description: "Set and monitor project budgets with comprehensive financial tracking."
    },
    {
      icon: ShieldCheck,
      title: "Secure Access",
      description: "Role-based authentication ensures data security across all levels."
    }
  ];

  return (
    <div className="bg-white py-24 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base font-semibold text-orange-600 tracking-wide uppercase">Core Capabilities</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything You Need to Build Better
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            A complete construction management ecosystem designed for modern builders.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};
const RoleCard = ({ letter, title, description }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mb-4">
      <span className="text-white text-xl font-bold">{letter}</span>
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
  </div>
);

const RolesSection = () => {
  const roles = [
    {
      letter: "O",
      title: "Owner",
      description: "Full control over company, create managers and contractors."
    },
    {
      letter: "P",
      title: "Project Manager",
      description: "Monitor overall progress and manage project budgets."
    },
    {
      letter: "C",
      title: "Contractor",
      description: "Manage site engineers, suppliers, and purchase orders."
    },
    {
      letter: "S",
      title: "Site Engineer",
      description: "Submit daily reports and material requests."
    },
    {
      letter: "S",
      title: "Supplier",
      description: "View purchase orders and submit invoices."
    },
    {
      letter: "A",
      title: "Admin",
      description: "Approve company registrations and manage the platform."
    }
  ];

  return (
    <div className="bg-gray-50 py-24 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Built for Every Role
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Dedicated dashboards and tools for every team member in your construction workflow.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role, index) => (
            <RoleCard key={index} {...role} />
          ))}
        </div>
      </div>
    </div>
  );
};
const PricingCard = ({ title, price, frequency, features, isPopular, saveText }) => (
  <div className={`relative p-8 bg-white border rounded-2xl shadow-sm flex flex-col ${isPopular ? 'border-orange-500 ring-1 ring-orange-500 shadow-xl scale-105 z-10' : 'border-gray-200'}`}>
    {isPopular && (
      <div className="absolute top-0 right-0 -mt-3 -mr-3 px-3 py-1 bg-orange-500 text-white text-xs font-bold uppercase rounded-full shadow-md">
        Most Popular
      </div>
    )}
    <div className="mb-5">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {/* Show savings text if it exists (for yearly plan) */}
      {saveText ? (
        <p className="mt-2 text-green-600 text-sm font-semibold">{saveText}</p>
      ) : (
        <p className="mt-2 text-gray-500 text-sm">Flexible access for your needs.</p>
      )}
    </div>
    <div className="mb-5">
      <span className="text-4xl font-bold text-gray-900">₹{price}</span>
      <span className="text-gray-500">{frequency}</span>
    </div>
    <ul className="mb-8 space-y-4 flex-1">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
          <span className="text-gray-600 text-sm">{feature}</span>
        </li>
      ))}
    </ul>
    <button className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${isPopular ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
      Choose Plan
    </button>
  </div>
);

const PricingSection = () => {
  const plans = [
    {
      title: "Daily Pass",
      price: "9",
      frequency: "/day",
      features: ["Full Access for 24 Hours", "Create Limited Projects", "Download Reports", "Standard Support"],
      isPopular: false
    },
    {
      title: "Monthly Pro",
      price: "199",
      frequency: "/month",
      features: ["Limited Access", "Team Collaboration Tools", "Advanced Analytics", "Inventory Management", "Priority Email Support"],
      isPopular: true
    },
    {
      title: "Yearly Elite",
      price: "1599",
      frequency: "/year",
      features: ["All Monthly Features", "Dedicated Account Manager", "Custom Integrations", "Data Backup & Recovery", "On-site Training Options"],
      isPopular: false,
      saveText: "Save ~33% vs Monthly" // 199 * 12 = 2388, so 1599 is a big saving
    }
  ];

  return (
    <div className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-orange-600 tracking-wide uppercase">Pricing</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Flexible Plans for Every Budget
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Pay as you go daily, or save big with our yearly subscription.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </div>
  );
};

const FooterWithCTA = () => {
  return (
    <footer>
      {/* 1. The Call to Action Section with Background Image */}
      <div className="relative bg-gray-900 py-24 text-center overflow-hidden">
        
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={footerImage} 
            alt="Footer Background" 
            className="w-full h-full object-cover opacity-32" 
          />
          {/* Gradient Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-900/80 to-orange-600/80 mix-blend-multiply"></div>
        </div>

        {/* Content (z-10 ensures it sits on top of image) */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Transform Your Projects?
          </h2>
          <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
            Join thousands of construction companies already using BuildFlow to deliver projects on time and within budget.
          </p>
          <div className="mt-8">
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Start Your Free Trial
            </Link>
          </div>
        </div>
      </div>

      {/* 2. The Minimal Footer Bar */}
      <div className="bg-blue-950 py-8 border-t border-blue-900 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded flex items-center justify-center">
               <Building2 className="text-orange-500 w-8 h-8" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">BuildFlow</span>
          </div>

          {/* Copyright Section */}
          <p className="text-blue-200 text-sm">
            © 2026 BuildFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection /> {/* Added here */}
        <RolesSection />
        <PricingSection />
      </main>
    <FooterWithCTA />
    </div>
  );
};

export default LandingPage;
