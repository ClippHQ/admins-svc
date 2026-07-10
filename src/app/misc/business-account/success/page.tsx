"use client";

import Head from "next/head";
import { Card, CardContent, Typography } from "@mui/material";

export default function BusinessAccountSuccess() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 flex items-center justify-center px-6">
      <Head>
        <title>Business Created - Kite Admin Dashboard</title>
        <meta name="description" content="Business account created successfully." />
      </Head>
      <Card variant="outlined" className="max-w-md w-full">
        <CardContent className="text-center">
          <Typography variant="h6" gutterBottom>
            Business Account Created
          </Typography>
          <Typography variant="body2" color="textSecondary">
            The business account has been submitted successfully.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
