"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  Pagination,
  Box,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import apiClient from "../../../pages/services/apiService";
import { API_ENDPOINTS } from "../../../pages/services/endpointDefinition";

export default function DashboardPage() {
  const [deposits, setDeposit] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Modal handler
  const [selectedDeposit, setSelectedDeposit] = useState<any | null>(null);
  const [openModal, setOpenModal] = useState(false);


  // Fetch deposits from backend
  const fetchDeposits = async (pageNumber = page) => {
    try {
      setLoading(true);
      setError(null);

      const res = await apiClient.get(`${API_ENDPOINTS.ALL_DEPOSITS}?page=${pageNumber}&limit=${limit}`);

      if (!res.status) throw new Error("Failed to fetch deposit data");

      const data = res.data
      setDeposit(data.payload || []);
      setTotalPages(Math.ceil(data.total / limit));
      setPage(data.page);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching deposits");
    } finally {
      setLoading(false);
    }
  };

  // Collect and handle data for madal
  const handleRowClick = (deposit: any) => {
    setSelectedDeposit(deposit);
    setOpenModal(true);
  };

  useEffect(() => {
    fetchDeposits(page);
  }, [page]);


  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Main content */}
          <main className="col-span-12 md:col-span-10" style={{ maxHeight: "85vh", width: "75vw" }}>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h5" component="h1">
                  Deposit Dashboard
                </Typography>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  Overview of every deposits on Kite
                </div>
              </div>
            </div>

            <div className="mt-8">
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
                    <div style={{ maxHeight: "85vh", width: "100%", overflowY: "auto" }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Account Id</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Provider</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Amount</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Currency</TableCell>
                            <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                              Status
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {deposits.length > 0 ? (
                            deposits.map((deposit) => (
                              <TableRow hover
                                onClick={() => handleRowClick(deposit)}
                                style={{ cursor: "pointer" }}>
                                <TableCell>{deposit.account_id}</TableCell>
                                <TableCell>{deposit.type}</TableCell>
                                <TableCell>{deposit.provider}</TableCell>
                                <TableCell>{deposit.amount.toLocaleString()}</TableCell>
                                <TableCell>{deposit.currency}</TableCell>
                                <TableCell align="right">{deposit.status}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} align="center">
                                No deposit data available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  <div className="flex justify-center mt-4">
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={(event, value) => setPage(value)}
                      color="primary"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      {/* Modal data */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          Deposit Details
          <IconButton onClick={() => setOpenModal(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {selectedDeposit && (
            <Box className="grid grid-cols-2 gap-6">

              {/* LEFT SECTION */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  <strong><em>Depositors Info</em></strong>
                </Typography>

                <div className="space-y-2">
                  <p><strong>Payer's Name:</strong> {selectedDeposit.transaction_object.payer.name ?? "N/A"}</p>
                  <p><strong>Banke Name:</strong> {selectedDeposit.transaction_object.payer.bank_name ?? "N/A"}</p>
                  <p><strong>Account Number:</strong> {selectedDeposit.transaction_object.payer.account_number ?? "N/A"}</p>
                  <p><strong>Trans. reason:</strong> {selectedDeposit.transaction_object.reason ?? "N/A"}</p>
                </div>
              </Box>

              {/* RIGHT SECTION */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  <strong><em>Transaction Details</em></strong>
                </Typography>

                <div className="space-y-2">
                  <p><strong>Amount:</strong> {selectedDeposit.currency} {selectedDeposit.amount.toLocaleString()}</p>
                  <p><strong>Amount settled:</strong> {selectedDeposit.currency} {selectedDeposit.amount_settled.toLocaleString()}</p>
                  <p><strong>Fee:</strong> {selectedDeposit.currency} {selectedDeposit.fee.toLocaleString()}</p>
                  <p><strong>Created At:</strong>
                    {selectedDeposit.created_at ?? "N/A"}
                  </p>
                </div>
              </Box>

            </Box>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}