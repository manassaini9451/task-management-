// 📁 src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../api/axios'; // ✅ Uses the custom axios instance
import { Container, Typography, Box } from '@mui/material';

const Profile = () => {
  const { token } = useSelector(state => state.auth);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    axios.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setProfile(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to fetch profile'));
  }, [token]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>👤 My Profile</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {profile ? (
        <Box mt={2}>
          <Typography><strong>Name:</strong> {profile.name}</Typography>
          <Typography><strong>Email:</strong> {profile.email}</Typography>
        </Box>
      ) : (
        <Typography>Loading profile...</Typography>
      )}
    </Container>
  );
};

export default Profile;
