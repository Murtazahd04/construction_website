import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API: Fetch Reports (Flow 4 - Contractor Viewing)
export const fetchReports = createAsyncThunk(
  'operations/fetchReports',
  async ({ projectId, period, date, token }, { rejectWithValue }) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Build query string dynamically
      const response = await axios.get(
        `http://localhost:5000/api/reports?project_id=${projectId}&period=${period}&date=${date}`,
        config
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch reports' });
    }
  }
);

// API: Create Report (Flow 5 - Site Engineer Submitting)
export const createReport = createAsyncThunk(
  'operations/createReport',
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post('http://localhost:5000/api/reports', data, config);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to create report' });
    }
  }
);

const operationSlice = createSlice({
  name: 'operations',
  initialState: {
    reports: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    message: null,
    error: null,
  },
  reducers: {
    clearOperationMsg: (state) => {
      state.message = null;
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Reports Cases ---
      .addCase(fetchReports.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message;
      })

      // --- Create Report Cases ---
      .addCase(createReport.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload.message;
      })
      .addCase(createReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message;
      });
  },
});

export const { clearOperationMsg } = operationSlice.actions;

// ✅ EXPORT DEFAULT REDUCER (Fixes the syntax error)
export default operationSlice.reducer;