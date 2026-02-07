import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Router components
import { testBackendConnection } from "./features/projectSlice";
import LandingPage from "./pages/LandingPage"; // Import your new Landing Page
// In frontend/src/App.jsx
import RegisterCompany from "./pages/RegisterCompany";
function App() {
  const dispatch = useDispatch();

  // Keep your existing state logic to monitor connection
  const { message, loading, error } = useSelector(
    (state) => state.project
  );

  // Keep your existing effect to test connection on app load
  useEffect(() => {
    dispatch(testBackendConnection());
  }, [dispatch]);

  // Optional: Log connection status to console instead of showing on UI
  useEffect(() => {
    if (message) console.log("Backend Status:", message);
    if (error) console.error("Backend Error:", error);
  }, [message, error]);

  return (
    <Router>
      {/* Optional: You can keep a small indicator for development 
        remove this div later when you are done testing 
      */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <p className="font-bold">Connection Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <Routes>
        {/* The Landing Page will now be the default home page */}
        <Route path="/" element={<LandingPage />} />


        <Route path="/register" element={<RegisterCompany />} />
        {/* You can add more routes here later, e.g.:
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        */}
      </Routes>

    </Router>
  );
}

export default App;