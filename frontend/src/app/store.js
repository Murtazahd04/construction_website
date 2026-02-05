import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "../features/projectSlice";
import companyReducer from '../features/company/companySlice';
export const store = configureStore({
  reducer: {
    project: projectReducer,
    company: companyReducer,
  },
});
