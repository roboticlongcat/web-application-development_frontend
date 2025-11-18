import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { type Patient } from '../types/patient';
import { patientApi } from '../services/api';

export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async () => {
    const response = await patientApi.getPatients();
    return response;
  }
);

interface PatientsState {
  items: Patient[];
  loading: boolean;
  error: string | null;
  fromMock: boolean;
}

const initialState: PatientsState = {
  items: [],
  loading: false,
  error: null,
  fromMock: false,
};

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    clearPatients: (state) => {
      state.items = [];
      state.fromMock = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.patients;
        state.fromMock = action.payload.fromMock;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch patients';
        state.fromMock = true;
      });
  },
});

export const { clearPatients } = patientsSlice.actions;
export default patientsSlice.reducer;