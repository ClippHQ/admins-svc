import React from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
} from "@mui/material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import authService from "../api/authService"; 

const drawerWidth = 200;

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex", // ✅ fixed from 'noflex'
        minHeight: "100vh",
        width: "100vw",
        bgcolor: "#f8f8f8",
      }}
    >
      {/* ✅ Top Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#f5f5f5",
          color: "black",
          boxShadow: "none",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography variant="h6" noWrap component="div">
            Kite Finance - Admin
          </Typography>
        </Toolbar>
      </AppBar>

      {/* ✅ Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#d3d3d3",
            color: "black",
            borderRight: "1px solid #ccc",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between", // ✅ to keep logout button at bottom
          },
        }}
      >
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <Toolbar />
          <List>
            {[
              { text: "Users", path: "/" },
              { text: "Deposits", path: "/deposits" },
              { text: "VA", path: "/va" },
            ].map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    "&:hover": { backgroundColor: "#bdbdbd" },
                  }}
                >
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* ✅ Logout Button (Sticky at Bottom) */}
        <Box sx={{ p: 2, borderTop: "1px solid #ccc" }}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* ✅ Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f8f8f8",
          color: "black",
          p: 3,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar />
        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
