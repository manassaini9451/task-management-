import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:5000/api/auth';

export const loginUser = createAsyncThunk('auth/login', async (data) => {
  const res = await axios.post(`${API}/login`, data);
  localStorage.setItem('token', res.data.token);
  return res.data;
});

export const registerUser = createAsyncThunk('auth/register', async (data) => {
  const res = await axios.post(`${API}/register`, data);
  return res.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Login failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
