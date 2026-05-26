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
import { useConversionDetails } from "src/api/transactions";
import { formatAmount } from "src/lib/amount";

function StatusChip({ status }: { status: string }) {
    const color = useMemo((): React.ComponentProps<typeof Chip>["color"] => {
        switch (status) {
            case "successful": return "success";
            case "pending":    return "warning";
            case "failed":     return "error";
            default:           return "default";
        }
    }, [status]);

    return <Chip label={status} color={color} />;
}

export default function ConversionDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const { data, status, error } = useConversionDetails(id);
    const conversion = data?.conversion;
    const profile = data?.profile;

    const loading = status === "pending";
    const errorMessage = status === "error" ? ((error as Error)?.message ?? "An unexpected error occurred") : null;

    return (
        <>
            <Head>
                <title>Conversion - {loading ? "Loading..." : conversion?.reference ?? id}</title>
                <meta name="description" content={`Details for conversion ID: ${id}`} />
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

                {conversion && (
                    <Paper style={{ padding: "16px" }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                            <Box display="flex" alignItems="center" columnGap="16px">
                                <Box>
                                    <Typography variant="h4">
                                        {conversion.currency_source} → {conversion.currency_destination}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {conversion.reference ?? conversion.id}
                                    </Typography>
                                </Box>
                                <StatusChip status={conversion.status} />
                            </Box>
                            {profile?.user_id && (
                                <Link href={`/profiles/${profile.user_id}`}>
                                    <Button variant="outlined">View Profile</Button>
                                </Link>
                            )}
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Box className="grid grid-cols-2 gap-6">
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    <strong><em>Conversion Info</em></strong>
                                </Typography>
                                <div className="space-y-2">
                                    <p><strong>Type:</strong> {conversion.type}</p>
                                    <p><strong>Provider:</strong> {conversion.provider}</p>
                                    <p><strong>Rate:</strong> {conversion.rate}</p>
                                    <p><strong>Amount Source:</strong> {formatAmount({
                                        amount: (conversion.amount_source ?? 0) / 100,
                                        currency: conversion.currency_source ?? 'USD',
                                        withDecimals: true,
                                    })}</p>
                                    <p><strong>Amount Destination:</strong> {formatAmount({
                                        amount: (conversion.amount_destination ?? 0) / 100,
                                        currency: conversion.currency_destination ?? 'NGN',
                                        withDecimals: true,
                                    })}</p>
                                    <p><strong>Fee:</strong> {formatAmount({
                                        amount: (conversion.fee ?? 0) / 100,
                                        currency: conversion.currency_source ?? 'USD',
                                        withDecimals: true,
                                    })}</p>
                                </div>
                            </Box>

                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    <strong><em>Reference Info</em></strong>
                                </Typography>
                                <div className="space-y-2">
                                    <p><strong>Reference:</strong> {conversion.reference ?? "—"}</p>
                                    <p><strong>Quote Reference:</strong> {conversion.quote_reference ?? "—"}</p>
                                    <p><strong>Provider Code:</strong> {conversion.provider_code ?? "—"}</p>
                                    <p><strong>Code:</strong> {conversion.code ?? "—"}</p>
                                    <p><strong>Created At:</strong> {conversion.created_at}</p>
                                    <p><strong>Updated At:</strong> {conversion.updated_at}</p>
                                </div>
                            </Box>
                        </Box>
                    </Paper>
                )}
            </Container>
        </>
    );
}
