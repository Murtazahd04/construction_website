import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


// 1. Add this new Thunk at the top
export const fetchProjectRequests = createAsyncThunk(
  'materials/fetchProjectRequests',
  async ({ projectId, token }, { rejectWithValue }) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Assuming backend endpoint: GET /api/materials/project/:projectId
      const response = await axios.get(`http://localhost:5000/api/materials/project/${projectId}`, config);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
// API: POST /api/materials/request
export const createMaterialRequest = createAsyncThunk(
  'materials/createRequest',
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post('http://localhost:5000/api/materials/request', data, config);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// API: GET /api/materials/my-requests
export const fetchMyRequests = createAsyncThunk(
  'materials/fetchMyRequests',
  async (token, { rejectWithValue }) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('http://localhost:5000/api/materials/my-requests', config);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const materialSlice = createSlice({
  name: 'materials',
  initialState: { 
    requests: [], 
    status: 'idle', 
    message: null, 
    error: null 
  },
  reducers: {
    clearMaterialMsg: (state) => { state.message = null; state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMaterialRequest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload.message;
      })
      .addCase(createMaterialRequest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(fetchMyRequests.fulfilled, (state, action) => {
        state.requests = action.payload;
      })
      .addCase(fetchProjectRequests.fulfilled, (state, action) => {
        state.requests = action.payload; // Updates the requests list with project data
      });
  },
});

export const { clearMaterialMsg } = materialSlice.actions;
export default materialSlice.reducer;