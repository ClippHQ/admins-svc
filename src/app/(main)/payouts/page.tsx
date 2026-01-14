"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    IconButton,
    Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Payout } from "src/types";
import { formatAmount } from "src/lib/amount";
import { usePayouts } from "src/api/transactions";
import { GenericTableGenerator } from "src/components/generic-table-generator";

export default function DashboardPage() {
    const infiniteData = usePayouts(30);
    const { data: payouts, error: queryError } = infiniteData;


    // Modal handler
    const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
    const [openModal, setOpenModal] = useState(false);

    const error = queryError ? (queryError as Error).message ?? 'Something went wrong' : null;


    // Collect and handle data for madal
    const handleRowClick = (payout: Payout) => {
        setSelectedPayout(payout);
        setOpenModal(true);
    };

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

                                    {/* Error */}
                                    {error && (
                                        <Alert severity="error" className="my-4">
                                            {error}
                                        </Alert>
                                    )}

                                    {/* Table */}
                                    <GenericTableGenerator
                                        data={payouts}
                                        columnRender={{
                                            created_at: 'datetime',
                                            account_name: 'text',
                                            currency_source: 'text',
                                            amount_source: (value) => {
                                                return formatAmount({
                                                    amount: (value.amount_source) / 100,
                                                    currency: value.currency_source || 'USD',
                                                    withDecimals: true
                                                })
                                            },
                                            fee: (value) => {
                                                return formatAmount({
                                                    amount: (value.fee) / 100,
                                                    currency: value.currency_source || 'USD',
                                                    withDecimals: true
                                                })
                                            },
                                            status: 'text',


                                        }}
                                        onRowClick={handleRowClick}
                                        infiniteQueryResult={infiniteData}
                                        paginationModel={{
                                            page: 0,
                                            pageSize: 30
                                        }}
                                    />
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
                                    <p><strong>Amount Source:</strong> {formatAmount({
                                        amount: (selectedPayout?.amount_source ?? 0) / 100,
                                        currency: selectedPayout?.currency_source ?? 'USD',
                                        withDecimals: true
                                    })}</p>
                                    <p><strong>Fee:</strong> {formatAmount({
                                        amount: (selectedPayout?.fee ?? 0) / 100,
                                        currency: selectedPayout?.currency_source ?? 'USD',
                                        withDecimals: true
                                    })}</p>
                                    <p><strong>Provider:</strong> {selectedPayout.provider}</p>
                                </div>
                            </Box>

                            {/* RIGHT SECTION */}
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    <strong><em>Destination Info</em></strong>
                                </Typography>

                                <div className="space-y-2">
                                    <p><strong>Recipient det:</strong> {selectedPayout?.recipient_information + ''}</p>
                                    <p><strong>Bank Address:</strong> {selectedPayout?.bank_address}</p>
                                    <p><strong>Status:</strong> {selectedPayout.status}</p>
                                    <p><strong>Amount Destination:</strong> {formatAmount({
                                        currency: selectedPayout.currency_destination ?? 'USD',
                                        amount: (selectedPayout.amount_destination ?? 0) / 100,
                                        withDecimals: true
                                    })}</p>
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