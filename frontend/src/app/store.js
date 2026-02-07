import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "../features/projectSlice";
import companyReducer from '../features/company/companySlice';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice'; // Import
export const store = configureStore({
  reducer: {
    project: projectReducer,
    company: companyReducer,
    auth: authReducer,
    users: userReducer, // Add
  },
});
