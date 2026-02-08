import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk: Create Sub-User
export const createSubUser = createAsyncThunk(
  'users/createSubUser',
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      
      const response = await axios.post('http://localhost:5000/api/users/create', data, config);
      return response.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Network Error' });
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    status: 'idle', 
    successMessage: null, // ✅ RENAMED from 'message' to 'successMessage'
    error: null,
    createdCredentials: null, 
  },
  reducers: {
    clearUserState: (state) => {
      state.status = 'idle';
      state.successMessage = null; // ✅ Updated here
      state.error = null;
      state.createdCredentials = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.successMessage = null; // ✅ Updated here
        state.createdCredentials = null;
      })
      .addCase(createSubUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.successMessage = action.payload.message; // ✅ Updated here
        state.createdCredentials = action.payload.credentials; 
      })
      .addCase(createSubUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to create user';
      });
  },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;