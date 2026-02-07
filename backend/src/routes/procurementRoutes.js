const express = require('express');
const router = express.Router();
const procurementController = require('../controllers/procurementController');
const verifyToken = require('../middlewares/authMiddleware');

// Apply authentication middleware to all routes
// Users must be logged in (as Contractor or Supplier) to access these endpoints
router.use(verifyToken);

// ==========================================
// CONTRACTOR ROUTES
// ==========================================

// 1. GET /api/procurement/suppliers
// Description: Get list of suppliers created by the logged-in Contractor
// Usage: To populate the "Select Supplier" dropdown when creating a PO
router.get('/suppliers', procurementController.getSuppliers);

// 2. POST /api/procurement/purchase-orders
// Description: Create a new Purchase Order for a specific Supplier
// Body: { supplier_id, details }
router.post('/purchase-orders', procurementController.createPurchaseOrder);


// ==========================================
// SUPPLIER ROUTES
// ==========================================

// 3. GET /api/procurement/my-orders
// Description: View Purchase Orders received from Contractors
// Usage: Supplier Dashboard to track incoming orders
router.get('/my-orders', procurementController.getMyPurchaseOrders);

// 4. POST /api/procurement/invoices
// Description: Submit an invoice for a specific Purchase Order
// Body: { po_id, amount, file_path }
router.post('/invoices', procurementController.submitInvoice);

module.exports = router;