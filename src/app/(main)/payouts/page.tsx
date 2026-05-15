"use client";

import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    Typography,
    Alert,
} from "@mui/material";
import { Payout } from "src/types";
import { formatAmount } from "src/lib/amount";
import { usePayouts } from "src/api/transactions";
import { GenericTableGenerator } from "src/components/generic-table-generator";
import { statusQueryOperator } from "src/components/status-query-operator";

export default function DashboardPage() {
    const router = useRouter();
    const [statusFilter, setStatusFilter] = useState<Payout['status'] | 'all'>('all')
    const infiniteData = usePayouts({ limit: 30, status: statusFilter });
    const { data: payouts, error: queryError } = infiniteData;

    const error = queryError ? (queryError as Error).message ?? 'Something went wrong' : null;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
            <Head>
                <title>Payouts - Kite Admin Dashboard</title>
                <meta
                    name="description"
                    content="Browse and inspect payout activity in the Kite admin dashboard."
                />
            </Head>
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
                                        customFilterOperators={{
                                            status: statusQueryOperator<Payout, Payout['status'] | 'all'>(['all' ,'pending', 'successful', 'failed'])
                                        }}
                                        onFilterChanged={(d) => {
                                            if (d.status) {
                                                setStatusFilter(d.status as Payout['status'] | 'all')
                                            }
                                        }}
                                        filterModel={{
                                            items: [
                                                {
                                                    field: 'status',
                                                    operator: 'status_equals',
                                                    value: 'in_review'

                                                }
                                            ]
                                        }}
                                        onRowClick={(payout) => router.push(`/payouts/${payout.id}`)}
                                        infiniteQueryResult={infiniteData}
                                        paginationModel={{
                                            page: 0,
                                            pageSize: 30
                                        }}
                                        filterableColumns={['status']}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
