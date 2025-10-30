import Link from "next/link";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function RequestReset() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center px-6 py-12">
      <Paper className="w-full max-w-md p-6" elevation={2}>
        <Box className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-sky-600 flex items-center justify-center text-white font-bold">CP</div>
            <div>
              <Typography component="h1" variant="h6">Reset your password</Typography>
              <Typography variant="body2" color="textSecondary">We&apos;ll send a one-time code to your email</Typography>
            </div>
          </div>

          <form className="mt-2 flex w-full flex-col gap-4">
            <TextField label="Work Email" name="email" type="email" required fullWidth />

            <div className="flex items-center justify-between gap-4">
              <Link href="/auth/reset/verify">
                <Button variant="contained">Send OTP</Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="text">Back to sign in</Button>
              </Link>
            </div>
          </form>

          <div className="text-sm text-zinc-600 dark:text-zinc-400">If you don&apos;t receive an email, check your spam folder or contact compliance@company.internal</div>
        </Box>
      </Paper>
    </div>
  );
}
