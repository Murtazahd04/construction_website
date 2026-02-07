const ProcurementModel = require('../models/procurementModel');

// --- Contractor Actions ---

// 1. Get List of Suppliers (To populate "Select Supplier" dropdown)
exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await ProcurementModel.getMySuppliers(req.userId);
    res.status(200).json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// 2. Create Purchase Order (Contractor -> Supplier)
exports.createPurchaseOrder = async (req, res) => {
  try {
    // Role Check
    if (req.userRole !== 'Contractor') {
      return res.status(403).json({ message: 'Access Denied. Only Contractors can create Purchase Orders.' });
    }

    const { supplier_id, details } = req.body;

    // Create PO
    const poId = await ProcurementModel.createPO({
      contractor_id: req.userId,
      supplier_id,
      details
    });

    res.status(201).json({ 
      message: 'Purchase Order created and sent to Supplier.', 
      poId 
    });

  } catch (error) {
    console.error('Error creating PO:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// --- Supplier Actions ---

// 3. Get My Purchase Orders (Supplier View)
exports.getMyPurchaseOrders = async (req, res) => {
  try {
    if (req.userRole !== 'Supplier') {
      return res.status(403).json({ message: 'Access Denied. Only Suppliers can view received orders.' });
    }

    const orders = await ProcurementModel.getPOsBySupplier(req.userId);
    res.status(200).json(orders);

  } catch (error) {
    console.error('Error fetching POs:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// 4. Submit Invoice (Supplier -> Contractor)
exports.submitInvoice = async (req, res) => {
  try {
    if (req.userRole !== 'Supplier') {
      return res.status(403).json({ message: 'Access Denied. Only Suppliers can submit invoices.' });
    }

    const { po_id, amount, file_path } = req.body; 
    // note: file_path assumes the file was already uploaded to a storage service (S3/Cloudinary) 
    // and the URL is passed here.

    // A. Identify the Contractor to send this invoice to
    const contractorId = await ProcurementModel.getContractorByPO(po_id);
    
    if (!contractorId) {
      return res.status(404).json({ message: 'Invalid Purchase Order ID.' });
    }

    // B. Create Invoice Record
    const invoiceId = await ProcurementModel.createInvoice({
      po_id,
      supplier_id: req.userId,
      contractor_id: contractorId,
      amount,
      file_path
    });

    res.status(201).json({ 
      message: 'Invoice submitted successfully.', 
      invoiceId 
    });

  } catch (error) {
    console.error('Error submitting invoice:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};