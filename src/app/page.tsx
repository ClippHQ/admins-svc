import Link from "next/link";
import Button from "@mui/material/Button";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 font-sans">
      <header className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-sky-600 flex items-center justify-center text-white font-bold">
              CP
            </div>
            <div>
              <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Compliance Portal
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Internal tool — review accounts & deposits</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outlined">
              Sign in
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <section>
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Welcome, Compliance Team</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              This portal helps you review multicurrency account applications and approve large deposits. Use the quick actions to get started.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/auth/signin">
              <Button
                variant="contained"
                startIcon={<FolderOpenIcon />}
                className="capitalize"
              >
                Review Applications
              </Button>
          </Link>
          <Link href="/auth/signin">

              <Button
                variant="outlined"
                startIcon={<AttachMoneyIcon />}
                className="capitalize"
              >
                Review Deposits
              </Button>
                   </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-6 py-6 text-center text-sm text-zinc-500">
        <div>© {new Date().getFullYear()} Company — Internal Use Only</div>
      </footer>
    </div>
  );
}
