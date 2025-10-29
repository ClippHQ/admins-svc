import React, { useState } from "react";
import authService from "../api/authService";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
} from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // clear old errors
    console.log("Login button clicked ✅");

    try {
      const response = await authService.login(email, password);
      console.log("Login response:", response.data);

      if (response.data) {
        navigate("/");
      } else {
        setError("Login failed: No token returned");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f8f8f8",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: "90%",
          maxWidth: 400,
          textAlign: "center",
          borderRadius: 3,
          bgcolor: "white",
        }}
      >
        <Typography variant="h5" sx={{ mb: 1 }}>
          Kite Admin Login
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box component="form" onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            onClick={handleLogin}
            sx={{
              bgcolor: "#1976d2",
              ":hover": { bgcolor: "#115293" },
              py: 1.2,
              fontWeight: "bold",
            }}
          >
            Login
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
