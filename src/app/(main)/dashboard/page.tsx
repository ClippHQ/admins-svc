"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Drawer,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  LinearProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import apiClient from "../../../services/apiService";
import { API_ENDPOINTS } from "../../../services/endpointDefinition";
import { formatAmount } from "src/lib/amount";
import { useProviderBalances } from "src/api/misc";
import { titleCase } from "src/components/generic-table-generator";


function ProviderBalanceCard({provider, balance, currency}: {provider: string; balance: number; currency: string}) {
  return (
                     <Card>
                        <CardContent>
      <Typography textTransform="capitalize" gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
          {titleCase(provider)}
      </Typography>
      <Typography variant="h5" component="div">
        {formatAmount({
          amount: balance/100,
          currency,
        })}
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{currency}</Typography>
    </CardContent>

                  </Card>
  )
}

export default function DashboardPage() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [admins, setAdmins] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCreating, setErrorCreating] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {data, status } = useProviderBalances()

  const balances = useMemo(() => {
    const result: {provider: string; balance: number; currency: string}[] = [];
    if(data) {
      Object.keys(data).forEach((provider) => {
        const itemBalances = data[provider as keyof typeof data];
        result.push(...itemBalances.map(v => ({
          ...v,
          provider
        })))
      })
    }
    return result;
  }, [data])
  // Form fields for new admin
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");

  // Fetch admins from backend
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      setRole("admin");

      const res = await apiClient.get(API_ENDPOINTS.ALL_ADMIN);
      if (!res.status) throw new Error("Failed to fetch admin data");

      setAdmins(res.data.data || []);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle form submit
  const handleSave = async () => {
    if (!email || !password || !role) {
      setErrorCreating("Please fill all fields before creating");
      return;
    }

    try {
      setSaving(true);
      setErrorCreating(null);

      const payload = {
        email,
        password,
        role,
      };

      const res = await apiClient.post(API_ENDPOINTS.ADD_ADMIN_ACCOUNT, payload);
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed to create admin account");
      }

      // Clear form
      setEmail("");
      setPassword("");
      setRole("admin");

      // Show success message
      setSuccessMessage("Admin created successfully!");

      // Close drawer
      setOpenDrawer(false);

      // Refresh the table
      fetchAdmins();
    } catch (err: any) {
      setErrorCreating(err.message || "An error occurred while creating admin");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Main content */}
          <main className="col-span-12 md:col-span-10">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h5" component="h1">
                  Admin Dashboard
                </Typography>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  Overview of every admin onboarded onto Kite
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDrawer(true)}
                >
                  New Admin
                </Button>
              </div>
            </div>

            <div className="mt-8 gap-y-[16px]">
              <Paper>
               {status === 'pending' ? ( <LinearProgress />) : null}
                
                <div className="flex flex-row gap-x-3 gap-y-2 flex-wrap">
                  {balances.map((balanceItem, index) => (<ProviderBalanceCard key={`provider-${index+1}`} {...balanceItem}  />))}
                  <Card>
                        <CardContent>
      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
        Graph
      </Typography>
      <Typography variant="h5" component="div">
        {formatAmount({
          amount: 120000/100,
          currency: 'USD',
        })}
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>USD</Typography>
    </CardContent>

                  </Card>
                </div>
              </Paper>
              <Card className="shadow-sm">
                <CardContent>
                  {/* Loading */}
                  {loading && (
                    <div className="flex justify-center py-12">
                      <CircularProgress />
                    </div>
                  )}

                  {/* Error */}
                  {!loading && error && (
                    <Alert severity="error" className="my-4">
                      {error}
                    </Alert>
                  )}

                  {/* Table */}
                  {!loading && !error && (
                    <div style={{ maxHeight: "65vh", overflowY: "auto" }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Role</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Created Date</TableCell>
                            <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                              Actions
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {admins.length > 0 ? (
                            admins.map((admin) => (
                              <TableRow key={admin.id} hover>
                                <TableCell>{admin.email}</TableCell>
                                <TableCell>{admin.role}</TableCell>
                                <TableCell>{admin.is_active ? "Active" : "Inactive"}</TableCell>
                                <TableCell>{admin.created_at}</TableCell>
                                <TableCell align="right">
                                  <IconButton>
                                    <MoreVertIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} align="center">
                                No admin data available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      {/* Drawer for new form */}
      <Drawer anchor="right" open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <Box sx={{ width: 350, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Add New Admin
          </Typography>

          {errorCreating && (
            <Alert severity="error" className="my-2">
              {errorCreating}
            </Alert>
          )}

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Role"
            fullWidth
            margin="normal"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <TextField
            label="Password"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </Box>
      </Drawer>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        message={successMessage}
      />
    </div>
  );
}