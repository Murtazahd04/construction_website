import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async Thunk: Create Sub-User (PM, Contractor, etc.)
export const createSubUser = createAsyncThunk(
  'users/createSubUser',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: { Authorization: `Bearer ${token}` }, // Attach Token
      };
      const response = await api.post('/users/create', userData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    loading: false,
    successMessage: null,
    error: null,
    createdCredentials: null, // To show the auto-generated password
  },
  reducers: {
    clearUserState: (state) => {
      state.successMessage = null;
      state.error = null;
      state.createdCredentials = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.createdCredentials = action.payload.credentials;
      })
      .addCase(createSubUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create user';
      });
  },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;