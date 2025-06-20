import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTasks, createTask, updateTask, deleteTask
} from '../features/tasks/taskSlice';
import {
  Container, Typography, TextField, Button, MenuItem, Box, Stack,
  Card, CardContent, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Chip, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { tasks, total, loading } = useSelector((state) => state.tasks);

  const [form, setForm] = useState({
    title: '', description: '', dueDate: '', priority: 'Low', status: 'Pending'
  });

  const [editForm, setEditForm] = useState({
    title: '', description: '', dueDate: '', priority: 'Low', status: 'Pending'
  });

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    dispatch(fetchTasks({ page, limit, search, priority: priorityFilter, status: statusFilter }));
  }, [dispatch, page, search, priorityFilter, statusFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return;
    await dispatch(createTask(form));
    setForm({ title: '', description: '', dueDate: '', priority: 'Low', status: 'Pending' });
    dispatch(fetchTasks({ page, limit, search, priority: priorityFilter, status: statusFilter }));
  };

  const handleEditOpen = (task) => {
    setEditTaskId(task._id);
    setEditForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate?.split('T')[0] || '',
      priority: task.priority,
      status: task.status
    });
    setEditOpen(true);
  };

  const handleEditSubmit = () => {
    dispatch(updateTask({ id: editTaskId, data: editForm }));
    setEditOpen(false);
    setEditTaskId(null);
    dispatch(fetchTasks({ page, limit, search, priority: priorityFilter, status: statusFilter }));
  };

  const getColor = (type, value) => {
    if (type === 'priority') {
      return value === 'High' ? 'error' : value === 'Medium' ? 'warning' : 'success';
    }
    if (type === 'status') {
      return value === 'Complete' ? 'primary' : 'default';
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>📝 My Tasks</Typography>

      {/* Create Task Form */}
      <Box component="form" onSubmit={handleCreate} sx={{ mb: 4 }}>
        <TextField fullWidth label="Title" margin="normal"
          value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <TextField fullWidth label="Description" margin="normal" multiline rows={2}
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <TextField type="date" label="Due Date" fullWidth margin="normal"
          InputLabelProps={{ shrink: true }}
          value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        <Stack direction="row" spacing={2} mt={2}>
          <TextField select fullWidth label="Priority" value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>
          <TextField select fullWidth label="Status" value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Complete">Complete</MenuItem>
          </TextField>
        </Stack>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>+ Add Task</Button>
      </Box>

      {/* Filters */}
      <Stack direction="row" spacing={2} mb={3}>
        <TextField fullWidth placeholder="Search tasks..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
        />
        <TextField select label="Priority" value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)} sx={{ minWidth: 140 }}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </TextField>
        <TextField select label="Status" value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 140 }}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Complete">Complete</MenuItem>
        </TextField>
      </Stack>

      {/* Task List */}
      {loading ? (
        <Typography>Loading...</Typography>
      ) : tasks.length === 0 ? (
        <Typography align="center">No tasks found.</Typography>
      ) : (
        <Stack spacing={2}>
          {tasks.map(task => (
            <Card key={task._id}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6" fontWeight="bold">{task.title}</Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip label={task.priority} color={getColor('priority', task.priority)} />
                    <Chip label={task.status} color={getColor('status', task.status)} />
                  </Stack>
                </Stack>
                <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>{task.description}</Typography>
                <Typography variant="caption">Due: {task.dueDate?.split('T')[0] || '—'}</Typography>
                <Stack direction="row" spacing={1} mt={2}>
                  <IconButton onClick={() => handleEditOpen(task)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => dispatch(deleteTask(task._id))}><DeleteIcon /></IconButton>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Pagination */}
      <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
        <Button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          Prev
        </Button>
        <Typography sx={{ pt: 1 }}>Page {page}</Typography>
        <Button onClick={() => setPage((p) => p + 1)} disabled={tasks.length < limit}>
          Next
        </Button>
      </Stack>

      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Title" margin="normal" value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
          <TextField fullWidth label="Description" margin="normal" multiline rows={2}
            value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
          <TextField type="date" label="Due Date" fullWidth margin="normal"
            InputLabelProps={{ shrink: true }}
            value={editForm.dueDate} onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })} />
          <TextField select fullWidth label="Priority" margin="normal" value={editForm.priority}
            onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>
          <TextField select fullWidth label="Status" margin="normal" value={editForm.status}
            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Complete">Complete</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSubmit}>Update</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
