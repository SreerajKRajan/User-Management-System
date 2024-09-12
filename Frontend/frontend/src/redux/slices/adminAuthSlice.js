import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define initial state
const initialState = {
  users: [],
  loading: false,
  error: null,
  searchTerm: '',
  isAuthenticated: !!localStorage.getItem('token'),  // Add isAuthenticated to check localStorage
};

// Thunks for fetching users and handling errors
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/admin/users/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Action to set authentication state
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchTerm, clearError, setAuthenticated } = adminSlice.actions;
export default adminSlice.reducer;
