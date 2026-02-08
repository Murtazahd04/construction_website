const db = require('../config/db');

class ProcurementModel {
  // 1. Create Purchase Order (Contractor -> Supplier)
  static async createPO(poData) {
    const { contractor_id, supplier_id, details } = poData;
    const sql = `
      INSERT INTO purchase_orders (contractor_id, supplier_id, details) 
      VALUES (?, ?, ?)
    `;
    const [result] = await db.execute(sql, [contractor_id, supplier_id, details]);
    return result.insertId;
  }

  // 2. Fetch Suppliers created by a specific Contractor
  static async getMySuppliers(contractorId) {
    const sql = 'SELECT user_id, email FROM users WHERE created_by_user_id = ? AND role = "Supplier"';
    const [rows] = await db.execute(sql, [contractorId]);
    return rows;
  }

  // 3. Get POs received by a specific Supplier (Supplier View)
  static async getPOsBySupplier(supplierId) {
    const sql = `
      SELECT po.*, u.email as contractor_email
      FROM purchase_orders po
      JOIN users u ON po.contractor_id = u.user_id
      WHERE po.supplier_id = ?
      ORDER BY po.created_at DESC
    `;
    const [rows] = await db.execute(sql, [supplierId]);
    return rows;
  }

  // 4. Create Invoice linked to a PO (Supplier -> Contractor)
  static async createInvoice(invoiceData) {
    const { po_id, supplier_id, contractor_id, amount, file_path } = invoiceData;
    const sql = `
      INSERT INTO invoices (po_id, supplier_id, contractor_id, amount, invoice_file_path) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [po_id, supplier_id, contractor_id, amount, file_path]);
    return result.insertId;
  }

  // 5. Helper: Get Contractor ID from a PO (To route the invoice correctly)
  static async getContractorByPO(poId) {
    const sql = 'SELECT contractor_id FROM purchase_orders WHERE po_id = ?';
    const [rows] = await db.execute(sql, [poId]);
    return rows[0] ? rows[0].contractor_id : null;
  }
}

module.exports = ProcurementModel;