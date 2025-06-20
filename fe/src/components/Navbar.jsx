import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!token) return null;

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          📝 Task Manager
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Hi, {user?.name || 'User'}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
