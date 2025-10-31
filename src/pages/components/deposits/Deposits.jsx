import React, { useState, useEffect } from "react";
import authService from "../../../api/authService";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Pagination,
} from "@mui/material";

export default function Deposits() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const [open, setOpen] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [depositDetails, setDepositDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Fetch deposits with pagination
  const fetchData = async (page, limit) => {
    try {
      setLoading(true);
      const response = await authService.getDeposits(page, limit);
      const data = response.data;

      setRows(data?.payload || []);
      setTotalPages(data?.rows || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, limit);
  }, [page]);

  // Fetch deposit details
  const fetchDepositDetails = async (id) => {
    try {
      setDetailsLoading(true);
      const response = await authService.getDepositById(id);
      setDepositDetails(response.data?.data || {});
    } catch (err) {
      console.error("Error fetching deposit details:", err);
      setDepositDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleRowClick = (deposit) => {
    setSelectedDeposit(deposit);
    setOpen(true);
    fetchDepositDetails(deposit.id);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDeposit(null);
    setDepositDetails(null);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

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
          Deposit Table
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ textAlign: "center", mt: 5 }}>
          {error}
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead sx={{ bgcolor: "#f0f0f0" }}>
                <TableRow>
                  <TableCell>Depositor ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Currency</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Provider</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Reason</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    key={index}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(row)}
                  >
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name || "---"}</TableCell>
                    <TableCell>
                      {row.currency} {row.amount?.toLocaleString() || "---"}
                    </TableCell>
                    <TableCell>{row.currency}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.provider}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>
                      {row.transaction_object?.reason || "---"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}

      {/* Modal Section */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Deposit Details</DialogTitle>

        <DialogContent dividers>
          {detailsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress />
            </Box>
          ) : depositDetails ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {/* Left column */}
              <Box sx={{ flex: 1, minWidth: "45%" }}>
                <Typography sx={{ mb: 1 }}>
                  <strong>Name:</strong> {depositDetails?.name || "---"}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <strong>Amount:</strong>{" "}
                  {depositDetails.deposit?.currency}{" "}
                  {depositDetails.deposit?.amount?.toLocaleString() || "---"}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <strong>Amount Settled:</strong>{" "}
                  {depositDetails.deposit?.currency}{" "}
                  {depositDetails.deposit?.amount_settled?.toLocaleString() ||
                    "---"}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <strong>Transaction Fee:</strong>{" "}
                  {depositDetails.deposit?.currency}{" "}
                  {depositDetails.deposit?.fee?.toLocaleString() || "---"}
                </Typography>
              </Box>

              {/* Right column */}
              <Box sx={{ flex: 1, minWidth: "45%" }}>
                <Typography sx={{ mb: 1 }}>
                  <strong>Payer Name:</strong>{" "}
                  {depositDetails.deposit?.transaction_object?.payer?.name ||
                    "---"}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <strong>Payer Bank Name:</strong>{" "}
                  {
                    depositDetails.deposit?.transaction_object?.payer
                      ?.bank_name || "---"
                  }
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <strong>Payer Account No.:</strong>{" "}
                  {
                    depositDetails.deposit?.transaction_object?.payer
                      ?.account_number || "---"
                  }
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <strong>Date Created:</strong>{" "}
                  {depositDetails.deposit?.created_at || "---"}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography color="textSecondary">No details found.</Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}