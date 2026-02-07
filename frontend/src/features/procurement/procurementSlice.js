import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/procurement';

// ==========================================
// CONTRACTOR ACTIONS
// ==========================================

// 1. Fetch Suppliers (For Dropdown)
export const fetchSuppliers = createAsyncThunk(
  'procurement/fetchSuppliers', 
  async (token, { rejectWithValue }) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${API_URL}/suppliers`, config);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch suppliers' });
    }
  }
);

// 2. Create Purchase Order
export const createPO = createAsyncThunk(
  'procurement/createPO', 
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(`${API_URL}/purchase-orders`, data, config);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to create PO' });
    }
  }
);

// ==========================================
// SUPPLIER ACTIONS
// ==========================================

// 3. Get Received Purchase Orders
export const fetchReceivedPOs = createAsyncThunk(
  'procurement/fetchReceivedPOs', 
  async (token, { rejectWithValue }) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${API_URL}/my-orders`, config);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch orders' });
    }
  }
);

// 4. Submit Invoice
export const submitInvoice = createAsyncThunk(
  'procurement/submitInvoice', 
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // data structure: { po_id, amount, file_path }
      const response = await axios.post(`${API_URL}/invoices`, data, config);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to submit invoice' });
    }
  }
);

// ==========================================
// SLICE DEFINITION
// ==========================================

const procurementSlice = createSlice({
  name: 'procurement',
  initialState: { 
    suppliers: [],       // List of suppliers for Contractors
    receivedOrders: [],  // List of POs for Suppliers
    status: 'idle',      // 'idle' | 'loading' | 'succeeded' | 'failed'
    message: null,       // Success messages
    error: null          // Error messages
  },
  reducers: {
    clearProcurementMsg: (state) => { 
      state.message = null; 
      state.error = null; 
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Contractor Cases ---
      .addCase(fetchSuppliers.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.suppliers = action.payload;
      })
      .addCase(createPO.pending, (state) => { state.status = 'loading'; })
      .addCase(createPO.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload.message;
      })
      .addCase(createPO.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message;
      })

      // --- Supplier Cases ---
      .addCase(fetchReceivedPOs.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchReceivedPOs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.receivedOrders = action.payload;
      })
      .addCase(submitInvoice.pending, (state) => { state.status = 'loading'; })
      .addCase(submitInvoice.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload.message;
      })
      .addCase(submitInvoice.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message;
      });
  },
});

export const { clearProcurementMsg } = procurementSlice.actions;
export default procurementSlice.reducer;