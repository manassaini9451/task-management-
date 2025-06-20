import { Container, Typography, Stack, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
        Task Manager
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={4}>
        Organize your work efficiently.
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button variant="contained" color="primary" component={Link} to="/login">
          Login
        </Button>
        <Button variant="outlined" color="secondary" component={Link} to="/register">
          Register
        </Button>
      </Stack>
    </Container>
  );
}
