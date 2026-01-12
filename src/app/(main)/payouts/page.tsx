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
    Divider,
    Box,
    IconButton,
    CircularProgress,
    Alert,
    Pagination,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import apiClient from "../../../services/apiService";
import { API_ENDPOINTS } from "../../../services/endpointDefinition";

export default function DashboardPage() {
    const [payouts, setPayout] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
      const [page, setPage] = useState(1);
      const [limit] = useState(10);
      const [totalPages, setTotalPages] = useState(1);

    // Modal handler
    const [selectedPayout, setSelectedPayout] = useState<any | null>(null);
    const [openModal, setOpenModal] = useState(false);


    // Fetch payouts from backend
    const fetchPayouts = async (pageNumber = page) => {
        try {
            setLoading(true);
            setError(null);

            const res = await apiClient.get(`${API_ENDPOINTS.ALL_PAYOUTS}?page=${pageNumber}&limit=${limit}`);
            if (!res.status) throw new Error("Failed to fetch payout data");

            const data = res.data
            setPayout(data.payload || []);
            setTotalPages(Math.ceil(data.total / limit));
      setPage(data.page);
        } catch (err: any) {
            setError(err.message || "An error occurred while fetching payouts");
        } finally {
            setLoading(false);
        }
    };

    // Collect and handle data for madal
    const handleRowClick = (payout: any) => {
        setSelectedPayout(payout);
        setOpenModal(true);
    };

    useEffect(() => {
        fetchPayouts(page);
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
                                    Payouts Dashboard
                                </Typography>
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Overview of every Payouts on Kite
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
                                                        <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Account Name</TableCell>
                                                        <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Bank Name</TableCell>
                                                        <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Document</TableCell>
                                                        <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Amount src</TableCell>
                                                        <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Currency src</TableCell>
                                                        <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Status</TableCell>
                                                        <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Date</TableCell>
                                                    </TableRow>
                                                </TableHead>

                                                <TableBody>
                                                    {payouts.length > 0 ? (
                                                        payouts.map((payout) => (
                                                            <TableRow hover
                                                                onClick={() => handleRowClick(payout)}
                                                                style={{ cursor: "pointer" }}>
                                                                <TableCell>{payout.account_name}</TableCell>
                                                                <TableCell>{payout.bank_name}</TableCell>
                                                                <TableCell>{payout.is_document_required == 1 ? "YES" : "No"}</TableCell>
                                                                <TableCell>{payout.amount_source.toLocaleString()}</TableCell>
                                                                <TableCell>{payout.currency_source}</TableCell>
                                                                <TableCell>{payout.status}</TableCell>
                                                                <TableCell>{payout.created_at}</TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={5} align="center">
                                                                No payout data available
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
                    Payout Details
                    <IconButton onClick={() => setOpenModal(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    {selectedPayout && (
                        <Box className="grid grid-cols-2 gap-6">

                            {/* LEFT SECTION */}
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    <strong><em>Source Info</em></strong>
                                </Typography>

                                <div className="space-y-2">
                                    <p><strong>Account Name:</strong> {selectedPayout.account_name}</p>
                                    <p><strong>Account Number:</strong> {selectedPayout.account_number}</p>
                                    <p><strong>Banke Name:</strong> {selectedPayout.bank_name}</p>
                                    <p><strong>Amount Source:</strong> {selectedPayout.currency_source} {selectedPayout.amount_source.toLocaleString()}</p>
                                    <p><strong>Fee:</strong> {selectedPayout.currency_source} {selectedPayout.fee.toLocaleString()}</p>
                                    <p><strong>Provider:</strong> {selectedPayout.provider}</p>
                                </div>
                            </Box>

                            {/* RIGHT SECTION */}
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    <strong><em>Destination Info</em></strong>
                                </Typography>

                                <div className="space-y-2">
                                    <p><strong>Recipient det:</strong> {selectedPayout.recipient_information}</p>
                                    <p><strong>Bank Address:</strong> {selectedPayout.bank_address}</p>
                                    <p><strong>Status:</strong> {selectedPayout.status}</p>
                                    <p><strong>Amount Destination:</strong> {selectedPayout.currency_destination} {selectedPayout.amount_destination.toLocaleString()}</p>
                                    <p><strong>Created At:</strong>
                                        {selectedPayout.created_at ?? "N/A"}
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