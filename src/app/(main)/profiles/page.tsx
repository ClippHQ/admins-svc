"use client";

import {
  Card,
  CardContent,
  Typography,
  Alert,
} from "@mui/material";
import { Profile } from "src/types";
import { useProfiles } from "src/api/profiles";
import { useRouter } from "next/navigation";
import { GenericTableGenerator } from "src/components/generic-table-generator";

export default function DashboardPage() {

  const router = useRouter()



    const infiniteQueryResult = useProfiles(20);
    const {data: profiles, error: queryError } = infiniteQueryResult;


    

  // Modal handler

  const error = queryError ? (queryError as Error).message ?? 'Something went wrong' : null;


  // Collect and handle data for madal
  const handleRowClick = (profile: Profile) => {
    router.push(`/profiles/${profile.user_id}`)
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
                  Profile Dashboard
                </Typography>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  Overview of every profile on Kite
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
                  data={profiles}
                  columnRender={{
                    name_first: 'text',
                    name_last: 'text',
                    email: 'text',
                    phone_prefix: 'text',
                    phone: 'text',
                    created_at: 'date',
                  }}
                  onRowClick={handleRowClick}
                  infiniteQueryResult={infiniteQueryResult}
                  paginationModel={{
                    page: 0,
                    pageSize: 30
                  }}

                  
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