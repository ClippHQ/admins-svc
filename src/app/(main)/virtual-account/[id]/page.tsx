"use client";

import Head from "next/head";
import { useMemo } from "react";
import * as React from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Paper,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import { useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { useVirtualAccountDetails } from "src/api/transactions";
import { useDeposits } from "src/api/deposit";
import { VirtualAccount } from "src/types";
import { GenericTableGenerator } from "src/components/generic-table-generator";
import { formatAmount } from "src/lib/amount";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel({ children, value, index, ...other }: TabPanelProps) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`va-tabpanel-${index}`}
            aria-labelledby={`va-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `va-tab-${index}`,
        "aria-controls": `va-tabpanel-${index}`,
    };
}

function StatusChip({ status }: { status: VirtualAccount["status"] }) {
    const color = useMemo((): React.ComponentProps<typeof Chip>["color"] => {
        switch (status) {
            case "active":   return "success";
            case "pending":  return "warning";
            case "suspended":
            case "failed":   return "error";
            case "empty":    return "default";
        }
    }, [status]);

    return <Chip label={status} color={color} />;
}

export default function VirtualAccountDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const [tab, setTab] = React.useState(0);

    const { data: response, status, error } = useVirtualAccountDetails(id);
    const account = response?.data?.account;
    const profile = response?.data?.profile;

    const depositsQuery = useDeposits({
        limit: 20,
        filterDict: {
            wallet_id: account?.wallet_id ?? '',
            currency: account?.currency ?? 'all',
        },
    });

    const loading = status === "pending";
    const errorMessage = status === "error" ? (error?.message ?? "An unexpected error occurred") : null;

    return (
        <>
            <Head>
                <title>
                    Virtual Account -{" "}
                    {loading ? "Loading..." : account?.account_name ?? id}
                </title>
                <meta
                    name="description"
                    content={`Details for virtual account ID: ${id}`}
                />
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

                {account && (
                    <Paper style={{ padding: "16px" }}>
                        {/* Header */}
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                            <Box display="flex" alignItems="center" columnGap="16px">
                                <Box>
                                    <Typography variant="h4">
                                        {account.account_name ?? "Virtual Account"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {account.account_number ?? "—"}
                                    </Typography>
                                </Box>
                                <StatusChip status={account.status} />
                            </Box>
                            {profile?.user_id && (
                                <Link href={`/profiles/${profile.user_id}`}>
                                    <Button variant="outlined">View Profile</Button>
                                </Link>
                            )}
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                                <Tab label="Account Details" {...a11yProps(0)} />
                                <Tab
                                    label={`Deposits (${account.currency})`}
                                    {...a11yProps(1)}
                                />
                            </Tabs>
                        </Box>

                        {/* Tab 0 — Account Details */}
                        <CustomTabPanel value={tab} index={0}>
                            <Box display="flex" flexDirection="column" rowGap="24px">
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Account Info
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={4}>
                                            <Typography variant="subtitle2">Account Name</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {account.account_name ?? "—"}
                                            </Typography>
                                        </Grid>
                                        <Grid size={4}>
                                            <Typography variant="subtitle2">Account Number</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {account.account_number ?? "—"}
                                            </Typography>
                                        </Grid>
                                        <Grid size={4}>
                                            <Typography variant="subtitle2">IBAN</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {account.iban ?? "—"}
                                            </Typography>
                                        </Grid>
                                        <Grid size={4}>
                                            <Typography variant="subtitle2">Bank Name</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {account.bank_name ?? "—"}
                                            </Typography>
                                        </Grid>
                                        <Grid size={4}>
                                            <Typography variant="subtitle2">Bank Code</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {account.bank_code ?? "—"}
                                            </Typography>
                                        </Grid>
                                        <Grid size={4}>
                                            <Typography variant="subtitle2">Sort Code</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {account.sort_code ?? "—"}
                                            </Typography>
                                        </Grid>
                                        <Grid size={4}>
                                            <Typography variant="subtitle2">Swift Code</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {account.swift_code ?? "—"}
                                            </Typography>
                                        </Grid>
                                        <Grid size={4}>
                                            <Typography variant="subtitle2">Routing Number</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {account.routing_number ?? "—"}
                                            </Typography>
                                        </Grid>
                                        <Grid size={4}>
                                            <Typography variant="subtitle2">Wire Routing Number</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {account.wire_routing_number ?? "—"}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Divider />

                                {account.status === "failed" && (
                                    <>
                                        <Box>
                                            <Typography variant="h6" gutterBottom color="error">
                                                Failure Details
                                            </Typography>
                                            <Alert severity="error">
                                                {account.provider_status_message ?? "No status message provided by provider."}
                                            </Alert>
                                        </Box>
                                        <Divider />
                                    </>
                                )}

                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Provider Info
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={4}>
                                            <Typography variant="subtitle2">Provider</Typography>
                                            <Typography variant="body1" fontWeight="bold" textTransform="capitalize">
                                                {account.provider}
                                            </Typography>
                                        </Grid>
                                        <Grid size={4}>
                                            <Typography variant="subtitle2">Provider Code</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {account.provider_code ?? "—"}
                                            </Typography>
                                        </Grid>
                                        <Grid size={4}>
                                            <Typography variant="subtitle2">Currency</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {account.currency}
                                            </Typography>
                                        </Grid>
                                        <Grid size={4}>
                                            <Typography variant="subtitle2">Wallet ID</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {account.wallet_id}
                                            </Typography>
                                        </Grid>
                                        <Grid size={4}>
                                            <Typography variant="subtitle2">Created At</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {format(new Date(account.created_at), "dd MMM, yyyy HH:mm")}
                                            </Typography>
                                        </Grid>
                                        <Grid size={4}>
                                            <Typography variant="subtitle2">Updated At</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {format(new Date(account.updated_at), "dd MMM, yyyy HH:mm")}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </CustomTabPanel>

                        {/* Tab 1 — Deposits in same currency */}
                        <CustomTabPanel value={tab} index={1}>
                            <GenericTableGenerator
                                data={depositsQuery.data ?? []}
                                columnRender={{
                                    created_at: "datetime",
                                    currency: "text",
                                    amount: (row) =>
                                        formatAmount({
                                            amount: row.amount / 100,
                                            currency: row.currency ?? account.currency,
                                            withDecimals: true,
                                        }),
                                    fee: (row) =>
                                        formatAmount({
                                            amount: row.fee / 100,
                                            currency: row.currency ?? account.currency,
                                            withDecimals: true,
                                        }),
                                    provider: "text",
                                    status: "text",
                                }}
                                infiniteQueryResult={depositsQuery}
                                paginationModel={{ page: 0, pageSize: 20 }}
                            />
                        </CustomTabPanel>
                    </Paper>
                )}
            </Container>
        </>
    );
}
