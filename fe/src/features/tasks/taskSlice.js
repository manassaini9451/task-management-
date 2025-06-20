import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:5000/api/tasks';
const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export const fetchTasks = createAsyncThunk('tasks/fetch', async (params) => {
  const query = new URLSearchParams(params).toString();
  const res = await axios.get(`${API}?${query}`, getConfig());
  return res.data;
});

export const createTask = createAsyncThunk('tasks/create', async (data) => {
  const res = await axios.post(API, data, getConfig());
  return res.data;
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, data }) => {
  const res = await axios.put(`${API}/${id}`, data, getConfig());
  return res.data;
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id) => {
  await axios.delete(`${API}/${id}`, getConfig());
  return id;
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    total: 0,
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.total = action.payload.total;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const i = state.tasks.findIndex(t => t._id === action.payload._id);
        if (i !== -1) state.tasks[i] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t._id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
