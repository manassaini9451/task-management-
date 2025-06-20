import axios from 'axios';

const API = 'http://localhost:5000/api/tasks';
const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export const fetchTasks = async ({ page, limit, search, priority, status }) => {
  const res = await axios.get(`${API}?page=${page}&limit=${limit}&search=${search}&priority=${priority}&status=${status}`, getConfig());
  return res.data;
};

export const createTask = async (data) => {
  const res = await axios.post(API, data, getConfig());
  return res.data;
};

export const updateTask = async ({ id, data }) => {
  const res = await axios.put(`${API}/${id}`, data, getConfig());
  return res.data;
};

export const deleteTask = async (id) => {
  await axios.delete(`${API}/${id}`, getConfig());
  return id;
};
