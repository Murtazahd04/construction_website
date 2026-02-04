import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const testBackendConnection = createAsyncThunk(
  "project/testConnection",
  async () => {
    const response = await api.get("/projects/test");
    return response.data;
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState: {
    message: "",
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(testBackendConnection.pending, (state) => {
        state.loading = true;
      })
      .addCase(testBackendConnection.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(testBackendConnection.rejected, (state, action) => {
        state.loading = false;
        state.error = "Backend connection failed ❌";
      });
  },
});

export default projectSlice.reducer;
