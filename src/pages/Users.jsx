import React from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function Users() {
  const rows = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor" },
    { id: 3, name: "Sam Wilson", email: "sam@example.com", role: "Viewer" },
  ];

  return (
    <Box sx={{ p: 3, width: "95%", height: "100vh", bgcolor: "#f9f9f9" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Admin User Table
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: "#1976d2",
            ":hover": { bgcolor: "#115293" },
            textTransform: "none",
            fontWeight: "bold",
          }}
          onClick={() => alert("Add New Clicked")}
        >
          Add New
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}