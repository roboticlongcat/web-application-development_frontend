import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  searchTerm: string;
  statusFilter: 'all' | 'active' | 'removed';
}

const initialState: FiltersState = {
  searchTerm: '',
  statusFilter: 'active',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<'all' | 'active' | 'removed'>) => {
      state.statusFilter = action.payload;
    },
    clearFilters: (state) => {
      state.searchTerm = '';
      state.statusFilter = 'active';
    },
  },
});

export const { setSearchTerm, setStatusFilter, clearFilters } = filtersSlice.actions;
export default filtersSlice.reducer;