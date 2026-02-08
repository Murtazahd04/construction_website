import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import companyReducer from '../features/company/companySlice';
import projectReducer from '../features/projects/projectSlice';
import userReducer from '../features/users/userSlice';
import operationReducer from '../features/operations/operationSlice'; // Required for Reports
import procurementReducer from '../features/procurement/procurementSlice'; // Required for POs & Suppliers
import materialReducer from '../features/materials/materialSlice'; // Required for Material Requests
import adminReducer from '../features/admin/adminSlice'; // 1. Import this
export const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer,
    projects: projectReducer,   // Access via state.projects
    users: userReducer,         // Access via state.users
    operations: operationReducer, // Access via state.operations
    procurement: procurementReducer, // Access via state.procurement
    materials: materialReducer, // Access via state.materials (NEW)
    admin: adminReducer, // 2. Add this line
  },
});

export default store;