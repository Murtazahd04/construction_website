// frontend/src/features/company/companySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios'; // Import your configured axios instance

export const registerCompany = createAsyncThunk(
  'company/register',
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/companies/register', companyData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState: {
    isLoading: false,
    successMessage: null,
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.successMessage = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerCompany.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Registration failed';
      });
  },
});

export const { resetState } = companySlice.actions;
export default companySlice.reducer;