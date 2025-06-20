import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container, TextField, Button, Typography, Box
} from '@mui/material';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(registerUser(form)).unwrap();
      navigate('/login');
    } catch {
      setError('Registration failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" gutterBottom>Register</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Name" margin="normal" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField fullWidth label="Email" margin="normal" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField fullWidth label="Password" type="password" margin="normal" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>Register</Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
