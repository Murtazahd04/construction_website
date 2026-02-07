import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk: Create Sub-User (PM, Contractor, Engineer, Supplier)
// Accepts: { data, token } where data is { email, role, specialization }
export const createSubUser = createAsyncThunk(
  'users/createSubUser',
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }, // Attach JWT Token
      };
      
      // POST request to backend
      const response = await axios.post('http://localhost:5000/api/users/create', data, config);
      
      // Returns: { message: "...", credentials: { email, password } }
      return response.data; 
    } catch (err) {
      // Return backend error message
      return rejectWithValue(err.response?.data || { message: 'Network Error' });
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    message: null, // Success message
    error: null,   // Error message
    createdCredentials: null, // Store the auto-generated password to show the user
  },
  reducers: {
    // ✅ RENAMED TO MATCH YOUR IMPORT IN DASHBOARD
    clearUserState: (state) => {
      state.status = 'idle';
      state.message = null;
      state.error = null;
      state.createdCredentials = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
        state.createdCredentials = null;
      })
      .addCase(createSubUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload.message;
        // Important: Capture the temp password sent by backend
        state.createdCredentials = action.payload.credentials; 
      })
      .addCase(createSubUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to create user';
      });
  },
});

// ✅ EXPORT THE CORRECT ACTION NAME
export const { clearUserState } = userSlice.actions;

export default userSlice.reducer;