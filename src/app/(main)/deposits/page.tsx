"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Deposit } from "src/types";
import { useDeposits } from "src/api/deposit";
import { useRouter } from "next/navigation";

export default function DashboardPage() {


  const [page, setPage] = useState(1);
  const router = useRouter()



    const {data: deposits, error: queryError, isLoading, isPending, hasNextPage, fetchNextPage, rawData, isFetchingNextPage} = useDeposits();

    const loading = isLoading || isPending || isFetchingNextPage;

    

  // Modal handler

  const error = queryError ? (queryError as Error).message ?? 'Something went wrong' : null;


  // Collect and handle data for madal
  const handleRowClick = (deposit: Deposit) => {
    router.push(`/deposits/${deposit.id}`)
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
                  Deposit Dashboard
                </Typography>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  Overview of every deposits on Kite
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
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Account Id</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Provider</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Amount</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Currency</TableCell>
                            <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                              Status
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {deposits.length > 0 ? (
                            deposits.map((deposit) => (
                              <TableRow hover
                              key={deposit.id}
                                onClick={() => handleRowClick(deposit)}
                                style={{ cursor: "pointer" }}>
                                <TableCell>{deposit.account_id}</TableCell>
                                <TableCell>{deposit.type}</TableCell>
                                <TableCell>{deposit.provider}</TableCell>
                                <TableCell>{deposit.amount.toLocaleString()}</TableCell>
                                <TableCell>{deposit.currency}</TableCell>
                                <TableCell align="right">{deposit.status}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} align="center">
                                No deposit data available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  <div className="flex justify-center mt-4">
                    <Pagination
                      count={rawData ? rawData.pages[0]?.rows || 1 : 1}
                      page={page}
                      onChange={() => {
                           if(!hasNextPage) return;
                        setPage(page + 1)
                     
                        fetchNextPage()
                      }}
                      color="primary"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

  
    </div>
  );
}