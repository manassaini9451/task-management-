import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar
} from '@mui/material';
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
    <AppBar position="static" sx={{ backgroundColor: '#1976d2', px: 2 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* ✅ Logo + App Name */}
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar
            src="/logo.png"
            alt="Taskify Logo"
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#fff',
              p: 0.5,
              border: '2px solid #eee',
              boxShadow: 1
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Taskify
          </Typography>
        </Box>

        {/* ✅ User Info + Logout */}
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Hi, {user?.name || 'User'}
          </Typography>
          <Button
            sx={{
              backgroundColor: '#fff',
              color: '#1976d2',
              '&:hover': { backgroundColor: '#e3f2fd' }
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
