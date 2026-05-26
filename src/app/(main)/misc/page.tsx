"use client";

import Head from "next/head";
import {
    Card,
    CardContent,
    LinearProgress,
    Paper,
    Typography,
} from "@mui/material";
import { useConversionsToNGN, useRecentlyApprovedAmounts, useWalletBalances } from "src/api/misc";
import { formatAmount } from "src/lib/amount";

function SectionCard({ label, amount, currency }: { label: string; amount: number; currency: string }) {
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography sx={{ color: 'text.secondary', fontSize: 13 }} gutterBottom>
                    {label}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                    {formatAmount({ amount: amount / 100, currency, withDecimals: true })}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>{currency}</Typography>
            </CardContent>
        </Card>
    );
}

function Section({ title, loading, children }: { title: string; loading: boolean; children: React.ReactNode }) {
    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>{title}</Typography>
            {loading ? <LinearProgress /> : (
                <div className="flex flex-row flex-wrap gap-3 mt-2">
                    {children}
                </div>
            )}
        </Paper>
    );
}

export default function MiscPage() {
    const { data: approvedAmounts, status: approvedStatus } = useRecentlyApprovedAmounts();
    const { data: conversionsToNGN, status: conversionsStatus } = useConversionsToNGN();
    const { data: walletBalances, status: walletStatus } = useWalletBalances();

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
            <Head>
                <title>Misc - Kite Admin Dashboard</title>
                <meta name="description" content="Miscellaneous financial summaries for Kite admin." />
            </Head>
            <div className="mx-auto max-w-7xl px-4 py-6">
                <div className="grid grid-cols-12 gap-6">
                    <main className="col-span-12 md:col-span-10">
                        <Typography variant="h5" component="h1" gutterBottom>
                            Misc
                        </Typography>
                        <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
                            Financial summaries across deposits, conversions and wallet balances
                        </div>

                        <div className="flex flex-col gap-6">
                            <Section title="Recently Approved Amounts" loading={approvedStatus === 'pending'}>
                                {approvedAmounts?.map((item) => (
                                    <SectionCard
                                        key={item.currency}
                                        label="Approved"
                                        amount={item.amount}
                                        currency={item.currency}
                                    />
                                ))}
                            </Section>

                            <Section title="Conversions to NGN (Last 24h)" loading={conversionsStatus === 'pending'}>
                                {conversionsToNGN && (
                                    <SectionCard
                                        label="Total Converted"
                                        amount={conversionsToNGN.total_converted_amount}
                                        currency="NGN"
                                    />
                                )}
                            </Section>

                            <Section title="Wallet Balances" loading={walletStatus === 'pending'}>
                                {walletBalances?.map((item) => (
                                    <SectionCard
                                        key={item.currency}
                                        label="Balance"
                                        amount={item.total_balance}
                                        currency={item.currency}
                                    />
                                ))}
                            </Section>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
