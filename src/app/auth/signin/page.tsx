import Link from "next/link";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function SignIn() {

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center px-6 py-12">
      <div className="w-full  max-w-md p-6">
        <Box className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-sky-600 flex items-center justify-center text-white font-bold">CP</div>
            <div>
              <Typography component="h1" variant="h6" className="text-zinc-600 dark:text-zinc-50">Compliance Portal</Typography>
              <Typography variant="body2" className="text-zinc-600 dark:text-zinc-400" >Sign in to continue</Typography>
            </div>
          </div>

          <form className="mt-2 flex w-full flex-col gap-4">
            <TextField
              label="Email"
              name="email"
              type="email"
              className="text-zinc-600 dark:text-zinc-400"
              
              required
              fullWidth
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              required
              fullWidth
            />

            <div className="flex items-center justify-between gap-4">
              <Link href="/">
                <Button variant="contained">Sign in</Button>
              </Link>
              <Link href="/">
                <Button variant="text">Back</Button>
              </Link>
            </div>
          </form>

          <div className="text-sm text-zinc-600 dark:text-zinc-400">If you don&apos;t have access, contact compliance@company.internal</div>
        </Box>
      </div>
    </div>
  );
}
