import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// 1. Create Project
export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.post('/projects/create', projectData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// 2. Fetch My Projects
export const fetchProjects = createAsyncThunk(
  'projects/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get('/projects/list', config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// 3. Fetch Available Contractors
export const fetchContractors = createAsyncThunk(
  'projects/fetchContractors',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get('/projects/contractors', config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// 4. Assign Contractor
export const assignContractor = createAsyncThunk(
  'projects/assign',
  async (assignmentData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.post('/projects/assign', assignmentData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    contractors: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearProjectState: (state) => {
      state.successMessage = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Project
      .addCase(createProject.pending, (state) => { state.loading = true; })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Project Created Successfully';
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      
      // Fetch Projects
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
      })

      // Fetch Contractors
      .addCase(fetchContractors.fulfilled, (state, action) => {
        state.contractors = action.payload;
      })

      // Assign Contractor
      .addCase(assignContractor.fulfilled, (state, action) => {
        state.successMessage = 'Contractor Assigned Successfully';
      })
      .addCase(assignContractor.rejected, (state, action) => {
        state.error = action.payload?.message;
      });
  },
});

export const { clearProjectState } = projectSlice.actions;
export default projectSlice.reducer;