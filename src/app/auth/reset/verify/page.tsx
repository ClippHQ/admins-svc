import Link from "next/link";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function VerifyOtp() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center px-6 py-12">
      <Paper className="w-full max-w-md p-6" elevation={2}>
        <Box className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-sky-600 flex items-center justify-center text-white font-bold">CP</div>
            <div>
              <Typography component="h1" variant="h6">Enter verification code</Typography>
              <Typography variant="body2" color="textSecondary">Enter the one-time code we sent to your email</Typography>
            </div>
          </div>

          <form className="mt-2 flex w-full flex-col gap-4">
            <TextField label="One-time code" name="otp" type="text" required fullWidth />

            <div className="flex items-center justify-between gap-4">
              <Link href="/auth/reset/new">
                <Button variant="contained">Verify OTP</Button>
              </Link>
              <Link href="/auth/reset/request">
                <Button variant="text">Resend</Button>
              </Link>
            </div>
          </form>

          <div className="text-sm text-zinc-600 dark:text-zinc-400">Can&apos;t find the code? You can resend it or contact compliance@company.internal</div>
        </Box>
      </Paper>
    </div>
  );
}
