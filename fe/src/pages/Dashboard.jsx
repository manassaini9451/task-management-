import { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Button, Card, CardContent,
  MenuItem, Grid, Box, Stack, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.baseURL = 'http://localhost:5000/api';

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', priority: 'Low', status: 'Pending', dueDate: '', file: null
  });
  const [filters, setFilters] = useState({ search: '', priority: '', status: '', page: 1 });
  const [total, setTotal] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const tokenConfig = {
    headers: { Authorization: `Bearer ${user?.token}` }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/tasks', { ...tokenConfig, params: filters });
      setTasks(res.data.tasks);
      setTotal(res.data.total);
    } catch (err) {
      toast.error('Failed to load tasks');
    }
  };

  useEffect(() => {
    if (user?.token) fetchTasks();
  }, [filters]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', form.title);
    data.append('description', form.description);
    data.append('dueDate', form.dueDate);
    data.append('priority', form.priority);
    data.append('status', form.status);
    if (form.file) data.append('file', form.file);

    try {
      await axios.post('/tasks', data, {
        headers: {
          ...tokenConfig.headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Task created');
      setForm({ title: '', description: '', priority: 'Low', status: 'Pending', dueDate: '', file: null });
      fetchTasks();
    } catch (err) {
      toast.error('Create failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/tasks/${id}`, tokenConfig);
      toast.success('Task deleted');
      fetchTasks();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleEdit = (task) => {
    setEditOpen(true);
    setEditId(task._id);
    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate?.slice(0, 10) || '',
      file: null
    });
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`/tasks/${editId}`, form, tokenConfig);
      toast.success('Task updated');
      setEditOpen(false);
      setForm({ title: '', description: '', priority: 'Low', status: 'Pending', dueDate: '', file: null });
      fetchTasks();
    } catch {
      toast.error('Update failed');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`/tasks/${id}/status`, {}, tokenConfig);
      fetchTasks();
    } catch {
      toast.error('Failed to toggle status');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>📝 My Tasks</Typography>

      <Box component="form" onSubmit={handleCreate} mb={3}>
        <TextField label="Title" fullWidth margin="normal" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <TextField label="Description" fullWidth margin="normal" multiline rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Stack direction="row" spacing={2}>
          <TextField select label="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} fullWidth>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>
          <TextField select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} fullWidth>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Complete">Complete</MenuItem>
          </TextField>
        </Stack>
        <TextField
          type="date"
          label="Due Date"
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
        <TextField
          type="file"
          fullWidth
          inputProps={{ accept: '.jpg,.jpeg,.png,.pdf,.docx' }}
          onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>+ Add Task</Button>
      </Box>

      <Stack direction="row" spacing={2} mb={3}>
        <TextField label="Search" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} fullWidth />
        <TextField select label="Priority" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value, page: 1 })}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </TextField>
        <TextField select label="Status" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Complete">Complete</MenuItem>
        </TextField>
      </Stack>

      <Grid container spacing={2}>
        {tasks.map(task => (
          <Grid item xs={12} md={6} key={task._id}>
            <Card sx={{ backgroundColor: task.status === 'Complete' ? '#e8f5e9' : '#fff' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{task.title}</Typography>
                <Typography variant="body2" color="textSecondary">{task.description}</Typography>
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
                  <Button size="small" onClick={() => handleToggleStatus(task._id)}>
                    Mark {task.status === 'Complete' ? 'Pending' : 'Complete'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Stack direction="row" justifyContent="center" mt={4} spacing={2}>
        <Button disabled={filters.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>Previous</Button>
        <Typography>Page {filters.page}</Typography>
        <Button disabled={(filters.page * 5) >= total} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Next</Button>
      </Stack>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField label="Title" fullWidth margin="normal" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <TextField label="Description" fullWidth margin="normal" multiline rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <TextField select label="Priority" fullWidth margin="normal" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>
          <TextField select label="Status" fullWidth margin="normal" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Complete">Complete</MenuItem>
          </TextField>
          <TextField
            type="date"
            label="Due Date"
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
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
