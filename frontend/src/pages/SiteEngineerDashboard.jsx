import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReport } from '../features/operations/operationSlice';
import { createMaterialRequest, fetchMyRequests, clearMaterialMsg } from '../features/materials/materialSlice';

const SiteEngineerDashboard = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const [activeTab, setActiveTab] = useState('report');

  // --- State for Reports ---
  const [reportData, setReportData] = useState({ 
    project_id: '', 
    report_date: new Date().toISOString().split('T')[0], 
    content: '' 
  });
  const reportStatus = useSelector((state) => state.operations.status); // Assuming operations slice tracks this

  // --- State for Materials ---
  const [materialData, setMaterialData] = useState({ project_id: '', details: '' });
  const { requests, message: matMessage } = useSelector((state) => state.materials);

  // Load Requests when 'My Requests' tab opens
  useEffect(() => {
    if (activeTab === 'status') {
      dispatch(fetchMyRequests(token));
    }
  }, [activeTab, dispatch, token]);

  // --- Handlers ---

  const handleReportSubmit = (e) => {
    e.preventDefault();
    dispatch(createReport({ data: reportData, token }));
    alert("Report Submitted!"); // Simple feedback
    setReportData({ ...reportData, content: '' }); // Reset content
  };

  const handleMaterialSubmit = (e) => {
    e.preventDefault();
    dispatch(createMaterialRequest({ data: materialData, token }));
    setTimeout(() => dispatch(clearMaterialMsg()), 3000); // Clear message after 3s
  };

  return (
    <div className="dashboard-container" style={{ padding: '20px' }}>
      <h1>Site Engineer Dashboard</h1>

      {/* Navigation Tabs */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('report')} style={{ marginRight: '10px' }}>Daily Report</button>
        <button onClick={() => setActiveTab('material')} style={{ marginRight: '10px' }}>Request Materials</button>
        <button onClick={() => setActiveTab('status')}>My Requests</button>
      </div>

      <hr />

      {/* 1. Daily Report Tab */}
      {activeTab === 'report' && (
        <div className="card">
          <h3>Submit Daily Progress</h3>
          <form onSubmit={handleReportSubmit}>
            <input 
              placeholder="Project ID" 
              value={reportData.project_id}
              onChange={(e) => setReportData({ ...reportData, project_id: e.target.value })}
              required 
            />
            <input 
              type="date" 
              value={reportData.report_date}
              onChange={(e) => setReportData({ ...reportData, report_date: e.target.value })}
              required 
            />
            <textarea 
              placeholder="Work done today..." 
              value={reportData.content}
              onChange={(e) => setReportData({ ...reportData, content: e.target.value })}
              required
              style={{ display: 'block', width: '100%', margin: '10px 0', height: '100px' }}
            />
            <button type="submit">Submit Report</button>
          </form>
        </div>
      )}

      {/* 2. Request Materials Tab */}
      {activeTab === 'material' && (
        <div className="card">
          <h3>Request Construction Materials</h3>
          <form onSubmit={handleMaterialSubmit}>
            <input 
              placeholder="Project ID" 
              value={materialData.project_id}
              onChange={(e) => setMaterialData({ ...materialData, project_id: e.target.value })}
              required 
            />
            <textarea 
              placeholder="Material Details (e.g., 50 bags of Cement)" 
              value={materialData.details}
              onChange={(e) => setMaterialData({ ...materialData, details: e.target.value })}
              required
              style={{ display: 'block', width: '100%', margin: '10px 0', height: '80px' }}
            />
            <button type="submit">Send Request</button>
          </form>
          {matMessage && <p style={{ color: 'green', marginTop: '10px' }}>{matMessage}</p>}
        </div>
      )}

      {/* 3. My Requests Tab (Status Tracking) */}
      {activeTab === 'status' && (
        <div className="card">
          <h3>My Material Requests</h3>
          <div className="request-list">
            {requests.length === 0 ? <p>No requests found.</p> : requests.map((req) => (
              <div key={req.request_id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                <strong>Project ID: {req.project_id}</strong>
                <p>Details: {req.details}</p>
                <span style={{ 
                  backgroundColor: req.status === 'Pending' ? '#fff3cd' : '#d4edda', 
                  padding: '5px', borderRadius: '4px' 
                }}>
                  Status: {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteEngineerDashboard;