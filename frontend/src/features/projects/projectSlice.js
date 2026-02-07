import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/projects';

// ==========================================
// 1. ASYNC THUNKS (API CALLS)
// ==========================================

// Create Project (Flow 3 - PM/Owner)
export const createProject = createAsyncThunk(
    'projects/create',
    async ({ data, token }, { rejectWithValue }) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.post(`${API_URL}/create`, data, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to create project' });
        }
    }
);

// ✅ PRIMARY ACTION: Fetch Projects (Used by PM Dashboard)
export const fetchProjects = createAsyncThunk(
    'projects/fetchProjects',
    async (token, { rejectWithValue }) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`${API_URL}/list`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch projects' });
        }
    }
);

// ✅ ALIAS: Fetch My Projects (Used by Contractor Dashboard)
// This just points to the same logic as fetchProjects
export const fetchMyProjects = fetchProjects;

// ✅ ALIAS: Fetch Owner Projects (Used by Owner Dashboard)
export const fetchOwnerProjects = fetchProjects;


// Fetch Available Contractors
export const fetchContractors = createAsyncThunk(
    'projects/fetchContractors',
    async (token, { rejectWithValue }) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`${API_URL}/contractors`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

// Assign Contractor
export const assignContractor = createAsyncThunk(
    'projects/assign',
    async ({ data, token }, { rejectWithValue }) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.post(`${API_URL}/assign`, data, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

// Fetch Project Team
export const fetchProjectTeam = createAsyncThunk(
    'projects/fetchTeam',
    async ({ projectId, token }, { rejectWithValue }) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`${API_URL}/${projectId}/team`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

// ==========================================
// 2. SLICE DEFINITION
// ==========================================

const projectSlice = createSlice({
    name: 'projects',
    initialState: {
        list: [],
        projects: [], // Added for compatibility if PM dashboard uses state.projects.projects
        contractors: [],
        currentProjectTeam: [],
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearProjectState: (state) => {
            state.successMessage = null;
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- Create Project ---
            .addCase(createProject.pending, (state) => { state.loading = true; })
            .addCase(createProject.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = 'Project Created Successfully';
            })
            .addCase(createProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // --- Fetch Projects (Handles fetchProjects, fetchMyProjects, fetchOwnerProjects) ---
            .addCase(fetchProjects.pending, (state) => { state.loading = true; })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload; 
                state.projects = action.payload; // Sync both for compatibility
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // --- Fetch Contractors ---
            .addCase(fetchContractors.fulfilled, (state, action) => {
                state.contractors = action.payload;
            })

            // --- Assign Contractor ---
            .addCase(assignContractor.fulfilled, (state, action) => {
                state.successMessage = 'Contractor Assigned Successfully';
            })
            .addCase(assignContractor.rejected, (state, action) => {
                state.error = action.payload?.message;
            })

            // --- Fetch Team ---
            .addCase(fetchProjectTeam.fulfilled, (state, action) => {
                state.currentProjectTeam = action.payload;
            });
    },
});

export const { clearProjectState } = projectSlice.actions;
export default projectSlice.reducer;