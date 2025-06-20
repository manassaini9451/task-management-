import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

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
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        {formError && <Typography color="error">{formError}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth label="Email" margin="normal"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            fullWidth label="Password" type="password" margin="normal"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>Login</Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account? <Link to="/register">Register</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
