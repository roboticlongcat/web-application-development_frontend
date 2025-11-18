import { configureStore } from '@reduxjs/toolkit';
import patientsReducer from '../slices/patientsSlice';
import filtersReducer from '../slices/filtersSlice';

export const store = configureStore({
  reducer: {
    patients: patientsReducer,
    filters: filtersReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;