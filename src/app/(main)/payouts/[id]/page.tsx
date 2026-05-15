"use client";

import Head from "next/head";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Paper,
    Typography,
} from "@mui/material";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";
import { usePayoutDetails } from "src/api/transactions";
import { Payout } from "src/types";
import { formatAmount } from "src/lib/amount";

function StatusChip({ status }: { status: Payout["status"] }) {
    const color = useMemo((): React.ComponentProps<typeof Chip>["color"] => {
        switch (status) {
            case "successful": return "success";
            case "pending":    return "warning";
            case "failed":     return "error";
            case "reversed":   return "error";
            case "sent":       return "info";
        }
    }, [status]);

    return <Chip label={status} color={color} />;
}

export default function PayoutDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const { data, status, error } = usePayoutDetails(id);
    const payout = data?.payout;
    const profile = data?.profile;

    const loading = status === "pending";
    const errorMessage = status === "error" ? ((error as Error)?.message ?? "An unexpected error occurred") : null;

    return (
        <>
            <Head>
                <title>Payout - {loading ? "Loading..." : payout?.reference ?? id}</title>
                <meta name="description" content={`Details for payout ID: ${id}`} />
            </Head>

            <Container>
                {loading && (
                    <div className="flex justify-center py-12">
                        <CircularProgress />
                    </div>
                )}

                {errorMessage && (
                    <Alert severity="error" className="my-4">
                        {errorMessage}
                    </Alert>
                )}

                {payout && (
                    <Paper style={{ padding: "16px" }}>
                        {/* Header */}
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                            <Box display="flex" alignItems="center" columnGap="16px">
                                <Box>
                                    <Typography variant="h4">
                                        {payout.account_name ?? "Payout"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {payout.reference ?? "—"}
                                    </Typography>
                                </Box>
                                <StatusChip status={payout.status} />
                            </Box>
                            {profile?.user_id && (
                                <Link href={`/profiles/${profile.user_id}`}>
                                    <Button variant="outlined">View Profile</Button>
                                </Link>
                            )}
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Box className="grid grid-cols-2 gap-6">
                            {/* Source Info */}
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    <strong><em>Source Info</em></strong>
                                </Typography>
                                <div className="space-y-2">
                                    <p><strong>Account Name:</strong> {payout.account_name}</p>
                                    <p><strong>Account Number:</strong> {payout.account_number}</p>
                                    <p><strong>Bank Name:</strong> {payout.bank_name}</p>
                                    <p><strong>Amount:</strong> {formatAmount({
                                        amount: (payout.amount_source ?? 0) / 100,
                                        currency: payout.currency_source ?? 'USD',
                                        withDecimals: true,
                                    })}</p>
                                    <p><strong>Fee:</strong> {formatAmount({
                                        amount: (payout.fee ?? 0) / 100,
                                        currency: payout.currency_source ?? 'USD',
                                        withDecimals: true,
                                    })}</p>
                                    <p><strong>Provider:</strong> {payout.provider}</p>
                                    <p><strong>Narration:</strong> {payout.narration ?? "—"}</p>
                                </div>
                            </Box>

                            {/* Destination Info */}
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    <strong><em>Destination Info</em></strong>
                                </Typography>
                                <div className="space-y-2">
                                    <p><strong>Amount Destination:</strong> {formatAmount({
                                        amount: (payout.amount_destination ?? 0) / 100,
                                        currency: payout.currency_destination ?? 'USD',
                                        withDecimals: true,
                                    })}</p>
                                    <p><strong>Country:</strong> {payout.country}</p>
                                    <p><strong>Bank Address:</strong> {payout.bank_address ?? "—"}</p>
                                    <p><strong>Swift Code:</strong> {payout.swift_code ?? "—"}</p>
                                    <p><strong>Sort Code:</strong> {payout.sort_code ?? "—"}</p>
                                    <p><strong>Payment Scheme:</strong> {payout.payment_scheme ?? "—"}</p>
                                    <p><strong>Created At:</strong> {payout.created_at ?? "—"}</p>
                                </div>
                            </Box>
                        </Box>
                    </Paper>
                )}
            </Container>
        </>
    );
}
