import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async Thunk for Company Registration
export const registerCompany = createAsyncThunk(
  'auth/registerCompany',
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register-company', companyData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);



// NEW: Async Thunk for Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      // Response contains: { token, user: { role, ... } }
      localStorage.setItem('token', response.data.token); // Persist token
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Login failed' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null, // Stores user info (email, role)
    token: localStorage.getItem('token') || null,
    role: null,
    loading: false,
    error: null,
    successMessage: null, // To show "Pending Approval"
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem('token');
    },

    resetAuth: (state) => {
      state.loading = false;
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.role = action.payload.user.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Invalid credentials';
      })

      .addCase(registerCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    .addCase(registerCompany.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = action.payload.message;
    })
    .addCase(registerCompany.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Registration failed';
    })
},
});
export const { logout } = authSlice.actions;
export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;