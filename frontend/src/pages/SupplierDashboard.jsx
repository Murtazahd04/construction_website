import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReceivedPOs, submitInvoice, clearProcurementMsg } from '../features/procurement/procurementSlice';

const SupplierDashboard = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const [activeTab, setActiveTab] = useState('orders');

  // --- State for Invoicing ---
  const [invoiceData, setInvoiceData] = useState({ 
    po_id: '', 
    amount: '', 
    file_path: '' // In real app, this comes from file upload response
  });

  const { receivedOrders, message, error } = useSelector((state) => state.procurement);

  // Load Orders when Dashboard opens
  useEffect(() => {
    dispatch(fetchReceivedPOs(token));
  }, [dispatch, token]);

  // --- Handlers ---
  const handleInvoiceSubmit = (e) => {
    e.preventDefault();
    dispatch(submitInvoice({ data: invoiceData, token }));
    setTimeout(() => dispatch(clearProcurementMsg()), 3000);
  };

  return (
    <div className="dashboard-container" style={{ padding: '20px' }}>
      <h1>Supplier Dashboard</h1>

      {/* Navigation Tabs */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('orders')} style={{ marginRight: '10px' }}>Received Orders</button>
        <button onClick={() => setActiveTab('invoice')}>Submit Invoice</button>
      </div>

      <hr />

      {/* 1. View Orders Tab */}
      {activeTab === 'orders' && (
        <div className="card">
          <h3>Purchase Orders from Contractors</h3>
          <div className="order-list">
            {receivedOrders.length === 0 ? <p>No new orders.</p> : receivedOrders.map((po) => (
              <div key={po.po_id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>PO ID: #{po.po_id}</strong>
                  <span>Date: {new Date(po.created_at).toLocaleDateString()}</span>
                </div>
                <p><strong>Details:</strong> {po.details}</p>
                <small>From Contractor: {po.contractor_email} ({po.mobile_number})</small>
                <br />
                {/* Quick Action Button */}
                <button 
                  onClick={() => {
                    setInvoiceData({ ...invoiceData, po_id: po.po_id });
                    setActiveTab('invoice');
                  }}
                  style={{ marginTop: '10px', fontSize: '12px' }}
                >
                  Create Invoice for this PO
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Submit Invoice Tab */}
      {activeTab === 'invoice' && (
        <div className="card">
          <h3>Submit Invoice</h3>
          <form onSubmit={handleInvoiceSubmit}>
            <label>Purchase Order ID:</label>
            <input 
              type="number"
              placeholder="Enter PO ID" 
              value={invoiceData.po_id}
              onChange={(e) => setInvoiceData({ ...invoiceData, po_id: e.target.value })}
              required 
              style={{ display: 'block', marginBottom: '10px' }}
            />

            <label>Total Amount ($):</label>
            <input 
              type="number"
              placeholder="0.00" 
              value={invoiceData.amount}
              onChange={(e) => setInvoiceData({ ...invoiceData, amount: e.target.value })}
              required 
              style={{ display: 'block', marginBottom: '10px' }}
            />

            <label>Invoice File URL (Mock Upload):</label>
            <input 
              type="text"
              placeholder="http://myserver.com/uploads/invoice123.pdf" 
              value={invoiceData.file_path}
              onChange={(e) => setInvoiceData({ ...invoiceData, file_path: e.target.value })}
              required
              style={{ display: 'block', marginBottom: '10px', width: '100%' }}
            />
            
            <button type="submit">Submit Invoice</button>
          </form>

          {/* Feedback Messages */}
          {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default SupplierDashboard;