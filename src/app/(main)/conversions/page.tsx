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
import { Conversion } from "src/types";
import { formatAmount } from "src/lib/amount";
import { useConversions } from "src/api/transactions";
import { GenericTableGenerator } from "src/components/generic-table-generator";
import { statusQueryOperator } from "src/components/status-query-operator";

const CURRENCIES = ['all', 'USD', 'EUR', 'NGN', 'GBP', 'KES', 'GHS', 'USDT', 'USDC'];

export default function ConversionsPage() {
    const router = useRouter();
    const [filterDict, setFilterDict] = useState<Partial<Record<string, string>>>({});
    const infiniteData = useConversions({ limit: 30, filterDict });
    const { data: conversions, error: queryError } = infiniteData;

    const error = queryError ? (queryError as Error).message ?? 'Something went wrong' : null;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
            <Head>
                <title>Conversions - Kite Admin Dashboard</title>
                <meta
                    name="description"
                    content="Browse and inspect conversion activity in the Kite admin dashboard."
                />
            </Head>
            <div className="mx-auto max-w-7xl px-4 py-6">
                <div className="grid grid-cols-12 gap-6">
                    <main className="col-span-12 md:col-span-10" style={{ maxHeight: "85vh", width: "75vw" }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <Typography variant="h5" component="h1">
                                    Conversions Dashboard
                                </Typography>
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Overview of every Conversion on Kite
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
                                        data={conversions}
                                        columnRender={{
                                            created_at: 'datetime',
                                            currency_source: 'text',
                                            currency_destination: 'text',
                                            amount_source: (value) => formatAmount({
                                                amount: (value.amount_source) / 100,
                                                currency: value.currency_source || 'USD',
                                                withDecimals: true,
                                            }),
                                            amount_destination: (value) => formatAmount({
                                                amount: (value.amount_destination) / 100,
                                                currency: value.currency_destination || 'NGN',
                                                withDecimals: true,
                                            }),
                                            fee: (value) => formatAmount({
                                                amount: (value.fee) / 100,
                                                currency: value.currency_source || 'USD',
                                                withDecimals: true,
                                            }),
                                            rate: 'text',
                                            type: 'text',
                                            status: 'text',
                                        }}
                                        customFilterOperators={{
                                            status: statusQueryOperator<Conversion, string>(['all', 'pending', 'successful', 'failed']),
                                            currency_source: statusQueryOperator<Conversion, string>(CURRENCIES),
                                            currency_destination: statusQueryOperator<Conversion, string>(CURRENCIES),
                                        }}
                                        onFilterChanged={(d) => {
                                            if (d.status || d.currency_source || d.currency_destination) {
                                                setFilterDict({
                                                    status: d.status as string || filterDict.status,
                                                    currency_source: d.currency_source as string || filterDict.currency_source,
                                                    currency_destination: d.currency_destination as string || filterDict.currency_destination,
                                                });
                                            }
                                        }}
                                        filterModel={{
                                            items: [
                                                { field: 'status', operator: 'status_equals', value: 'all' },
                                                { field: 'currency_source', operator: 'status_equals', value: 'all' },
                                                { field: 'currency_destination', operator: 'status_equals', value: 'all' },
                                            ]
                                        }}
                                        onRowClick={(conversion) => router.push(`/conversions/${conversion.id}`)}
                                        infiniteQueryResult={infiniteData}
                                        paginationModel={{ page: 0, pageSize: 30 }}
                                        filterableColumns={['status', 'currency_source', 'currency_destination']}
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
