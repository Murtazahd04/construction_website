import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

// Fetch List
export const fetchRegistrations = createAsyncThunk(
  'admin/fetchRegistrations',
  async (token, { rejectWithValue }) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${API_URL}/registrations`, config);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Approve
export const approveCompany = createAsyncThunk(
  'admin/approveCompany',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(`${API_URL}/approve/${id}`, {}, config);
      return response.data; // Contains new user credentials
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Reject
export const rejectCompany = createAsyncThunk(
  'admin/rejectCompany',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(`${API_URL}/reject/${id}`, {}, config);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: { list: [], message: null, newCredentials: null },
  reducers: {
    clearAdminMsg: (state) => { 
      state.message = null; 
      state.newCredentials = null; 
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegistrations.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(approveCompany.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.newCredentials = action.payload.credentials;
        // Remove approved item from list
        state.list = state.list.filter(item => item.registration_id !== action.meta.arg.id);
      })
      .addCase(rejectCompany.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.list = state.list.filter(item => item.registration_id !== action.meta.arg.id);
      });
  }
});

export const { clearAdminMsg } = adminSlice.actions;
export default adminSlice.reducer;