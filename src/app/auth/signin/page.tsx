"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import apiClient from "../../../pages/services/apiService" 
import { API_ENDPOINTS } from "../../../pages/services/endpointDefinition";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 👇 Call your backend login endpoint
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      const access_token = response.data.data.token;

      if (access_token) {
        // ✅ Store token (used by interceptor)
        localStorage.setItem("token", access_token);

        // ✅ Redirect to main dashboard
        router.push("/dashboard");
      } else {
        setError("Login failed: No access token returned.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.data?.message || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md p-6">
        <Box className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-sky-600 flex items-center justify-center text-white font-bold">
              KITE
            </div>
            <div>
              <Typography component="h1" variant="h6" className="text-zinc-600 dark:text-zinc-50">
                Kite Administrators' Portal
              </Typography>
              <Typography variant="body2" className="text-zinc-600 dark:text-zinc-400">
                Sign in to continue
              </Typography>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-2 flex w-full flex-col gap-4">
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />

            {error && <Typography color="error">{error}</Typography>}

            <div className="flex items-center justify-between gap-4">
              <Button type="submit" variant="contained" disabled={loading} fullWidth>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
              <Link href="/">
                <Button variant="text">Back</Button>
              </Link>
            </div>
          </form>

          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            If you don&apos;t have access, contact <a href="mailto:kite@support.co">support</a>
          </div>
        </Box>
      </div>
    </div>
  );
}