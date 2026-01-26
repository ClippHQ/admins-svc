"use client";

import {
  Card,
  CardContent,
  Typography,
  Alert,
  Autocomplete,
  TextField,
} from "@mui/material";
import { Deposit } from "src/types";
import { useDeposits } from "src/api/deposit";
import { useRouter } from "next/navigation";
import { GenericTableGenerator } from "src/components/generic-table-generator";
import { GridFilterInputValueProps, GridFilterOperator } from "@mui/x-data-grid";
import React, { useState } from "react";

function StatusFilterInput(props: GridFilterInputValueProps) {
    const { item, applyValue, focusElementRef } = props;

React.useImperativeHandle(focusElementRef, () => ({
  focus: () => {
    document.getElementById('status-filter-input')?.focus();
  },
}));
  return (
    <Autocomplete
  disablePortal
  onChange={(e, v) => {
    applyValue({ ...item, value: v });
  }}
  options={['pending', 'successful', 'failed', 'rejected', 'in_review', 'all']}
  sx={{  }}
  id="status-filter-input"

  renderInput={(params) => <TextField {...params} label="Status" />}
/>
  )
}

const statusGridFilterOperator: GridFilterOperator<Deposit, string | number | boolean>[] = [{
  label: "Status Equals",
  value: 'status_equals',
  getApplyFilterFn: (filterItem) => {
    if (!filterItem.value || typeof filterItem.value !== 'string') {
      return null;
    }
    return (value) => {
      return String(value).toLowerCase() === String(filterItem.value).toLowerCase();
    }
  },
  InputComponent: StatusFilterInput,
  requiresFilterValue: true,
}]

export default function DashboardPage() {

  const [statusFilter, setStatusFilter] = useState<Deposit['status'] | 'all'>('in_review')
  const router = useRouter()



    const infiniteQueryResult = useDeposits({limit: 30, status: statusFilter});
    const {data: deposits, error: queryError } = infiniteQueryResult;


    

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
          

                  {/* Error */}
                  {error && (
                    <Alert severity="error" className="my-4">
                      {error}
                    </Alert>
                  )}

                  {/* Table */}
                  <GenericTableGenerator
                  data={deposits}
                  columnRender={{
                    amount: 'amount',
                    provider: 'text',
                    status: 'text',
                    created_at: 'datetime',
                    currency: 'text',
                    payer: (value) => {
                      if(value.transaction_object?.payer) {
                        return value.transaction_object.payer.name

                      } else {
                        return value.payer ?? '-'
                      }
                    }
                  }}
                  customFilterOperators={{
                    status: statusGridFilterOperator
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
                  onFilterChanged={(d) => {
                    console.log("ran", d)
                    if(d.status) {
                      setStatusFilter(d.status as Deposit['status'])
                    }
                  }}
                  onRowClick={handleRowClick}
                  infiniteQueryResult={infiniteQueryResult}
                  paginationModel={{
                    page: 0,
                    pageSize: 30
                  }}
                  filterableColumns={['status']}

                  
                  />
            
                  <div className="flex justify-center mt-4">
             
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