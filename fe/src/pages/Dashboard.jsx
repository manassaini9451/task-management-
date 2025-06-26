import React, { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Button, Card, CardContent,
  MenuItem, Grid, Box, Stack, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useSelector } from 'react-redux';

axios.defaults.baseURL = 'http://localhost:5000/api';

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Low',
    status: 'Pending',
    dueDate: '',
    file: null,
  });
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filters, setFilters] = useState({ search: '', priority: '', status: '', page: 1 });
  const [total, setTotal] = useState(0);

  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/tasks', {
        ...config,
        params: filters,
      });
      setTasks(res.data || []);
    } catch (err) {
      console.error('❌ Failed to load tasks', err);
      setTasks([]); // fallback to avoid map crash
    }
  };

  useEffect(() => {
    if (user?.token) fetchTasks();
  }, [filters]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    await axios.post('/tasks', data, {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    resetForm();
    fetchTasks();
  };

  const handleEdit = (task) => {
    setEditOpen(true);
    setEditId(task._id);
    setForm(task);
  };

  const handleEditSubmit = async () => {
    await axios.put(`/tasks/${editId}`, form, config);
    setEditOpen(false);
    resetForm();
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/tasks/${id}`, config);
    fetchTasks();
  };

  const toggleStatus = async (id) => {
    await axios.patch(`/tasks/${id}/status`, {}, config);
    fetchTasks();
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      priority: 'Low',
      status: 'Pending',
      dueDate: '',
      file: null,
    });
  };

  const tasksToRender = tasks || [];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>📝 My Tasks</Typography>

      {/* Task Creation Form */}
      <Box component="form" onSubmit={handleCreate} mb={3}>
        <TextField label="Title" fullWidth margin="normal"
          value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <TextField label="Description" fullWidth multiline rows={2} margin="normal"
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <Stack direction="row" spacing={2}>
          <TextField select label="Priority" value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })} fullWidth
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>
          <TextField select label="Status" value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })} fullWidth
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Complete">Complete</MenuItem>
          </TextField>
        </Stack>
        <TextField type="date" fullWidth margin="normal" label="Due Date" InputLabelProps={{ shrink: true }}
          value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
        <TextField type="file" fullWidth
          onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>+ Add Task</Button>
      </Box>

      {/* Filters */}
      <Stack direction="row" spacing={2} mb={3}>
        <TextField label="Search" fullWidth
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <TextField select label="Priority" value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </TextField>
        <TextField select label="Status" value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Complete">Complete</MenuItem>
        </TextField>
      </Stack>

      {/* Tasks */}
      <Grid container spacing={2}>
        {tasksToRender.length === 0 && (
          <Typography sx={{ textAlign: 'center', width: '100%', mt: 4 }}>
            No tasks found.
          </Typography>
        )}
        {tasksToRender.map((task) => (
          <Grid item xs={12} md={6} key={task._id}>
            <Card sx={{
              backgroundColor: task.status === 'Complete' ? '#e0f7fa' : '#fff',
              borderLeft: `6px solid ${task.priority === 'High' ? '#d32f2f' : task.priority === 'Medium' ? '#fbc02d' : '#388e3c'}`
            }}>
              <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography variant="body2" color="text.secondary">{task.description}</Typography>
                <Typography variant="caption">📅 Due: {task.dueDate?.slice(0, 10) || 'N/A'}</Typography><br />
                <Typography variant="caption">🚦 Priority: {task.priority}</Typography><br />
                <Typography variant="caption">📌 Status: {task.status}</Typography>
                {task.file && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                    📎 <a href={`http://localhost:5000/uploads/${task.file}`} target="_blank" rel="noreferrer">View File</a>
                  </Typography>
                )}
                <Stack direction="row" spacing={1} mt={2}>
                  <IconButton onClick={() => handleEdit(task)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(task._id)}><DeleteIcon /></IconButton>
                  <Button size="small" onClick={() => toggleStatus(task._id)}>
                    Mark {task.status === 'Complete' ? 'Pending' : 'Complete'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField label="Title" fullWidth margin="normal" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextField label="Description" fullWidth margin="normal" multiline rows={2} value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <TextField select label="Priority" fullWidth margin="normal" value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>
          <TextField select label="Status" fullWidth margin="normal" value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Complete">Complete</MenuItem>
          </TextField>
          <TextField type="date" fullWidth margin="normal" label="Due Date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSubmit}>Update</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
