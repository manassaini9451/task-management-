import React, { useState, useEffect } from 'react';
import {
  Container, TextField, Button, Typography, Box, Avatar, Paper
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user, loading, error } = useSelector(state => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(form)).unwrap();
    } catch {
      setFormError('Invalid email or password');
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  return (
    <Container maxWidth="xs">
      <Paper elevation={4} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar
            src="/logo.png"
            alt="Taskify Logo"
            sx={{ width: 64, height: 64, bgcolor: '#fff', p: 1, boxShadow: 2 }}
          />
        </Box>
        <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
          Welcome to Taskify
        </Typography>

        {formError && (
          <Typography color="error" align="center" sx={{ mt: 1 }}>
            {formError}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth label="Email" margin="normal"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            fullWidth label="Password" type="password" margin="normal"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 2, py: 1.2 }}
          >
            Login
          </Button>
        </form>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
            Register
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
