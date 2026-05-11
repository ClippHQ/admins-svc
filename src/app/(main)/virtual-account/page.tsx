"use client";

import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, Typography, Alert } from "@mui/material";
import { VirtualAccount } from "src/types";
import { useAllVirtualAccounts } from "src/api/transactions";
import { GenericTableGenerator } from "src/components/generic-table-generator";
import { statusQueryOperator } from "src/components/status-query-operator";

export default function VirtualAccountPage() {
    const router = useRouter();
    const [statusFilter, setStatusFilter] = useState<VirtualAccount['status'] | 'all'>('all');
    const [currencyFilter, setCurrencyFilter] = useState<string>('all');
    const [providerFilter, setProviderFilter] = useState<string>('all');
    const infiniteData = useAllVirtualAccounts({ limit: 30, status: statusFilter, currency: currencyFilter, provider: providerFilter });
    const { data: virtualAccounts, error: queryError } = infiniteData;

    const error = queryError ? (queryError as Error).message ?? 'Something went wrong' : null;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
            <Head>
                <title>Virtual Accounts - Kite Admin Dashboard</title>
                <meta
                    name="description"
                    content="Browse and inspect virtual account activity in the Kite admin dashboard."
                />
            </Head>
            <div className="mx-auto max-w-7xl px-4 py-6">
                <div className="grid grid-cols-12 gap-6">
                    <main className="col-span-12 md:col-span-10" style={{ maxHeight: "85vh", width: "75vw" }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <Typography variant="h5" component="h1">
                                    Virtual Accounts Dashboard
                                </Typography>
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Overview of every Virtual Account on Kite
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <Card className="shadow-sm">
                                <CardContent>
                                    {error && (
                                        <Alert severity="error" className="my-4">
                                            {error}
                                        </Alert>
                                    )}

                                    <GenericTableGenerator
                                        data={virtualAccounts}
                                        columnRender={{
                                            created_at: 'datetime',
                                            account_name: 'text',
                                            account_number: 'text',
                                            bank_name: 'text',
                                            currency: 'text',
                                            provider: 'text',
                                            status: 'text',
                                        }}
                                        customFilterOperators={{
                                            status: statusQueryOperator<VirtualAccount, VirtualAccount['status'] | 'all'>(['all', 'pending', 'active', 'suspended', 'failed', 'empty']),
                                            currency: statusQueryOperator<VirtualAccount, string>(['all', 'NGN', 'USD', 'EUR', 'GBP']),
                                            provider: statusQueryOperator<VirtualAccount, string>(['all', 'kwikpay', 'graph', 'noah']),
                                        }}
                                        onFilterChanged={(d) => {
                                            if (d.status) {
                                                setStatusFilter(d.status as VirtualAccount['status'] | 'all');
                                            }
                                            if (d.currency) {
                                                setCurrencyFilter(d.currency as string);
                                            }
                                            if (d.provider) {
                                                setProviderFilter(d.provider as string);
                                            }
                                        }}
                                        filterModel={{
                                            items: [
                                                {
                                                    field: 'status',
                                                    operator: 'status_equals',
                                                    value: 'all'
                                                }
                                            ]
                                        }}
                                        onRowClick={(account) => router.push(`/virtual-account/${account.id}`)}
                                        infiniteQueryResult={infiniteData}
                                        paginationModel={{
                                            page: 0,
                                            pageSize: 30
                                        }}
                                        filterableColumns={['status', 'currency', 'provider']}
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
